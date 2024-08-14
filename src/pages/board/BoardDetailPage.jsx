import React, { useEffect, useState, useCallback } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostList from '../../components/board/PostList';
import MainContainer from '../../components/global/MainContainer';
import Pagination from '../../components/board/Pagination';
import PostSearchBar from '../../components/board/PostSearchBar';
import { Grid, Container, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Box, Typography } from '@mui/material';
import { Btn, TextF, SmallBtn } from '../../components/global/CustomComponents';

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

    const handleSortChange = (newSortType) => {
        setSortType(newSortType);
        setCurrentPage(0); // 정렬 기준이 바뀔 때 페이지를 초기화
        fetchPosts(0, searchQuery, newSortType);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!board) return <p>게시판을 불러오는 중입니다...</p>;

    return (
        <MainContainer>
            <Container>
                <Box sx={{ flexGrow: 1, marginTop: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {board.name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <PostSearchBar onSearch={handleSearch} />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex' }}>
                                <Btn
                                    onClick={() => handleSortChange('default')}
                                    sx={{
                                        color: sortType === 'default' ? 'black' : 'text.primary',
                                        fontWeight: sortType === 'default' ? 'bold' : 'normal',
                                        textTransform: 'none',
                                    }}
                                >
                                    최신순
                                </Btn>
                                <Btn
                                    onClick={() => handleSortChange('views')}
                                    sx={{
                                        color: sortType === 'views' ? 'black' : 'text.primary',
                                        fontWeight: sortType === 'views' ? 'bold' : 'normal',
                                        textTransform: 'none',
                                    }}
                                >
                                    조회수순
                                </Btn>
                                <Btn
                                    onClick={() => handleSortChange('likes')}
                                    sx={{
                                        color: sortType === 'likes' ? 'black' : 'text.primary',
                                        fontWeight: sortType === 'likes' ? 'bold' : 'normal',
                                        textTransform: 'none'
                                    }}
                                >
                                    추천순
                                </Btn>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ml: 'auto' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {(userRole === 'ADMIN' || loggedInUserId === board.userId) && (
                                            <>
                                                <Btn component={Link} to={`/boards/update/${id}`} sx={{ marginRight: 1, width: '15px' }}>
                                                    UPDATE
                                                </Btn>
                                                <Btn onClick={() => setOpenDialog(true)} sx={{ bgcolor: 'red', width: '15px' }}>
                                                    DELETE
                                                </Btn>
                                            </>
                                        )}
                                    </Box>
                                    <Btn component={Link} to={`/posts/create/${id}`} sx={{ ml: 2, width: '15px' }}>
                                        글쓰기
                                    </Btn>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <PostList posts={posts} boardId={id} />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                            </Box>
                        </Grid>  
                    </Grid>
                </Box>
            </Container>

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
