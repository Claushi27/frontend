-- =====================================
-- SISTEMA DE COMPRAS E-COMMERCE
-- ADAPTADO PARA POSTGRESQL (SUPABASE)
-- =====================================

-- Nota: PostgreSQL usa SERIAL en lugar de AUTO_INCREMENT
-- y tiene algunas diferencias de sintaxis con MySQL

-- =====================================
-- 1. CREACIÓN DE TABLAS
-- =====================================

-- Tabla: rol
CREATE TABLE IF NOT EXISTS rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles predefinidos ESENCIALES
INSERT INTO rol (nombre_rol)
SELECT 'Administrador' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre_rol = 'Administrador')
UNION ALL
SELECT 'Vendedor' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre_rol = 'Vendedor')
UNION ALL
SELECT 'Bodeguero' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre_rol = 'Bodeguero')
UNION ALL
SELECT 'Contador' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre_rol = 'Contador')
UNION ALL
SELECT 'Cliente' WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre_rol = 'Cliente');

-- Tabla: usuario
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_rol INTEGER,
    primer_inicio BOOLEAN DEFAULT TRUE,
    fecha_ultimo_acceso TIMESTAMP NULL,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

-- Tabla: sucursal
CREATE TABLE IF NOT EXISTS sucursal (
    id_sucursal SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    horario_atencion VARCHAR(200)
);

-- Tabla: categoria_producto
CREATE TABLE IF NOT EXISTS categoria_producto (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria_padre INTEGER NULL,
    FOREIGN KEY (categoria_padre) REFERENCES categoria_producto(id_categoria) ON DELETE SET NULL
);

-- Tabla: producto
CREATE TABLE IF NOT EXISTS producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    id_categoria INTEGER,
    codigo_producto VARCHAR(50) UNIQUE NOT NULL,
    marca VARCHAR(100),
    es_promocion BOOLEAN DEFAULT FALSE,
    es_nuevo BOOLEAN DEFAULT FALSE,
    imagen_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria) ON DELETE SET NULL
);

-- Tabla: inventario_sucursal
CREATE TABLE IF NOT EXISTS inventario_sucursal (
    id_inventario SERIAL PRIMARY KEY,
    id_producto INTEGER,
    id_sucursal INTEGER,
    stock INTEGER NOT NULL,
    stock_minimo INTEGER DEFAULT 5,
    ubicacion_bodega VARCHAR(50),
    ultimo_reabastecimiento DATE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal) ON DELETE CASCADE,
    CONSTRAINT uk_producto_sucursal UNIQUE (id_producto, id_sucursal)
);

-- Tabla: cliente
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    id_usuario INTEGER UNIQUE,
    rut VARCHAR(20) UNIQUE,
    fecha_nacimiento DATE,
    acepta_promociones BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Tabla: moneda
CREATE TABLE IF NOT EXISTS moneda (
    id_moneda SERIAL PRIMARY KEY,
    codigo VARCHAR(3) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    simbolo VARCHAR(5) NOT NULL
);

-- Insertar monedas básicas ESENCIALES
INSERT INTO moneda (codigo, nombre, simbolo)
SELECT 'CLP', 'Peso Chileno', '$' WHERE NOT EXISTS (SELECT 1 FROM moneda WHERE codigo = 'CLP')
UNION ALL
SELECT 'USD', 'Dólar Estadounidense', 'US$' WHERE NOT EXISTS (SELECT 1 FROM moneda WHERE codigo = 'USD')
UNION ALL
SELECT 'EUR', 'Euro', '€' WHERE NOT EXISTS (SELECT 1 FROM moneda WHERE codigo = 'EUR');

