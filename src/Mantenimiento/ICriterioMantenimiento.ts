
import FichaMantenimiento from "./fichaMantenimiento";

/**
 * Interfaz para criterios individuales de mantenimiento de vehículos.
 */
export default interface ICriterioMantenimiento {
  /**
   * Evalúa si se cumple el criterio de mantenimiento para la fecha, kilometraje y ficha dados.
   * @param hoy Fecha actual
   * @param kmActual Kilometraje actual del vehículo
   * @param ficha Ficha de mantenimiento del vehículo
   * @returns true si se cumple el criterio, false si no
   */
  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean;
}
