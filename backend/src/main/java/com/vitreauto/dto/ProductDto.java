package com.vitreauto.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDto {
  private Long id;
  private String nom;
  private String description;
  private BigDecimal prix;
  private String marqueVoiture;
  private String modeleVoiture;
  private String annee;
  private String imageUrl;
  private Integer stock;
  private String createdAt;
}
