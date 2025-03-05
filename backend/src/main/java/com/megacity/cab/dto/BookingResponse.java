package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private String bookingNumber;
    private String customerName;
    private String address;
    private String phoneNumber;
    private String destination;
    private BigDecimal distance;
    private BigDecimal totalAmount;
    private String driverName;
    private String carNumber;
}