import { useEffect } from "react";
import "../styles/NotificationModal.css";

/**
 * Componente de Notificación Toast Reutilizable
 * 
 * Muestra notificaciones tipo toast en la esquina superior derecha
 * Sin overlay oscuro, más pequeño, y desaparece automáticamente
 * 
 * @param {boolean} isOpen - Controla si la notificación está visible
 * @param {string} type - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {string} title - Título de la notificación (opcional)
 * @param {string} message - Mensaje a mostrar
 * @param {function} onClose - Función que se ejecuta al cerrar la notificación
 * @param {number} autoClose - Tiempo en milisegundos para cerrar automáticamente (por defecto 3000ms)
 */
function NotificationModal({ isOpen, type = 'info', title, message, onClose, autoClose = 3000 }) {
    useEffect(() => {
        if (isOpen && autoClose > 0) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, onClose]);

    useEffect(() => {
        // Cerrar con ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && onClose) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const typeClass = `notification-${type}`;

    return (
        <div 
            className={`notification-toast ${typeClass}`}
            onClick={onClose}
        >
            <div className="notification-toast-content">
                <div className={`notification-toast-icon ${typeClass}`}>
                    {icons[type] || icons.info}
                </div>
                <div className="notification-toast-text">
                    {title && (
                        <div className="notification-toast-title">{title}</div>
                    )}
                    <div className="notification-toast-message">{message}</div>
                </div>
                <button 
                    className="notification-toast-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onClose) onClose();
                    }}
                    aria-label="Cerrar"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

export default NotificationModal;
