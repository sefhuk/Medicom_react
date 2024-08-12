import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';

function PostList({ posts = [], boardId }) {  // posts에 기본값 설정
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Posts</Typography>
        <Button
          component={RouterLink}
          to={`/posts/create/${boardId}`}
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Create New Post
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '15px', boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell align="right">작성자</TableCell>
              <TableCell align="right">작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length > 0 ? (  // posts 배열이 비어있지 않은지 확인
              posts.map((post) => (
                <TableRow key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Link
                      component={RouterLink}
                      to={`/posts/${post.id}`}
                      variant="body1"
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {post.title || 'No Title'}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{post.userName || 'Unknown User'}</TableCell>
                  <TableCell align="right">
                    {post.updatedAt
                      ? new Date(post.updatedAt).toLocaleDateString()
                      : (post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : 'Unknown Date')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No posts available</TableCell>  // 데이터가 없을 때 메시지 표시
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PostList;
