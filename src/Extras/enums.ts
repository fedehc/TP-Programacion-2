export enum CategoriaVehiculo {
    compacto = "compacto",
    sedan = "sedan",
    suv = "suv"
}

export enum EstadoVehiculo {
    disponible = "Disponible",
    alquiler = "En Alquiler",
    mantenimiento = "En Mantenimiento",
}

export enum EstadoReserva {
    pendiente,
    confirmada,
    cancelada,
    cumplida
}

export enum EstadoAlquiler {
    activo = "activo",
    finalizado = "finalizado",
}