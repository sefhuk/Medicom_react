import React from 'react';
import styled from 'styled-components';

function CommentList({ comments }) {
  return (
    <CommentListContainer>
      <h2>Comments</h2>
      <CommentsUl>
        {comments.map(comment => (
          <CommentListItem key={comment.id}>{comment.content}</CommentListItem>
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
`;

export default CommentList;
