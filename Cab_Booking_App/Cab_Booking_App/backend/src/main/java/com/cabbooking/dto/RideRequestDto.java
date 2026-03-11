package com.cabbooking.dto;

import lombok.Data;

@Data
public class RideRequestDto {
    private String pickupLocation;
    private String dropLocation;
    private Double pickupLat;
    private Double pickupLng;
    private Double dropLat;
    private Double dropLng;
}
