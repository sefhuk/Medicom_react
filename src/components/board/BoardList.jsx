import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

function BoardList({ boards = [] }) {  // 기본값을 빈 배열로 설정
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '15px', padding: 2 }}>
      {boards.length > 0 ? (  // boards가 빈 배열이라면 length는 0이므로 안전함
        <List>
          {boards.map((board) => (
            <ListItem
              key={board.id}
              button
              component={Link}
              to={`/boards/${board.id}`}
              sx={{ borderBottom: '1px solid #ddd' }}
            >
              <ListItemText primary={board.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          게시판이 없습니다.
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/boards/create"
        sx={{ marginTop: 2, width: '100%' }}
      >
        새 게시판 만들기
      </Button>
    </Box>
  );
}

export default BoardList;
