package org.uni.unitravel.grouptrip.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.uni.unitravel.grouptrip.dto.GroupTripDto;
import org.uni.unitravel.grouptrip.service.GroupTripService;
import org.uni.unitravel.security.SecurityUserDetails;
import org.uni.unitravel.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/group-trips")
@RequiredArgsConstructor
public class GroupTripController {
    private final GroupTripService service;
    private final UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<GroupTripDto>> search(@RequestParam(defaultValue = "1") int pageNumber) {
        return ResponseEntity.ok(service.getAll(pageNumber));
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<GroupTripDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<GroupTripDto> create(
            @RequestBody GroupTripDto offer,
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.createGroupTrip(offer, userService.getUserById(user.getUserId())));
    }

    @GetMapping("/my-trips")
    public ResponseEntity<List<GroupTripDto>> getAllMyOffers(
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.getAllByCreator(userService.getUserById(user.getUserId())));
    }

    @GetMapping("/my-joined-trips")
    public ResponseEntity<List<GroupTripDto>> getAllMyJoinedTrips(
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.getAllByParticipant(userService.getUserById(user.getUserId())));
    }

    @PutMapping("/add-participant")
    public ResponseEntity<GroupTripDto> addParticipant(
            @RequestBody GroupTripDto offer,
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.addParticipant(offer, userService.getUserById(user.getUserId())));
    }

    @PutMapping("delete-participant")
    public ResponseEntity<GroupTripDto> deleteParticipant(
            @RequestBody GroupTripDto offer,
            @AuthenticationPrincipal SecurityUserDetails user) {
        return ResponseEntity.ok(service.deleteParticipant(offer, userService.getUserById(user.getUserId())));
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@RequestParam("id") long id,
                                    @AuthenticationPrincipal SecurityUserDetails user) {
        service.delete(id, userService.getUserById(user.getUserId()));
        return ResponseEntity.noContent().build();
    }
}
