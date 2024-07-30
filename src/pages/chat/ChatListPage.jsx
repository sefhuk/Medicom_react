import React, { useEffect, useRef, useState } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import styled from 'styled-components';
import ChatRoomDetail from '../../components/chatRoom/ChatRoomDetail';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

function ChatListPage() {
  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(['상담 진행 목록']);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const fetchData = async () => {
    setError(false);
    setData([]);
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/chatrooms${selectedIndex === 1 ? '/wait' : ''}`, {
        params: {
          userId: auth.userId || 0
        }
      });
      const chatRooms = {};
      response.data = response.data.map(e => {
        chatRooms[`ch_${e.id}`] = e.status.status;
        return {
          ...e,
          lastMessage: { ...e.lastMessage, content: e.lastMessage.content.replace(/\\n/g, ' ') }
        };
      });
      setChatRoom(m => ({ ...m, rooms: chatRooms }));
      setData(response.data);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.role !== 'USER') {
      setOptions(o => [...o, '상담 수락 대기 목록']);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedIndex]);

  return (
    <MainContainer>
      <Wrapper>
        <ButtonGroup
          sx={{ width: '100%' }}
          variant='contained'
          ref={anchorRef}
          aria-label='Button group with a nested menu'
        >
          <Button sx={{ width: '100%', fontSize: '1.2rem' }}>{options[selectedIndex]}</Button>
          <Button
            sx={{ width: '5%' }}
            size='large'
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label='select merge strategy'
            aria-haspopup='menu'
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{
            zIndex: 1
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id='split-button-menu' autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Wrapper>
      {error && <Notice>{error}</Notice>}
      {isLoading && <Notice>로딩 중 입니다..</Notice>}
      {data && data.map(e => <ChatRoomDetail key={e.id} data={e} selectedIndex={selectedIndex} />)}
    </MainContainer>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 95%;
  margin: 10px auto 0;
`;

const Notice = styled.div`
  text-align: center;
  font-size: 2rem;
  height: 50dvh;
  line-height: 50dvh;
`;

export default ChatListPage;
