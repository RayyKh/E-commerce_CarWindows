package com.vitreauto.controller;

import com.vitreauto.dto.OrderRequest;
import com.vitreauto.entity.Order;
import com.vitreauto.entity.User;
import com.vitreauto.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {
  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PostMapping("/orders")
  public ResponseEntity<Order> create(@Valid @RequestBody OrderRequest request, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(orderService.create(request, user));
  }

  @GetMapping("/orders/my-orders")
  public ResponseEntity<List<Order>> myOrders(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(orderService.myOrders(user));
  }
  
  @GetMapping("/orders/by-phone")
  public ResponseEntity<List<Order>> byPhone(@RequestParam("phone") String phone) {
    return ResponseEntity.ok(orderService.byPhone(phone));
  }
}
