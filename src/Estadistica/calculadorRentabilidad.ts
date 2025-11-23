import Alquiler from "../Alquiler/alquiler";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";

import { PeriodoRequeridoException, EstadisticasInsuficientesException } from "../Excepciones/exceptions";
import ICalculadorRentabilidad from "./ICalculadorRentabilidad";

/**
 * Calcula la rentabilidad de cada vehículo en un período dado.
 * Permite obtener la matrícula y monto del vehículo más y menos rentable.
 * @implements {ICalculadorRentabilidad}
 */
export default class CalculadorRentabilidad implements ICalculadorRentabilidad {
  private mejorMatricula: string = "";
  private mejorMonto: number = 0;
  private peorMatricula: string = "";
  private peorMonto: number = 0;

  /**
   * Filtra los alquileres que se superponen con el período dado.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @param {RangoDeFechas} periodo Período a considerar.
   * @returns {Alquiler[]} Alquileres filtrados.
   */
  private filtrarAlquileres(alquileres: Alquiler[], periodo: RangoDeFechas): Alquiler[] {
    const alquileresFiltrados: Alquiler[] = [];
    for (let i = 0; i < alquileres.length; i++) {
      if (periodo.seSuperponeConOtraFecha(alquileres[i].getRango())) {
        alquileresFiltrados.push(alquileres[i]);
      }
    }
    return alquileresFiltrados;
  }

  /**
   * Calcula los ingresos por matrícula de vehículo.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @returns {Map<string, number>} Mapa de matrícula a ingresos.
   */
  private calcularIngresos(alquileres: Alquiler[]): Map<string, number> {
    const ingresos = new Map<string, number>();
    for (let i = 0; i < alquileres.length; i++) {
      const alquiler = alquileres[i];
      if (alquiler.getCostoTotal() !== undefined) {
        const matricula = alquiler.getVehiculo().getMatricula();
        const costoActual = ingresos.get(matricula) || 0;
        ingresos.set(matricula, costoActual + alquiler.getCostoTotal()!);
      }
    }
    return ingresos;
  }

  /**
   * Obtiene los costos de mantenimiento por matrícula de vehículo.
   * @param {Vehiculo[]} vehiculos Lista de vehículos.
   * @returns {Map<string, number>} Mapa de matrícula a costos.
   */
  private obtenerCostos(vehiculos: Vehiculo[]): Map<string, number> {
    const costos = new Map<string, number>();
    for (let i = 0; i < vehiculos.length; i++) {
      const matricula = vehiculos[i].getMatricula();
      const costo = vehiculos[i].getFichaMantenimiento().getCostosTotal();
      costos.set(matricula, costo);
    }
    return costos;
  }

  /**
   * Obtiene todas las matrículas presentes en ingresos o costos.
   * @param {Map<string, number>} ingresos Mapa de ingresos.
   * @param {Map<string, number>} costos Mapa de costos.
   * @returns {string[]} Lista de matrículas.
   */
  private obtenerTodasMatriculas(ingresos: Map<string, number>, costos: Map<string, number>): string[] {
    const todasMatriculas: string[] = [];
    ingresos.forEach((_, matricula) => {
      if (!todasMatriculas.includes(matricula)) {
        todasMatriculas.push(matricula);
      }
    });
    costos.forEach((_, matricula) => {
      if (!todasMatriculas.includes(matricula)) {
        todasMatriculas.push(matricula);
      }
    });
    return todasMatriculas;
  }

  /**
   * Calcula la rentabilidad de una matrícula específica.
   * @param {string} matricula Matrícula del vehículo.
   * @param {Map<string, number>} ingresos Mapa de ingresos.
   * @param {Map<string, number>} costos Mapa de costos.
   * @returns {number} Rentabilidad calculada.
   */
  private calcularRentabilidadPorMatricula(matricula: string, ingresos: Map<string, number>, costos: Map<string, number>): number {
    const ingreso = ingresos.get(matricula) || 0;
    const costo = costos.get(matricula) || 0;
    return ingreso - costo;
  }

  /**
   * Calcula la rentabilidad por matrícula para todas las matrículas.
   * @param {Map<string, number>} ingresos Mapa de ingresos.
   * @param {Map<string, number>} costos Mapa de costos.
   * @returns {Map<string, number>} Mapa de matrícula a rentabilidad.
   */
  private calcularRentabilidad(ingresos: Map<string, number>, costos: Map<string, number>): Map<string, number> {
    const rentabilidad = new Map<string, number>();
    const todasMatriculas = this.obtenerTodasMatriculas(ingresos, costos);

    for (let i = 0; i < todasMatriculas.length; i++) {
      const matricula = todasMatriculas[i];
      const rent = this.calcularRentabilidadPorMatricula(matricula, ingresos, costos);
      rentabilidad.set(matricula, rent);
    }
    return rentabilidad;
  }

