package org.uni.unitravel.housing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.uni.unitravel.housing.model.HousingDetail;

import java.util.Optional;

public interface HousingDetailRepository
        extends JpaRepository<HousingDetail, Long> {
    @Query("SELECT h FROM HousingDetail h WHERE h.housingId = :housingId AND h.provider = :provider")
    Optional<HousingDetail> findByHousingIdAndProvider(
            @Param("housingId") Long housingId,
            @Param("provider") String provider
    );
}

