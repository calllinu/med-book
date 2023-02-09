import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect, RootStateOrAny } from 'react-redux';
import { DataTable, DataTableSortOrderType } from 'primereact/datatable';
import { IPatientsProps } from './patients.types';
import { IUser } from '../auth/login/login.types';
import { ILazyParams } from '../../common/types/common.types';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { UserRoles } from '../../common/constants/common.constants';
import { showToastNotification } from '../../common/state/toast-notification/toast-notification.actions';
import ConfirmModal from '../../common/components/confirm-modal/confirm-modal';
import { UsersService } from '../../services/users.service';
import { IRole } from './../auth/login/login.types';
import { convertDateToFrontendFormat } from '../../common/helpers/ui.helper';
import { auth } from '../../firebase-config';
import EditPatient from './edit-patient/edit-patient';
import AddRecord from './add-record/add-record';
import ViewPatient from './view-patient/view-patient';

const Patients: FC<IPatientsProps> = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [patients, setPatients] = useState<IUser[] | []>([]);
  const [roles, setRoles] = useState<IRole[] | []>([]);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [showAddRecordDialog, setShowAddRecordDialog] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<IUser | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [confirmDialogContent, setConfirmDialogContent] = useState<JSX.Element>();
  const [lazyParams, setLazyParams] = useState<Partial<ILazyParams>>({
    first: 0,
    rows: 10,
    page: 1,
    search: '',
    sortField: '',
    sortOrder: 1 as DataTableSortOrderType,
  });

  const isCancelled = useRef(false);
  const usersService = new UsersService();

  useEffect(() => {
    isCancelled.current = false;
    loadLazyData();
    return () => {
      isCancelled.current = true;
    };
  }, [lazyParams, globalFilter]);

  const loadLazyData = (): void => {
    setIsLoading(true);
    usersService.getAllUsers().then(
      usersResponse => {
        setTotalRecords(usersResponse.length || 1);
        setPatients(usersResponse.filter(patient => patient.doctor === auth.currentUser?.uid));
        setIsLoading(false);

        usersService.getUserRoles().then(rolesResponse => setRoles(rolesResponse));
      },
      err => console.log(err)
    );
  };

  const onPage = (event: ILazyParams): void => {
    setLazyParams(event);
  };

  const onSort = (event: ILazyParams): void => {
    setLazyParams(event);
  };

  const editPatient = (patient: IUser): void => {
    setSelectedPatient(patient);
    setShowEditDialog(true);
  };

  const addRecord = (patient: IUser): void => {
    setSelectedPatient(patient);
    setShowAddRecordDialog(true);
  };

  const viewPatientRecords = (patient: IUser): void => {
    setSelectedPatient(patient);
    setShowViewDialog(true);
  };

  const hidePatientRecordsDialog = (): void => {
    setShowViewDialog(false);
    setSelectedPatient(null);
  };

  const hidePatientDialog = (): void => {
    setShowEditDialog(false);
    setSelectedPatient(null);
  };

  const hideRecordDialog = (): void => {
    setShowAddRecordDialog(false);
    setSelectedPatient(null);
  };

  const hideDeletePatientModal = (): void => {
    setSelectedPatient(null);
    setShowConfirmDialog(false);
  };

  const dateTemplate = (rowData: IUser): string => {
    return convertDateToFrontendFormat(rowData.birthday);
  };

  const showConfirm = (rowData: IUser): void => {
    setConfirmDialogContent(<p className="stp-body-1">{props.translate('are_you_sure_delete')}</p>);

    setSelectedPatient(rowData);
    setShowConfirmDialog(true);
  };

  const deletePatient = (): void => {
    usersService.deleteUser(selectedPatient?.id as string).then(() => {
      props.showToastNotification('success', 'Success', props.translate('patient_deleted_successfully'));
      loadLazyData();
      hideDeletePatientModal();
    }),
      () => {
        props.showToastNotification('error', 'Error', props.translate('patient_delete_error'));
        hideDeletePatientModal();
      };
  };

  const actionTemplate = (rowData: IUser): JSX.Element => (
    <>
      <Button
        id={`edit-user-button-${rowData.id}`}
        icon="pi pi-pencil"
        className={`p-button-rounded p-button-text p-button-plain ${rowData.role === UserRoles.DOCTOR && 'disabled-button'}`}
        onClick={() => editPatient(rowData)}
      />
      <Button icon="pi pi-eye" className="p-button-rounded p-button-text p-button-plain" onClick={() => viewPatientRecords(rowData)} />
      <Button icon="pi pi-user-plus" className="p-button-rounded p-button-text p-button-plain" onClick={() => addRecord(rowData)} />
      <Button
        id={`delete-user-button-${rowData.id}`}
        icon="pi pi-trash"
        className={`p-button-rounded p-button-text p-button-plain ${rowData.role === UserRoles.DOCTOR && 'disabled-button'}`}
        onClick={() => showConfirm(rowData)}
      />
    </>
  );

  return (
    <>
      <Card>
        <div className="grid mb-2">
          <div className="col-12 px-0">
            <p className="stp-header-2"> {props.translate('patients')}</p>
          </div>

          <div className="col-12 lg:col-6 px-0">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                className="table-search"
                value={globalFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setGlobalFilter(e.target.value);
                }}
                placeholder={props.translate('search')}
              />
            </span>
          </div>
        </div>

        <DataTable
          value={patients}
          paginator
          showGridlines
          dataKey="id"
          size="small"
          selectionMode="single"
          responsiveLayout="scroll"
          first={lazyParams.first}
          rows={lazyParams.rows}
          totalRecords={totalRecords}
          onPage={onPage}
          onSort={onSort}
          sortField={lazyParams.sortField}
          sortOrder={lazyParams.sortOrder}
          loading={isLoading}
          selection={selectedPatient}
          onSelectionChange={e => setSelectedPatient(e.value)}
          globalFilter={globalFilter}
          rowsPerPageOptions={[10, 25, 50, 100]}
          emptyMessage={props.translate('no_items_found')}
        >
          <Column field="firstName" header={props.translate('first_name')} sortable style={{ width: '15%' }} />
          <Column field="lastName" header={props.translate('last_name')} sortable style={{ width: '15%' }} />
          <Column body={dateTemplate} field="birthday" header={props.translate('birthday')} sortable style={{ width: '10%' }} />
          <Column field="phoneNumber" header={props.translate('phone')} sortable style={{ width: '10%' }} />
          <Column field="email" header={props.translate('email')} sortable style={{ width: '20%' }} />
          <Column field="role" header={props.translate('role')} sortable style={{ width: '15%' }} />
          <Column body={actionTemplate} bodyStyle={{ textAlign: 'center', justifyContent: 'center' }} style={{ width: '15%' }}></Column>
        </DataTable>
      </Card>

      {showEditDialog && (
        <EditPatient
          visible={showEditDialog}
          hideDialog={hidePatientDialog}
          selectedPatient={selectedPatient}
          loadData={loadLazyData}
          translate={props.translate}
          doctors={patients.filter(patient => patient.role === UserRoles.DOCTOR)}
          roles={roles}
        />
      )}

      {showAddRecordDialog && (
        <AddRecord
          visible={showAddRecordDialog}
          hideDialog={hideRecordDialog}
          selectedPatient={selectedPatient}
          loadData={loadLazyData}
          translate={props.translate}
        />
      )}

      {showViewDialog && (
        <ViewPatient visible={showViewDialog} hideDialog={hidePatientRecordsDialog} selectedPatient={selectedPatient} translate={props.translate} />
      )}

      {showConfirmDialog && (
        <ConfirmModal visible={showConfirmDialog} hideDialog={hideDeletePatientModal} confirm={deletePatient} content={confirmDialogContent} />
      )}
    </>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(Patients));
