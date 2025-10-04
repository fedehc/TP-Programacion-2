import Tarifa from "./tarifa";


export default class TarifaSedan extends Tarifa {

    private listaKmsDiarios: number[] = [];
    private costoBaseDiario: number = 50;
    private recargoKmsDiarios: number = 0.2;


    public getListaKmsDiarios(): number[] { return this.listaKmsDiarios; }
    public setListaKmsDiarios(listaKmsDiarios: number[]): void { this.listaKmsDiarios = listaKmsDiarios; }
    public getCostoBaseDiario(): number { return this.costoBaseDiario; }
    public getRecargoKmsDiarios(): number { return this.recargoKmsDiarios; }


    public calcularRecargoTotal(): number {
        let totalRecargo: number = 0;

        for (const kmsDia of this.getListaKmsDiarios()) {
            totalRecargo += kmsDia * this.getRecargoKmsDiarios();
        }

        return totalRecargo;
    }

    public calcularCostoKmsTotal(): number {
        let cantDias : number = this.getListaKmsDiarios().length;
        let total: number = cantDias * this.getCostoBaseDiario();        

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