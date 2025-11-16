import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";

export default class CriterioPorKilometraje implements ICriterioMantenimiento {
  constructor(private readonly umbralKm: number) {}

  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    const kmUlt = ficha.getKmUltimo() ?? 0;
    return (kmActual - kmUlt) >= this.umbralKm;
  }
}
