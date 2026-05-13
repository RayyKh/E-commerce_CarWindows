package com.vitreauto.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
  private BigDecimal prixAchat;
  private BigDecimal prixVente;
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
