import Alquiler from "../Alquiler/alquiler";
import { EstadisticasInsuficientesException, PeriodoRequeridoException } from "../Excepciones/exceptions";
import RangoDeFechas from "../Extras/rangoDeFechas";
import { ICalculadorVehiculos } from "./ICalculadorVehiculos";


/**
 * Calcula estadísticas de vehículos más y menos alquilados en un período dado.
 * Permite obtener la matrícula y cantidad de alquileres del vehículo más y menos alquilado.
 * @implements {ICalculadorVehiculos}
 */
export default class CalculadorVehiculos implements ICalculadorVehiculos {
  private masMatricula: string = "";
  private masCantidad: number = 0;
  private menosMatricula: string = "";
  private menosCantidad: number = 0;

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
   * Cuenta la cantidad de alquileres por matrícula de vehículo.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @returns {Map<string, number>} Mapa de matrícula a cantidad de alquileres.
   */
private contarPorMatricula(alquileres: Alquiler[]): Map<string, number> {
    const conteo = new Map<string, number>();
    for (let i = 0; i < alquileres.length; i++) {
      const matricula = alquileres[i].getVehiculo().getMatricula();
      if (!conteo.has(matricula)) {
        conteo.set(matricula, 1);
      } else {
        const actual = conteo.get(matricula);
        if (actual !== undefined) {
          conteo.set(matricula, actual + 1);
        } else {
          conteo.set(matricula, 1);
        }
      }
    }
    return conteo;
  }

  /**
   * Busca y guarda la matrícula y cantidad del vehículo más alquilado.
   * @param {Map<string, number>} conteo Mapa de matrícula a cantidad de alquileres.
   * @returns {void}
   */
  private buscarMasAlquilado(conteo: Map<string, number>): void {
    this.masMatricula = "";
    this.masCantidad = 0;
    conteo.forEach((cantidad, matricula) => {
      if (cantidad > this.masCantidad) {
        this.masCantidad = cantidad;
        this.masMatricula = matricula;
      }
    });
  }

  /**
   * Busca y guarda la matrícula y cantidad del vehículo menos alquilado.
   * @param {Map<string, number>} conteo Mapa de matrícula a cantidad de alquileres.
   * @returns {void}
   */
  private buscarMenosAlquilado(conteo: Map<string, number>): void {
    this.menosMatricula = "";
    this.menosCantidad = Number.POSITIVE_INFINITY;
    conteo.forEach((cantidad, matricula) => {
      if (cantidad < this.menosCantidad) {
        this.menosCantidad = cantidad;
        this.menosMatricula = matricula;
      }
    });
  }

  /**
   * Calcula los vehículos más y menos alquilados en el período dado.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @param {RangoDeFechas} [periodo] Período a considerar (obligatorio).
   * @throws {PeriodoRequeridoException} Si no se provee período.
   * @throws {EstadisticasInsuficientesException} Si no hay datos suficientes.
   * @returns {void}
   */
  public calcular(alquileres: Alquiler[], periodo?: RangoDeFechas): void {
    this.verificarPeriodo(periodo);
    const conteoDeAlquileres = this.obtenerConteoDelPeriodo(alquileres, periodo!);
    this.guardarResultados(conteoDeAlquileres);
  }

  /**
   * Verifica que el período esté definido.
   * @param {RangoDeFechas} [periodo] Período a verificar.
   * @throws {PeriodoRequeridoException} Si el período es undefined.
   */
  private verificarPeriodo(periodo?: RangoDeFechas): void {
    if (!periodo) {
      throw new PeriodoRequeridoException("calcular vehículos más/menos alquilados");
    }
  }

  /**
   * Obtiene el conteo de alquileres por matrícula en el período dado.
   * @param {Alquiler[]} alquileres Lista de alquileres.
   * @param {RangoDeFechas} periodo Período a considerar.
   * @returns {Map<string, number>} Mapa de matrícula a cantidad de alquileres.
   * @throws {EstadisticasInsuficientesException} Si no hay alquileres en el período.
   */
  private obtenerConteoDelPeriodo(alquileres: Alquiler[], periodo: RangoDeFechas): Map<string, number> {
    const alquileresFiltrados = this.filtrarAlquileres(alquileres, periodo);
    
    if (alquileresFiltrados.length === 0) {
      throw new EstadisticasInsuficientesException("no hay alquileres en el período especificado");
    }
    
    return this.contarPorMatricula(alquileresFiltrados);
  }

  /**
   * Guarda los resultados de los cálculos de más y menos alquilado.
   * @param {Map<string, number>} conteoDeAlquileres Mapa de matrícula a cantidad de alquileres.
   * @returns {void}
   */
  private guardarResultados(conteoDeAlquileres: Map<string, number>): void {
    this.buscarMasAlquilado(conteoDeAlquileres);
    this.buscarMenosAlquilado(conteoDeAlquileres);
  }

  /**
   * Devuelve la matrícula y cantidad del vehículo más alquilado.
   * @returns {{ matricula: string, cantidad: number }} Objeto con matrícula y cantidad.
   */
  public obtenerMasAlquilado(): { matricula: string; cantidad: number } {
    return { matricula: this.masMatricula, cantidad: this.masCantidad };
  }

  /**
   * Devuelve la matrícula y cantidad del vehículo menos alquilado.
   * @returns {{ matricula: string, cantidad: number }} Objeto con matrícula y cantidad.
   */
  public obtenerMenosAlquilado(): { matricula: string; cantidad: number } {
    return { matricula: this.menosMatricula, cantidad: this.menosCantidad };
  }
}
