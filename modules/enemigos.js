export class Enemigo {
    tipo;
    nombre;
    ataque;
    vida;

    constructor(nombre, ataque, vida) {
        this.tipo = 'enemigo'; 
        this.nombre = nombre;
        this.ataque = ataque;
        this.vida = vida;
    }

    
    mostrarEnemigo() {
        return "🗡️ " + this.nombre + " (ATQ " + this.ataque + ", HP " + this.vida + ")";
    }
}


export class JefeFinal extends Enemigo {
    habilidadEspecial;
    multiplicador;

    constructor(nombre, ataque, vida, habilidadEspecial, multiplicador = 1.3) {
        super(nombre, ataque, vida);
        this.tipo = 'jefe'; 
        this.habilidadEspecial = habilidadEspecial;
        this.multiplicador = multiplicador;
    }

    
    mostrarEnemigo() {
        return "🐲 " + this.nombre + " (ATQ " + this.ataque + ", HP " + this.vida + ") — Habilidad: " + this.habilidadEspecial;
    }
}