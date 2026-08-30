# gym-frontend

Frontend simple en HTML, CSS y JavaScript plano (sin frameworks ni build tools) para
el sistema de gimnasio. Consume **únicamente** el API Gateway.

## Contenido

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Estructura de la página y los 4 formularios/tablas |
| `styles.css` | Estilos |
| `app.js` | Llamadas `fetch` al gateway y lógica de las pestañas |

## Secciones

- **Miembros**: listar y registrar (`nombre`, `email`, `fechaInscripcion`)
- **Clases**: listar y programar (`nombre`, `horario`, `capacidadMaxima`, `entrenadorId` elegido de un desplegable)
- **Entrenadores**: listar y agregar (`nombre`, `especialidad`)
- **Equipos**: listar y agregar (`nombre`, `descripcion`, `cantidad`)

## API

Por defecto el frontend llama a `http://localhost:8080/api/gimnasio` (el gateway).
Se puede sobrescribir con el parámetro de consulta `?api=` o con `window.API_BASE`.

## Ejecución local

Servir los archivos estáticos en el puerto `3000`. Por ejemplo:

```bash
python -m http.server 3000
```

Y abrir `http://localhost:3000`.

En Docker el frontend se sirve con nginx (ver `Dockerfile` y el `docker-compose.yml`
de la raíz del proyecto).
