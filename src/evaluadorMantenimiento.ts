import { CriterioMantenimiento } from "./criterioMantenimiento";
import FichaMantenimiento from "./fichaMantenimiento";
import { IMantenimientoPolicy } from "./IPoliticaMantenimiento";

export default class EvaluadorMantenimientoPorCriterios implements IMantenimientoPolicy {
  constructor(private readonly criterios: CriterioMantenimiento[]) {}

  requiere(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
    // Si nunca se hizo mantenimiento, decidí explícitamente si forzar (opcional):
    // return !ficha.huboAlgunaVezMantenimiento() || this.criterios.some(c => c.cumple(hoy, kmActual, ficha));
    return this.criterios.some(c => c.cumple(hoy, kmActual, ficha));
  }
}
