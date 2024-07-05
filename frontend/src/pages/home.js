import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//show all blogs
export const Homepage = () =>{
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    //gets all the post on the homepage
    const fetchPost = async() =>{
        try{
            const response = await fetch("http://localhost:3001/post/getallpost", {
                //don't need this part since we are not authenticating but it doesn't hurt to have
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
            setPosts(data);
        }catch(error){
            console.error("Error getting blog post", error);
        }
    }

    useEffect(()=>{
        fetchPost();
    }, [])

    return(
        <div>
            <h1> Pauleena's Blog </h1>
            {posts.map(post =>(
                <div key={post._id} onClick={() => navigate(`/blogPost/${post._id}`)}>
                    <h2> {post.title} </h2>
                    <p> Published: {post.published} </p>
                </div>
            ))}
        </div>
    )
}