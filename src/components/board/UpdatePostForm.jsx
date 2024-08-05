// UpdatePostForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { storage } from '../../firebase'; // Firebase 설정 파일 가져오기
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

      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
        mt: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>Update Post</Typography>
      <TextField
        variant="outlined"
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
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
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2, display: 'block', mx: 'auto' }}
      >
        Upload Image
        <input
          type="file"
          hidden
          onChange={handleImageChange}
        />
      </Button>
      {previewUrl && (
        <Box sx={{ mb: 2 }}>
          <img src={previewUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: 2 }} />
        </Box>
      )}
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        Update Post
      </Button>
    </Box>
  );
}

export default UpdatePostForm;
