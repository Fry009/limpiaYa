import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import type { CleaningServiceType } from "../../domain/cleaning-service-type";
import { CLEANING_SERVICE_DEFINITIONS } from "../../domain/cleaning-service-type";

export class ServiceSelector extends LitElement {
  static styles = css`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin: 16px 0;
    }

    .card {
      border-radius: 12px;
      padding: 12px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      background: rgba(15, 23, 42, 0.9);
      cursor: pointer;
      transition: transform 0.12s ease, box-shadow 0.12s ease,
        border-color 0.12s ease, background 0.12s ease;
      font-size: 0.9rem;
    }

    .card:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 25px rgba(15, 23, 42, 0.8);
    }

    .card.active {
      border-color: #22c55e;
      background: linear-gradient(to bottom right, #22c55e22, #020617);
      box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
    }

    .name {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .price {
      margin-top: 4px;
      font-weight: 500;
    }
  `;

  @property({ type: String })
  selected: CleaningServiceType = "standard";

  private onSelect(id: CleaningServiceType) {
    this.selected = id;
    this.dispatchEvent(
      new CustomEvent<CleaningServiceType>("service-selected", {
        detail: id,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="grid">
        ${CLEANING_SERVICE_DEFINITIONS.map(
          (s) => html`
            <div
              class="card ${this.selected === s.id ? "active" : ""}"
              @click=${() => this.onSelect(s.id)}
            >
              <div class="name">${s.name}</div>
              <div class="desc">${s.description}</div>
              <div class="price">Desde ${s.basePrice} €/servicio</div>
            </div>
          `
        )}
      </div>
    `;
  }
}
