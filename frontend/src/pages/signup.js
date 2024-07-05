import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/nav";

export const CreateAccount = () =>{
    const navigate = useNavigate(); 
    const [userData, setUserData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPass: "",
    })
    const [signupStatus, setSignupStatus] = useState("");

    const updateUserData = (postField, userInput) =>{
        setUserData(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, username, password, confirmPass } = userData;

        if(password !== confirmPass){
            setSignupStatus("Passwords don't match");
            return;
        }

        try{
            const response = await fetch("http://localhost:3001/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });

            if(response.ok){
                alert("User registered successfully");
                navigate("/login");
            }else{
                setSignupStatus(await response.text());
            }
        }catch(error){
            console.error("Error registering user:", error);
            alert("Server error");
        }
    };
    


    return(
        <div>
            <Navbar/>
            <h1> Signup </h1>
            <form className="loginForm" onSubmit={handleSubmit}>
                <label> Email: </label>
                <input 
                    type="text" 
                    placeholder="Email"
                    onChange={(e) => updateUserData('email', e.target.value)}
                    required={true}
                ></input>
                <label> Username: </label>
                <input 
                    type="text" 
                    placeholder="Name"
                    onChange={(e) => updateUserData('username', e.target.value)}
                    required={true}
                    ></input>
                <label> Password: </label>
                <input 
                    type="password" 
                    placeholder="Password"
                    onChange={(e) => updateUserData('password', e.target.value)}
                    required={true}
                    ></input>
                <label> Confirm Password: </label>
                <input 
                    type="password" 
                    placeholder="confirm password"
                    onChange={(e) => updateUserData('confirmPass', e.target.value)}
                    required={true}
                    ></input>
                <button type="submit"> Signup </button>
            </form>
            <p> {signupStatus} </p>
            <p> Existing User? </p>
            <button onClick={() => navigate("/login")}> Login </button>
        </div>
    )
}