import FichaMantenimiento from "./fichaMantenimiento";


export interface CriterioMantenimiento {
  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean;
}
