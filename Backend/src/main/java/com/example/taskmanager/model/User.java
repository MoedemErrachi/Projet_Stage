package com.example.taskmanager.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String username;  // your display username

    @Column(nullable = false, unique = true)
    private String email;     // used for login and getUsername()

    @Column(nullable = false)
    private String password;

    // getters and setters...

    // Spring Security uses this as the login name, so return email here
    @Override
    public String getUsername() {
        return username;
    }
  
    public String getEmail() {
        return email;
    }
    @Override
    public String getPassword() {
        return password;
    }

public void setEmail(String email) {
    this.email = email;
}
public void setPassword(String password) {
    this.password = password;
}
public void setUsername(String username) {
    this.username = username;
}

    // All accounts are active by default, remove if you add logic later
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAuthorities'");
    }
}
