package org.uni.unitravel.grouptrip.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uni.unitravel.grouptrip.dto.GroupTripDto;
import org.uni.unitravel.grouptrip.mapper.GroupTripMapper;
import org.uni.unitravel.grouptrip.model.GroupTrip;
import org.uni.unitravel.grouptrip.repository.GroupTripRepository;
import org.uni.unitravel.housing.model.HousingDetail;
import org.uni.unitravel.housing.service.HousingService;
import org.uni.unitravel.places.model.PlaceOffer;
import org.uni.unitravel.places.service.PlacesService;
import org.uni.unitravel.transport.model.TransportOffer;
import org.uni.unitravel.transport.service.TransportService;
import org.uni.unitravel.user.User;

import java.util.*;

@Service
public class GroupTripService {
    private final GroupTripRepository groupTripRepository;
    private final TransportService transportService;
    private final HousingService housingService;
    private final PlacesService placesService;
    private final GroupTripMapper groupTripMapper;

    public GroupTripService(GroupTripRepository groupTripRepository,
                            TransportService transportService,
                            HousingService housingService,
                            PlacesService placesService,
                            GroupTripMapper groupTripMapper) {
        this.groupTripRepository = groupTripRepository;
        this.transportService = transportService;
        this.housingService = housingService;
        this.placesService = placesService;
        this.groupTripMapper = groupTripMapper;
    }

    @Transactional
    public GroupTripDto createGroupTrip(
            GroupTripDto dto,
            User creator
    ) {
        TransportOffer transport = transportService.getById(dto.getTransportOffer().getId());
        HousingDetail housing = housingService.getById(dto.getHousingDetail().getId());

        if (transport == null || housing == null) {
            throw new RuntimeException("Transport or housing not found");
        }

        Set<PlaceOffer> places = new HashSet<>(placesService.getAllByIds(dto.getPlaceOffers().stream()
                .map(PlaceOffer::getId)
                .toList()));

        GroupTrip trip = GroupTrip.builder()
                .name(transport.getPointA() + " - " + transport.getPointB())
                .description(dto.getDescription())
                .entertainmentType(dto.getEntertainmentType())
                .maxParticipants(dto.getMaxParticipants())
                .mainImageUrl((dto.getMainImageUrl() == null || dto.getMainImageUrl().isBlank()) ?
                        "https://academy.wetravel.com/hs-fs/hubfs/Imported_Blog_Media/Group-Travel-2-Sep-14-2023-01-52-51-9147-PM.jpg"
                        : dto.getMainImageUrl())
                .transportOffer(transport)
                .housingDetail(housing)
                .placeOffers(places)
                .createdBy(creator)
                .build();


        GroupTrip saved = groupTripRepository.save(trip);
        return getById(saved.getId());
    }


    public GroupTripDto getById(Long id) {
        GroupTrip trip = groupTripRepository.findById(id)
                .orElse(null);

        if (trip != null) {
            return groupTripMapper.toDto(trip);
        }

        return null;
    }

    public List<GroupTripDto> getAll(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber-1, 20);
        List<GroupTrip> all = groupTripRepository
                .findAll(
                        pageable
                ).getContent();


        return all.stream()
                .map(groupTripMapper::toDto)
                .toList();
    }

    @Transactional
    public GroupTripDto addParticipant(GroupTripDto trip, User currentUser) {
        Optional<GroupTrip> oldOffer = null;
        if (trip.getId() != null) {
            oldOffer = groupTripRepository.findById(trip.getId());
            if (oldOffer.isEmpty() || Objects.equals(oldOffer.get().getCreatedBy().getId(), currentUser.getId())
            || oldOffer.get().getParticipants().stream()
                    .anyMatch(u -> u.getId().equals(currentUser.getId()))) {
                throw new RuntimeException("Неможливо повторно додати користувача");
            }
        }
        else {
            throw new RuntimeException("Пропозиція не знайдена");
        }

        if (oldOffer.get().getParticipants().size() >= oldOffer.get().getMaxParticipants()) {
            throw new RuntimeException("Максимальна кількість користувачів");
        }

        oldOffer.get().getParticipants().add(currentUser);

        return getById(oldOffer.get().getId());
    }

    @Transactional
    public GroupTripDto deleteParticipant(GroupTripDto trip, User currentUser) {
        Optional<GroupTrip> oldOffer = null;
        if (trip.getId() != null) {
            oldOffer = groupTripRepository.findById(trip.getId());
            if (oldOffer.isEmpty()
                    || oldOffer.get().getParticipants().stream()
                    .noneMatch(u -> u.getId().equals(currentUser.getId()))) {
                throw new RuntimeException("Неможливо знайти користувача");
            }
        }
        else {
            throw new RuntimeException("Пропозиція не знайдена");
        }

        oldOffer.get().getParticipants().removeIf(
                u -> u.getId().equals(currentUser.getId())
        );

        return getById(oldOffer.get().getId());
    }

    public List<GroupTripDto> getAllByCreator(User user) {
        List<GroupTrip> all = groupTripRepository.findByCreatedBy(user);
        return all.stream()
                .map(groupTripMapper::toDto)
                .toList();
    }

    public List<GroupTripDto> getAllByParticipant(User user) {
        List<GroupTrip> all = groupTripRepository.findByParticipantsContaining(user);
        return all.stream()
                .map(groupTripMapper::toDto)
                .toList();
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Optional<GroupTrip> oldOffer = null;
        if(id != null) {
            oldOffer = groupTripRepository.findById(id);
            if (oldOffer.isEmpty() || !Objects.equals(oldOffer.get().getCreatedBy().getId(), currentUser.getId())) {
                throw new RuntimeException("Пропозиція не знайдена");
            }
        }
        else {
            throw new RuntimeException("Пропозиція не знайдена");
        }

        groupTripRepository.deleteById(id);
    }
}
