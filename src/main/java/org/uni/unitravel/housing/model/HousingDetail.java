package org.uni.unitravel.housing.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "housing_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HousingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "housing_id", nullable = false)
    private Long housingId;

    @Column(nullable = false)
    private String provider;

    @Column(name = "hotel_name", nullable = false)
    private String hotelName;

    @Column(nullable = false)
    private double price;

    @Column(name = "check_in", nullable = false)
    private String checkIn;

    @Column(name = "check_out", nullable = false)
    private String checkOut;

    @Column(name = "image_url",  nullable = false)
    private String imageUrl;

    @Column(name = "review_score", nullable = false)
    private double reviewScore;

    @Column(nullable = false)
    private String city;

    private String description;

    @Column(nullable = false)
    private String url;

    @Column(name = "full_address", nullable = false)
    private String fullAddress;

    @Column(columnDefinition = "jsonb", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> photos;
}

