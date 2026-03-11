package com.cabbooking.repository;

import com.cabbooking.entity.Payment;
import com.cabbooking.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRide(Ride ride);
}
