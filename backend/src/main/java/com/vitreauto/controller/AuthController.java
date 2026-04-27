package com.vitreauto.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vitreauto.dto.AuthLoginRequest;
import com.vitreauto.dto.AuthRegisterRequest;
import com.vitreauto.dto.AuthResponse;
import com.vitreauto.service.AuthService;

import jakarta.validation.Valid;

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

  @GetMapping("/test")
  public String test() {
    return "Backend is reachable";
  }
}
