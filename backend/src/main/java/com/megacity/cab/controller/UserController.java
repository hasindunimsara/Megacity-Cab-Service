package com.megacity.cab.controller;

import com.megacity.cab.dto.CarResponse;
import com.megacity.cab.dto.DriverResponse;
import com.megacity.cab.dto.UserInfoResponse;
import com.megacity.cab.model.User;
import com.megacity.cab.repository.UserRepository;
import com.megacity.cab.security.service.UserDetailsImpl;
import com.megacity.cab.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new UserInfoResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        ));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(user -> new UserInfoResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRoles().stream() // Use roles from User entity
                                .map(role -> role.getAuthority())
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList()));
    }
}