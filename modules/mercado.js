import { Producto } from './producto.js';

/**
 * Catálogo de productos disponibles en el mercado.
 * @type {Array<Producto>}
 */
export let mercado = [];

const dataGuardada = localStorage.getItem("productos_diego");

if (dataGuardada) {
    const productosPlanos = JSON.parse(dataGuardada);
    if (Array.isArray(productosPlanos)) {
        mercado = productosPlanos.map(p => 
            new Producto(p.nombre, p.precio, p.rareza, p.tipo, p.stats, p.imagen)
        );
    }
}

/**
 * Selecciona aleatoriamente una rareza de la lista disponible.
 * @returns {string} Una rareza ('común', 'raro' o 'épico').
 */
export function obtenerRarezaAleatoria() {
    const rarezas = ['común', 'raro', 'épico'];
    const indice = Math.floor(Math.random() * rarezas.length);
    return rarezas[indice];
}

/**
 * Aplica un porcentaje de descuento a todos los productos de una rareza específica.
 * @param {string} rarezaRecibida - La rareza de los productos a los que aplicar el descuento.
 * @param {number} porcentaje - El porcentaje de descuento a aplicar.
 * @returns {Array<Producto>} La lista de productos (modificados con el nuevo precio).
 */
export function aplicarDescuentoPorRareza(rarezaRecibida, porcentaje) {
    
    var productosConDescuento = [];

    for (var i = 0; i < mercado.length; i++) {
        var producto = mercado[i];

        if (producto.rareza === rarezaRecibida) {
            producto.aplicarDescuento(porcentaje);
        }
        
        productosConDescuento.push(producto);
    }

    return productosConDescuento;
}

/**
 * Busca un producto en el mercado por su nombre exacto (sin distinguir mayúsculas/minúsculas).
 * @param {string} nombre - El nombre del producto a buscar.
 * @returns {Producto|null} El objeto Producto si se encuentra, o null si no existe.
 */
export function buscarProducto(nombre) {
    return mercado.find(p => p.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}