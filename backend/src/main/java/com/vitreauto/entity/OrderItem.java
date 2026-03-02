package com.vitreauto.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class OrderItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Integer quantity;
  @Column(nullable = false)
  private BigDecimal price;
  @ManyToOne(optional = false)
  private Product product;
  @ManyToOne(optional = false)
  @com.fasterxml.jackson.annotation.JsonIgnore
  private Order order;
}
