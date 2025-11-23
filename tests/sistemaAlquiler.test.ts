import SistemaAlquiler from "../src/sistemaAlquiler";
import GestorVehiculo from "../src/Vehiculo/gestorVehiculo";
import GestorReserva from "../src/Reserva/gestorReserva";
import GestorAlquiler from "../src/Alquiler/gestorAlquiler";
import Vehiculo from "../src/Vehiculo/vehiculo";
import Tarifa from "../src/Tarifa/tarifa";
import { CategoriaVehiculo } from "../src/Extras/enums";
import RangoDeFechas from "../src/Extras/rangoDeFechas";

// Mock para selector y regla de mantenimiento
const selector = {
  obtener: () => ({
    obtenerFactor: () => 1,
    aplicarCostoBase: (c: number) => c
  })
};
const reglaMantenimiento = { requiere: () => false };
const tarifa: Tarifa = { calcularCosto: () => 100 };

describe("Flujo completo del sistema de alquiler", () => {
  let sistema: SistemaAlquiler;
  let vehiculo: Vehiculo;

  beforeEach(() => {
    const gestorVehiculo = new GestorVehiculo();
    const gestorReserva = new GestorReserva();
    const gestorAlquiler = new GestorAlquiler(reglaMantenimiento, selector);
    sistema = new SistemaAlquiler(gestorVehiculo, gestorReserva, gestorAlquiler);
    vehiculo = new Vehiculo("MAT-001", CategoriaVehiculo.compacto, tarifa, 1000);
    sistema.agregarVehiculo(vehiculo);
  });

  test("alta de vehículo y consulta", () => {
    const lista = sistema.listarVehiculos();
    expect(lista.length).toBe(1);
    expect(lista[0].getMatricula()).toBe("MAT-001");
  });

  test("flujo de reserva, confirmación, inicio y finalización de alquiler", () => {
    const hoy = new Date();
    const maniana = new Date(hoy.getTime() + 24*60*60*1000);
    const reserva = sistema.crearReservaPendiente("CLI-123", hoy, maniana);
    // La reserva pendiente aún no está en el listado
    expect(sistema.listarReservas().length).toBe(0);

    // Confirmar reserva
    const confirmada = sistema.ConfirmarReserva(reserva, CategoriaVehiculo.compacto);
    expect(confirmada.getVehiculo()).toBe(vehiculo);
    // Ahora sí debe estar en el listado
    expect(sistema.listarReservas().length).toBe(1);

    // Iniciar alquiler
    const alquileres = sistema.iniciarAlquileresDelDia([confirmada], hoy);
    expect(alquileres.length).toBe(1);
    expect(alquileres[0].getVehiculo()).toBe(vehiculo);

    // Finalizar alquiler
    sistema.finalizarAlquiler(alquileres[0], 1200, maniana);
    expect(sistema.listarAlquileres().length).toBe(1);
    expect(vehiculo.getKilometraje()).toBe(1200);
  });

  test("no asigna vehículo si no hay disponible", () => {
    // No hay vehículos sedan
    const hoy = new Date();
    const maniana = new Date(hoy.getTime() + 24*60*60*1000);
    const reserva = sistema.crearReservaPendiente("CLI-999", hoy, maniana);
    const confirmada = sistema.ConfirmarReserva(reserva, CategoriaVehiculo.sedan);
    expect(confirmada.getVehiculo()).toBeUndefined();
  });
});
