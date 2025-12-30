package org.uni.unitravel.integration.places;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.uni.unitravel.places.dto.PlacesSearchRequest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Component
public class PlacesApiClient {
    @Value("${outscraper.key}")
    private String apiKey;

    public List<JsonNode> search(PlacesSearchRequest req, int pageNumber) throws IOException, InterruptedException {
        String category = req.getPlaceType().equals("FOOD") ? "харчування" : "розваги";

        HashMap<String, Object> parameters = new HashMap<>() {{
            put("query", category + " " + req.getCity());
            put("skipPlaces", pageNumber * 20);
            put("limit", 20);
            put("language", "uk");
            put("region", "UA");
            put("async", false);
        }};

        List<NameValuePair> parametersList = new ArrayList<NameValuePair>(parameters.size());
        for (HashMap.Entry<String, Object> entry : parameters.entrySet()) {
            parametersList.add(new BasicNameValuePair(entry.getKey(), String.valueOf(entry.getValue())));
        }

        String url = "https://api.outscraper.cloud/google-maps-search" + "?" + URLEncodedUtils.format(parametersList, "utf-8");

        JsonNode root = getRootNode(url);
        System.out.println(root);
        JsonNode dataNode = root.path("data");
        List<JsonNode> places = new ArrayList<>();
        if (dataNode.isArray() && dataNode.get(0).isArray()) {
            dataNode.get(0).forEach(places::add);
        }

        return places;
    }

    private JsonNode getRootNode(String url) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("X-API-KEY", apiKey)
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(response.body());
    }
}


