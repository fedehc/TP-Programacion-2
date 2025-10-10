import { calcularDias } from "./functions";
import Reserva from "./reserva";

export default class Alquiler{
    protected static contador: number = 0;
    private idAlquiler: number;
    private reserva: Reserva;
    private fechaRetiro: string;
    private fechaEntrega: string;
    private dias: number;
    private kmInicio: number;
    private kmFin: number;
    private tarifaAlquiler: number;


    constructor(reserva?:Reserva, retiro?: string, entrega?: string, kmFin?: number
    ){
        Alquiler.contador += 1;
        this.idAlquiler = Alquiler.contador;
        this.reserva = reserva ?? undefined as unknown as Reserva;
        this.fechaRetiro = retiro ?? "";
        this.fechaEntrega = entrega ?? "";
        this.dias = 0;
        this.kmInicio = this.reserva.getKmInicial();
        this.kmFin = kmFin ?? 0;
        this.tarifaAlquiler = 0;
    }

    private calcularDiasAlquiler(){
        this.dias = calcularDias(this.fechaRetiro, this.fechaEntrega);
    }

    private calcularMontoExceso(){
        const kmMax: number = this.reserva.getKmMaxVehiculo();
    return kmMax === 0 ? 0 : ((this.kmFin - this.kmInicio) - (kmMax * this.dias)) * this.reserva.getTarifaExcesoVehiculo();
    }

    private calcularMontoDias(){
        return this.reserva.getTarifaDiariaVehiculo() * this.dias;
    }

    public calcularTarifaAlquiler (){
        this.calcularDiasAlquiler();
        const montoDias: number = this.calcularMontoDias();
        const montoExceso: number = this.calcularMontoExceso();

        this.tarifaAlquiler = montoDias + montoExceso;            
    }

    public getAlquiler(){
        this.calcularTarifaAlquiler();
        return `Alquiler #${this.idAlquiler}: Tarifa $${this.tarifaAlquiler}\n` ; //no tengo idea de qué agregar
    }

}