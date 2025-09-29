// import Operations from "./operations";
// import Persona from "./persona";

import Circulo from "./figuras/circulo";
import Cuadrado from "./figuras/cuadrado";
import Triangulo from "./figuras/triangulo";


// const op:Operations = new Operations();

// const resultado = op.sum(1,3);
// // console.info("Resultado: ", resultado);
// // console.log("Resultado: " + resultado);
// console.log(`Resultado: ${resultado}`);

// // const greeting: string = 'Hello, TypeScript!'; 
// // console.log(greeting);

// const n: Persona = new Persona(11);

// const k: Persona = new Persona("kkk");

// const p: Persona = new Persona("yyy", 20);

// const x: Persona = new Persona();
// x.edad = 18;
// x.nombre = "xxxx";

// console.log(`Persona: ${p.nombre} tiene ${p.edad} aNios`);
// console.log(`Persona X: ${x.nombre} tiene ${x.edad} aNios`);


// = operador para asignación
// == operador para comparar, pero SÓLO compara valor
// === operador para comparar, compara valor y tipo de dato.


const cuad = new Cuadrado();
cuad.color = "azul";
cuad.nombre = "Azul";
cuad.ladoCuadrado = 3;


console.log(`El cuadrado: ${cuad.nombre} tiene un color: ${cuad.color} y tiene un perímetro de ${cuad.getPerimetro()} y un área de ${cuad.getArea()}`);


const circ = new Circulo();
circ.color = "rojo";
circ.nombre = "Rojo";
circ.radio = 4;

console.log(`El circulo: ${circ.nombre} tiene un color: ${circ.color} y tiene un perímetro de ${circ.getPerimetro()} y un área de ${circ.getArea()}`);

const triangulo = new Triangulo();
triangulo.color = "verde";
triangulo.nombre = "Mr. T";
triangulo.altura = 3;
triangulo.base = 4;


console.log(`El triangulo: ${triangulo.nombre} tiene un color: ${triangulo.color} y tiene un perímetro de ${triangulo.getPerimetro()} y un área de ${triangulo.getArea()}`);