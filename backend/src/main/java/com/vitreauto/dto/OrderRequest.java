package com.vitreauto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
  @NotEmpty
  private List<OrderItemRequest> products;

  @NotBlank
  private String customerName;
  @NotBlank
  private String customerPhone;
  @NotBlank
  private String customerAddress;
}
