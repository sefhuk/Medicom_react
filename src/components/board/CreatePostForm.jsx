import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

function CreatePostForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
      }
    }

    onSubmit({ title, content, imageUrl });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // 중앙 정렬
          textAlign: 'center', // 텍스트 중앙 정렬
        }}
      >
        <Typography variant="h4" gutterBottom>Create Post</Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2, mb: 2 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {previewUrl && (
          <Box sx={{ mt: 2 }}>
            <img src={previewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Create Post
        </Button>
      </Box>
    </Container>
  );
}

export default CreatePostForm;
