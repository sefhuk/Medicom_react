import React, { useEffect, useState, useCallback } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostList from '../../components/board/PostList';
import MainContainer from '../../components/global/MainContainer';
import Pagination from '../../components/board/Pagination';
import PostSearchBar from '../../components/board/PostSearchBar';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Btn, SmallBtn } from '../../components/global/CustomComponents'; // Btn과 SmallBtn 컴포넌트를 import합니다.

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `${token}`
    };
};

function BoardDetailPage() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [sortType, setSortType] = useState('default');
    const navigate = useNavigate();

    const userRole = localStorage.getItem('userRole');
    const loggedInUserId = Number(localStorage.getItem('userId'));

    // Fetch posts with search and sort functionality
    const fetchPosts = useCallback((page, query, sort) => {
        setLoading(true);
        let url = `/posts/board/${id}`;
        if (sort === 'views') {
            url = `/posts/board/${id}/sortedByViewCount`;
        } else if (sort === 'likes') {
            url = `/posts/board/${id}/sortedByLikeCount`;
        }

        axiosInstance.get(url, {
            params: {
                title: query || '',
                page: page,
                size: 6
            },
            headers: getAuthHeaders()
        })
        .then(response => {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch(() => setError('게시물을 가져오는 데 실패했습니다.'))
        .finally(() => setLoading(false));
    }, [id]);

    // Fetch board info and posts initially
    useEffect(() => {
        axiosInstance.get(`/boards/${id}`, { headers: getAuthHeaders() })
            .then(response => setBoard(response.data))
            .catch(() => setError('게시판 정보를 가져오는 데 실패했습니다.'));

        fetchPosts(currentPage, searchQuery, sortType);
    }, [id, currentPage, searchQuery, sortType, fetchPosts]);

    const handleDeleteBoard = async () => {
        try {
            await axiosInstance.delete(`/boards/${id}`, { headers: getAuthHeaders() });
            navigate('/boards');
        } catch {
            setError('게시판 삭제에 실패했습니다.');
        } finally {
            setOpenDialog(false);
        }
    };

    const handleSearch = (result) => {
        setPosts(result.content);
        setTotalPages(result.totalPages);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchPosts(page, searchQuery, sortType);
    };

    const handleSortChange = (event, newSortType) => {
        if (newSortType !== null) {
            setSortType(newSortType);
            setCurrentPage(0); // 정렬 기준이 바뀔 때 페이지를 초기화
            fetchPosts(0, searchQuery, newSortType);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!board) return <p>게시판을 불러오는 중입니다...</p>;

    return (
        <MainContainer>
            <Box sx={{ marginTop: 2, padding: '0 16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                    <PostSearchBar onSearch={handleSearch} boardId={id} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{board.name}</Typography>
                    {(userRole === 'ADMIN' || loggedInUserId === board.userId) && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <SmallBtn
                          component={Link}
                          to={`/boards/update/${id}`}
                          variant="contained"
                          color="primary"
                        >
                            UPDATE
                        </SmallBtn>
                        <SmallBtn
                          variant="contained"
                          color="error"
                          onClick={() => setOpenDialog(true)}
                        >
                            DELETE
                        </SmallBtn>
                    </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                    <ToggleButtonGroup
                        value={sortType}
                        exclusive
                        onChange={handleSortChange}
                        aria-label="sort posts"
                        sx={{ marginBottom: 2 }}
                    >
                        <ToggleButton value="default" aria-label="latest">
                            최신순
                        </ToggleButton>
                        <ToggleButton value="views" aria-label="views">
                            조회수순
                        </ToggleButton>
                        <ToggleButton value="likes" aria-label="likes">
                            추천순
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <PostList posts={posts} boardId={id} />
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>게시판 삭제</DialogTitle>
                <DialogContent>정말로 게시판을 삭제하시겠습니까?</DialogContent>
                <DialogActions>
                    <Btn onClick={() => setOpenDialog(false)} color="primary">취소</Btn>
                    <Btn onClick={handleDeleteBoard} color="error">삭제</Btn>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
}

export default BoardDetailPage;
