package com.vitreauto.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @CreationTimestamp
  private LocalDateTime dateCommande;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus status;
  @Column(nullable = false)
  private BigDecimal total;
  @ManyToOne(optional = false)
  private User user;

  private String customerName;
  private String customerPhone;
  private String customerAddress;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> orderItems = new ArrayList<>();
}
