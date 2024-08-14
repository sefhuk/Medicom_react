import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import { Btntwo, TextF } from '../../components/global/CustomComponents';

function BoardForm({ initialValues = {}, onSubmit }) {
  const [name, setName] = useState(initialValues.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <Container sx= {{display: 'flex', alignItems: 'center'}}>
      <Box sx={{ flexGrow: 1, marginTop: 2 }}>
        <Grid container spacing={2} sx={{ marginTop : '30%'}}>
           <Grid item xs={12}>
              <Box component="form" onSubmit={handleSubmit}
              sx = {{ display: 'flex', justifyContent: 'center'}}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    {initialValues.id ? '게시판 수정' : '게시판 생성'}
                  </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextF
                label="Board Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Btntwo type="submit" sx = {{width: '100%'}}>
                {initialValues.id ? 'Update Board' : 'Create Board'}
              </Btntwo>
            </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default BoardForm;
