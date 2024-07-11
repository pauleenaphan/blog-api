import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/nav";
import "../styles/post.css";

const api = "https://blog-wog-api.glitch.me";

//shows the blog post that the user clicked on
export const BlogPost = () =>{
    const { postId } = useParams();
    const [post, setPost] = useState({
        title: "",
        description: "",
        content: "",
        published: "",
        author: "",
        readTime: "",
    });
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState("");
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    const isLogged = localStorage.getItem("isLogged");

    const getPost = async() =>{
        try{
            const response = await fetch(`${api}/post/getpost/${postId}`,{
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();
            setPost({
                title: data.title,
                description: data.description,
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
            const response = await fetch(`${api}/comment/viewcomments/${postId}`, {
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
        try{
            const response = await fetch(`${api}/comment/addcomment/${postId}`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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

    const removeComment = async (commentId) =>{
        try{
            const response = await fetch(`${api}/comment/deletecomment/${commentId}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
            if(response.ok){
                alert("comment was deleted");
                getComments();
            }
        }catch(error){
            console.error("Error Deleting comment")
        }
    }

    useEffect(() =>{
        getPost();
        getComments();
    })
    
    return(
        <div>
            <Navbar/>
            <div className="blogPostContainer">
                <h1> {post.title} </h1>
                <p> {post.description} </p>
                <div className="capContainer">
                    <p className="postAuthorDate"> By: {post.author} | {post.published} </p>
                    <p><i>{post.readTime} min read</i></p>
                </div>
                <hr></hr>
                <p className="postContent"> {post.content} </p>
            </div>
            
            <div className="commentsContainer">
                <h2> Comments </h2>
                {isLogged === "true" ? (
                    <>
                        <textarea
                            type="text"
                            placeholder="Type your comment"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                        />
                        <div className="btnClass">
                            <button onClick={addComment} className="subbtn"> Submit </button>
                        </div>
                        
                    </>
                ) : (
                    <p> Login or signup to make a comment </p>
                )}
                {comments.map(comment =>(
                    <div key={comment._id} className="userCommentsContainer">
                        <hr></hr>
                        <div className="commentHeadCaption">
                            <p className="commentAuthor"> {comment.author} </p>
                            <p className="commentDate"> Commented: {comment.date} </p>
                        </div>
                        <p className="commentContent"> {comment.content} </p>
                        <div className="btnClass">
                            {userRole === 'admin' && (
                                <button onClick={() => removeComment(comment._id)} className="removePostBtn"> Remove Comment </button>
                            )}
                        </div>
                        
                    </div>
                ))}
            </div>
            
        </div>
    )
}