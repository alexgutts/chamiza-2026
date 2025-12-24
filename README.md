# Chamiza 2026 - Reunion Familiar

Landing page y plataforma de gestion para la reunion familiar Chamiza 2026 en Hacienda San Pedro Palomeque, Merida, Yucatan.

## Configuracions

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raiz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# OpenAI
OPENAI_API_KEY=tu_openai_api_key
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script `supabase-schema.sql` en el SQL Editor
3. Crea un bucket de storage llamado `gallery` con acceso publico
4. Copia la URL y anon key a tu `.env.local`

### 3. Configurar Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Habilita la API de Maps JavaScript y Places
3. Crea una API key y restringela a tu dominio
4. Copia la API key a tu `.env.local`

### 4. Configurar OpenAI (Opcional)

1. Obtiene una API key de [OpenAI](https://platform.openai.com)
2. Copia la API key a tu `.env.local`

### 5. Agregar Imagenes

Coloca las fotos de la hacienda en `/public/images/` con los nombres:
- `hacienda-1.jpg` a `hacienda-8.jpg`

O sube las imagenes a Supabase Storage y actualiza las URLs.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en http://localhost:3000
```

## Despliegue en Vercel

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Agrega las variables de entorno en la configuracion del proyecto
3. Despliega

## Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Base de datos**: Supabase (PostgreSQL)
- **Almacenamiento**: Supabase Storage
- **Mapas**: Google Maps JavaScript API
- **IA**: OpenAI GPT-4
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Despliegue**: Vercel

## Caracteristicas

- Landing page con countdown
- Galeria de fotos con lightbox
- Recomendaciones de hospedaje
- Organizador de planes y actividades
- Mapa interactivo con lugares de interes
- Asistente de IA para planificacion de viaje
- Diseno mobile-first con animaciones fluidas
- Sin autenticacion - cualquiera puede publicar

## Estructura de Paginas

- `/` - Landing page con informacion del evento
- `/galeria` - Galeria de fotos del lugar
- `/hospedaje` - Recomendaciones de hoteles y Airbnbs
- `/planes` - Actividades organizadas por la familia
- `/mapa` - Mapa interactivo con ubicaciones

## Evento

- **Fecha**: 21 de Febrero, 2026
- **Lugar**: Hacienda San Pedro Palomeque
- **Direccion**: Anillo Periferico Sur KM 4.5, Merida Yucatan
- **Misa**: 11:00 AM
- **Comida**: 2:00 PM
- **Costo**: $1,000 MXN por persona
