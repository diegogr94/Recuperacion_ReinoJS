import { EUR } from '../utils/utils.js';

export class Producto {
    constructor(nombre, precio, rareza, tipo, bonus, imagen) {
        this.nombre = nombre;   
        this.precio = precio;   
        this.rareza = rareza;   
        this.tipo = tipo;       
        this.bonus = bonus;    
        this.imagen = imagen;   
    }

    formatearPrecio() {
        return EUR.format(this.precio / 100);
    }

    mostrarProducto() {

    let bonusTexto = "";

    if (this.bonus.ataque)  bonusTexto += "Ataque +" + this.bonus.ataque + " ";
    if (this.bonus.defensa) bonusTexto += "Defensa +" + this.bonus.defensa + " ";
    if (this.bonus.vida)    bonusTexto += "Vida +" + this.bonus.vida + " ";

    if (this.bonus.curacion) bonusTexto += "Curación +" + this.bonus.curacion + " ";

    return this.nombre + " [" + this.rareza + "] — " + "Precio: " + this.precio + " — " + bonusTexto;
}

    aplicarDescuento(porcentaje) {
        if (porcentaje < 0) porcentaje = 0;
        if (porcentaje > 100) porcentaje = 100;

        const nuevoPrecio = Math.round(this.precio * (1 - porcentaje / 100));

        return new Producto(this.nombre, nuevoPrecio, this.rareza, this.tipo, this.bonus, this.imagen);
    }
}