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

    // Existing Booking Endpoints
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> addBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.addBooking(request));
    }

    @GetMapping("/bookings/{bookingNumber}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.getBooking(bookingNumber));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/bookings/{bookingNumber}")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable String bookingNumber,
                                                         @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(bookingNumber, request));
    }

    @GetMapping("/bookings/{bookingNumber}/bill")
    public ResponseEntity<BigDecimal> calculateBill(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.calculateBill(bookingNumber));
    }

    // Car Endpoints
    @PostMapping("/cars")
    public ResponseEntity<CarResponse> addCar(@Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.addCar(request));
    }

    @GetMapping("/cars")
    public ResponseEntity<List<CarResponse>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    // New: Update Car
    @PutMapping("/cars/{id}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable Long id,
                                                 @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    // New: Delete Car
    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    // Driver Endpoints
    @PostMapping("/drivers")
    public ResponseEntity<DriverResponse> addDriver(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.addDriver(request));
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // New: Update Driver
    @PutMapping("/drivers/{id}")
    public ResponseEntity<DriverResponse> updateDriver(@PathVariable Long id,
                                                       @Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.updateDriver(id, request));
    }

    // New: Delete Driver
    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/help")
    public ResponseEntity<String> getHelp() {
        return ResponseEntity.ok("Admin Help: Use /admin endpoints to manage bookings, cars, and drivers.");
    }
}