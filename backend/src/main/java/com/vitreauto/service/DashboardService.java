package com.vitreauto.service;

import java.math.BigDecimal;
import java.time.Month;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.vitreauto.entity.Order;
import com.vitreauto.repository.OrderRepository;
import com.vitreauto.repository.UserRepository;

@Service
public class DashboardService {
  private final OrderRepository orderRepository;
  private final UserRepository userRepository;

  public DashboardService(OrderRepository orderRepository, UserRepository userRepository) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
  }

  public BigDecimal totalRevenue() {
    return orderRepository.totalRevenue();
  }

  public long totalOrders() {
    return orderRepository.count();
  }

  public long totalClients() {
    return orderRepository.distinctCustomerPhones();
  }

  public Map<String, BigDecimal> monthlyRevenue() {
    return orderRepository.findAll().stream().collect(Collectors.groupingBy(
        o -> o.getDateCommande().getYear() + "-" + Month.of(o.getDateCommande().getMonthValue()).name(),
        Collectors.reducing(BigDecimal.ZERO, Order::getTotal, BigDecimal::add)
    ));
  }

  public Map<String, Long> brandDistribution() {
    return orderRepository.findAll().stream()
        .flatMap(o -> o.getOrderItems().stream())
        .collect(Collectors.groupingBy(
            item -> item.getProduct().getMarqueVoiture(),
            Collectors.counting()
        ));
  }
}
