package com.vitreauto.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import com.vitreauto.dto.OrderItemRequest;
import com.vitreauto.dto.OrderRequest;
import com.vitreauto.entity.Order;
import com.vitreauto.entity.OrderItem;
import com.vitreauto.entity.OrderStatus;
import com.vitreauto.entity.Product;
import com.vitreauto.entity.Role;
import com.vitreauto.entity.User;
import com.vitreauto.repository.OrderItemRepository;
import com.vitreauto.repository.OrderRepository;
import com.vitreauto.repository.ProductRepository;
import com.vitreauto.repository.UserRepository;

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
      Product product = productRepository.findById(itemReq.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
      if (product.getStock() < itemReq.getQuantity()) throw new RuntimeException("Stock insuffisant");
      BigDecimal price = product.getPrix().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
      total = total.add(price);
    }
    order.setTotal(total);
    order = orderRepository.save(order);
    for (OrderItemRequest itemReq : request.getProducts()) {
      Product product = productRepository.findById(itemReq.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
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

  public List<Order> byPhone(String phone) {
    return orderRepository.findByCustomerPhone(phone);
  }

  public Order get(Long id) {
    return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
  }

  public Order updateStatus(Long id, OrderStatus status) {
    Order order = get(id);
    order.setStatus(status);
    return orderRepository.save(order);
  }
}
