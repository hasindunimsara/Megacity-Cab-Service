package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CarResponse {
    private Long id;
    private String carNumber;
    private String model;
}