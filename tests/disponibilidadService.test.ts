import DisponibilidadService from "../src/disponibilidadService";
import RangoDeFechas from "../src/rangoDeFechas";

describe("DisponibilidadService", () => {
  
  describe("seSolapan", () => {
    
    test("debe retornar true cuando dos rangos se solapan parcialmente", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const rango2 = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      expect(DisponibilidadService.seSolapan(rango1, rango2)).toBe(true);
    });

    test("debe retornar true cuando un rango está completamente contenido en otro", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-20"));
      const rango2 = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      expect(DisponibilidadService.seSolapan(rango1, rango2)).toBe(true);
    });

    test("debe retornar true cuando dos rangos coinciden exactamente", () => {
      const inicio = new Date("2024-01-01");
      const fin = new Date("2024-01-10");
      const rango1 = new RangoDeFechas(inicio, fin);
      const rango2 = new RangoDeFechas(inicio, fin);
      expect(DisponibilidadService.seSolapan(rango1, rango2)).toBe(true);
    });

    test("debe retornar false cuando los rangos son contiguos (fin1 == inicio2)", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const rango2 = new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20"));
      expect(DisponibilidadService.seSolapan(rango1, rango2)).toBe(false);
    });

    test("debe retornar false cuando los rangos son completamente separados", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05"));
      const rango2 = new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20"));
      expect(DisponibilidadService.seSolapan(rango1, rango2)).toBe(false);
    });

    test("debe ser simétrico: seSolapan(a, b) === seSolapan(b, a)", () => {
      const rango1 = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const rango2 = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      expect(DisponibilidadService.seSolapan(rango1, rango2)).toBe(
        DisponibilidadService.seSolapan(rango2, rango1)
      );
    });
  });

  describe("estaLibre", () => {
    
    test("debe retornar true cuando no hay bloqueos", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const bloqueos: RangoDeFechas[] = [];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("debe retornar true cuando el rango pedido no se solapa con ningún bloqueo", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-15")),
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("debe retornar false cuando el rango pedido se solapa con un bloqueo", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe retornar false si el rango pedido se solapa con alguno de múltiples bloqueos", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-12"), new Date("2024-01-18"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05")),
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-15")), // Este se solapa
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe retornar true cuando el rango pedido es contiguo (no se solapa) con bloqueos", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20")), // Contiguo pero no solapado
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("debe retornar false cuando el rango pedido está completamente contenido en un bloqueo", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-20")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe retornar false si el rango pedido contiene un bloqueo", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-20"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-05"), new Date("2024-01-15")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe manejar correctamente múltiples bloqueos sin solapamiento entre ellos", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-02-01"), new Date("2024-02-05"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10")),
        new RangoDeFechas(new Date("2024-01-15"), new Date("2024-01-25")),
        new RangoDeFechas(new Date("2024-02-10"), new Date("2024-02-15")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(true);
    });

    test("debe retornar false cuando hay solapamiento con el primer bloqueo", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-08"), new Date("2024-01-12"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10")), // Se solapa
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe retornar false cuando hay solapamiento con un bloqueo en el medio de la lista", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-18"), new Date("2024-01-22"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05")),
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-20")), // Se solapa
        new RangoDeFechas(new Date("2024-01-25"), new Date("2024-01-30")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe retornar false cuando hay solapamiento con el último bloqueo", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-23"), new Date("2024-01-27"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-05")),
        new RangoDeFechas(new Date("2024-01-10"), new Date("2024-01-15")),
        new RangoDeFechas(new Date("2024-01-20"), new Date("2024-01-25")), // Se solapa
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });

    test("debe manejar rangos con solo horas de diferencia (caso borde)", () => {
      const rangoPedido = new RangoDeFechas(new Date("2024-01-01T10:00:00"), new Date("2024-01-01T14:00:00"));
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01T12:00:00"), new Date("2024-01-01T16:00:00")),
      ];
      expect(DisponibilidadService.estaLibre(rangoPedido, bloqueos)).toBe(false);
    });
  });

  describe("escenarios realistas", () => {
    
    test("vehículo con múltiples bloqueos por alquileres anteriores", () => {
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

    test("vehículo sin bloqueos (primer alquiler)", () => {
      const bloqueos: RangoDeFechas[] = [];
      const rango = new RangoDeFechas(new Date("2024-01-01"), new Date("2024-01-10"));
      expect(DisponibilidadService.estaLibre(rango, bloqueos)).toBe(true);
    });

    test("vehículo completamente bloqueado (en mantenimiento todo el mes)", () => {
      const bloqueos = [
        new RangoDeFechas(new Date("2024-01-01"), new Date("2024-02-01")),
      ];
      const rango = new RangoDeFechas(new Date("2024-01-15"), new Date("2024-01-20"));
      expect(DisponibilidadService.estaLibre(rango, bloqueos)).toBe(false);
    });
  });
});
