package com.vitreauto.service;

import com.vitreauto.dto.AuthLoginRequest;
import com.vitreauto.dto.AuthRegisterRequest;
import com.vitreauto.dto.AuthResponse;
import com.vitreauto.entity.Role;
import com.vitreauto.entity.User;
import com.vitreauto.repository.UserRepository;
import com.vitreauto.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  public AuthResponse register(AuthRegisterRequest request) {
    User user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .fullName(request.getFullName())
        .role(Role.CLIENT)
        .build();
    userRepository.save(user);
    String token = jwtService.generateToken(user, java.util.Collections.singletonMap("role", user.getRole().name()));
    return new AuthResponse(token);
  }

  public AuthResponse login(AuthLoginRequest request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
    String token = jwtService.generateToken(user, java.util.Collections.singletonMap("role", user.getRole().name()));
    return new AuthResponse(token);
  }
}
