import GestorAlquiler from "../Alquiler/gestorAlquiler";
import RangoDeFechas from "../Extras/rangoDeFechas";
import GestorVehiculo from "../Vehiculo/gestorVehiculo";
import CalculadorOcupacion from "./calculadorOcupacion";
import CalculadorRentabilidad from "./calculadorRentabilidad";
import CalculadorVehiculos from "./calculadorVehiculos";

export default class GestorEstadisticas {
  private calculadorVehiculos: CalculadorVehiculos;
  private calculadorRentabilidad: CalculadorRentabilidad;
  private calculadorOcupacion: CalculadorOcupacion;

  constructor(
    private gestorAlquiler: GestorAlquiler,
    private gestorVehiculo: GestorVehiculo
  ) {
    this.calculadorVehiculos = new CalculadorVehiculos();
    this.calculadorRentabilidad = new CalculadorRentabilidad();
    this.calculadorOcupacion = new CalculadorOcupacion();
  }

  public obtenerVehiculoMasAlquilado(periodo?: RangoDeFechas): { matricula: string; cantidad: number } {
    this.calculadorVehiculos.calcular(this.gestorAlquiler.listar(), periodo);
    return this.calculadorVehiculos.obtenerMasAlquilado();
  }

  public obtenerVehiculoMenosAlquilado(periodo?: RangoDeFechas): { matricula: string; cantidad: number } {
    this.calculadorVehiculos.calcular(this.gestorAlquiler.listar(), periodo);
    return this.calculadorVehiculos.obtenerMenosAlquilado();
  }

  public obtenerVehiculoMasRentable(periodo?: RangoDeFechas): { matricula: string; monto: number } {
    this.calculadorRentabilidad.calcular(
      this.gestorAlquiler.listar(),
      this.gestorVehiculo.listar(),
      periodo
    );
    return this.calculadorRentabilidad.obtenerMasRentable();
  }

  public obtenerVehiculoMenosRentable(periodo?: RangoDeFechas): { matricula: string; monto: number } {
    this.calculadorRentabilidad.calcular(
      this.gestorAlquiler.listar(),
      this.gestorVehiculo.listar(),
      periodo
    );
    return this.calculadorRentabilidad.obtenerMenosRentable();
  }

  public obtenerOcupacionFlota(): { porcentaje: number; enAlquiler: number; total: number } {
    this.calculadorOcupacion.calcular(this.gestorVehiculo.listar());
    return this.calculadorOcupacion.obtenerOcupacion();
  }
}
