import EvaluadorMantenimientoPorCriterios from "../src/Mantenimiento/evaluadorMantenimiento";
import CriterioPorKilometraje from "../src/Mantenimiento/criterioPorKM";
import CriterioPorAlquileres from "../src/Mantenimiento/criterioPorAlquileres";
import CriterioPorMeses from "../src/Mantenimiento/criterioPorMeses";
import FichaMantenimiento from "../src/Mantenimiento/fichaMantenimiento";
import ICriterioMantenimiento from "../src/Mantenimiento/ICriterioMantenimiento";

describe("Sistema de evaluación de mantenimiento por criterios", () => {
  let ficha: FichaMantenimiento;

  beforeEach(() => {
    ficha = new FichaMantenimiento();
  });

  describe("Con un solo criterio activo", () => {
    test("debe requerir mantenimiento cuando se cumple el criterio de kilometraje", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 10000, 150);

      const criterioKm = new CriterioPorKilometraje(5000);
      const evaluador = new EvaluadorMantenimientoPorCriterios([criterioKm]);

      expect(evaluador.requiere(new Date(), 14999, ficha)).toBe(false);
      expect(evaluador.requiere(new Date(), 15000, ficha)).toBe(true);
    });

    test("debe requerir mantenimiento cuando se cumple el criterio de alquileres", () => {
      const criterioAlq = new CriterioPorAlquileres(5);
      const evaluador = new EvaluadorMantenimientoPorCriterios([criterioAlq]);

      for (let i = 0; i < 4; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(evaluador.requiere(new Date(), 2000, ficha)).toBe(false);

      ficha.registrarAlquilerCompletado();
      expect(evaluador.requiere(new Date(), 2500, ficha)).toBe(true);
    });

    test("debe requerir mantenimiento cuando se cumple el criterio de tiempo", () => {
      ficha.registrarMantenimiento(new Date("2024-01-15"), 8000, 120);

      const criterioMeses = new CriterioPorMeses(6);
      const evaluador = new EvaluadorMantenimientoPorCriterios([criterioMeses]);

      expect(evaluador.requiere(new Date("2024-07-14"), 10000, ficha)).toBe(true); // Ya son 6 meses
      expect(evaluador.requiere(new Date("2024-07-15"), 10000, ficha)).toBe(true);
    });
  });

  describe("Con múltiples criterios combinados", () => {
    test("debe requerir mantenimiento si cualquiera de los criterios se cumple", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 5000, 100);

      const criterioKm = new CriterioPorKilometraje(10000);
      const criterioMeses = new CriterioPorMeses(6);
      const criterioAlq = new CriterioPorAlquileres(20);

      const evaluador = new EvaluadorMantenimientoPorCriterios([
        criterioKm,
        criterioMeses,
        criterioAlq
      ]);

      // Solo se cumple el criterio de tiempo
      expect(evaluador.requiere(new Date("2024-07-01"), 7000, ficha)).toBe(true);
    });

    test("debe requerir si el criterio de kilometraje se cumple primero", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 10000, 150);

      const criterioKm = new CriterioPorKilometraje(5000);
      const criterioMeses = new CriterioPorMeses(12);
      const criterioAlq = new CriterioPorAlquileres(50);

      const evaluador = new EvaluadorMantenimientoPorCriterios([
        criterioKm,
        criterioMeses,
        criterioAlq
      ]);

      // A los 2 meses, pero ya con suficientes kilómetros
      expect(evaluador.requiere(new Date("2024-03-01"), 15000, ficha)).toBe(true);
    });

    test("debe requerir si el criterio de alquileres se cumple primero", () => {
      ficha.registrarMantenimiento(new Date("2024-06-01"), 15000, 180);

      const criterioKm = new CriterioPorKilometraje(10000);
      const criterioMeses = new CriterioPorMeses(12);
      const criterioAlq = new CriterioPorAlquileres(10);

      const evaluador = new EvaluadorMantenimientoPorCriterios([
        criterioKm,
        criterioMeses,
        criterioAlq
      ]);

      // Solo 1 mes después y pocos km, pero muchos alquileres
      for (let i = 0; i < 10; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(evaluador.requiere(new Date("2024-07-01"), 16000, ficha)).toBe(true);
    });

    test("no debe requerir si ningún criterio se cumple", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 10000, 150);

      const criterioKm = new CriterioPorKilometraje(10000);
      const criterioMeses = new CriterioPorMeses(12);
      const criterioAlq = new CriterioPorAlquileres(30);

      const evaluador = new EvaluadorMantenimientoPorCriterios([
        criterioKm,
        criterioMeses,
        criterioAlq
      ]);

      // Solo 3 meses, 3000 km y 5 alquileres
      for (let i = 0; i < 5; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(evaluador.requiere(new Date("2024-04-01"), 13000, ficha)).toBe(false);
    });
  });

  describe("Estrategias de mantenimiento para diferentes tipos de flota", () => {
    test("debe funcionar para vehículos de alta rotación (criterio estricto)", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 8000, 100);

      // Mantenimiento cada 3000 km o 8 alquileres o 2 meses
      const evaluador = new EvaluadorMantenimientoPorCriterios([
        new CriterioPorKilometraje(3000),
        new CriterioPorAlquileres(8),
        new CriterioPorMeses(2)
      ]);

      // Se alcanza por alquileres
      for (let i = 0; i < 8; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(evaluador.requiere(new Date("2024-01-15"), 9000, ficha)).toBe(true);
    });

    test("debe funcionar para vehículos de uso moderado", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 20000, 200);

      // Mantenimiento cada 10000 km o 15 alquileres o 6 meses
      const evaluador = new EvaluadorMantenimientoPorCriterios([
        new CriterioPorKilometraje(10000),
        new CriterioPorAlquileres(15),
        new CriterioPorMeses(6)
      ]);

      // Se alcanza por tiempo
      for (let i = 0; i < 8; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(evaluador.requiere(new Date("2024-03-01"), 25000, ficha)).toBe(false);
      expect(evaluador.requiere(new Date("2024-07-01"), 27000, ficha)).toBe(true);
    });

    test("debe funcionar para vehículos premium con poco uso", () => {
      ficha.registrarMantenimiento(new Date("2024-01-01"), 5000, 300);

      // Mantenimiento cada 5000 km o 5 alquileres o 3 meses (mantenimiento frecuente)
      const evaluador = new EvaluadorMantenimientoPorCriterios([
        new CriterioPorKilometraje(5000),
        new CriterioPorAlquileres(5),
        new CriterioPorMeses(3)
      ]);

      // Poco uso pero cumple por tiempo
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      
      expect(evaluador.requiere(new Date("2024-04-01"), 6000, ficha)).toBe(true);
    });
  });

  describe("Sin criterios configurados", () => {
    test("nunca debe requerir mantenimiento con lista vacía", () => {
      const evaluador = new EvaluadorMantenimientoPorCriterios([]);

      ficha.registrarMantenimiento(new Date("2020-01-01"), 0, 100);
      
      for (let i = 0; i < 100; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(evaluador.requiere(new Date("2025-12-31"), 999999, ficha)).toBe(false);
    });
  });

  describe("Después del ciclo completo de mantenimiento", () => {
    test("debe resetear la evaluación tras realizar el servicio", () => {
      const evaluador = new EvaluadorMantenimientoPorCriterios([
        new CriterioPorKilometraje(5000),
        new CriterioPorAlquileres(10)
      ]);

      // Primer ciclo
      ficha.registrarMantenimiento(new Date("2024-01-01"), 10000, 150);
      for (let i = 0; i < 10; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(evaluador.requiere(new Date("2024-03-01"), 12000, ficha)).toBe(true);

      // Se realiza mantenimiento
      ficha.registrarMantenimiento(new Date("2024-03-01"), 12000, 180);
      expect(evaluador.requiere(new Date("2024-03-02"), 12100, ficha)).toBe(false);

      // Segundo ciclo
      for (let i = 0; i < 10; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(evaluador.requiere(new Date("2024-05-01"), 14000, ficha)).toBe(true);
    });
  });

  describe("Con criterios personalizados", () => {
    test("debe funcionar con cualquier implementación de ICriterioMantenimiento", () => {
      // Criterio personalizado: requiere mantenimiento si tiene más de 5000 km
      class CriterioPorKmMinimo implements ICriterioMantenimiento {
        cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
          return kmActual > 5000;
        }
      }

      const evaluador = new EvaluadorMantenimientoPorCriterios([
        new CriterioPorKmMinimo()
      ]);

      // Con 5001 km debe requerir mantenimiento
      expect(evaluador.requiere(new Date(), 5001, ficha)).toBe(true);
      
      // Con 5000 km o menos no debe requerir
      expect(evaluador.requiere(new Date(), 5000, ficha)).toBe(false);
      expect(evaluador.requiere(new Date(), 3000, ficha)).toBe(false);
    });

    test("debe permitir combinaciones complejas de criterios", () => {
      class CriterioKilometrajeImpar implements ICriterioMantenimiento {
        cumple(hoy: Date, kmActual: number, ficha: FichaMantenimiento): boolean {
          return kmActual % 2 === 1;
        }
      }

      const evaluador = new EvaluadorMantenimientoPorCriterios([
        new CriterioPorAlquileres(5),
        new CriterioKilometrajeImpar()
      ]);

      // Cumple por kilometraje impar
      expect(evaluador.requiere(new Date(), 12345, ficha)).toBe(true);
      
      // Cumple por alquileres
      for (let i = 0; i < 5; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(evaluador.requiere(new Date(), 12000, ficha)).toBe(true);

      // Resetea después del mantenimiento
      ficha.registrarMantenimiento(new Date(), 12000, 100);
      expect(evaluador.requiere(new Date(), 13001, ficha)).toBe(true); // Impar
      expect(evaluador.requiere(new Date(), 14000, ficha)).toBe(false); // Par y sin alquileres
    });
  });
});
