package org.uni.unitravel.housing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uni.unitravel.housing.dto.HousingDetailDto;
import org.uni.unitravel.housing.dto.HousingItemDto;
import org.uni.unitravel.housing.dto.HousingSearchRequest;
import org.uni.unitravel.housing.mapper.HousingMapper;
import org.uni.unitravel.housing.model.HousingCache;
import org.uni.unitravel.housing.model.HousingDetail;
import org.uni.unitravel.housing.repository.HousingCacheRepository;
import org.uni.unitravel.housing.repository.HousingDetailRepository;
import org.uni.unitravel.integration.housing.BookingApiClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HousingService {

    private final BookingApiClient bookingClient;
    private final HousingMapper mapper;
    private final HousingCacheRepository cacheRepo;
    private final ObjectMapper objectMapper;
    private final HousingDetailRepository housingDetailRepo;
    private final HousingDetailCacheService detailCacheService;

    @PersistenceContext
    private EntityManager em;

    public HousingService(
            BookingApiClient bookingClient,
            HousingMapper mapper,
            HousingCacheRepository cacheRepo,
            ObjectMapper objectMapper,
            HousingDetailRepository housingDetailRepo,
            HousingDetailCacheService detailCacheService
    ) {
        this.bookingClient = bookingClient;
        this.mapper = mapper;
        this.cacheRepo = cacheRepo;
        this.objectMapper = objectMapper;
        this.housingDetailRepo = housingDetailRepo;
        this.detailCacheService = detailCacheService;
    }

    @Transactional
    public List<HousingItemDto> search(HousingSearchRequest req, int pageNumber) throws Exception {

        String cacheKey = buildCacheKey(req);

        Optional<String> cachedPayload = cacheRepo.findFirstByCacheKeyAndPageNumber(
                        cacheKey, pageNumber)
                .map(HousingCache::getPayload);

        if (cachedPayload.isPresent()) {
            List<HousingItemDto> cachedResults = new ArrayList<>();
            JsonNode nodes = objectMapper.readTree(cachedPayload.get());
            for (JsonNode node : nodes) {
                cachedResults.add(mapper.toDto(req, node, "BOOKING"));
            }
            return cachedResults;
        }

        List<JsonNode> apiResults = bookingClient.search(req, pageNumber);
        List<HousingItemDto> results = new ArrayList<>();
        for (JsonNode node : apiResults) {
            HousingItemDto dto = mapper.toDto(req, node, "BOOKING");
            results.add(dto);

            HousingSearchRequest detailReq = new HousingSearchRequest(dto.getId(),
                    null, null, null, null,
                    req.getCheckIn(),
                    req.getCheckOut(), null);

            detailCacheService.cacheHotelDetailAsync(detailReq);
        }


        String payloadJson = objectMapper.writeValueAsString(apiResults);
        em.createNativeQuery(
                        "INSERT INTO housing_cache(cache_key, page_number, provider, payload) " +
                                "VALUES (?, ?, ?, CAST(? AS jsonb))"
                )
                .setParameter(1, cacheKey)
                .setParameter(2, pageNumber)
                .setParameter(3, "BOOKING")
                .setParameter(4, payloadJson)
                .executeUpdate();


        return results;
    }

    @Transactional
    @Scheduled(cron = "0 0 */6 * * *")
    public void clearCache() {
        System.out.println("Clearing housing cache...");
        cacheRepo.deleteAll();
        System.out.println("Housing cache cleared.");
    }

    public HousingDetailDto searchHotel(HousingSearchRequest req) throws Exception {

        Optional<HousingDetail> cached = housingDetailRepo.findByHousingIdAndProvider(
                req.getHotelId().longValue(), "BOOKING");


        if (cached.isPresent()) {
            return mapper.detailToDto(cached.get());
        }

        JsonNode apiResult = bookingClient.searchHotel(req);
        String description = bookingClient.searchHotelDescription(req.getHotelId());
        List<String> photoUrls = bookingClient.searchHotelPhotos(req.getHotelId());

        HousingDetailDto result = mapper.toDetailDto(req, apiResult, "BOOKING", description, photoUrls);


        housingDetailRepo.save(new HousingDetail(null, result.getId(), result.getProvider(), result.getHotelName(),
                result.getPrice(), result.getCheckIn(), result.getCheckOut(), result.getImageUrl(),
                result.getReviewScore(), result.getCity(), result.getDescription(), result.getUrl(),
                result.getFullAddress(), result.getPhotos()));


        return result;
    }

    public HousingDetail getById(Long id) {
        return housingDetailRepo.findByHousingIdAndProvider(id, "BOOKING")
                .orElse(null);
    }


    private String buildCacheKey(HousingSearchRequest req) {
        return String.join("|",
                req.getSearchType(),
                String.valueOf(req.getDestId()),
                String.valueOf(req.getCoordinates()),
                req.getRegion(),
                req.getCheckIn(),
                req.getCheckOut()
        );
    }

}