-- Tabla: tipo_entrega
CREATE TABLE IF NOT EXISTS tipo_entrega (
    id_tipo SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

-- Insertar tipos de entrega predefinidos ESENCIALES
INSERT INTO tipo_entrega (descripcion)
SELECT 'Retiro en tienda' WHERE NOT EXISTS (SELECT 1 FROM tipo_entrega WHERE descripcion = 'Retiro en tienda')
UNION ALL
SELECT 'Despacho a domicilio' WHERE NOT EXISTS (SELECT 1 FROM tipo_entrega WHERE descripcion = 'Despacho a domicilio');

-- Tabla: estado_pedido
CREATE TABLE IF NOT EXISTS estado_pedido (
    id_estado SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permite_cancelacion BOOLEAN DEFAULT FALSE
);

-- Insertar estados comunes de pedido ESENCIALES
INSERT INTO estado_pedido (nombre, descripcion, permite_cancelacion)
SELECT 'Pendiente', 'Pedido creado, pendiente de confirmación', TRUE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'Pendiente')
UNION ALL
SELECT 'Confirmado', 'Pedido confirmado, pendiente de pago', TRUE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'Confirmado')
UNION ALL
SELECT 'Pagado', 'Pago recibido, pendiente de preparación', FALSE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'Pagado')
UNION ALL
SELECT 'En preparación', 'Productos siendo preparados en bodega', FALSE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'En preparación')
UNION ALL
SELECT 'Listo para envío', 'Pedido listo para ser despachado', FALSE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'Listo para envío')
UNION ALL
SELECT 'En camino', 'Pedido ha sido despachado', FALSE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'En camino')
UNION ALL
SELECT 'Entregado', 'Pedido entregado al cliente', FALSE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'Entregado')
UNION ALL
SELECT 'Cancelado', 'Pedido cancelado', FALSE WHERE NOT EXISTS (SELECT 1 FROM estado_pedido WHERE nombre = 'Cancelado');

-- Tabla: servicio_envio
CREATE TABLE IF NOT EXISTS servicio_envio (
    id_servicio SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL UNIQUE,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    sitio_web VARCHAR(255),
    costo_base DECIMAL(10,2)
);

-- Tabla: pedido
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INTEGER,
    id_tipo INTEGER,
    id_sucursal INTEGER,
    fecha DATE NOT NULL,
    id_estado INTEGER DEFAULT 1,
    numero_compra VARCHAR(100) UNIQUE NOT NULL,
    id_moneda INTEGER DEFAULT 1,
    total_sin_impuesto DECIMAL(10,2) DEFAULT 0.00,
    impuesto DECIMAL(10,2) DEFAULT 0.00,
    total_con_impuesto DECIMAL(10,2) DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    comentarios TEXT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE SET NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipo_entrega(id_tipo),
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal),
    FOREIGN KEY (id_estado) REFERENCES estado_pedido(id_estado),
    FOREIGN KEY (id_moneda) REFERENCES moneda(id_moneda)
);

-- Tabla: detalle_pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_item DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE SET NULL
);

-- Tabla: metodo_pago
CREATE TABLE IF NOT EXISTS metodo_pago (
    id_metodo SERIAL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar métodos de pago comunes ESENCIALES
INSERT INTO metodo_pago (descripcion)
SELECT 'Tarjeta de débito' WHERE NOT EXISTS (SELECT 1 FROM metodo_pago WHERE descripcion = 'Tarjeta de débito')
UNION ALL
SELECT 'Tarjeta de crédito' WHERE NOT EXISTS (SELECT 1 FROM metodo_pago WHERE descripcion = 'Tarjeta de crédito')
UNION ALL
SELECT 'Transferencia bancaria' WHERE NOT EXISTS (SELECT 1 FROM metodo_pago WHERE descripcion = 'Transferencia bancaria')
UNION ALL
SELECT 'WebPay' WHERE NOT EXISTS (SELECT 1 FROM metodo_pago WHERE descripcion = 'WebPay');

-- Tabla: pago
CREATE TABLE IF NOT EXISTS pago (
    id_pago SERIAL PRIMARY KEY,
    id_pedido INTEGER,
    id_metodo INTEGER,
    estado VARCHAR(50) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL,
    referencia_transaccion VARCHAR(100) UNIQUE,
    comprobante_url VARCHAR(255),
    id_moneda INTEGER DEFAULT 1,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_metodo) REFERENCES metodo_pago(id_metodo),
    FOREIGN KEY (id_moneda) REFERENCES moneda(id_moneda)
);

