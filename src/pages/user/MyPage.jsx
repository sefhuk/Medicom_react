import MainContainer from "../../components/global/MainContainer";
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, TextField, Button, IconButton } from '@mui/material';
import { Paper }  from '@mui/material';
import { axiosInstance } from '../../utils/axios';
import Snackbar from '@mui/material/Snackbar';



const MyPage = () => {

    return (
        <MainContainer>
            <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>

            </Paper>
        </MainContainer>
    );
};


export default MyPage;