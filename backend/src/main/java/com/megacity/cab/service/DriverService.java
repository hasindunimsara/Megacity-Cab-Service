package com.megacity.cab.service;

import com.megacity.cab.dto.DriverPerformanceReportResponse;
import com.megacity.cab.dto.DriverRequest;
import com.megacity.cab.dto.DriverResponse;
import com.megacity.cab.model.Driver;
import com.megacity.cab.model.Booking; // Add this import
import com.megacity.cab.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepository driverRepository;

    public DriverResponse addDriver(DriverRequest request) {
        Driver driver = Driver.builder()
                .name(request.getName())
                .licenseNumber(request.getLicenseNumber())
                .build();
        driver = driverRepository.save(driver);
        return mapToResponse(driver);
    }

    public List<DriverResponse> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DriverResponse updateDriver(Long id, DriverRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        driver.setName(request.getName());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver = driverRepository.save(driver);
        return mapToResponse(driver);
    }

    public void deleteDriver(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        driverRepository.delete(driver);
    }

    public List<DriverPerformanceReportResponse> getDriverPerformanceReport() {
        return driverRepository.findAll().stream()
                .map(driver -> {
                    BigDecimal totalEarnings = driver.getBookings().stream()
                            .map(Booking::getTotalAmount) // Reference to Booking
                            .filter(amount -> amount != null)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return DriverPerformanceReportResponse.builder()
                            .driverId(driver.getId())
                            .driverName(driver.getName())
                            .licenseNumber(driver.getLicenseNumber())
                            .totalBookings(driver.getBookings().size())
                            .totalEarnings(totalEarnings)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private DriverResponse mapToResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .licenseNumber(driver.getLicenseNumber())
                .build();
    }
}