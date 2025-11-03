import type { CleaningServiceType } from './cleaning-service-type';

export type Frequency = 'one_time' | 'weekly' | 'biweekly' | 'monthly';

export interface ReservationProps {
  id: string;
  serviceType: CleaningServiceType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  date: string;
  timeSlot: string;
  squareMeters: number;
  frequency: Frequency;
  extraNotes?: string;
  createdAt: Date;
}

export class Reservation {
  readonly id: string;
  readonly serviceType: CleaningServiceType;
  readonly clientName: string;
  readonly clientEmail: string;
  readonly clientPhone: string;
  readonly address: string;
  readonly date: string;
  readonly timeSlot: string;
  readonly squareMeters: number;
  readonly frequency: Frequency;
  readonly extraNotes?: string;
  readonly createdAt: Date;

  constructor(props: ReservationProps) {
    this.id = props.id;
    this.serviceType = props.serviceType;
    this.clientName = props.clientName;
    this.clientEmail = props.clientEmail;
    this.clientPhone = props.clientPhone;
    this.address = props.address;
    this.date = props.date;
    this.timeSlot = props.timeSlot;
    this.squareMeters = props.squareMeters;
    this.frequency = props.frequency;
    this.extraNotes = props.extraNotes;
    this.createdAt = props.createdAt;
  }
}
