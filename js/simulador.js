/*
  simulador.js
  Versión anterior (Entrega 1) - mantiene prompts y console
  Incluido para ver el progreso
*/
const IVA = 0.21;
const DESCUENTO_POR_CANTIDAD = 0.10;
const UMBRAL_DESCUENTO = 10;
const productos = [
  { id: 1, nombre: 'Camiseta', precio: 1200 },
  { id: 2, nombre: 'Gorra', precio: 600 },
  { id: 3, nombre: 'Taza', precio: 350 },
  { id: 4, nombre: 'Libro', precio: 2500 }
];
let carrito = [];
function pedirNumero(mensaje, valorPorDefecto = '') {
  const respuesta = prompt(mensaje, valorPorDefecto);
  if (respuesta === null) return null;
  const numero = Number(respuesta);
  if (Number.isNaN(numero) || !isFinite(numero)) {
    alert('Por favor ingresa un número válido.');
    return pedirNumero(mensaje, valorPorDefecto);
  }
  return numero;
}
function mostrarCatalogo() {
  console.log('--- Catálogo de Productos ---');
  productos.forEach(p => {
    console.log(`ID: ${p.id} | ${p.nombre} - $${p.precio}`);
  });
  alert('Se ha listado el catálogo en la consola. Revisa la pestaña "Consola".');
}
function solicitarProductos() {
  carrito = [];
  mostrarCatalogo();
  while (true) {
    const id = pedirNumero('Ingresa el ID del producto que querés agregar (o presiona Cancel para terminar):');
    if (id === null) break;
    const producto = productos.find(p => p.id === Math.trunc(id));
    if (!producto) {
      alert('ID inválido. Intentá de nuevo.');
      continue;
    }
    const cantidad = pedirNumero(`¿Cuántas unidades de "${producto.nombre}" querés agregar?`, '1');
    if (cantidad === null) break;
    if (cantidad <= 0) {
      alert('La cantidad debe ser un número mayor a 0.');
      continue;
    }
    const existente = carrito.find(item => item.productoId === producto.id);
    if (existente) {
      existente.cantidad += Math.trunc(cantidad);
    } else {
      carrito.push({ productoId: producto.id, cantidad: Math.trunc(cantidad) });
    }
    console.log(`Agregaste ${Math.trunc(cantidad)} x ${producto.nombre} al carrito.`);
    const continuar = confirm('¿Querés agregar otro producto? (Aceptar = Sí, Cancelar = No)');
    if (!continuar) break;
  }
  if (carrito.length === 0) {
    alert('El carrito quedó vacío. Fin de la simulación.');
  } else {
    console.log('Carrito final:', carrito);
  }
}
function calcularTotales() {
  let subtotal = 0;
  let unidadesTotales = 0;
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const producto = productos.find(p => p.id === item.productoId);
    if (!producto) continue;
    const linea = producto.precio * item.cantidad;
    subtotal += linea;
    unidadesTotales += item.cantidad;
    console.log(`Línea: ${item.cantidad} x ${producto.nombre} = $${linea}`);
  }
  let descuento = 0;
  if (unidadesTotales >= UMBRAL_DESCUENTO) {
    descuento = subtotal * DESCUENTO_POR_CANTIDAD;
  }
  const baseImponible = subtotal - descuento;
  const iva = baseImponible * IVA;
  const total = baseImponible + iva;
  return {
    subtotal,
    descuento,
    baseImponible,
    iva,
    total,
    unidadesTotales
  };
}
function mostrarResultados(totales) {
  console.log('--- Resumen de la Compra ---');
  console.log(`Unidades totales: ${totales.unidadesTotales}`);
  console.log(`Subtotal: $${totales.subtotal.toFixed(2)}`);
  console.log(`Descuento: $${totales.descuento.toFixed(2)}`);
  console.log(`Base imponible: $${totales.baseImponible.toFixed(2)}`);
  console.log(`IVA (21%): $${totales.iva.toFixed(2)}`);
  console.log(`Total a pagar: $${totales.total.toFixed(2)}`);
  const mensaje = 
    'Resumen de la compra:\n' +
    'Unidades totales: ' + totales.unidadesTotales + '\n' +
    'Subtotal: $' + totales.subtotal.toFixed(2) + '\n' +
    'Descuento: $' + totales.descuento.toFixed(2) + '\n' +
    'IVA (21%): $' + totales.iva.toFixed(2) + '\n' +
    'Total a pagar: $' + totales.total.toFixed(2);
  alert(mensaje);
}
function iniciarSimulador() {
  console.clear();
  console.log('Iniciando Simulador de Compras (Entregable 1)');
  solicitarProductos();
  if (carrito.length === 0) {
    console.log('Simulación finalizada sin productos.');
    return;
  }
  const resultados = calcularTotales();
  mostrarResultados(resultados);
  const repetir = confirm('¿Querés realizar otra simulación? (Aceptar = Sí, Cancelar = No)');
  if (repetir) {
    iniciarSimulador();
  } else {
    console.log('Gracias por usar el simulador. Hasta luego.');
  }
}
window.addEventListener('load', () => {
  const comenzar = confirm('¿Querés iniciar el Simulador de Compras ahora?');
  if (comenzar) iniciarSimulador();
});
window.iniciarSimulador = iniciarSimulador;
