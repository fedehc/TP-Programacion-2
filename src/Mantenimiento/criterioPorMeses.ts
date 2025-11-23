import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";


/**
 * Criterio de mantenimiento basado en la cantidad de meses transcurridos desde el último mantenimiento.
 * Determina si se debe realizar mantenimiento cuando se supera un umbral de meses.
 */
export default class CriterioPorMeses implements ICriterioMantenimiento {
  constructor(private umbralMeses: number) {}

  /**
   * Calcula la diferencia en meses entre dos fechas.
   * @param {Date} desde Fecha inicial
   * @param {Date} hasta Fecha final
   * @returns {number} Diferencia en meses
   */
  private diferenciaEnMeses(desde: Date, hasta: Date): number {
    return (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
  }

  /**
   * Verifica si el vehículo supera el umbral de meses desde el último mantenimiento.
   * @param {Date} hoy Fecha actual
   * @param {number} kmActual Kilometraje actual (no se utiliza en este criterio)
   * @param {FichaMantenimiento} ficha Ficha de mantenimiento del vehículo
   * @returns {boolean} True si requiere mantenimiento, false en caso contrario
   */
  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    const fechaUlt = ficha.getFechaUltimo();
    if (!fechaUlt) return false;
    return this.diferenciaEnMeses(fechaUlt, hoy) >= this.umbralMeses;
  }
}
