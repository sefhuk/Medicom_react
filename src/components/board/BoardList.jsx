import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Btn, TextF } from '../../components/global/CustomComponents';

function BoardList({ boards = [] }) {
  const userRole = localStorage.getItem('userRole');

  return (
    <Box sx={{ width: '100%' }}>
      {boards.length > 0 ? (
        <List>
          {boards.map((board) => (
            <ListItem
              key={board.id}
              button
              component={Link}
              to={`/boards/${board.id}`}
              sx={{ borderBottom: '1px solid #ddd' }}
            >
              <ListItemIcon>
                <img 
                  src='/images/Contract.png'
                  alt="Board Icon" 
                  style={{ width: 30, height: 30, borderRadius: '50%' }} 
                />
              </ListItemIcon>
              <ListItemText primary={board.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          게시판이 없습니다.
        </Typography>
      )}

      {userRole === 'ADMIN' && (
        <Box sx = {{display: 'flex', justifyContent: 'center'}}>
        <Btn
          component={Link}
          to="/boards/create"
          sx={{ marginTop: 2, width: '30%', py: 3 }}
          >
          새 게시판 만들기
        </Btn>
        </Box>
        
      )}
    </Box>
  );
}

export default BoardList;
