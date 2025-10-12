export default class RangoDeFechas {
  private inicio: Date;
  private fin: Date;

    constructor(inicio: Date | string, fin: Date | string) {
    this.inicio = new Date(inicio);
    this.fin = new Date(fin);
    if (!(this.inicio < this.fin)) {
      throw new Error("Rango inválido: inicio debe ser anterior a fin.");
    }
  }

  private normalizarFecha(fecha: Date): Date {
    const f = new Date(fecha);
    f.setHours(0, 0, 0, 0);
    return f;
  }

  /** Verifica si dos rangos se solapan (ya lo tenías) */
  public seCruzaCon(otro: RangoDeFechas): boolean {
    return this.inicio < otro.fin && otro.inicio < this.fin;
  }

  /** Devuelve true si la fecha dada es el MISMO día que el inicio del rango */
  public esMismoDiaQueInicio(fecha: Date): boolean {
    return this.normalizarFecha(fecha).getTime() === this.normalizarFecha(this.inicio).getTime();
  }

  /** Devuelve true si la fecha dada es ANTES del fin del rango */
  public esAntesDeFin(fecha: Date): boolean {
    return this.normalizarFecha(fecha).getTime() < this.normalizarFecha(this.fin).getTime();
  }

  /** Devuelve true si la fecha dada es IGUAL o POSTERIOR al fin del rango */
  public esIgualOPosteriorAFin(fecha: Date): boolean {
    return !this.esAntesDeFin(fecha);
  }


  /** Devuelve la cantidad de días entre inicio y fin (redondeado hacia arriba) */
  public diasDeDiferencia(): number {
    const msPorDia = 1000 * 60 * 60 * 24;
    const diff = this.fin.getTime() - this.inicio.getTime();
    return Math.ceil(diff / msPorDia);
  }
}
