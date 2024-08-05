import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function UpdatePostForm({ post, onUpdate }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(post.imageUrl || '');

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
    setPreviewUrl(post.imageUrl);
  }, [post]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      updatePreviewUrl(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      updatePreviewUrl(e.dataTransfer.files[0]);
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

  const handleImageUpload = async () => {
    if (!image) return null;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Image upload error:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = previewUrl;

    if (image) {
      imageUrl = await handleImageUpload();
    }

    const updatedPost = { title, content, imageUrl };
    onUpdate(updatedPost);
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
        <Typography variant="h4" gutterBottom>Update Post</Typography>
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
          Update Post
        </Button>
      </Box>
    </Container>
  );
}

export default UpdatePostForm;
