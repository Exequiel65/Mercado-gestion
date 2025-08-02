# Configuración de la API .NET

Esta guía explica cómo configurar el archivo `appsettings.json` para que la API funcione correctamente.

## 📋 Configuración requerida

### 1. Base de datos

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MiBaseDeDatos;User Id=sa;Password=MiPassword123;TrustServerCertificate=true;"
}
```

**Parámetros:**
- `Server`: Dirección del servidor de base de datos
- `Database`: Nombre de la base de datos
- `User Id`: Usuario de la base de datos
- `Password`: Contraseña del usuario
- `TrustServerCertificate`: Para conexiones SSL/TLS

### 2. Autenticación JWT

```json
"Auth": {
  "Private": "-----BEGIN RSA PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END RSA PRIVATE KEY-----",
  "Public": "-----BEGIN PUBLIC KEY-----\nTU_CLAVE_PUBLICA_AQUI\n-----END PUBLIC KEY-----",
  "Audience": "mi-api-audience",
  "Issuer": "mi-api-issuer",
  "Client": "mi-client-id",
  "Secret": "mi-secret-super-seguro-de-al-menos-32-caracteres"
}
```

**Parámetros:**
- `Private`: Clave privada RSA para firmar tokens
- `Public`: Clave pública RSA para validar tokens
- `Audience`: Audiencia del token JWT
- `Issuer`: Emisor del token JWT
- `Client`: ID del cliente para OAuth
- `Secret`: Secreto compartido para autenticación

### 3. Configuración JWT

```json
"JWT": {
  "ExpirationMinutes": "43200"
}
```

**Parámetros:**
- `ExpirationMinutes`: Tiempo de expiración del token en minutos (43200 = 30 días)

### 4. Almacenamiento (MinIO/S3)

```json
"StorageSettings": {
  "Service": "S3",
  "BucketName": "mi-bucket",
  "AccessKey": "minioadmin",
  "SecretKey": "minioadmin",
  "Endpoint": "http://localhost:9000",
  "UseSsl": false,
  "UseMinio": true,
  "Cdn": "http://localhost:9000"
}
```

**Parámetros:**
- `Service`: Tipo de servicio ("S3" para compatibles con S3)
- `BucketName`: Nombre del bucket donde se almacenarán los archivos
- `AccessKey`: Clave de acceso de MinIO/S3
- `SecretKey`: Clave secreta de MinIO/S3
- `Endpoint`: URL del servidor MinIO/S3
- `UseSsl`: Si usar SSL/TLS para las conexiones
- `UseMinio`: Si se está usando MinIO en lugar de AWS S3
- `Cdn`: URL del CDN o endpoint público para acceder a los archivos

**Parámetros:**
- `domain`: Entorno de ejecución ("local", "development", "production", etc.)

## 🔧 Configuración por entornos

### Desarrollo Local

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MiApp_Dev;User Id=sa;Password=DevPassword123;TrustServerCertificate=true;"
  },
  "Auth": {
    "Private": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
    "Public": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----",
    "Audience": "localhost",
    "Issuer": "localhost",
    "Client": "dev-client",
    "Secret": "desarrollo-secret-muy-largo-32-chars"
  },
  "JWT": {
    "ExpirationMinutes": "43200"
  },
  "StorageSettings": {
    "Service": "S3",
    "BucketName": "desarrollo-bucket",
    "AccessKey": "minioadmin",
    "SecretKey": "minioadmin",
    "Endpoint": "http://localhost:9000",
    "UseSsl": false,
    "UseMinio": true,
    "Cdn": "http://localhost:9000"
  },
  "domain": "local"
}
```

### Producción

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=MiApp_Prod;User Id=produser;Password=SecurePassword123;TrustServerCertificate=false;"
  },
  "Auth": {
    "Private": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
    "Public": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----",
    "Audience": "https://mi-api.com",
    "Issuer": "https://mi-api.com",
    "Client": "prod-client-id",
    "Secret": "production-super-secure-secret-key"
  },
  "JWT": {
    "ExpirationMinutes": "1440"
  },
  "StorageSettings": {
    "Service": "S3",
    "BucketName": "production-bucket",
    "AccessKey": "AKIAIOSFODNN7EXAMPLE",
    "SecretKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "Endpoint": "https://s3.amazonaws.com",
    "UseSsl": true,
    "UseMinio": false,
    "Cdn": "https://cdn.mi-dominio.com"
  },
  "domain": "production"
}
```

## 🔐 Variables de entorno

Para mayor seguridad, se recomienda usar variables de entorno para datos sensibles:

```bash
# Base de datos
export ConnectionStrings__DefaultConnection="Server=localhost;Database=MiApp;..."

# Autenticación
export Auth__Secret="mi-secret-super-seguro"
export Auth__Private="-----BEGIN RSA PRIVATE KEY-----..."
export Auth__Public="-----BEGIN PUBLIC KEY-----..."

# Almacenamiento
export StorageSettings__AccessKey="minioadmin"
export StorageSettings__SecretKey="minioadmin"
```

## 🚀 Generación de claves RSA

Para generar las claves RSA necesarias para JWT:

```bash
# Generar clave privada
openssl genrsa -out private.pem 2048

# Extraer clave pública
openssl rsa -in private.pem -pubout -out public.pem

# Ver contenido (para copiar al appsettings.json)
cat private.pem
cat public.pem
```

## ⚠️ Consideraciones de seguridad

- **Nunca** commitees credenciales reales en el repositorio
- Usa variables de entorno o Azure Key Vault para datos sensibles
- Las claves RSA deben ser únicas para cada entorno
- Cambia las credenciales por defecto de MinIO (`minioadmin`)
- En producción, usa conexiones SSL/TLS (`UseSsl: true`)

## 📂 Estructura de archivos

```
├── appsettings.json                 # Configuración base
├── appsettings.Development.json     # Configuración de desarrollo
├── appsettings.Production.json      # Configuración de producción
└── appsettings.Local.json          # Configuración local (no commitear)
```

## 🧪 Verificación de configuración

Para verificar que la configuración es correcta:

1. Ejecuta la aplicación
2. Revisa los logs de inicio
3. Verifica la conexión a base de datos
4. Prueba la autenticación JWT
5. Confirma el acceso al almacenamiento MinIO/S3