import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

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

      // 선택된 이미지 파일을 미리보기 위해 Blob URL 생성
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = { title, content, imageUrl: previewUrl }; // 수정된 정보
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
