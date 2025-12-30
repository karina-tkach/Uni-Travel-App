package org.uni.unitravel.transport.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.uni.unitravel.partner.model.Partner;
import org.uni.unitravel.partner.service.PartnerService;
import org.uni.unitravel.security.SecurityUserDetails;
import org.uni.unitravel.transport.dto.TransportSearchRequest;
import org.uni.unitravel.transport.model.TransportOffer;
import org.uni.unitravel.transport.service.TransportService;
import org.uni.unitravel.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/transport")
@RequiredArgsConstructor
public class TransportController {

    private final TransportService service;
    private final PartnerService partnerService;
    private final UserService userService;

    @PostMapping("/search")
    public ResponseEntity<?> search(
            @RequestBody TransportSearchRequest request, @RequestParam(defaultValue = "1") int pageNumber) {
        return ResponseEntity.ok(service.search(request, pageNumber));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportOffer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PARTNER')")
    public ResponseEntity<TransportOffer> create(
            @RequestBody TransportOffer offer,
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.create(offer, userService.getUserById(user.getUserId())));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PARTNER')")
    public ResponseEntity<List<TransportOffer>> getAllMyOffers(
            @AuthenticationPrincipal SecurityUserDetails user) {
        Partner partner = partnerService.getPartnerByUserId(user.getUserId());
        return ResponseEntity.ok(service.getAllOffersByPartnerId(partner.getId()));
    }

    @PutMapping
    @PreAuthorize("hasAuthority('PARTNER')")
    public ResponseEntity<TransportOffer> update(
            @RequestBody TransportOffer offer,
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.update(offer, userService.getUserById(user.getUserId())));
    }

    @DeleteMapping
    @PreAuthorize("hasAuthority('PARTNER')")
    public ResponseEntity<?> delete(@RequestParam("id") long id,
            @AuthenticationPrincipal SecurityUserDetails user) {
        service.delete(id, userService.getUserById(user.getUserId()));
        return ResponseEntity.noContent().build();
    }
}

