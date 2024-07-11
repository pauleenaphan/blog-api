import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "../components/modal";
import { Navbar } from "../components/nav";
import "../styles/home.css";

//show all blogs
export const Homepage = () =>{
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [postModal, setPostModal] = useState(false);
    const [editPostModal, setEditPostModal] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        description: "",
        readTime: ""
    });

    const updateNewPost = (postField, userInput) =>{
        setNewPost(prevData => ({
            ...prevData,
            [postField]: userInput
        }));
    };

    const [editPostVal, setEditPostVal] = useState({
        currPost: "",
        title: "",
        description: "",
        content: "",
        readTime: ""
    });

    const updateEditPost = (postField, userInput) =>{
        setEditPostVal(prevData => ({
            ...prevData,
            [postField]: userInput
        }));
    };

    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    const getPost = async(postId) =>{
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/post/getpost/${postId}`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
                mode: 'cors' 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }    

            const data = await response.json();
            setEditPostVal({
                currPost: postId,
                title: data.title,
                description: data.description,
                content: data.content,
                readTime: data.readTime
            });
        }catch(error){
            console.error("Error getting specific blog post", error);
        }
    };

    //gets all the post on the homepage
    const fetchPost = async() =>{
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/post/getallpost`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: 'cors' 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }    
    
            const data = await response.json();
            setPosts(data);
        }catch(error){
            console.error("Error getting blog post", error);
        }
    };

    const removePost = async(postId) =>{
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/post/deletepost/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: 'cors' 
            });

            if(response.ok){
                alert("Post was removed");
                fetchPost();
            }
        }catch(error){
            console.error("Error removing post", error);
        }
    };

    const editPost = async(e) =>{
        e.preventDefault();
        const { title, description, content, readTime } = editPostVal;
        console.log("curr post val ", editPostVal.currPost);
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/post/editpost/${editPostVal.currPost}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: 'cors',
                body: JSON.stringify({ title, description, content, readTime }) 
            });

            if(response.ok){
                alert("Post was edited");
                fetchPost();
                setEditPostModal(false);
            }
        }catch(error){
            console.error("Error editing post", error);
        }
    };

    const addPost = async(e) =>{
        e.preventDefault();
        const { title, content, description, readTime } = newPost; 

        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/post/createpost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: 'cors',
                body: JSON.stringify({ title, content, description, readTime }),
            });

            if(response.ok){
                alert("Post was created");
                setPostModal(false);
                fetchPost();
            }
        }catch(error){
            console.error("Error adding post", error);
        }
    };

    useEffect(()=>{
        fetchPost();
    }, []);

    return(
        <div>
            <Navbar/>
            {userRole === "admin" && (
                <button className="newPostBtn" onClick={() => setPostModal(true)}> New Post </button>
            )}
            {/* New post modal */}
            <Modal show={postModal} onClose={() => setPostModal(false)}>
                <div className="postModal">
                    <form className="postForm">
                        <h2> New Post </h2>
                        <div className="inputPostContainer">
                            <label> Title </label>
                            <input 
                                type="text" 
                                placeholder="Title" 
                                onChange={(e) => updateNewPost("title", e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="inputPostContainer">
                            <label> Description </label>
                            <textarea
                                className="postDescription"
                                placeholder="2-3 Short sentences about the blog"
                                onChange={(e) => updateNewPost("description", e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="inputPostContainer">
                            <label> Content </label>
                            <textarea
                                className="postContent"
                                placeholder="Your blog content"
                                onChange={(e) => updateNewPost("content", e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="inputPostContainer">
                            <label> Readtime </label>
                            <input
                                type="number"
                                placeholder="Minutes"
                                onChange={(e) => updateNewPost("readTime", e.target.value)}
                                required={true}
                            />
                        </div>
                        
                        <button className="newPostBtn" onClick={addPost}> Post </button>
                    </form>
                </div>
            </Modal>

            {/* Edit post modal */}
            <Modal show={editPostModal} onClose={() => setEditPostModal(false)}>
                <div className="postModal">
                    <form className="postForm">
                        <h2> Edit Post </h2>
                        <div className="inputPostContainer">
                            <label> Title </label>
                            <input 
                                type="text" 
                                placeholder="Title" 
                                onChange={(e) => updateEditPost("title", e.target.value)}
                                value={editPostVal.title}
                                required={true}
                            />
                        </div>
                        <div className="inputPostContainer">
                            <label> Description </label>
                            <textarea
                                className="postDescription"
                                placeholder="Short description about your post"
                                onChange={(e) => updateEditPost("description", e.target.value)}
                                value={editPostVal.description}
                                required={true}
                            />
                        </div>
                        <div className="inputPostContainer">
                            <label> Content </label>
                            <textarea
                                className="postContent"
                                placeholder="Content"
                                onChange={(e) => updateEditPost("content", e.target.value)}
                                value={editPostVal.content}
                                required={true}
                            />
                        </div>
                        <div className="inputPostContainer">
                            <label> Readtime </label>
                            <input
                                type="number"
                                placeholder="Minutes"
                                onChange={(e) => updateEditPost("readTime", e.target.value)}
                                value={editPostVal.readTime}
                                required={true}
                            />
                        </div>
                        
                        <button className="editPostBtn" onClick={editPost}> Confirm Changes </button>
                    </form>
                </div>
            </Modal>
            <div className="postContainer">
                {posts.map(post =>(
                    <div key={post._id} onClick={() => navigate(`/blogPost/${post._id}`)} className="post">
                        <h3> {post.title} </h3>
                        <p className="description"> {post.description} </p>
                        <div className="postCaption">
                            <p className="postReadTime"> {post.readTime} min read </p>
                            <p> Published: {post.published} </p>
                        </div>
                        {userRole === 'admin' && (
                            <div className="postBtnContainer">
                                <button 
                                    className="removePostBtn" 
                                    onClick={(e) => {
                                    e.stopPropagation(); 
                                    removePost(post._id)
                                }}> Remove Post </button>
                                <button 
                                    className="editPostBtn" 
                                    onClick={async (e) =>{
                                        e.stopPropagation();
                                        await getPost(post._id);
                                        setEditPostModal(true);
                                    }}> Edit Post </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
