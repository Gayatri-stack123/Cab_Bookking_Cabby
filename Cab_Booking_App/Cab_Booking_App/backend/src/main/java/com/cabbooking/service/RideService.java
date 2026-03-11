package com.cabbooking.service;

import com.cabbooking.dto.RideRequestDto;
import com.cabbooking.dto.RideResponseDto;
import com.cabbooking.entity.*;
import com.cabbooking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    public RideResponseDto bookRide(RideRequestDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User rider = userRepository.findByEmail(email).orElseThrow();

        double distance;
        if (request.getPickupLat() != null && request.getPickupLng() != null
                && request.getDropLat() != null && request.getDropLng() != null) {
            distance = haversineDistance(
                    request.getPickupLat(), request.getPickupLng(),
                    request.getDropLat(), request.getDropLng());
        } else {
            distance = Math.random() * 10;
        }
        double fare = Math.round(distance * 20 * 100.0) / 100.0;

        Ride ride = Ride.builder()
                .rider(rider)
                .pickupLocation(request.getPickupLocation())
                .dropLocation(request.getDropLocation())
                .distance(distance)
                .fare(fare)
                .status(RideStatus.REQUESTED)
                .build();

        Ride savedRide = rideRepository.save(ride);
        return mapToResponse(savedRide);
    }

    public RideResponseDto acceptRide(Long rideId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Driver driver = driverRepository.findByUser(user).orElseThrow();

        Ride ride = rideRepository.findById(rideId).orElseThrow();
        ride.setDriver(driver);
        ride.setStatus(RideStatus.ACCEPTED);

        return mapToResponse(rideRepository.save(ride));
    }

    public java.util.List<RideResponseDto> getRequestedRides() {
        java.util.List<Ride> requestedRides = rideRepository.findByStatus(RideStatus.REQUESTED);
        System.out.println("DEBUG: Found " + requestedRides.size() + " requested rides.");
        return requestedRides
                .stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<RideResponseDto> getRiderHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User rider = userRepository.findByEmail(email).orElseThrow();
        return rideRepository.findByRider(rider)
                .stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<RideResponseDto> getDriverHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Driver driver = driverRepository.findByUser(user).orElseThrow();
        return rideRepository.findByDriver(driver)
                .stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Haversine formula — returns straight-line distance in km between two coordinates.
     * The frontend OSRM route distance is used for the fare estimate; this value is stored
     * as the crow-flies fallback when coordinates are provided without a pre-calculated route.
     */
    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100.0) / 100.0;
    }

    public RideResponseDto completeRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId).orElseThrow();
        ride.setStatus(RideStatus.COMPLETED);
        return mapToResponse(rideRepository.save(ride));
    }

    private RideResponseDto mapToResponse(Ride ride) {
        return RideResponseDto.builder()
                .id(ride.getId())
                .riderName(ride.getRider().getName())
                .pickupLocation(ride.getPickupLocation())
                .dropLocation(ride.getDropLocation())
                .fare(ride.getFare())
                .distance(ride.getDistance())
                .status(ride.getStatus().name())
                .build();
    }
}
