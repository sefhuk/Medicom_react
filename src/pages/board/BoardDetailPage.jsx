import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostList from '../../components/board/PostList';
import MainContainer from '../../components/global/MainContainer';
import Pagination from '../../components/board/Pagination';
import SearchBar from '../../components/board/SearchBar';

function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchPosts = useCallback((page, query) => {
    axios.get(`http://localhost:8080/posts/board/${id}`, {
      params: {
        title: query,
        page: page,
        size: 6
      }
    })
      .then(response => {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8080/boards/${id}`)
      .then(response => setBoard(response.data))
      .catch(error => console.error('Error fetching board:', error));

    fetchPosts(currentPage, searchQuery);
  }, [id, currentPage, searchQuery, fetchPosts]);

  const handleDeleteBoard = async () => {
    try {
      await axios.delete(`http://localhost:8080/boards/${id}`);
      navigate('/boards');
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleSearch = (data) => {
    if (data.content.length === 0) {
      alert("No results found");
    } else {
      setPosts(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(0); // Reset
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
      <SearchBar onSearch={handleSearch} searchType="posts" />
      <PostList posts={posts} boardId={id} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </MainContainer>
  );
}

export default BoardDetailPage;
