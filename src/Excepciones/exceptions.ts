export class DatosInvalidosException extends Error {
  constructor(field: string, reason: string) {
    super(`${field} ${reason}`);
    this.name = "DatosInvalidosException";
  }
}

export class ReservaSinVehiculoException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReservaSinVehiculoException";
  }
}

export class RangoInvalidoException extends Error {
  constructor(inicio: Date, fin: Date) {
    super(`Rango inválido: inicio ${inicio} debe ser anterior a fin ${fin}`);
    this.name = "RangoInvalidoException";
  }
}

export class PeriodoRequeridoException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PeriodoRequeridoException";
  }
}

export class VehiculoNoEncontradoException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VehiculoNoEncontradoException";
  }
}

export class AlquilerEstadoInvalidoException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlquilerEstadoInvalidoException";
  }
}

export class KilometrajeInvalidoException extends Error {
  constructor(kmInicial: number, kmFinal: number) {
    super(`Kilometraje inválido: inicial ${kmInicial} debe ser menor o igual a final ${kmFinal}`);
    this.name = "KilometrajeInvalidoException";
  }
}

export class AlquilerNoFinalizadoException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlquilerNoFinalizadoException";
  }
}

export class EstadisticasInsuficientesException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstadisticasInsuficientesException";
  }
}
