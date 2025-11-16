import DisponibilidadService from "../src/Extras/disponibilidadService";
import RangoDeFechas from "../src/Extras/rangoDeFechas";

describe("Disponibilidad y solapamiento - tests", () => {
  
  describe("RangoDeFechas.seSuperponeConOtraFecha - casos", () => {
    
    test("solapamiento parcial -> true", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const rango2 = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      expect(rango1.seSuperponeConOtraFecha(rango2)).toBe(true);
    });

    test("contenido totalmente dentro -> true", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-20"));
      const rango2 = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      expect(rango1.seSuperponeConOtraFecha(rango2)).toBe(true);
    });

    test("rangos iguales -> true", () => {
      const inicio = new Date("2024-01-01");
      const fin = new Date("2024-01-10");
      const rango1 = new RangoDeFechas(inicio, fin);
      const rango2 = new RangoDeFechas(inicio, fin);
      expect(rango1.seSuperponeConOtraFecha(rango2)).toBe(true);
    });

    test("rangos contiguos (fin == inicio) -> false", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const rango2 = new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20"));
      expect(rango1.seSuperponeConOtraFecha(rango2)).toBe(false);
    });

    test("separados sin tocarse -> false", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05"));
      const rango2 = new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20"));
      expect(rango1.seSuperponeConOtraFecha(rango2)).toBe(false);
    });

    test("simetría: a vs b igual resultado", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const rango2 = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      expect(rango1.seSuperponeConOtraFecha(rango2)).toBe(
        rango2.seSuperponeConOtraFecha(rango1)
      );
    });
  });

  describe("DisponibilidadService.estaLibre - casos", () => {
    
    test("sin bloqueos -> true", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const bloqueos: RangoDeFechas[] = [];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("pedido no toca ninguno -> true", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-15")),
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("pedido solapa uno -> false", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("solapa alguno entre varios -> false", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-12"), new Date("2024-01-18"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05")),
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-15")), // Este se solapa
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("contiguo a bloqueo (pegado) -> true", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20")), // Contiguo pero no solapado
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("pedido dentro de un bloqueo -> false", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-20")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("pedido contiene bloqueo -> false", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-20"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

  

    test("solapa primer bloqueo -> false", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-08"), new Date("2024-01-12"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10")), // Se solapa
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("solapa bloqueo intermedio -> false", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-18"), new Date("2024-01-22"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05")),
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20")), // Se solapa
        new RangoDeFechas(new Date("2024-01-25"), new Date("2024-01-30")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

  describe("escenarios más realistas", () => {
    
    test("múltiples bloqueos por alquileres previos", () => {
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-03")),
        new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-08")),
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-12")),
      ];
      
      // Rango que cae en hueco libre
      const solicitaNov = new RangoDeFechas(new Date("2024-01-03"), new Date("2024-01-05"));
      expect(DisponibilidadService.estaLibre(solicitaNov, bloqueos)).toBe(true);
      
      // Rango que toca un bloqueo existente
      const solicitaEnBloqueo = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-04"));
      expect(DisponibilidadService.estaLibre(solicitaEnBloqueo, bloqueos)).toBe(false);
    });

    test("vehículo sin bloqueos (primer caso)", () => {
      const bloqueos: RangoDeFechas[] = [];
      const rango = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      expect(DisponibilidadService.estaLibre(rango, bloqueos)).toBe(true);
    });

    test("vehículo bloqueado todo el mes", () => {
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-02-01")),
      ];
      const rango = new RangoDeFechas(new Date("2024-01-15"), new Date("2024-01-20"));
      expect(DisponibilidadService.estaLibre(rango, bloqueos)).toBe(false);
    });
  });
});
