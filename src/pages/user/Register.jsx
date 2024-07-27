import React, { useState, IconButton, CloseIcon} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, TextField, Button } from '@mui/material';
import MainContainer from '../../components/global/MainContainer';
import { Paper }  from '@mui/material';
import { axiosInstance } from '../../utils/axios';
import Snackbar from '@mui/material/Snackbar';


const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const [SnackbarOpen, setSnackbarOpen] = useState(false);

  const EmailValidation = () => {
    let check = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return !check.test(email);
  }

  const PhonenumberValidation = () => {
    let check = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return !check.test(phoneNumber);
  }

  const OnSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axiosInstance.post('/users', {
        email, password, phoneNumber, name, birthday, address, addressDetail});

      console.log(response.data);
      setSnackbarOpen(true);
    } catch (exception){
      console.log(exception);
    };    
  }

  const SnackCloseHandle =  (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setSnackbarOpen(false);
    navigate('/login');
  };

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
        <Typography variant='h5' align='center' gutterBottom sx={{margin: '0px 0px 30px 0px'}}>회원 가입</Typography>
        <form>
          <TextField label="이메일" type='email' size='small' error={EmailValidation()} sx={{margin: '0px 0px 10px 0px'}} fullWidth
            onChange={(e) => {
              setEmail(e.target.value);
            }} helperText={EmailValidation() ? "이메일 형식이 잘못되었습니다." : ""}></TextField>

          <TextField label="비밀번호" type='password' size='small' sx={{margin: '0px 0px 10px 0px'}} fullWidth
            onChange={(e)=> {
              setPassword(e.target.value);
            }}></TextField>
            
          <TextField label="휴대폰 번호" type='phoneNumber' size='small' error={PhonenumberValidation()} sx={{margin: '0px 0px 10px 0px'}} fullWidth
            onChange={(e) => {
              setPhoneNumber(e.target.value)
            }} helperText={PhonenumberValidation() ? "휴대폰 번호의 형식이 잘못되었습니다." : ""}></TextField>

          <TextField label="닉네임" type='name' size='small' sx={{margin: '0px 0px 10px 0px'}} fullWidth
            onChange={(e) => {
              setName(e.target.value);
            }}></TextField>

          <TextField label="생년월일" type='birthday' size='small' sx={{margin: '0px 0px 10px 0px'}} fullWidth
            onChange={(e) => { 
              setBirthday(e.target.value);
            }}></TextField>
            
          <TextField label="주소" type='address' size='small' sx={{margin: '0px 0px 10px 0px'}} fullWidth
            onChange={(e) => {
              setAddress(e.target.value);
            }}></TextField>

          <TextField label="상세주소" type='addressDetail' size='small' fullWidth
            onChange={(e) => {
              setAddressDetail(e.target.value);
            }}></TextField>

          <Button type='submit' variant="contained" fullWidth sx={{ borderRadius: '5px', margin: '15px 0'}}
           onClick={OnSubmit}>가입</Button>
          <Snackbar open={SnackbarOpen} autoHideDuration={3000} onClose={SnackCloseHandle} message="회원가입이 완료되었습니다."></Snackbar>
        </form>
        
      </Paper>
    </MainContainer>      
  );
};

export default Register;