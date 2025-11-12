import { CriterioMantenimiento } from "./criterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";


export default class CriterioPorMeses implements CriterioMantenimiento {
  constructor(private readonly umbralMeses: number) {}

  private diffMeses(desde: Date, hasta: Date): number {
    return (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
  }

  cumple(hoy: Date, _kmActual: number, ficha: FichaMantenimiento): boolean {
    const fechaUlt = ficha.getFechaUltimo();
    if (!fechaUlt) return false;
    return this.diffMeses(fechaUlt, hoy) >= this.umbralMeses;
  }
}
