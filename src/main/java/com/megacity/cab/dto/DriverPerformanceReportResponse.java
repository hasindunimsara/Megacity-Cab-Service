package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DriverPerformanceReportResponse {
    private Long driverId;
    private String driverName;
    private String licenseNumber;
    private long totalBookings;
    private BigDecimal totalEarnings; // Based on completed bookings
}