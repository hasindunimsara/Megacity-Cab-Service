package com.megacity.cab.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String licenseNumber;
}