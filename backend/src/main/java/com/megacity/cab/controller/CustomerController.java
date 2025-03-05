package com.megacity.cab.controller;

import com.megacity.cab.dto.*;
import com.megacity.cab.service.BookingService;
import com.megacity.cab.service.CarService;
import com.megacity.cab.service.DriverService;
import com.megacity.cab.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CustomerController {

    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final CarService carService;
    private final DriverService driverService;

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> addBooking(@Valid @RequestBody BookingRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        request.setCustomerName(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.addBooking(request));
    }

    @GetMapping("/bookings/{bookingNumber}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String bookingNumber) {
        BookingResponse booking = bookingService.getBooking(bookingNumber);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!booking.getCustomerName().equals(userDetails.getUsername())) {
            throw new RuntimeException("You can only view your own bookings");
        }
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingHistory() {
        return ResponseEntity.ok(bookingService.getUserBookings());
    }

    @DeleteMapping("/bookings/{bookingNumber}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingNumber) {
        BookingResponse booking = bookingService.getBooking(bookingNumber);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!booking.getCustomerName().equals(userDetails.getUsername())) {
            throw new RuntimeException("You can only cancel your own bookings");
        }
        bookingService.cancelBooking(bookingNumber);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/payments")
    public ResponseEntity<PaymentResponse> makePayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.makePayment(request));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {
        return ResponseEntity.ok(paymentService.getUserPayments());
    }

    @GetMapping("/help")
    public ResponseEntity<String> getHelp() {
        return ResponseEntity.ok("Customer Help: Use /customer endpoints to book rides and make payments.");
    }

    @GetMapping("/cars")
    public ResponseEntity<List<CarResponse>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }
}