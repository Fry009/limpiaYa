import { Reservation } from '../../domain/reservation';
import type { CleaningServiceType } from '../../domain/cleaning-service-type';
import type { Frequency } from '../../domain/reservation';
import type { ReservationRepository } from '../ports/reservation-repository';

export interface CreateReservationCommand {
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
}

export class CreateReservationService {
  constructor(private readonly repo: ReservationRepository) {}

  async execute(command: CreateReservationCommand) {
    if (!command.clientName.trim()) {
      throw new Error('El nombre del cliente es obligatorio');
    }
    if (!command.clientEmail.trim()) {
      throw new Error('El email es obligatorio');
    }

    const reservation = new Reservation({
      id: crypto.randomUUID(),
      serviceType: command.serviceType,
      clientName: command.clientName.trim(),
      clientEmail: command.clientEmail.trim(),
      clientPhone: command.clientPhone.trim(),
      address: command.address.trim(),
      date: command.date,
      timeSlot: command.timeSlot,
      squareMeters: command.squareMeters,
      frequency: command.frequency,
      extraNotes: command.extraNotes?.trim() || undefined,
      createdAt: new Date()
    });

    await this.repo.save(reservation);
    return reservation;
  }
}
