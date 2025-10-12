export default class Cliente {
    constructor(
        private id: number,
        private apellido: string,
        private nombre: string,
        private dni: number,
        private telefono: string,
        private email: string
    ) { }

    public setId(id: number): void { this.id = id; }
    public getId(): number { return this.id; }
    public setApellido(apellido: string): void { this.apellido = apellido; }
    public getApellido(): string { return this.apellido; }
    public setNombre(nombre: string): void { this.nombre = nombre; }
    public getNombre(): string { return this.nombre; }
    public setDni(dni: number): void { this.dni = dni; }
    public getDni(): number { return this.dni; }
    public setTelefono(telefono: string): void { this.telefono = telefono; }
    public getTelefono(): string { return this.telefono; }
    public setEmail(email: string): void { this.email = email; }
    public getEmail(): string { return this.email; }
}
