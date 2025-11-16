import Alquiler from "../src/Alquiler/alquiler";
import Reserva from "../src/Reserva/reserva";
import Vehiculo from "../src/Vehiculo/vehiculo";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import { CategoriaVehiculo, EstadoAlquiler, EstadoVehiculo } from "../src/Extras/enums";
import ServicioDePrecios from "../src/Extras/precioService";

describe("Alquiler - pruebas básicas", () => {
    const rango = new RangoDeFechas(
        new Date("2023-01-01T00:00:00"),
        new Date("2023-01-03T00:00:00")
    );
    const reserva = new Reserva("res-1", "cliente-1", rango);
    const tarifaDePrueba = { calcularCosto: jest.fn().mockReturnValue(0) };
    const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000);

    test("getReserva: retorna la reserva usada", () => {
        const alquilerReserva = new Alquiler("a-1", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquilerReserva.getReserva()).toBe(reserva);
    });

    test("getVehiculo: mantiene misma instancia", () => {
        const alquilerVehiculo = new Alquiler("a-2", reserva, vehiculo, "cliente-2", rango, 1500);
        expect(alquilerVehiculo.getVehiculo()).toBe(vehiculo);
    });

    test("getClienteId: devuelve el id pasado", () => {
        const alquilerCliente = new Alquiler("a-3", reserva, vehiculo, "cliente-x", rango, 500);
        expect(alquilerCliente.getClienteId()).toBe("cliente-x");
    });

    test("getRango: devuelve el rango inicial", () => {
        const alquilerRango = new Alquiler("a-4", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquilerRango.getRango()).toBe(rango);
    });

    test("getKilometrajeInicial: devuelve el que se puso", () => {
        const alquilerKmIni = new Alquiler("a-5", reserva, vehiculo, "cliente-1", rango, 777);
        expect(alquilerKmIni.getKilometrajeInicial()).toBe(777);
    });

    test("getKilometrajeFinal: antes de finalizar es undefined", () => {
        const alquilerKmFin = new Alquiler("a-6", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquilerKmFin.getKilometrajeFinal()).toBeUndefined();
    });

    test("estado inicial: activo", () => {
        const alquilerEstado = new Alquiler("a-7", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquilerEstado.getEstado()).toBe(EstadoAlquiler.activo);
    });

    test("getCostoTotal: antes de finalizar es undefined", () => {
        const alquilerCosto = new Alquiler("a-8", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquilerCosto.getCostoTotal()).toBeUndefined();
    });

    describe("Alquiler.calcularCostoTotal - casos", () => {
        const rango = new RangoDeFechas(
            new Date("2023-01-01T00:00:00"),
            new Date("2023-01-03T00:00:00")
        ); // 2 días
        const reserva = new Reserva("res-1", "cliente-1", rango);
        const tarifaDePrueba = { calcularCosto: jest.fn() };
        const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000
        );

        afterEach(() => {
            jest.restoreAllMocks();
            if (tarifaDePrueba.calcularCosto.mockReset) {
                tarifaDePrueba.calcularCosto.mockReset();
            }
        });

        test("calcularCostoTotal: usa tarifa y ServicioDePrecios", () => {
            tarifaDePrueba.calcularCosto.mockReturnValue(200);
            const aplicarSpy = jest
                .spyOn(ServicioDePrecios, "aplicar")
                .mockReturnValue(250);

            const alquiler = new Alquiler("c1", reserva, vehiculo, "cliente-1", rango, 1000, 1100);

            const resultado = alquiler.calcularCostoTotal();

            expect(tarifaDePrueba.calcularCosto).toHaveBeenCalledWith(2, 100);
            expect(aplicarSpy).toHaveBeenCalledWith(200, rango);
            expect(resultado).toBe(250);
        });

        test("error si todavía no finalizado (kmFinal undefined)", () => {
            const alquiler = new Alquiler("c2", reserva, vehiculo, "cliente-1", rango, 500);
            expect(() => alquiler.calcularCostoTotal()).toThrowError(
                "El alquiler no fue finalizado todavía."
            );
        });

        describe("Alquiler.finalizar - flujo", () => {
            const rango = new RangoDeFechas(new Date("2023-01-01T00:00:00"), new Date("2023-01-03T00:00:00"));
            const reserva = new Reserva("res-1", "cliente-1", rango);
            const tarifaDePrueba: any = { calcularCosto: jest.fn() };
            const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000);

            afterEach(() => {
                jest.restoreAllMocks();
                tarifaDePrueba.calcularCosto.mockReset && tarifaDePrueba.calcularCosto.mockReset();
            });

            test("finalizar feliz: set kmFinal, costoTotal y estado", () => {
                const calcularSpy = jest.spyOn(Alquiler.prototype as any, "calcularCostoTotal").mockReturnValue(500);

                const alquiler = new Alquiler("f1", reserva, vehiculo, "cliente-1", rango, 1000);

                alquiler.finalizar(1100);

                expect(alquiler.getKilometrajeFinal()).toBe(1100);
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
                expect(alquiler.getCostoTotal()).toBe(500);
                expect(calcularSpy).toHaveBeenCalledTimes(1);
            });

            test("finalizar: error si estado no activo (no cambia nada)", () => {
                const alquiler = new Alquiler("f2", reserva, vehiculo, "cliente-1", rango, 1000, undefined, EstadoAlquiler.finalizado);

                expect(() => alquiler.finalizar(1100)).toThrowError("El alquiler no está activo.");
                expect(alquiler.getKilometrajeFinal()).toBeUndefined();
                expect(alquiler.getCostoTotal()).toBeUndefined();
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
            });

            test("finalizar: error si kmFinal < inicial", () => {
                const alquiler = new Alquiler("f3", reserva, vehiculo, "cliente-1", rango, 2000);

                expect(() => alquiler.finalizar(1999)).toThrowError("El kilometraje final no puede ser menor al inicial.");
                expect(alquiler.getKilometrajeFinal()).toBeUndefined();
                expect(alquiler.getCostoTotal()).toBeUndefined();
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.activo);
            });


            test("finalizar límite: kmFinal == kmInicial ok", () => {
                const calcularSpy = jest.spyOn(Alquiler.prototype as any, "calcularCostoTotal").mockReturnValue(0);
                const alquiler = new Alquiler("f5", reserva, vehiculo, "cliente-1", rango, 900);

                alquiler.finalizar(900);

                expect(alquiler.getKilometrajeFinal()).toBe(900);
                expect(alquiler.getCostoTotal()).toBe(0);
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
                expect(calcularSpy).toHaveBeenCalledTimes(1);
            });


        });
        describe("Alquiler.validarFinalizacion - reglas", () => {
            const rango = new RangoDeFechas(new Date("2023-01-01T00:00:00"), new Date("2023-01-03T00:00:00"));
            const reserva = new Reserva("res-1", "cliente-1", rango);
            const tarifaDePrueba: any = { calcularCosto: jest.fn().mockReturnValue(0) };
            const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000);

            test("validar: error si estado no activo", () => {
                const alquiler = new Alquiler("a1", reserva, vehiculo, "cliente-1", rango, 1000, undefined, EstadoAlquiler.finalizado);
                expect(() => alquiler.validarFinalizacion(1001)).toThrowError("El alquiler no está activo.");
            });

            test("validar: error si kmFinal < inicial", () => {
                const alquiler = new Alquiler("a2", reserva, vehiculo, "cliente-1", rango, 2000);
                expect(() => alquiler.validarFinalizacion(1999)).toThrowError("El kilometraje final no puede ser menor al inicial.");
            });

            test("validar: kmFinal == inicial pasa", () => {
                const alquiler = new Alquiler("a3", reserva, vehiculo, "cliente-1", rango, 1500);
                expect(() => alquiler.validarFinalizacion(1500)).not.toThrow();
            });

            test("validarFinalizacion: no cambia estado ni kmFinal", () => {
                const alquiler = new Alquiler("a5", reserva, vehiculo, "cliente-1", rango, 1100);
                // llamada válida (no arroja)
                alquiler.validarFinalizacion(1200);
                expect(alquiler.getKilometrajeFinal()).toBeUndefined();
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.activo);
            });
        });

    });

});
