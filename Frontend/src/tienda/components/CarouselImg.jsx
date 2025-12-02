import { useState, useEffect } from "react";
import "../styles/CarouselImg.css";

function CarouselImg({ images = [] }) {
    const [index, setIndex] = useState(0);

    // Cambio automático cada 8 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="carousel-container">
            <div
                className="carousel-track"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {images.map((src, i) => (
                    <div className="carousel-slide" key={i}>
                        <img src={src} alt={`slide-${i}`} />
                    </div>
                ))}
            </div>

            {/* Botones izquierda/derecha */}
            <button
                className="carousel-btn left"
                onClick={() => setIndex((index - 1 + images.length) % images.length)}
            >
                ❮
            </button>

            <button
                className="carousel-btn right"
                onClick={() => setIndex((index + 1) % images.length)}
            >
                ❯
            </button>
        </div>
    );
}

export default CarouselImg;