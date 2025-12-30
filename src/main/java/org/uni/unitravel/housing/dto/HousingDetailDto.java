package org.uni.unitravel.housing.dto;

import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HousingDetailDto extends HousingItemDto {
    private String hotelName;
    private List<String> photos;
    private String description;
    private String url;
    private String fullAddress;

    public HousingDetailDto(Long id, String label, String provider, double price, String checkIn,
                            String checkOut, String imageUrl, double reviewScore, String city,
                            String hotelName, List<String> photos, String description, String url,
                            String fullAddress) {
        super(id, label, provider, price, checkIn, checkOut, imageUrl, reviewScore, city);
        this.hotelName = hotelName;
        this.photos = photos;
        this.description = description;
        this.url = url;
        this.fullAddress = fullAddress;
    }
}