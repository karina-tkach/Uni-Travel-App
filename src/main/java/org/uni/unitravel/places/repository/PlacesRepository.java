package org.uni.unitravel.places.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.uni.unitravel.places.model.PlaceOffer;

public interface PlacesRepository
        extends JpaRepository<PlaceOffer, Long> {
    Page<PlaceOffer> findByCategoryAndFullAddressContainingIgnoreCase(
            String category,
            String fullAddress,
            Pageable pageable);
}
