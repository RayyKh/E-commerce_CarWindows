package com.vitreauto.controller;

import com.vitreauto.entity.Order;
import com.vitreauto.entity.OrderStatus;
import com.vitreauto.entity.User;
import com.vitreauto.service.DashboardService;
import com.vitreauto.service.OrderService;
import com.vitreauto.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
  private final DashboardService dashboardService;
  private final OrderService orderService;
  private final UserRepository userRepository;

  public AdminController(DashboardService dashboardService, OrderService orderService, UserRepository userRepository) {
    this.dashboardService = dashboardService;
    this.orderService = orderService;
    this.userRepository = userRepository;
  }

  @GetMapping("/dashboard/total-revenue")
  public ResponseEntity<BigDecimal> totalRevenue() {
    return ResponseEntity.ok(dashboardService.totalRevenue());
  }

  @GetMapping("/dashboard/total-orders")
  public ResponseEntity<Long> totalOrders() {
    return ResponseEntity.ok(dashboardService.totalOrders());
  }

  @GetMapping("/dashboard/total-clients")
  public ResponseEntity<Long> totalClients() {
    return ResponseEntity.ok(dashboardService.totalClients());
  }

  @GetMapping("/dashboard/monthly-revenue")
  public ResponseEntity<Map<String, BigDecimal>> monthlyRevenue() {
    return ResponseEntity.ok(dashboardService.monthlyRevenue());
  }

  @GetMapping("/dashboard/brand-distribution")
  public ResponseEntity<Map<String, Long>> brandDistribution() {
    return ResponseEntity.ok(dashboardService.brandDistribution());
  }

  @GetMapping("/orders")
  public ResponseEntity<List<Order>> orders() {
    return ResponseEntity.ok(orderService.adminList());
  }

  @GetMapping("/orders/{id}")
  public ResponseEntity<Order> order(@PathVariable("id") Long id) {
    return ResponseEntity.ok(orderService.get(id));
  }

  @PutMapping("/orders/{id}/status")
  public ResponseEntity<Order> updateStatus(@PathVariable("id") Long id, @RequestParam(name = "status") OrderStatus status) {
    return ResponseEntity.ok(orderService.updateStatus(id, status));
  }

  @GetMapping("/users")
  public ResponseEntity<List<User>> users() {
    return ResponseEntity.ok(userRepository.findAll());
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
    userRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
