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
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(0, 0, 0, 0);
    return nuevaFecha;
  }

  public seCruzaCon(otro: RangoDeFechas): boolean {
    return this.inicio < otro.fin && otro.inicio < this.fin;
  }

  public esMismoDiaQueInicio(fecha: Date): boolean {
    return this.normalizarFecha(fecha).getTime() === this.normalizarFecha(this.inicio).getTime();
  }

  public esAntesDeFin(fecha: Date): boolean {
    return this.normalizarFecha(fecha).getTime() < this.normalizarFecha(this.fin).getTime();
  }

  public esIgualOPosteriorAFin(fecha: Date): boolean {
    return !this.esAntesDeFin(fecha);
  }

  public diasDeDiferencia(): number {
    const msPorDia = 1000 * 60 * 60 * 24;
    const diff = this.fin.getTime() - this.inicio.getTime();
    return Math.ceil(diff / msPorDia);
  }
}
