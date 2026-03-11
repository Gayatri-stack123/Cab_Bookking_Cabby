package com.cabbooking.controller;

import com.cabbooking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/confirm/{rideId}")
    public ResponseEntity<String> confirmPayment(@PathVariable Long rideId, @RequestParam String method) {
        paymentService.confirmPayment(rideId, method);
        return ResponseEntity.ok("Payment confirmed and ride completed");
    }

    @PostMapping("/phonepe/initiate/{rideId}")
    public ResponseEntity<String> initiatePhonePe(@PathVariable Long rideId) {
        return ResponseEntity.ok(paymentService.initiatePhonePePayment(rideId));
    }
}
