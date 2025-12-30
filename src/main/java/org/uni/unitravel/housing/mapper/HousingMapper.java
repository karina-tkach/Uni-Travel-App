package org.uni.unitravel.housing.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.uni.unitravel.housing.dto.HousingDetailDto;
import org.uni.unitravel.housing.dto.HousingItemDto;
import org.uni.unitravel.housing.dto.HousingSearchRequest;
import org.uni.unitravel.housing.model.HousingDetail;

import java.util.List;

@Component
public class HousingMapper {

    public HousingItemDto toDto(HousingSearchRequest req, JsonNode apiNode, String provider) {
        if (req.getSearchType().equals("region")) {
            return new HousingItemDto(apiNode.get("hotel_id").asLong(),
                    apiNode.get("accessibilityLabel").asText().split("\\.")[0], provider, apiNode.get("property").get("priceBreakdown").get("grossPrice").get("value").asDouble(),
                    apiNode.get("property").get("checkinDate").asText(), apiNode.get("property").get("checkoutDate").asText(),
                    apiNode.get("property").get("photoUrls").get(0).asText(), apiNode.get("property").get("reviewScore").asDouble(),
                    apiNode.get("property").get("wishlistName").asText());
        }
        return new HousingItemDto(apiNode.get("hotel_id").asLong(),
                apiNode.get("hotel_name").asText(), provider, apiNode.get("composite_price_breakdown").get("gross_amount").get("value").asDouble(),
                req.getCheckIn(), req.getCheckOut(),
                apiNode.get("main_photo_url").asText(), apiNode.get("review_score").asDouble(),
                apiNode.get("default_wishlist_name").asText());
    }

    public HousingDetailDto toDetailDto(HousingSearchRequest req, JsonNode apiNode, String provider,
                                        String description, List<String> photos) {
        return new HousingDetailDto(apiNode.get("hotel_id").asLong(),
                apiNode.get("hotel_name").asText(), provider, apiNode.get("composite_price_breakdown").get("gross_amount").get("value").asDouble(),
                req.getCheckIn(), req.getCheckOut(),
                photos.get(0), apiNode.get("rawData").get("reviewScore").asDouble(),
                apiNode.get("city_trans").asText(),
                apiNode.get("hotel_name").asText(), photos,
                description, apiNode.get("url").asText() + "?lang=uk", apiNode.get("address") + ", " +
                apiNode.get("city_trans").asText() + ", " + apiNode.get("zip").asText() + ", " +
                apiNode.get("country_trans").asText());
    }

    public HousingDetailDto detailToDto(HousingDetail e) {
        return new HousingDetailDto(
                e.getHousingId(),
                e.getHotelName(),
                e.getProvider(),
                e.getPrice(),
                e.getCheckIn(),
                e.getCheckOut(),
                e.getImageUrl(),
                e.getReviewScore(),
                e.getCity(),
                e.getHotelName(),
                e.getPhotos(),
                e.getDescription(),
                e.getUrl(),
                e.getFullAddress()
        );
    }

}

