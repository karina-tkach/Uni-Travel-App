package org.uni.unitravel.housing.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uni.unitravel.housing.dto.HousingDetailDto;
import org.uni.unitravel.housing.dto.HousingSearchRequest;
import org.uni.unitravel.housing.mapper.HousingMapper;
import org.uni.unitravel.housing.model.HousingDetail;
import org.uni.unitravel.housing.repository.HousingDetailRepository;
import org.uni.unitravel.integration.housing.BookingApiClient;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HousingDetailCacheService {

    private final HousingDetailRepository housingDetailRepo;
    private final BookingApiClient bookingClient;
    private final HousingMapper mapper;

    @Async
    @Transactional
    public void cacheHotelDetailAsync(HousingSearchRequest req) {
        try {
            Optional<HousingDetail> cached = housingDetailRepo.findByHousingIdAndProvider(
                    req.getHotelId().longValue(), "BOOKING");


            if (cached.isPresent()) {
                return;
            }

            JsonNode apiResult = bookingClient.searchHotel(req);
            String description = bookingClient.searchHotelDescription(req.getHotelId());
            List<String> photoUrls = bookingClient.searchHotelPhotos(req.getHotelId());

            HousingDetailDto result = mapper.toDetailDto(req, apiResult, "BOOKING", description, photoUrls);


            housingDetailRepo.save(new HousingDetail(null, result.getId(), result.getProvider(), result.getHotelName(),
                    result.getPrice(), result.getCheckIn(), result.getCheckOut(), result.getImageUrl(),
                    result.getReviewScore(), result.getCity(), result.getDescription(), result.getUrl(),
                    result.getFullAddress(), result.getPhotos()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

