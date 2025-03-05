package com.megacity.cab.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookingRequest {
    @NotBlank
    private String customerName;

    private String address;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String destination;

    private BigDecimal distance;

    private Long driverId;

    private Long carId;
}