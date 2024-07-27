import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CommentList from '../components/board/CommentList';
import MainContainer from '../components/global/MainContainer';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('Error fetching post:', error));

    axios.get(`http://localhost:8080/comments/post/${id}`)
      .then(response => setComments(response.data))
      .catch(error => console.error('Error fetching comments:', error));
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/comments', { postId: id, content: commentText })
      .then(response => {
        setComments([...comments, response.data]);
        setCommentText('');
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  if (!post) return <p>Loading...</p>;

  return (
  <MainContainer>
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <form onSubmit={handleCommentSubmit}>
        <label>
          Add Comment:
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} />
        </label>
        <button type="submit">Add Comment</button>
      </form>
      <CommentList comments={comments} />
    </div>
    </MainContainer>
  );
}

export default PostDetailPage;
