import type { Reservation } from '../../domain/reservation';
import type { ReservationRepository } from '../../application/ports/reservation-repository';

export class InMemoryReservationRepository implements ReservationRepository {
  private readonly storage: Reservation[] = [];

  async save(reservation: Reservation): Promise<void> {
    this.storage.push(reservation);
  }

  async listAll(): Promise<Reservation[]> {
    return [...this.storage];
  }
}
