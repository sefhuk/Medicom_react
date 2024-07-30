import React from 'react';
import DepartmentSuggestion from './subModals/DepartmentSuggestion';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../../utils/atom';

function AdvancedModal({ sendMessage, setOpens }) {
  const [auth] = useRecoilState(userauthState);
  return (
    <React.Fragment>
      {auth.role === 'DOCTOR' && (
        <DepartmentSuggestion sendMessage={sendMessage} setOpens={setOpens} />
      )}
    </React.Fragment>
  );
}

export default AdvancedModal;
