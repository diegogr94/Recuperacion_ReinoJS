import { Producto } from './producto.js';


export const mercado = [
    new Producto('Espada corta', 80, 'común', 'arma', { ataque: 8 }, './imagenes/espadaCorta.jpg'),
    new Producto('Arco de caza', 70, 'común', 'arma', { ataque: 7 }, './imagenes/arcoCaza.jpg'),
    new Producto('Armadura de cuero', 60, 'común', 'armadura', { defensa: 6 }, './imagenes/armaduraCuero.jpg'),
    new Producto('Poción pequeña', 30, 'común', 'consumible', { curacion: 20 }, './imagenes/pocionPeque.jpg'),
    new Producto('Espada rúnica', 180, 'raro', 'arma', { ataque: 18 }, './imagenes/espadaRunica.jpg'),
    new Producto('Escudo de roble', 140, 'raro', 'armadura', { defensa: 14 }, './imagenes/escudoRoble.jpg'),
    new Producto('Poción grande', 80, 'raro', 'consumible', { curacion: 60 }, './imagenes/pocionGrande.jpg'),
    new Producto('Mandoble épico', 350, 'épico', 'arma', { ataque: 32 }, './imagenes/mandobleEpico.jpg'),
    new Producto('Placas dracónicas', 300, 'épico', 'armadura', { defensa: 28 }, './imagenes/placasDraconicas.jpg'),
    new Producto('Elixir legendario', 120, 'épico', 'consumible', { curacion: 150 }, './imagenes/elixirLegendario.jpg'),
];


export function obtenerRarezaAleatoria() {
    const rarezas = ['común', 'raro', 'épico'];
    const indice = Math.floor(Math.random() * rarezas.length);
    return rarezas[indice];
}


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

export function buscarProducto(nombre) {
    return mercado.find(p => p.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}