package org.uni.unitravel.housing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uni.unitravel.housing.dto.HousingDetailDto;
import org.uni.unitravel.housing.dto.HousingSearchRequest;
import org.uni.unitravel.housing.service.HousingService;
import org.uni.unitravel.integration.housing.RegionInfoBookingApi;

import java.util.Map;

@RestController
@RequestMapping("/api/housing")
public class HousingController {

    private final HousingService housingService;

    public HousingController(HousingService housingService) {
        this.housingService = housingService;
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody HousingSearchRequest req, @RequestParam(defaultValue = "1") int pageNumber) throws Exception {

        RegionInfoBookingApi region = RegionInfoBookingApi.fromUkrainian(req.getRegion());

        if (region == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "code", 400,
                            "message", "Невідомий регіон: " + req.getRegion()
                    ));
        }

        req.setDestId(region.getDestId());
        req.setCoordinates(region.getCoordinates());

        if(req.getDestId() == null) {
            req.setSearchType("coordinates");
        }
        else {
            req.setSearchType("region");
        }

        return ResponseEntity.ok(housingService.search(req, pageNumber));
    }

    @PostMapping("/searchHotel")
    public ResponseEntity<HousingDetailDto> searchHotel(@RequestBody HousingSearchRequest req) throws Exception {
        return ResponseEntity.ok(housingService.searchHotel(req));
    }
}

