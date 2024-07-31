import React, { useState } from 'react';
import styled from 'styled-components';

function CommentList({ comments, onDelete, onUpdate, onReply }) {
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = () => {
    onUpdate(editCommentId, editContent);
    setEditCommentId(null);
    setEditContent('');
  };

  const handleReplyClick = (comment) => {
    setReplyCommentId(comment.id);
    setReplyContent('');
  };

  const handleReply = () => {
    onReply(replyCommentId, replyContent);
    setReplyCommentId(null);
    setReplyContent('');
  };

  return (
    <CommentListContainer>
      <CommentsUl>
        {comments.map(comment => (
          <CommentListItem key={comment.id}>
            {editCommentId === comment.id ? (
              <div>
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={handleUpdate}>Update</button>
              </div>
            ) : (
              <>
                {comment.content}
                <button onClick={() => handleEditClick(comment)}>Edit</button>
                <button onClick={() => onDelete(comment.id)}>Delete</button>
                {/* 대댓글에는 Reply 버튼을 표시하지 않음 */}
                {comment.parentId === null && (
                  <button onClick={() => handleReplyClick(comment)}>Reply</button>
                )}
              </>
            )}
            {replyCommentId === comment.id && (
              <div>
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <button onClick={handleReply}>Add Reply</button>
              </div>
            )}
            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
              <CommentList
                comments={comment.replies}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onReply={onReply}
              />
            )}
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
  button {
    margin-left: 10px;
    background-color: #4682B4;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #4169E1;
    }
  }
`;

export default CommentList;
