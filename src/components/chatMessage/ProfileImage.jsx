import styled from 'styled-components';

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
      ? 'url("https://cdn-icons-png.flaticon.com/512/2942/2942813.png")'
      : url
        ? `url(${url})`
        : 'url("https://w7.pngwing.com/pngs/306/70/png-transparent-computer-icons-management-admin-silhouette-black-and-white-neck.png")'};
  &:hover {
    cursor: pointer;
    border: 3px solid red;
  }
`;

export default ProfileImage;