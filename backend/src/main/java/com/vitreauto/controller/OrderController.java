package com.vitreauto.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vitreauto.dto.OrderRequest;
import com.vitreauto.entity.Order;
import com.vitreauto.entity.User;
import com.vitreauto.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {
  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PostMapping
  public ResponseEntity<Order> create(@Valid @RequestBody OrderRequest request, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(orderService.create(request, user));
  }

  @GetMapping("/my-orders")
  public ResponseEntity<List<Order>> myOrders(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(orderService.myOrders(user));
  }
  
  @GetMapping("/by-phone")
  public ResponseEntity<List<Order>> byPhone(@RequestParam("phone") String phone) {
    return ResponseEntity.ok(orderService.byPhone(phone));
  }
}
