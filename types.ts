export enum ViewState {
  LANDING = 'LANDING',
  PATIENT_DASHBOARD = 'PATIENT_DASHBOARD',
  DOCTOR_DASHBOARD = 'DOCTOR_DASHBOARD',
}

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Video' | 'In-Person';
  status: 'Confirmed' | 'Pending' | 'Completed';
}
