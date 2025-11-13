import Alquiler from "../src/alquiler";
import Reserva from "../src/reserva";
import Vehiculo from "../src/vehiculo";
import RangoDeFechas from "../src/rangoDeFechas";
import { CategoriaVehiculo, EstadoAlquiler, EstadoVehiculo } from "../src/enums";
import ServicioDePrecios from "../src/precioService";

describe("Alquiler - getters básicos", () => {
    const rango = new RangoDeFechas(
        new Date("2023-01-01T00:00:00"),
        new Date("2023-01-03T00:00:00")
    );
    const reserva = new Reserva("res-1", "cliente-1", rango);
    const tarifaDePrueba = { calcularCosto: jest.fn().mockReturnValue(0) };
    const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000);

    test("getReserva devuelve la misma instancia de Reserva", () => {
        const alquiler = new Alquiler("a-1", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquiler.getReserva()).toBe(reserva);
    });

    test("getVehiculo devuelve la misma instancia de Vehiculo", () => {
        const alquiler = new Alquiler("a-2", reserva, vehiculo, "cliente-2", rango, 1500);
        expect(alquiler.getVehiculo()).toBe(vehiculo);
    });

    test("getClienteId devuelve el cliente pasado en el constructor", () => {
        const alquiler = new Alquiler("a-3", reserva, vehiculo, "cliente-x", rango, 500);
        expect(alquiler.getClienteId()).toBe("cliente-x");
    });

    test("getRango devuelve el RangoDeFechas pasado en el constructor", () => {
        const alquiler = new Alquiler("a-4", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquiler.getRango()).toBe(rango);
    });

    test("getKilometrajeInicial devuelve el valor inicial", () => {
        const alquiler = new Alquiler("a-5", reserva, vehiculo, "cliente-1", rango, 777);
        expect(alquiler.getKilometrajeInicial()).toBe(777);
    });

    test("getKilometrajeFinal es undefined antes de finalizar", () => {
        const alquiler = new Alquiler("a-6", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquiler.getKilometrajeFinal()).toBeUndefined();
    });

    test("getEstado por defecto es 'activo'", () => {
        const alquiler = new Alquiler("a-7", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquiler.getEstado()).toBe(EstadoAlquiler.activo);
    });

    test("getCostoTotal es undefined antes de finalizar", () => {
        const alquiler = new Alquiler("a-8", reserva, vehiculo, "cliente-1", rango, 1000);
        expect(alquiler.getCostoTotal()).toBeUndefined();
    });

    describe("Alquiler.calcularCostoTotal", () => {
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

        test("devuelve lo que retorna ServicioDePrecios.aplicar y llama a las dependencias con los argumentos correctos", () => {
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

        test("lanza error si el alquiler no fue finalizado (kilometrajeFinal undefined)", () => {
            const alquiler = new Alquiler("c2", reserva, vehiculo, "cliente-1", rango, 500);
            expect(() => alquiler.calcularCostoTotal()).toThrowError(
                "El alquiler no fue finalizado todavía."
            );
        });

        describe("Alquiler.finalizar", () => {
            const rango = new RangoDeFechas(new Date("2023-01-01T00:00:00"), new Date("2023-01-03T00:00:00"));
            const reserva = new Reserva("res-1", "cliente-1", rango);
            const tarifaDePrueba: any = { calcularCosto: jest.fn() };
            const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000);

            afterEach(() => {
                jest.restoreAllMocks();
                tarifaDePrueba.calcularCosto.mockReset && tarifaDePrueba.calcularCosto.mockReset();
            });

            test("caso feliz :): asigna kilometrajeFinal, costoTotal (desde calcularCostoTotal) y cambia estado a finalizado", () => {
                const calcularSpy = jest.spyOn(Alquiler.prototype as any, "calcularCostoTotal").mockReturnValue(500);

                const alquiler = new Alquiler("f1", reserva, vehiculo, "cliente-1", rango, 1000);

                alquiler.finalizar(1100);

                expect(alquiler.getKilometrajeFinal()).toBe(1100);
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
                expect(alquiler.getCostoTotal()).toBe(500);
                expect(calcularSpy).toHaveBeenCalledTimes(1);
            });

            test("propaga error de validarFinalizacion cuando el estado no es activo y no modifica el alquiler", () => {
                const alquiler = new Alquiler("f2", reserva, vehiculo, "cliente-1", rango, 1000, undefined, EstadoAlquiler.finalizado);

                expect(() => alquiler.finalizar(1100)).toThrowError("El alquiler no está activo.");
                expect(alquiler.getKilometrajeFinal()).toBeUndefined();
                expect(alquiler.getCostoTotal()).toBeUndefined();
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
            });

            test("propaga error de validarFinalizacion cuando kmFinal es menor que inicial y no modifica el alquiler", () => {
                const alquiler = new Alquiler("f3", reserva, vehiculo, "cliente-1", rango, 2000);

                expect(() => alquiler.finalizar(1999)).toThrowError("El kilometraje final no puede ser menor al inicial.");
                expect(alquiler.getKilometrajeFinal()).toBeUndefined();
                expect(alquiler.getCostoTotal()).toBeUndefined();
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.activo);
            });

            test(" segunda llamada a finalizar falla porque ya está finalizado, manteniendo los valores del primer finalize", () => {
                const calcularSpy = jest.spyOn(Alquiler.prototype as any, "calcularCostoTotal").mockReturnValue(400);
                const alquiler = new Alquiler("f4", reserva, vehiculo, "cliente-1", rango, 1000);

                alquiler.finalizar(1200);
                expect(alquiler.getKilometrajeFinal()).toBe(1200);
                expect(alquiler.getCostoTotal()).toBe(400);
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);

                expect(() => alquiler.finalizar(1300)).toThrowError("El alquiler no está activo.");

                expect(alquiler.getKilometrajeFinal()).toBe(1200);
                expect(alquiler.getCostoTotal()).toBe(400);
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
                expect(calcularSpy).toHaveBeenCalledTimes(1);
            });

            test("caso límite: kmFinal igual a kilometrajeInicial finaliza correctamente", () => {
                const calcularSpy = jest.spyOn(Alquiler.prototype as any, "calcularCostoTotal").mockReturnValue(0);
                const alquiler = new Alquiler("f5", reserva, vehiculo, "cliente-1", rango, 900);

                alquiler.finalizar(900);

                expect(alquiler.getKilometrajeFinal()).toBe(900);
                expect(alquiler.getCostoTotal()).toBe(0);
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.finalizado);
                expect(calcularSpy).toHaveBeenCalledTimes(1);
            });


        });
        describe("Alquiler.validarFinalizacion", () => {
            const rango = new RangoDeFechas(new Date("2023-01-01T00:00:00"), new Date("2023-01-03T00:00:00"));
            const reserva = new Reserva("res-1", "cliente-1", rango);
            const tarifaDePrueba: any = { calcularCosto: jest.fn().mockReturnValue(0) };
            const vehiculo = new Vehiculo("ABC123", CategoriaVehiculo.compacto, EstadoVehiculo.disponible, tarifaDePrueba, 1000);

            test("lanza error si el estado no es activo", () => {
                const alquiler = new Alquiler("a1", reserva, vehiculo, "cliente-1", rango, 1000, undefined, EstadoAlquiler.finalizado);
                expect(() => alquiler.validarFinalizacion(1001)).toThrowError("El alquiler no está activo.");
            });

            test("lanza error si kmFinal es menor que kilometrajeInicial", () => {
                const alquiler = new Alquiler("a2", reserva, vehiculo, "cliente-1", rango, 2000);
                expect(() => alquiler.validarFinalizacion(1999)).toThrowError("El kilometraje final no puede ser menor al inicial.");
            });

            test("no lanza error si kmFinal es igual a kilometrajeInicial", () => {
                const alquiler = new Alquiler("a3", reserva, vehiculo, "cliente-1", rango, 1500);
                expect(() => alquiler.validarFinalizacion(1500)).not.toThrow();
            });

            test("no lanza error si kmFinal es mayor que kilometrajeInicial y estado es activo", () => {
                const alquiler = new Alquiler("a4", reserva, vehiculo, "cliente-1", rango, 1200);
                expect(() => alquiler.validarFinalizacion(1300)).not.toThrow();
            });

            test("validarFinalizacion no modifica estado ni kilometrajeFinal", () => {
                const alquiler = new Alquiler("a5", reserva, vehiculo, "cliente-1", rango, 1100);
                // llamada válida (no arroja)
                alquiler.validarFinalizacion(1200);
                expect(alquiler.getKilometrajeFinal()).toBeUndefined();
                expect(alquiler.getEstado()).toBe(EstadoAlquiler.activo);
            });
        });

    });

});
