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
