package org.uni.unitravel.places.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uni.unitravel.places.model.UserSavedPlace;

import java.util.List;

public interface UserSavedPlaceRepository
        extends JpaRepository<UserSavedPlace, Long> {

    List<UserSavedPlace> findByUserId(Integer userId);

    boolean existsByUserIdAndPlaceId(Integer userId, Long placeId);

    void deleteByUserIdAndPlaceId(Integer userId, Long placeId);
}

