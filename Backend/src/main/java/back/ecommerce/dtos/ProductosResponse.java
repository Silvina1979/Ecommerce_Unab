package back.ecommerce.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProductosResponse {
    private Long id;
    private Long categoriaId;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String categoriaNombre;
    private List<String> imagenes;

    private Long tiendaId;
}