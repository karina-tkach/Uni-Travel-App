package org.uni.unitravel.housing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HousingSearchRequest {
    private Long hotelId;
    private String region;
    private String searchType;
    private List<Double> coordinates; // optional
    private Long destId; // optional
    private String checkIn;
    private String checkOut;
    private String filterType;
}
