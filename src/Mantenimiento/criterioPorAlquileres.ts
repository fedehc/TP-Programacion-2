
import FichaMantenimiento from "./fichaMantenimiento";
import ICriterioMantenimiento  from "./ICriterioMantenimiento";

/**
 * Criterio de mantenimiento basado en la cantidad de alquileres realizados desde el último mantenimiento.
 * Determina si se debe realizar mantenimiento cuando se supera un umbral de alquileres.
 */
export default class CriterioPorAlquileres implements ICriterioMantenimiento {
  constructor(private umbralAlquileres: number) {}

  /**
   * Verifica si el vehículo supera el umbral de alquileres desde el último mantenimiento.
   * @param {Date} hoy Fecha actual
   * @param {number} kmActual Kilometraje actual (no se utiliza en este criterio)
   * @param {FichaMantenimiento} ficha Ficha de mantenimiento del vehículo
   * @returns {boolean} True si requiere mantenimiento, false en caso contrario
   */
  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    return ficha.getAlquileresDesdeUltimo() >= this.umbralAlquileres;
  }
}
