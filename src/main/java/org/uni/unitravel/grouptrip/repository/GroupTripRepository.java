package org.uni.unitravel.grouptrip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.uni.unitravel.grouptrip.model.GroupTrip;
import org.uni.unitravel.user.User;

import java.util.List;

@Repository
public interface GroupTripRepository extends JpaRepository<GroupTrip, Long> {
    List<GroupTrip> findByCreatedBy(User user);
    List<GroupTrip> findByParticipantsContaining(User user);
}

