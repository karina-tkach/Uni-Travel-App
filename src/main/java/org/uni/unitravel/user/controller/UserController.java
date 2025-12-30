package org.uni.unitravel.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.uni.unitravel.partner.model.Partner;
import org.uni.unitravel.partner.service.PartnerService;
import org.uni.unitravel.security.SecurityUserDetails;
import org.uni.unitravel.user.Role;
import org.uni.unitravel.user.User;
import org.uni.unitravel.user.controller.dto.AddUserRequest;
import org.uni.unitravel.user.controller.dto.UpdateUserRequest;
import org.uni.unitravel.user.controller.dto.UserPartnerDto;
import org.uni.unitravel.user.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final PartnerService partnerService;

    public UserController(UserService userService, PartnerService partnerService) {
        this.userService = userService;
        this.partnerService = partnerService;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/by-role")
    public ResponseEntity<List<UserPartnerDto>> getUsersByRole(@RequestParam("role") Role role) {
        if (role != Role.PARTNER) {
            List<User> users = userService.getUsersByRole(role);
            List<UserPartnerDto> dtos = users.stream()
                    .map(UserPartnerDto::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        }
        else {
            List<Partner> partners = partnerService.getAllPartners();
            List<UserPartnerDto> dtos = partners.stream()
                    .map(UserPartnerDto::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(
            @AuthenticationPrincipal SecurityUserDetails curUser,
            @RequestBody UpdateUserRequest request) {
        User updated = null;
        User user = new User(curUser.getUserId(), request.getName(), request.getSurname(), request.getPassword(), request.getEmail(), curUser.getRole());

        if (request.getPassword() == null || request.getPassword().isBlank()) {
           updated = userService.updateUserWithoutPasswordChangeById(user,user.getId());
        }
        else {
            updated = userService.updateUserById(user,user.getId());
        }
        updated.setPassword(null);

        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody AddUserRequest request) {
        User createdUser = userService.addUser(new User(null, request.getName(), request.getSurname(), request.getPassword(), request.getEmail(), request.getRole()));
        if (request.getRole() == Role.PARTNER) {
            try {
                partnerService.addPartner(new Partner(null, createdUser, request.getServiceName(), request.getServiceUrl()));
            }
            catch (Exception e) {
                userService.deleteUserById(createdUser.getId());
                throw e;
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<?> deleteUser(@RequestParam("id") int id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
