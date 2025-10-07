import Tarifa from "./tarifa";


export default class TarifaSuv extends Tarifa {

    private listaKmsDiarios: number[] = [];
    private costoBaseDiario: number = 80;
    private costoSeguroPorDia = 15;
    private limiteKms: number = 500;
    private recargoKms: number = 0.25;


    public getListaKmsDiarios(): number[] { return this.listaKmsDiarios; }
    public setListaKmsDiarios(listaKmsDiarios: number[]): void { this.listaKmsDiarios = listaKmsDiarios; }
    public getCostoBaseDiario(): number { return this.costoBaseDiario; }
    public getCostoSeguroPorDia(): number { return this.costoSeguroPorDia; }
    public getLimiteKms(): number { return this.limiteKms; }
    public getRecargoKms(): number { return this.recargoKms; }

    public calcularRecargoTotal(): number {
        let totalRecargo: number = 0;
        let totalKmsRecorridos: number = 0;

        for (const kmsDia of this.getListaKmsDiarios()) {
            totalKmsRecorridos += kmsDia;
        }
        if(totalKmsRecorridos > this.getLimiteKms()) {
            totalRecargo = (totalKmsRecorridos - this.getLimiteKms()) * this.getRecargoKms();
        }
        return totalRecargo;
    }

    public calcularCostoKmsTotal(): number {
        let cantDias: number = this.getListaKmsDiarios().length;
        let total: number = cantDias * (this.getCostoBaseDiario() + this.getCostoSeguroPorDia());        

        return total;
    }

    public calcularTarifaTotal(): number {
        return this.calcularRecargoTotal() + this.calcularCostoKmsTotal();
    }

    
    constructor()
    constructor(listaKmsDiarios: number[])
    constructor(listaKmsDiarios?: number[]) {
        super();
        if(listaKmsDiarios) { this.listaKmsDiarios = listaKmsDiarios; }
    }
}