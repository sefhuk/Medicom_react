import React, { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function ReplyList({ replies, onDelete, onUpdate, onReply, parentId }) {
  // 상태 변수
  const [editReplyId, setEditReplyId] = useState(null); // 수정 중인 답글 ID
  const [editContent, setEditContent] = useState(''); // 수정할 답글 내용
  const [replyContent, setReplyContent] = useState(''); // 새로 추가할 답글 내용

  // 대댓글 수정
  const handleEditClick = (reply) => {
    setEditReplyId(reply.id);
    setEditContent(reply.content);
  };

  // 대댓글 업데이트
  const handleUpdate = () => {
    onUpdate(editReplyId, editContent);
    setEditReplyId(null);
    setEditContent('');
  };

  // 대댓글 수정 취소
  const handleCancelEdit = () => {
    setEditReplyId(null);
    setEditContent('');
  };

  // 답글 추가 버튼 클릭 시 호출
  const handleReply = () => {
    onReply(parentId, replyContent); // 부모 컴포넌트에 답글 추가 요청
    setReplyContent(''); // 상태 초기화
  };

  // 답글 추가 취소 버튼 클릭 시 호출
  const handleCancelReply = () => {
    setReplyContent(''); // 상태 초기화
  };

  return (
    <Box sx={{ ml: 4 }}>
      <List>
        {replies.map(reply => (
          <ListItem
            key={reply.id}
            sx={{ mb: 2, bgcolor: '#e9e9e9', borderRadius: 1, p: 2, border: '1px solid #ccc' }}
          >
            <Box sx={{ flex: 1 }}>
              {editReplyId === reply.id ? (
                <Box>
                  <TextField
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                  <Button onClick={handleUpdate} variant="contained" color="primary">
                    Update
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    {reply.content}
                  </Typography>
                  <IconButton onClick={() => handleEditClick(reply)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(reply.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </ListItem>
        ))}
        <Box sx={{ mt: 2 }}>
          <TextField
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Add a reply..."
          />
          <Button onClick={handleReply} variant="contained" color="primary">
            Add Reply
          </Button>
          <Button onClick={handleCancelReply} variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </List>
    </Box>
  );
}

export default ReplyList;
