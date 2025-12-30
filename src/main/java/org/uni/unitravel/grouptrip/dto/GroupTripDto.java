package org.uni.unitravel.grouptrip.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uni.unitravel.housing.dto.HousingDetailDto;
import org.uni.unitravel.places.model.PlaceOffer;
import org.uni.unitravel.transport.model.TransportOffer;
import org.uni.unitravel.user.UserDto;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupTripDto {
    private Long id;
    private String name;
    private String description;
    private String entertainmentType;
    private Integer maxParticipants;
    private String mainImageUrl;
    private TransportOffer transportOffer;
    private HousingDetailDto housingDetail;
    private Set<PlaceOffer> placeOffers;
    private Set<UserDto> participants;
    private UserDto createdBy;
}
