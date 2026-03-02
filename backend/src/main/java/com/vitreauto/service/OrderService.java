package com.vitreauto.service;

import com.vitreauto.dto.OrderItemRequest;
import com.vitreauto.dto.OrderRequest;
import com.vitreauto.entity.*;
import com.vitreauto.repository.OrderItemRepository;
import com.vitreauto.repository.OrderRepository;
import com.vitreauto.repository.ProductRepository;
import com.vitreauto.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
  private final OrderRepository orderRepository;
  private final OrderItemRepository orderItemRepository;
  private final ProductRepository productRepository;
  private final UserRepository userRepository;

  public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductRepository productRepository, UserRepository userRepository) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  public Order create(OrderRequest request, @AuthenticationPrincipal User user) {
    Order order = new Order();
    if (user == null) {
      User guest = userRepository.findByEmail("guest@vitreauto.local").orElseGet(() -> {
        User u = User.builder()
            .email("guest@vitreauto.local")
            .password("guest")
            .fullName("Invité")
            .role(Role.CLIENT)
            .build();
        return userRepository.save(u);
      });
      order.setUser(guest);
    } else {
      order.setUser(user);
    }
    order.setCustomerName(request.getCustomerName());
    order.setCustomerPhone(request.getCustomerPhone());
    order.setCustomerAddress(request.getCustomerAddress());

    order.setStatus(OrderStatus.EN_ATTENTE);
    BigDecimal total = BigDecimal.ZERO;
    for (OrderItemRequest itemReq : request.getProducts()) {
      Product product = productRepository.findById(itemReq.getProductId()).orElseThrow();
      if (product.getStock() < itemReq.getQuantity()) throw new RuntimeException("Stock insuffisant");
      BigDecimal price = product.getPrix().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
      total = total.add(price);
    }
    order.setTotal(total);
    order = orderRepository.save(order);
    for (OrderItemRequest itemReq : request.getProducts()) {
      Product product = productRepository.findById(itemReq.getProductId()).orElseThrow();
      OrderItem item = new OrderItem();
      item.setOrder(order);
      item.setProduct(product);
      item.setQuantity(itemReq.getQuantity());
      item.setPrice(product.getPrix());
      orderItemRepository.save(item);
      product.setStock(product.getStock() - itemReq.getQuantity());
      productRepository.save(product);
      order.getOrderItems().add(item);
    }
    return order;
  }

  public List<Order> myOrders(User user) {
    return orderRepository.findByUser(user);
  }

  public List<Order> adminList() {
    return orderRepository.findAll();
  }

  public Order get(Long id) {
    return orderRepository.findById(id).orElseThrow();
  }

  public Order updateStatus(Long id, OrderStatus status) {
    Order order = get(id);
    order.setStatus(status);
    return orderRepository.save(order);
  }
}
