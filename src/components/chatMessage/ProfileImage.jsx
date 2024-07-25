import styled from 'styled-components';

function ProfileImage(props) {
  return (
    <Image
      insert={props.insert}
      url={props.url}
      className={`w-[3rem] h-[3rem] rounded-[50%] border-[1px] border-black bg-contain bg-no-repeat mr-[10px] ${props.self ? 'order-2' : 'order-1'}`}
    />
  );
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
  z-index: 2;
  background-image: url(${({ insert, url }) =>
    insert
      ? 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png'
      : url
        ? url
        : 'https://w7.pngwing.com/pngs/306/70/png-transparent-computer-icons-management-admin-silhouette-black-and-white-neck.png'});

  &:hover {
    cursor: pointer;
    border: 3px solid red;
  }
`;

export default ProfileImage;
