import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function CommentList({ comments, onDelete }) {
  return (
    <CommentListContainer>
      <h2>Comments</h2>
      <CommentsUl>
        {comments.map(comment => (
          <CommentListItem key={comment.id}>
            {comment.content}
            <Link to={`/comments/update/${comment.id}`}>Edit</Link>
            <button onClick={() => onDelete(comment.id)}>Delete</button>
          </CommentListItem>
        ))}
      </CommentsUl>
    </CommentListContainer>
  );
}

const CommentListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CommentsUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentListItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  a {
    margin-left: 10px;
    text-decoration: none;
    color: #4682B4;
    &:hover {
      text-decoration: underline;
    }
  }
  button {
    background-color: #ff6347; /* Tomato */
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    font-size: 0.9em;
    &:hover {
      background-color: #e5533f; /* Darker Tomato */
    }
  }
`;

export default CommentList;
