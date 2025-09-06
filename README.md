
# Go Live Pages

Go Live Pages es una extensión avanzada para Visual Studio Code que te permite crear un servidor web local ultra eficiente usando Go. Inspirado en Live Server, pero con mejoras clave: renderizado de páginas sin recarga completa (SPA-like), navegación instantánea tipo Vite.js, y comunicación en tiempo real gracias a WebSockets y templates de Go.

---

## Características principales

- **Navegación sin recarga**: Cambia de página y actualiza la URL y el contenido dinámicamente, sin recargar todo el sitio, similar a Vite.js.
- **Transiciones visuales modernas**: Si tu navegador soporta la View Transitions API, la navegación entre páginas utiliza animaciones suaves y profesionales para mejorar la experiencia visual.
- **Renderizado eficiente**: Utiliza los templates de Go para renderizar páginas de manera rápida y flexible.
- **WebSockets integrados**: Comunicación en tiempo real entre cliente y servidor para recarga instantánea, mensajes o sincronización.
- **Estructura automática**: Al iniciar, crea carpetas `views`, `style`, `images`, `js` para organizar tu proyecto.
- **Compatible multiplataforma**: Incluye binarios para Linux, macOS y Windows.

## Requisitos

No necesitas instalar nada extra. Todo lo necesario viene incluido en la extensión.

## Comandos disponibles

Puedes acceder a estos comandos desde la paleta de comandos de VS Code:

- `Go Live Pages: Initialize Project` (`go-live-pages.init`):
	- Inicia el servidor Go, crea la estructura de carpetas y habilita la navegación dinámica.
- `Go Live Pages: Stop Server` (`go-live-pages.stop`):
	- Detiene el servidor si está en ejecución.

## Ejemplo de uso

1. Abre tu proyecto en VS Code.
2. Ejecuta el comando `Go Live Pages: Initialize Project` desde la paleta de comandos (Ctrl+Shift+P).
3. Accede a `http://localhost:dinamico` en tu navegador.
4. Navega entre páginas sin recargar, edita archivos y observa los cambios reflejados al instante.

## ¿Por qué es diferente?

- No solo sirve archivos estáticos: renderiza y actualiza contenido dinámicamente.
- Experiencia SPA (Single Page Application) sin frameworks pesados.
- Basado en la eficiencia y concurrencia de Go.

## Optimización avanzada: cache y rendimiento

### 1. Rendimiento superior ⚡
- **Sin caché**: Cada solicitud de página implica leer el archivo HTML desde disco, lo que puede generar demoras perceptibles, especialmente en proyectos grandes o con tráfico alto.
- **Con caché**: Los archivos HTML y plantillas se almacenan en memoria RAM, eliminando la latencia de acceso a disco y permitiendo respuestas prácticamente instantáneas.

### 2. Latencia ultra baja 🚀
- Acceder a la RAM es miles de veces más rápido que al disco duro, lo que se traduce en una experiencia de usuario mucho más fluida y profesional.
- Ideal para entornos de desarrollo colaborativo y para producción con alta concurrencia.

### 3. Caché inteligente y siempre actualizado 🔄
- El sistema detecta automáticamente si un archivo no está en caché (nuevo o modificado) y lo carga al vuelo, asegurando que siempre se sirva la versión más reciente.
- No necesitas reiniciar el servidor ni preocuparte por inconsistencias: el contenido siempre está sincronizado.

### 4. Sincronización eficiente y segura 🔒
- Gracias a `sync.RWMutex`, múltiples usuarios pueden leer del caché simultáneamente sin bloqueos, y solo se bloquea para escrituras, maximizando el rendimiento y la seguridad de los datos.

### 5. Hot-reload automático y transparente 🔄
- Un file watcher (`fsnotify`) monitoriza los archivos y actualiza el caché en tiempo real ante cualquier cambio, permitiendo un flujo de trabajo ágil y sin interrupciones.

### Beneficios clave
- **Desarrollo**: Cambios reflejados al instante, sin recargar ni reiniciar, ideal para iterar rápido.
- **Producción**: Páginas servidas a máxima velocidad, incluso bajo alta demanda.
- **Escalabilidad**: Soporta muchos usuarios concurrentes sin degradar el rendimiento, gracias a la gestión eficiente de recursos.

En resumen, Go Live Server no solo acelera tu flujo de trabajo, sino que también garantiza una experiencia moderna y escalable tanto para desarrolladores como para usuarios finales.

## Problemas conocidos

- El servidor solo sirve archivos estáticos y templates Go.
- Si el puerto 8080 está ocupado, el servidor buscara otros puertos disponibles.
- Algunas funciones avanzadas pueden requerir permisos de red.

## Notas de la versión

### 0.0.1
- Versión inicial: servidor Go embebido, comandos básicos, navegación dinámica y estructura de carpetas.

## [1.0.1] - 2025-09-05
### Corregido
- Se solucionó un bug crítico relacionado con el manejo de rutas en Windows.

### Ventaja
- Actualización segura: no se realizaron cambios en la API, por lo que no afecta la compatibilidad ni el uso actual de la extensión.

## [1.1.0] - 2025-09-06
### Nuevas funciones en WebSocket
- Manejo de mensajes `reload-css`: para recarga de CSS
- Manejo de mensajes `reload-js`: para recarga de JavaScript
- Manejo de mensajes `reload-img`: para recarga de imágenes

### Nuevas funciones JavaScript
- `reloadCSS(cssFile)`: Recarga CSS sin refrescar la página
- `reloadJavaScript(jsFile)`: Maneja recarga de JS
- `reloadImage(imgFile)`: Recarga imágenes y background-images
- `reloadCSSinImages(imgFile)`: Función auxiliar para imágenes en CSS

## Autor y contacto

- GitHub: [Moisessantos45](https://github.com/Moisessantos45)
- Email: moises.santos.hernandez@proton.me

## Repositorio oficial

Encuentra el código fuente y más información en el repositorio:
[https://github.com/Moisessantos45/go-live-pages](https://github.com/Moisessantos45/go-live-pages)

## Más información

- [Documentación de extensiones VS Code](https://code.visualstudio.com/api)

**¡Disfruta desarrollando con Go Live Pages y lleva tu flujo de trabajo al siguiente nivel!**
