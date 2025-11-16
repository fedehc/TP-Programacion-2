
import FichaMantenimiento from "./fichaMantenimiento";
import ICriterioMantenimiento  from "./ICriterioMantenimiento";

export default class CriterioPorAlquileres implements ICriterioMantenimiento {
  constructor(private readonly umbralAlquileres: number) {}

  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    return ficha.getAlquileresDesdeUltimo() >= this.umbralAlquileres;
  }
}
