package com.vitreauto.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.vitreauto.entity.Role;
import com.vitreauto.entity.User;
import com.vitreauto.repository.ProductRepository;
import com.vitreauto.repository.UserRepository;

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
    if (!userRepository.findByEmail("admin123").isPresent()) {
      User admin = User.builder()
          .email("admin123")
          .password(passwordEncoder.encode("vitreauto123#"))
          .fullName("Admin")
          .role(Role.ADMIN)
          .build();
      userRepository.save(admin);
    }
  }
}
