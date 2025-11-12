import { CriterioMantenimiento } from "./criterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";

export default class CriterioPorAlquileres implements CriterioMantenimiento {
  constructor(private readonly umbralAlquileres: number) {}

  cumple(_hoy: Date, _kmActual: number, ficha: FichaMantenimiento): boolean {
    return ficha.getAlquileresDesdeUltimo() >= this.umbralAlquileres;
  }
}
