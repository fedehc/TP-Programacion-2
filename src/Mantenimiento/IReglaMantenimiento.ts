
import FichaMantenimiento from "./fichaMantenimiento";

/**
 * Interfaz para reglas de mantenimiento de vehículos.
 */
export interface IReglaMantenimiento {
  /**
   * Determina si se requiere realizar mantenimiento según la fecha, kilometraje y ficha.
   * @param hoy Fecha actual
   * @param kmActual Kilometraje actual del vehículo
   * @param ficha Ficha de mantenimiento del vehículo
   * @returns true si se requiere mantenimiento, false si no
   */
  requiere(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean;
}
