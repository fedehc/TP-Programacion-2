import CriterioPorAlquileres from "./Mantenimiento/criterioPorAlquileres";
import CriterioPorKilometraje from "./Mantenimiento/criterioPorKM";
import CriterioPorMeses from "./Mantenimiento/criterioPorMeses";
import { CategoriaVehiculo } from "./Extras/enums";
import EvaluadorMantenimientoPorCriterios from "./Mantenimiento/evaluadorMantenimiento";
import GestorAlquiler from "./Alquiler/gestorAlquiler";
import GestorReserva from "./Reserva/gestorReserva";
import GestorVehiculo from "./Vehiculo/gestorVehiculo";
import SistemaAlquiler from "./sistemaAlquiler";
import TarifaCompacto from "./Tarifa/tarifaCompacto";
import Vehiculo from "./Vehiculo/vehiculo";
import SelectorTemporada from "./Temporada/temporadaSelector";


(function main() {
  const criterios = [
    new CriterioPorKilometraje(10_000), 
    new CriterioPorMeses(12),           
    new CriterioPorAlquileres(5),       
  ];
  const reglaMantenimiento = new EvaluadorMantenimientoPorCriterios(criterios);

  const selector = new SelectorTemporada();

  const gestorVehiculo = new GestorVehiculo();
  const gestorReserva = new GestorReserva();
  const gestorAlquiler = new GestorAlquiler(reglaMantenimiento, selector);
  const sistema = new SistemaAlquiler(gestorVehiculo, gestorReserva, gestorAlquiler);

  const tarifa = new TarifaCompacto(30, 0.15);
  // Ajuste: firma de Vehiculo ahora es (matricula, categoria, tarifa, kilometraje)
  const v1 = new Vehiculo("AA-111-AA", CategoriaVehiculo.compacto, tarifa, 10000);
  gestorVehiculo.agregar(v1);

  const hoy = new Date();
  const mañana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
  const r = gestorReserva.crearPendiente("CLI-1", hoy, mañana);

  const rConf = sistema.ConfirmarReserva(r, CategoriaVehiculo.compacto);
  console.log("Reserva confirmada con vehículo:", rConf.getVehiculo()?.getMatricula());

  const iniciados = sistema.iniciarAlquileresDelDia([rConf], hoy);
  console.log("Alquileres iniciados hoy:", iniciados.length);

  const kmFinal = 22000; 
  sistema.finalizarAlquiler(iniciados[0], kmFinal, hoy);

  console.log("Estado final del vehículo:", v1.getEstado());
  console.log("Alquileres desde último mantenimiento:", v1.getFichaMantenimiento().getAlquileresDesdeUltimo());
})();
