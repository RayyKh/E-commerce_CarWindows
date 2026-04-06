package com.vitreauto.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

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
