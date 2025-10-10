export default class RangoDeFechas {

    private inicio: Date;
    private fin: Date
    

    public setInicio(inicio: Date): void { this.inicio = inicio; }
    public getInicio(): Date { return this.inicio; }

    public setFin(fin: Date): void { this.fin = fin; }
    public getFin(): Date { return this.fin; }

    public dias(): number {
        const msPorDia = 1000 * 60 * 60 * 24;
        const diferenciaMs = this.fin.getTime() - this.inicio.getTime();

        return Math.floor(diferenciaMs / msPorDia);
    }

    public seCruzaCon(otro: RangoDeFechas): boolean {
        return this.inicio <= otro.fin && otro.inicio <= this.fin;
    }

    
    constructor(inicio: Date, fin: Date) {
        this.inicio = inicio;
        this.fin = fin;
    }

}
