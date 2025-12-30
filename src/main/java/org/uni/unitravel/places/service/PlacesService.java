package org.uni.unitravel.places.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uni.unitravel.integration.places.PlacesApiClient;
import org.uni.unitravel.places.dto.PlacesSearchRequest;
import org.uni.unitravel.places.mapper.PlacesMapper;
import org.uni.unitravel.places.model.PlaceOffer;
import org.uni.unitravel.places.model.UserSavedPlace;
import org.uni.unitravel.places.repository.PlacesRepository;
import org.uni.unitravel.places.repository.UserSavedPlaceRepository;
import org.uni.unitravel.user.User;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlacesService {
    private final PlacesApiClient placesApiClient;
    private final PlacesMapper placesMapper;
    private final PlacesRepository placesRepository;
    private final UserSavedPlaceRepository userSavedPlaceRepository;

    public PlacesService(PlacesApiClient placesApiClient, PlacesMapper placesMapper,
                         PlacesRepository placesRepository,
                         UserSavedPlaceRepository userSavedPlaceRepository) {
        this.placesApiClient = placesApiClient;
        this.placesMapper = placesMapper;
        this.placesRepository = placesRepository;
        this.userSavedPlaceRepository = userSavedPlaceRepository;
    }

    public List<PlaceOffer> search(PlacesSearchRequest request, int pageNumber) {
        try {
            Pageable pageable = PageRequest.of(pageNumber - 1, 20);
            Page<PlaceOffer> cached = placesRepository.findByCategoryAndFullAddressContainingIgnoreCase(
                    request.getPlaceType(), request.getCity(), pageable);

            if (!cached.getContent().isEmpty()) {
                return new ArrayList<>(cached.getContent());
            }

            List<JsonNode> apiResults = placesApiClient.search(request, pageNumber - 1);
            List<PlaceOffer> results = new ArrayList<>();
            for (JsonNode node : apiResults) {
                results.add(placesMapper.toObject(node, request.getPlaceType()));
            }

            return placesRepository.saveAll(results);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void manageSaving(PlaceOffer place, User user) {
        try {
            boolean exists = userSavedPlaceRepository.existsByUserIdAndPlaceId(user.getId(), place.getId());

            if(exists) {
                userSavedPlaceRepository.deleteByUserIdAndPlaceId(user.getId(), place.getId());
            }
            else {
                UserSavedPlace saved = new UserSavedPlace();
                saved.setUser(user);
                saved.setPlace(place);
                userSavedPlaceRepository.save(saved);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<PlaceOffer> getSavedPlacesByUserId(Integer userId) {
        try {
            List<UserSavedPlace> saved = userSavedPlaceRepository.findByUserId(userId);
            return saved.stream().map(UserSavedPlace::getPlace)
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<PlaceOffer> getAllByIds(List<Long> ids) {
        return placesRepository.findAllById(ids);
    }
}
