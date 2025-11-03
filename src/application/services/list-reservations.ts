import type { ReservationRepository } from '../ports/reservation-repository';
import type { Reservation } from '../../domain/reservation';

export class ListReservationsService {
  constructor(private readonly repo: ReservationRepository) {}

  async execute(): Promise<Reservation[]> {
    return this.repo.listAll();
  }
}
