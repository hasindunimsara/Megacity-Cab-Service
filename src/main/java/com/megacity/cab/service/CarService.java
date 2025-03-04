package com.megacity.cab.service;

import com.megacity.cab.dto.CarRequest;
import com.megacity.cab.dto.CarResponse;
import com.megacity.cab.model.Car;
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

    private CarResponse mapToResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .carNumber(car.getCarNumber())
                .model(car.getModel())
                .build();
    }
}