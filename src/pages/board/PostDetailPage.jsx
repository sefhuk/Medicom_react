// PostDetailPage.js
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
        // 댓글을 생성일 기준으로 오름차순으로 정렬
        const sortedComments = response.data.content.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setComments(sortedComments);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      })
      .catch(error => console.error('댓글 가져오기 오류:', error));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('포스트 가져오기 오류:', error));

    fetchComments(0);
  }, [id, fetchComments]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/comments', { postId: id, content: commentText })
      .then(response => {
        // 새 댓글을 댓글 배열의 맨 아래에 추가
        setComments([...comments, response.data]);
        setCommentText('');
      })
      .catch(error => console.error('댓글 추가 오류:', error));
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/posts/${id}`);
      navigate('/boards');
    } catch (error) {
      console.error('포스트 삭제 오류:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/comments/${commentId}`);
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
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            style={{ maxWidth: '50%', height: 'auto' }}
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
