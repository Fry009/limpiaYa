import type { Reservation } from '../../domain/reservation';

export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  listAll(): Promise<Reservation[]>;
}
