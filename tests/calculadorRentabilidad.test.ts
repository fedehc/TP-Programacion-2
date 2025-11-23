import CalculadorRentabilidad from "../src/Estadistica/calculadorRentabilidad";
import Alquiler from "../src/Alquiler/alquiler";
import Vehiculo from "../src/Vehiculo/vehiculo";
import Reserva from "../src/Reserva/reserva";
import RangoDeFechas from "../src/Extras/rangoDeFechas";
import SelectorTemporada from "../src/Temporada/temporadaSelector";
import { CategoriaVehiculo, EstadoReserva } from "../src/Extras/enums";
import { PeriodoRequeridoException, EstadisticasInsuficientesException } from "../src/Excepciones/exceptions";


describe("CalculadorRentabilidad", () => {
  const selector = new SelectorTemporada();
  const tarifaMock: any = { calcularCosto: jest.fn().mockReturnValue(100) };

  function crearVehiculo(matricula: string): Vehiculo {
    return new Vehiculo(matricula, CategoriaVehiculo.compacto, tarifaMock, 1000);
  }

  function crearAlquiler(
    id: string,
    vehiculo: Vehiculo,
    inicio: Date,
    fin: Date,
    kmInicial: number,
    kmFinal: number,
    costoTotal: number
  ): Alquiler {
    const rango = new RangoDeFechas(inicio, fin);
    const reserva = new Reserva(id + "-R", "CLI-1", rango, EstadoReserva.confirmada, vehiculo);
    const alquiler = new Alquiler(id, reserva, vehiculo, "CLI-1", rango, kmInicial, selector);
    
    tarifaMock.calcularCosto.mockReturnValueOnce(costoTotal);
    alquiler.finalizar(kmFinal);
    
    return alquiler;
  }

  test("calcular sin periodo lanza PeriodoRequeridoException", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculos = [crearVehiculo("AA-111-AA")];
    
    expect(() => {
      calculador.calcular([], vehiculos);
    }).toThrow(PeriodoRequeridoException);
  });

  test("calcular sin vehiculos lanza EstadisticasInsuficientesException", () => {
    const calculador = new CalculadorRentabilidad();
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    expect(() => {
      calculador.calcular([], [], periodo);
    }).toThrow(EstadisticasInsuficientesException);
  });

  test("calcular con alquileres sin costos de mantenimiento", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    const vehiculo2 = crearVehiculo("BB-222-BB");
    
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-01-05"), new Date("2024-01-10"), 1000, 1200, 1000);
    const alq2 = crearAlquiler("A2", vehiculo1, new Date("2024-01-15"), new Date("2024-01-20"), 1200, 1400, 1500);
    
    const alq3 = crearAlquiler("A3", vehiculo2, new Date("2024-01-10"), new Date("2024-01-12"), 2000, 2100, 800);
    
    calculador.calcular([alq1, alq2, alq3], [vehiculo1, vehiculo2], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    const menosRentable = calculador.obtenerMenosRentable();
    
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBeGreaterThan(menosRentable.monto);
    expect(menosRentable.matricula).toBe("BB-222-BB");
    expect(menosRentable.monto).toBeGreaterThan(0);
  });

  test("calcular con costos de mantenimiento resta de ingresos", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    const vehiculo2 = crearVehiculo("BB-222-BB");
    
    vehiculo1.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-05"), 1000, 500);
    vehiculo2.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-10"), 2000, 200);
    vehiculo2.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-20"), 2100, 300);
    
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-01-05"), new Date("2024-01-10"), 1000, 1200, 1000);
    const alq2 = crearAlquiler("A2", vehiculo1, new Date("2024-01-15"), new Date("2024-01-20"), 1200, 1400, 1000);
    
    const alq3 = crearAlquiler("A3", vehiculo2, new Date("2024-01-10"), new Date("2024-01-12"), 2000, 2100, 1200);
    
    calculador.calcular([alq1, alq2, alq3], [vehiculo1, vehiculo2], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    const menosRentable = calculador.obtenerMenosRentable();
    
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBeGreaterThan(menosRentable.monto);
    expect(menosRentable.matricula).toBe("BB-222-BB");
    expect(menosRentable.monto).toBeGreaterThan(0);
  });

  test("calcular con vehiculo sin alquileres tiene rentabilidad negativa por costos", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    const vehiculo2 = crearVehiculo("BB-222-BB");
    
    vehiculo2.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-10"), 2000, 800);
    
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-01-05"), new Date("2024-01-10"), 1000, 1200, 1000);
    
    calculador.calcular([alq1], [vehiculo1, vehiculo2], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    const menosRentable = calculador.obtenerMenosRentable();
    
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBeGreaterThan(0);
    expect(menosRentable.matricula).toBe("BB-222-BB");
    expect(menosRentable.monto).toBe(-800);
  });

  test("calcular filtra alquileres fuera del periodo", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    const alqDentro = crearAlquiler("A1", vehiculo1, new Date("2024-01-05"), new Date("2024-01-10"), 1000, 1200, 1000);
    

    const alqFuera = crearAlquiler("A2", vehiculo1, new Date("2024-02-05"), new Date("2024-02-10"), 1200, 1400, 2000);
    
    calculador.calcular([alqDentro, alqFuera], [vehiculo1], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBeGreaterThan(0); 
  });

  test("calcular con alquiler que se superpone parcialmente con periodo", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    
    const periodo = new RangoDeFechas(new Date("2024-01-15"), new Date("2024-01-31"));
   
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-01-10"), new Date("2024-01-20"), 1000, 1200, 1500);
    
    calculador.calcular([alq1], [vehiculo1], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBeGreaterThan(0); 
  });

  test("calcular con multiples vehiculos identifica correctamente mejor y peor", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    const vehiculo2 = crearVehiculo("BB-222-BB");
    const vehiculo3 = crearVehiculo("CC-333-CC");
    
    vehiculo1.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-05"), 1000, 100);
    vehiculo2.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-05"), 2000, 50);
    vehiculo3.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-05"), 3000, 150);
    
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-01-05"), new Date("2024-01-10"), 1000, 1200, 800);
    
    const alq2 = crearAlquiler("A2", vehiculo2, new Date("2024-01-10"), new Date("2024-01-20"), 2000, 2200, 2000);
    
    const alq3 = crearAlquiler("A3", vehiculo3, new Date("2024-01-15"), new Date("2024-01-18"), 3000, 3100, 500);
    
    calculador.calcular([alq1, alq2, alq3], [vehiculo1, vehiculo2, vehiculo3], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    const menosRentable = calculador.obtenerMenosRentable();
    
    expect(masRentable.matricula).toBe("BB-222-BB");
    expect(masRentable.monto).toBeGreaterThan(menosRentable.monto);
    expect(menosRentable.matricula).toBe("CC-333-CC");
    expect(menosRentable.monto).toBeGreaterThan(0);
  });

  test("calcular multiples veces actualiza correctamente los resultados", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    const vehiculo2 = crearVehiculo("BB-222-BB");
    
    const periodo1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-01-05"), new Date("2024-01-10"), 1000, 1200, 2000);
    const alq2 = crearAlquiler("A2", vehiculo2, new Date("2024-01-10"), new Date("2024-01-15"), 2000, 2200, 500);
    
    calculador.calcular([alq1, alq2], [vehiculo1, vehiculo2], periodo1);
    
    let masRentable = calculador.obtenerMasRentable();
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBeGreaterThan(0);
    
    const periodo2 = new RangoDeFechas(new Date("2024-02-01"), new Date("2024-02-28"));
    const alq3 = crearAlquiler("A3", vehiculo2, new Date("2024-02-05"), new Date("2024-02-10"), 2200, 2400, 3000);
    
    calculador.calcular([alq3], [vehiculo1, vehiculo2], periodo2);
    
    masRentable = calculador.obtenerMasRentable();
    expect(masRentable.matricula).toBe("BB-222-BB");
    expect(masRentable.monto).toBeGreaterThan(0);
  });

  test("calcular sin alquileres en el periodo considera solo costos", () => {
    const calculador = new CalculadorRentabilidad();
    const vehiculo1 = crearVehiculo("AA-111-AA");
    const vehiculo2 = crearVehiculo("BB-222-BB");
    
    vehiculo1.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-10"), 1000, 300);
    vehiculo2.getFichaMantenimiento().registrarMantenimiento(new Date("2024-01-15"), 2000, 500);
    
    const periodo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-31"));
    
    const alq1 = crearAlquiler("A1", vehiculo1, new Date("2024-02-05"), new Date("2024-02-10"), 1000, 1200, 1000);
    
    calculador.calcular([alq1], [vehiculo1, vehiculo2], periodo);
    
    const masRentable = calculador.obtenerMasRentable();
    const menosRentable = calculador.obtenerMenosRentable();
    
    expect(masRentable.matricula).toBe("AA-111-AA");
    expect(masRentable.monto).toBe(-300);
    expect(menosRentable.matricula).toBe("BB-222-BB");
    expect(menosRentable.monto).toBe(-500);
  });
});
