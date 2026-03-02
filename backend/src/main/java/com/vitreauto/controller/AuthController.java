package com.vitreauto.controller;

import com.vitreauto.dto.AuthLoginRequest;
import com.vitreauto.dto.AuthRegisterRequest;
import com.vitreauto.dto.AuthResponse;
import com.vitreauto.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRegisterRequest request) {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthLoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }
}
