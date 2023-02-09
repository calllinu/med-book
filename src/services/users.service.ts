import { collection, getDocs, updateDoc, doc, deleteDoc, getDoc, DocumentData, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from './../firebase-config';
import { IRole, IUser } from '../components/auth/login/login.types';
import { IPatientRecord } from '../components/patients/add-record/add-record.types';

export class UsersService {
  usersCollectionRef = collection(db, 'users');
  rolesCollectionRef = collection(db, 'roles');

  getAllUsers = async (): Promise<IUser[]> => {
    const data = await getDocs(this.usersCollectionRef);
    return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  };

  getUserRoles = async (): Promise<IRole[]> => {
    const data = await getDocs(this.rolesCollectionRef);
    return data.docs.map(doc => ({ ...doc.data() }));
  };

  addUser = async (user: IUser, id: string): Promise<void> => {
    await setDoc(doc(db, 'users', id), {
      ...user,
    });
  };

  addUserRecord = async (record: IPatientRecord, id: string): Promise<void> => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, { medBook: arrayUnion(record) });
  };

  updateUser = async (user: IUser, id: string): Promise<void> => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, { ...user });
  };

  deleteUser = async (id: string): Promise<void> => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  };

  getUser = async (id: string): Promise<DocumentData> => {
    const userDoc = doc(db, 'users', id);
    const data = await getDoc(userDoc);
    return data.data() as DocumentData;
  };
}
