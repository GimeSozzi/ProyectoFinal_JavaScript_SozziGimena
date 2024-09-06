// Clase Producto que representa un producto en el simulador
class Producto {
    constructor(nombre, precio, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
    }
}

// Clase Carrito que maneja los productos agregados por el usuario
class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("carrito")) || [];
        this.total = this.calcularTotal();
        this.descuento = 0;
    }

    // Calcula el total del carrito sumando el precio total de cada item
    calcularTotal() {
        return this.items.reduce((total, item) => total + item.precioTotal, 0);
    }

    // Guarda el carrito en localStorage 
    guardarEnStorage() {
        try {
            localStorage.setItem("carrito", JSON.stringify(this.items));
        } catch (e) {
            if (e.name === "QuotaExceededError") {
                mostrarMensaje("Error: El almacenamiento local está lleno. No se pueden guardar más productos.", "error");
            } else {
                mostrarMensaje("Error: No se pudo guardar el carrito.", "error");
            }
        }
    }

    // Agrega el producto al carrito con la cantidad especificada
    agregarProducto(producto, cantidad) {
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            mostrarMensaje("Por favor, ingrese una cantidad válida", "error");
            return;
        }
        const precioTotal = producto.precio * cantidad;
        const item = {
            producto: producto.nombre,
            cantidad: cantidad,
            precioTotal: precioTotal,
        };
        this.items.push(item);
        this.total += precioTotal;
        this.actualizarCarrito();
        this.guardarEnStorage();
    }
    
    // Elimina el producto del carrito por índice 
    eliminarProducto(indice) {
        const item = this.items[indice];
        this.total -= item.precioTotal;
        this.items.splice(indice, 1);
        this.actualizarCarrito();
        this.guardarEnStorage();
    }

    // Actualiza la vista del carrito en la interfaz
    actualizarCarrito() {
        const listaCarrito = document.getElementById("listaCarrito");
        listaCarrito.innerHTML = "";

        this.items.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerText = `${item.cantidad} x ${item.producto} - $${item.precioTotal}`;
            const botonEliminar = document.createElement("button");
            botonEliminar.innerText = "Eliminar";
            botonEliminar.className = "btn-eliminar";
            botonEliminar.onclick = () => this.eliminarProducto(index);
            li.appendChild(botonEliminar);
            listaCarrito.appendChild(li);
        });
        
        // Actualiza el total del carrito aplicando descuentos si existen 
        const totalConDescuento = this.total - this.descuento;
        document.getElementById("total").innerText = totalConDescuento >= 0 ? totalConDescuento.toFixed(2) : 0;
        this.verificarCuponVisible();
        actualizarCarritoFlotante();
    }

    // Aplica un cupón de descuento si es válido (6 dígitos)
    aplicarCupon(codigoCupon) {
        if (codigoCupon.length === 6 && !isNaN(codigoCupon)) {
            const descuento = this.total * 0.05;
            this.descuento = descuento;
            mostrarMensaje(`Felicitaciones, obtuviste un descuento del 5%! Descuento aplicado: $${descuento.toFixed(2)}`, "success");
        } else {
            mostrarMensaje("Cupón inválido. Debe ser un código de 6 números.", "error");
        }
        this.actualizarCarrito();
    }
    
    // Realiza el pedido y limpia el carrito 
    realizarPedido() {
        if (this.items.length === 0) {
            mostrarMensaje("El carrito está vacío.", "error");
        } else {
            const totalConDescuento = this.total - this.descuento;
            mostrarMensaje("Pedido realizado con éxito! Total a pagar: $" + (totalConDescuento >= 0 ? totalConDescuento.toFixed(2) : 0), "success");
            this.items = [];
            this.total = 0;
            this.descuento = 0;
            this.actualizarCarrito();
            this.guardarEnStorage();

            // Oculta la ventana del carrito
            const carritoElement = document.getElementById('carrito');
            carritoElement.classList.remove('visible');

            // Limpia el campo de código del cupón
            document.getElementById('codigoCupon').value = '';
        }
    }
    
    // Verifica si el formulario del cupón debe mostrarse 
    verificarCuponVisible() {
        const cuponForm = document.getElementById('cuponForm');
        cuponForm.style.display = this.items.length === 0 ? 'none' : 'block';
    }
}

 
let productos = [];
let categorias = [];
const carrito = new Carrito();

