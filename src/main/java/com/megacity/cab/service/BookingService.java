package com.megacity.cab.service;

import com.megacity.cab.dto.BookingRequest;
import com.megacity.cab.dto.BookingResponse;
import com.megacity.cab.model.Booking;
import com.megacity.cab.model.Car;
import com.megacity.cab.model.Driver;
import com.megacity.cab.repository.BookingRepository;
import com.megacity.cab.repository.CarRepository;
import com.megacity.cab.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final DriverRepository driverRepository;

    public BookingResponse addBooking(BookingRequest request) {
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Booking booking = Booking.builder()
                .bookingNumber(UUID.randomUUID().toString())
                .customerName(request.getCustomerName())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .destination(request.getDestination())
                .distance(request.getDistance())
                .car(car)
                .driver(driver)
                .build();

        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    public BookingResponse getBooking(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBooking(String bookingNumber, BookingRequest request) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        booking.setCustomerName(request.getCustomerName());
        booking.setAddress(request.getAddress());
        booking.setPhoneNumber(request.getPhoneNumber());
        booking.setDestination(request.getDestination());
        booking.setDistance(request.getDistance());
        booking.setCar(car);
        booking.setDriver(driver);

        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    public BigDecimal calculateBill(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        BigDecimal ratePerKm = new BigDecimal("2.0"); // Example rate
        BigDecimal tax = new BigDecimal("0.1"); // 10% tax
        BigDecimal baseAmount = booking.getDistance().multiply(ratePerKm);
        BigDecimal total = baseAmount.add(baseAmount.multiply(tax));
        booking.setTotalAmount(total);
        bookingRepository.save(booking);
        return total;
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingNumber(booking.getBookingNumber())
                .customerName(booking.getCustomerName())
                .address(booking.getAddress())
                .phoneNumber(booking.getPhoneNumber())
                .destination(booking.getDestination())
                .distance(booking.getDistance())
                .totalAmount(booking.getTotalAmount())
                .driverName(booking.getDriver().getName())
                .carNumber(booking.getCar().getCarNumber())
                .build();
    }
}