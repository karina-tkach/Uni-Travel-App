package org.uni.unitravel.housing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HousingItemDto {
    private long id;
    private String label;
    private String provider; // BOOKING / HOTELS
    private double price;
    private String checkIn;
    private String checkOut;
    private String imageUrl;
    private double reviewScore;
    private String city;
}
