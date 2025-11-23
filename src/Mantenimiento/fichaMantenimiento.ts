
/**
 * Representa la ficha de mantenimiento de un vehículo, registrando fechas, kilometrajes y costos.
 */
export default class FichaMantenimiento {
  private fechaUltimo?: Date;
  private kmUltimo?: number;
  private alquileresDesdeUltimo: number = 0;
  private costos: number[] = [];

  /**
   * Registra un nuevo mantenimiento realizado.
   * @param hoy Fecha del mantenimiento
   * @param kmActual Kilometraje al momento del mantenimiento
   * @param costo Costo del mantenimiento
   */
  public registrarMantenimiento(hoy: Date, kmActual: number, costo: number): void {
    this.fechaUltimo = hoy;
    this.kmUltimo = kmActual;
    this.alquileresDesdeUltimo = 0;
    this.costos.push(costo);
  }

  /**
   * Registra la finalización de un alquiler, incrementando el contador desde el último mantenimiento.
   */
  public registrarAlquilerCompletado(): void {
    this.alquileresDesdeUltimo += 1;
  }

  /**
   * Obtiene la fecha del último mantenimiento realizado.
   * @returns Fecha del último mantenimiento o undefined si nunca se realizó
   */
  public getFechaUltimo(): Date | undefined { return this.fechaUltimo; }

  /**
   * Obtiene el kilometraje al momento del último mantenimiento.
   * @returns Kilometraje o undefined si nunca se realizó
   */
  public getKmUltimo(): number | undefined { return this.kmUltimo; }

  /**
   * Obtiene la cantidad de alquileres desde el último mantenimiento.
   * @returns Número de alquileres
   */
  public getAlquileresDesdeUltimo(): number { return this.alquileresDesdeUltimo; }

  /**
   * Calcula el costo total de todos los mantenimientos realizados.
   * @returns Suma de los costos
   */
  public getCostosTotal(): number {
    return this.costos.reduce((total, costo) => total + costo, 0);
  }

  /**
   * Indica si alguna vez se realizó un mantenimiento.
   * @returns true si hubo al menos un mantenimiento, false si no
   */
  public huboAlgunaVezMantenimiento(): boolean {
    return !!this.fechaUltimo || this.kmUltimo !== undefined;
  }
}
