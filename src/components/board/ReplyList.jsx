import React, { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, IconButton, Menu, MenuItem,  Card, CardContent, CardActions, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Btn } from '../../components/global/CustomComponents';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

function ReplyList({ replies = [], onDelete, onUpdate, onReply, parentId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuReplyId, setMenuReplyId] = useState(null);
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const handleMenuClick = (event, replyId) => {
    setAnchorEl(event.currentTarget);
    setMenuReplyId(replyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuReplyId(null);
  };

  const handleEditClick = (reply) => {
    setEditReplyId(reply.id);
    setEditReplyContent(reply.content || '');
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    onUpdate(editReplyId, editReplyContent);
    setEditReplyId(null);
    setEditReplyContent('');
  };

  const handleCancelEdit = () => {
    setEditReplyId(null);
    setEditReplyContent('');
  };

  const handleDelete = () => {
    onDelete(menuReplyId);
    handleMenuClose();
  };

  return (
    <List sx={{ pl: 4 }}>
      {replies.map((reply) => (
        <ListItem key={reply.id} sx={{ mb: 1, p: 0 }}>
          <Box sx={{ width: '100%', p: 1, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {reply.userImg ? (
                <img
                  src={reply.userImg}
                  alt="Profile"
                  style={{
                    backgroundColor: '#E9E9E9',
                    width: '30px',
                    height: '30px',
                    padding: '5px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
  
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#E9E9E9',
                    width: '30px',
                    height: '30px',
                    padding: '5px',
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                {editReplyId === reply.id ? (
                  <Box>
                    <TextField
                      value={editReplyContent}
                      onChange={(e) => setEditReplyContent(e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                    <Box sx={{ display: 'flex' }}>
                      <Btn onClick={handleUpdate} sx={{ mr: 1, width: '15px' }}>
                        수정
                      </Btn>
                      <Btn onClick={handleCancelEdit} sx={{ width: '15px' }}>
                        취소
                      </Btn>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {reply.userName || '알 수 없는 사용자'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {reply.content || '내용 없음'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {reply.updatedAt
                        ? new Date(reply.updatedAt).toLocaleString()
                        : reply.createdAt
                        ? new Date(reply.createdAt).toLocaleString()
                        : '알 수 없는 날짜'}
                    </Typography>
                  </Box>
                )}
              </Box>
              <IconButton
                onClick={(event) => handleMenuClick(event, reply.id)}
                color="default"
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && menuReplyId === reply.id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleEditClick(reply)}>수정</MenuItem>
              <MenuItem onClick={handleDelete}>삭제</MenuItem>
            </Menu>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}

export default ReplyList;
