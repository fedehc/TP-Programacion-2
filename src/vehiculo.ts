import DisponibilidadService from "./disponibilidadService";
import { CategoriaVehiculo, EstadoVehiculo } from "./enums";
import FichaMantenimiento from "./fichaMantenimiento";
import RangoDeFechas from "./rangoDeFechas";
import Tarifa from "./tarifa";


export default class Vehiculo {
  private bloqueos: RangoDeFechas[] = [];
  private fichaMantenimiento?: FichaMantenimiento;
  constructor(
    private matricula: string,
    private categoria: CategoriaVehiculo,
    private estado: EstadoVehiculo = EstadoVehiculo.disponible,
    private tarifa: Tarifa,
    private kilometraje: number
  ) { }

  public getMatricula(): string {
    return this.matricula;
  }

  public getCategoria(): CategoriaVehiculo {
    return this.categoria;
  }

  public getEstado(): EstadoVehiculo {
    return this.estado;
  }

  public getTarifa(): Tarifa {
    return this.tarifa;
  }

  public getKilometraje(): number {
    return this.kilometraje;
  }

  public setEstado(nuevo: EstadoVehiculo) {
    this.estado = nuevo;
  }

  public setKilometraje(nuevoKilometraje: number) {
    this.kilometraje = nuevoKilometraje;
  }

  public getRangosBloqueados(): ReadonlyArray<RangoDeFechas> {
    return this.bloqueos;
  }

  public bloquear(rango: RangoDeFechas): void {
    this.bloqueos.push(rango);
  }

  public desbloquear(rango: RangoDeFechas): void {
    this.bloqueos = this.bloqueos.filter(b => !b.esIgualA(rango));
  }

  public limpiarBloqueos(): void {
    this.bloqueos = [];
  }

  public estaDisponible(periodo: RangoDeFechas): boolean {
    return DisponibilidadService.estaLibre(periodo, this.bloqueos);
  }

  public getFichaMantenimiento(): FichaMantenimiento {
    if (!this.fichaMantenimiento) this.fichaMantenimiento = new FichaMantenimiento();
    return this.fichaMantenimiento;
  }

  public notificarAlquilerCompletado(): void {
    this.getFichaMantenimiento().registrarAlquilerCompletado();
  }

  public marcarEnMantenimiento(): void {
    this.estado = EstadoVehiculo.mantenimiento;
  }

  public marcarLimpieza(): void {
    this.estado = EstadoVehiculo.limpieza;
  }

  public marcarDisponible(): void {
    this.estado = EstadoVehiculo.disponible;
  }
}
