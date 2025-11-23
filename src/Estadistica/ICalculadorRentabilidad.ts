import Alquiler from "../Alquiler/alquiler";
import RangoDeFechas from "../Extras/rangoDeFechas";
import Vehiculo from "../Vehiculo/vehiculo";

export default interface ICalculadorRentabilidad {
  calcular(alquileres: Alquiler[], vehiculos: Vehiculo[], periodo?: RangoDeFechas): void;
  obtenerMasRentable(): { matricula: string; monto: number };
  obtenerMenosRentable(): { matricula: string; monto: number };
}