  /**
   * Busca y guarda la matrícula y monto del vehículo más rentable.
   * @param {Map<string, number>} rentabilidad Mapa de matrícula a rentabilidad.
   * @returns {void}
   */
  private buscarMasRentable(rentabilidad: Map<string, number>): void {
    this.mejorMatricula = "";
    this.mejorMonto = Number.NEGATIVE_INFINITY;
    rentabilidad.forEach((monto, matricula) => {
      if (monto > this.mejorMonto) {
        this.mejorMonto = monto;
        this.mejorMatricula = matricula;
      }
    });
  }

  /**
   * Busca y guarda la matrícula y monto del vehículo menos rentable.
   * @param {Map<string, number>} rentabilidad Mapa de matrícula a rentabilidad.
   * @returns {void}
   */
  private buscarMenosRentable(rentabilidad: Map<string, number>): void {
    this.peorMatricula = "";
    this.peorMonto = Number.POSITIVE_INFINITY;
    rentabilidad.forEach((monto, matricula) => {
      if (monto < this.peorMonto) {
        this.peorMonto = monto;
        this.peorMatricula = matricula;
      }
    });
  }

  /**
   * Calcula la rentabilidad de los vehículos en el período dado.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @param {Vehiculo[]} vehiculos Lista de vehículos.
   * @param {RangoDeFechas} [periodo] Período a considerar (obligatorio).
   * @throws {PeriodoRequeridoException} Si no se provee período.
   * @throws {EstadisticasInsuficientesException} Si no hay datos suficientes.
   * @returns {void}
   */
  public calcular(
    alquileres: Alquiler[],
    vehiculos: Vehiculo[],
    periodo?: RangoDeFechas
  ): void {
    this.validarDatosDeEntrada(vehiculos, periodo);
    const rentabilidadPorVehiculo = this.procesarRentabilidad(alquileres, vehiculos, periodo!);
    this.guardarResultados(rentabilidadPorVehiculo);
  }

  /**
   * Valida que los datos de entrada sean correctos.
   * @param {Vehiculo[]} vehiculos Lista de vehículos.
   * @param {RangoDeFechas} [periodo] Período a verificar.
   * @throws {PeriodoRequeridoException} Si el período es undefined.
   * @throws {EstadisticasInsuficientesException} Si no hay vehículos.
   */
  private validarDatosDeEntrada(vehiculos: Vehiculo[], periodo?: RangoDeFechas): void {
    if (!periodo) {
      throw new PeriodoRequeridoException("calcular rentabilidad por vehículo");
    }
    if (vehiculos.length === 0) {
      throw new EstadisticasInsuficientesException("no hay vehículos en la flota");
    }
  }

  /**
   * Procesa la rentabilidad de los vehículos en el período dado.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @param {Vehiculo[]} vehiculos Lista de vehículos.
   * @param {RangoDeFechas} periodo Período a considerar.
   * @returns {Map<string, number>} Mapa de matrícula a rentabilidad.
   */
  private procesarRentabilidad(
    alquileres: Alquiler[],
    vehiculos: Vehiculo[],
    periodo: RangoDeFechas
  ): Map<string, number> {
    const alquileresFiltrados = this.filtrarAlquileres(alquileres, periodo);
    const ingresosDelPeriodo = this.calcularIngresos(alquileresFiltrados);
    const costosDeMantenimiento = this.obtenerCostos(vehiculos);
    return this.calcularRentabilidad(ingresosDelPeriodo, costosDeMantenimiento);
  }

  /**
   * Guarda los resultados de los cálculos de rentabilidad.
   * @param {Map<string, number>} rentabilidadPorVehiculo Mapa de matrícula a rentabilidad.
   * @returns {void}
   */
  private guardarResultados(rentabilidadPorVehiculo: Map<string, number>): void {
    this.buscarMasRentable(rentabilidadPorVehiculo);
    this.buscarMenosRentable(rentabilidadPorVehiculo);
  }

  /**
   * Devuelve la matrícula y monto del vehículo más rentable.
   * @returns {{ matricula: string, monto: number }} Objeto con matrícula y monto.
   */
  public obtenerMasRentable(): { matricula: string; monto: number } {
    return { matricula: this.mejorMatricula, monto: this.mejorMonto };
  }

  /**
   * Devuelve la matrícula y monto del vehículo menos rentable.
   * @returns {{ matricula: string, monto: number }} Objeto con matrícula y monto.
   */
  public obtenerMenosRentable(): { matricula: string; monto: number } {
    return { matricula: this.peorMatricula, monto: this.peorMonto };
  }
}
