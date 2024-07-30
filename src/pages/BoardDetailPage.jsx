import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostList from '../components/board/PostList';
import MainContainer from '../components/global/MainContainer';
import Pagination from '../components/board/Pagination';

function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/boards/${id}`)
      .then(response => setBoard(response.data))
      .catch(error => console.error('Error fetching board:', error));

    axios.get(`http://localhost:8080/posts/board/${id}?page=${currentPage}&size=6`)
      .then(response => {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, [id, currentPage]);

  const handleDeleteBoard = async () => {
    try {
      await axios.delete(`http://localhost:8080/boards/${id}`);
      navigate('/boards');
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!board) return <p>Loading...</p>;

  return (
    <MainContainer>
      <h1>{board.name}</h1>
      <button onClick={handleDeleteBoard}>Delete Board</button>
      <Link to={`/boards/update/${id}`}>
        <button>Edit Board</button>
      </Link>
      <PostList posts={posts} boardId={id} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </MainContainer>
  );
}

export default BoardDetailPage;