-- Tabla: carrito
CREATE TABLE IF NOT EXISTS carrito (
    id_carrito SERIAL PRIMARY KEY,
    id_cliente INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

-- Tabla: carrito_detalle
CREATE TABLE IF NOT EXISTS carrito_detalle (
    id_detalle SERIAL PRIMARY KEY,
    id_carrito INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- =====================================
-- 2. DATOS DE PRUEBA BÁSICOS
-- =====================================

-- Sucursales
INSERT INTO sucursal (nombre, direccion, telefono, email, horario_atencion)
SELECT 'Sucursal Centro', 'Av. Libertador 1234, Santiago Centro', '+56225551234', 'centro@ferremas.cl', 'Lunes a Viernes 9:00-19:00, Sábados 9:00-14:00' WHERE NOT EXISTS (SELECT 1 FROM sucursal WHERE nombre = 'Sucursal Centro')
UNION ALL
SELECT 'Sucursal Las Condes', 'Av. Apoquindo 5678, Las Condes', '+56225555678', 'lascondes@ferremas.cl', 'Lunes a Viernes 10:00-20:00, Sábados 10:00-18:00' WHERE NOT EXISTS (SELECT 1 FROM sucursal WHERE nombre = 'Sucursal Las Condes')
UNION ALL
SELECT 'Sucursal Maipú', 'Av. Pajaritos 9012, Maipú', '+56225559012', 'maipu@ferremas.cl', 'Lunes a Sábado 9:30-19:30' WHERE NOT EXISTS (SELECT 1 FROM sucursal WHERE nombre = 'Sucursal Maipú')
UNION ALL
SELECT 'Tienda Online', 'Plataforma Digital', '+56225550000', 'online@ferremas.cl', '24/7 Online' WHERE NOT EXISTS (SELECT 1 FROM sucursal WHERE nombre = 'Tienda Online');

-- Categorías de productos
-- Insertar categorías principales primero
INSERT INTO categoria_producto (nombre, descripcion, categoria_padre)
SELECT 'Herramientas', 'Herramientas de construcción y reparación', NULL::INTEGER WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Herramientas')
UNION ALL
SELECT 'Materiales', 'Materiales de construcción', NULL::INTEGER WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Materiales')
UNION ALL
SELECT 'Ferretería', 'Artículos de ferretería general', NULL::INTEGER WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Ferretería')
UNION ALL
SELECT 'Jardín', 'Productos para jardín y exteriores', NULL::INTEGER WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Jardín');

-- Luego insertar subcategorías (usando referencias dinámicas)
INSERT INTO categoria_producto (nombre, descripcion, categoria_padre)
SELECT 'Herramientas Manuales', 'Martillos, destornilladores, llaves', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Herramientas Manuales')
UNION ALL
SELECT 'Herramientas Eléctricas', 'Taladros, sierras, amoladoras', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Herramientas Eléctricas')
UNION ALL
SELECT 'Herramientas de Medición', 'Niveles, metros, escuadras', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Herramientas de Medición')
UNION ALL
SELECT 'Cemento y Hormigón', 'Cemento, hormigón premezclado', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Materiales')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Cemento y Hormigón')
UNION ALL
SELECT 'Maderas', 'Tablas, vigas, tableros', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Materiales')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Maderas')
UNION ALL
SELECT 'Pinturas', 'Pinturas, barnices, esmaltes', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Materiales')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Pinturas')
UNION ALL
SELECT 'Tornillos y Fijaciones', 'Tornillos, clavos, pernos', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Ferretería')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Tornillos y Fijaciones')
UNION ALL
SELECT 'Cerraduras y Bisagras', 'Cerraduras, bisagras, picaportes', (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Ferretería')
WHERE NOT EXISTS (SELECT 1 FROM categoria_producto WHERE nombre = 'Cerraduras y Bisagras');

-- Servicios de envío
INSERT INTO servicio_envio (nombre_empresa, contacto, telefono, email, sitio_web, costo_base)
SELECT 'Correos de Chile', 'Centro de Atención', '+56600950020', 'contacto@correos.cl', 'www.correos.cl', 2500.00 WHERE NOT EXISTS (SELECT 1 FROM servicio_envio WHERE nombre_empresa = 'Correos de Chile')
UNION ALL
SELECT 'StarkenTN', 'Mesa de Ayuda', '+56226700000', 'info@starken.cl', 'www.starken.cl', 3500.00 WHERE NOT EXISTS (SELECT 1 FROM servicio_envio WHERE nombre_empresa = 'StarkenTN')
UNION ALL
SELECT 'Chilexpress', 'Call Center', '+56600600900', 'hola@chilexpress.cl', 'www.chilexpress.cl', 4000.00 WHERE NOT EXISTS (SELECT 1 FROM servicio_envio WHERE nombre_empresa = 'Chilexpress');

-- Usuarios del sistema
INSERT INTO usuario (nombre_usuario, contrasena, correo, id_rol, primer_inicio, fecha_ultimo_acceso)
SELECT 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@ferremas.cl', 1, FALSE, NOW() WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE nombre_usuario = 'admin')
UNION ALL
SELECT 'vendedor1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor1@ferremas.cl', 2, FALSE, NOW() WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE nombre_usuario = 'vendedor1');

