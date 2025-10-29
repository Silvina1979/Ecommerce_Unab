package com.ecommerce.repository;

import com.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Producto, Long> {
    // Listo. Spring Data JPA provee todos los métodos CRUD (save, find, delete, etc.)
}