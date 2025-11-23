import CalculadorOcupacion from "../src/Estadistica/calculadorOcupacion";
import Vehiculo from "../src/Vehiculo/vehiculo";
import { CategoriaVehiculo, EstadoVehiculo } from "../src/Extras/enums";
import EnAlquilerState from "../src/Vehiculo/enAlquilerState";
import DisponibleState from "../src/Vehiculo/disponibleState";
import EnMantenimientoState from "../src/Vehiculo/enMantenimientoState";

describe("CalculadorOcupacion", () => {
  const tarifaMock: any = { calcularCosto: jest.fn() };

  function crearVehiculo(matricula: string, estado: EstadoVehiculo): Vehiculo {
    const vehiculo = new Vehiculo(matricula, CategoriaVehiculo.compacto, tarifaMock, 1000);
    
    switch (estado) {
      case EstadoVehiculo.alquiler:
        vehiculo.cambiarEstado(new EnAlquilerState());
        break;
      case EstadoVehiculo.disponible:
        vehiculo.cambiarEstado(new DisponibleState());
        break;
      case EstadoVehiculo.mantenimiento:
        vehiculo.cambiarEstado(new EnMantenimientoState());
        break;
    }
    
    return vehiculo;
  }

  test("calcular con lista vacia retorna 0%", () => {
    const calculador = new CalculadorOcupacion();
    calculador.calcular([]);

    const resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(0);
    expect(resultado.enAlquiler).toBe(0);
    expect(resultado.total).toBe(0);
  });

  test("calcular con todos los vehiculos disponibles retorna 0%", () => {
    const calculador = new CalculadorOcupacion();
    const vehiculos = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.disponible),
      crearVehiculo("BB-222-BB", EstadoVehiculo.disponible),
      crearVehiculo("CC-333-CC", EstadoVehiculo.disponible),
    ];

    calculador.calcular(vehiculos);

    const resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(0);
    expect(resultado.enAlquiler).toBe(0);
    expect(resultado.total).toBe(3);
  });

  test("calcular con todos los vehiculos en alquiler retorna 100%", () => {
    const calculador = new CalculadorOcupacion();
    const vehiculos = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.alquiler),
      crearVehiculo("BB-222-BB", EstadoVehiculo.alquiler),
      crearVehiculo("CC-333-CC", EstadoVehiculo.alquiler),
    ];

    calculador.calcular(vehiculos);

    const resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(100);
    expect(resultado.enAlquiler).toBe(3);
    expect(resultado.total).toBe(3);
  });

  test("calcular con mezcla de estados calcula porcentaje correcto", () => {
    const calculador = new CalculadorOcupacion();
    const vehiculos = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.alquiler),
      crearVehiculo("BB-222-BB", EstadoVehiculo.disponible),
      crearVehiculo("CC-333-CC", EstadoVehiculo.alquiler),
      crearVehiculo("DD-444-DD", EstadoVehiculo.mantenimiento),
    ];

    calculador.calcular(vehiculos);

    const resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(50); 
    expect(resultado.enAlquiler).toBe(2);
    expect(resultado.total).toBe(4);
  });

  test("calcular con 1 de 3 vehiculos en alquiler retorna 33.33%", () => {
    const calculador = new CalculadorOcupacion();
    const vehiculos = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.alquiler),
      crearVehiculo("BB-222-BB", EstadoVehiculo.disponible),
      crearVehiculo("CC-333-CC", EstadoVehiculo.mantenimiento),
    ];

    calculador.calcular(vehiculos);

    const resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBeCloseTo(33.33, 1);
    expect(resultado.enAlquiler).toBe(1);
    expect(resultado.total).toBe(3);
  });

  test("calcular multiples veces actualiza correctamente el estado interno", () => {
    const calculador = new CalculadorOcupacion();
    
    const vehiculos1 = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.alquiler),
      crearVehiculo("BB-222-BB", EstadoVehiculo.alquiler),
      crearVehiculo("CC-333-CC", EstadoVehiculo.disponible),
      crearVehiculo("DD-444-DD", EstadoVehiculo.disponible),
    ];
    calculador.calcular(vehiculos1);
    
    let resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(50);
    expect(resultado.enAlquiler).toBe(2);
    expect(resultado.total).toBe(4);

    const vehiculos2 = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.alquiler),
      crearVehiculo("BB-222-BB", EstadoVehiculo.disponible),
    ];
    calculador.calcular(vehiculos2);
    
    resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(50);
    expect(resultado.enAlquiler).toBe(1);
    expect(resultado.total).toBe(2);
  });

  test("vehiculos en mantenimiento no cuentan como alquilados", () => {
    const calculador = new CalculadorOcupacion();
    const vehiculos = [
      crearVehiculo("AA-111-AA", EstadoVehiculo.mantenimiento),
      crearVehiculo("BB-222-BB", EstadoVehiculo.mantenimiento),
    ];

    calculador.calcular(vehiculos);

    const resultado = calculador.obtenerOcupacion();
    expect(resultado.porcentaje).toBe(0);
    expect(resultado.enAlquiler).toBe(0);
    expect(resultado.total).toBe(2);
  });
});
