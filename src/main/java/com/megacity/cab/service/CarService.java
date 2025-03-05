package com.megacity.cab.service;

import com.megacity.cab.dto.CarRequest;
import com.megacity.cab.dto.CarResponse;
import com.megacity.cab.dto.CarUtilizationReportResponse;
import com.megacity.cab.model.Car;
import com.megacity.cab.model.Booking; // Add this import
import com.megacity.cab.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService {
    private final CarRepository carRepository;

    public CarResponse addCar(CarRequest request) {
        Car car = Car.builder()
                .carNumber(request.getCarNumber())
                .model(request.getModel())
                .build();
        car = carRepository.save(car);
        return mapToResponse(car);
    }

    public List<CarResponse> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CarResponse updateCar(Long id, CarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
        car.setCarNumber(request.getCarNumber());
        car.setModel(request.getModel());
        car = carRepository.save(car);
        return mapToResponse(car);
    }

    public void deleteCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
        carRepository.delete(car);
    }

    public List<CarUtilizationReportResponse> getCarUtilizationReport() {
        return carRepository.findAll().stream()
                .map(car -> CarUtilizationReportResponse.builder()
                        .carId(car.getId())
                        .carNumber(car.getCarNumber())
                        .model(car.getModel())
                        .totalBookings(car.getBookings().size()) // Reference to Booking
                        .build())
                .collect(Collectors.toList());
    }

    private CarResponse mapToResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .carNumber(car.getCarNumber())
                .model(car.getModel())
                .build();
    }
}