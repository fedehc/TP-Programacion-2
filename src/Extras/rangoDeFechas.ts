import { RangoInvalidoException } from "../Excepciones/exceptions";


/**
 * Representa un rango de fechas con inicio y fin.
 * Permite validar superposición, igualdad y calcular diferencias de días.
 */
export default class RangoDeFechas {
  private inicio: Date;
  private fin: Date;

  /**
   * Crea un rango de fechas.
   * @param {Date | string} inicio Fecha de inicio.
   * @param {Date | string} fin Fecha de fin.
   * @throws {RangoInvalidoException} Si la fecha de inicio no es anterior a la de fin.
   */
  constructor(inicio: Date | string, fin: Date | string) {
    this.inicio = new Date(inicio);
    this.fin = new Date(fin);

    if (!(this.inicio < this.fin)) {
      throw new RangoInvalidoException(this.inicio, this.fin);
    }
  }

  /**
   * Devuelve la fecha de inicio del rango.
   * @returns {Date} Fecha de inicio.
   */
  public getInicio(): Date {
    return this.inicio;
  }

  /**
   * Devuelve la fecha de fin del rango.
   * @returns {Date} Fecha de fin.
   */
  public getFin(): Date {
    return this.fin;
  }

  /**
   * Normaliza una fecha a las 00:00:00 para comparar solo días.
   * @param {Date} fecha Fecha a normalizar.
   * @returns {Date} Fecha normalizada.
   */
  private normalizarFecha(fecha: Date): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(0, 0, 0, 0);
    return nuevaFecha;
  }

  /**
   * Verifica si este rango se superpone con otro rango.
   * @param {RangoDeFechas} otro Otro rango a comparar.
   * @returns {boolean} True si hay superposición, false si no.
   */
  public seSuperponeConOtraFecha(otro: RangoDeFechas): boolean {
    return this.getInicio() < otro.getFin() && otro.getInicio() < this.getFin();
  }

  /**
   * Verifica si una fecha dada es el mismo día que el inicio del rango.
   * @param {Date} fecha Fecha a comparar.
   * @returns {boolean} True si es el mismo día, false si no.
   */
  public esMismoDiaQueInicio(fecha: Date): boolean {
    return this.normalizarFecha(fecha).getTime() === this.normalizarFecha(this.inicio).getTime();
  }

  /**
   * Calcula la cantidad de días de diferencia entre inicio y fin.
   * @returns {number} Días de diferencia (redondeado hacia arriba).
   */
  public diasDeDiferencia(): number {
    const msPorDia = 1000 * 60 * 60 * 24;
    const diff = this.fin.getTime() - this.inicio.getTime();
    return Math.ceil(diff / msPorDia);
  }

  /**
   * Verifica si este rango es igual a otro (mismo inicio y fin).
   * @param {RangoDeFechas} otro Otro rango a comparar.
   * @returns {boolean} True si ambos rangos son iguales, false si no.
   */
  public esIgualA(otro: RangoDeFechas): boolean {
    return this.getInicio().getTime() === otro.getInicio().getTime()
      && this.getFin().getTime() === otro.getFin().getTime();
  }
}
