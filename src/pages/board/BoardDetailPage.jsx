import React, { useEffect, useState, useCallback } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostList from '../../components/board/PostList';
import MainContainer from '../../components/global/MainContainer';
import Pagination from '../../components/board/Pagination';
import PostSearchBar from '../../components/board/PostSearchBar';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';

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
    const navigate = useNavigate();

    const fetchPosts = useCallback((page, query) => {
        setLoading(true);
        axiosInstance.get(`/posts/board/${id}`, {
            params: {
                title: query || '', // 검색어가 없으면 빈 문자열로 전체 게시물 검색
                page: page,
                size: 6
            }
        })
        .then(response => {
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch(() => setError('게시물을 가져오는 데 실패했습니다.'))
        .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        axiosInstance.get(`/boards/${id}`)
            .then(response => setBoard(response.data))
            .catch(() => setError('게시판 정보를 가져오는 데 실패했습니다.'));

        fetchPosts(currentPage, searchQuery);
    }, [id, currentPage, searchQuery, fetchPosts]);

    const handleDeleteBoard = async () => {
        try {
            await axiosInstance.delete(`/boards/${id}`);
            navigate('/boards');
        } catch {
            setError('게시판 삭제에 실패했습니다.');
        } finally {
            setOpenDialog(false);
        }
    };

    const handleSearch = (data) => {
        setPosts(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(0); // 페이지 리셋
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!board) return <p>게시판을 불러오는 중입니다...</p>;

    return (
        <MainContainer>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <PostSearchBar onSearch={handleSearch} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1>{board.name}</h1>
                <div>
                    <Link to={`/boards/update/${id}`}>
                        <Button variant="contained" color="primary" style={{ marginRight: '8px' }}>UPDATE</Button>
                    </Link>
                    <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>Delete</Button>
                </div>
            </div>
            <PostList posts={posts} boardId={id} />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>게시판 삭제</DialogTitle>
                <DialogContent>정말로 게시판을 삭제하시겠습니까?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">취소</Button>
                    <Button onClick={handleDeleteBoard} color="error">삭제</Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
}

export default BoardDetailPage;
