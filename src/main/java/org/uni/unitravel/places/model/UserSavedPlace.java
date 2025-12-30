package org.uni.unitravel.places.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uni.unitravel.user.User;

@Entity
@Table(
        name = "user_saved_places",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "place_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSavedPlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "place_id", nullable = false)
    private PlaceOffer place;
}

