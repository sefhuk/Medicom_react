import styled from 'styled-components';
import profileDefaultImage from '../../assets/user-profile-default.png';
import adminDefaultImage from '../../assets/admin-profile-default.png';

function ProfileImage(props) {
  return <Image insert={props.insert} url={props.url} />;
}

const Image = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid black;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: ${({ self }) => (!self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '10px' : '0px')};
  background-image: ${({ insert, url }) =>
    insert === true
      ? `url(${adminDefaultImage})`
      : url
        ? `url(${url})`
        : `url(${profileDefaultImage})`};
  &:hover {
    cursor: pointer;
    border: 3px solid red;
  }
`;

export default ProfileImage;
