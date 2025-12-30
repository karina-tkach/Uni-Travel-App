package org.uni.unitravel.partner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uni.unitravel.partner.model.Partner;

import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Long> {

    Optional<Partner> findByUserId(Integer userId);
}
