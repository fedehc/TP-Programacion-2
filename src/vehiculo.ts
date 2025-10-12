import { CategoriaVehiculo, EstadoVehiculo } from "./enums";
import Tarifa from "./tarifa";


export default class Vehiculo {
  constructor(
    private matricula: string,
    private categoria: CategoriaVehiculo,
    private estado: EstadoVehiculo = EstadoVehiculo.disponible,
    private tarifa: Tarifa,
    private kilometraje: number
  ) { }

  public getMatricula(): string { return this.matricula; }
  public getCategoria(): CategoriaVehiculo { return this.categoria; }
  public getEstado(): EstadoVehiculo { return this.estado; }
  public getTarifa(): Tarifa { return this.tarifa; }
  public getKilometraje(): number { return this.kilometraje; }
  public setEstado(nuevo: EstadoVehiculo) { this.estado = nuevo; }
  public setKilometraje(nuevoKilometraje: number) { this.kilometraje = nuevoKilometraje; }
}