package org.uni.unitravel.grouptrip.mapper;

import org.springframework.stereotype.Component;
import org.uni.unitravel.grouptrip.dto.GroupTripDto;
import org.uni.unitravel.grouptrip.model.GroupTrip;
import org.uni.unitravel.housing.dto.HousingDetailDto;
import org.uni.unitravel.housing.model.HousingDetail;
import org.uni.unitravel.user.User;
import org.uni.unitravel.user.UserDto;

import java.util.HashSet;
import java.util.stream.Collectors;

@Component
public class GroupTripMapper {
    private GroupTripMapper() {
    }

    public GroupTripDto toDto(GroupTrip trip) {
        User creator = trip.getCreatedBy();
        HousingDetail housing = trip.getHousingDetail();
        return new GroupTripDto(trip.getId(), trip.getName(), trip.getDescription(),
                trip.getEntertainmentType(), trip.getMaxParticipants(),
                trip.getMainImageUrl(), trip.getTransportOffer(),
                new HousingDetailDto(housing.getId(), housing.getHotelName() ,housing.getProvider(), housing.getPrice(),
                        housing.getCheckIn(), housing.getCheckOut(), housing.getImageUrl(),
                        housing.getReviewScore(), housing.getCity(), housing.getHotelName(),
                        housing.getPhotos(), housing.getDescription(), housing.getUrl(), housing.getFullAddress()), trip.getPlaceOffers(),
                trip.getParticipants() == null ? new HashSet<>() : trip.getParticipants().stream()
                        .map(u -> new UserDto(
                                u.getId(),
                                u.getName(),
                                u.getSurname(),
                                u.getEmail()
                        ))
                        .collect(Collectors.toSet()), new UserDto(creator.getId(), creator.getName(),
                creator.getSurname(), creator.getEmail()));
    }
}
