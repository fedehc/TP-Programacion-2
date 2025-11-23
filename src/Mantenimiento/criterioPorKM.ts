import ICriterioMantenimiento from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";

/**
 * Criterio de mantenimiento basado en el kilometraje recorrido desde el último mantenimiento.
 * Determina si se debe realizar mantenimiento cuando se supera un umbral de kilómetros.
 */
export default class CriterioPorKilometraje implements ICriterioMantenimiento {
  constructor(private umbralKm: number) { }
  /**
   * Verifica si el vehículo supera el umbral de kilómetros desde el último mantenimiento.
   * @param {Date} hoy Fecha actual
   * @param {number} kmActual Kilometraje actual del vehículo
   * @param {FichaMantenimiento} ficha Ficha de mantenimiento del vehículo
   * @returns {boolean} True si requiere mantenimiento, false en caso contrario
   */
  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    if (!ficha.huboAlgunaVezMantenimiento()) {
      return false;
    }
    let kmUltimo = ficha.getKmUltimo();
    if (kmUltimo === undefined) kmUltimo = 0;

    return (kmActual - kmUltimo) >= this.umbralKm;
  }

}
