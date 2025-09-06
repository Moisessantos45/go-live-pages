
# Changelog

Todas las actualizaciones importantes de la extensión **go-live-server** se documentan aquí siguiendo el formato [Keep a Changelog](http://keepachangelog.com/).

## [1.0.0] - 2025-08-30
### Añadido
- Versión inicial de Go Live Server para VS Code.
- Servidor web embebido en Go, multiplataforma (Linux, macOS, Windows).
- Renderizado de páginas y navegación tipo SPA (sin recarga completa), similar a Vite.js.
- Sistema de cache en memoria RAM para archivos HTML y templates, con fallback inteligente y actualización automática.
- Hot-reload instantáneo mediante file watcher (`fsnotify`).
- Comunicación en tiempo real con WebSockets.
- Estructura automática de carpetas (`views`, `style`, `images`, `js`).
- Comandos:
	- `Go Live Server: Initialize Project` (`go-live-server.init`)
	- `Go Live Server: Stop Server` (`go-live-server.stop`)
- Soporte para View Transitions API: si el navegador lo permite, la navegación entre páginas utiliza animaciones visuales modernas para una experiencia más fluida.

### Mejorado
- Experiencia de desarrollo ágil y moderna, sin necesidad de recargar la página ni reiniciar el servidor.
- Escalabilidad y rendimiento optimizados para múltiples usuarios concurrentes.

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

---