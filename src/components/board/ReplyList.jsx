import React, { useState } from 'react';
import styled from 'styled-components';

function ReplyList({ replies, onDelete, onUpdate, onReply, parentId }) {
  const [editReplyId, setEditReplyId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const handleEditClick = (reply) => {
    setEditReplyId(reply.id);
    setEditContent(reply.content);
  };

  const handleUpdate = () => {
    onUpdate(editReplyId, editContent);
    setEditReplyId(null);
    setEditContent('');
  };

  const handleReply = () => {
    onReply(parentId, replyContent);
    setReplyContent('');
  };

  return (
    <ReplyListContainer>
      {replies.map(reply => (
        <ReplyListItem key={reply.id}>
          {editReplyId === reply.id ? (
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
              <ReplyContent>{reply.content}</ReplyContent>
              <button onClick={() => handleEditClick(reply)}>Edit</button>
              <button onClick={() => onDelete(reply.id)}>Delete</button>
            </>
          )}
        </ReplyListItem>
      ))}
      <div>
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        <button onClick={handleReply}>Add Reply</button>
      </div>
    </ReplyListContainer>
  );
}

const ReplyListContainer = styled.div`
  margin-left: 20px;
`;

const ReplyListItem = styled.div`
  background-color: #e9e9e9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`;

const ReplyContent = styled.div`
  margin-bottom: 10px;
`;

export default ReplyList;