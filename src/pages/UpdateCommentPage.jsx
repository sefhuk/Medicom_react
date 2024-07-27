import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MainContainer from '../components/global/MainContainer';

function UpdateCommentPage() {
  const { commentId } = useParams();
  const [comment, setComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/comments/${commentId}`)
      .then(response => {
        setComment(response.data);
        setCommentText(response.data.content);
      })
      .catch(error => console.error('Error fetching comment:', error));
  }, [commentId]);

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/comments/${commentId}`, { content: commentText });
      navigate(`/posts/${comment.postId}`);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  if (!comment) return <p>Loading...</p>;

  return (
    <MainContainer>
      <form onSubmit={handleUpdateComment}>
        <label>
          Edit Comment:
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} />
        </label>
        <button type="submit">Update Comment</button>
      </form>
    </MainContainer>
  );
}

export default UpdateCommentPage;
