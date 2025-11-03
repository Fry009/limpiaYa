export type CleaningServiceType = 'standard' | 'plus' | 'premium';

export interface CleaningServiceDefinition {
  id: CleaningServiceType;
  name: string;
  description: string;
  basePrice: number;
}

export const CLEANING_SERVICE_DEFINITIONS: CleaningServiceDefinition[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Limpieza general de mantenimiento.',
    basePrice: 40
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Incluye limpieza más profunda de cocina y baño.',
    basePrice: 60
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Limpieza integral + cristales y detalles extra.',
    basePrice: 90
  }
];

export function getServiceDefinition(
  id: CleaningServiceType
): CleaningServiceDefinition {
  const found = CLEANING_SERVICE_DEFINITIONS.find(s => s.id === id);
  if (!found) {
    throw new Error(`Unknown cleaning service type: ${id}`);
  }
  return found;
}
