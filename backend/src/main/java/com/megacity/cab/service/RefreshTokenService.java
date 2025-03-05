package com.megacity.cab.service;

import com.megacity.cab.exception.TokenRefreshException;
import com.megacity.cab.model.RefreshToken;
import com.megacity.cab.model.User;
import com.megacity.cab.repository.RefreshTokenRepository;
import com.megacity.cab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt.refresh-expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Delete existing token and ensure it's committed
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush(); // This forces a flush to the database

        // Create and save new token
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .token(UUID.randomUUID().toString())
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Created new refresh token for user_id={}: {}", userId, savedToken.getToken());

        return savedToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new login request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        int deletedCount = refreshTokenRepository.deleteByUser(user);
        log.info("Deleted {} refresh tokens for user_id={}", deletedCount, userId);
        return deletedCount;
    }
}