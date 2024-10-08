import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainContainer from '../../components/global/MainContainer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format } from 'date-fns'; // 날짜 형식 변환
import { CustomScrollBox } from '../../components/CustomScrollBox';
import { axiosInstance } from '../../utils/axios';

// 스타일링된 컴포넌트
const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
}));

const generateTimeSlots = (startHour, endHour, interval) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      slots.push(format(time, 'HH:mm')); // 시간을 hh:mm 형식으로 변환 저장
    }
  }
  return slots;
};

function HospitalReservation() {
  const { hospitalid } = useParams(); // URL에서 병원 id 가져오기
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // 진료과 선택
  const [selectedDate, setSelectedDate] = useState(null); // 날짜 선택
  const [selectedTime, setSelectedTime] = useState(null); // 예약 시간 선택
  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
  }); // accordion 열림 상태 초기에 false로 설정

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/hospitals/${hospitalid}/departments`);
        setDepartments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [hospitalid]);

  // 진료과 선택 핸들러
  const handleDepartmentChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedDepartment(value);
    } else {
      setSelectedDepartment("");
    }
  };

  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    if (date) {
      // 날짜를 UTC로 변환하고 시간 부분을 설정
      const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      setSelectedDate(utcDate);
    } else {
      setSelectedDate(null);
    }
  };

  // Accordion 클릭 시 열림
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prevState) => ({
      ...prevState,
      [panel]: isExpanded,
    }));
  };

  // 시간 슬롯
  const timeSlots = generateTimeSlots(8, 18, 30); // 8:00 ~ 18:00, 30분 간격

  // 예약 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedDepartment) {
      alert('모든 필드를 선택해 주세요.');
      return;
    }
    try {
      // 날짜를 UTC로 변환
      const utcDate = format(selectedDate, 'yyyy-MM-dd');

      //instance
      const response = await axiosInstance.post('http://localhost:8080/api/reservations', {
        department: selectedDepartment,
        date: utcDate, // UTC로 변환된 날짜를 전송
        timeSlot: selectedTime
      });
      alert(response.data);
    } catch (error) {
      alert('예약을 처리하는 동안 오류가 발생했습니다.');
    }
  };

  return (
    <MainContainer>
      <CustomScrollBox>
        {/* 진료받으실 과 선택 */}
        <Accordion expanded={expanded.panel1} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>진료받으실 과를 선택해주세요</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {departments.map((department) => (
                <CustomFormControlLabel
                  key={department.id} // 각 부서가 고유한 `id`를 가진다고 가정
                  control={
                    <Checkbox
                      value={department.name}
                      checked={selectedDepartment === department.name}
                      onChange={handleDepartmentChange}
                    />
                  }
                  label={department.name} // 부서 이름 표시
                  sx={{
                    backgroundColor: selectedDepartment === department.name ? 'lightblue' : 'transparent',
                    borderRadius: '4px',
                    padding: '8px',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 예약 날짜 선택 */}
        <Accordion expanded={expanded.panel2} onChange={handleAccordionChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>예약 날짜</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="날짜 선택"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 예약 시간 선택 */}
        <Accordion expanded={expanded.panel3} onChange={handleAccordionChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>예약 시간</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Grid container spacing={2}> {/* grid로 한 줄에 세 개씩 정렬 */}
                {timeSlots.map((slot) => (
                  <Grid item xs={4} key={slot}>
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          value={slot}
                          checked={selectedTime === slot}
                          onChange={(event) => setSelectedTime(event.target.checked ? slot : null)}
                        />
                      }
                      label={slot}
                      sx={{
                        backgroundColor: selectedTime === slot ? 'lightblue' : 'transparent',
                        borderRadius: '4px',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 예약 제출 버튼 */}
        <Box mt={2}>
          <button onClick={handleSubmit} disabled={!selectedDepartment || !selectedDate || !selectedTime}>
            예약 제출
          </button>
        </Box>
      </CustomScrollBox>
    </MainContainer>
  );
}

export default HospitalReservation;
