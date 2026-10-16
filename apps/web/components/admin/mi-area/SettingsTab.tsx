'use client';

import { useState } from 'react';
import { Activity, api, BTN, BTN2, CARD, Field, Help, INPUT, Run } from './ui';

export function SettingsTab({ act, run }: { act: Activity; run: Run }) {
  const [label, setLabel] = useState(act.resourceLabel ?? '');
  return (
    <div className={CARD}>
      <h3 className="font-bold text-stone-900">¿Este servicio usa animales o embarcaciones?</h3>
      <Help>
        Si sí, escribe el nombre en singular (Caballo, Canoa…). Se activan las pestañas para crearlos y definir recorridos,
        y el cupo se calcula solo. Si no, déjalo vacío: trabajas solo con horarios.
      </Help>
      <div className="flex flex-wrap gap-3 items-end">
        <Field label="Nombre en singular">
          <input className={`${INPUT} w-48`} placeholder="Ej. Caballo" value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <button className={BTN2} onClick={() => setLabel('Caballo')}>Caballo</button>
        <button className={BTN2} onClick={() => setLabel('Canoa')}>Canoa</button>
        <button
          className={BTN}
          onClick={() => run(async () => {
            await api(`activities/${act.id}`, 'PATCH', { resourceLabel: label.trim() || null });
            return label.trim() ? `Control de ${label.trim().toLowerCase()}s activado` : 'Control por recursos desactivado';
          })}
        >Guardar</button>
      </div>
    </div>
  );
}