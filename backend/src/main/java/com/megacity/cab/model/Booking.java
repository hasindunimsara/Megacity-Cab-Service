package com.megacity.cab.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String bookingNumber;

    @Column(nullable = false)
    private String customerName;

    private String address;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String destination;

    private BigDecimal distance;

    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDateTime bookingDate; // Added to support reporting

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;
}