import ICriterioMantenimiento  from "./ICriterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";
import { IMantenimientoPolicy } from "./IPoliticaMantenimiento";

export default class EvaluadorMantenimientoPorCriterios implements IMantenimientoPolicy {
  constructor(private readonly criterios: ICriterioMantenimiento[]) {}

  requiere(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {

    return this.criterios.some(c => c.cumple(hoy, kmActual, ficha));
  }
}
