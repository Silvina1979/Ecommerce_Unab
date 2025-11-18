import { createUsuario } from "../services/usuarios.js";
import Header from "../components/Header.jsx";
import "../styles/Login.css";

import { useState } from "react";

import { IoPerson } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa6";


// Renderiza la pagina del Login, donde el usuario se va a poder registrar o crear una cuenta

function Login() {
    const [isRegisterActive, setIsRegisterActive] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    
    // Estados para el formulario de registro
    const [registerForm, setRegisterForm] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        password: ''
    });
    const [registerError, setRegisterError] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Manejador para los cambios en los inputs del registro
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejador para el envío del formulario de registro
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError(null);
        
        try {
            // Validaciones básicas
            if (!registerForm.dni || registerForm.dni.length < 7) {
                throw new Error("DNI inválido");
            }
            if (!registerForm.email.includes('@')) {
                throw new Error("Email inválido");
            }
            if (registerForm.password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres");
            }

            // Llamada a la API para crear el usuario
            await createUsuario(registerForm);
            
            // Registro exitoso
            setRegisterSuccess(true);
            setRegisterForm({
                dni: '',
                nombre: '',
                apellido: '',
                email: '',
                password: ''
            });
            
            // Cambiar al formulario de login después de 2 segundos
            setTimeout(() => {
                setIsRegisterActive(false);
                setRegisterSuccess(false);
            }, 2000);

        } catch (error) {
            setRegisterError(error.response?.data?.message || error.message || "Error al registrar usuario");
        }
    };

    return (
        <div>
            {/* Header de navegación de la aplicación */}
            <Header />

            {/* Contenedor principal del login */}
            <div className="main-login">

                <div className={`all-login-container ${isRegisterActive ? "active" : ""}`} >

                    {/* FORM LOGIN */}
                    <div className="login-box">
                        <form>
                            <h2>Iniciar Sesión</h2>
                            {/* <div className="social-networks"></div> */}
                            <div className="input-box">
                                <span className="icon">
                                    <IoMail name="mail-outline" size={20}/>
                                </span>
                                <input type="text" required />
                                <label>Email</label>
                            </div>
                            <div className="input-box">
                                <span className="icon">
                                    <FaLock name="lock-closed-outline" size={18}/>
                                </span>
                                <input 
                                    type={showLoginPassword ? "text" : "password"}
                                    required 
                                />
                                <label>Contraseña</label>
                            </div>
                            <div className="password-details">
                                <label><input type="checkbox" />Recuérdame </label>
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={showLoginPassword}
                                        onChange={(e) => setShowLoginPassword(e.target.checked)}
                                    />
                                    Mostrar contraseña
                                </label>
                            </div>
                            <div className="submit-button-contenedor">
                                <button type="submit">Iniciar Sesión</button>
                            </div>
                                <a className="password-forgot" href="#">¿Olvidaste tu contraseña?</a>
                        </form>
                    </div>

                    {/* FORM REGISTRO */}
                    <div className="register-box">
                        <form onSubmit={handleRegister}>
                            <h2>Registrarse</h2>
                            <div className="input-box">
                                <span className="icon">
                                    <FaAddressCard name="dni-outline" size={20}/>
                                </span>
                                <input 
                                    type="text" 
                                    name="dni"
                                    value={registerForm.dni}
                                    onChange={handleRegisterChange}
                                    pattern="^[0-9]{7,8}$" 
                                    inputMode="numeric" 
                                    maxLength="8"
                                    title="Ingrese un DNI válido (solo números, entre 7 y 8 dígitos)"
                                    required 
                                    />
                                <label>DNI</label>
                            </div>
                            <div className="input-box">
                                <span className="icon">
                                    <IoPerson name="mail-outline" size={20}/>
                                </span>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    value={registerForm.nombre}
                                    onChange={handleRegisterChange}
                                    required
                                    />
                                <label>Nombre</label>
                            </div>
                            <div className="input-box">
                                <span className="icon">
                                    <IoPerson name="mail-outline" size={20}/>
                                </span>
                                <input 
                                    type="text" 
                                    name="apellido"
                                    value={registerForm.apellido}
                                    onChange={handleRegisterChange}
                                    required
                                    />
                                <label>Apellido</label>
                            </div>
                            <div className="input-box">
                                <span className="icon">
                                    <IoMail name="mail-outline" size={20}/>
                                </span>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={registerForm.email}
                                    onChange={handleRegisterChange}
                                    required 
                                    />
                                <label>Email</label>
                            </div>
                            <div className="input-box">
                                <span className="icon">
                                    <FaLock name="lock-closed-outline" size={18}/>
                                </span>
                                <input 
                                    type={showRegisterPassword ? "text" : "password"}
                                    name="password"
                                    value={registerForm.password}
                                    onChange={handleRegisterChange}
                                    required 
                                    />
                                <label>Contraseña</label>
                            </div>
                            <div className="password-details">
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={showRegisterPassword}
                                        onChange={(e) => setShowRegisterPassword(e.target.checked)}
                                        />
                                    Mostrar contraseña
                                </label>
                            </div>
                            <div className="submit-button-contenedor">
                                <button type="submit">Registrarse</button>

                            {registerError && (
                                <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                                    {registerError}
                                </div>
                            )}
                            {registerSuccess && (
                                <div className="success-message" style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>
                                    ¡Registro exitoso! Redirigiendo al login...
                                </div>
                            )}
                            </div>
                        </form>
                    </div>

                    {/* CONTENEDOR DE BIENVENIDA */}
                    <div className="container-welcome">
                        {/* Panel para el registro */}
                        <div className={`welcome-panel welcome-register ${isRegisterActive ? "hidden" : "visible"}`}aria-hidden={isRegisterActive}>
                            <h2>¡Bienvenido!</h2>
                            <p>¿Aún no tienes una cuenta? Regístrate y comienza tu experiencia.</p>
                            <button type="button" className="welcome-btn" onClick={() => setIsRegisterActive(true)}>Registrate</button>
                        </div>
                        {/* Panel para el login */}
                        <div className={`welcome-panel welcome-login ${isRegisterActive ? "visible" : "hidden"}`}aria-hidden={!isRegisterActive}>
                            <h2>¡Nos alegra verte de nuevo!</h2>
                            <p>¿Ya tienes una cuenta?</p>
                            <button type="button" className="welcome-btn" onClick={() => setIsRegisterActive(false)}>Inicia sesión</button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
export default Login