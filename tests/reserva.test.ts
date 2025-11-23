import Reserva from "../src/Reserva/reserva";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import Vehiculo from "../src/Vehiculo/vehiculo";
import { EstadoReserva, CategoriaVehiculo } from "../src/Extras/enums";
import Tarifa from "../src/Tarifa/tarifa";

describe("Gestión de reservas de vehículos", () => {
  let rango: RangoDeFechas;
  let vehiculo: Vehiculo;
  let tarifa: Tarifa;

  beforeEach(() => {
    const inicio = new Date("2024-06-10");
    const fin = new Date("2024-06-15");
    rango = new RangoDeFechas(inicio, fin);
    tarifa = { calcularCosto: () => 100 } as Tarifa;
    vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.sedan, tarifa, 10000);
  });

  describe("Al crear una nueva reserva", () => {
    test("debe almacenar correctamente el identificador", () => {
      const reserva = new Reserva("R001", "CLI123", rango);

      expect(reserva.getId()).toBe("R001");
    });

    test("debe asociar el cliente solicitante", () => {
      const reserva = new Reserva("R001", "CLI456", rango);

      expect(reserva.getClienteId()).toBe("CLI456");
    });

    test("debe guardar el periodo de reserva", () => {
      const reserva = new Reserva("R001", "CLI123", rango);

      expect(reserva.getRango()).toBe(rango);
    });

    test("debe comenzar en estado pendiente por defecto", () => {
      const reserva = new Reserva("R001", "CLI123", rango);

      expect(reserva.getEstado()).toBe(EstadoReserva.pendiente);
    });

    test("no debe tener vehículo asignado inicialmente", () => {
      const reserva = new Reserva("R001", "CLI123", rango);

      expect(reserva.getVehiculo()).toBeUndefined();
      expect(reserva.getVehiculoMatricula()).toBeUndefined();
    });

    test("debe permitir crear con un estado específico", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada);

      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
    });

    test("debe permitir crear con un vehículo preasignado", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada, vehiculo);

      expect(reserva.getVehiculo()).toBe(vehiculo);
      expect(reserva.getVehiculoMatricula()).toBe("ABC123");
    });
  });

  describe("Al confirmar una reserva con vehículo", () => {
    test("debe cambiar el estado a confirmada", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      
      reserva.confirmarConVehiculo(vehiculo);

      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
    });

    test("debe asignar el vehículo a la reserva", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      
      reserva.confirmarConVehiculo(vehiculo);

      expect(reserva.getVehiculo()).toBe(vehiculo);
    });

    test("debe permitir consultar la matrícula del vehículo asignado", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      
      reserva.confirmarConVehiculo(vehiculo);

      expect(reserva.getVehiculoMatricula()).toBe("ABC123");
    });

    test("debe poder reasignar un vehículo diferente", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      const otroVehiculo = new Vehiculo("XYZ789", CategoriaVehiculo.suv, tarifa, 20000);
      
      reserva.confirmarConVehiculo(vehiculo);
      expect(reserva.getVehiculoMatricula()).toBe("ABC123");

      reserva.confirmarConVehiculo(otroVehiculo);
      expect(reserva.getVehiculoMatricula()).toBe("XYZ789");
    });
  });

  describe("Al cancelar una reserva", () => {
    test("debe cambiar el estado a cancelada", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      reserva.confirmarConVehiculo(vehiculo);

      reserva.cancelar();

      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
    });

    test("debe liberar el vehículo asignado", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      reserva.confirmarConVehiculo(vehiculo);

      reserva.cancelar();

      expect(reserva.getVehiculo()).toBeUndefined();
      expect(reserva.getVehiculoMatricula()).toBeUndefined();
    });

    test("debe funcionar aunque no tenga vehículo asignado", () => {
      const reserva = new Reserva("R001", "CLI123", rango);

      reserva.cancelar();

      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
      expect(reserva.getVehiculo()).toBeUndefined();
    });

    test("puede cancelarse desde estado pendiente", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.pendiente);

      reserva.cancelar();

      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
    });
  });

  describe("Al marcar una reserva como cumplida", () => {
    test("debe cambiar el estado a cumplida", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada, vehiculo);

      reserva.marcarCumplida();

      expect(reserva.getEstado()).toBe(EstadoReserva.cumplida);
    });

    test("debe mantener la referencia al vehículo", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada, vehiculo);

      reserva.marcarCumplida();

      expect(reserva.getVehiculo()).toBe(vehiculo);
      expect(reserva.getVehiculoMatricula()).toBe("ABC123");
    });

    test("puede marcarse desde cualquier estado previo", () => {
      const reservaPendiente = new Reserva("R001", "CLI123", rango, EstadoReserva.pendiente);
      const reservaConfirmada = new Reserva("R002", "CLI456", rango, EstadoReserva.confirmada);

      reservaPendiente.marcarCumplida();
      reservaConfirmada.marcarCumplida();

      expect(reservaPendiente.getEstado()).toBe(EstadoReserva.cumplida);
      expect(reservaConfirmada.getEstado()).toBe(EstadoReserva.cumplida);
    });
  });

  describe("Validación para inicio de alquiler", () => {
    test("debe permitir iniciar alquiler si está confirmada", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.confirmada, vehiculo);

      expect(reserva.puedeIniciarAlquiler()).toBe(true);
    });

    test("no debe permitir iniciar alquiler si está pendiente", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.pendiente);

      expect(reserva.puedeIniciarAlquiler()).toBe(false);
    });

    test("no debe permitir iniciar alquiler si está cancelada", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.cancelada);

      expect(reserva.puedeIniciarAlquiler()).toBe(false);
    });

    test("no debe permitir iniciar alquiler si ya está cumplida", () => {
      const reserva = new Reserva("R001", "CLI123", rango, EstadoReserva.cumplida);

      expect(reserva.puedeIniciarAlquiler()).toBe(false);
    });
  });

  describe("Ciclo de vida completo de una reserva", () => {
    test("debe transitar correctamente desde creación hasta confirmación", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      expect(reserva.getEstado()).toBe(EstadoReserva.pendiente);
      expect(reserva.getVehiculo()).toBeUndefined();

      reserva.confirmarConVehiculo(vehiculo);
      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva.getVehiculo()).toBe(vehiculo);
      expect(reserva.puedeIniciarAlquiler()).toBe(true);
    });

    test("debe transitar correctamente de confirmada a cumplida", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      
      reserva.confirmarConVehiculo(vehiculo);
      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
      
      reserva.marcarCumplida();
      expect(reserva.getEstado()).toBe(EstadoReserva.cumplida);
      expect(reserva.puedeIniciarAlquiler()).toBe(false);
    });

    test("debe permitir cancelar una reserva confirmada", () => {
      const reserva = new Reserva("R001", "CLI123", rango);
      
      reserva.confirmarConVehiculo(vehiculo);
      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva.getVehiculo()).toBe(vehiculo);
      
      reserva.cancelar();
      expect(reserva.getEstado()).toBe(EstadoReserva.cancelada);
      expect(reserva.getVehiculo()).toBeUndefined();
      expect(reserva.puedeIniciarAlquiler()).toBe(false);
    });
  });

  describe("Casos especiales con diferentes vehículos", () => {
    test("debe funcionar con vehículos de diferentes tipos", () => {
      const compacto = new Vehiculo("COMP01", CategoriaVehiculo.compacto, tarifa, 15000);
      const suv = new Vehiculo("SUV001", CategoriaVehiculo.suv, tarifa, 25000);
      const sedan = new Vehiculo("SED001", CategoriaVehiculo.sedan, tarifa, 30000);

      const reserva1 = new Reserva("R001", "CLI123", rango);
      const reserva2 = new Reserva("R002", "CLI456", rango);
      const reserva3 = new Reserva("R003", "CLI789", rango);

      reserva1.confirmarConVehiculo(compacto);
      reserva2.confirmarConVehiculo(suv);
      reserva3.confirmarConVehiculo(sedan);

      expect(reserva1.getVehiculoMatricula()).toBe("COMP01");
      expect(reserva2.getVehiculoMatricula()).toBe("SUV001");
      expect(reserva3.getVehiculoMatricula()).toBe("SED001");
    });

    test("debe manejar correctamente la información de múltiples clientes", () => {
      const reservas = [
        new Reserva("R001", "CLIENTE-A", rango),
        new Reserva("R002", "CLIENTE-B", rango),
        new Reserva("R003", "CLIENTE-C", rango)
      ];

      expect(reservas[0].getClienteId()).toBe("CLIENTE-A");
      expect(reservas[1].getClienteId()).toBe("CLIENTE-B");
      expect(reservas[2].getClienteId()).toBe("CLIENTE-C");
    });
  });

  describe("Consulta de información de la reserva", () => {
    test("debe proveer acceso a toda la información básica", () => {
      const reserva = new Reserva("R999", "CLI999", rango, EstadoReserva.confirmada, vehiculo);

      expect(reserva.getId()).toBe("R999");
      expect(reserva.getClienteId()).toBe("CLI999");
      expect(reserva.getRango()).toBe(rango);
      expect(reserva.getEstado()).toBe(EstadoReserva.confirmada);
      expect(reserva.getVehiculo()).toBe(vehiculo);
      expect(reserva.getVehiculoMatricula()).toBe("ABC123");
    });

    test("debe distinguir entre diferentes identificadores", () => {
      const reserva1 = new Reserva("R001", "CLI123", rango);
      const reserva2 = new Reserva("R002", "CLI123", rango);
      const reserva3 = new Reserva("R003", "CLI456", rango);

      expect(reserva1.getId()).not.toBe(reserva2.getId());
      expect(reserva1.getId()).not.toBe(reserva3.getId());
      expect(reserva2.getId()).not.toBe(reserva3.getId());
    });
  });
});
