import React from 'react';
import ModifyMessage from './subModals/ModifyMessage';
import RemoveMessage from './subModals/RemoveMessage';

function EditModal({ msgId, msg }) {
  return (
    <React.Fragment>
      <RemoveMessage msgId={msgId} />
      <ModifyMessage msgId={msgId} msg={msg} />
    </React.Fragment>
  );
}

export default EditModal;