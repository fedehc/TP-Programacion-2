import Alquiler from "../Alquiler/alquiler";
import { EstadisticasInsuficientesException, PeriodoRequeridoException } from "../Excepciones/exceptions";
import RangoDeFechas from "../Extras/rangoDeFechas";

export default class CalculadorVehiculos {
  private masMatricula: string = "";
  private masCantidad: number = 0;
  private menosMatricula: string = "";
  private menosCantidad: number = 0;

  public filtrarAlquileres(alquileres: Alquiler[], periodo: RangoDeFechas): Alquiler[] {
    const alquileresFiltrados: Alquiler[] = [];
    for (let i = 0; i < alquileres.length; i++) {
      if (periodo.seSuperponeConOtraFecha(alquileres[i].getRango())) {
        alquileresFiltrados.push(alquileres[i]);
      }
    }
    return alquileresFiltrados;
  }

  public contarPorMatricula(alquileres: Alquiler[]): Map<string, number> {
    const conteo = new Map<string, number>();
    for (let i = 0; i < alquileres.length; i++) {
      const matricula = alquileres[i].getVehiculo().getMatricula();
      if (conteo.has(matricula)) {
        conteo.set(matricula, conteo.get(matricula)! + 1);
      } else {
        conteo.set(matricula, 1);
      }
    }
    return conteo;
  }

  public buscarMasAlquilado(conteo: Map<string, number>): void {
    this.masMatricula = "";
    this.masCantidad = 0;
    conteo.forEach((cantidad, matricula) => {
      if (cantidad > this.masCantidad) {
        this.masCantidad = cantidad;
        this.masMatricula = matricula;
      }
    });
  }

  public buscarMenosAlquilado(conteo: Map<string, number>): void {
    this.menosMatricula = "";
    this.menosCantidad = 999999;
    conteo.forEach((cantidad, matricula) => {
      if (cantidad < this.menosCantidad) {
        this.menosCantidad = cantidad;
        this.menosMatricula = matricula;
      }
    });
  }

  public calcular(alquileres: Alquiler[], periodo?: RangoDeFechas): void {
    if (!periodo) {
      throw new PeriodoRequeridoException("calcular vehículos más/menos alquilados");
    }

    const alquileresFiltrados = this.filtrarAlquileres(alquileres, periodo);

    if (alquileresFiltrados.length === 0) {
      throw new EstadisticasInsuficientesException("no hay alquileres en el período especificado");
    }

    const conteo = this.contarPorMatricula(alquileresFiltrados);
    this.buscarMasAlquilado(conteo);
    this.buscarMenosAlquilado(conteo);
  }

  public obtenerMasAlquilado(): { matricula: string; cantidad: number } {
    return { matricula: this.masMatricula, cantidad: this.masCantidad };
  }

  public obtenerMenosAlquilado(): { matricula: string; cantidad: number } {
    return { matricula: this.menosMatricula, cantidad: this.menosCantidad };
  }
}
