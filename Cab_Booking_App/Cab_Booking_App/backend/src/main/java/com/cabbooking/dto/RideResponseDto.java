package com.cabbooking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RideResponseDto {
    private Long id;
    private String riderName;
    private String pickupLocation;
    private String dropLocation;
    private Double fare;
    private Double distance;
    private String status;
}
