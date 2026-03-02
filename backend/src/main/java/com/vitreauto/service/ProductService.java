package com.vitreauto.service;

import com.vitreauto.dto.ProductCreateUpdateDto;
import com.vitreauto.entity.Product;
import com.vitreauto.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public Page<Product> list(Pageable pageable) {
    return productRepository.findAll(pageable);
  }

  public Product get(Long id) {
    return productRepository.findById(id).orElseThrow();
  }

  public Page<Product> filter(String marque, String modele, Pageable pageable) {
    if (modele == null || modele.isBlank() || "all".equalsIgnoreCase(modele)) {
      return productRepository.findByMarqueVoitureIgnoreCase(marque, pageable);
    }
    return productRepository.findByMarqueVoitureIgnoreCaseAndModeleVoitureIgnoreCase(marque, modele, pageable);
  }

  public Product create(ProductCreateUpdateDto dto) {
    Product p = new Product();
    p.setNom(dto.getNom());
    p.setDescription(dto.getDescription());
    p.setPrix(dto.getPrix());
    p.setMarqueVoiture(dto.getMarqueVoiture());
    p.setModeleVoiture(dto.getModeleVoiture());
    p.setAnnee(dto.getAnnee());
    p.setImageUrl(dto.getImageUrl());
    p.setStock(dto.getStock());
    p.setStatus(dto.getStatus());
    return productRepository.save(p);
  }

  public Product update(Long id, ProductCreateUpdateDto dto) {
    Product p = get(id);
    p.setNom(dto.getNom());
    p.setDescription(dto.getDescription());
    p.setPrix(dto.getPrix());
    p.setMarqueVoiture(dto.getMarqueVoiture());
    p.setModeleVoiture(dto.getModeleVoiture());
    p.setAnnee(dto.getAnnee());
    p.setImageUrl(dto.getImageUrl());
    p.setStock(dto.getStock());
    p.setStatus(dto.getStatus());
    return productRepository.save(p);
  }

  public void delete(Long id) {
    productRepository.deleteById(id);
  }

  public java.util.List<Product> outOfStock() {
    return productRepository.findByStock(0);
  }

  public java.util.List<Product> lowStock() {
    return productRepository.findByStockLessThanEqual(5);
  }

  public java.util.List<String> brands() {
    return productRepository.findDistinctMarques();
  }
}
