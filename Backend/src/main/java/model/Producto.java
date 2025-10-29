package com.ecommerce.model;

import jakarta.persistence.*; // o javax.persistence si usas una versión antigua

@Entity // Representa la tabla 'producto' en la BD
public class Producto {

    @Id // Marca este campo como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indica que el ID se autogenera
    private Long id;

    private String nombre;
    private double precio;
    private int stock;

    // ... (Añadir Getters, Setters y Constructores)
}