// Función asíncrona para cargar productos desde el JSON (productos.json)
async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();
        productos = data;
        categorias = [...new Set(productos.map(p => p.categoria))];
        mostrarCategorias();
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        mostrarMensaje("Error al cargar los productos. Por favor, intente más tarde.", "error");
    }
}

// Función para mostrar las categorías
function mostrarCategorias() {
    const categoriasSection = document.getElementById('categorias');
    const categoriasFlotantes = document.getElementById('categoriasFlotantes');

    // Limpia y configura la sección de categorías
    categoriasSection.innerHTML = '<h3 class="titulo-categorias">Por dónde quieres empezar</h3><div class="botones-categorias"></div>';
    const botonesCategorias = categoriasSection.querySelector('.botones-categorias');
    categoriasFlotantes.innerHTML = '';

    // Crea un botón para mostrar todos los productos
    const todosBtn = document.createElement('button');
    todosBtn.className = 'categoria-btn active';
    todosBtn.innerHTML = '<i class="fas fa-utensils"></i> Todos';
    todosBtn.onclick = () => filtrarProductos('Todos', event);
    botonesCategorias.appendChild(todosBtn);

    // Crea botones para cada categoría basada en los productos
    const todosBtnFlotante = document.createElement('button');
    todosBtnFlotante.className = 'categoria-btn categoria-btn-todos';
    todosBtnFlotante.innerHTML = '<i class="fas fa-utensils"></i>';
    todosBtnFlotante.onclick = () => filtrarProductos('Todos', event);
    categoriasFlotantes.appendChild(todosBtnFlotante);

    categorias.forEach(categoria => {
        const btn = document.createElement('button');
        btn.className = 'categoria-btn';
        btn.innerHTML = `<i class="fas ${obtenerIconoCategoria(categoria)}"></i> ${categoria}`;
        btn.onclick = (event) => filtrarProductos(categoria, event);
        botonesCategorias.appendChild(btn);

        const btnFlotante = document.createElement('button');
        btnFlotante.className = 'categoria-btn';
        btnFlotante.innerHTML = `<i class="fas ${obtenerIconoCategoria(categoria)}"></i>`;
        btnFlotante.onclick = (event) => filtrarProductos(categoria, event);
        categoriasFlotantes.appendChild(btnFlotante);
    });
}

// Funcion para obtener un ícono basado en la categoría 
function obtenerIconoCategoria(categoria) {
    switch(categoria) {
        case 'Comidas': return 'fa-pizza-slice';
        case 'Bebidas': return 'fa-glass-martini-alt';
        case 'Postres': return 'fa-ice-cream';
        case 'Cafetería': return 'fa-coffee';
        default: return 'fa-utensils';
    }
}

// Filtra los productos mostrados según la categoría seleccionada
function filtrarProductos(categoria, event) {
    const botones = document.querySelectorAll('.categoria-btn');
    botones.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    mostrarProductos(categoria);
}

