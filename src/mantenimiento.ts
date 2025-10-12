export default class Mantenimiento {
    constructor(
        private id: number,
        private fecha: Date,
        private costo: string,
        private descripcion: string
    ) { }


    public setId(id: number): void { this.id = id; }
    public getId(): number { return this.id; }
    public setFecha(fecha: Date): void { this.fecha = fecha; }
    public getFecha(): Date { return this.fecha; }
    public setCosto(costo: string): void { this.costo = costo; }
    public getCosto(): string { return this.costo; }
    public setDescripcion(descripcion: string): void { this.descripcion = descripcion; }
    public getDescripcion(): string { return this.descripcion; }
}
