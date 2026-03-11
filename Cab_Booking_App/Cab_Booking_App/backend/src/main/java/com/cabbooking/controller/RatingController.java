package com.cabbooking.controller;

import com.cabbooking.dto.RatingRequestDto;
import com.cabbooking.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitRating(@RequestBody RatingRequestDto request) {
        ratingService.submitRating(request);
        return ResponseEntity.ok("Rating submitted successfully");
    }

    @RequestMapping(value = "/ping", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Rating Controller Active - Version 2");
    }
}
