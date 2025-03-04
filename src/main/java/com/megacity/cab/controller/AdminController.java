package com.megacity.cab.controller;

import com.megacity.cab.dto.*;
import com.megacity.cab.service.BookingService;
import com.megacity.cab.service.CarService;
import com.megacity.cab.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BookingService bookingService;
    private final CarService carService;
    private final DriverService driverService;

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

    // Edit a booking
    @PutMapping("/bookings/{bookingNumber}")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable String bookingNumber,
                                                         @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(bookingNumber, request));
    }

    // Calculate and print bill
    @GetMapping("/bookings/{bookingNumber}/bill")
    public ResponseEntity<BigDecimal> calculateBill(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.calculateBill(bookingNumber));
    }

    // Add a new car
    @PostMapping("/cars")
    public ResponseEntity<CarResponse> addCar(@Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.addCar(request));
    }

    // View all cars
    @GetMapping("/cars")
    public ResponseEntity<List<CarResponse>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    // Add a new driver
    @PostMapping("/drivers")
    public ResponseEntity<DriverResponse> addDriver(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.addDriver(request));
    }

    // View all drivers
    @GetMapping("/drivers")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // Register new customer (handled via /auth/signup in AuthController)

    // Help section
    @GetMapping("/help")
    public ResponseEntity<String> getHelp() {
        return ResponseEntity.ok("Admin Help: Use /admin endpoints to manage bookings, cars, and drivers.");
    }

    // Logout is handled via /auth/signout in AuthController
}