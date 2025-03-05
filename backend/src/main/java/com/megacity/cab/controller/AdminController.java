package com.megacity.cab.controller;

import com.megacity.cab.dto.*;
import com.megacity.cab.model.Role;
import com.megacity.cab.model.User;
import com.megacity.cab.repository.UserRepository;
import com.megacity.cab.service.BookingService;
import com.megacity.cab.service.CarService;
import com.megacity.cab.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BookingService bookingService;
    private final CarService carService;
    private final DriverService driverService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    @DeleteMapping("/bookings/{bookingNumber}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingNumber) {
        bookingService.cancelBooking(bookingNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings/{bookingNumber}/bill")
    public ResponseEntity<BigDecimal> calculateBill(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.calculateBill(bookingNumber));
    }

    @PostMapping("/cars")
    public ResponseEntity<CarResponse> addCar(@Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.addCar(request));
    }

    @GetMapping("/cars")
    public ResponseEntity<List<CarResponse>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @PutMapping("/cars/{id}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable Long id,
                                                 @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/drivers")
    public ResponseEntity<DriverResponse> addDriver(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.addDriver(request));
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<DriverResponse> updateDriver(@PathVariable Long id,
                                                       @Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.updateDriver(id, request));
    }

    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/help")
    public ResponseEntity<String> getHelp() {
        return ResponseEntity.ok("Admin Help: Use /admin endpoints to manage bookings, cars, drivers, and reports.");
    }

    @GetMapping("/reports/bookings")
    public ResponseEntity<BookingReportResponse> getBookingReport() {
        return ResponseEntity.ok(bookingService.getBookingReport());
    }

    @GetMapping("/reports/revenue")
    public ResponseEntity<RevenueReportResponse> getRevenueReport() {
        return ResponseEntity.ok(bookingService.getRevenueReport());
    }

    @GetMapping("/reports/drivers")
    public ResponseEntity<List<DriverPerformanceReportResponse>> getDriverPerformanceReport() {
        return ResponseEntity.ok(driverService.getDriverPerformanceReport());
    }

    @GetMapping("/reports/cars")
    public ResponseEntity<List<CarUtilizationReportResponse>> getCarUtilizationReport() {
        return ResponseEntity.ok(carService.getCarUtilizationReport());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserInfoResponse> updateUser(@PathVariable Long id,
                                                       @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setUsername(userUpdateRequest.getUsername());
        user.setEmail(userUpdateRequest.getEmail());

        if (userUpdateRequest.getPassword() != null && !userUpdateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }

        Set<Role> roles = new HashSet<>();
        if (userUpdateRequest.getRoles() != null && !userUpdateRequest.getRoles().isEmpty()) {
            userUpdateRequest.getRoles().forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        roles.add(Role.ROLE_ADMIN);
                        break;
                    case "mod":
                    case "moderator":
                        roles.add(Role.ROLE_MODERATOR);
                        break;
                    default:
                        roles.add(Role.ROLE_USER);
                }
            });
        } else {
            roles.add(Role.ROLE_USER);
        }
        user.setRoles(roles);

        userRepository.save(user);

        return ResponseEntity.ok(new UserInfoResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream()
                        .map(Role::getAuthority)
                        .collect(Collectors.toList())
        ));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}