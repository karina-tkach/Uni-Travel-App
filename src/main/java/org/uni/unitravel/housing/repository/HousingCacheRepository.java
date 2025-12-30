package org.uni.unitravel.housing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.uni.unitravel.housing.model.HousingCache;

import java.util.Optional;

@Repository
public interface HousingCacheRepository extends JpaRepository<HousingCache, Long> {

    Optional<HousingCache> findFirstByCacheKeyAndPageNumber(
            String cacheKey,
            int pageNumber
    );
}

