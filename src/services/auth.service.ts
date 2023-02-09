import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

export class AuthService {
  loginRequest = async (email: string, password: string, showNotification: any, translate: any): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('success', 'Success', translate('login_successfully'));
    } catch (error) {
      showNotification('error', 'Error', translate('invalid_credentials'));
      console.log(error);
    }
  };

  registerRequest = async (email: string, password: string): Promise<any> => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  logoutRequest = async (): Promise<void> => {
    signOut(auth).then(() => (window.location.pathname = '/login'));
  };
}
