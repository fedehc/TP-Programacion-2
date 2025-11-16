import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";


export default class CriterioPorMeses implements ICriterioMantenimiento {
  constructor(private readonly umbralMeses: number) {}

  private diffMeses(desde: Date, hasta: Date): number {
    return (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
  }

  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    const fechaUlt = ficha.getFechaUltimo();
    if (!fechaUlt) return false;
    return this.diffMeses(fechaUlt, hoy) >= this.umbralMeses;
  }
}
