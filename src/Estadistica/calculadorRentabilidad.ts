import Alquiler from "../Alquiler/alquiler";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";
import { PeriodoRequeridoException, EstadisticasInsuficientesException } from "../Excepciones/exceptions";


export default class CalculadorRentabilidad {
  private mejorMatricula: string = "";
  private mejorMonto: number = 0;
  private peorMatricula: string = "";
  private peorMonto: number = 0;

  public filtrarAlquileres(alquileres: Alquiler[], periodo: RangoDeFechas): Alquiler[] {
    const alquileresFiltrados: Alquiler[] = [];
    for (let i = 0; i < alquileres.length; i++) {
      if (periodo.seSuperponeConOtraFecha(alquileres[i].getRango())) {
        alquileresFiltrados.push(alquileres[i]);
      }
    }
    return alquileresFiltrados;
  }

  public calcularIngresos(alquileres: Alquiler[]): Map<string, number> {
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

  public obtenerCostos(vehiculos: Vehiculo[]): Map<string, number> {
    const costos = new Map<string, number>();
    for (let i = 0; i < vehiculos.length; i++) {
      const matricula = vehiculos[i].getMatricula();
      const costo = vehiculos[i].getFichaMantenimiento().getCostosTotal();
      costos.set(matricula, costo);
    }
    return costos;
  }

  public calcularRentabilidad(ingresos: Map<string, number>, costos: Map<string, number>): Map<string, number> {
    const rentabilidad = new Map<string, number>();
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

    for (let i = 0; i < todasMatriculas.length; i++) {
      const matricula = todasMatriculas[i];
      const ingreso = ingresos.get(matricula) || 0;
      const costo = costos.get(matricula) || 0;
      rentabilidad.set(matricula, ingreso - costo);
    }
    return rentabilidad;
  }

  public buscarMasRentable(rentabilidad: Map<string, number>): void {
    this.mejorMatricula = "";
    this.mejorMonto = -999999;
    rentabilidad.forEach((monto, matricula) => {
      if (monto > this.mejorMonto) {
        this.mejorMonto = monto;
        this.mejorMatricula = matricula;
      }
    });
  }

  public buscarMenosRentable(rentabilidad: Map<string, number>): void {
    this.peorMatricula = "";
    this.peorMonto = 999999;
    rentabilidad.forEach((monto, matricula) => {
      if (monto < this.peorMonto) {
        this.peorMonto = monto;
        this.peorMatricula = matricula;
      }
    });
  }

  public calcular(
    alquileres: Alquiler[],
    vehiculos: Vehiculo[],
    periodo?: RangoDeFechas
  ): void {
    if (!periodo) {
      throw new PeriodoRequeridoException("calcular rentabilidad por vehículo");
    }

    if (vehiculos.length === 0) {
      throw new EstadisticasInsuficientesException("no hay vehículos en la flota");
    }

    const alquileresFiltrados = this.filtrarAlquileres(alquileres, periodo);
    const ingresos = this.calcularIngresos(alquileresFiltrados);
    const costos = this.obtenerCostos(vehiculos);
    const rentabilidad = this.calcularRentabilidad(ingresos, costos);
    
    this.buscarMasRentable(rentabilidad);
    this.buscarMenosRentable(rentabilidad);
  }

  public obtenerMasRentable(): { matricula: string; monto: number } {
    return { matricula: this.mejorMatricula, monto: this.mejorMonto };
  }

  public obtenerMenosRentable(): { matricula: string; monto: number } {
    return { matricula: this.peorMatricula, monto: this.peorMonto };
  }
}
