import React, { FC, useEffect, useRef } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect, RootStateOrAny } from 'react-redux';
import { IAppState } from '../../state/common/app-state.types';
import { IToastNotificationProps } from './toast-notification.types';
import { resetToastNotification } from '../../state/toast-notification/toast-notification.actions';
import { Toast } from 'primereact/toast';

const ToastNotification: FC<IToastNotificationProps> = ({ ...props }) => {
  const toast = useRef(null);

  setTimeout(() => {
    props.resetToastNotification();
  }, 5000);

  useEffect(() => {
    if (props.visible) {
      (toast.current as any).show({ severity: props.severity, summary: props.summary, detail: props.detail });
    } else {
      (toast.current as any).clear();
    }
  }, [props.visible]);

  return <Toast ref={toast} position="bottom-right" />;
};

const mapStateToProps = (state: IAppState): RootStateOrAny => ({
  severity: state.toastNotification.severity,
  summary: state.toastNotification.summary,
  detail: state.toastNotification.detail,
  visible: state.toastNotification.visible,
});

const mapDispatchToProps = {
  resetToastNotification: resetToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(ToastNotification));
