import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Avatar, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { axiosInstance } from '../../utils/axios';
import MainContainer from "../../components/global/MainContainer";
import { deleteCookie } from '../../utils/cookies';
import { userauthState } from '../../utils/atom';
import { useSetRecoilState } from 'recoil';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PostCodeModal from '../../components/PostCodeModal';
import { useRecoilValue } from 'recoil';

const theme = createTheme({
  palette: {
    black: {
      main: '#2E2F2F',
      light: '#6E6E6E',
      drak: '#151515',
      contrastText: '#E7E7E6',
    },
  },
});

const MyPage = () => {


  const [userInfo, setUserInfo] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postcodeOpen, setPostcodeOpen] = useState(false);
  const [addressData, setAddressData] = useState({ address: '', addressDetail: '' });
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);
  const auth = useRecoilValue(userauthState);
  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/login');
    }
  }, [auth, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/users/my-page', {
          headers: {
            Authorization: `${token}`
          }
        });
        setUserInfo(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEditClick = (field) => {
    setEditField(field);
    if (field === 'address') {
      setAddressData({ address: formData.address, addressDetail: formData.addressDetail });
    }
    setDialogOpen(true);
  };

  const handleSaveClick = async (field) => {
    try {
      let dataToSend = { [field]: formData[field] };
      let endpoint = `/users/my-page/${field}`;

      if (field === 'address') {
        dataToSend = addressData;
        endpoint = '/users/my-page/address';
      } else if (field === 'phoneNumber') {
        endpoint = '/users/my-page/phoneNumber';
      } else if (field === 'password') {
        dataToSend = {
          verifyPassword: formData.verifyPassword,
          alterPassword: formData.alterPassword,
        };
        endpoint = '/users/my-page/password';
      }

      await axiosInstance.put(endpoint, dataToSend);
      setUserInfo({
        ...userInfo,
        ...dataToSend
      });
      setEditField(null);
      setDialogOpen(false);
      window.location.reload();  // 새로고침
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('기존 비밀번호가 올바르지 않습니다.');
      } else {
        console.error(error);
      }
    }
  };

  const handleCancelClick = () => {
    setFormData({ ...userInfo });
    setEditField(null);
    setDialogOpen(false);
    setPostcodeOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  const handleAddressComplete = (fullAddress) => {
    setAddressData({
      ...addressData,
      address: fullAddress
    });
  };

  const handleLogoutClick = () => {
    setAuthState({ isLoggedIn: false });
    localStorage.removeItem('token');
    deleteCookie('refreshToken');
    navigate('/');
  };

  const handleMyActivity = () => {
    navigate('/my-activity');
  }

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ margin: '10px', padding: 3, borderRadius: '10px' }}>
        <ThemeProvider theme={theme}>
          <Typography variant='h5' sx={{ display: 'inline', color: '#6E6E6E' }}>
            마이페이지
          </Typography>
          <Button variant="contained" color="black" sx={{ float: 'right' }} onClick={handleMyActivity}>
            나의 활동내역
          </Button>
          <Box sx={{ margin: '20px 0', borderBottom: '1px solid grey' }}></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar sx={{ width: '40px', height: '40px', marginRight: '10px' }}>
              {userInfo ? userInfo.name[0] : 'N/A'}
            </Avatar>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {userInfo ? userInfo.role : '일반 회원'}
            </Typography>
          </Box>
          <form>
            {['name', 'birthday', 'email'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label={getFieldLabel(field)}
                  name={field}
                  type='text'
                  value={formData[field] || ''}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            ))}
            {['address', 'phoneNumber'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label={getFieldLabel(field)}
                  name={field}
                  type='text'
                  value={field === 'address' ? `${formData.address || ''} ${formData.addressDetail || ''}` : formData[field] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: editField !== field,
                  }}
                />
                {editField === field ? (
                  <>
                    <IconButton onClick={() => handleSaveClick(field)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick}>
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick(field)}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {!userInfo?.provider && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: editField !== 'password',
                  }}
                />
                {editField === 'password' ? (
                  <>
                    <IconButton onClick={() => handleEditClick('password')}>
                      <EditIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick('password')}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="contained" color="black" onClick={handleLogoutClick}>
              로그아웃
            </Button>
            <Button variant="contained" color="error">
              회원 탈퇴
            </Button>
          </Box>
        </ThemeProvider>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCancelClick}>
        <DialogTitle>{getFieldLabel(editField)}</DialogTitle>
        <DialogContent>
          {editField === 'address' ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label="주소"
                  name="address"
                  value={addressData.address}
                  onChange={handleDialogInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button variant="contained" onClick={() => setPostcodeOpen(true)} sx={{ height: '40px', marginLeft: '10px' }}>
                  주소 검색
                </Button>
              </Box>
              <TextField
                label="상세주소"
                name="addressDetail"
                value={addressData.addressDetail}
                onChange={handleDialogInputChange}
                fullWidth
                margin="normal"
              />
            </>
          ) : editField === 'password' ? (
            <>
              <TextField
                label="기존 비밀번호"
                name="verifyPassword"
                type="password"
                value={formData.verifyPassword || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="변경할 비밀번호"
                name="alterPassword"
                type="password"
                value={formData.alterPassword || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </>
          ) : (
            <TextField
              label={getFieldLabel(editField)}
              name={editField}
              type='text'
              value={formData[editField] || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="primary">
            취소
          </Button>
          <Button onClick={() => handleSaveClick(editField)} color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <PostCodeModal open={postcodeOpen} onClose={() => setPostcodeOpen(false)} onComplete={handleAddressComplete} />
    </MainContainer>
  );
};

const getFieldLabel = (field) => {
  switch (field) {
    case 'name':
      return '이름';
    case 'email':
      return '이메일 주소';
    case 'password':
      return '비밀번호';
    case 'birthday':
      return '생년월일';
    case 'address':
      return '주소';
    case 'addressDetail':
      return '상세주소';
    case 'phoneNumber':
      return '전화번호';
    default:
      return '';
  }
};

export default MyPage;
