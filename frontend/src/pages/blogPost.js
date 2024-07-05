import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//shows the blog post that the user clicked on
export const BlogPost = () =>{
    const { postId } = useParams();
    const [post, setPost] = useState({
        title: "",
        content: "",
        published: "",
        author: "",
        readTime: "",
    });
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState("");
    const userRole = localStorage.getItem("userRole");

    const getPost = async() =>{
        try{
            const response = await fetch(`http://localhost:3001/post/getpost/${postId}`,{
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();
            setPost({
                title: data.title,
                content: data.content,
                published: data.published,
                author: data.author,
                readTime: data.readTime
            })
        }catch(error){
            console.error("Error getting specific blog post", error);
        }
    }

    const getComments = async () => {
        try {
            const response = await fetch(`http://localhost:3001/comment/viewcomments/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const responseText = await response.text(); // Get raw text first
            console.log('Response Text:', responseText);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseText}`);
            }
    
            const data = JSON.parse(responseText); // Parse raw text to JSON
            setComments(data);
            console.log('Parsed Data:', data);
        } catch (error) {
            console.error("Error getting comments", error);
        }
    };

    const addComment = async () =>{
        console.log(userComment);
        try{
            const response = await fetch(`http://localhost:3001/comment/addcomment/${postId}`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ content: userComment }),
            })
            if(response.ok){
                alert("comment was added");
                setUserComment("");
                getComments();
            }
        }catch(error){
            console.error("Error adding comment", error);
        }
    }

    const removeComment = async () =>{
        
    }

    useEffect(() =>{
        getPost();
        getComments();
    }, [])
    
    return(
        <div>
            <div className="postContainer">
                <h1> {post.title} </h1>
                <p> Published: {post.published} </p>
                <p> By: {post.author} </p>
                <p> Readtime: {post.readTime} </p>
                <p> {post.content} </p>
            </div>
            
            <h2> Comments </h2>
            <input 
                type="text"
                placeholder="Type your comment"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                ></input>
            <button onClick={addComment}> Submit </button>
            {comments.map(comment =>(
                <div key={comment._id}>
                    <p> 
                        {comment.author} {userRole === 'admin' ? ' - Author' : ''}
                        </p>
                    <p> {comment.date} </p>
                    <p> {comment.content} </p>
                    {userRole === 'admin' && (
                        <button onClick={() => removeComment(comment._id)}> Remove Comment </button>
                    )}
                </div>
            ))}
        </div>
        
    )
}