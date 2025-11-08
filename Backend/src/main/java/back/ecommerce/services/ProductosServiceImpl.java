package back.ecommerce.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import back.ecommerce.dtos.ProductosRequest;
import back.ecommerce.dtos.ProductosResponse;
import back.ecommerce.entities.ProductosEntity;
import back.ecommerce.repositories.CategoriasRepository;
import back.ecommerce.repositories.ProductosRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class ProductosServiceImpl implements ProductosService{

    private final ProductosRepository productosRepository;
    private final CategoriasRepository categoriasRepository;


    @Override
    public ProductosResponse create(ProductosRequest producto) {
        var entity = new ProductosEntity();
        BeanUtils.copyProperties(producto, entity);

        var categoria = categoriasRepository.findById(producto.getCategoriaId())
            .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada con id: " + producto.getCategoriaId()));

        entity.setCategoria(categoria);

        var productoCreated = productosRepository.save(entity);

        var response = new ProductosResponse();
        BeanUtils.copyProperties(productoCreated, response);
        response.setCategoriaNombre(productoCreated.getCategoria().getNombre());
        response.setCategoriaId(productoCreated.getCategoria().getId());


        return response;
    }


    @Override
    public ProductosResponse readById(Long id) {
        final var entityResponse = this.productosRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + id));

        var response = new ProductosResponse();
        BeanUtils.copyProperties(entityResponse, response);

        if (entityResponse.getCategoria() != null) {
            response.setCategoriaId(entityResponse.getCategoria().getId());
            response.setCategoriaNombre(entityResponse.getCategoria().getNombre());
        }
        
        return response;
    }

    
    @Override
    public ProductosResponse readByName(String nombre) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    //lo agrego para que me use el readall
    @Override
    public List<ProductosResponse> readAll() {
        
        // 1. Llama al repositorio para traer todas las entidades
        List<ProductosEntity> listaDeProductos = this.productosRepository.findAll();

        // 2. Convierte esa lista de Entidades a una lista de DTOs (ProductosResponse)
        return listaDeProductos.stream()
                .map(producto -> {
                    // Crea un DTO de respuesta por cada producto
                    ProductosResponse response = new ProductosResponse();
                    
                    // Copia las propiedades (igual que en tu método readById)
                    BeanUtils.copyProperties(producto, response);

                    // Asigna la categoría (igual que en tu método readById)
                    if (producto.getCategoria() != null) {
                        response.setCategoriaId(producto.getCategoria().getId());
                        response.setCategoriaNombre(producto.getCategoria().getNombre());
                    }
                    return response;
                })
                .collect(Collectors.toList()); // 3. Devuelve la lista de DTOs
    }

@Override
public ProductosResponse update(Long id, ProductosRequest productoRequest) {
    
    final var entityFromDB = this.productosRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + id));

    if (productoRequest.getNombre() != null && !productoRequest.getNombre().isBlank()) {
        entityFromDB.setNombre(productoRequest.getNombre());
    }

    if (productoRequest.getDescripcion() != null) {
        entityFromDB.setDescripcion(productoRequest.getDescripcion());
    }

    if (productoRequest.getPrecio() != null) {
        entityFromDB.setPrecio(productoRequest.getPrecio());
    }

    if (productoRequest.getStock() != null) {
        entityFromDB.setStock(productoRequest.getStock());
    }

    if (productoRequest.getImagen() != null) {
        entityFromDB.setImagen(productoRequest.getImagen());
    }

    if (productoRequest.getCategoriaId() != null) {
        var categoria = categoriasRepository.findById(productoRequest.getCategoriaId())
            .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id: " + productoRequest.getCategoriaId()));
        entityFromDB.setCategoria(categoria);
    }
    
    var productoActualizado = this.productosRepository.save(entityFromDB);

    final var response = new ProductosResponse();
    BeanUtils.copyProperties(productoActualizado, response);

    if (productoActualizado.getCategoria() != null) {
        response.setCategoriaId(productoActualizado.getCategoria().getId());
        response.setCategoriaNombre(productoActualizado.getCategoria().getNombre());
    }

    return response;
}

    @Override
    public void delete(Long id) {
        var producto = this.productosRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + id));

        log.info("Eliminando producto: {}", producto.getNombre());

        this.productosRepository.delete(producto);
    }

    @Override
    public List<ProductosResponse> readAll() {
        List<ProductosEntity> entityFromDB = this.productosRepository.findAll();

        return entityFromDB.stream()
            .map(entidad -> {
                ProductosResponse response = new ProductosResponse();
                BeanUtils.copyProperties(entidad, response);
                if (entidad.getCategoria() != null) {
                    response.setCategoriaId(entidad.getCategoria().getId());
                    response.setCategoriaNombre(entidad.getCategoria().getNombre());
                }
                return response;
            })
            .collect(Collectors.toList());
    }

    
    @Override
    public List<ProductosResponse> buscarPorNombre(String termino) {
        List<ProductosEntity> productosEncontrados = this.productosRepository.findByNombreContainingIgnoreCase(termino);
        
        return productosEncontrados.stream()
            .map(this::convertirEntidadAResponse) // Llama al helper
            .collect(Collectors.toList());
    }

    @Override
    public List<ProductosResponse> buscarPorCategoria(Long categoriaId) {
        List<ProductosEntity> productosEncontrados = this.productosRepository.findByCategoriaId(categoriaId);

        return productosEncontrados.stream()
            .map(this::convertirEntidadAResponse) // Llama al helper
            .collect(Collectors.toList());
    }

    private ProductosResponse convertirEntidadAResponse(ProductosEntity entidad) {
        ProductosResponse response = new ProductosResponse();
        BeanUtils.copyProperties(entidad, response);
        
        if (entidad.getCategoria() != null) {
            response.setCategoriaId(entidad.getCategoria().getId());
            response.setCategoriaNombre(entidad.getCategoria().getNombre());
        }
        
        return response;
    }

}
