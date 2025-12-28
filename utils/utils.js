
export function groupBy(array, selectorFn) {
  const grouped = {};
  for (const item of array) {
    const key = selectorFn(item);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
      console.log(grouped)

  }
  return grouped;
}


export const EUR = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
});

