/**
 * Muestra una escena específica en la interfaz y oculta las demás.
 * Elimina la clase 'activa' de todos los elementos con clase 'escena'
 * y se la añade al elemento indicado por el ID.
 *
 * @param {string} id - El ID del elemento HTML que representa la escena a activar.
 */
export function showScene(id) {
  document.querySelectorAll('.escena').forEach(
    element => element.classList.remove('activa')
  );
  document.getElementById(id).classList.add('activa');
}