package back.ecommerce.services;

// Importaciones de tu código
import back.ecommerce.dtos.ProductosResponse;
import back.ecommerce.entities.CategoriasEntity;
import back.ecommerce.entities.ProductosEntity;
import back.ecommerce.repositories.ProductosRepository;
import back.ecommerce.repositories.CategoriasRepository;

// Importaciones de Mockito y JUnit
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.ArrayList;

// 1. Le decimos a JUnit que use las extensiones de Mockito
@ExtendWith(MockitoExtension.class)
class ProductosServiceImplTest {

    // 2. Crea una versión "falsa" (mock) del Repositorio.
    // No hablará con la base de datos.
    @Mock
    private ProductosRepository productosRepository;
    
    // (Opcional, pero necesario si tu método usa el repo de categorías)
    @Mock 
    private CategoriasRepository categoriasRepository;

    // 3. Crea una instancia REAL de tu servicio e inyéctale
    // los repositorios falsos (los @Mock) de arriba.
    @InjectMocks
    private ProductosServiceImpl productosService; // <-- La clase que REALMENTE probamos

    // 4. Escribimos nuestra primera prueba
    @Test
    void testReadAll_DebeDevolverListaDeProductosDTO() {

        // --- 1. DADO (Given) ---
        // Preparamos el escenario.
        
        // Creamos una categoría falsa
        CategoriasEntity categoriaFalsa = new CategoriasEntity();
        categoriaFalsa.setId(1L);
        categoriaFalsa.setNombre("Electrónica");

        // Creamos una entidad de producto falsa (la que devolvería el repositorio)
        ProductosEntity productoFalso = new ProductosEntity();
        productoFalso.setId(10L);
        productoFalso.setNombre("Producto de Prueba");
        productoFalso.setPrecio(100.0);
        productoFalso.setCategoria(categoriaFalsa);

        // Creamos la lista que esperamos que el repositorio devuelva
        List<ProductosEntity> listaDeEntidades = new ArrayList<>();
        listaDeEntidades.add(productoFalso);

        // --- ESTA ES LA MAGIA DE MOCKITO ---
        // "CUANDO (when) alguien llame al método findAll() de mi repositorio falso,
        // ENTONCES (then) devuelve la listaDeEntidades que acabo de crear."
        when(productosRepository.findAll()).thenReturn(listaDeEntidades);

        // --- 2. CUANDO (When) ---
        // Ejecutamos el método que queremos probar
        List<ProductosResponse> resultado = productosService.readAll();

        // --- 3. ENTONCES (Then) ---
        // Verificamos que el resultado es el esperado

        // ¿El resultado no es nulo?
        assertNotNull(resultado);
        
        // ¿La lista tiene 1 elemento?
        assertEquals(1, resultado.size());
        
        // ¿Los datos se mapearon (convirtieron) correctamente al DTO?
        assertEquals("Producto de Prueba", resultado.get(0).getNombre());
        assertEquals(100.0, resultado.get(0).getPrecio());
        assertEquals("Electrónica", resultado.get(0).getCategoriaNombre());

        // Verificamos que el método findAll() del repo fue llamado
        // exactamente 1 vez.
        verify(productosRepository, times(1)).findAll();
    }
}