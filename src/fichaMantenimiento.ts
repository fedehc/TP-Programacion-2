export default class FichaMantenimiento {
  private fechaUltimo?: Date;
  private kmUltimo?: number;
  private alquileresDesdeUltimo: number = 0;

  public registrarMantenimiento(hoy: Date, kmActual: number, _costo: number): void {
    this.fechaUltimo = hoy;
    this.kmUltimo = kmActual;
    this.alquileresDesdeUltimo = 0;
  }

  public registrarAlquilerCompletado(): void {
    this.alquileresDesdeUltimo += 1;
  }

  public getFechaUltimo(): Date | undefined { return this.fechaUltimo; }
  public getKmUltimo(): number | undefined { return this.kmUltimo; }
  public getAlquileresDesdeUltimo(): number { return this.alquileresDesdeUltimo; }

  public huboAlgunaVezMantenimiento(): boolean {
    return !!this.fechaUltimo || this.kmUltimo !== undefined;
  }
}
