import Tarifa from "./tarifa";
import Mantenimiento from "./mantenimiento";
import { CategoriaVehiculo, EstadoVehiculo } from "./enums";


export default abstract class Vehiculo {
    private categoria: CategoriaVehiculo;
    private matricula: string;
    private estado: EstadoVehiculo;
    private kilometraje: number;
    private tarifa: Tarifa;
    private mantenimientos: Mantenimiento[];


    public getCategoria(): CategoriaVehiculo { return this.categoria; }
    public setCategoria(nuevaCat: CategoriaVehiculo):void  { this.categoria = nuevaCat; }
    public getMatricula(): string {  return this.matricula; }
    public setMatricula(nuevaMat: string):void  { this.matricula = nuevaMat; }
    public getEstado(): EstadoVehiculo { return this.estado; }
    public setEstado(nuevoEstado: EstadoVehiculo):void  { this.estado = nuevoEstado; }
    public getKilometraje(): number { return this.kilometraje; }
    public setKilometraje(nuevoKm: number):void  { this.kilometraje = nuevoKm; }
    public getTarifa(): Tarifa { return this.tarifa; }
    public setTarifa(nuevaTarifa: Tarifa):void  { this.tarifa = nuevaTarifa; }  
    public getMantenimiento(): Mantenimiento[] { return this.mantenimientos; }
    public setMantenimiento(nuevoMant: Mantenimiento[]):void { this.mantenimientos = nuevoMant; }

    
    constructor(categoria: CategoriaVehiculo, matricula: string, estado: string, kilometraje: number,
                tarifa: Tarifa, mantenimientos: Mantenimiento[]) {
        this.categoria = categoria;
        this.matricula = matricula;
        this.estado = estado;
        this.kilometraje = kilometraje;
        this.tarifa = tarifa;
        this.mantenimientos = mantenimientos;
    }
}