import { CriterioMantenimiento } from "./criterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";

export default class CriterioPorKilometraje implements CriterioMantenimiento {
  constructor(private readonly umbralKm: number) {}

  cumple(_hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    const kmUlt = ficha.getKmUltimo() ?? 0;
    return (kmActual - kmUlt) >= this.umbralKm;
  }
}
