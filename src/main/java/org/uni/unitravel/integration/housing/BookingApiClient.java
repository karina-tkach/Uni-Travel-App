package org.uni.unitravel.integration.housing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.uni.unitravel.housing.dto.HousingSearchRequest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Component
public class BookingApiClient {

    @Value("${rapidapi.key}")
    private String apiKey;

    public List<JsonNode> search(HousingSearchRequest req, int pageNumber) throws Exception {
        String url;
        if (req.getSearchType().equals("coordinates")) {
            url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates?latitude=" +
                    + req.getCoordinates().get(0) + "&longitude=" + req.getCoordinates().get(1) + "&arrival_date=" +
                    req.getCheckIn() + "&departure_date=" + req.getCheckOut() +
                    "&radius=10&adults=1&room_qty=1&units=metric&page_number=" + pageNumber + "&temperature_unit=c&languagecode=uk&currency_code=UAH";
        }
        else {
            url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=" +
                    req.getDestId() + "&search_type=" + req.getSearchType() + "&arrival_date=" +
                    req.getCheckIn() + "&departure_date=" + req.getCheckOut() +
                    "&adults=1&room_qty=1&units=metric&page_number=" + pageNumber + "&temperature_unit=c&languagecode=uk&currency_code=UAH";
        }

        JsonNode root = getRootNode(url);
        JsonNode hotelsNode = req.getSearchType().equals("region") ? root.path("data").path("hotels")
                : root.path("data").path("result");

        List<JsonNode> hotels = new ArrayList<>();
        if (hotelsNode.isArray()) {
            hotelsNode.forEach(hotels::add);
        }

        return hotels;
    }

    public JsonNode searchHotel(HousingSearchRequest req) throws Exception {
        String url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails?hotel_id=" + req.getHotelId() + "&arrival_date="
                + req.getCheckIn() + "&departure_date=" + req.getCheckOut() +
                "&adults=1&room_qty=1&units=metric&temperature_unit=c&languagecode=uk&currency_code=UAH";
        return getRootNode(url).path("data");
    }

    public String searchHotelDescription(Long hotelId) throws Exception {
        String url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/getDescriptionAndInfo?hotel_id=" +
                hotelId + "&languagecode=uk";
        JsonNode dataNode = getRootNode(url).path("data");

        if (!dataNode.isArray()) {
            return null;
        }

        for (JsonNode node : dataNode) {
            if (node.path("descriptiontype_id").asInt() == 6) {
                return node.path("description").asText();
            }
        }

        return "";
    }

    public List<String> searchHotelPhotos(Long hotelId) throws Exception {
        String url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelPhotos?hotel_id=" +
                hotelId;
        JsonNode root = getRootNode(url);

        List<String> urls = new ArrayList<>();

        JsonNode dataNode = root.path("data");

        if (dataNode.isArray()) {
            for (JsonNode photoNode : dataNode) {
                String photoUrl = photoNode.path("url").asText(null);
                if (photoUrl != null) {
                    urls.add(photoUrl);
                }
            }
        }

        return urls;
    }

    private JsonNode getRootNode(String url) throws java.io.IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("x-rapidapi-key", apiKey)
                .header("x-rapidapi-host", "booking-com15.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(response.body());
    }
}

