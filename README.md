# Mockit

> Acelera el desarrollo frontend generando APIs REST mock completamente funcionales bajo demanda.

Genera APIs mock listas para producción a partir de plantillas JSON en segundos, permitiendo que equipos de frontend y backend trabajen en paralelo sin esperar a que el backend esté listo.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Cómo Funciona](#cómo-funciona)
- [Stack de Tecnologías](#stack-de-tecnologías)
- [Inicio Rápido](#inicio-rápido)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Uso de la API](#uso-de-la-api)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Descripción General

**Mockit** es una plataforma web diseñada para eliminar la dependencia entre equipos de desarrollo frontend y backend. En lugar de esperar a que las APIs del backend estén listas, los desarrolladores frontend pueden pegar una plantilla JSON y recibir instantáneamente una API REST completamente funcional.

### Problema Resuelto

- **Frontend bloqueado**: Los equipos no pueden comenzar a construir hasta que las APIs del backend estén listas
- **Sobrecarga en backend**: Los arquitectos dedican tiempo a construir infraestructura mockup
- **Realismo de datos**: Los datos mock suelen ser poco realistas o genéricos

### Solución

Mockit interpreta plantillas JSON definidas por el usuario, genera de forma inteligente datos mock realistas, y sirve APIs REST dinámicas con soporte completo de CRUD, persistencia de datos y limpieza automática después de 30 días.

---

## Características Principales

- **Generación Instantánea de APIs**: Pega JSON → Obtén una API funcional en segundos
- **Generación Inteligente de Datos**: Interpreta descripciones como "precio entre 0 y 999.99" o "categoría de videojuegos" y genera datos realistas
- **Operaciones CRUD Completas**: Endpoints GET, POST, PUT, PATCH, DELETE
- **Capacidades de Consulta**:
  - Filtrado mediante parámetros de consulta
  - Soporte de paginación
  - Ordenamiento por campo
- **Persistencia de Datos**: APIs almacenadas en base de datos, accesibles entre sesiones del navegador
- **Limpieza Automática**: Las APIs expiran después de 30 días
- **Múltiples Dominios**: Funciona con cualquier tipo de entidad (productos, usuarios, pedidos, vehículos, etc.)
- **Instancias Independientes**: Cada API está completamente aislada
- **100% Gratuito**: Sin backend requerido, sin API keys, sin registro

---

## Cómo Funciona

### 1. Entrada del Usuario

El usuario define una plantilla JSON con:

- **Datos estructurados**: `{ "id": 1, "name": "Product A" }`
- **Patrones descriptivos**: `{ "price": "número entre 10 y 500" }`
- **Pistas contextuales**: `{ "category": "de videojuegos" }`

### 2. Análisis Inteligente

- Detecta rangos numéricos: `"entre X e Y"` → genera número aleatorio
- Reconoce tipos de datos: `"email"`, `"date"`, `"phone"` → genera valores apropiados
- Extrae contexto: `"de $category"` → genera valores específicos del dominio
- Fallback: Patrones desconocidos → genera datos genéricos realistas

### 3. Creación Dinámica de API

- Genera URL única: `https://mockit.dev/api/{id-único}`
- Crea rutas Express para operaciones CRUD
- Almacena configuración en base de datos
- Devuelve URL de la API al usuario

### 4. Simulación de Datos

- **GET** `/api/{id}` → Devuelve datos mock paginados/filtrados
- **POST** → Añade nueva entrada al conjunto de datos mock
- **PUT/PATCH** → Actualiza registro mock existente
- **DELETE** → Eliminan registro mock
- Los cambios persisten dentro del ciclo de vida de 30 días

---

## Stack de Tecnologías

### Frontend

- **React 19** con React Compiler (sin necesidad de useMemo/useCallback)
- **Vite** para build rápido y HMR
- **Tailwind CSS 4** para estilos
- **TypeScript** para seguridad de tipos

### Backend

- **Node.js** con **Express 5.x**
- **Hexagonal Architecture** (Ports & Adapters)
- **TypeScript** en modo strict
- **Zod 4** para validación en tiempo de ejecución
- **Base de datos**: PostgreSQL / MongoDB (plan gratuito)
- **Task Scheduler**: Expiración automática a los 30 días

### Gestor de Paquetes

- **pnpm** para monorepo + eficiencia de archivos de bloqueo

---

## Inicio Rápido

### Requisitos Previos

- Node.js ≥ 18.x
- pnpm ≥ 8.x
- Git

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/usuario/mockit.git
cd mockit

# Instala dependencias
pnpm install

# Configura el ambiente
cp mockit-api/example.env mockit-api/.env
# Edita .env con las credenciales de la base de datos
```

### Desarrollo

```bash
# Backend: Inicia el servidor de desarrollo (hot-reload en puerto 3000)
cd mockit-api
pnpm dev

# Frontend: Inicia el servidor Vite (en puerto 5173)
cd mockit-app
pnpm dev

# Visita http://localhost:5173
```

### Build para Producción

```bash
# Backend
cd mockit-api
pnpm build
pnpm start

# Frontend
cd mockit-app
pnpm build
# Despliega la carpeta dist/ en un servidor estático
```

---

## Estructura del Proyecto

```
mockit/
├── mockit-api/                  # Backend (Node.js + Express)
│   ├── AGENTS.md                # Reglas de agentes IA para backend
│   ├── app.ts                   # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── domain/              # Lógica de negocio (agnóstico de framework)
│       │   ├── entities/        # Modelos de dominio (Usuario, API, MockData)
│       │   └── interfaces/      # Definiciones de puertos
│       ├── application/         # Orquestación
│       │   ├── use-cases/       # Operaciones de negocio
│       │   ├── dtos/            # Contratos de datos
│       │   └── mappers/         # Transformaciones de entidades
│       └── infrastructure/      # Específico de framework
│           ├── api/             # Configuración Express
│           ├── controllers/     # Manejadores HTTP
│           ├── repositories/    # Acceso a base de datos
│           └── routes/          # Rutas de la API
│
├── mockit-app/                  # Frontend (React + Vite)
│   ├── AGENTS.md                # Reglas de agentes IA para frontend
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/          # Componentes React (diseño atómico)
│       ├── hooks/               # Hooks personalizados de React
│       ├── pages/               # Componentes de página
│       ├── api/                 # Lógica del cliente API
│       ├── types/               # Tipos compartidos
│       ├── utils/               # Funciones auxiliares
│       ├── App.tsx
│       └── main.tsx
│
├── .github/skills/              # Librería de skills para agentes IA
│   ├── typescript/              # Patrones TypeScript
│   ├── react-19/                # Directrices React 19
│   ├── tailwind-4/              # Patrones Tailwind CSS
│   ├── zod-4/                   # Patrones de validación Zod
│   ├── hexagonal-architecture/  # Guía de arquitectura de backend
│   └── ...
│
├── AGENTS.md                    # Orquestación de agentes a nivel de proyecto
└── README.md                    # Este archivo
```

---

## Arquitectura

### Backend: Hexagonal (Ports & Adapters)

```
JSON de Entrada del Usuario
      ↓
Parser & Validador (Zod)
      ↓
Capa de Dominio
  - GenerateMockDataUseCase
  - CreateAPIUseCase
  - ValidateJSONTemplateUseCase
      ↓
Capa de Aplicación
  - DTOs para entrada/salida
  - Transformaciones de mapeo
      ↓
Capa de Infraestructura
  - Controladores Express
  - Creación dinámica de rutas
  - Repositorios de base de datos
      ↓
Base de Datos (PostgreSQL/MongoDB)
```

**Principios de Diseño Clave**:

- La lógica de dominio es **agnóstica de framework**
- Las dependencias se **inyectan** mediante interfaces
- **Sin código de framework** en la capa de dominio
- Cada capa tiene **una sola responsabilidad**

### Frontend: React 19 + Compiler

```
Interfaz de Usuario
  - Área de entrada JSON
  - Panel de configuración
  - Pantalla de URL de la API
      ↓
Componentes React (Atómicos)
  - Componente JSONInput
  - Componente APIConfigure
  - Pantalla APIResult
      ↓
Cliente Fetch API (Tipado)
      ↓
API de Backend
```

**Patrones Clave**:

- Sin memoización manual (React Compiler lo maneja)
- Props siempre tipados con interfaces
- Gestión de estado mediante hooks
- Tailwind CSS para estilos (sin archivos CSS)

---

## Uso de la API

### Generar API Mock

**Solicitud**:

```bash
curl -X POST http://localhost:3000/api/mock-apis \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "id": "número",
      "name": "string entre 5 y 20 caracteres",
      "price": "número entre 10 y 999.99",
      "category": "de videojuegos"
    },
    "count": 10,
    "methods": ["GET", "POST", "PUT", "DELETE"]
  }'
```

**Respuesta**:

```json
{
  "id": "abc123xyz",
  "url": "https://mockit.dev/api/abc123xyz",
  "expiresAt": "2026-04-24T10:30:00Z",
  "documentation": {
    "baseURL": "https://mockit.dev/api/abc123xyz",
    "endpoints": [
      "GET /items",
      "POST /items",
      "GET /items/:id",
      "PUT /items/:id",
      "DELETE /items/:id"
    ]
  }
}
```

### Usar API Generada

```bash
# Obtén todos los elementos
curl https://mockit.dev/api/abc123xyz/items

# Obtén con paginación y filtro
curl 'https://mockit.dev/api/abc123xyz/items?page=1&limit=10&category=RPG'

# Crear elemento
curl -X POST https://mockit.dev/api/abc123xyz/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Nuevo Producto", "price": 49.99}'

# Actualizar elemento
curl -X PUT https://mockit.dev/api/abc123xyz/items/1 \
  -d '{"price": 39.99}'

# Eliminar elemento
curl -X DELETE https://mockit.dev/api/abc123xyz/items/1
```

---

## Directrices de Desarrollo

### Calidad de Código

- **Seguridad de Tipos**: `strict: true` en tsconfig
- **Sin tipos `any`**: Usa `unknown` o genéricos
- **Validación**: Zod en límites de API
- **Testing**: Tests unitarios para lógica de dominio (por agregar)

### Commits y Ramas

- Ramas de features: `feature/descripción`
- Correcciones: `fix/descripción`
- Todos los commits deben pasar: `tsc --noEmit` + ESLint

### Skills y Agentes

Cada parte del proyecto tiene reglas de agentes en archivos `AGENTS.md`:

- **Raíz**: [AGENTS.md](AGENTS.md) — Orquestación de proyecto
- **Backend**: [mockit-api/AGENTS.md](mockit-api/AGENTS.md) — Patrones de backend
- **Frontend**: [mockit-app/AGENTS.md](mockit-app/AGENTS.md) — Patrones de frontend

Los agentes IA siguen estas reglas para generar código consistente.

---

## Roadmap

### Fase 1: MVP (Actual)

- ✓ Generación de API a partir de plantillas JSON
- ✓ Operaciones CRUD completas
- ✓ Filtrado de consultas y paginación
- ✓ Expiración de 30 días
- Interfaz frontend (en progreso)

### Fase 2: Mejora (Q2 2026)

- [ ] Generación de plantillas asistida por IA ("describe qué necesitas en lenguaje natural")
- [ ] Generación de datos avanzada con relaciones
- [ ] Limitación de velocidad para prevenir abuso
- [ ] Panel de análisis de uso
- [ ] Historial de API y versionado

### Fase 3: Escala (Q3 2026+)

- [ ] Autenticación de usuarios y cuentas
- [ ] APIs privadas/compartidas
- [ ] Planes premium (límites más altos, retención más larga)
- [ ] Generadores de datos personalizados (scripts Lua)
- [ ] Soporte GraphQL

---

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una rama de feature: `git checkout -b feature/mi-feature`
3. Sigue las directrices de calidad de código (ver Directrices de Desarrollo)
4. Commit con mensajes claros: `git commit -m "feat: agregar nueva feature"`
5. Push y abre un Pull Request

### Estilo de Código

- **Backend**: TypeScript strict, arquitectura Hexagonal (ver [mockit-api/AGENTS.md](mockit-api/AGENTS.md))
- **Frontend**: React 19, componentes atómicos, Tailwind (ver [mockit-app/AGENTS.md](mockit-app/AGENTS.md))
- **Todo**: Inglés en código y comentarios, máximo 250 líneas por archivo

---

## Solución de Problemas

### El backend no inicia

```bash
# Verifica variables de entorno
cat mockit-api/.env

# Verifica la conexión a la base de datos
pnpm run test:db

# Reconstruye TypeScript
pnpm run build
```

### Frontend muestra página en blanco

```bash
# Limpia caché de Vite
rm -rf mockit-app/node_modules/.vite

# Reinstala dependencias
cd mockit-app && pnpm install
```

### Errores de tipo en build

```bash
# Ejecuta verificación de tipos
tsc --noEmit

# Verifica tipos faltantes
pnpm run build
```

---

## Variables de Entorno

Crea `mockit-api/.env`:

```
# Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/mockit
# o
DATABASE_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/mockit

# Servidor
PORT=3000
NODE_ENV=development

# Seguridad (agregar después)
API_KEY_SECRET=tu-clave-secreta
```

---

## Rendimiento y Escalabilidad

- **Aislamiento de API**: Cada API generada tiene un espacio de nombres de rutas independiente
- **Indexación de Base de Datos**: APIs mock indexadas por `id`, `expiresAt` para consultas rápidas
- **Paginación Predeterminada**: Endpoints GET pagina por defecto (límite 100 elementos)
- **Memoria**: Carga lazy de conjuntos de datos mock solo cuando se accede
- **Expiración**: Trabajo en segundo plano limpia APIs expiradas diariamente

---

## Consideraciones de Seguridad

- **Validación de Entrada**: Todas las plantillas JSON validadas con Zod
- **Limitación de Velocidad**: Planeado para Fase 2 (prevenir abuso de generación de API)
- **CORS**: Configurado para permitir solicitudes del frontend
- **Sin Autenticación (MVP)**: Planeado para Fase 3 (cuentas de usuario y APIs privadas)
- **Inyección SQL**: Usa consultas parametrizadas mediante ORM

---

## Licencia

ISC — Ver [LICENSE](LICENSE) para detalles.

---

## Soporte y Preguntas

- Abre un [issue](https://github.com/usuario/mockit/issues) en GitHub
- Verifica [CONTRIBUTING.md](CONTRIBUTING.md) para la configuración de desarrollo

---

## Reconocimientos

Construido con:

- [React 19](https://react.dev)
- [Express](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod](https://zod.dev)

---

**Última Actualización**: 25 de Marzo de 2026 | **Estado**: MVP
