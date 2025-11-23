import Alquiler from "../Alquiler/alquiler";
import RangoDeFechas from "../Extras/rangoDeFechas";

export interface ICalculadorVehiculos {
  calcular(alquileres: Alquiler[], periodo?: RangoDeFechas): void;
  obtenerMasAlquilado(): { matricula: string; cantidad: number };
  obtenerMenosAlquilado(): { matricula: string; cantidad: number };
}