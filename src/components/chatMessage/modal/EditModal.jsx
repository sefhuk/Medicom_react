import React from 'react';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../../utils/atom';
import RemoveMessage from './subModals/\bRemoveMessage';

function EditModal({ msgId }) {
  const [auth] = useRecoilState(userauthState);
  return (
    <React.Fragment>
      <RemoveMessage msgId={msgId} />
    </React.Fragment>
  );
}

export default EditModal;
