import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell align="right">작성자</TableCell>
              <TableCell align="right">작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Link
                    component={RouterLink}
                    to={`/posts/${post.id}`}
                    variant="body1"
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell align="right">{post.userName}</TableCell>
                <TableCell align="right">
                  {post.updatedAt
                    ? new Date(post.updatedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PostList;
