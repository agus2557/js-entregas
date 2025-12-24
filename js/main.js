let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productosHTML = document.getElementById("productos");
const carritoHTML = document.getElementById("carrito");
const totalHTML = document.getElementById("total");

fetch("./data/productos.json")
  .then(res => res.json())
  .then(data => renderProductos(data));

function renderProductos(productos){
  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.img}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="agregar(${p.id})">Agregar</button>
    `;
    productosHTML.appendChild(div);
  });
  window.productosData = productos;
}

function agregar(id){
  const prod = productosData.find(p => p.id === id);
  const item = carrito.find(p => p.id === id);

  if(item){
    item.cantidad++;
  } else {
    carrito.push({...prod, cantidad: 1});
  }

  guardarCarrito();
  Swal.fire("Agregado", "Juego agregado al carrito", "success");
}

function renderCarrito(){
  carritoHTML.innerHTML = "";

  carrito.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><strong>${p.nombre}</strong></p>
      <p>Cantidad: ${p.cantidad}</p>
      <p>$${p.precio * p.cantidad}</p>
      <button onclick="eliminar(${i})">Eliminar</button>
    `;
    carritoHTML.appendChild(div);
  });

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  totalHTML.textContent = "Total: $" + total;
}

function eliminar(index){
  carrito.splice(index, 1);
  guardarCarrito();
}

function guardarCarrito(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

document.getElementById("formCompra").addEventListener("submit", e => {
  e.preventDefault();

  if(carrito.length === 0){
    Swal.fire("Carrito vacío", "Agregá juegos", "warning");
    return;
  }

  Swal.fire("Compra realizada", "Gracias por comprar en GameZone", "success");
  carrito = [];
  guardarCarrito();
});

renderCarrito();