-- Productos básicos (usando referencias dinámicas a categorías)
INSERT INTO producto (nombre, descripcion, precio, id_categoria, codigo_producto, marca, es_promocion, es_nuevo, imagen_url)
SELECT 'Martillo de Garra 16oz', 'Martillo de garra profesional con mango de fibra de vidrio', 15990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas Manuales'), 'MAR-GAR-16', 'Stanley', FALSE, FALSE, 'https://ejemplo.com/martillo.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'MAR-GAR-16')
UNION ALL
SELECT 'Destornillador Phillips', 'Set de destornilladores Phillips x4 unidades', 8990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas Manuales'), 'DES-PHI-SET', 'Bahco', FALSE, FALSE, 'https://ejemplo.com/destornillador.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'DES-PHI-SET')
UNION ALL
SELECT 'Alicate Universal 8"', 'Alicate universal de 8 pulgadas con empuñadura ergonómica', 12990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas Manuales'), 'ALI-UNI-8', 'Irwin', TRUE, FALSE, 'https://ejemplo.com/alicate.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'ALI-UNI-8')
UNION ALL
SELECT 'Taladro Percutor 650W', 'Taladro percutor profesional con regulador de velocidad', 89990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas Eléctricas'), 'TAL-PER-650', 'Bosch', FALSE, TRUE, 'https://ejemplo.com/taladro.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'TAL-PER-650')
UNION ALL
SELECT 'Sierra Circular 7-1/4"', 'Sierra circular con disco de 7-1/4" y guía laser', 129990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas Eléctricas'), 'SIE-CIR-7', 'DeWalt', TRUE, FALSE, 'https://ejemplo.com/sierra.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'SIE-CIR-7')
UNION ALL
SELECT 'Amoladora Angular 4-1/2"', 'Amoladora angular de 4-1/2" con protector ajustable', 45990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Herramientas Eléctricas'), 'AMO-ANG-4', 'Makita', FALSE, FALSE, 'https://ejemplo.com/amoladora.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'AMO-ANG-4')
UNION ALL
SELECT 'Cemento Gris 25kg', 'Cemento gris uso general saco de 25 kilos', 4990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Cemento y Hormigón'), 'CEM-GRI-25', 'Cemento Bío Bío', FALSE, FALSE, 'https://ejemplo.com/cemento.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'CEM-GRI-25')
UNION ALL
SELECT 'Pintura Latex Interior 4L', 'Pintura látex lavable para interiores color blanco', 19990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Pinturas'), 'PIN-LAT-4L', 'Sherwin Williams', FALSE, FALSE, 'https://ejemplo.com/pintura.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'PIN-LAT-4L')
UNION ALL
SELECT 'Tabla Pino 1x4x3m', 'Tabla de pino cepillada de 1x4 pulgadas por 3 metros', 6990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Maderas'), 'TAB-PIN-1X4', 'Forestal Arauco', FALSE, FALSE, 'https://ejemplo.com/tabla.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'TAB-PIN-1X4')
UNION ALL
SELECT 'Tornillos Madera 3x25mm', 'Caja de tornillos para madera 3x25mm x100 unidades', 2990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Tornillos y Fijaciones'), 'TOR-MAD-3X25', 'Hilti', FALSE, FALSE, 'https://ejemplo.com/tornillos.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'TOR-MAD-3X25')
UNION ALL
SELECT 'Cerradura Sobreponer', 'Cerradura de sobreponer con 3 llaves incluidas', 25990.00, (SELECT id_categoria FROM categoria_producto WHERE nombre = 'Cerraduras y Bisagras'), 'CER-SOB-3LL', 'Scanavini', FALSE, TRUE, 'https://ejemplo.com/cerradura.jpg' WHERE NOT EXISTS (SELECT 1 FROM producto WHERE codigo_producto = 'CER-SOB-3LL');

