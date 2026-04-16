package com.vitreauto.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vitreauto.dto.ProductCreateUpdateDto;
import com.vitreauto.entity.Product;
import com.vitreauto.service.ProductService;

import jakarta.validation.Valid;

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

  @DeleteMapping("/admin/products/all")
  public ResponseEntity<Void> deleteAll() {
    productService.deleteAll();
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/admin/products/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
    productService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/products/search")
  public ResponseEntity<Page<Product>> searchPublic(
      @RequestParam(value = "marque", required = false) String marque,
      @RequestParam(value = "modele", required = false) String modele,
      @RequestParam(value = "annee", required = false) String annee,
      @RequestParam(value = "availability", required = false) String availability,
      @RequestParam(value = "query", required = false) String query,
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "12") int size,
      @RequestParam(name = "sort", defaultValue = "createdAt,desc") String sort) {
    String[] s = sort.split(",");
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(s[1]), s[0]));
    return ResponseEntity.ok(productService.search(marque, modele, annee, availability, query, pageable));
  }

  @GetMapping("/admin/products/search")
  public ResponseEntity<Page<Product>> searchAdmin(
      @RequestParam(value = "marque", required = false) String marque,
      @RequestParam(value = "modele", required = false) String modele,
      @RequestParam(value = "annee", required = false) String annee,
      @RequestParam(value = "availability", required = false) String availability,
      @RequestParam(value = "query", required = false) String query,
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "10") int size,
      @RequestParam(name = "sort", defaultValue = "id,asc") String sort) {
    String[] s = sort.split(",");
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(s[1]), s[0]));
    return ResponseEntity.ok(productService.search(marque, modele, annee, availability, query, pageable));
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
