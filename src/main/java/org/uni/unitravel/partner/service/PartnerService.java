package org.uni.unitravel.partner.service;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.uni.unitravel.exception.validation.UserValidationException;
import org.uni.unitravel.partner.model.Partner;
import org.uni.unitravel.partner.repository.PartnerRepository;

import java.util.List;

@Service
public class PartnerService {
    private final PartnerRepository partnerRepository;
    public PartnerService(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    public Partner addPartner(Partner partner) {
        try {
            partner.setId(null);
            if (partnerRepository.findByUserId(partner.getUser().getId()).isPresent()) {
                throw new UserValidationException("Партнер вже існує");
            }
            else if(partner.getServiceName() == null || partner.getServiceName().isBlank() ||
                    partner.getServiceUrl() == null || partner.getServiceUrl().isBlank()) {
                throw new UserValidationException("Назва сервісу та посилання мають бути присутніми");
            }

            return partnerRepository.save(partner);

        } catch (UserValidationException | DataAccessException exception) {
            throw exception;
        }
    }

    public List<Partner> getAllPartners() {
        try {
            return partnerRepository.findAll();
        }
        catch (DataAccessException exception) {
            throw exception;
        }
    }

    public Partner getPartnerByUserId(Integer id) {
        return partnerRepository.findByUserId(id)
                .orElse(null);
    }
}
