
# Morf.ar (Proyecto Final JavaScript)

## Descripción

**Morf.ar** es una aplicación web interactiva que simula un entorno de compras en línea. Permite a los usuarios explorar diferentes categorías de productos, agregar items al carrito, aplicar cupones de descuento y finalizar su compra. Desarrollada con HTML, CSS, y JavaScript, la aplicación destaca por su interfaz dinámica y su capacidad para proporcionar una experiencia de usuario coherente y atractiva.

## Funcionalidades

- **Navegación por Categorías**: Explora productos organizados en categorías como Comidas, Bebidas, Postres, y Cafetería, con iconos representativos y botones de fácil acceso.
- **Búsqueda de Productos**: Filtra productos por nombre con un buscador interactivo que actualiza la vista de productos en tiempo real.
- **Carrito de Compras**: Añade productos al carrito con la cantidad deseada, revisa los items seleccionados y gestiona los productos en tiempo real.
- **Aplicación de Cupones**: Introduce códigos de cupones de 6 dígitos para obtener un descuento del 5% en el total del carrito.
- **Modo Oscuro**: Alterna entre modo claro y oscuro con un botón dedicado, mejorando la accesibilidad y personalización de la interfaz.
- **Notificaciones Dinámicas**: Muestra mensajes de confirmación, errores y alertas utilizando las librerías `SweetAlert2` y `Toastify`, brindando una experiencia visualmente atractiva.
- **Guardar y Recuperar Carrito**: Utiliza `localStorage` para guardar el estado del carrito, permitiendo a los usuarios continuar donde lo dejaron, incluso después de cerrar la página.

## Estructura del Proyecto

El proyecto incluye los siguientes archivos clave:

- `index.html`: Estructura principal de la aplicación, que contiene la disposición del menú, el carrito y los elementos interactivos.
- `styles.css`: Archivo de estilos que define la apariencia del sitio, incluyendo el diseño adaptable, colores, fuentes y efectos de transición.
- `main.js`: Lógica principal del simulador, gestionando la carga de productos, operaciones del carrito, manejo de cupones, validaciones y control de eventos.
- `productos.json`: Archivo JSON que contiene los datos de los productos, cargados de manera asíncrona mediante `fetch`.

## Instalación y Ejecución

1. Clona este repositorio:
   ```bash
   git clone https://github.com/GimeSozzi/ProyectoFinal_JavaScript_SozziGimena.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd ProyectoFinal_JavaScript_SozziGimena
   ```

3. Abre el archivo `index.html` en tu navegador preferido:
   - En Windows: `start index.html`
   - En Mac: `open index.html`
   - En Linux: `xdg-open index.html`

## Cómo Usar Morf.ar

1. **Explora Productos**: Navega por las diferentes categorías o usa el buscador para encontrar tu comida favorita.
2. **Agrega al Carrito**: Selecciona la cantidad deseada y presiona "Agregar al Carrito". Los productos aparecerán listados en el carrito flotante.
3. **Gestiona tu Carrito**: Revisa los productos en tu carrito, elimina items si es necesario y verifica el total actualizado.
4. **Aplica Descuentos**: Ingresa un código de 6 números para aplicar un descuento del 5% en tu compra.
5. **Finaliza tu Pedido**: Haz clic en "Realizar Pedido" para confirmar tu compra. El carrito se vaciará y los datos se guardarán en `localStorage` para futuras compras.

## Mejoras y Características Avanzadas

- **Validación Avanzada**: Asegura que las cantidades ingresadas sean válidas y proporciona mensajes claros en caso de errores.
- **Manejo de Errores Robusto**: Gestiona problemas comunes como la falta de espacio en `localStorage` con notificaciones informativas.
- **Interfaz Dinámica y Atractiva**: Con transiciones suaves, efectos de hover y un diseño adaptable, la interfaz se adapta a todos los dispositivos.
- **Modo Oscuro**: Mejora la experiencia visual con la opción de alternar entre modos de luz y oscuridad.
- **Documentación Completa**: El código está cuidadosamente documentado para facilitar su comprensión, mantenimiento y futuras expansiones.

## Tecnologías Utilizadas

- **HTML5**: Para la estructura de la aplicación.
- **CSS3**: Para el diseño y la estética responsiva.
- **JavaScript (ES6+)**: Para la lógica de negocio y la interacción dinámica.
- **AJAX y Fetch API**: Para la carga de datos desde un archivo JSON local.
- **SweetAlert2 y Toastify**: Librerías utilizadas para mejorar la comunicación con el usuario mediante notificaciones visuales.

