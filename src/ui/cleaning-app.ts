import { LitElement, html, css } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import type { CleaningServiceType } from "../domain/cleaning-service-type";
import { getServiceDefinition } from "../domain/cleaning-service-type";
import { ServiceSelector } from "./components/service-selector";
import {
  ReservationForm,
  type ReservationFormData,
} from "./components/reservation-form";
import { InMemoryReservationRepository } from "../infrastructure/memory/in-memory-reservation-repository";
import { CreateReservationService } from "../application/services/create-reservation";
import { ListReservationsService } from "../application/services/list-reservations";
import type { Reservation } from "../domain/reservation";

export class CleaningApp extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      "service-selector": ServiceSelector,
      "reservation-form": ReservationForm,
    };
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: radial-gradient(circle at top, #1e293b 0, #020617 55%);
      color: #e5e7eb;
    }

    .layout {
      max-width: 960px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    header {
      margin-bottom: 16px;
    }

    h1 {
      margin: 0;
      font-size: 1.7rem;
      letter-spacing: 0.04em;
    }

    .subtitle {
      margin-top: 4px;
      font-size: 0.9rem;
      opacity: 0.85;
    }

    main {
      display: grid;
      grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.3fr);
      gap: 24px;
      margin-top: 16px;
    }

    @media (max-width: 800px) {
      main {
        grid-template-columns: 1fr;
      }
    }

    .panel {
      border-radius: 16px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(148, 163, 184, 0.6);
      box-shadow: 0 20px 45px rgba(15, 23, 42, 0.9);
    }

    .panel + .panel {
      margin-top: 12px;
    }

    h2 {
      margin: 0 0 4px;
      font-size: 1rem;
    }

    .current-service {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .reservations-list {
      margin-top: 8px;
      font-size: 0.85rem;
    }

    .reservation-card {
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      background: rgba(15, 23, 42, 0.9);
      margin-bottom: 6px;
    }

    .reservation-card strong {
      font-weight: 600;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 0.75rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.5);
      margin-left: 4px;
    }

    .empty {
      opacity: 0.7;
      font-size: 0.8rem;
      margin-top: 6px;
    }
  `;

  private repo = new InMemoryReservationRepository();
  private createReservationService = new CreateReservationService(this.repo);
  private listReservationsService = new ListReservationsService(this.repo);

  private _selectedService: CleaningServiceType = "standard";
  private _reservations: Reservation[] = [];

  get selectedService(): CleaningServiceType {
    return this._selectedService;
  }

  set selectedService(value: CleaningServiceType) {
    this._selectedService = value;
    this.requestUpdate();
  }

  get reservations(): Reservation[] {
    return this._reservations;
  }

  set reservations(value: Reservation[]) {
    this._reservations = value;
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.refreshReservations();
  }

  private async refreshReservations() {
    this.reservations = await this.listReservationsService.execute();
  }

  private handleServiceSelected(ev: CustomEvent<CleaningServiceType>) {
    this.selectedService = ev.detail;
  }

  private async handleReservationSubmitted(
    ev: CustomEvent<ReservationFormData>
  ) {
    try {
      await this.createReservationService.execute(ev.detail);
      await this.refreshReservations();
    } catch (error) {
      console.error(error);
    }
  }

  private renderReservationsList() {
    if (!this.reservations.length) {
      return html`<div class="empty">
        No hay reservas todavía. Crea la primera con el formulario.
      </div>`;
    }

    return html`
      <div class="reservations-list">
        ${this.reservations.map(
          (r) => html`
            <div class="reservation-card">
              <div>
                <strong>${r.clientName}</strong>
                <span class="chip">${r.serviceType.toUpperCase()}</span>
              </div>
              <div>${r.date} · ${r.timeSlot} · ${r.address}</div>
              <div>
                ${r.squareMeters} m² ·
                ${r.frequency === "one_time"
                  ? "Puntual"
                  : r.frequency === "weekly"
                  ? "Semanal"
                  : r.frequency === "biweekly"
                  ? "Quincenal"
                  : "Mensual"}
              </div>
              ${r.extraNotes ? html`<div>Notas: ${r.extraNotes}</div>` : null}
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    const serviceDef = getServiceDefinition(this.selectedService);

    return html`
      <div class="layout">
        <header>
          <h1>Reservas de Limpieza</h1>
          <div class="subtitle">
            App de reservas con Lit + Scoped Elements + arquitectura hexagonal
            ligera.
          </div>
        </header>

        <main>
          <section class="panel">
            <h2>1. Tipo de servicio</h2>
            <div class="current-service">
              Seleccionado:
              <strong>${serviceDef.name}</strong> – ${serviceDef.description}
            </div>
            <service-selector
              .selected=${this.selectedService}
              @service-selected=${this.handleServiceSelected}
            ></service-selector>

            <h2>2. Datos de la reserva</h2>
            <reservation-form
              .serviceType=${this.selectedService}
              @reservation-submitted=${this.handleReservationSubmitted}
            ></reservation-form>
          </section>

          <aside class="panel">
            <h2>Reservas creadas</h2>
            ${this.renderReservationsList()}
          </aside>
        </main>
      </div>
    `;
  }
}

customElements.define("cleaning-app", CleaningApp);
