package com.vitreauto.repository;

import com.vitreauto.entity.Order;
import com.vitreauto.entity.OrderStatus;
import com.vitreauto.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUser(User user);
  @Query("select coalesce(sum(o.total),0) from Order o")
  BigDecimal totalRevenue();
  long countByStatus(OrderStatus status);
}
