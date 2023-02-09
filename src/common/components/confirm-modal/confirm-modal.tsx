import React, { FC } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IConfirmModalProps } from './confirm-modal.types';
import { withTranslate } from 'react-redux-multilingual';

const ConfirmModal: FC<IConfirmModalProps> = ({ ...props }) => {
  const dialogFooter = (
    <React.Fragment>
      <Button label={props.translate('yes')} icon="pi pi-check" className="p-button-text p-button-danger" onClick={props.confirm} />
      <Button label={props.translate('no')} icon="pi pi-times" className="p-button-text p-button-success" onClick={props.hideDialog} />
    </React.Fragment>
  );

  return (
    <Dialog
      visible={props.visible}
      style={{ width: '450px' }}
      header={props.translate('confirm')}
      modal
      footer={dialogFooter}
      onHide={props.hideDialog}
    >
      <div className="flex align-items-center">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#d32f2f' }} />
        {props.content}
      </div>
    </Dialog>
  );
};

export default withTranslate(ConfirmModal);
