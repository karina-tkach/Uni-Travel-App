package org.uni.unitravel.places.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.uni.unitravel.places.dto.PlacesSearchRequest;
import org.uni.unitravel.places.model.PlaceOffer;
import org.uni.unitravel.places.service.PlacesService;
import org.uni.unitravel.security.SecurityUserDetails;
import org.uni.unitravel.user.service.UserService;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/places")
public class PlacesController {
    private final PlacesService placesService;
    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    public PlacesController(PlacesService placesService, UserService userService) {
        this.placesService = placesService;
        this.userService = userService;
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody PlacesSearchRequest req, @RequestParam(defaultValue = "1") int pageNumber) throws Exception {
        return ResponseEntity.ok(placesService.search(req, pageNumber));
    }

    @GetMapping("/images/proxy")
    public ResponseEntity<byte[]> proxy(@RequestParam String url) {
        byte[] image = restTemplate.getForObject(url, byte[].class);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
                .body(image);
    }

    @PostMapping("/manage_saving")
    public ResponseEntity<?> create(
            @RequestBody PlaceOffer offer,
            @AuthenticationPrincipal SecurityUserDetails user) {
        placesService.manageSaving(offer, userService.getUserById(user.getUserId()));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my_savings")
    public ResponseEntity<List<PlaceOffer>> find(
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(placesService.getSavedPlacesByUserId(user.getUserId()));
    }
}
