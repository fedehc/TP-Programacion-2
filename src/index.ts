import SistemaAlquiler from "./sistemaAlquiler";
import GestorVehiculo from "./gestorVehiculo";
import GestorAlquiler from "./gestorAlquiler";
import Vehiculo from "./vehiculo";
import { CategoriaVehiculo, EstadoAlquiler, EstadoReserva, EstadoVehiculo } from "./enums";
import TarifaCompacto from "./tarifaCompacto";
import TarifaSUV from "./tarifaSuv";
import RangoDeFechas from "./rangoDeFechas";
import GestorReserva from "./gestorReserva";


function check(label: string, esperado: any, obtenido: any) {
  const ok = esperado === obtenido;
  console.log(`\n[${label}]`);
  console.log(`  Esperado: ${esperado}`);
  console.log(`  Obtenido: ${obtenido}`);
  console.log(`  => ${ok ? "PASS ✅" : "FAIL ❌"}`);
}

(function main() {
  // === Inyección de dependencias ===
  const gv = new GestorVehiculo();
  const gr = new GestorReserva();
  const ga = new GestorAlquiler();
  const sistema = new SistemaAlquiler(gv, gr, ga);


const v1 = new Vehiculo("AAA-111", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, new TarifaCompacto(), 10000);
const v2 = new Vehiculo("BBB-222", CategoriaVehiculo.suv,       EstadoVehiculo.disponible, new TarifaSUV(),      5000);


  sistema.agregarVehiculo(v1);
  sistema.agregarVehiculo(v2);

  console.log("Vehículos cargados:", sistema.listarVehiculos().map(v => `${v.getMatricula()}-${v.getCategoria()}`));

  // ===== Escenario A: Reserva rechazada por vehículo ocupado =====
  // Confirmo reserva que ocupa el Compacto (AAA-111)
  const r1 = sistema.crearReservaPendiente("C1", new Date("2025-10-15"), new Date("2025-10-17"));
  sistema.ConfirmarReserva(r1, CategoriaVehiculo.compacto);
  check("r1 estado confirmada", EstadoReserva.confirmada, r1.getEstado());

  // Segunda reserva solapada misma categoría (no hay otro Compacto) => debe cancelarse
  const r2 = sistema.crearReservaPendiente("C2", new Date("2025-10-16"), new Date("2025-10-18"));
  sistema.ConfirmarReserva(r2, CategoriaVehiculo.compacto);
  check("r2 estado cancelada por falta de disponibilidad", EstadoReserva.cancelada, r2.getEstado());

  // ===== Escenario B: Alquiler finalizado con costo =====
  // Reserva SUV que inicia hoy para poder iniciar alquiler del día
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const fin = new Date(hoy); fin.setDate(hoy.getDate() + 2); // 2 días
  const r3 = sistema.crearReservaPendiente("C3", hoy, fin);
  sistema.ConfirmarReserva(r3, CategoriaVehiculo.suv);
  check("r3 estado confirmada", EstadoReserva.confirmada, r3.getEstado());

  // Iniciar alquileres programados del día (pasamos las reservas del gestor)
  const iniciados = sistema.iniciarAlquileresDelDia(gr.listar(), hoy);
  check("Se inició 1 alquiler (SUV)", 1, iniciados.length);
  check("Estado alquiler activo", EstadoAlquiler.activo, iniciados[0].getEstado());

  // Finalizar alquiler con km finales para forzar cálculo de costo
  const alquiler = iniciados[0];
  const kmInicial = alquiler.getKilometrajeInicial();
  const kmFinal = kmInicial + 650; // excede límite para costo variable
  sistema.finalizarAlquiler(alquiler, kmFinal);

  check("Estado alquiler finalizado", EstadoAlquiler.finalizado, alquiler.getEstado());
  console.log("\nResumen alquiler finalizado:");


  // Cálculo esperado según TarifaSUV
  const dias = new RangoDeFechas(hoy, fin).diasDeDiferencia(); // debe existir en tu RangoDeFechas
  const km = alquiler.getKmRecorridos() ?? 0;
  const limite = 500;
  const base = 80 * dias + 15 * dias; // baseDia=80 + seguroDia=15 por día (según tu tarifaSuv.ts)
  const exceso = Math.max(0, km - limite);
  const extra = 0.25 * exceso;        // excedenteKm=0.25
  const esperado = base + extra;

  console.log("\n🧮 Cálculo manual esperado:");
  console.log(`Días = ${dias}`);
  console.log(`Km recorridos = ${km}`);
  console.log(`Límite = ${limite}`);
  console.log(`Exceso = ${exceso}`);
  console.log(`Base = ${base}`);
  console.log(`Recargo extra = ${extra}`);
  console.log(`Total esperado = ${esperado}`);

  check("Costo total", esperado, alquiler.getCostoTotal());
})();