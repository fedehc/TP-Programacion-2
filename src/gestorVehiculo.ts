import { CategoriaVehiculo, EstadoVehiculo } from "./enums";
import Vehiculo from "./vehiculo";


export default class GestorVehiculo {
  constructor(
    private vehiculos: Vehiculo[] = []
  ) { }


  public agregar(v: Vehiculo): void { this.vehiculos.push(v); }
  public listar(): Vehiculo[] { return this.vehiculos; }
  public marcarEnAlquiler(v: Vehiculo): void { v.setEstado(EstadoVehiculo.alquiler); }
  public marcarLimpieza(v: Vehiculo): void { v.setEstado(EstadoVehiculo.limpieza); }
  public actualizarKm(v: Vehiculo, km: number): void { v.setKilometraje(km); }

  public filtrarPorCategoria(categoria: CategoriaVehiculo): Vehiculo[] {
    const listaFiltrada: Vehiculo[] = [];
    for (const v of this.vehiculos) {
      if (v.getCategoria() === categoria) {
        listaFiltrada.push(v);
      }
    }
    return listaFiltrada;
  }
}