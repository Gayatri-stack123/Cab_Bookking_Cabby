package com.cabbooking.repository;

import com.cabbooking.entity.Driver;
import com.cabbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser(User user);
}
