package com.vitreauto.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateUpdateDto {
  @NotBlank
  private String nom;
  @NotBlank
  private String description;
  @NotNull
  @DecimalMin("0.0")
  private BigDecimal prix;
  @NotBlank
  private String marqueVoiture;
  @NotBlank
  private String modeleVoiture;
  @NotBlank
  private String annee;
  private String imageUrl;
  @NotNull
  @Min(0)
  private Integer stock;
}
