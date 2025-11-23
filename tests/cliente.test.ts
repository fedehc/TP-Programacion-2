import Cliente from "../src/Extras/cliente";

describe("cliente estudiantil", () => {
  test("setters cambian valores y getters devuelven", () => {
    const c = new Cliente(1, "Perez", "Juan", 12345678, "555-000", "juan@test.com");
    c.setNombre("Juancito");
    c.setApellido("Gomez");
    c.setTelefono("555-111");
    c.setEmail("jg@test.com");
    c.setId(2);
    expect(c.getId()).toBe(2);
    expect(c.getNombre()).toBe("Juancito");
    expect(c.getApellido()).toBe("Gomez");
    expect(c.getTelefono()).toBe("555-111");
    expect(c.getEmail()).toBe("jg@test.com");
    expect(c.getDni()).toBe(12345678);
  });
});
