package org.uni.unitravel.grouptrip.model;

import jakarta.persistence.*;
import lombok.*;
import org.uni.unitravel.housing.model.HousingDetail;
import org.uni.unitravel.places.model.PlaceOffer;
import org.uni.unitravel.transport.model.TransportOffer;
import org.uni.unitravel.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "group_trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, name="entertainment_type")
    private String entertainmentType;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Column(nullable = false, name="main_image_url")
    private String mainImageUrl;

    /* -------- REQUIRED: 1 TRANSPORT -------- */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transport_offer_id", nullable = false)
    private TransportOffer transportOffer;

    /* -------- REQUIRED: 1 HOUSING -------- */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "housing_detail_id", nullable = false)
    private HousingDetail housingDetail;

    /* -------- MANY PLACES -------- */
    @ManyToMany
    @JoinTable(
            name = "group_trip_places",
            joinColumns = @JoinColumn(name = "group_trip_id"),
            inverseJoinColumns = @JoinColumn(name = "place_offer_id")
    )
    private Set<PlaceOffer> placeOffers = new HashSet<>();

    /* -------- USERS -------- */
    @ManyToMany
    @JoinTable(
            name = "group_trip_users",
            joinColumns = @JoinColumn(name = "group_trip_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> participants = new HashSet<>();

    /* -------- CREATOR -------- */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}

