import React, { useState, useCallback, useEffect } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CommentList from '../../components/board/CommentList';
import Pagination from '../../components/board/CommentPagination';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress, Alert, TextField, Typography, Box, Dialog, DialogContent } from '@mui/material';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null); // New state for user name

  function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `${token}`
    };
  }

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`, { headers: getAuthHeaders() });
      setPost(response.data);
      setBoardId(response.data.boardId);
      setUserId(response.data.userId);
      setUserName(response.data.userName); // Set user name
    } catch (error) {
      setError('포스트를 가져오는 데 실패했습니다.');
    }
  };

  const fetchComments = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/post/${id}?page=${page}&size=6`, { headers: getAuthHeaders() });
      const sortedComments = response.data.content.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setComments(sortedComments);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      setError('댓글을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments(0);
  }, [fetchComments, id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 추가할 수 있습니다.');
      return;
    }

    if (commentText.trim() === '') {
      alert('댓글을 입력해주세요.');
      return;
    }
    try {
      const response = await axiosInstance.post('/comments', { postId: id, content: commentText, userName }, { headers: getAuthHeaders() });
      setComments([...comments, response.data]);
      setCommentText('');
    } catch (error) {
      setError('댓글을 추가하는 데 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!isLoggedIn()) {
      alert('로그인 후 포스트를 삭제할 수 있습니다.');
      return;
    }
    if (post.userId !== userId) {
      alert('이 포스트를 삭제할 권한이 없습니다.');
      return;
    }
    try {
      await axiosInstance.delete(`/posts/${id}`, { headers: getAuthHeaders() });
      navigate(boardId ? `/boards/${boardId}` : '/boards');
    } catch (error) {
      setError('포스트 삭제에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 삭제할 수 있습니다.');
      return;
    }
    const comment = comments.find(comment => comment.id === commentId);
    if (comment.userId !== userId) {
      alert('이 댓글을 삭제할 권한이 없습니다.');
      return;
    }
    try {
      await axiosInstance.delete(`/comments/${commentId}`, { headers: getAuthHeaders() });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글을 수정할 수 있습니다.');
      return;
    }
    const comment = comments.find(comment => comment.id === commentId);
    if (comment.userId !== userId) {
      alert('이 댓글을 수정할 권한이 없습니다.');
      return;
    }
    try {
      const response = await axiosInstance.put(`/comments/${commentId}`, { postId: id, content: content }, { headers: getAuthHeaders() });
      setComments(comments.map(comment => comment.id === commentId ? response.data : comment));
    } catch (error) {
      setError('댓글 업데이트에 실패했습니다.');
    }
  };

  const handleReplyComment = async (parentId, content) => {
    if (!isLoggedIn()) {
      alert('로그인 후 댓글에 답글을 추가할 수 있습니다.');
      return;
    }
    try {
      const response = await axiosInstance.post('/comments', { postId: id, content: content, parentId: parentId, userName }, { headers: getAuthHeaders() });
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

  const handleImageClick = (imgLink) => {
    setSelectedImage(imgLink);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return <Typography>포스트를 불러오는 중입니다...</Typography>;

  return (
    <MainContainer>
      <br />
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4">{post.title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="caption" display="block">
          {post.userName}
        </Typography>
        <Typography variant="caption" display="block">
          {new Date(post.createdAt).toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Link to={`/posts/update/${id}`}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => {
              if (!isLoggedIn()) {
                alert('로그인 후 포스트를 수정할 수 있습니다.');
                return;
              }
              if (post.userId !== userId) {
                alert('이 포스트를 수정할 권한이 없습니다.');
              }
            }}
          >
            UPDATE
          </Button>
        </Link>
        <Button variant="contained" color="error" onClick={handleDeletePost}>DELETE</Button>
      </Box>
      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {post.imageUrls.map((img, index) => (
            <img
              key={index}
              src={img.link}
              alt={`image-${index}`}
              style={{
                width: '425px',
                height: 'auto',
                objectFit: 'cover',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
              onClick={() => handleImageClick(img.link)}
            />
          ))}
        </Box>
      )}
      <br />
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
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img
            src={selectedImage}
            alt="Expanded View"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </MainContainer>
  );
}

export default PostDetailPage;
