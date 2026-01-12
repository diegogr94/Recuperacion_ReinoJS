/**
 * Expresión regular para validar el formato de un nombre.
 * Reglas:
 * - Debe comenzar obligatoriamente con una letra mayúscula (A-Z, ÁÉÍÓÚÑ).
 * - El resto puede contener letras, acentos, ñ, diéresis y espacios.
 * - Longitud total entre 1 y 20 caracteres (1 inicial + hasta 19 adicionales).
 *
 * @type {RegExp}
 */
export const REGEX_NOMBRE = /^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{0,19}$/;