-- Inventario por sucursal (usando IDs dinámicos)
INSERT INTO inventario_sucursal (id_producto, id_sucursal, stock, stock_minimo, ubicacion_bodega, ultimo_reabastecimiento)
SELECT p.id_producto, s.id_sucursal, 25, 10, 'A-001', CURRENT_DATE - INTERVAL '5 days'
FROM producto p, sucursal s
WHERE p.codigo_producto = 'MAR-GAR-16' AND s.nombre = 'Sucursal Centro'
AND NOT EXISTS (SELECT 1 FROM inventario_sucursal i WHERE i.id_producto = p.id_producto AND i.id_sucursal = s.id_sucursal)
UNION ALL
SELECT p.id_producto, s.id_sucursal, 15, 5, 'A-002', CURRENT_DATE - INTERVAL '3 days'
FROM producto p, sucursal s
WHERE p.codigo_producto = 'DES-PHI-SET' AND s.nombre = 'Sucursal Centro'
AND NOT EXISTS (SELECT 1 FROM inventario_sucursal i WHERE i.id_producto = p.id_producto AND i.id_sucursal = s.id_sucursal)
UNION ALL
SELECT p.id_producto, s.id_sucursal, 8, 5, 'A-003', CURRENT_DATE - INTERVAL '7 days'
FROM producto p, sucursal s
WHERE p.codigo_producto = 'ALI-UNI-8' AND s.nombre = 'Sucursal Centro'
AND NOT EXISTS (SELECT 1 FROM inventario_sucursal i WHERE i.id_producto = p.id_producto AND i.id_sucursal = s.id_sucursal)
UNION ALL
SELECT p.id_producto, s.id_sucursal, 5, 2, 'B-001', CURRENT_DATE - INTERVAL '10 days'
FROM producto p, sucursal s
WHERE p.codigo_producto = 'TAL-PER-650' AND s.nombre = 'Sucursal Centro'
AND NOT EXISTS (SELECT 1 FROM inventario_sucursal i WHERE i.id_producto = p.id_producto AND i.id_sucursal = s.id_sucursal)
UNION ALL
SELECT p.id_producto, s.id_sucursal, 50, 20, 'C-001', CURRENT_DATE - INTERVAL '2 days'
FROM producto p, sucursal s
WHERE p.codigo_producto = 'CEM-GRI-25' AND s.nombre = 'Sucursal Centro'
AND NOT EXISTS (SELECT 1 FROM inventario_sucursal i WHERE i.id_producto = p.id_producto AND i.id_sucursal = s.id_sucursal);

