package com.vitreauto.repository;

import com.vitreauto.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByMarqueVoitureIgnoreCaseAndModeleVoitureIgnoreCase(String marqueVoiture, String modeleVoiture);
  Page<Product> findByMarqueVoitureIgnoreCase(String marqueVoiture, Pageable pageable);
  Page<Product> findByMarqueVoitureIgnoreCaseAndModeleVoitureIgnoreCase(String marqueVoiture, String modeleVoiture, Pageable pageable);
  long countByStock(Integer stock);
  List<Product> findByStock(Integer stock);
  List<Product> findByStockLessThanEqual(Integer stock);
  @Query("select distinct p.marqueVoiture from Product p order by p.marqueVoiture")
  List<String> findDistinctMarques();
}
