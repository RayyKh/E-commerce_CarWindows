package com.vitreauto.config;

import com.vitreauto.entity.Product;
import com.vitreauto.entity.Role;
import com.vitreauto.entity.User;
import com.vitreauto.repository.ProductRepository;
import com.vitreauto.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Profile("dev")
@Component
public class DataInitializer implements CommandLineRunner {
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final PasswordEncoder passwordEncoder;
  public DataInitializer(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.passwordEncoder = passwordEncoder;
  }
  @Override
  public void run(String... args) {
    if (!userRepository.findByEmail("admin@vitreauto.local").isPresent()) {
      User admin = User.builder()
          .email("admin@vitreauto.local")
          .password(passwordEncoder.encode("admin123"))
          .fullName("Admin")
          .role(Role.ADMIN)
          .build();
      userRepository.save(admin);
    }
    if (productRepository.count() == 0) {
      List<String> brands = Arrays.asList(
          "ALFA ROMEO","AUDI","BMW","CHEVROLET","CHRYSLER","CITROEN","DACIA","DAEWOO","DAIHATSU",
          "DODGE","DS","FIAT","FORD","HONDA","HYUNDAI","IVECO","JAGUAR","JEEP","KIA","LANCIA",
          "LAND ROVER","LEXUS","MAZDA","MERCEDES","MINI","MITSUBISHI","NISSAN","OPEL","PEUGEOT",
          "PORSCHE","RENAULT","SAAB","SEAT","SKODA","SMART","SSANGYONG","SUBARU","SUZUKI","TOYOTA",
          "VOLKSWAGEN","VOLVO"
      );
      for (String b : brands) {
        productRepository.save(Product.builder()
            .nom("Pare-brise avant")
            .description("Vitre pour " + b + " modèle standard")
            .prix(new BigDecimal("650.000"))
            .marqueVoiture(b)
            .modeleVoiture("Modèle")
            .annee("2021")
            .imageUrl("https://placehold.jp/600x400.png?text=VitreAuto")
            .stock(100)
            .status("En stock")
            .build());
      }
    }
  }
}
