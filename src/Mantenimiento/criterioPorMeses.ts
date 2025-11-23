import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";


export default class CriterioPorMeses implements ICriterioMantenimiento {
  constructor(private umbralMeses: number) {}

  private diferenciaEnMeses(desde: Date, hasta: Date): number {
    return (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
  }

  cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    const fechaUlt = ficha.getFechaUltimo();
    if (!fechaUlt) return false;
    return this.diferenciaEnMeses(fechaUlt, hoy) >= this.umbralMeses;
  }
}
