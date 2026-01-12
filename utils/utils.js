/**
 * Agrupa los elementos de un array según un criterio definido por una función selectora.
 * * @param {Array<any>} array - El array de elementos a agrupar.
 * @param {Function} selectorFn - Función que recibe un elemento y devuelve la clave (string/number) por la que agrupar.
 * @returns {Object} Un objeto donde las claves son los grupos y los valores son arrays con los elementos correspondientes.
 */
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


/**
 * Formateador de números para moneda Euro (configuración regional es-ES).
 * Uso: EUR.format(valor).
 * @type {Intl.NumberFormat}
 */
export const EUR = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
});

