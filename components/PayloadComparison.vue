<script setup>
const packageIds = [
  '01a1e4f8-243c-719f-9bc6-dbc38b660156',
  '01a1e4f8-243c-719f-9bc6-dbc49ee28786',
  '01a1e4f8-243c-719f-9bc6-dbc5cc37c28d',
  '01a1e4f8-243c-719f-9bc6-dbc6b583cdbf',
  '01a1e4f8-243c-719f-9bc6-dbc7fb93f788',
  '01a1e4f8-243c-719f-9bc6-dbc8cbe1fb07',
  '01a1e4f8-243c-719f-9bc6-dbc9cc8bf0f5',
  '01a1e4f8-243c-719f-9bc6-dbcaf2014b5f',
]

const service = {
  id: '01a1e4f8-243c-719f-9bc6-dbb99db5bff3',
  externalReference: 'ORDER-2026-09182',
  tenantId: '01a1e4f8-243c-719f-9bc6-dbbada5aa74f',
  routeId: '01a1e4f8-243c-719f-9bc6-dbbbff03219d',
  driverId: '01a1e4f8-243c-719f-9bc6-dbbceec0af05',
  status: 'completed',
  sequence: 12,
  priority: 'normal',
  createdAt: '2026-11-16T07:00:00Z',
  updatedAt: '2026-11-16T10:42:00Z',
  scheduledDate: '2026-11-16',
  customer: {
    id: '01a1e4f8-243c-719f-9bc6-dbbd6acfe495',
    name: 'Cliente de ejemplo',
    accountCode: 'ACCOUNT-042',
    billingAddress: {
      street: 'Calle de Ejemplo',
      number: '24',
      postalCode: '28001',
      city: 'Madrid',
      country: 'ES',
    },
    contact: {
      name: 'Contacto de ejemplo',
      email: 'contacto@example.com',
      preferredChannel: 'email',
    },
  },
  pickup: {
    warehouseId: '01a1e4f8-243c-719f-9bc6-dbbe423a3aec',
    address: {
      street: 'Avenida de Ejemplo',
      number: '108',
      postalCode: '28022',
      city: 'Madrid',
      country: 'ES',
      coordinates: { latitude: 40.44, longitude: -3.61 },
    },
    window: { start: '08:00', end: '09:00' },
    dock: 'B-04',
    instructions: 'Recoger en el muelle de carga',
    completedAt: '2026-11-16T08:32:00Z',
  },
  delivery: {
    recipient: 'Destinatario de ejemplo',
    address: {
      street: 'Calle de Ejemplo',
      number: '24',
      floor: '2',
      door: 'B',
      postalCode: '28001',
      city: 'Madrid',
      country: 'ES',
      coordinates: { latitude: 40.42, longitude: -3.68 },
    },
    window: { start: '10:00', end: '12:00' },
    instructions: 'Llamar al llegar',
    accessCode: null,
    arrivalAt: '2026-11-16T10:35:00Z',
    completedAt: '2026-11-16T10:42:00Z',
    estimatedDurationMinutes: 10,
  },
  packages: Array.from({ length: 8 }, (_, index) => ({
    id: packageIds[index],
    barcode: `EXAMPLE-2048-00${index + 1}`,
    description: `Bulto de ejemplo ${index + 1}`,
    quantity: 1,
    weightKg: 2.4,
    dimensionsCm: { width: 30, height: 20, depth: 15 },
    fragile: index === 0,
    temperatureControlled: false,
    scanned: true,
    delivered: true,
  })),
  proofOfDelivery: {
    required: true,
    recipientName: 'Destinatario de ejemplo',
    signature: { id: '01a1e4f8-243c-719f-9bc6-dbbf61c453e2', mimeType: 'image/png' },
    photos: [
      { id: '01a1e4f8-243c-719f-9bc6-dbc0404b0eb1', mimeType: 'image/jpeg', sizeBytes: 1842000 },
      { id: '01a1e4f8-243c-719f-9bc6-dbc160be3642', mimeType: 'image/jpeg', sizeBytes: 2031000 },
    ],
    notes: '',
    coordinates: { latitude: 40.42, longitude: -3.68 },
  },
  routing: {
    distanceFromPreviousMeters: 1840,
    estimatedArrival: '2026-11-16T10:36:00Z',
    plannedDurationSeconds: 600,
    optimizationVersion: 8,
    vehicleId: '01a1e4f8-243c-719f-9bc6-dbc2e509f1da',
    vehicleCapacityKg: 850,
    remainingStops: 21,
    remainingDistanceMeters: 28400,
  },
  configuration: {
    signatureRequired: true,
    photoRequired: true,
    barcodeScanRequired: true,
    recipientNameRequired: true,
    allowPartialDelivery: false,
    allowDeliveryWithoutRecipient: false,
    notifyOnArrival: true,
    notifyOnCompletion: true,
    editableFields: ['recipientName', 'notes', 'photos'],
    customFields: {
      department: 'Logística',
      purchaseOrder: 'PO-8819',
      deliveryCategory: 'standard',
      sourceSystem: 'customer-api',
    },
  },
  history: [
    { status: 'created', timestamp: '2026-11-16T07:00:00Z' },
    { status: 'assigned', timestamp: '2026-11-16T07:15:00Z' },
    { status: 'in-progress', timestamp: '2026-11-16T08:32:00Z' },
    { status: 'arrived', timestamp: '2026-11-16T10:35:00Z' },
    { status: 'completed', timestamp: '2026-11-16T10:42:00Z' },
  ],
}

const event = {
  kind: 'SERVICE_COMPLETED',
  payload: {
    serviceId: service.id,
    status: 'OK',
  },
}

const entityLines = JSON.stringify(service, null, 2).split('\n').map(text => ({
  text,
  changed: text.includes('"status": "completed"'),
}))
const eventJson = JSON.stringify(event, null, 2)
</script>

<template>
  <div class="payload-comparison">
    <section class="entity-example" aria-label="Ejemplo de la entidad completa">
      <h2>Entidad completa</h2>
      <div class="entity-window">
        <pre><code><span
          v-for="(line, index) in entityLines"
          :key="index"
          class="entity-line"
          :class="{ 'changed-field': line.changed }"
        >{{ line.text }}</span></code></pre>
      </div>
      <div class="continuation" aria-label="El payload continúa">…</div>
    </section>

    <span class="payload-arrow" aria-hidden="true">→</span>

    <section class="event-example" aria-label="Ejemplo del evento enviado">
      <h2>Evento</h2>
      <pre><code>{{ eventJson }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.payload-comparison {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 64px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  margin-top: 12px;
}

.payload-comparison h2 {
  margin: 0 0 16px;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -.025em;
}

.entity-example h2 { color: var(--quiet); }
.event-example h2 { color: var(--acid); }

.payload-comparison pre {
  margin: 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--line);
  background: transparent;
  border-radius: 0;
  font-family: inherit;
  letter-spacing: -.025em;
}

.payload-comparison code {
  padding: 0;
  background: transparent;
  font: inherit;
  color: inherit;
}

.entity-window {
  height: 300px;
  overflow: hidden;
}

.entity-example pre {
  color: var(--quiet);
  font-size: 11px;
  line-height: 1.45;
}

.entity-line { display: block; }
.entity-line.changed-field { color: var(--acid); }

.continuation {
  height: 24px;
  color: var(--quiet);
  font-size: 24px;
  line-height: 1;
}

.payload-arrow {
  color: var(--acid);
  font-size: 52px;
  text-align: center;
}

.event-example pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--ink);
  font-size: 16px;
  line-height: 1.65;
}
</style>
