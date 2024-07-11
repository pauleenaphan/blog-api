import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/nav";

import "../styles/login.css";

const api = "https://blog-wogg.glitch.me";

export const Login = () =>{
    const navigate = useNavigate(); 
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })

    const [loginStatus, setLoginStatus] = useState("");

    const updateUserData = (postField, userInput) =>{
        setUserData(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const { email, password } = userData;

        try{
            const response = await fetch(`${api}/auth/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            if(response.ok){
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('isLogged', true);

                navigate("/");
            }else{
                setLoginStatus(await response.text());
            }
        }catch(error){
            console.error("Error logging in: ", error);
        }
    }

    return(
        <div>
            <Navbar/>
            <div className="loginPage">
                <h1> Login </h1>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <label> Email: </label>
                        <input 
                            type="text" 
                            placeholder="Email"
                            onChange={(e) => updateUserData('email', e.target.value)}
                            required={true}
                        ></input>
                    </div>
                    <div className="inputContainer">
                        <label> Password: </label>
                        <input 
                            type="password" 
                            placeholder="Password"
                            onChange={(e) => updateUserData('password', e.target.value)}
                        ></input>
                    </div>
                    
                    <button type="submit"> Login </button>
                </form>
                <p className="statusmsg"> {loginStatus} </p>
                <div className="captionContainer">
                    <p> Don't have an account?</p>
                    <button onClick={()=> navigate("/signup")}> Sign up </button>
                </div>
            </div>
            
        </div>
    )
}