package org.uni.unitravel.transport.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.uni.unitravel.partner.repository.PartnerRepository;
import org.uni.unitravel.transport.dto.TransportSearchRequest;
import org.uni.unitravel.transport.model.TransportOffer;
import org.uni.unitravel.transport.repository.TransportOfferRepository;
import org.uni.unitravel.user.Role;
import org.uni.unitravel.user.User;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportOfferRepository repository;
    private final PartnerRepository partnerRepository;

    public List<TransportOffer> search(TransportSearchRequest request, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber-1, 20);

        if (request.getTravelDate() != null) {
            return repository
                    .findByPointAAndPointBAndTravelDate(
                            request.getPointA(),
                            request.getPointB(),
                            request.getTravelDate(),
                            pageable
                    ).getContent();
        }
        else {
            return repository
                    .findByPointAAndPointB(
                            request.getPointA(),
                            request.getPointB(),
                            pageable
                    ).getContent();
        }
    }

    public TransportOffer getById(Long id) {
        return repository.findById(id)
                .orElse(null);
    }

    public TransportOffer create(TransportOffer offer, User currentUser) {
        offer.setId(null);
        if (currentUser.getRole() != Role.PARTNER) {
            throw new RuntimeException("Тільки партнери можуть публікувати пропозиції");
        }
        offer.setPartner(partnerRepository.findByUserId(currentUser.getId()).orElse(null));
        return repository.save(offer);
    }
    
    public TransportOffer update(TransportOffer offer, User currentUser) {
        Optional<TransportOffer> oldOffer = null;
        if(offer.getId() != null) {
             oldOffer = repository.findById(offer.getId());
            if (oldOffer.isEmpty() || !Objects.equals(oldOffer.get().getPartner().getUser().getId(), currentUser.getId())) {
                throw new RuntimeException("Пропозиція не знайдена");
            }
        }
        else {
            throw new RuntimeException("Пропозиція не знайдена");
        }
        
        if (currentUser.getRole() != Role.PARTNER) {
            throw new RuntimeException("Тільки партнери можуть публікувати пропозиції");
        }
        offer.setPartner(partnerRepository.findByUserId(currentUser.getId()).orElse(null));
        return repository.save(offer);
    }
    
    public void delete(Long id, User currentUser) {
        Optional<TransportOffer> oldOffer = null;
        if(id != null) {
            oldOffer = repository.findById(id);
            if (oldOffer.isEmpty() || !Objects.equals(oldOffer.get().getPartner().getUser().getId(), currentUser.getId())) {
                throw new RuntimeException("Пропозиція не знайдена");
            }
        }
        else {
            throw new RuntimeException("Пропозиція не знайдена");
        }

        if (currentUser.getRole() != Role.PARTNER) {
            throw new RuntimeException("Тільки партнери можуть публікувати пропозиції");
        }

        repository.deleteById(id);
    }

    public List<TransportOffer> getAllOffersByPartnerId(Long id) {
        return repository.findByPartnerId(id);
    }
    
}
