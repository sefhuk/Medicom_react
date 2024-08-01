import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function PostList({ posts, boardId }) {
  return (
    <PostListContainer>
      <h2>Posts</h2>
      <Link to={`/posts/create/${boardId}`}>
        <CreateButton>Create New Post</CreateButton>
      </Link>
      <PostListUl>
        {posts.map(post => (
          <PostListItem key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </PostListItem>
        ))}
      </PostListUl>
    </PostListContainer>
  );
}

const PostListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CreateButton = styled.button`
  background-color: #ff6347; /* Tomato */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1em;
  &:hover {
    background-color: #e5533f; /* Darker Tomato */
  }
`;

const PostListUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PostListItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  a {
    text-decoration: none;
    color: #4682B4;
    font-size: 1.2em;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default PostList;
