import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { format } from 'date-fns';
import { CustomScrollBox } from '../../components/CustomScrollBox';
import { axiosInstance } from '../../utils/axios';

// 스타일링된 컴포넌트
const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));

const generateTimeSlots = (startHour, endHour, interval) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      slots.push(format(time, 'HH:mm'));
    }
  }
  return slots;
};

function HospitalReservation() {
  const { hospitalid } = useParams(); // URL에서 병원 id 가져오기
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // 날짜 선택
  const [selectedTime, setSelectedTime] = useState(null); // 예약 시간 선택
  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
  }); // accordion 열림 상태 초기에 false로 설정
  const [isAvailable, setIsAvailable] = useState(true); // 예약 가능 여부

  const navigate = useNavigate();

  useEffect(() => {
    const checkAvailability = async () => {
      if (selectedDate && selectedTime) {
        try {
          const utcDate = format(selectedDate, 'yyyy-MM-dd');
          const response = await axiosInstance.get('/api/reservations/check-availability', {
            params: {
              date: utcDate,
              timeSlot: selectedTime
            }
          });
          setIsAvailable(response.data);
        } catch (error) {
          console.error('Error checking availability:', error);
        }
      }
    };

    checkAvailability();
  }, [selectedDate, selectedTime]);

  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    if (date) {
      const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      setSelectedDate(utcDate);
    } else {
      setSelectedDate(null);
    }
  };

  const today = new Date();

  // Accordion 클릭 시 열림
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prevState) => ({
      ...prevState,
      [panel]: isExpanded,
    }));
  };

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots(8, 18, 30); // 8:00 ~ 18:00, 30분 간격

  // 예약 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('모든 필드를 선택해 주세요.');
      return;
    }

    // 사용자 정보 가져오기
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    try {
      const utcDate = format(selectedDate, 'yyyy-MM-dd');

      const response = await axiosInstance.post('/api/reservations', {
        hospitalid: hospitalid,
        date: utcDate,
        timeSlot: selectedTime,
        userId, // 사용자 ID 포함
        userRole // 사용자 역할 포함
      });

      alert(response.data);
      navigate('/success'); // 성공 시 성공 페이지로 이동
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('예약을 처리하는 동안 오류가 발생했습니다.');
      }
    }
  };

  return (
    <MainContainer>
      <CustomScrollBox>

        {/* 예약 날짜 선택 */}
        <Accordion expanded={expanded.panel1} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>예약 날짜</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="날짜 선택"
                  value={selectedDate}
                  minDate={today} //오늘 날짜 이전 선택 불가
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 예약 시간 선택 */}
        <Accordion expanded={expanded.panel2} onChange={handleAccordionChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>예약 시간</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Grid container spacing={2}>
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
          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || !isAvailable}
          >
            예약 제출
          </button>
        </Box>
      </CustomScrollBox>
    </MainContainer>
  );
}

export default HospitalReservation;
