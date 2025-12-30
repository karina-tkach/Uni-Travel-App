package org.uni.unitravel.places.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlacesSearchRequest {
    private String placeType;
    private String city;
}
