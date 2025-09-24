# 🚀 Guía de Despliegue - Ferremas

Esta guía te ayudará a desplegar tanto el **Frontend** como el **Backend** de Ferremas usando servicios en la nube.

## 📋 Resumen de Arquitectura

```
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│                     │       │                     │       │                     │
│    FRONTEND         │◄─────►│     BACKEND         │◄─────►│    BASE DE DATOS    │
│   (React + Vite)    │       │   (Node.js/API)     │       │   (PostgreSQL/      │
│                     │       │                     │       │    MySQL)           │
│   Render.com        │       │   Render.com /      │       │   Render.com /      │
│   (Static Site)     │       │   Railway.app /     │       │   PlanetScale /     │
│                     │       │   Fly.io            │       │   Supabase          │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
```

## 🎯 Opción 1: Todo en Render.com (RECOMENDADO)

### **1. Desplegar el Backend (API)**

1. **Preparar el repositorio del Backend:**
   - Crea un repo separado para tu API en GitHub
   - Asegúrate de tener un `package.json` con script de `start`
   - Configura las variables de entorno

2. **En Render.com:**
   - Crea cuenta en [render.com](https://render.com)
   - Click en "New" → "Web Service"
   - Conecta tu repo del backend
   - Configuración:
     ```
     Name: ferremas-api
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     Plan: Free
     ```

3. **Variables de Entorno del Backend:**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://...
   JWT_SECRET=tu_secreto_jwt
   WEBPAY_COMMERCE_CODE=tu_codigo_comercio
   WEBPAY_API_KEY=tu_api_key
   FRONTEND_URL=https://tu-frontend.onrender.com
   ```

4. **Base de Datos:**
   - En Render: "New" → "PostgreSQL"
   - Copia la `DATABASE_URL` a las variables del backend

### **2. Desplegar el Frontend**

1. **En Render.com:**
   - "New" → "Static Site"
   - Conecta este repositorio del frontend
   - Configuración:
     ```
     Name: ferremas-frontend
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

2. **Variables de Entorno del Frontend:**
   ```
   VITE_API_BASE_URL=https://ferremas-api.onrender.com/api
   ```

### **3. Configurar URLs de Redirección**

Una vez que tengas ambas URLs desplegadas:

1. **Actualizar el Backend:**
   - En las configuraciones de Webpay, cambiar:
   ```javascript
   const returnUrl = `${process.env.FRONTEND_URL}/pago/resultado`;
   ```

2. **Actualizar el Frontend:**
   - Las variables de entorno ya estarán configuradas

## 🎯 Opción 2: Frontend en Render + Backend en Railway

### **Backend en Railway.app:**

1. **Crear cuenta en [railway.app](https://railway.app)**
2. **"New Project" → "Deploy from GitHub"**
3. **Variables de entorno:**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   JWT_SECRET=tu_secreto_jwt
   WEBPAY_COMMERCE_CODE=codigo
   WEBPAY_API_KEY=api_key
   FRONTEND_URL=https://tu-frontend.onrender.com
   ```

4. **Railway PostgreSQL:**
   - "Add Plugin" → "PostgreSQL"
   - Conecta automáticamente la DATABASE_URL

### **Frontend en Render:** (igual que Opción 1)

## 🎯 Opción 3: Alternativas por Servicio

### **Opciones de Backend:**
- **Render.com** (Free, fácil)
- **Railway.app** (Free tier, muy buena experiencia)
- **Fly.io** (Free tier limitado)
- **Heroku** (Ya no es gratis)
- **DigitalOcean App Platform** (Pago)

### **Opciones de Frontend:**
- **Render.com** (Free, ilimitado)
- **Vercel** (Free, excelente para React)
- **Netlify** (Free, muy popular)
- **GitHub Pages** (Free, básico)

### **Opciones de Base de Datos:**
- **Render PostgreSQL** (Free)
- **Supabase** (Free tier generoso)
- **PlanetScale** (Free tier de MySQL)
- **Railway PostgreSQL** (Free tier)

## ⚙️ Configuración Específica del Proyecto

### **Variables de Entorno Necesarias:**

#### Backend (.env):
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=un_secreto_muy_seguro_de_32_caracteres
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
FRONTEND_URL=https://ferremas-frontend.onrender.com
```

#### Frontend (Variables de Render):
```bash
VITE_API_BASE_URL=https://ferremas-api.onrender.com/api
```

## 📝 Pasos Detallados para Render

### **1. Preparación:**
```bash
# En tu proyecto frontend, asegúrate de que el build funciona
npm run build

# Verifica que los archivos están en ./dist
ls dist/
```

### **2. Deploy del Backend:**
1. Sube tu backend a un repo de GitHub separado
2. En Render.com → New Web Service
3. Conecta el repo del backend
4. Configura las variables de entorno
5. Deploy automático

### **3. Deploy del Frontend:**
1. Push de este repo a GitHub
2. En Render.com → New Static Site
3. Conecta este repo
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Configura `VITE_API_BASE_URL`

## 🔧 Troubleshooting Común

### **Problema: API no conecta**
- Verifica que `VITE_API_BASE_URL` tenga la URL correcta del backend
- Asegúrate de que el backend esté corriendo
- Revisa CORS en el backend

### **Problema: Rutas del Frontend dan 404**
- Verifica que `public/_redirects` esté presente
- Contenido: `/*    /index.html   200`

### **Problema: Pagos no funcionan**
- Actualiza `FRONTEND_URL` en el backend
- Verifica que Webpay tenga las URLs correctas
- El servidor de redirección (puerto 5173) solo es para desarrollo local

## 🎉 URLs Finales

Una vez desplegado tendrás:
- **Frontend**: `https://ferremas-frontend.onrender.com`
- **Backend**: `https://ferremas-api.onrender.com`
- **Admin**: `https://ferremas-frontend.onrender.com/admin-login`

## 💡 Recomendaciones

1. **Usar dominios personalizados** una vez que todo funcione
2. **Configurar SSL/HTTPS** (automático en Render)
3. **Monitorear logs** en ambos servicios
4. **Backup de base de datos** regulares
5. **Variables de entorno seguras** para producción

---

¿Necesitas ayuda específica con algún paso? ¡Pregúntame!