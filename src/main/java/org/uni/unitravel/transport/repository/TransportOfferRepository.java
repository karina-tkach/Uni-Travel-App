package org.uni.unitravel.transport.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.uni.unitravel.transport.model.TransportOffer;

import java.time.LocalDate;
import java.util.List;

public interface TransportOfferRepository
        extends JpaRepository<TransportOffer, Long> {

    Page<TransportOffer> findByPointAAndPointBAndTravelDate(
            String pointA,
            String pointB,
            LocalDate travelDate,
            Pageable pageable);

    Page<TransportOffer> findByPointAAndPointB(
            String pointA,
            String pointB,
            Pageable pageable
    );

    List<TransportOffer> findByPartnerId(Long partnerId);
}

