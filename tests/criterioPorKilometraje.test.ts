import CriterioPorKilometraje from "../src/Mantenimiento/criterioPorKM";
import FichaMantenimiento from "../src/Mantenimiento/fichaMantenimiento";

describe("Evaluación de mantenimiento por kilometraje", () => {
  let ficha: FichaMantenimiento;

  beforeEach(() => {
    ficha = new FichaMantenimiento();
  });

  describe("Cuando el vehículo no tiene historial de mantenimiento", () => {
    test("no debe requerir servicio aunque tenga muchos kilómetros", () => {
      const criterio = new CriterioPorKilometraje(5000);
      const resultado = criterio.cumple(new Date(), 10000, ficha);

      expect(resultado).toBe(false);
    });

    test("no debe aplicar el criterio sin kilómetros de referencia", () => {
      const criterio = new CriterioPorKilometraje(10000);
      const resultado = criterio.cumple(new Date(), 50000, ficha);

      expect(resultado).toBe(false);
    });
  });

  describe("Cuando el vehículo tiene un mantenimiento previo", () => {
    beforeEach(() => {
      ficha.registrarMantenimiento(new Date("2024-01-15"), 10000, 150);
    });

    test("debe requerir servicio al alcanzar el umbral exacto", () => {
      const criterio = new CriterioPorKilometraje(5000);
      const resultado = criterio.cumple(new Date(), 15000, ficha);

      expect(resultado).toBe(true);
    });

    test("debe requerir servicio al superar el umbral", () => {
      const criterio = new CriterioPorKilometraje(5000);
      const resultado = criterio.cumple(new Date(), 16000, ficha);

      expect(resultado).toBe(true);
    });

    test("no debe requerir servicio si falta un kilómetro", () => {
      const criterio = new CriterioPorKilometraje(5000);
      const resultado = criterio.cumple(new Date(), 14999, ficha);

      expect(resultado).toBe(false);
    });

    test("no debe requerir servicio recién después del mantenimiento", () => {
      const criterio = new CriterioPorKilometraje(10000);
      const resultado = criterio.cumple(new Date(), 10100, ficha);

      expect(resultado).toBe(false);
    });
  });

  describe("Con diferentes umbrales de kilometraje", () => {
    beforeEach(() => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 5000, 100);
    });

    test("debe funcionar con umbral pequeño de mantenimiento frecuente", () => {
      const criterio = new CriterioPorKilometraje(1000);
      
      expect(criterio.cumple(new Date(), 5999, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 6000, ficha)).toBe(true);
      expect(criterio.cumple(new Date(), 7500, ficha)).toBe(true);
    });

    test("debe funcionar con umbral grande para servicio espaciado", () => {
      const criterio = new CriterioPorKilometraje(20000);
      
      expect(criterio.cumple(new Date(), 20000, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 24999, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 25000, ficha)).toBe(true);
    });

    test("debe aplicarse correctamente con umbral muy alto", () => {
      const criterio = new CriterioPorKilometraje(50000);
      
      expect(criterio.cumple(new Date(), 30000, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 55000, ficha)).toBe(true);
    });
  });

  describe("Después de múltiples mantenimientos", () => {
    test("debe considerar solo el último servicio realizado", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 5000, 100);
      ficha.registrarMantenimiento(new Date("2024-06-15"), 20000, 150);

      const criterio = new CriterioPorKilometraje(10000);
      
    
      expect(criterio.cumple(new Date(), 29000, ficha)).toBe(false);
      
     
      expect(criterio.cumple(new Date(), 30000, ficha)).toBe(true);
    });

    test("debe resetear correctamente el cálculo tras cada servicio", () => {
      const criterio = new CriterioPorKilometraje(5000);

      ficha.registrarMantenimiento(new Date("2024-01-01"), 10000, 100);
      expect(criterio.cumple(new Date(), 15000, ficha)).toBe(true);

      ficha.registrarMantenimiento(new Date("2024-03-01"), 15000, 120);
      expect(criterio.cumple(new Date(), 18000, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 20000, ficha)).toBe(true);
    });
  });

  describe("Casos límite de kilometraje", () => {
    test("debe manejar vehículo nuevo con primer mantenimiento", () => {
      ficha.registrarMantenimiento(new Date(), 0, 100);
      const criterio = new CriterioPorKilometraje(5000);

      expect(criterio.cumple(new Date(), 4999, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 5000, ficha)).toBe(true);
    });

    test("debe funcionar con kilómetros muy bajos", () => {
      ficha.registrarMantenimiento(new Date(), 100, 50);
      const criterio = new CriterioPorKilometraje(50);

      expect(criterio.cumple(new Date(), 149, ficha)).toBe(false);
      expect(criterio.cumple(new Date(), 150, ficha)).toBe(true);
    });

    test("debe manejar incrementos grandes de kilometraje", () => {
      ficha.registrarMantenimiento(new Date(), 10000, 150);
      const criterio = new CriterioPorKilometraje(5000);

      // Gran salto en kilometraje
      expect(criterio.cumple(new Date(), 50000, ficha)).toBe(true);
    });
  });
});
