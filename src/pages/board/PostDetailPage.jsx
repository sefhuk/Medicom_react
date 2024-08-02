import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CommentList from '../../components/board/CommentList';
import Pagination from '../../components/board/CommentPagination';
import MainContainer from '../../components/global/MainContainer';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchComments = useCallback((page) => {
    axios.get(`http://localhost:8080/comments/post/${id}?page=${page}&size=6`)
      .then(response => {
        const sortedComments = response.data.content.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setComments(sortedComments);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      })
      .catch(error => console.error('댓글 가져오기 오류:', error));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => {
        console.log('Fetched post data:', response.data);
        setPost(response.data);
      })
      .catch(error => console.error('포스트 가져오기 오류:', error));

    fetchComments(0);
  }, [id, fetchComments]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/comments', { postId: id, content: commentText })
      .then(response => {
        console.log('New comment added:', response.data);
        setComments([...comments, response.data]);
        setCommentText('');
      })
      .catch(error => console.error('댓글 추가 오류:', error));
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/posts/${id}`);
      console.log('Post deleted successfully');
      navigate('/boards');
    } catch (error) {
      console.error('포스트 삭제 오류:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/comments/${commentId}`);
      console.log('Comment deleted successfully:', commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await axios.put(`http://localhost:8080/comments/${commentId}`, {
        postId: id,
        content: content,
      });
      console.log('Comment updated successfully:', response.data);
      setComments(comments.map(comment => comment.id === commentId ? response.data : comment));
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  const handleReplyComment = async (parentId, content) => {
    try {
      const response = await axios.post('http://localhost:8080/comments', {
        postId: id,
        content: content,
        parentId: parentId
      });
      console.log('Reply added successfully:', response.data);
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
      console.error('답글 추가 오류:', error);
    }
  };

  const handlePageChange = (page) => {
    fetchComments(page);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <MainContainer>
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        {post.imageUrls && post.imageUrls.length > 0 && (
          <img
            src={post.imageUrls[0].link} // 첫 번째 이미지 링크를 사용
            alt="Post"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
        <Link to={`/posts/update/${id}`}>
          <button>Edit Post</button>
        </Link>
        <button onClick={handleDeletePost}>Delete Post</button>
        <form onSubmit={handleCommentSubmit}>
          <label>
            Add Comment:
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} />
          </label>
          <button type="submit">Add Comment</button>
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
      </div>
    </MainContainer>
  );
}

export default PostDetailPage;
