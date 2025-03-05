package com.megacity.cab.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CarRequest {
    @NotBlank
    private String carNumber;

    @NotBlank
    private String model;
}
