import React, { FC } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { showToastNotification } from '../../../common/state/toast-notification/toast-notification.actions';
import { IViewPatientProps } from './view-patient.types';
import { convertDateToFrontendFormat } from '../../../common/helpers/ui.helper';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IPatientRecord } from '../add-record/add-record.types';

const ViewPatient: FC<IViewPatientProps> = ({ ...props }) => {
  const dialogFooter = (): JSX.Element => {
    return (
      <Button label={props.translate('close')} icon="pi pi-times" className="p-button-text tertiary-button" onClick={() => props.hideDialog()} />
    );
  };

  const imageTemplate = (rowData: IPatientRecord): JSX.Element => {
    return <img className="table-image" src={rowData.picture} alt="record-picture" />;
  };

  return (
    <Dialog
      modal
      style={{ width: '700px' }}
      visible={props.visible}
      header={props.translate('view_patient')}
      className="p-fluid"
      footer={() => dialogFooter()}
      onHide={() => {
        props.hideDialog();
      }}
    >
      {props.selectedPatient && (
        <div className="grid">
          <div className="col-6">
            <p className="stp-body-2">{props.translate('first_name')}</p>
          </div>
          <div className="col-6">
            <p className="stp-body-2 font-bold">{props.selectedPatient.firstName}</p>
          </div>
          <div className="col-6">
            <p className="stp-body-2">{props.translate('last_name')}</p>
          </div>
          <div className="col-6">
            <p className="stp-body-2 font-bold">{props.selectedPatient.lastName}</p>
          </div>
          <div className="col-6">
            <p className="stp-body-2">{props.translate('birthday')}</p>
          </div>
          <div className="col-6">
            <p className="stp-body-2 font-bold">{convertDateToFrontendFormat(props.selectedPatient.birthday)}</p>
          </div>
          <div className="col-12">
            <DataTable
              value={props.selectedPatient.medBook}
              showGridlines
              dataKey="picture"
              size="small"
              selectionMode="single"
              responsiveLayout="scroll"
              emptyMessage={props.translate('no_items_found')}
            >
              <Column field="date" header={props.translate('date')} style={{ width: '20%' }} />
              <Column field="description" header={props.translate('description')} style={{ width: '50%' }} />
              <Column body={imageTemplate} field="picture" header={props.translate('picture')} style={{ width: '30%' }} />
            </DataTable>
          </div>
        </div>
      )}
    </Dialog>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(ViewPatient));
