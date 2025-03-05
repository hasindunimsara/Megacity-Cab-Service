package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CarUtilizationReportResponse {
    private Long carId;
    private String carNumber;
    private String model;
    private long totalBookings;
}