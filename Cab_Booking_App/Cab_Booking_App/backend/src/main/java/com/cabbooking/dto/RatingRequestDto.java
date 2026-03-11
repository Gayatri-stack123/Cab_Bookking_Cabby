package com.cabbooking.dto;

import lombok.Data;

@Data
public class RatingRequestDto {
    private Long rideId;
    private Integer rating;
    private String comment;
}
