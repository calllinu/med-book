import React, { FC, useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { showToastNotification } from '../../../common/state/toast-notification/toast-notification.actions';
import { IAddRecordProps, IPatientRecord } from './add-record.types';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';

import * as Yup from 'yup';
import PlusIcon from '../../../assets/plus.png';
import classNames from 'classnames';
import { UsersService } from '../../../services/users.service';
import { Calendar } from 'primereact/calendar';
import { convertDateToBackendFormat } from '../../../common/helpers/ui.helper';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './../../../firebase-config';

const AddRecord: FC<IAddRecordProps> = ({ ...props }) => {
  const [changedPhoto, setChangedPhoto] = useState<File>();
  const [recordPhoto, setRecordPhoto] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  const AddNewSchema = Yup.object().shape({
    date: Yup.string().required('mandatory_field'),
    description: Yup.string().required('mandatory_field'),
  });

  const usersService = new UsersService();
  const fileUploadRef = useRef(null);

  const formValues = {
    date: new Date(),
    description: undefined,
  };

  useEffect(() => {
    const uploadPicture = async (): Promise<void> => {
      const name = new Date().getTime() + (changedPhoto?.name as string);
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, changedPhoto as File);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        err => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            setRecordPhoto(downloadURL);
          });
        }
      );
    };

    changedPhoto && uploadPicture();
  }, [changedPhoto]);

  const onPhotoSelected = (): void => {
    setChangedPhoto((fileUploadRef.current as any).files[0]);
  };

  const onSubmit = (values: IPatientRecord, { resetForm, setSubmitting }: any): void => {
    const valueToSubmit = {
      date: convertDateToBackendFormat(values.date as Date),
      description: values.description,
      picture: recordPhoto,
    };

    if (progress === 100) {
      usersService.addUserRecord(valueToSubmit, props.selectedPatient.id as string).then(
        () => {
          props.showToastNotification('success', 'Success', props.translate('patient_edited_successfully'));
          if (props.loadData) {
            props.loadData();
          }
          resetForm();
          setSubmitting(false);
          props.hideDialog();
        },
        () => {
          props.showToastNotification('error', 'Error', props.translate('patient_edit_error'));
          setSubmitting(false);
        }
      );
    }
  };

  const dialogFooter = (submitForm: () => void): JSX.Element => {
    return (
      <>
        <Button label={props.translate('save')} className="p-button-success primary-button" icon="pi pi-check" onClick={submitForm} />
        <Button label={props.translate('cancel')} icon="pi pi-times" className="p-button-text tertiary-button" onClick={() => props.hideDialog()} />
      </>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...formValues,
      }}
      validationSchema={AddNewSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, resetForm, submitForm, values, setFieldValue }) => {
        return (
          <Form>
            <Dialog
              modal
              visible={props.visible}
              header={props.translate('add_record')}
              className="p-fluid"
              footer={() => dialogFooter(submitForm)}
              onHide={() => {
                props.hideDialog();
                resetForm();
              }}
            >
              <div className="grid">
                <div className="col-12">
                  <div className="picture-container">
                    <img src={changedPhoto ? (changedPhoto as any).objectURL : PlusIcon} alt="record-picture" />
                  </div>
                  <FileUpload
                    className="w-full mt-3"
                    mode="basic"
                    accept="image/*"
                    maxFileSize={5000000}
                    ref={fileUploadRef}
                    onSelect={onPhotoSelected}
                  />
                </div>

                <div className="col-12">
                  <div className="field">
                    <Calendar
                      id="date"
                      showIcon
                      monthNavigator
                      yearNavigator
                      dateFormat="dd/mm/yy"
                      selectionMode="single"
                      yearRange="1900:2030"
                      value={values.date as Date}
                      className={classNames('w-full', {
                        'p-invalid': errors.date && touched.date,
                      })}
                      placeholder={props.translate('select_date')}
                      onChange={e => {
                        setFieldValue('date', e.value);
                      }}
                    />
                    {errors.date && touched.date && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
                    <InputTextarea
                      rows={5}
                      value={values.description || ''}
                      className={classNames({
                        'p-invalid': errors.description && touched.description,
                      })}
                      onChange={e => {
                        setFieldValue('description', e.target.value);
                      }}
                      placeholder={props.translate('description')}
                    />

                    {errors.description && touched.description && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                  </div>
                </div>
              </div>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(AddRecord));
