# Sistema de Alquiler de Vehículos  
## Trabajo Práctico – Programación II 

Este repositorio contiene la implementación completa de un **Sistema de Alquiler de Vehículos** desarrollado en **TypeScript**, como parte del Trabajo Práctico de la materia **Programación II**.  
El sistema abarca la gestión integral de vehículos, reservas, alquileres, mantenimiento, temporadas, tarifas y estadísticas, respetando las reglas del dominio y manteniendo un diseño modular, claro y escalable.

## Objetivo del Proyecto

El propósito es modelar un sistema que permita administrar todas las operaciones relacionadas con el alquiler de vehículos, desde la reserva inicial hasta la finalización del alquiler, incluyendo:

- Control del estado de los vehículos  
- Gestión de disponibilidad y superposición de fechas  
- Cálculo de tarifas y ajustes por temporada  
- Evaluación de mantenimiento  
- Obtención de estadísticas operativas  

## Estructura del Proyecto

El código fuente se encuentra dentro de la carpeta `src/`, organizado en módulos por responsabilidad:

src/
 ├── Alquiler/
 ├── Estadistica/
 ├── Excepciones/
 ├── Extras/
 ├── Mantenimiento/
 ├── Reserva/
 ├── Tarifa/
 ├── Temporada/
 └── Vehiculo/

## Descripción de los Módulos

### Vehículo (`src/Vehiculo/`)

- vehiculo.ts  
- gestorVehiculo.ts  
- Estados del vehículo  
- estadoVehiculoState.ts  

### Reserva (`src/Reserva/`)

- reserva.ts  
- gestorReserva.ts  

### Alquiler (`src/Alquiler/`)

- alquiler.ts  
- gestorAlquiler.ts  

### Tarifas (`src/Tarifa/`)

- tarifa.ts  
- tarifaCompacto.ts  
- tarifaSedan.ts  
- tarifaSuv.ts  

### Temporadas (`src/Temporada/`)

- temporada.ts  
- temporadaAlta.ts  
- temporadaMedia.ts  
- temporadaBaja.ts  
- temporadaSelector.ts  

### Mantenimiento (`src/Mantenimiento/`)

- Criterios y reglas de mantenimiento  
- Evaluador central  

### Estadísticas (`src/Estadistica/`)

- Ocupación  
- Rentabilidad  
- Vehículos más y menos alquilados  

### Extras (`src/Extras/`)

- enums.ts  
- rangoDeFechas.ts  
- disponibilidadService.ts  

### Excepciones (`src/Excepciones/`)

- Manejo específico de errores del dominio  

## Clase Principal del Sistema

### sistemaAlquiler.ts

Orquestador general que integra todos los gestores y expone las operaciones principales:

- Agregar vehículos  
- Crear y confirmar reservas  
- Generar alquileres  
- Finalizar alquileres  
- Consultar disponibilidad  
- Obtener estadísticas  

## Instalación y Ejecución

### Requisitos

- Node.js  
- npm o yarn  
- TypeScript configurado

### Instalación

npm install

### Compilación

npm run build

### Ejecución

npm start

## Ejecución de Tests

npm test

## Funcionalidades Implementadas

- Gestión completa de vehículos  
- Control de estados  
- Reservas con validación  
- Alquileres con cálculo de costo  
- Tarifas por categoría  
- Ajustes por temporada  
- Mantenimiento  
- Estadísticas  
- Excepciones robustas  


