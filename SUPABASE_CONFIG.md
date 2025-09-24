# 🔐 Configuración de Supabase - Ferremas

## 📝 Datos de tu proyecto Supabase:

### **Frontend (Público):**
- **URL**: `https://hnprqhbocsdjyivxvdtv.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucHJxaGJvY3Nkanlpdnh2ZHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDUzNDYsImV4cCI6MjA3NDMyMTM0Nn0.EWeg0kejhln_9H-oMEahXCKDM14iuFIOOwQ_nAufc5g`

### **Backend (Secreto):**
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucHJxaGJvY3Nkanlpdnh2ZHR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc0NTM0NiwiZXhwIjoyMDc0MzIxMzQ2fQ.PzDJ8HfjbvSTYdIx6NRx9lieJ3QPp7eH5R8iO2cM3DQ`

### **Database Connection String:**
```
postgresql://postgres:Clau2703.@db.hnprqhbocsdjyivxvdtv.supabase.co:5432/postgres
```

---

## 🚀 Variables de Entorno:

### **Frontend (.env):**
```env
VITE_SUPABASE_URL=https://hnprqhbocsdjyivxvdtv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucHJxaGJvY3Nkanlpdnh2ZHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDUzNDYsImV4cCI6MjA3NDMyMTM0Nn0.EWeg0kejhln_9H-oMEahXCKDM14iuFIOOwQ_nAufc5g
```

### **Backend (.env):**
```env
# Connection String directo
DATABASE_URL=postgresql://postgres:Clau2703.@db.hnprqhbocsdjyivxvdtv.supabase.co:5432/postgres

# Opción 2: Usar Supabase SDK
SUPABASE_URL=https://hnprqhbocsdjyivxvdtv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucHJxaGJvY3Nkanlpdnh2ZHR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc0NTM0NiwiZXhwIjoyMDc0MzIxMzQ2fQ.PzDJ8HfjbvSTYdIx6NRx9lieJ3QPp7eH5R8iO2cM3DQ

# Otras variables necesarias
NODE_ENV=production
JWT_SECRET=tu_secreto_jwt_muy_largo_y_seguro
FRONTEND_URL=https://tu-frontend.onrender.com
```

---

## 📋 Próximos pasos:

1. **✅ Frontend configurado** - Variables agregadas al .env
2. **🔍 Buscar Connection String** - Settings → Database → Connection String → URI
3. **🚀 Configurar Backend** - Usar las variables arriba
4. **📤 Desplegar ambos** - Frontend y Backend en Render/Railway

---

**💡 Tip**: Guarda este archivo, contiene toda la configuración que necesitas para el despliegue.