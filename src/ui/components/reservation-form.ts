import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { CleaningServiceType } from '../../domain/cleaning-service-type';
import type { Frequency } from '../../domain/reservation';

export interface ReservationFormData {
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

export class ReservationForm extends LitElement {
  static styles = css`
    form {
      display: grid;
      gap: 12px;
      margin-top: 8px;
    }

    .row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
    }

    label {
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    input,
    textarea,
    select {
      border-radius: 8px;
      border: 1px solid rgba(148, 163, 184, 0.8);
      padding: 6px 8px;
      font-size: 0.85rem;
      background: rgba(15, 23, 42, 0.95);
      color: inherit;
      outline: none;
    }

    input:focus,
    textarea:focus,
    select:focus {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.4);
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .actions {
      margin-top: 4px;
      display: flex;
      justify-content: flex-end;
    }

    button {
      border-radius: 999px;
      border: none;
      padding: 8px 16px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      background: #22c55e;
      color: #022c16;
      box-shadow: 0 12px 30px rgba(34, 197, 94, 0.45);
      transition: transform 0.12s ease, box-shadow 0.12s ease,
        background 0.12s ease;
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 18px 40px rgba(34, 197, 94, 0.6);
    }

    .error {
      color: #fecaca;
      font-size: 0.8rem;
    }
  `;

  @property({ type: String })
  serviceType: CleaningServiceType = 'standard';

  @state()
  private submitting = false;

  @state()
  private errorMessage: string | null = null;

  private handleSubmit(ev: Event) {
    ev.preventDefault();
    const form = ev.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const squareMeters = Number(data.get('squareMeters') || 0);

    const payload: ReservationFormData = {
      serviceType: this.serviceType,
      clientName: String(data.get('clientName') || '').trim(),
      clientEmail: String(data.get('clientEmail') || '').trim(),
      clientPhone: String(data.get('clientPhone') || '').trim(),
      address: String(data.get('address') || '').trim(),
      date: String(data.get('date') || ''),
      timeSlot: String(data.get('timeSlot') || ''),
      squareMeters: Number.isFinite(squareMeters) ? squareMeters : 0,
      frequency: (String(data.get('frequency') || 'one_time') ||
        'one_time') as Frequency,
      extraNotes: String(data.get('extraNotes') || '').trim() || undefined
    };

    if (!payload.clientName || !payload.clientEmail || !payload.address) {
      this.errorMessage = 'Nombre, email y dirección son obligatorios.';
      return;
    }

    this.errorMessage = null;
    this.submitting = true;

    this.dispatchEvent(
      new CustomEvent<ReservationFormData>('reservation-submitted', {
        detail: payload,
        bubbles: true,
        composed: true
      })
    );

    setTimeout(() => {
      this.submitting = false;
      form.reset();
    }, 0);
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <div class="row">
          <label>
            Nombre del cliente *
            <input name="clientName" required />
          </label>
          <label>
            Email *
            <input name="clientEmail" type="email" required />
          </label>
        </div>

        <div class="row">
          <label>
            Teléfono
            <input name="clientPhone" />
          </label>
          <label>
            Dirección completa *
            <input name="address" required />
          </label>
        </div>

        <div class="row">
          <label>
            Fecha del servicio *
            <input name="date" type="date" required />
          </label>
          <label>
            Franja horaria *
            <select name="timeSlot" required>
              <option value="09:00-11:00">09:00 - 11:00</option>
              <option value="11:00-13:00">11:00 - 13:00</option>
              <option value="16:00-18:00">16:00 - 18:00</option>
              <option value="18:00-20:00">18:00 - 20:00</option>
            </select>
          </label>
        </div>

        <div class="row">
          <label>
            Metros cuadrados aproximados *
            <input name="squareMeters" type="number" min="10" max="500" required />
          </label>
          <label>
            Frecuencia *
            <select name="frequency" required>
              <option value="one_time">Puntual</option>
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </label>
        </div>

        ${this.serviceType !== 'standard'
          ? html`
              <label>
                Detalles extra (ventanas, interiores armarios, etc.)
                <textarea name="extraNotes"></textarea>
              </label>
            `
          : html`
              <label>
                Comentarios para el equipo
                <textarea name="extraNotes"></textarea>
              </label>
            `}

        ${this.errorMessage
          ? html`<div class="error">${this.errorMessage}</div>`
          : null}

        <div class="actions">
          <button type="submit" ?disabled=${this.submitting}>
            ${this.submitting ? 'Guardando...' : 'Guardar reserva'}
          </button>
        </div>
      </form>
    `;
  }
}
