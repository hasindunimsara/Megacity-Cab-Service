package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private String bookingNumber;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String status;
}