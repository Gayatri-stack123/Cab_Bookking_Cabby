package com.cabbooking.service;

import com.cabbooking.entity.Payment;
import com.cabbooking.entity.Ride;
import com.cabbooking.repository.PaymentRepository;
import com.cabbooking.repository.RideRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public String createPaymentIntent(Long rideId) throws Exception {
        Ride ride = rideRepository.findById(rideId).orElseThrow();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (ride.getFare() * 100))
                .setCurrency("usd")
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);

            Payment payment = Payment.builder()
                    .ride(ride)
                    .amount(ride.getFare())
                    .paymentStatus("PENDING")
                    .stripePaymentId(intent.getId())
                    .build();

            paymentRepository.save(payment);

            return intent.getClientSecret();
        } catch (Exception e) {
            log.error("Stripe payment intent creation failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public void confirmPayment(Long rideId, String method) {
        Ride ride = rideRepository.findById(rideId).orElseThrow();
        
        Payment payment = paymentRepository.findByRide(ride)
                .orElse(Payment.builder()
                        .ride(ride)
                        .amount(ride.getFare())
                        .build());
        
        payment.setPaymentStatus("SUCCESS");
        if (payment.getStripePaymentId() == null && "PHONEPE".equals(method)) {
            payment.setStripePaymentId("PP-" + UUID.randomUUID().toString().substring(0, 8));
        }
        
        paymentRepository.save(payment);
        
        // Update ride status to COMPLETED via a separate service call or directly
        ride.setStatus(com.cabbooking.entity.RideStatus.COMPLETED);
        rideRepository.save(ride);
    }

    public String initiatePhonePePayment(Long rideId) {
        Ride ride = rideRepository.findById(rideId).orElseThrow();
        // Simulate a PhonePe transaction ID or redirect URL
        return "https://merch-ui.phonepe.com/trans-sim/" + UUID.randomUUID().toString();
    }
}
