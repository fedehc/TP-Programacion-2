import CriterioPorMeses from "../src/Mantenimiento/criterioPorMeses";
import FichaMantenimiento from "../src/Mantenimiento/fichaMantenimiento";

describe("Evaluación de mantenimiento por tiempo transcurrido", () => {
  let ficha: FichaMantenimiento;

  beforeEach(() => {
    ficha = new FichaMantenimiento();
  });

  describe("Cuando el vehículo no tiene historial de mantenimiento", () => {
    test("no debe requerir servicio sin fecha de referencia", () => {
      const criterio = new CriterioPorMeses(6);
      const resultado = criterio.cumple(new Date("2024-12-15"), 10000, ficha);

      expect(resultado).toBe(false);
    });

    test("no debe aplicar aunque haya pasado mucho tiempo", () => {
      const criterio = new CriterioPorMeses(3);
      const resultado = criterio.cumple(new Date("2025-12-31"), 50000, ficha);

      expect(resultado).toBe(false);
    });
  });

  describe("Cuando el vehículo tiene un mantenimiento previo", () => {
    beforeEach(() => {
      ficha.registrarMantenimiento(new Date("2024-01-15"), 10000, 150);
    });

    test("debe requerir servicio al cumplir exactamente el plazo", () => {
      const criterio = new CriterioPorMeses(6);
      const fechaEvaluacion = new Date("2024-07-15");

      expect(criterio.cumple(fechaEvaluacion, 12000, ficha)).toBe(true);
    });

    test("debe requerir servicio al superar el plazo", () => {
      const criterio = new CriterioPorMeses(6);
      const fechaEvaluacion = new Date("2024-09-20");

      expect(criterio.cumple(fechaEvaluacion, 15000, ficha)).toBe(true);
    });

    test("no debe requerir servicio si falta un mes", () => {
      const criterio = new CriterioPorMeses(6);
      const fechaEvaluacion = new Date("2024-06-15");

      expect(criterio.cumple(fechaEvaluacion, 12000, ficha)).toBe(false);
    });

    test("no debe requerir servicio recién después del mantenimiento", () => {
      const criterio = new CriterioPorMeses(12);
      const fechaEvaluacion = new Date("2024-02-01");

      expect(criterio.cumple(fechaEvaluacion, 10500, ficha)).toBe(false);
    });
  });

  describe("Con diferentes periodos de mantenimiento", () => {
    beforeEach(() => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 5000, 100);
    });

    test("debe funcionar con periodo corto de mantenimiento frecuente", () => {
      const criterio = new CriterioPorMeses(1);
      
      expect(criterio.cumple(new Date("2024-01-31"), 5100, ficha)).toBe(true); // Ya es 1 mes
      expect(criterio.cumple(new Date("2024-02-01"), 5200, ficha)).toBe(true);
      expect(criterio.cumple(new Date("2024-03-15"), 5500, ficha)).toBe(true);
    });

    test("debe funcionar con periodo semestral estándar", () => {
      const criterio = new CriterioPorMeses(6);
      
      expect(criterio.cumple(new Date("2024-06-01"), 7000, ficha)).toBe(false);
      expect(criterio.cumple(new Date("2024-07-01"), 7500, ficha)).toBe(true);
      expect(criterio.cumple(new Date("2024-12-31"), 10000, ficha)).toBe(true);
    });

    test("debe funcionar con periodo anual", () => {
      const criterio = new CriterioPorMeses(12);
      
      expect(criterio.cumple(new Date("2024-11-15"), 15000, ficha)).toBe(false);
      expect(criterio.cumple(new Date("2024-12-31"), 16000, ficha)).toBe(true); // Ya son 12 meses
      expect(criterio.cumple(new Date("2025-01-01"), 17000, ficha)).toBe(true);
    });
  });

  describe("Cálculo de diferencia de meses", () => {
    beforeEach(() => {
      ficha.registrarMantenimiento(new Date("2024-03-15"), 8000, 120);
    });

    test("debe calcular correctamente dentro del mismo año", () => {
      const criterio = new CriterioPorMeses(4);

      expect(criterio.cumple(new Date("2024-06-15"), 9000, ficha)).toBe(false);
      expect(criterio.cumple(new Date("2024-07-15"), 9500, ficha)).toBe(true);
    });

    test("debe calcular correctamente entre años diferentes", () => {
      const criterio = new CriterioPorMeses(10);

      expect(criterio.cumple(new Date("2024-12-31"), 12000, ficha)).toBe(false);
      expect(criterio.cumple(new Date("2025-01-15"), 12500, ficha)).toBe(true);
    });

    test("debe considerar solo meses completos transcurridos", () => {
      const criterio = new CriterioPorMeses(3);

      // Mismo día, 3 meses después
      expect(criterio.cumple(new Date("2024-06-15"), 9000, ficha)).toBe(true);
      
      // Un día antes también cumple 3 meses  
      expect(criterio.cumple(new Date("2024-06-14"), 8900, ficha)).toBe(true);
    });
  });

  describe("Después de múltiples mantenimientos", () => {
    test("debe considerar solo la fecha del último servicio", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 5000, 100);
      ficha.registrarMantenimiento(new Date("2024-06-01"), 10000, 150);

      const criterio = new CriterioPorMeses(3);
      
      // Desde el último (junio) ya pasaron 3 meses (junio-julio-agosto)
      expect(criterio.cumple(new Date("2024-08-31"), 12000, ficha)).toBe(true);
      
      // Ahora sí han pasado 3 meses desde junio
      expect(criterio.cumple(new Date("2024-09-01"), 13000, ficha)).toBe(true);
    });

    test("debe resetear correctamente el cálculo tras cada servicio", () => {
      const criterio = new CriterioPorMeses(6);

      ficha.registrarMantenimiento(new Date("2024-01-15"), 5000, 100);
      expect(criterio.cumple(new Date("2024-07-15"), 8000, ficha)).toBe(true);

      // Después de hacer el mantenimiento
      ficha.registrarMantenimiento(new Date("2024-07-15"), 8000, 120);
      expect(criterio.cumple(new Date("2024-10-15"), 10000, ficha)).toBe(false);
      expect(criterio.cumple(new Date("2025-01-15"), 12000, ficha)).toBe(true);
    });
  });

  describe("El criterio debe ser independiente del kilometraje", () => {
    test("debe depender solo del tiempo transcurrido", () => {
      const criterio = new CriterioPorMeses(6);
      ficha.registrarMantenimiento(new Date("2024-01-01"), 10000, 150);

      // Misma fecha, diferentes kilometrajes
      const fechaEval = new Date("2024-07-01");
      expect(criterio.cumple(fechaEval, 10100, ficha)).toBe(true);
      expect(criterio.cumple(fechaEval, 20000, ficha)).toBe(true);
      expect(criterio.cumple(fechaEval, 10000, ficha)).toBe(true);
    });

    test("no debe importar el uso del vehículo", () => {
      const criterio = new CriterioPorMeses(3);
      ficha.registrarMantenimiento(new Date("2024-06-01"), 5000, 100);

      // Vehículo poco usado
      expect(criterio.cumple(new Date("2024-09-01"), 5100, ficha)).toBe(true);
      
      // Vehículo muy usado
      expect(criterio.cumple(new Date("2024-09-01"), 25000, ficha)).toBe(true);
    });
  });

  describe("Casos límite de fechas", () => {
    test("debe manejar correctamente el cambio de año", () => {
      const criterio = new CriterioPorMeses(2);
      ficha.registrarMantenimiento(new Date("2024-11-15"), 8000, 120);

      expect(criterio.cumple(new Date("2024-12-31"), 8500, ficha)).toBe(false);
      expect(criterio.cumple(new Date("2025-01-15"), 9000, ficha)).toBe(true);
    });

    test("debe calcular correctamente periodos largos", () => {
      const criterio = new CriterioPorMeses(24);
      ficha.registrarMantenimiento(new Date("2023-01-01"), 5000, 200);

      expect(criterio.cumple(new Date("2024-12-31"), 15000, ficha)).toBe(true); // Ya son 24 meses
      expect(criterio.cumple(new Date("2025-01-01"), 16000, ficha)).toBe(true);
    });

    test("debe funcionar con el último día del mes", () => {
      const criterio = new CriterioPorMeses(3);
      ficha.registrarMantenimiento(new Date("2024-01-31"), 7000, 100);

      expect(criterio.cumple(new Date("2024-04-30"), 8000, ficha)).toBe(true); // Ya son 3 meses
      expect(criterio.cumple(new Date("2024-05-01"), 8100, ficha)).toBe(true);
    });

    test("debe manejar meses con diferente cantidad de días", () => {
      const criterio = new CriterioPorMeses(1);
      
      // Febrero a marzo
      ficha.registrarMantenimiento(new Date("2024-02-15"), 6000, 90);
      expect(criterio.cumple(new Date("2024-03-15"), 6500, ficha)).toBe(true);
    });
  });
});
