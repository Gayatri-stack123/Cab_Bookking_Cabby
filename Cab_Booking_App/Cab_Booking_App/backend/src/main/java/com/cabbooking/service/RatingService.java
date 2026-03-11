package com.cabbooking.service;

import com.cabbooking.dto.RatingRequestDto;
import com.cabbooking.entity.Driver;
import com.cabbooking.entity.Rating;
import com.cabbooking.entity.Ride;
import com.cabbooking.entity.User;
import com.cabbooking.repository.DriverRepository;
import com.cabbooking.repository.RatingRepository;
import com.cabbooking.repository.RideRepository;
import com.cabbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    @Transactional
    public void submitRating(RatingRequestDto request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User rider = userRepository.findByEmail(email).orElseThrow();
            Ride ride = rideRepository.findById(request.getRideId()).orElseThrow();
            Driver driver = ride.getDriver();

            if (driver == null) {
                throw new RuntimeException("Cannot rate a ride without a driver");
            }

            Rating rating = Rating.builder()
                    .ride(ride)
                    .rider(rider)
                    .driver(driver)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();

            ratingRepository.save(rating);

            // Update driver's average rating
            List<Rating> driverRatings = ratingRepository.findByDriver(driver);
            double averageRating = driverRatings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0.0);

            driver.setRating(averageRating);
            driverRepository.save(driver);
        } catch (Exception e) {
            log.error("Rating submission failed: {}", e.getMessage(), e);
            throw e;
        }
    }
}
