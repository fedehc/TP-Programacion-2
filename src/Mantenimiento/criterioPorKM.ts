import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";

export default class CriterioPorKilometraje implements ICriterioMantenimiento {
  constructor(private umbralKm: number) {}

   cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    if (!ficha.huboAlgunaVezMantenimiento()) {
      return false;
    }
    const kmUlt = ficha.getKmUltimo() ?? 0;
    return (kmActual - kmUlt) >= this.umbralKm;
  }
}
