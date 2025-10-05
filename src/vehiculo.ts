import Tarifa from "./tarifa.ts";
import Mantenimiento from "./mantenimiento.ts";


export default abstract class Vehiculo {
    private matricula: string;
    private estado: string;
    private kilometraje: number;
    private tarifa: Tarifa;
    private historial: Mantenimiento[];


    getMatricula(): string {  return this.matricula; }
    setMatricula(nuevaMat: string) { this.matricula = nuevaMat; }
    getEstado(): string { return this.estado; }
    setEstado(nuevoEstado: string) { this.estado = nuevoEstado; }
    getKilometraje(): number { return this.kilometraje; }
    setKilometraje(nuevoKm: number) { this.kilometraje = nuevoKm; }
    getTarifa(): Tarifa { return this.tarifa; }
    setTarifa(nuevaTarifa: Tarifa) { this.tarifa = nuevaTarifa; }  
    getHistorial(): Mantenimiento[] { return this.historial; }
    setHistorial(nuevoHistorial: Mantenimiento[]) { this.historial = nuevoHistorial; }

    constructor(matricula: string, estado: string, kilometraje: number, tarifa: Tarifa, historial: Mantenimiento[]) {
        this.matricula = matricula;
        this.estado = estado;
        this.kilometraje = kilometraje;
        this.tarifa = tarifa;
        this.historial = historial;
    }
}