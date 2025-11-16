export default class FichaMantenimiento {
  private fechaUltimo?: Date;
  private kmUltimo?: number;
  private alquileresDesdeUltimo: number = 0;
  private costos: number[] = [];

  public registrarMantenimiento(hoy: Date, kmActual: number, costo: number): void {
    this.fechaUltimo = hoy;
    this.kmUltimo = kmActual;
    this.alquileresDesdeUltimo = 0;
    this.costos.push(costo);
  }

  public registrarAlquilerCompletado(): void {
    this.alquileresDesdeUltimo += 1;
  }

  public getFechaUltimo(): Date | undefined { return this.fechaUltimo; }
  public getKmUltimo(): number | undefined { return this.kmUltimo; }
  public getAlquileresDesdeUltimo(): number { return this.alquileresDesdeUltimo; }

  public getCostosTotal(): number {
    return this.costos.reduce((total, costo) => total + costo, 0);
  }

  public huboAlgunaVezMantenimiento(): boolean {
    return !!this.fechaUltimo || this.kmUltimo !== undefined;
  }
}
