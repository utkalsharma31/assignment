import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [renderedPosts, setRenderedPosts] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  useEffect(() => {
    const renderPosts = async () => {
      const renderedPosts = await Promise.all(
        posts.map(async post => {
          const user = await fetchUser(post.userId);
          return (
            <div className="post" key={post.id}>
              <div className="post-header">
                <h3>{user ? user.name : 'Unknown User'}</h3>
                <span>@{user ? user.username : 'unknown_username'}</span>
              </div>
              <p className='post-content'>{post.body}</p>
            </div>
          );
        })
      );
      setRenderedPosts(renderedPosts);
    };

    if (posts.length > 0) {
      renderPosts();
    }
  }, [posts]);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  return (
    <div className="post-list">
      <h1>Posts List</h1>
      {renderedPosts.length === 0 ? (
        <p>Loading, Please Wait...</p>
      ) : (
        <>
          {renderedPosts}
        </>
      )}
    </div>
  );
};

export default PostList;
