import { TransicionEstadoInvalidaException } from "../Excepciones/exceptions";
import { CategoriaVehiculo } from "../Extras/enums";
import Vehiculo from "./vehiculo";



/**
 * Gestor de vehículos: administra la flota, altas, bajas, mantenimiento y filtrado por categoría.
 *
 * Permite agregar, listar y actualizar vehículos, así como gestionar su mantenimiento.
 */
export default class GestorVehiculo {
  constructor(
    private vehiculos: Vehiculo[] = []
  ) { }


  /**
   * Agrega un vehículo a la flota.
   * @param v Vehículo a agregar
   */
  public agregar(v: Vehiculo): void { this.vehiculos.push(v); }

  /**
   * Devuelve la lista de vehículos de la flota.
   * @returns Vehículos
   */
  public listar(): Vehiculo[] { return this.vehiculos; }

  /**
   * Actualiza el kilometraje de un vehículo.
   * @param v Vehículo
   * @param km Nuevo kilometraje
   */
  public actualizarKm(v: Vehiculo, km: number): void { v.setKilometraje(km); }

  /**
   * Libera un vehículo de mantenimiento, validando el estado y registrando el mantenimiento.
   * @param vehiculo Vehículo a liberar
   * @param kmActual Kilometraje actual
   * @param costoMantenimiento Costo del mantenimiento
   * @param fechaActual Fecha de liberación (opcional)
   * @throws TransicionEstadoInvalidaException si la transición no es válida
   */
  public liberarDeMantenimiento(vehiculo: Vehiculo, kmActual: number, costoMantenimiento: number, fechaActual: Date = new Date()): void {
    if (!vehiculo.getEstadoState().puedeLiberarDeMantenimiento(vehiculo)) {
      throw new TransicionEstadoInvalidaException(vehiculo.getEstadoState().getNombre(), `liberar de mantenimiento vehículo ${vehiculo.getMatricula()}`);
    }
    vehiculo.registrarMantenimiento(fechaActual, kmActual, costoMantenimiento);
    vehiculo.getEstadoState().liberarDeMantenimiento(vehiculo);
  }

  /**
   * Devuelve los vehículos de una categoría específica.
   * @param categoria Categoría a filtrar
   * @returns Vehículos filtrados
   */
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