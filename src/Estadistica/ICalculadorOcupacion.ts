import Vehiculo from "../Vehiculo/vehiculo";

export default interface ICalculadorOcupacion {
  calcular(vehiculos: Vehiculo[]): void;
  obtenerOcupacion(): { porcentaje: number; enAlquiler: number; total: number };
}