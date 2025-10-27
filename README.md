
================================================================================
ARCA — Sistema Genérico para Tiendas
Versión 6.0.0 — “Infrastructure”
Autor: JSAYALA (José Ayala) · Cuenca, Ecuador · josealbertoayalazumba@gmail.com
================================================================================

RESUMEN EJECUTIVO
--------------------------------------------------------------------------------
ARCA es un sistema modular para la gestión de ventas, productos e inventarios,
con contabilidad y facturación electrónica para el mercado ecuatoriano.
Esta versión 6.0.0 (“Infrastructure”) consolida una arquitectura más
mantenible, modular y preparada para crecer (¡sin morir en la selva de carpetas!).

PILARES DE LA V6.0.0
--------------------------------------------------------------------------------
- Arquitectura modular por dominios (feature-first) con capas claras (API,
  Controladores, Casos de Uso, Servicios, Repositorios, Esquemas/DTOs).
- Estandarización con Zod (validación fuerte), Prisma (ORM), y rutas REST limpias.
- Multi-tenant listo (DB por tenant + DB admin) y permisos inyectados por cabeceras.
- Ciclos de vida de productos y ventas sólidos: Kardex, ProductHistory y asientos.
- Emisión electrónica SRI: Facturas, Notas de crédito/débito, Retenciones, Guías.
- Seguridad práctica: Auth.js v5 + JWT, aprobación de dispositivos y control por roles.
- Operaciones: Envíos y tracking GPS (“Uber”), liquidación de repartidores (Settlement).
- Impuestos flexibles: IVA 0%, 5%, 13% (combustibles), 15% (vigente), y cálculo compuesto.
- Impresión de etiquetas: ZPL (Zebra Programming Language) para códigos de barras.
- Despliegue en Vercel con consejos anti “middleware 1MB” y performance en Next.js.

TECNOLOGÍAS
--------------------------------------------------------------------------------
- Frontend: React + Next.js (App Router, Server Actions, Route Handlers, Middleware).
- Backend: Node.js (TypeScript), REST API.
- Validación: Zod (DTOs y validaciones de entrada/salida).
- Datos: Prisma ORM + MySQL 8 (Migrations, Seeds).
- Estado: Zustand (slices, selectors, persist).
- Autenticación: Auth.js v5 + JWT (tokens firmados).
- Notificaciones: react-toastify (ToastNotification).
- Impresión: ZPL (Zebra) para etiquetas y códigos de barras.
- Infra: Vercel (Edge/Node runtimes), (opcional) AWS KMS/S3 para llaves y ficheros.
- Utilidades: pino (logging), msw (mocks), Vitest/Jest + Playwright (testing).

Patrones clave
- API (adaptadores) mínimos: parsean entrada con Zod, llaman casos de uso y
  responden con ResponseHandler.
- Controlador (opcional): cuando el módulo amerite coordinación entre varios casos.
- Caso de Uso (usecases/): orquesta reglas y llama servicios/repositorios.
- Servicio: lógica aislada, reusable y testeable (p. ej., cálculo de impuestos).
- Repositorio: acceso a datos con Prisma (una única responsabilidad).
- UI: componentes de presentación y formularios validables con Zod.
- “processExistingProduct”: caso de uso en /mod/product/usecases/ (no en API).

MÓDULOS Y FLUJOS DESTACADOS
--------------------------------------------------------------------------------
Productos
- CRUD, precios, utilidad, impuestos, categorías, marcas, presentaciones.
- Kardex + ProductHistory: cada movimiento (ingreso, venta, ajuste) genera registro.
- Etiquetas ZPL con códigos de barras (SKU, internos y externos).

Compras
- Liquidación de compra: costo unitario, gastos adicionales, prorrateo por ítem.
- Ajustes de inventario con contrapartidas en contabilidad (si procede).

Ventas
- Venta con uno o varios pagos (efectivo, tarjeta, crédito del cliente).
- Créditos: aplicar total/parcial a facturas.
- Eliminación/reverso: repone stock y escribe ProductHistory coherente.
- Prorrateo de recargos (e.g. transporte) sobre el precio base final.

Impuestos (Ecuador)
- IVA 0%, 5%, 13% (combustibles), 15% (vigente). Impuestos compuestos por orden.
- Cálculo: base – descuento → aplicar impuestos en orden → totales por ítem/venta.

Envíos/Logística (“Uber” interno)
- Envíos con tracking GPS (Envio/EnvioLocation), estados (PENDIENTE, RECOGIDO,
  EN_RUTA, ENTREGADO…). Liquidación de repartidores (Settlement/Items).

Roles y Permisos
- Roles asignan permisos (strings); administrador asigna pero no crea permisos.
- Cabecera x-perms inyectada por middleware/servidor admin.
- UI condicional (PermGate, withPerms) por permiso.

Contabilidad
- Plan de Cuentas NIIF (Ecuador): 1 Activo, 1.1 Activo Corriente, etc.
- Mapeos por evento (venta, compra, pago) → asientos automáticos (debe/haber).
- Cuentas por cobrar/pagar, bancos (Pichincha, JEP), IVA ventas/compras.

Dispositivos
- Emparejamiento y aprobación (deviceId). Capas de estado: Pending/Denied/OK.
- Middleware “ligero” para evitar límite 1 MB en Vercel Edge.

CAMBIOS DE LA 6.0.0 (“INFRASTRUCTURE”)
--------------------------------------------------------------------------------
- Reorganización por dominios (feature-first) y capas limpias.
- Casos de uso claros (incluye processExistingProduct).
- Zod en todas las fronteras (validación fuerte).
- Estrategia multi-tenant y permisos por cabecera consolidada.
- Flujos de reversión de ventas con Kardex/ProductHistory establecidos.
- Guías y ejemplo de prorrateo e impuestos compuestos.
- Recomendaciones de seguridad para firmas .p12 y secretos.

LICENCIA
--------------------------------------------------------------------------------
Proyecto desarrollado por **JSAYALA**. Todos los derechos reservados.  
--------------------------------------------------------------------------------
Autor: José Ayala (JSAYALA)
Email: josealbertoayalazumba@gmail.com
Ciudad: Cuenca, Ecuador
================================================================================
