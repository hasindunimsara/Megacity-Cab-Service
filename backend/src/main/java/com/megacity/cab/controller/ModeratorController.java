package com.megacity.cab.controller;

import com.megacity.cab.dto.*;
import com.megacity.cab.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/moderator")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MODERATOR')")
public class ModeratorController {

    private final BookingService bookingService;

    // Add a new booking
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> addBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.addBooking(request));
    }

    // View booking details by booking number
    @GetMapping("/bookings/{bookingNumber}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.getBooking(bookingNumber));
    }

    // View all bookings
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Calculate and print bill
    @GetMapping("/bookings/{bookingNumber}/bill")
    public ResponseEntity<BigDecimal> calculateBill(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.calculateBill(bookingNumber));
    }

    // Help section
    @GetMapping("/help")
    public ResponseEntity<String> getHelp() {
        return ResponseEntity.ok("CSA Help: Use /csa endpoints to manage customer bookings and bills.");
    }
}