// Muestra los productos en la interfaz filtrados por categoría o búsqueda
function mostrarProductos(categoriaSeleccionada = 'Todos', busqueda = '') {
    const menuSection = document.getElementById('menu');
    menuSection.innerHTML = '';

    // Recorre cada categoría y muestra los productos que coinciden
    productos.forEach(categoria => {
        if (categoriaSeleccionada === 'Todos' || categoria.categoria === categoriaSeleccionada) {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'categoria';
            categoriaDiv.innerHTML = `<h2>${categoria.categoria}</h2>`;

            const productosDiv = document.createElement('div');
            productosDiv.className = 'productos';

            // Muestra sólo los productos cuyo nombre coincida con la búsqueda
            categoria.items.forEach(item => {
                if (item.nombre.toLowerCase().includes(busqueda)) {
                    const productoDiv = document.createElement('div');
                    productoDiv.className = 'producto';
                    productoDiv.innerHTML = `
                        <img src="${item.imagen}" alt="${item.nombre}">
                        <h3>${item.nombre}</h3>
                        <p>$${item.precio}</p>
                        <input type="number" min="1" value="1" class="cantidad-input">
                        <button onclick="agregarAlCarrito('${item.nombre}', ${item.precio}, '${item.imagen}')">Agregar al Carrito</button>
                    `;
                    productosDiv.appendChild(productoDiv);
                }
            });

            // Si hay productos que mostrar, se agrega la categoría al DOM
            if (productosDiv.childElementCount > 0) {
                categoriaDiv.appendChild(productosDiv);
                menuSection.appendChild(categoriaDiv);
            }
        }
    });
}

// Función para filtrar productos según la búsqueda del usuario
function filtrarPorBusqueda() {
    const busqueda = document.getElementById('buscador').value.toLowerCase();
    mostrarProductos('Todos', busqueda);
}

// Agrega un producto al carrito usando la Clase Carrito
function agregarAlCarrito(nombre, precio, imagen) {
    const cantidadInput = event.target.parentElement.querySelector('.cantidad-input');
    const cantidad = parseInt(cantidadInput.value);
    const producto = new Producto(nombre, precio, imagen);
    carrito.agregarProducto(producto, cantidad);
    mostrarMensaje(`${cantidad} x ${nombre} agregado al carrito`, "carrito");
}

// Muestra mensajes de confirmación, error o información usando Toastify y SweetAlert
function mostrarMensaje(mensaje, tipo) {
    if (tipo === "carrito") {
        Toastify({
            text: mensaje,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff4757, #ff6b81)",
            },
        }).showToast();
    } else if (tipo === "success") {
        Swal.fire({
            icon: 'success',
            title: '¡Felicitaciones!',
            text: mensaje,
            confirmButtonColor: '#ff4757',
        });
    } else if (tipo === "error") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonColor: '#ff4757',
        });
    }
}

// Aplica un cupón de descuento al carrito
function aplicarCupon() {
    const codigoCupon = document.getElementById('codigoCupon').value;
    carrito.aplicarCupon(codigoCupon);
}

// Actualiza la cantidad de productos que muestra el carrito flotante
function actualizarCarritoFlotante() {
    const cantidadCarrito = document.getElementById('cantidadCarrito');
    cantidadCarrito.textContent = carrito.items.reduce((total, item) => total + item.cantidad, 0);
}

// Muestra u oculta el carrito al hacer clic en el ícono flotante
document.getElementById('carritoFlotante').addEventListener('click', () => {
    const carritoElement = document.getElementById('carrito');
    carritoElement.classList.toggle('visible');
});

// Inicializa la carga de productos y la configuración inicial al cargar la página
window.onload = () => {
    cargarProductos();
    carrito.actualizarCarrito();
    const carritoElement = document.getElementById('carrito');
    carritoElement.classList.remove('visible');
};

// Configura el botón de modo oscuro y su funcionamiento
const modeToggle = document.getElementById('modeToggle');
const body = document.body;
const icon = modeToggle.querySelector('i');

modeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('darkMode', 'disabled');
  }
});

const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
  body.classList.add('dark-mode');
  icon.classList.remove('fa-sun');
  icon.classList.add('fa-moon');
}

// Configura la visibilidad del formulario del cupón al hacer clic en el botón
document.getElementById('aplicarCuponBtn').addEventListener('click', () => {
    document.getElementById('cuponForm').style.display = 'block';
});

// configura la acción de realizar el pedido al hacer clic en el botón
document.getElementById('realizarPedidoBtn').addEventListener('click', () => carrito.realizarPedido());

// Configura la acción del filtrar productos al ingresar en el buscador
document.getElementById('buscador').addEventListener('input', filtrarPorBusqueda);
