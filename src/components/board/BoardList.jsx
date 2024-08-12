import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

function BoardList({ boards }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>Board List</Typography>
        <Button variant="contained" color="primary" component={Link} to="/boards/create" sx={{ mb: 2 }}>
          Create New Board
        </Button>
        <List>
          {boards?.map(board => (
            <ListItem key={board.id} button component={Link} to={`/boards/${board.id}`}>
              <ListItemText primary={board.name} />
            </ListItem>
          )) || (
            <Typography variant="body1" color="textSecondary">
              게시판이 없습니다.
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
}

export default BoardList;
