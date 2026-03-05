package com.vitreauto.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private String nom;
  @Column(length = 2000)
  private String description;
  @Column(nullable = false)
  private BigDecimal prix;
  @Column(nullable = false)
  private String marqueVoiture;
  @Column(nullable = false)
  private String modeleVoiture;
  @Column(nullable = false)
  private String annee;
  @Column(columnDefinition = "TEXT")
  private String imageUrl;
  @Column(nullable = false)
  private Integer stock;
  private String status;
  @CreationTimestamp
  private LocalDateTime createdAt;
}
