import FichaMantenimiento from "./fichaMantenimiento";

export default interface ICriterioMantenimiento {
  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean;
}
