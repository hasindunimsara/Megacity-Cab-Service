package com.megacity.cab.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotBlank
    private String bookingNumber;

    // Mock payment fields (simplified)
    @NotBlank
    private String cardNumber; // e.g., "1234-5678-9012-3456"
}