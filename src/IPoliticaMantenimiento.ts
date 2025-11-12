import FichaMantenimiento from "./fichaMantenimiento";

export interface IMantenimientoPolicy {
  requiere(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean;
}


