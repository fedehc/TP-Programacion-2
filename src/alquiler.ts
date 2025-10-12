import { EstadoAlquiler } from "./enums";
import RangoDeFechas from "./rangoDeFechas";
import Reserva from "./reserva";
import Vehiculo from "./vehiculo";


export default class Alquiler {
    constructor(
        private id: string,
        private reserva: Reserva,
        private vehiculo: Vehiculo,
        private clienteId: string,
        private rango: RangoDeFechas,
        private kilometrajeInicial: number,
        private kilometrajeFinal?: number,
        private estado: EstadoAlquiler = EstadoAlquiler.activo,
        private costoTotal?: number
    ) { }

    public getId(): string { return this.id; }
    public getReserva(): Reserva { return this.reserva; }
    public getVehiculo(): Vehiculo { return this.vehiculo; }
    public getClienteId(): string { return this.clienteId; }
    public getRango(): RangoDeFechas { return this.rango; }
    public getKilometrajeInicial(): number { return this.kilometrajeInicial; }
    public getKilometrajeFinal(): number | undefined { return this.kilometrajeFinal; }
    public getEstado(): EstadoAlquiler { return this.estado; }
    public getCostoTotal(): number | undefined { return this.costoTotal; }

    public validarFinalizacion(kmFinal: number): void {
        if (this.estado !== EstadoAlquiler.activo) {
            throw new Error("El alquiler no está activo.");
        }
        if (kmFinal < this.kilometrajeInicial) {
            throw new Error("El kilometraje final no puede ser menor al inicial.");
        }
    }

    public getKmRecorridos(): number {
        if (this.kilometrajeFinal === undefined) {
            throw new Error("El alquiler no fue finalizado todavía.");
        }
        return this.kilometrajeFinal - this.kilometrajeInicial;
    }

    public calcularCostoTotal(): number {
        const dias = this.rango.diasDeDiferencia();
        const kmRecorridos = this.getKmRecorridos();
        return this.vehiculo.getTarifa().calcularCosto(dias, kmRecorridos);
    }

    public finalizar(kmFinal: number): void {
        this.validarFinalizacion(kmFinal);
        this.kilometrajeFinal = kmFinal;
        this.costoTotal = this.calcularCostoTotal();
        this.estado = EstadoAlquiler.finalizado;
    }
}