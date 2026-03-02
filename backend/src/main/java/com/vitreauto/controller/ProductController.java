package com.vitreauto.controller;

import com.vitreauto.dto.ProductCreateUpdateDto;
import com.vitreauto.entity.Product;
import com.vitreauto.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {
  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/products")
  public ResponseEntity<Page<Product>> list(@RequestParam(name = "page", defaultValue = "0") int page,
                                            @RequestParam(name = "size", defaultValue = "12") int size,
                                            @RequestParam(name = "sort", defaultValue = "createdAt,desc") String sort) {
    String[] s = sort.split(",");
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(s[1]), s[0]));
    return ResponseEntity.ok(productService.list(pageable));
  }

  @GetMapping("/products/{id}")
  public ResponseEntity<Product> get(@PathVariable("id") Long id) {
    return ResponseEntity.ok(productService.get(id));
  }

  @GetMapping("/products/filter")
  public ResponseEntity<Page<Product>> filter(@RequestParam(name = "marque") String marque,
                                              @RequestParam(name = "modele", required = false) String modele,
                                              @RequestParam(name = "page", defaultValue = "0") int page,
                                              @RequestParam(name = "size", defaultValue = "12") int size,
                                              @RequestParam(name = "sort", defaultValue = "createdAt,desc") String sort) {
    String[] s = sort.split(",");
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(s[1]), s[0]));
    return ResponseEntity.ok(productService.filter(marque, modele, pageable));
  }

  @PostMapping("/admin/products")
  public ResponseEntity<Product> create(@Valid @RequestBody ProductCreateUpdateDto dto) {
    return ResponseEntity.ok(productService.create(dto));
  }

  @PutMapping("/admin/products/{id}")
  public ResponseEntity<Product> update(@PathVariable("id") Long id, @Valid @RequestBody ProductCreateUpdateDto dto) {
    return ResponseEntity.ok(productService.update(id, dto));
  }

  @DeleteMapping("/admin/products/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
    productService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/admin/products/out-of-stock")
  public ResponseEntity<List<Product>> outOfStock() {
    return ResponseEntity.ok(productService.outOfStock());
  }

  @GetMapping("/admin/products/low-stock")
  public ResponseEntity<List<Product>> lowStock() {
    return ResponseEntity.ok(productService.lowStock());
  }

  @GetMapping("/products/brands")
  public ResponseEntity<java.util.List<String>> brands() {
    return ResponseEntity.ok(productService.brands());
  }
}
