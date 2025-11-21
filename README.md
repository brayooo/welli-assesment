# Evaluación Técnica - Welli

Esta es una aplicación Next.js construida para la evaluación técnica de Welli. Cuenta con un formulario de registro de leads con pruebas A/B para la entrada de ubicación (Manual vs. Mapbox) y un panel para ver los leads registrados.

## Tecnologías

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS, Shadcn/UI
- **Base de Datos**: Supabase (PostgreSQL)
- **Mapas**: Mapbox GL JS
- **Formularios**: React Hook Form, Zod

---

## Fase 1: Desarrollo Full-Stack y Prueba A/B

Esta sección cubre la configuración local, el despliegue y la estructura básica de la aplicación.

### Requisitos Previos

- Node.js 18+
- npm o yarn

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd technical-assesment-welli
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env.local` en el directorio raíz y agrega lo siguiente:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_TOKEN=tu_mapbox_token
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Rutas de la Aplicación

La aplicación cuenta con las siguientes rutas principales:

- **/form**: Ruta donde se encuentra el formulario de creación de leads. Aquí los usuarios pueden registrar su información.
- **/users**: Ruta donde se visualiza la lista de usuarios/leads almacenados en la base de datos.

### Base de Datos (Supabase)

El proyecto utiliza **Supabase (PostgreSQL)** como capa principal de persistencia.

> **Nota**: No se utilizó una base de datos local debido a la configuración de triggers requerida para la Fase 2, la cual depende de un entorno de base de datos alojado y accesible para la automatización.

### Comportamiento del Test A/B

La aplicación implementa un test A/B para el formulario de ubicación. La variante asignada (A o B) se almacena en el `localStorage` del navegador para mantener la consistencia entre recargas.

**Para cambiar de variante o resetear el test:**

1. Abre las herramientas de desarrollador del navegador (F12 o Clic derecho -> Inspeccionar).
2. Ve a la pestaña **Application** (Aplicación) -> **Local Storage**.
3. Selecciona el dominio (ej. `http://localhost:3000`).
4. Elimina la clave `ab_variant`.
   - Alternativamente, ejecuta `localStorage.removeItem('ab_variant')` en la consola.
5. Recarga la página para que se asigne una nueva variante aleatoria.

### Despliegue

Despliegue: [welli-assesment.vercel.app](https://welli-assesment.vercel.app/)

---

## Fase 2: Automatización de Datos (Lógica de Negocio)

Esta sección describe el flujo de automatización implementado para la segmentación de leads.

### Flujo de Automatización

1. **Inserción en Base de Datos**: Cuando un nuevo lead completa el formulario en `/form`, los datos se insertan en la tabla de Supabase.
2. **Ejecución del Trigger**: Una función trigger de Postgres se ejecuta automáticamente tras la inserción.

   ![Diagrama del trigger de Postgres](public\webhook-db.png)

3. **Notificación a n8n**: El trigger notifica a un webhook de n8n para iniciar el proceso de segmentación.
4. **Procesamiento en n8n**: n8n recibe los datos, procesa la información y realiza la segmentación del lead (ej. asignando un segmento basado en el ticket promedio o ubicación).

   ![Flujo de trabajo de n8n](public\n8n_nodes.png)

> **Importante**: Las credenciales para acceder a la instancia de n8n se adjuntan en el correo electrónico enviado con el proyecto, por lo que no se incluyen en este repositorio.

---

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta ESLint para verificar la calidad del código.
