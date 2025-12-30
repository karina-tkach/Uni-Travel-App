package org.uni.unitravel.user.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.uni.unitravel.config.GoogleConfig;
import org.uni.unitravel.security.SecurityUserDetails;
import org.uni.unitravel.user.Role;
import org.uni.unitravel.user.User;
import org.uni.unitravel.user.controller.dto.LoginRequest;
import org.uni.unitravel.user.controller.dto.RegisterRequest;
import org.uni.unitravel.user.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserAuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final GoogleConfig googleConfig;

    public UserAuthController(AuthenticationManager authenticationManager, UserService userService,
                              GoogleConfig googleConfig) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.googleConfig = googleConfig;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = httpRequest.getSession();
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            return ResponseEntity.ok(Map.of(
                    "message", "Логін успішний"
            ));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Неправильні облікові дані"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletRequest servletRequest) {
        if (userService.getUserByEmail(req.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Пошта вже використовується"));
        }

        User user = new User();
        user.setName(req.getName());
        user.setSurname(req.getSurname());
        user.setPassword(req.getPassword());
        user.setEmail(req.getEmail());
        user.setRole(Role.VISITOR);

        User created = userService.addUser(user);

        SecurityUserDetails details = new SecurityUserDetails(created);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                details, null, details.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        servletRequest.getSession().setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Реєєстрація успішна"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            return new ResponseEntity<>("Unauthorized: Користувач не аутентифікований", HttpStatus.UNAUTHORIZED);
        }

        request.getSession().removeAttribute("SPRING_SECURITY_CONTEXT");
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Успішно здійснено вихід з аккаунту"));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();

        Map<String, Object> response = new HashMap<>();

        if (isAuthenticated) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof SecurityUserDetails user) {
                User userDb = userService.getUserById(user.getUserId());

                response.put("username", userDb.getEmail());
                response.put("firstName", userDb.getName());
                response.put("lastName", userDb.getSurname());
                response.put("roles", user.getRole().toString());
            }

            response.put("roles", authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList());

        } else {
            response.put("username", null);
            response.put("roles", List.of());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body,
                                             HttpServletRequest request) {
        String token = body.get("token");

        if (token == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Токен відсутній"));
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
            )
                    .setAudience(List.of(googleConfig.getClientId()))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Неправильний Google токен"));
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("given_name");
            String surname = (String) payload.get("family_name");

            if (name.isBlank()) {
                name = "Google User";
            }
            if (surname.isBlank()) {
                surname = "Google User";
            }

            User user = userService.getUserByEmail(email);

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setSurname(surname);
                user.setPassword("GOOGLEuser1!");
                user.setRole(Role.VISITOR);

                user = userService.addUser(user);
            }

            SecurityUserDetails details = new SecurityUserDetails(user);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(auth);
            request.getSession().setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Google login successful",
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "name", user.getName(),
                            "surname", user.getSurname(),
                            "role", user.getRole()
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Помилка серверу"));
        }
    }


}