-- Clientes de ejemplo
INSERT INTO cliente (nombre_completo, direccion, telefono, rut, fecha_nacimiento, acepta_promociones)
SELECT 'Juan Pérez González', 'Los Rosales 456, Ñuñoa', '+56912345678', '12345678-9', '1985-03-15'::DATE, TRUE WHERE NOT EXISTS (SELECT 1 FROM cliente WHERE rut = '12345678-9')
UNION ALL
SELECT 'María García Silva', 'Av. Brasil 789, Valparaíso', '+56987654321', '87654321-0', '1990-07-22'::DATE, TRUE WHERE NOT EXISTS (SELECT 1 FROM cliente WHERE rut = '87654321-0')
UNION ALL
SELECT 'Carlos López Muñoz', 'Santa Rosa 321, Santiago', '+56911223344', '11223344-5', '1988-11-08'::DATE, FALSE WHERE NOT EXISTS (SELECT 1 FROM cliente WHERE rut = '11223344-5');

-- =====================================
-- 3. ÍNDICES PARA OPTIMIZACIÓN
-- =====================================

-- Índices adicionales para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_producto_categoria ON producto(id_categoria);
CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario_sucursal(id_producto);
CREATE INDEX IF NOT EXISTS idx_inventario_sucursal ON inventario_sucursal(id_sucursal);
CREATE INDEX IF NOT EXISTS idx_pedido_cliente ON pedido(id_cliente);
CREATE INDEX IF NOT EXISTS idx_pedido_estado ON pedido(id_estado);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido_pedido ON detalle_pedido(id_pedido);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido_producto ON detalle_pedido(id_producto);
CREATE INDEX IF NOT EXISTS idx_cliente_rut ON cliente(rut);
CREATE INDEX IF NOT EXISTS idx_pago_pedido ON pago(id_pedido);
CREATE INDEX IF NOT EXISTS idx_usuario_correo ON usuario(correo);

-- =====================================
-- 4. CONSULTAS DE VERIFICACIÓN
-- =====================================

-- Verificar que los datos se insertaron correctamente
SELECT 'VERIFICACIÓN DE DATOS INSERTADOS:' as info;

SELECT
    'roles' as tabla,
    COUNT(*) as cantidad
FROM rol
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuario
UNION ALL
SELECT 'sucursales', COUNT(*) FROM sucursal
UNION ALL
SELECT 'categorías', COUNT(*) FROM categoria_producto
UNION ALL
SELECT 'productos', COUNT(*) FROM producto
UNION ALL
SELECT 'inventario', COUNT(*) FROM inventario_sucursal
UNION ALL
SELECT 'clientes', COUNT(*) FROM cliente
UNION ALL
SELECT 'métodos_pago', COUNT(*) FROM metodo_pago
UNION ALL
SELECT 'estados_pedido', COUNT(*) FROM estado_pedido;

-- Verificar productos por categoría
SELECT
    c.nombre as categoria,
    COUNT(p.id_producto) as productos
FROM categoria_producto c
LEFT JOIN producto p ON c.id_categoria = p.id_categoria
GROUP BY c.id_categoria, c.nombre
ORDER BY productos DESC;

-- Verificar stock por sucursal
SELECT
    s.nombre as sucursal,
    COUNT(i.id_producto) as productos_en_stock,
    SUM(i.stock) as stock_total
FROM sucursal s
LEFT JOIN inventario_sucursal i ON s.id_sucursal = i.id_sucursal
GROUP BY s.id_sucursal, s.nombre
ORDER BY stock_total DESC;