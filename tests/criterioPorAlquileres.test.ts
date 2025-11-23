import CriterioPorAlquileres from "../src/Mantenimiento/criterioPorAlquileres";
import FichaMantenimiento from "../src/Mantenimiento/fichaMantenimiento";

describe("Evaluación de mantenimiento por cantidad de alquileres", () => {
  let ficha: FichaMantenimiento;

  beforeEach(() => {
    ficha = new FichaMantenimiento();
  });

  describe("Con un vehículo sin alquileres", () => {
    test("debe requerir servicio si el umbral es cero", () => {
      const criterio = new CriterioPorAlquileres(0);
      const resultado = criterio.cumple(new Date(), 5000, ficha);

      expect(resultado).toBe(true);
    });

    test("no debe requerir servicio con umbral bajo", () => {
      const criterio = new CriterioPorAlquileres(1);
      const resultado = criterio.cumple(new Date(), 5000, ficha);

      expect(resultado).toBe(false);
    });
  });

  describe("Al acumular alquileres sin mantenimiento previo", () => {
    test("debe requerir servicio al alcanzar el umbral", () => {
      const criterio = new CriterioPorAlquileres(5);

      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 1000, ficha)).toBe(false);

      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 1000, ficha)).toBe(true);
    });

    test("debe requerir servicio al superar el umbral", () => {
      const criterio = new CriterioPorAlquileres(3);

      for (let i = 0; i < 5; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(criterio.cumple(new Date(), 2000, ficha)).toBe(true);
    });

    test("no debe requerir servicio si falta un alquiler", () => {
      const criterio = new CriterioPorAlquileres(10);

      for (let i = 0; i < 9; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(criterio.cumple(new Date(), 5000, ficha)).toBe(false);
    });
  });

  describe("Después de realizar mantenimiento", () => {
    test("debe reiniciar el conteo de alquileres", () => {
      const criterio = new CriterioPorAlquileres(3);

      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 1000, ficha)).toBe(true);

      ficha.registrarMantenimiento(new Date(), 1000, 100);
      expect(criterio.cumple(new Date(), 1000, ficha)).toBe(false);
    });

    test("debe volver a requerir al acumular nuevos alquileres", () => {
      const criterio = new CriterioPorAlquileres(4);

      for (let i = 0; i < 4; i++) {
        ficha.registrarAlquilerCompletado();
      }

      ficha.registrarMantenimiento(new Date(), 2000, 150);
      expect(criterio.cumple(new Date(), 2000, ficha)).toBe(false);

      for (let i = 0; i < 4; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(criterio.cumple(new Date(), 4000, ficha)).toBe(true);
    });
  });

  describe("Con diferentes umbrales de alquileres", () => {
    test("debe funcionar con umbral muy bajo para mantenimiento frecuente", () => {
      const criterio = new CriterioPorAlquileres(1);

      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 500, ficha)).toBe(true);
    });

    test("debe funcionar con umbral moderado", () => {
      const criterio = new CriterioPorAlquileres(10);

      for (let i = 0; i < 9; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(criterio.cumple(new Date(), 3000, ficha)).toBe(false);

      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 3000, ficha)).toBe(true);
    });

    test("debe funcionar con umbral alto para flotas intensivas", () => {
      const criterio = new CriterioPorAlquileres(50);

      for (let i = 0; i < 49; i++) {
        ficha.registrarAlquilerCompletado();
      }
      expect(criterio.cumple(new Date(), 20000, ficha)).toBe(false);

      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 20000, ficha)).toBe(true);
    });
  });

  describe("El criterio debe ser independiente del kilometraje y fecha", () => {
    test("debe depender solo del contador de alquileres", () => {
      const criterio = new CriterioPorAlquileres(5);

      for (let i = 0; i < 5; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(criterio.cumple(new Date("2024-01-01"), 1000, ficha)).toBe(true);
      expect(criterio.cumple(new Date("2024-12-31"), 50000, ficha)).toBe(true);
      expect(criterio.cumple(new Date("2024-06-15"), 25000, ficha)).toBe(true);
    });

    test("no debe importar los kilómetros registrados", () => {
      const criterio = new CriterioPorAlquileres(3);

      ficha.registrarMantenimiento(new Date(), 10000, 100);
      
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();

      expect(criterio.cumple(new Date(), 10050, ficha)).toBe(true);
      expect(criterio.cumple(new Date(), 50000, ficha)).toBe(true);
    });
  });

  describe("Casos especiales del ciclo de uso", () => {
    test("debe manejar múltiples ciclos de mantenimiento", () => {
      const criterio = new CriterioPorAlquileres(2);

      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 1000, ficha)).toBe(true);

      ficha.registrarMantenimiento(new Date(), 1000, 80);

     
      ficha.registrarAlquilerCompletado();
      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 2000, ficha)).toBe(true);

      ficha.registrarMantenimiento(new Date(), 2000, 85);


      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 2500, ficha)).toBe(false);
      ficha.registrarAlquilerCompletado();
      expect(criterio.cumple(new Date(), 3000, ficha)).toBe(true);
    });

    test("debe funcionar incluso con muchos alquileres acumulados", () => {
      const criterio = new CriterioPorAlquileres(20);

      for (let i = 0; i < 100; i++) {
        ficha.registrarAlquilerCompletado();
      }

      expect(criterio.cumple(new Date(), 50000, ficha)).toBe(true);
      expect(ficha.getAlquileresDesdeUltimo()).toBe(100);
    });
  });
});
