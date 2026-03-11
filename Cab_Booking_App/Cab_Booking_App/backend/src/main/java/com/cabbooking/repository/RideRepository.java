package com.cabbooking.repository;

import com.cabbooking.entity.Driver;
import com.cabbooking.entity.Ride;
import com.cabbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByRider(User rider);
    List<Ride> findByDriver(Driver driver);
    List<Ride> findByStatus(com.cabbooking.entity.RideStatus status);
}
