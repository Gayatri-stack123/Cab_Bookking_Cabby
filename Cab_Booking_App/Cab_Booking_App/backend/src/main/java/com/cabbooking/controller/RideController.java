package com.cabbooking.controller;

import com.cabbooking.dto.RideRequestDto;
import com.cabbooking.dto.RideResponseDto;
import com.cabbooking.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/book")
    public ResponseEntity<RideResponseDto> bookRide(@RequestBody RideRequestDto request) {
        return ResponseEntity.ok(rideService.bookRide(request));
    }

    @PutMapping("/accept/{id}")
    public ResponseEntity<RideResponseDto> acceptRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.acceptRide(id));
    }

    @GetMapping("/requests")
    public ResponseEntity<java.util.List<RideResponseDto>> getRequestedRides() {
        return ResponseEntity.ok(rideService.getRequestedRides());
    }

    @GetMapping("/history/rider")
    public ResponseEntity<java.util.List<RideResponseDto>> getRiderHistory() {
        return ResponseEntity.ok(rideService.getRiderHistory());
    }

    @GetMapping("/history/driver")
    public ResponseEntity<java.util.List<RideResponseDto>> getDriverHistory() {
        return ResponseEntity.ok(rideService.getDriverHistory());
    }
}
