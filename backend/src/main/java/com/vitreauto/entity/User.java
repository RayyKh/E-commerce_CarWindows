package com.vitreauto.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements org.springframework.security.core.userdetails.UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(unique = true, nullable = false)
  private String email;
  @Column(nullable = false)
  @com.fasterxml.jackson.annotation.JsonIgnore
  private String password;
  @Column(nullable = false)
  private String fullName;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;
  @CreationTimestamp
  private LocalDateTime createdAt;

  @Override
  public Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
    return List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role.name()));
  }
  @Override
  public String getUsername() {
    return email;
  }
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }
  @Override
  public boolean isEnabled() {
    return true;
  }
}
