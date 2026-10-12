const base = process.env.API ?? 'http://localhost:3001';
const slotId = Number(process.argv[2]);
const total = Number(process.argv[3] ?? 500);

if (!slotId) {
  console.error('Uso: node scripts/load-test.mjs <slotId> [total]');
  process.exit(1);
}

const t0 = Date.now();

const results = await Promise.all(
  Array.from({ length: total }, async (_, i) => {
    try {
      const res = await fetch(`${base}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          quantity: 1,
          customerName: `Turista ${i}`,
          customerContact: `900${String(i).padStart(6, '0')}`,
        }),
      });
      return res.status;
    } catch {
      return 'error de red';
    }
  }),
);

const count = {};
for (const s of results) count[s] = (count[s] ?? 0) + 1;

console.log(`Tiempo: ${Date.now() - t0} ms`);
console.log('Respuestas por estado:', count);