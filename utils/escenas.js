export function showScene(id) {
  document.querySelectorAll('.escena').forEach(
    element => element.classList.remove('activa')
  );
  document.getElementById(id).classList.add('activa');
}