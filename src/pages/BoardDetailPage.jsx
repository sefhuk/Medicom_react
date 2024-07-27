import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PostList from '../components/board/PostList';
import MainContainer from '../components/global/MainContainer';

function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/boards/${id}`)
      .then(response => setBoard(response.data))
      .catch(error => console.error('Error fetching board:', error));

    axios.get(`http://localhost:8080/posts/board/${id}`)
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, [id]);

  const handleDeleteBoard = async () => {
    try {
      await axios.delete(`http://localhost:8080/boards/${id}`);
      navigate('/boards');
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  if (!board) return <p>Loading...</p>;

  return (
    <MainContainer>
      <div>
        <h1>{board.name}</h1>
        <button onClick={handleDeleteBoard}>Delete Board</button>
        <PostList posts={posts} boardId={id} />
      </div>
    </MainContainer>
  );
}

export default BoardDetailPage;
