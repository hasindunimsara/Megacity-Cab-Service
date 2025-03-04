package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DriverResponse {
    private Long id;
    private String name;
    private String licenseNumber;
}