# 🚀 Flight Finder - Despliegue en Google Cloud Run

## 📋 Archivos Esenciales

Solo necesitas 3 archivos para desplegar:

```
Dockerfile.nginx    - Construye la imagen Docker
nginx.conf          - Configuración del servidor web
.dockerignore       - Archivos a excluir en la imagen
```

---

## ⚙️ CONFIGURACIÓN (Ejecuta Primero)

```bash
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"
$REGION = "us-central1"
```

**Tu PROJECT_ID:** `project-5393a920-0d34-49b0-b3c`  
**Tu REGIÓN:** `us-central1`

---

## 🔄 ACTUALIZAR DESPUÉS DE CAMBIOS (LO MÁS COMÚN)

### Opción Rápida (UNA línea - RECOMENDADO):

```bash
# Para DESARROLLO
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"; docker build --build-arg ENVIRONMENT=development -t gcr.io/$PROJECT_ID/flight-finder:dev-latest -f Dockerfile.nginx . ; docker push gcr.io/$PROJECT_ID/flight-finder:dev-latest ; gcloud run deploy flight-finder-dev --image gcr.io/$PROJECT_ID/flight-finder:dev-latest --region us-central1

# Para QA
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"; docker build --build-arg ENVIRONMENT=qa -t gcr.io/$PROJECT_ID/flight-finder:qa-latest -f Dockerfile.nginx . ; docker push gcr.io/$PROJECT_ID/flight-finder:qa-latest ; gcloud run deploy flight-finder-qa --image gcr.io/$PROJECT_ID/flight-finder:qa-latest --region us-central1

# Para MAIN
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"; docker build --build-arg ENVIRONMENT=main -t gcr.io/$PROJECT_ID/flight-finder:main-latest -f Dockerfile.nginx . ; docker push gcr.io/$PROJECT_ID/flight-finder:main-latest ; gcloud run deploy flight-finder-main --image gcr.io/$PROJECT_ID/flight-finder:main-latest --region us-central1
```

### Opción Paso a Paso:

```bash
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"

# Paso 1: Construir (cambia 'development' a 'qa' o 'main')
docker build --build-arg ENVIRONMENT=development -t gcr.io/$PROJECT_ID/flight-finder:dev-latest -f Dockerfile.nginx .

# Paso 2: Subir a Google Container Registry
docker push gcr.io/$PROJECT_ID/flight-finder:dev-latest

# Paso 3: Desplegar en Cloud Run
gcloud run deploy flight-finder-dev --image gcr.io/$PROJECT_ID/flight-finder:dev-latest --region us-central1
```

---

## 🛑 DETENER/ELIMINAR SERVICIOS

### Opción 1: Eliminar Solo el Servicio (Mantiene las imágenes)

```bash
# DEV
gcloud run services delete flight-finder-dev --region us-central1 --quiet

# QA
gcloud run services delete flight-finder-qa --region us-central1 --quiet

# MAIN
gcloud run services delete flight-finder-main --region us-central1 --quiet
```

### Opción 2: Eliminar Solo las Imágenes (Mantiene los servicios)

```bash
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"

# DEV
gcloud container images delete gcr.io/$PROJECT_ID/flight-finder:dev-latest --quiet

# QA
gcloud container images delete gcr.io/$PROJECT_ID/flight-finder:qa-latest --quiet

# MAIN
gcloud container images delete gcr.io/$PROJECT_ID/flight-finder:main-latest --quiet
```

### Opción 3: Limpiar TODO (Servicios + Imágenes)

```bash
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"

# Eliminar todos los servicios
gcloud run services delete flight-finder-dev flight-finder-qa flight-finder-main --region us-central1 --quiet

# Eliminar todas las imágenes
gcloud container images delete gcr.io/$PROJECT_ID/flight-finder:dev-latest gcr.io/$PROJECT_ID/flight-finder:qa-latest gcr.io/$PROJECT_ID/flight-finder:main-latest --quiet
```

---

## 📊 VER ESTADO Y LOGS

### Ver Estado

```bash
# Ver todos los servicios desplegados
gcloud run services list

# Ver detalles de un servicio específico
gcloud run services describe flight-finder-dev --region us-central1

# Ver URLs de acceso
gcloud run services describe flight-finder-dev --region us-central1 --format='value(status.url)'
gcloud run services describe flight-finder-qa --region us-central1 --format='value(status.url)'
gcloud run services describe flight-finder-main --region us-central1 --format='value(status.url)'
```

### Ver Logs

```bash
# Ver logs de DEV (últimos 50)
gcloud run services logs read flight-finder-dev --limit 50

# Ver logs de QA (últimos 50)
gcloud run services logs read flight-finder-qa --limit 50

# Ver logs de MAIN (últimos 50)
gcloud run services logs read flight-finder-main --limit 50

# Ver logs en tiempo real
gcloud run services logs read flight-finder-dev --limit 50 --follow
```

---

## 🌐 TUS APLICACIONES EN VIVO

```
DEV:  https://flight-finder-dev-183022784926.us-central1.run.app
QA:   https://flight-finder-qa-183022784926.us-central1.run.app
MAIN: https://flight-finder-main-183022784926.us-central1.run.app
```

---

## 📝 DESPLIEGUE INICIAL (PRIMERA VEZ)

Si necesitas volver a hacer el despliegue inicial desde cero:

### Paso 1: Construir Imágenes

```bash
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"

# DESARROLLO
docker build --build-arg ENVIRONMENT=development -t gcr.io/$PROJECT_ID/flight-finder:dev-latest -f Dockerfile.nginx .

# QA
docker build --build-arg ENVIRONMENT=qa -t gcr.io/$PROJECT_ID/flight-finder:qa-latest -f Dockerfile.nginx .

# MAIN
docker build --build-arg ENVIRONMENT=main -t gcr.io/$PROJECT_ID/flight-finder:main-latest -f Dockerfile.nginx .
```

### Paso 2: Subir a Google Container Registry

```bash
# DESARROLLO
docker push gcr.io/$PROJECT_ID/flight-finder:dev-latest

# QA
docker push gcr.io/$PROJECT_ID/flight-finder:qa-latest

# MAIN
docker push gcr.io/$PROJECT_ID/flight-finder:main-latest
```

### Paso 3: Desplegar en Cloud Run

```bash
$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"

# DESARROLLO
gcloud run deploy flight-finder-dev \
  --image gcr.io/$PROJECT_ID/flight-finder:dev-latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1

# QA
gcloud run deploy flight-finder-qa \
  --image gcr.io/$PROJECT_ID/flight-finder:qa-latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10

# MAIN
gcloud run deploy flight-finder-main \
  --image gcr.io/$PROJECT_ID/flight-finder:main-latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10
```

---

## 🍎 RESUMEN RÁPIDO

| Acción | Comando |
|--------|---------|
| **Actualizar DEV** | `$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"; docker build --build-arg ENVIRONMENT=development -t gcr.io/$PROJECT_ID/flight-finder:dev-latest -f Dockerfile.nginx . ; docker push gcr.io/$PROJECT_ID/flight-finder:dev-latest ; gcloud run deploy flight-finder-dev --image gcr.io/$PROJECT_ID/flight-finder:dev-latest --region us-central1` |
| **Ver Estado** | `gcloud run services list` |
| **Ver Logs** | `gcloud run services logs read flight-finder-dev --limit 50` |
| **Detener DEV** | `gcloud run services delete flight-finder-dev --region us-central1 --quiet` |

---

**Nota:** Si cambias de máquina, siempre comienza con: `$PROJECT_ID = "project-5393a920-0d34-49b0-b3c"`

