/**
 * @todo Evaluar refactorizar usando el patrón Chain of Responsibility.
 *       Cada criterio de mantenimiento podría actuar como un handler encadenado,
 *       reduciendo acoplamiento y permitiendo agregar o quitar criterios sin
 *       modificar esta clase (mejor OCP y extensibilidad).
 */

import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";
import { IReglaMantenimiento } from "./IReglaMantenimiento";


/**
 * Evalúa si un vehículo requiere mantenimiento según una lista de criterios.
 * Implementa IReglaMantenimiento y permite combinar múltiples criterios.
 */
export default class EvaluadorMantenimientoPorCriterios implements IReglaMantenimiento {
  /**
   * Crea un evaluador con una lista de criterios de mantenimiento.
   * @param criterios Criterios a evaluar
   */
  constructor(private criterios: ICriterioMantenimiento[]) {}

  /**
   * Determina si se requiere mantenimiento según al menos un criterio.
   * @param hoy Fecha actual
   * @param kmActual Kilometraje actual
   * @param ficha Ficha de mantenimiento
   * @returns true si algún criterio requiere mantenimiento, false si no
   */
  requiere(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    return this.criterios.some(c => c.cumple(hoy, kmActual, ficha));
  }
}
