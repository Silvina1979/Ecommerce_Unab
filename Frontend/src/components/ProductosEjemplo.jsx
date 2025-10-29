import "../styles/ProdEjem.css"
import { useSearch } from "../context/SearchContext";

function ProductosEjemplo() {
    const { searchTerm } = useSearch();
    
    const productosSimulados = [
        { id: 4, nombre: "Asus", precio: 2000, categoria: "Computadoras", imagen: "https://imgs.search.brave.com/RVS0ptMbQE8aAbIt4IKSccRqNLVPzdPaTOLrv_z9jwA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/ODY5NTI1MTg0ODUt/MTFiMTgwZTkyNzY0/P2l4bGliPXJiLTQu/MS4wJml4aWQ9TTN3/eE1qQTNmREI4TUh4/elpXRnlZMmg4TVRK/OGZHOXlaR1Z1WVdS/dmNpVXlNR1JsSlRJ/d2JXVnpZWHhsYm53/d2ZId3dmSHg4TUE9/PSZmbT1qcGcmcT02/MCZ3PTMwMDA" },
        { id: 7, nombre: "Acer", precio: 1900, categoria: "Computadoras", imagen: "https://imgs.search.brave.com/eOW2WBPGDQu9Jel9Sjxmg00e_cjbOpRGGZUoZDPpQdY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzc3/MDAxL3BleGVscy1w/aG90by03NzcwMDEu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw" },
        { id: 1, nombre: "HP", precio: 1500, categoria: "Laptops", imagen: "https://imgs.search.brave.com/ZbdYd0l7Du9vR_5krJgYJlVuaJQTfb3H1KJup7yhN1g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8x/MC8yMS8xOC8wNy9s/YXB0b3AtNTY3Mzkw/MV82NDAuanBn" },
        { id: 2, nombre: "Lenovo", precio: 1200, categoria: "Laptops", imagen: "https://imgs.search.brave.com/Hr8o0ekMZJLMZsPLtkBTHJu7cgFh3gRPYjo1bgvBcwM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8w/NS8xNS8wMi8wNy9j/b21wdXRlci03Njc3/ODFfNjQwLmpwZw" },
        { id: 3, nombre: "Iphone", precio: 1800, categoria: "Celular", imagen: "https://imgs.search.brave.com/6OSmhSJoaNIAxQAEVF4FRsXAzkgcxFzY-CnTS18NL-8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Z29sbG8uY29tL21l/ZGlhL2NhdGFsb2cv/cHJvZHVjdC81LzAv/NTAwMTExMTM0MV8w/MC5qcGc_b3B0aW1p/emU9bWVkaXVtJmJn/LWNvbG9yPTI1NSwy/NTUsMjU1JmZpdD1i/b3VuZHMmaGVpZ2h0/PTQwMCZ3aWR0aD00/MDAmY2FudmFzPTQw/MDo0MDA" },
        { id: 5, nombre: "Samsung", precio: 1700, categoria: "Celular", imagen: "https://imgs.search.brave.com/QljvScz6SIMzaSKLQoaJUnkZ69zKua99e91_EzV08HM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5mYWxhYmVsbGEu/Y29tL2ZhbGFiZWxs/YUNMLzE3MDA3Nzg0/XzEwL3dpZHRoPTI0/MCxoZWlnaHQ9MjQw/LHF1YWxpdHk9NzAs/Zm9ybWF0PXdlYnAs/Zml0PXBhZA" },
        { id: 6, nombre: "Xiaomi", precio: 1600, categoria: "Tablet", imagen: "https://imgs.search.brave.com/Fex01ZGICwlSfzrvFBrbtp6q__rlzJXG5j20RdjnvPw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/MjY5NTMtTUxVNzg4/NzI5Njg1NjRfMDky/MDI0LU8ud2VicA" },
    ];
    
    // Filtrar productos según el término de búsqueda
    const productosFiltrados = productosSimulados.filter((producto) => {
        const terminoBusqueda = searchTerm.toLowerCase().trim();
        
        if (!terminoBusqueda) return true;
        
        // Buscar por nombre, categoría o id
        return (
            producto.nombre.toLowerCase().includes(terminoBusqueda) ||
            producto.categoria.toLowerCase().includes(terminoBusqueda) ||
            producto.id.toString().includes(terminoBusqueda)
        );
    });

    return (
        <div className="grid-productos-ej">
            {productosFiltrados.map((prod) => (
                <div key={prod.id} className="producto-card">
                    <div className="prod-ejem-container">
                        <img
                            className="img-prod-ejem"
                            src={prod.imagen}
                            alt={prod.nombre}
                        />
                        <h3>{prod.nombre}</h3>
                        <p>${prod.precio}</p>
                        <button>Agregar al carrito</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductosEjemplo;
