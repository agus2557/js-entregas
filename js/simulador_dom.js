/*
  simulador_dom.js
  Entregable 2 - Integración con DOM y localStorage
*/

const STORAGE_KEY = 'simulador_carrito_v2';

const productos = [
  { id: 1, nombre: 'Camiseta', precio: 1200, stock: 20 },
  { id: 2, nombre: 'Gorra', precio: 600, stock: 15 },
  { id: 3, nombre: 'Taza', precio: 350, stock: 40 },
  { id: 4, nombre: 'Libro', precio: 2500, stock: 10 }
];

let carrito = [];

function formatMoney(n) {
  return '$' + Number(n).toFixed(2);
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

function loadCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      carrito = JSON.parse(raw);
      if (!Array.isArray(carrito)) carrito = [];
    } catch (e) {
      console.error('Error parsing storage', e);
      carrito = [];
    }
  } else {
    carrito = [];
  }
}

function renderProducts() {
  const container = document.getElementById('productosList');
  container.innerHTML = '';
  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'productoCard';
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: ${formatMoney(p.precio)}</p>
      <p>Stock: ${p.stock}</p>
      <button data-id="${p.id}" class="btnAddInline">Agregar 1</button>
    `;
    container.appendChild(card);
  });

  const select = document.getElementById('productoSelect');
  select.innerHTML = productos.map(p => `<option value="${p.id}">${p.nombre} - ${formatMoney(p.precio)}</option>`).join('');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  if (carrito.length === 0) {
    container.innerHTML = '<p>El carrito está vacío.</p>';
  } else {
    const list = document.createElement('ul');
    list.className = 'cartList';
    carrito.forEach(item => {
      const producto = productos.find(p => p.id === item.productoId);
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="cartName">${producto.nombre} (x${item.cantidad})</span>
        <span class="cartLine">${formatMoney(producto.precio * item.cantidad)}</span>
        <button data-id="${item.productoId}" class="btnRemove">-</button>
      `;
      list.appendChild(li);
    });
    container.appendChild(list);
  }

  const resumen = calculateTotals();
  const resumenDiv = document.getElementById('resumen');
  resumenDiv.innerHTML = `
    <p>Unidades totales: <strong>${resumen.unidades}</strong></p>
    <p>Subtotal: <strong>${formatMoney(resumen.subtotal)}</strong></p>
    <p>Descuento (si aplica): <strong>${formatMoney(resumen.descuento)}</strong></p>
    <p>IVA (21%): <strong>${formatMoney(resumen.iva)}</strong></p>
    <p class="total">Total a pagar: <strong>${formatMoney(resumen.total)}</strong></p>
  `;
}

function addToCart(productoId, cantidad = 1) {
  const p = productos.find(x => x.id === productoId);
  if (!p) return showMessage('Producto inexistente', true);
  cantidad = Math.trunc(cantidad);
  if (cantidad <= 0) return showMessage('La cantidad debe ser mayor a 0', true);

  const existente = carrito.find(i => i.productoId === productoId);
  const totalEnCarrito = existente ? existente.cantidad + cantidad : cantidad;
  if (totalEnCarrito > p.stock) return showMessage('No hay suficiente stock', true);

  if (existente) existente.cantidad += cantidad;
  else carrito.push({ productoId, cantidad });

  saveCart();
  renderCart();
  showMessage(`Agregaste ${cantidad} x ${p.nombre}`);
}

function removeOneFromCart(productoId) {
  const idx = carrito.findIndex(i => i.productoId === productoId);
  if (idx === -1) return;
  carrito[idx].cantidad -= 1;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  saveCart();
  renderCart();
  showMessage('Se eliminó una unidad del carrito');
}

function clearCart() {
  carrito = [];
  saveCart();
  renderCart();
  showMessage('Carrito vaciado');
}

function calculateTotals() {
  let subtotal = 0;
  let unidades = 0;
  const DESCUENTO_POR_CANTIDAD = 0.10;
  const UMBRAL_DESCUENTO = 10;
  const IVA = 0.21;

  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const prod = productos.find(p => p.id === item.productoId);
    if (!prod) continue;
    subtotal += prod.precio * item.cantidad;
    unidades += item.cantidad;
  }

  let descuento = 0;
  if (unidades >= UMBRAL_DESCUENTO) descuento = subtotal * DESCUENTO_POR_CANTIDAD;

  const base = subtotal - descuento;
  const iva = base * IVA;
  const total = base + iva;

  return { subtotal, unidades, descuento, iva, total };
}

function showMessage(text, isError = false) {
  const div = document.getElementById('mensajes');
  div.textContent = text;
  div.className = isError ? 'error' : 'info';
  setTimeout(() => {
    div.textContent = '';
    div.className = '';
  }, 3000);
}

function setupEvents() {
  const form = document.getElementById('formAdd');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const prodId = Number(document.getElementById('productoSelect').value);
    const qty = Number(document.getElementById('cantidadInput').value);
    addToCart(prodId, qty);
  });

  document.getElementById('productosList').addEventListener('click', (e) => {
    if (e.target.matches('.btnAddInline')) {
      const id = Number(e.target.dataset.id);
      addToCart(id, 1);
    }
  });

  document.getElementById('cartItems').addEventListener('click', (e) => {
    if (e.target.matches('.btnRemove')) {
      const id = Number(e.target.dataset.id);
      removeOneFromCart(id);
    }
  });

  document.getElementById('btnClear').addEventListener('click', (e) => {
    clearCart();
  });

  document.getElementById('btnCheckout').addEventListener('click', (e) => {
    const resumen = calculateTotals();
    if (resumen.unidades === 0) return showMessage('El carrito está vacío', true);
    saveCart();
    showMessage('Simulación guardada en localStorage. Total: ' + formatMoney(resumen.total));
  });
}

function init() {
  loadCart();
  renderProducts();
  renderCart();
  setupEvents();
}

window.simulador = { init, addToCart, clearCart, loadCart };

document.addEventListener('DOMContentLoaded', init);
