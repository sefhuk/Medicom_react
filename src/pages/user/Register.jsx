import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';



const Register = () => {
    const navigate = useNavigate();

    return(
        <Typography elevation={6} sx={{padding: 3}}>회원가입</Typography>
    );
};

export default Register;