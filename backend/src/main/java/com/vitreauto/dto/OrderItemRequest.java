package com.vitreauto.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {
  @NotNull
  private Long productId;
  @NotNull
  @Min(1)
  private Integer quantity;
  private String side;
  private String fixation;
}
