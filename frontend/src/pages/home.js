import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "../components/modal";
import { Navbar } from "../components/nav";

//show all blogs
export const Homepage = () =>{
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [postModal, setPostModal] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        description: "",
        readTime: ""
    })

    const updateNewPost = (postField, userInput) =>{
        setNewPost(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

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

    const removePost = async(postId) =>{
        try{
            const response = await fetch(`http://localhost:3001/post/deletepost/${postId}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(response.ok){
                alert("Post was removed");
                fetchPost();
            }
        }catch(error){
            console.error("Error removing post", error);
        }
    }

    const addPost = async(e) =>{
        e.preventDefault();
        const { title, content, description, readTime } = newPost; 

        try{
            const response = await fetch("http://localhost:3001/post/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, description, readTime }),
            });

            if(response.ok){
                alert("post was created");
                setPostModal(false);
                fetchPost();
            }
        }catch(error){
            console.error("Error adding post", error);
        }
    }

    useEffect(()=>{
        fetchPost();
    }, [])

    return(
        <div>
            <Navbar/>
            {userRole === "admin" && (
                <button onClick={() => setPostModal(true)}> New Post </button>
            )}
            <Modal show={postModal} onClose={() => setPostModal(false)}>
                <h2> New Post </h2>
                <form>
                    <label> Title </label>
                    <input 
                        type="text" 
                        placeholder="title" 
                        onChange={(e) => updateNewPost("title", e.target.value)}
                        required={true}
                        ></input>
                    <label> Content </label>
                    <textarea
                        placeholder="content"
                        onChange={(e) => updateNewPost("content", e.target.value)}
                        required={true}
                    />
                    <label> Description </label>
                    <textarea
                        placeholder="description"
                        onChange={(e) => updateNewPost("description", e.target.value)}
                        required={true}
                    />
                    <label> Readtime </label>
                    <input
                        type="number"
                        placeholder="Minutes"
                        onChange={(e) => updateNewPost("readTime", e.target.value)}
                        required={true}
                    ></input>
                    <button onClick={addPost}> Post </button>
                </form>
            </Modal>

            {posts.map(post =>(
                <div key={post._id} onClick={() => navigate(`/blogPost/${post._id}`)}>
                    <h3> {post.title} </h3>
                    <p> {post.description} </p>
                    <p> {post.readTime} min read </p>
                    <p> Published: {post.published} </p>
                    {userRole === 'admin' && (
                        <button onClick={(e) => {
                            e.stopPropagation(); 
                            removePost(post._id)
                        }}> Remove Post </button>
                    )}
                </div>
            ))}
        </div>
    )
}