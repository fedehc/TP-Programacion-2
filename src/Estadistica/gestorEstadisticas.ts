import Alquiler from "../Alquiler/alquiler";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";
import ICalculadorOcupacion from "./ICalculadorOcupacion";
import ICalculadorRentabilidad from "./ICalculadorRentabilidad";
import { ICalculadorVehiculos } from "./ICalculadorVehiculos";


export default class GestorEstadisticas {
  constructor(
    private calculadorVehiculos: ICalculadorVehiculos,
    private calculadorRentabilidad: ICalculadorRentabilidad,
    private calculadorOcupacion: ICalculadorOcupacion
  ) { }

  /**
   * Calcula el vehículo más alquilado en un período determinado.
   * @param alquileres Lista de alquileres a analizar
   * @param periodo Rango de fechas para filtrar los alquileres
   * @returns Objeto con la matrícula y cantidad de alquileres
   */
  public obtenerVehiculoMasAlquilado(alquileres: Alquiler[], periodo?: RangoDeFechas): { matricula: string; cantidad: number } {
    this.calculadorVehiculos.calcular(alquileres, periodo);
    return this.calculadorVehiculos.obtenerMasAlquilado();
  }

  /**
   * Calcula el vehículo menos alquilado en un período determinado.
   * @param alquileres Lista de alquileres a analizar
   * @param periodo Rango de fechas para filtrar los alquileres
   * @returns Objeto con la matrícula y cantidad de alquileres
   */
  public obtenerVehiculoMenosAlquilado(alquileres: Alquiler[], periodo?: RangoDeFechas): { matricula: string; cantidad: number } {
    this.calculadorVehiculos.calcular(alquileres, periodo);
    return this.calculadorVehiculos.obtenerMenosAlquilado();
  }

  /**
   * Calcula el vehículo con mayor rentabilidad en un período determinado.
   * Rentabilidad = ingresos por alquiler - costos de mantenimiento
   * @param alquileres Lista de alquileres a analizar
   * @param vehiculos Lista de vehículos de la flota
   * @param periodo Rango de fechas para filtrar los alquileres
   * @returns Objeto con la matrícula y monto de rentabilidad
   */
  public obtenerVehiculoMasRentable(alquileres: Alquiler[], vehiculos: Vehiculo[], periodo?: RangoDeFechas): { matricula: string; monto: number } {
    this.calculadorRentabilidad.calcular(alquileres, vehiculos, periodo);
    return this.calculadorRentabilidad.obtenerMasRentable();
  }

  /**
   * Calcula el vehículo con menor rentabilidad en un período determinado.
   * Rentabilidad = ingresos por alquiler - costos de mantenimiento
   * @param alquileres Lista de alquileres a analizar
   * @param vehiculos Lista de vehículos de la flota
   * @param periodo Rango de fechas para filtrar los alquileres
   * @returns Objeto con la matrícula y monto de rentabilidad
   */
  public obtenerVehiculoMenosRentable(alquileres: Alquiler[], vehiculos: Vehiculo[], periodo?: RangoDeFechas): { matricula: string; monto: number } {
    this.calculadorRentabilidad.calcular(alquileres, vehiculos, periodo);
    return this.calculadorRentabilidad.obtenerMenosRentable();
  }

  /**
   * Calcula el porcentaje de ocupación actual de la flota.
   * Ocupación = (vehículos en alquiler / total de vehículos) * 100
   * @param vehiculos Lista de vehículos de la flota
   * @returns Objeto con el porcentaje, cantidad en alquiler y total
   */
  public obtenerOcupacionFlota(vehiculos: Vehiculo[]): { porcentaje: number; enAlquiler: number; total: number } {
    this.calculadorOcupacion.calcular(vehiculos);
    return this.calculadorOcupacion.obtenerOcupacion();
  }
}
