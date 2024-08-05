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
      updatePreviewUrl(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      updatePreviewUrl(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const updatePreviewUrl = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
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
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
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
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            border: '2px dashed grey',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            mb: 2,
            width: '100%',
            cursor: 'pointer',
            position: 'relative'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Typography>Drag & Drop your image here or click to select</Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        {previewUrl && (
          <Box sx={{ mb: 2 }}>
            <img src={previewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: 2 }} />
          </Box>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Create Post
        </Button>
      </Box>
    </Container>
  );
}

export default CreatePostForm;
