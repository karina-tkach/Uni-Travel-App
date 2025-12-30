package org.uni.unitravel.places.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.uni.unitravel.places.model.PlaceOffer;

@Component
public class PlacesMapper {
    private PlacesMapper() {
    }
    public PlaceOffer toObject(JsonNode json, String category) {
        return new PlaceOffer(null, json.get("name").asText(), json.get("address").asText(), category,
                json.get("type").asText(),
                json.get("rating").asDouble(), json.get("photo").asText(),
                json.get("location_link").asText());
    }
}
