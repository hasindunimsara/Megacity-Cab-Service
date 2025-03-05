package com.megacity.cab.service;

import com.megacity.cab.dto.PaymentRequest;
import com.megacity.cab.dto.PaymentResponse;
import com.megacity.cab.model.Booking;
import com.megacity.cab.model.Payment;
import com.megacity.cab.model.User;
import com.megacity.cab.repository.BookingRepository;
import com.megacity.cab.repository.PaymentRepository;
import com.megacity.cab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public PaymentResponse makePayment(PaymentRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByBookingNumber(request.getBookingNumber())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getTotalAmount() == null) {
            throw new RuntimeException("Bill not calculated for this booking");
        }

        // Mock payment logic: Simulate success/failure
        String status = "COMPLETED"; // For simplicity; could randomize or check card details
        Payment payment = Payment.builder()
                .booking(booking)
                .user(user)
                .amount(booking.getTotalAmount())
                .paymentDate(LocalDateTime.now())
                .status(status)
                .build();

        payment = paymentRepository.save(payment);
        return mapToResponse(payment);
    }

    public List<PaymentResponse> getUserPayments() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = ((com.megacity.cab.security.service.UserDetailsImpl) userDetails).getId();
        return paymentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingNumber(payment.getBooking().getBookingNumber())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .build();
    }
}