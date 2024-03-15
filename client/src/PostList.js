/** Use React, useState, useEffect, axios and also CommentCreate, CommentList components */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default() => {
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts');

        setPosts(res.data);
    };

    //you tell React that your component needs to do something after render. 
    //React will remember the function you passed (we’ll refer to it as our “effect”), 
    //and call it later after performing the DOM updates
    useEffect(()=> {
        fetchPosts();
    }, []);

    
    const renderedPosts = Object.values(posts).map(post => {
        return <div className='card' style={{ width: '30', marginBottom: '20px'}}
        key={post.id}
        >
            <div className='card-body'>
                <h3>{post.title}</h3>
                <CommentList postId={post.id}/>
                <CommentCreate postId={post.id}/>

            </div>
        </div>
    });

    console.log(posts);

    return (
        <div className='d-flex flex-row flex-wrap justify-content-between'>
            {renderedPosts}
        </div>
    );
};