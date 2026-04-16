package com.vitreauto.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vitreauto.dto.ProductCreateUpdateDto;
import com.vitreauto.entity.Product;
import com.vitreauto.repository.ProductRepository;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Transactional
  public void deleteAll() {
    productRepository.deleteAll();
  }

  public Page<Product> list(Pageable pageable) {
    return productRepository.findAll(pageable);
  }

  public Page<Product> search(String marque, String modele, String annee, String availability, String query, Pageable pageable) {
    if (marque != null && (marque.trim().isEmpty() || "all".equalsIgnoreCase(marque))) marque = null;
    if (modele != null && (modele.trim().isEmpty() || "all".equalsIgnoreCase(modele))) modele = null;
    if (annee != null && (annee.trim().isEmpty() || "all".equalsIgnoreCase(annee))) annee = null;
    if (availability != null && (availability.trim().isEmpty() || "all".equalsIgnoreCase(availability))) availability = null;
    if (query != null && query.trim().isEmpty()) query = null;
    return productRepository.findBySearch(marque, modele, annee, availability, query, pageable);
  }

  public Product get(Long id) {
    return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
  }

  public Page<Product> filter(String marque, String modele, Pageable pageable) {
    if (modele == null || modele.trim().isEmpty() || "all".equalsIgnoreCase(modele)) {
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
    if (dto.getStock() != null && dto.getStock() == 0) {
      p.setStatus("Épuisé");
    } else if (dto.getStock() != null && dto.getStock() >= 1) {
      p.setStatus("En stock");
    } else {
      p.setStatus(dto.getStatus());
    }
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
    if (dto.getStock() != null && dto.getStock() == 0) {
      p.setStatus("Épuisé");
    } else if (dto.getStock() != null && dto.getStock() >= 1) {
      p.setStatus("En stock");
    } else {
      p.setStatus(dto.getStatus());
    }
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
