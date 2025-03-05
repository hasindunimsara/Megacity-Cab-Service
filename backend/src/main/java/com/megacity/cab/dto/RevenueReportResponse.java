package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RevenueReportResponse {
    private BigDecimal totalRevenue;
    private BigDecimal dailyRevenue;
    private BigDecimal weeklyRevenue;
    private BigDecimal monthlyRevenue;
}