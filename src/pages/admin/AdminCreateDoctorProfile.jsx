import React, { useState } from "react";
import MainContainer from "../../components/global/MainContainer";
import { Paper, Typography, Box, TextField, Button, Dialog, DialogTitle} from "@mui/material";
import { theme } from "../../utils/theme";
import { ThemeProvider } from '@mui/material/styles';
import { axiosInstance } from "../../utils/axios";
import { Loading } from "../../components/Loading";
import { useLocation, useNavigate } from "react-router";


export const AdminCreateDoctorProfile = () =>{

  const location = useLocation();
  const userDetail = location.state.userDetail;
  const navigate = useNavigate();

  const [searchHospitalDialogOpen, setSearchHospitalDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [hospitalSelectDialogOpen, setHospitalSelectDialogOpen] = useState(false);
  const [hospitals, setHospitals] = useState(null);
  const [scroll, setScroll] = useState('paper');
  const [loading, setLoading] = useState(false);

  const [selectHospital, setSelectHospital] = useState({id: null, name: ''});
  const [selectDepartment, setSelectDepartment] = useState({id: null, name: ''});

  const OnCloseSearchHospitalDialog = () => {
    setSearchHospitalDialogOpen(false);
  }

  const OnCloseSearchDepartmentDialog = () => {
    setDepartmentDialogOpen(false);
  }

  const onCloseHospitalSelectDialog = () =>{
    setHospitalSelectDialogOpen(false)
  }

  const OnClickSearchButton = async (hospitalName) => {
    try{
      if(hospitalName.length == 0) return;
      setLoading(true);
      const response = await axiosInstance.get(`/api/hospitals/contained-name`, {params: {name : hospitalName}});
      setHospitals(response.data);
      setHospitalSelectDialogOpen(true);
      OnCloseSearchHospitalDialog();
      setLoading(false);
    } catch(exception){
      console.log(exception);
    }
  }

  const OnClickCreateProfile = async () => {
    try{
      console.log(userDetail);
      const userId = userDetail.id;
      const hospitalId = selectHospital.id;
      const major = selectDepartment.name;
      const response = await axiosInstance.post('/admin/doctors', {userId, hospitalId, major});
      navigate('/admin-page/user-list');
    } catch(exception){
      console.log(exception);
    }
  }

  const OnClickSelectHospital = (id, name) => {
    setSelectHospital({id, name});
    onCloseHospitalSelectDialog();
  }

  const OnClickSelectDepartment = (id, name) => {
    setSelectDepartment({id, name});
    console.log(selectDepartment);
    OnCloseSearchDepartmentDialog();
  }

  const DepartmentListComponent = () => {
    const hospital = hospitals.filter(hospital => hospital.id===selectHospital.id);
    const hospitalDepartments = hospital[0].hospitalDepartments;
    return hospitalDepartments.map(hospitalDepartment =>(
      <Box fullWidth sx={{height: '30px', padding: '10px', margin: '15px 0 auto', border: '1px solid #BCBDBC' }}>
        <Typography variant="body1" sx={{margin: '3px 10px 0 auto',display: 'inline-block'}}>{hospitalDepartment.department.name}</Typography>
        <Button variant="contained" color='black' size="small" sx={{float:'right'}} onClick={(e) => OnClickSelectDepartment(hospitalDepartment.department.id, hospitalDepartment.department.name)}>선택</Button>
      </Box>
    ));
  }

  const DepartmentListDialog = () => {
    if(!hospitals){
      OnCloseSearchDepartmentDialog();
      return;
    }

    return (
      <Dialog open={departmentDialogOpen} onClose={OnCloseSearchDepartmentDialog} scroll={scroll}>
        <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
          <DepartmentListComponent />
        </Paper>
      </Dialog>
    )
  }

  const HospitalListComponent = () => {
    let count = 0;
    return hospitals.map(hospital => (
      <Box fullWidth sx={{height: '125px', padding: '10px', margin: '15px 0 auto', border: '1px solid #BCBDBC' }}>
        <Typography variant="body1">{hospital.name}</Typography>
        <Typography variant="body1" sx={{margin: '5px 0 auto'}}>{hospital.address}</Typography>
        <Button variant="contained" color='black' onClick={(e) => {OnClickSelectHospital(hospital.id, hospital.name)}} sx={{margin: '10px 0 auto'}}>선택</Button>
      </Box>
    ));
  }

  const HospitalSelectDialog = () => {
    return(
      <Dialog open={hospitalSelectDialogOpen} onClose={onCloseHospitalSelectDialog} scroll={scroll}>
        <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
          <HospitalListComponent />
        </Paper>
      </Dialog>
    );
  }

  const SearchHospitalDialog = () => {

    const [name, setName] = useState('');

    return(
      <Dialog open={searchHospitalDialogOpen} onClose={OnCloseSearchHospitalDialog}>
        <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
          <DialogTitle>검색할 병원 이름을 입력해 주세요.</DialogTitle>
            <TextField fullWidth label='검색할 병원 이름' onChange={(e) => {setName(e.target.value)}}></TextField>
            <Button variant="contained" color='black' sx={{margin: '10px 0 auto'}} onClick={(e) => {
              OnClickSearchButton(name);
            }} >검색</Button>
            <Loading open={loading}/>
        </Paper>
      </Dialog>
    )
  }

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
      <Typography variant='h5' sx={{display: 'inline', color: '#6E6E6E'}}>
          의사 프로필
      </Typography>
      <Typography variant='body1' sx={{margin: '10px 0 auto', color: '#6E6E6E'}}>
        의사 프로필을 입력해주세요.
      </Typography>
      <Box sx={{margin: '20px 0 auto', border: '1px solid grey' }}></Box>
      <Box sx={{margin: '20px 0 auto'}}>
        <ThemeProvider theme={theme}>
          <TextField disabled label='병원' required sx={{display: 'inline-block'}} value={selectHospital.name} />
          <Button variant="contained" color='black' sx={{margin: '10px 0px 0px 15px'}} onClick={(e) => {setSearchHospitalDialogOpen(true)}}>병원 검색</Button>
          <TextField disabled label='전공' required sx={{margin: '15px 0 auto', display: 'inline-block'}} value={selectDepartment.name} />
          <Button variant="contained" color='black' sx={{margin: '25px 0px 0px 15px'}} onClick={(e) => {setDepartmentDialogOpen(true)}}>전공 선택</Button>
          <Button variant="contained" fullWidth sx={{margin: '15px 0 auto'}} color="black" onClick={OnClickCreateProfile}>생성 및 권한 변경</Button>
          <SearchHospitalDialog />
          <HospitalSelectDialog />
          <DepartmentListDialog />
        </ThemeProvider>          
      </Box>
      </Paper>
    </MainContainer>
  );
};