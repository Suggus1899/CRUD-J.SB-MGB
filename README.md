# To-Do App — Spring Boot + React + MongoDB

Aplicación full-stack de gestión de tareas con autenticación JWT, roles de usuario y estadísticas.

---

## Tecnologías

### Backend
| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.3 |
| Spring Security + JWT (jjwt) | 0.12.6 |
| MongoDB | 7 |
| Lombok | — |
| Springdoc / Swagger UI | 2.5 |

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| TailwindCSS | 4 |
| Axios | 1.x |
| React Router DOM | 7 |
| React Hot Toast | 2.x |

### Infraestructura
- **Docker** + **Docker Compose** (3 servicios)
- **Nginx** como servidor del frontend en producción

---

## Arquitectura

```
┌─────────────────┐        ┌──────────────────────┐        ┌──────────┐
│   Frontend      │ /api/  │   Backend            │        │  MongoDB │
│   React + TS    │───────▶│   Spring Boot        │───────▶│  mongo:7 │
│   Nginx :80     │        │   :8080              │        │  :27017  │
│   host: :3000   │        │   host: :8080        │        │          │
└─────────────────┘        └──────────────────────┘        └──────────┘
```

- El frontend se construye con Vite y se sirve estáticamente con Nginx.
- Nginx hace proxy reverso de `/api/` al backend Spring Boot dentro de la red Docker.
- El backend expone una REST API con JWT. MongoDB almacena usuarios y tareas.

---

## Funcionalidades

- **Autenticación**: registro, login con JWT. Token almacenado en `localStorage`.
- **Tareas**: CRUD completo con filtros por estado, prioridad y etiquetas. Paginación.
- **Comentarios**: añadir, editar y eliminar comentarios en cada tarea.
- **Historial**: registro automático de cambios de estado y prioridad.
- **Estadísticas**: vista de estadísticas propias o globales (solo ADMIN).
- **Gestión de usuarios**: listado y eliminación de usuarios (solo ADMIN).
- **Roles**: `USER` (acceso a sus tareas) y `ADMIN` (acceso total).

---

## Ejecutar con Docker (recomendado)

### Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

### Pasos

**1. Clonar el repositorio**
```bash
git clone <url-del-repo>
cd "CRUD spring boot more mongodb"
```

**2. Crear el archivo `.env`** en la raíz del proyecto:
```env
MONGO_URI=mongodb://mongo:27017/tododb
MONGO_DB=tododb
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

**3. Levantar todos los servicios**
```bash
docker compose up --build -d
```

### URLs
| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MongoDB | localhost:27017 |

### Comandos útiles
```bash
docker compose ps                  # ver estado de contenedores
docker compose logs -f backend     # logs del backend en tiempo real
docker compose logs -f frontend    # logs del frontend
docker compose down                # parar todos los servicios
docker compose down -v             # parar y eliminar volúmenes (borra datos de MongoDB)
docker compose up --build -d       # reconstruir y levantar (tras cambios de código)
```

---

## Ejecutar en local (desarrollo)

### Requisitos
- Java 17
- Maven 3.9+
- Node.js 20+
- MongoDB corriendo en `localhost:27017`

### Backend
```bash
# Con Maven instalado globalmente
mvn spring-boot:run

# O construir el JAR primero
mvn package -DskipTests
java -jar target/crud-todo-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend de desarrollo estará en **http://localhost:5173** y hace proxy de `/api/` a `localhost:8080`.

---

## Endpoints principales

### Autenticación (públicos)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Login, devuelve JWT |

### Tareas (requieren JWT)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/tasks` | Listar tareas (paginado, filtrable) |
| `POST` | `/api/tasks` | Crear tarea |
| `PUT` | `/api/tasks/{id}` | Actualizar tarea |
| `DELETE` | `/api/tasks/{id}` | Eliminar tarea |
| `GET` | `/api/tasks/{id}/history` | Ver historial de cambios |

### Comentarios (requieren JWT)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/tasks/{id}/comments` | Listar comentarios |
| `POST` | `/api/tasks/{id}/comments` | Añadir comentario |
| `PUT` | `/api/tasks/{taskId}/comments/{commentId}` | Editar comentario |
| `DELETE` | `/api/tasks/{taskId}/comments/{commentId}` | Eliminar comentario |

### Estadísticas (requieren JWT)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/stats/me` | Estadísticas propias |
| `GET` | `/api/stats/global` | Estadísticas globales (solo ADMIN) |

### Usuarios (solo ADMIN)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/users` | Listar usuarios |
| `DELETE` | `/api/users/{id}` | Eliminar usuario |

---

## Estructura del proyecto

```
├── src/main/java/com/example/crud/
│   ├── config/          # SecurityConfig, CORS
│   ├── controller/      # AuthController, TaskController, etc.
│   ├── dto/             # Request/Response DTOs
│   ├── exception/       # ResourceNotFoundException, UnauthorizedException
│   ├── model/           # User, Task, Comment, ChangeRecord
│   ├── repository/      # MongoRepository interfaces
│   ├── security/        # JwtAuthFilter
│   └── service/         # AuthService, TaskService, etc.
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/  # UI components, layout, tasks
│   │   ├── context/     # AuthContext
│   │   ├── lib/         # api.ts (Axios), utils.ts
│   │   ├── pages/       # LoginPage, TasksPage, StatsPage, etc.
│   │   └── types/       # TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
├── Dockerfile           # Backend
├── docker-compose.yml
├── .env                 # Secrets (no subir a git)
└── .gitignore
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/tododb` |
| `MONGO_DB` | Nombre de la base de datos | `tododb` |
| `JWT_SECRET` | Clave secreta para firmar tokens | — |
| `JWT_EXPIRATION` | Expiración del token en ms | `86400000` (24h) |
