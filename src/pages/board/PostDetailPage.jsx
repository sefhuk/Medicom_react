import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CommentList from '../../components/board/CommentList';
import Pagination from '../../components/board/CommentPagination';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress, Alert, TextField, Typography, Box, Grid } from '@mui/material';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [boardId, setBoardId] = useState(null);

  const fetchComments = useCallback((page) => {
    setLoading(true);
    axios.get(`http://localhost:8080/comments/post/${id}?page=${page}&size=6`)
      .then(response => {
        const sortedComments = response.data.content.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setComments(sortedComments);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      })
      .catch(error => setError('댓글을 가져오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => {
        setPost(response.data);
        setBoardId(response.data.boardId);
      })
      .catch(error => setError('포스트를 가져오는 데 실패했습니다.'));

    fetchComments(0);
  }, [id, fetchComments]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === '') {
      alert('댓글을 입력해주세요.');
      return;
    }
    axios.post('http://localhost:8080/comments', { postId: id, content: commentText })
      .then(response => {
        setComments([...comments, response.data]);
        setCommentText('');
      })
      .catch(error => setError('댓글을 추가하는 데 실패했습니다.'));
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/posts/${id}`);
      if (boardId) {
        navigate(`/boards/${boardId}`);
      } else {
        navigate('/boards');
      }
    } catch (error) {
      setError('포스트 삭제에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await axios.put(`http://localhost:8080/comments/${commentId}`, {
        postId: id,
        content: content,
      });
      setComments(comments.map(comment => comment.id === commentId ? response.data : comment));
    } catch (error) {
      setError('댓글 업데이트에 실패했습니다.');
    }
  };

  const handleReplyComment = async (parentId, content) => {
    try {
      const response = await axios.post('http://localhost:8080/comments', {
        postId: id,
        content: content,
        parentId: parentId
      });
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data]
          };
        }
        return comment;
      }));
    } catch (error) {
      setError('답글 추가에 실패했습니다.');
    }
  };

  const handlePageChange = (page) => {
    fetchComments(page);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return <p>포스트를 불러오는 중입니다...</p>;

  return (
    <MainContainer>
      <br />
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4">{post.title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Link to={`/posts/update/${id}`}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>UPDATE</Button>
        </Link>
        <Button variant="contained" color="error" onClick={handleDeletePost}>DELETE</Button>
      </Box>
      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Grid container spacing={2}>
          {post.imageUrls.map((img, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <img
                src={img.link}
                alt={`image-${index}`}
                style={{ maxWidth: '100%', height: 'auto', marginTop: '16px' }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <form onSubmit={handleCommentSubmit}>
        <TextField
          label="Add Comment..."
          multiline
          rows={2}
          variant="outlined"
          fullWidth
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Comment
        </Button>
      </form>
      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
        onUpdate={handleUpdateComment}
        onReply={handleReplyComment}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </MainContainer>
  );
}

export default PostDetailPage;
