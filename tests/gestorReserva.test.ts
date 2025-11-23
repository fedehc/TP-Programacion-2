import GestorReserva from "../src/Reserva/gestorReserva";
import Reserva from "../src/Reserva/reserva";
import Vehiculo from "../src/Vehiculo/vehiculo";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import { EstadoReserva, CategoriaVehiculo } from "../src/Extras/enums";
import Tarifa from "../src/Tarifa/tarifa";
import { VehiculoNoDisponibleException } from "../src/Excepciones/exceptions";


describe("Sistema de gestión de reservas", () => {
  let gestor: GestorReserva;
  let vehiculo: Vehiculo;
  let fechaInicio: Date;
  let fechaFin: Date;

  beforeEach(() => {
    gestor = new GestorReserva();
    const tarifa = { calcularCosto: () => 100 } as Tarifa;
    vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.sedan, tarifa, 10000);
    fechaInicio = new Date("2024-07-01");
    fechaFin = new Date("2024-07-07");
  });

  describe("Al crear reservas pendientes", () => {
    test("debe generar una reserva con identificador único", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      expect(reserva.getId()).toBeDefined();
      expect(reserva.getId()).toMatch(/^R-/);
    });

    test("debe asociar correctamente el cliente", () => {
      const reserva = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);

      expect(reserva.getClienteId()).toBe("CLI456");
    });

    test("debe crear el rango de fechas correctamente", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const rango = reserva.getRango();

      expect(rango.getInicio()).toEqual(fechaInicio);
      expect(rango.getFin()).toEqual(fechaFin);
    });

    test("debe iniciar en estado pendiente", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      expect(reserva.getEstado()).toBe(EstadoReserva.pendiente);
    });

    test("no debe tener vehículo asignado", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      expect(reserva.getVehiculo()).toBeUndefined();
    });

    test("debe generar identificadores diferentes para cada reserva", async () => {
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      await new Promise(resolve => setTimeout(resolve, 2));
      const reserva2 = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);
      await new Promise(resolve => setTimeout(resolve, 2));
      const reserva3 = gestor.crearPendiente("CLI789", fechaInicio, fechaFin);

      expect(reserva1.getId()).not.toBe(reserva2.getId());
      expect(reserva1.getId()).not.toBe(reserva3.getId());
      expect(reserva2.getId()).not.toBe(reserva3.getId());
    });
  });

  describe("Al confirmar una reserva con vehículo disponible", () => {
    test("debe cambiar el estado a confirmada", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      gestor.confirmar(reserva, vehiculo);

      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
    });

    test("debe asignar el vehículo a la reserva", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      gestor.confirmar(reserva, vehiculo);

      expect(reserva.getVehiculo()).toBe(vehiculo);
    });

    test("debe agregar la reserva al listado", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      gestor.confirmar(reserva, vehiculo);

      const lista = gestor.listar();
      expect(lista).toContain(reserva);
      expect(lista.length).toBe(1);
    });

    test("debe bloquear el vehículo en las fechas reservadas", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const rango = reserva.getRango();

      gestor.confirmar(reserva, vehiculo);

      expect(vehiculo.estaDisponible(rango)).toBe(false);
    });

    test("debe retornar la reserva confirmada", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      const resultado = gestor.confirmar(reserva, vehiculo);

      expect(resultado).toBe(reserva);
      expect(resultado.getEstado()).toBe(EstadoReserva.confirmada);
    });
  });

  describe("Al confirmar una reserva sin vehículo disponible", () => {
    test("debe cancelar la reserva si se pasa null", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      gestor.confirmar(reserva, null);

      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
    });

    test("no debe agregar la reserva cancelada al listado", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);

      gestor.confirmar(reserva, null);

      const lista = gestor.listar();
      expect(lista).not.toContain(reserva);
      expect(lista.length).toBe(0);
    });

    test("debe lanzar excepción si el vehículo no está disponible", () => {
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);

      gestor.confirmar(reserva1, vehiculo);

      expect(() => {
        gestor.confirmar(reserva2, vehiculo);
      }).toThrow(VehiculoNoDisponibleException);
    });

    test("el vehículo debe seguir bloqueado si falla la confirmación", () => {
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);
      const rango = reserva1.getRango();

      gestor.confirmar(reserva1, vehiculo);

      try {
        gestor.confirmar(reserva2, vehiculo);
      } catch (e) {
        // Esperado
      }

      expect(vehiculo.estaDisponible(rango)).toBe(false);
    });
  });

  describe("Al cancelar una reserva confirmada", () => {
    test("debe cambiar el estado a cancelada", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      gestor.confirmar(reserva, vehiculo);

      gestor.cancelar(reserva);

      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
    });

    test("debe liberar el vehículo asignado", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      gestor.confirmar(reserva, vehiculo);

      gestor.cancelar(reserva);

      expect(reserva.getVehiculo()).toBeUndefined();
    });

    test("debe desbloquear las fechas del vehículo", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const rango = reserva.getRango();
      gestor.confirmar(reserva, vehiculo);
      expect(vehiculo.estaDisponible(rango)).toBe(false);

      gestor.cancelar(reserva);

      expect(vehiculo.estaDisponible(rango)).toBe(true);
    });

    test("la reserva debe permanecer en el listado aunque esté cancelada", () => {
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      gestor.confirmar(reserva, vehiculo);

      gestor.cancelar(reserva);

      const lista = gestor.listar();
      expect(lista).toContain(reserva);
    });

    test("debe funcionar si la reserva no tenía vehículo asignado", () => {
      const rango = new RangoDeFechas(fechaInicio, fechaFin);
      const reserva = new Reserva("R001", "CLI123", rango);

      expect(() => {
        gestor.cancelar(reserva);
      }).not.toThrow();

      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
    });
  });

  describe("Al agregar reservas manualmente", () => {
    test("debe incorporar la reserva al listado", () => {
      const rango = new RangoDeFechas(fechaInicio, fechaFin);
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada, vehiculo);

      gestor.agregar(reserva);

      const lista = gestor.listar();
      expect(lista).toContain(reserva);
      expect(lista.length).toBe(1);
    });

    test("debe permitir agregar múltiples reservas", () => {
      const rango = new RangoDeFechas(fechaInicio, fechaFin);
      const reserva1 = new Reserva("R001", "CLI123", rango);
      const reserva2 = new Reserva("R002", "CLI456", rango);
      const reserva3 = new Reserva("R003", "CLI789", rango);

      gestor.agregar(reserva1);
      gestor.agregar(reserva2);
      gestor.agregar(reserva3);

      const lista = gestor.listar();
      expect(lista.length).toBe(3);
      expect(lista).toContain(reserva1);
      expect(lista).toContain(reserva2);
      expect(lista).toContain(reserva3);
    });
  });

  describe("Al listar reservas", () => {
    test("debe retornar una lista vacía inicialmente", () => {
      const lista = gestor.listar();

      expect(lista).toEqual([]);
      expect(lista.length).toBe(0);
    });

    test("debe incluir todas las reservas confirmadas", () => {
      const tarifa = { calcularCosto: () => 100 } as Tarifa;
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const vehiculo2 = new Vehiculo("XYZ789", CategoriaVehiculo.suv, tarifa, 20000);
      
      const otroInicio = new Date("2024-08-01");
      const otroFin = new Date("2024-08-05");
      const reserva2 = gestor.crearPendiente("CLI456", otroInicio, otroFin);

      gestor.confirmar(reserva1, vehiculo);
      gestor.confirmar(reserva2, vehiculo2);

      const lista = gestor.listar();
      expect(lista.length).toBe(2);
      expect(lista).toContain(reserva1);
      expect(lista).toContain(reserva2);
    });

    test("debe incluir reservas en diferentes estados", () => {
      const rango = new RangoDeFechas(fechaInicio, fechaFin);
      const confirmada = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada);
      const cancelada = new Reserva("R002", "CLI456", rango, EstadoReserva.cancelada);
      const cumplida = new Reserva("R003", "CLI789", rango, EstadoReserva.cumplida);

      gestor.agregar(confirmada);
      gestor.agregar(cancelada);
      gestor.agregar(cumplida);

      const lista = gestor.listar();
      expect(lista.length).toBe(3);
    });
  });

  describe("Flujo completo de una reserva exitosa", () => {
    test("debe completar todo el proceso de reserva y confirmación", () => {
      // Crear reserva pendiente
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      expect(reserva.getEstado()).toBe(EstadoReserva.pendiente);
      expect(reserva.getVehiculo()).toBeUndefined();

      // Confirmar con vehículo
      gestor.confirmar(reserva, vehiculo);
      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva.getVehiculo()).toBe(vehiculo);
      expect(reserva.puedeIniciarAlquiler()).toBe(true);

      // Verificar que está en el listado
      const lista = gestor.listar();
      expect(lista).toContain(reserva);
      expect(lista.length).toBe(1);

      // Verificar que el vehículo está bloqueado
      expect(vehiculo.estaDisponible(reserva.getRango())).toBe(false);
    });

    test("debe manejar el caso de rechazo de reserva", () => {
      // Crear reserva pendiente
      const reserva = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      expect(reserva.getEstado()).toBe(EstadoReserva.pendiente);

      // Rechazar (confirmar con null)
      gestor.confirmar(reserva, null);
      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
      expect(reserva.getVehiculo()).toBeUndefined();

      // No debe estar en el listado
      const lista = gestor.listar();
      expect(lista).not.toContain(reserva);
      expect(lista.length).toBe(0);
    });
  });

  describe("Gestión de múltiples reservas simultáneas", () => {
    test("debe permitir confirmar varias reservas con diferentes vehículos", () => {
      const tarifa = { calcularCosto: () => 100 } as Tarifa;
      const vehiculo1 = new Vehiculo("ABC123", CategoriaVehiculo.sedan, tarifa, 10000);
      const vehiculo2 = new Vehiculo("DEF456", CategoriaVehiculo.suv, tarifa, 20000);
      const vehiculo3 = new Vehiculo("GHI789", CategoriaVehiculo.compacto, tarifa, 15000);

      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);
      const reserva3 = gestor.crearPendiente("CLI789", fechaInicio, fechaFin);

      gestor.confirmar(reserva1, vehiculo1);
      gestor.confirmar(reserva2, vehiculo2);
      gestor.confirmar(reserva3, vehiculo3);

      const lista = gestor.listar();
      expect(lista.length).toBe(3);
      expect(reserva1.getVehiculo()).toBe(vehiculo1);
      expect(reserva2.getVehiculo()).toBe(vehiculo2);
      expect(reserva3.getVehiculo()).toBe(vehiculo3);
    });

    test("debe permitir el mismo vehículo en fechas diferentes", () => {
      const primerPeriodoInicio = new Date("2024-07-01");
      const primerPeriodoFin = new Date("2024-07-05");
      const segundoPeriodoInicio = new Date("2024-07-10");
      const segundoPeriodoFin = new Date("2024-07-15");

      const reserva1 = gestor.crearPendiente("CLI123", primerPeriodoInicio, primerPeriodoFin);
      const reserva2 = gestor.crearPendiente("CLI456", segundoPeriodoInicio, segundoPeriodoFin);

      gestor.confirmar(reserva1, vehiculo);
      gestor.confirmar(reserva2, vehiculo);

      const lista = gestor.listar();
      expect(lista.length).toBe(2);
      expect(reserva1.getVehiculo()).toBe(vehiculo);
      expect(reserva2.getVehiculo()).toBe(vehiculo);
    });

    test("debe rechazar reservas con solapamiento de fechas", () => {
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI456", new Date("2024-07-05"), new Date("2024-07-10"));

      gestor.confirmar(reserva1, vehiculo);

      expect(() => {
        gestor.confirmar(reserva2, vehiculo);
      }).toThrow(VehiculoNoDisponibleException);

      const lista = gestor.listar();
      expect(lista.length).toBe(1);
      expect(lista).toContain(reserva1);
      expect(lista).not.toContain(reserva2);
    });
  });

  describe("Cancelación de reservas y liberación de recursos", () => {
    test("debe permitir reutilizar un vehículo tras cancelar", () => {
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);

      // Primera reserva
      gestor.confirmar(reserva1, vehiculo);
      expect(reserva1.getEstado()).toBe(EstadoReserva.confirmada);

      // Cancelar primera reserva
      gestor.cancelar(reserva1);
      expect(reserva1.getEstado()).toBe(EstadoReserva.cancelada);

      // Ahora se puede confirmar la segunda
      gestor.confirmar(reserva2, vehiculo);
      expect(reserva2.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva2.getVehiculo()).toBe(vehiculo);
    });

    test("debe mantener el historial de todas las reservas", () => {
      const tarifa = { calcularCosto: () => 100 } as Tarifa;
      const vehiculo2 = new Vehiculo("XYZ999", CategoriaVehiculo.suv, tarifa, 30000);
      
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI456", fechaInicio, fechaFin);

      gestor.confirmar(reserva1, vehiculo);
      gestor.confirmar(reserva2, vehiculo2);

      gestor.cancelar(reserva1);

      const lista = gestor.listar();
      expect(lista.length).toBe(2);
      expect(lista).toContain(reserva1);
      expect(lista).toContain(reserva2);
      expect(reserva1.getEstado()).toBe(EstadoReserva.cancelada);
      expect(reserva2.getEstado()).toBe(EstadoReserva.confirmada);
    });
  });

  describe("Casos límite y validaciones", () => {
    test("debe manejar confirmación de múltiples reservas del mismo cliente", () => {
      const tarifa = { calcularCosto: () => 100 } as Tarifa;
      const vehiculo2 = new Vehiculo("DEF456", CategoriaVehiculo.suv, tarifa, 20000);
      
      const reserva1 = gestor.crearPendiente("CLI123", fechaInicio, fechaFin);
      const reserva2 = gestor.crearPendiente("CLI123", new Date("2024-08-01"), new Date("2024-08-05"));

      gestor.confirmar(reserva1, vehiculo);
      gestor.confirmar(reserva2, vehiculo2);

      expect(reserva1.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva2.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva1.getClienteId()).toBe("CLI123");
      expect(reserva2.getClienteId()).toBe("CLI123");
    });

    test("debe generar identificadores únicos incluso en creaciones rápidas", async () => {
      const reservas = [];
      for (let i = 0; i < 10; i++) {
        reservas.push(gestor.crearPendiente(`CLI${i}`, fechaInicio, fechaFin));
        if (i < 9) await new Promise(resolve => setTimeout(resolve, 1));
      }

      const ids = reservas.map(r => r.getId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });
});
