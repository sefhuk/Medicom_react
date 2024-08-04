import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, Link } from '@mui/material';

function PostList({ posts, boardId }) {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <Button
        component={RouterLink}
        to={`/posts/create/${boardId}`}
        variant="contained"
        color="error"
        sx={{ mb: 2 }}
      >
        Create New Post
      </Button>
      <List>
        {posts.map(post => (
          <ListItem
            key={post.id}
            sx={{
              bgcolor: '#fff',
              border: '1px solid #ddd',
              borderRadius: 1,
              p: 2,
              mb: 1,
            }}
          >
            <Link
              component={RouterLink}
              to={`/posts/${post.id}`}
              variant="body1"
              color="primary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {post.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default PostList;
