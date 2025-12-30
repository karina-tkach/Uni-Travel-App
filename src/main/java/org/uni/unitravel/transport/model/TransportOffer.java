package org.uni.unitravel.transport.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uni.unitravel.partner.model.Partner;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transport_offers")
public class TransportOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "point_a")
    private String pointA;
    @Column(nullable = false, name = "point_b")
    private String pointB;
    @Column(nullable = false, name = "travel_date")
    private LocalDate travelDate;

    @Column(nullable = false, name = "transport_type")
    private String transportType;
    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;
    @Column(name = "old_price")
    private BigDecimal oldPrice;

    @Column(nullable = false)
    private Double rating;
    @Column(nullable = false, name = "available_seats")
    private Integer availableSeats;

    @Column(nullable = false, name = "image_url")
    private String imageUrl;
    @Column(nullable = false, name = "booking_url")
    private String bookingUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner;
}

