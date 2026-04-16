package com.vitreauto.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vitreauto.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByMarqueVoitureIgnoreCaseAndModeleVoitureIgnoreCase(String marqueVoiture, String modeleVoiture);
  Page<Product> findByMarqueVoitureIgnoreCase(String marqueVoiture, Pageable pageable);
  Page<Product> findByMarqueVoitureIgnoreCaseAndModeleVoitureIgnoreCase(String marqueVoiture, String modeleVoiture, Pageable pageable);
  long countByStock(Integer stock);
  List<Product> findByStock(Integer stock);
  List<Product> findByStockLessThanEqual(Integer stock);
  @Query("select distinct p.marqueVoiture from Product p order by p.marqueVoiture")
  List<String> findDistinctMarques();

  @Query("select p from Product p where " +
         "(:marque is null or lower(trim(p.marqueVoiture)) = lower(trim(:marque))) and " +
         "(:modele is null or lower(trim(p.modeleVoiture)) = lower(trim(:modele))) and " +
         "(:annee is null or trim(p.annee) = trim(:annee)) and " +
         "(:availability is null or lower(trim(p.status)) = lower(trim(:availability))) and " +
         "(:query is null or (lower(p.nom) like lower(concat('%', :query, '%')) or " +
         "lower(p.marqueVoiture) like lower(concat('%', :query, '%')) or " +
         "lower(p.modeleVoiture) like lower(concat('%', :query, '%')) or " +
         "lower(p.annee) like lower(concat('%', :query, '%'))))")
  Page<Product> findBySearch(@Param("marque") String marque, 
                             @Param("modele") String modele,
                             @Param("annee") String annee,
                             @Param("availability") String availability, 
                             @Param("query") String query, 
                             Pageable pageable);
}
