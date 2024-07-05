import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () =>{
    const navigate = useNavigate();
    const isLogged = localStorage.getItem("isLogged");

    const logout = async () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLogged");
        
        navigate("/"); 
    }

    return(
        <nav className="navContainer">
            <h1 onClick={() => navigate("/")}> BlogWog </h1>
            <div className="sideNav">
            {isLogged === "true" ? (
                <>
                    <button onClick={logout}> Log out </button>
                </>
            ):(
                <button onClick={() => navigate("/login")}> Login </button>
            )}
            </div>
        </nav>
    )
}