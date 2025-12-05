import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/CarouselImg.css";

/**
 * Componente CarouselImg
 * Reutilizado para banners principales y ahora para imágenes de productos.
 * * @param {Array<string>} images - URLs de las imágenes
 * @param {boolean} isProduct - Indica si se usa en una tarjeta de producto (deshabilita auto-slide)
 */
function CarouselImg({ images = [], isProduct = false }) {
    const [index, setIndex] = useState(0);

    // Cambio automático solo si NO es un producto
    useEffect(() => {
        if (isProduct) return;
        
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [images.length, isProduct]);
    
    // Estilos dinámicos para el contenedor
    const containerStyle = isProduct ? { 
        height: '100%', 
        margin: '0', 
        borderRadius: '8px', 
        boxShadow: 'none',
        minHeight: '220px', // Altura mínima para la imagen del producto
        backgroundColor: 'white' 
    } : {
        // Estilos para el banner principal (para que se estire y ocupe el espacio)
        height: '380px', // Altura definida en CSS anterior
        minHeight: '380px', 
        borderRadius: '12px',
        margin: '20px auto',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maxWidth: '1270px'
    };
    
    // Estilos dinámicos para la imagen
    const imageStyle = isProduct ? { 
        // Productos: Usamos 'contain' para NO deformar
        objectFit: 'contain' 
    } : {
        // Banner Principal: Usamos 'fill' para estirar y llenar el espacio sin barras blancas
        objectFit: 'fill' 
    };
    
    const trackStyle = isProduct ? {
        height: '100%'
    } : {};

    return (
        <div className="carousel-container" style={containerStyle}>
            <div
                className="carousel-track"
                style={{ 
                    transform: `translateX(-${index * 100}%)`,
                    ...trackStyle
                }}
            >
                {images.map((src, i) => (
                    <div className="carousel-slide" key={i}>
                        <img 
                            src={src} 
                            alt={`slide-${i}`}
                            style={imageStyle}
                            onError={(e) => {
                                // Fallback para imágenes
                                if (!e.target.dataset.fallback) {
                                    e.target.dataset.fallback = "true";
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Botones izquierda/derecha */}
            {images.length > 1 && (
                <>
                    <button
                        className="carousel-btn left"
                        onClick={() => setIndex((index - 1 + images.length) % images.length)}
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        className="carousel-btn right"
                        onClick={() => setIndex((index + 1) % images.length)}
                    >
                        <FaChevronRight />
                    </button>
                </>
            )}
            
            {/* Indicadores de posición (opcional, pero útil) */}
            {images.length > 1 && (
                <div className="carousel-indicators">
                    {images.map((_, i) => (
                        <div 
                            key={i} 
                            className={`indicator ${i === index ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CarouselImg;