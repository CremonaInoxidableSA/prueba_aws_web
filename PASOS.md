## Requisitos previos
-  EC2 con Docker instalado
-  Docker Compose
-  Dominio registrado en Cloudflare
-  IP pública de tu EC2

---

## Configuración en Cloudflare

### 1. **Acceder a Cloudflare Dashboard**
   - Ve a [cloudflare.com](https://cloudflare.com) y entra con tu cuenta
   - Selecciona tu dominio

### 2. **Configurar DNS Record**
   - Dirígete a **DNS** → **Records**
   - Crea/Actualiza un registro **A**:
     - **Name**: `@` (o `tudominio.com`)
     - **Type**: `A`
     - **IPv4 address**: Tu IP pública de EC2
     - **TTL**: `Auto`
     - **Proxy status**: 🟠 **Proxied** (nube naranja)
   - Click **Save**

### 3. **Configurar SSL/TLS**
   - Ve a **SSL/TLS** → **Overview**
   - Modo de encriptación: **Full** (not strict)
     - Esto permite conexión encriptada entre cliente y Cloudflare, y HTTP entre Cloudflare y tu servidor

### 4. **Reglas de redirección (Opcional pero recomendado)**
   - Ve a **Reglas** → **Redireccionamientos de URL**
   - Crea regla: HTTP → HTTPS
     ```
     Cuando: URI contains "http://"
     Luego: Redirigir a "https://tudominio.com"
     ```

### 5. **Configurar Origin Rules (Seguridad)**
   - Ve a **SSL/TLS** → **Origin Server**
   - Copia las credenciales si necesitas certificado (opcional para este setup)
   - Ve a **Security** → **Firewall Rules** y asegúrate que no haya restricciones

---

## Desplegar en EC2

### 1. **Conectar a tu EC2**
```bash
ssh -i tu-clave.pem ec2-user@tu-ip-publica
```

### 2. **Clonar tu proyecto**
```bash
cd ~
git clone https://github.com/tuusuario/prueba_aws_web.git
cd prueba_aws_web
```

### 3. **Crear archivo .env** (si lo necesitas)
```bash
nano .env
```

### 4. **Iniciar con Docker Compose**
```bash
docker-compose up -d
```

### 5. **Verificar que está funcionando**
```bash
docker-compose logs -f

curl http://localhost
```

---

## 🔍 Verificación

1. **En Cloudflare**: Ve a **Analytics** → **Requests** para ver tráfico
2. **Desde tu navegador**: 
   - `http://tudominio.com` (debe redirigir a HTTPS)
   - `https://tudominio.com` (debe mostrar tu app)
3. **SSL Check**: 
   - Abre [SSL Labs](https://www.ssllabs.com/ssltest/) y verifica tu dominio

---

## 🛠️ Troubleshooting

### La página no carga
```bash
# Revisar logs de nginx
docker-compose logs nginx

# Revisar logs de Next.js
docker-compose logs web

# Comprobar conectividad interna
docker-compose exec nginx ping web
```

### DNS no resuelve
- Espera 15-30 minutos (propagación DNS)
- Ve a Cloudflare → DNS y verifica el record A
- Prueba: `nslookup tudominio.com` desde tu máquina local

### SSL no funciona
- En Cloudflare → SSL/TLS, asegúrate que esté en **Full** (no Flexible)
- Limpia caché del navegador (Ctrl+Shift+Del)

---

## 📈 Próximos pasos (Opcional)

- **CI/CD**: Configura GitHub Actions para auto-deploy
- **Monitoring**: Usa CloudWatch de AWS
- **Backups**: Configura snapshots periódicos de tu EC2
- **CDN**: Cloudflare ya actúa como CDN, pero puedes optimizar más en **Caching Rules**

---

## 📚 Referencias útiles
- [Cloudflare DNS Setup](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
