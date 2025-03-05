package com.megacity.cab.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingReportResponse {
    private long totalBookings;
    private long dailyBookings;
    private long weeklyBookings;
    private long monthlyBookings;
}