import React, { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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

  const handleCancelEdit = () => {
    setEditReplyId(null);
    setEditContent('');
  };

  const handleReply = () => {
    onReply(parentId, replyContent);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyContent('');
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
