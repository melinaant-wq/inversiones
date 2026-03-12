# Dinero Mágico — Módulo de Inversiones
## Definición de Producto

> Este documento describe el módulo de Inversiones de Dinero Mágico: qué hace, cómo está estructurado, y qué entra en V1 vs V2. Está escrito para que alguien que nunca vio los prototipos pueda entender el producto completo.

---

## ¿Qué es el módulo de Inversiones?

El módulo de Inversiones le permite al usuario comprar y vender fracciones de acciones y ETFs estadounidenses desde la app de Dinero Mágico, usando pesos argentinos o dólares. El usuario puede ver su portafolio, explorar el mercado, analizar activos individuales y seguir el estado de sus órdenes — todo dentro de la misma app.

---

## Mapa de navegación

```
                        ┌──────────────────────────────────┐
                        │         INVERSIONES HOME          │
                        │           (Módulo 1)              │
                        │  Balance · Distribución · Lista   │
                        └──────┬──────────────┬────────────┘
                               │              │
               ┌───────────────┘              └───────────────┐
               ▼                                              ▼
   ┌───────────────────────┐                    ┌─────────────────────────┐
   │  CENTRO DE ÓRDENES    │                    │   RESULTADOS            │
   │     (Módulo 6)        │                    │   (Módulo 7)            │
   │  Historial · Estados  │                    │   Posiciones cerradas   │
   └───────────────────────┘                    └─────────────────────────┘

                        ┌──────────────────────────────────┐
                        │           MERCADO                 │
                        │          (Módulo 2)               │
                        │   Packs · ETFs · Acciones         │
                        └──────────────┬───────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────────┐
                        │      DETALLE DEL ACTIVO           │
                        │         (Módulo 3)                │
                        │  Gráfico · Info · Posición propia │
                        └──────┬──────────────┬────────────┘
                               │              │
               ┌───────────────┘              └───────────────┐
               ▼                                              ▼
   ┌───────────────────────┐                    ┌─────────────────────────┐
   │   FLUJO DE COMPRA     │                    │   FLUJO DE VENTA        │
   │     (Módulo 4)        │                    │     (Módulo 5)          │
   │  Monto · Resumen ·    │                    │  Monto · Resumen ·      │
   │  Confirmar            │                    │  Confirmar              │
   └──────────┬────────────┘                    └────────────┬────────────┘
              │                                              │
              └────────────────────┬─────────────────────────┘
                                   ▼
                        ┌──────────────────────────────────┐
                        │      CENTRO DE ÓRDENES           │
                        │         (Módulo 6)               │
                        └──────────────────────────────────┘
```

---

## Módulos — Descripción detallada

---

### Módulo 1 — Home / Portafolio ✅ V1

**¿Qué es?**
La pantalla principal del módulo. El usuario llega acá desde su portafolio general al tocar la card de Inversiones. Es el dashboard de su situación actual como inversor.

**¿Qué contiene?**

#### Header — Balance y rendimiento
Muestra el estado financiero del portafolio en el período seleccionado:

| Campo | Cálculo |
|-------|---------|
| Balance total | Suma de (precio actual × cantidad) + dividendos de todas las posiciones abiertas, en USD |
| Variación en USD | Valor actual total − total invertido |
| Variación en % | (variación USD / total invertido) × 100 |

**Períodos disponibles:**
- **Diario** — cierre D-1 vs precio en tiempo real
- **Semana** — últimos 7 días corridos
- **Mes** — últimos 30 días corridos
- **Año** — 1° enero del año en curso hasta hoy
- **Histórico** — desde la primera compra del usuario

> El label del período y los números de P&L se actualizan dinámicamente al cambiar el selector. Verde = positivo, Rojo = negativo.

#### Barra de distribución
Una barra segmentada que muestra visualmente el peso de cada posición en el portafolio:
- Proporcional al valor actual de cada activo
- Ordenada de mayor a menor (izquierda → derecha)
- Color fijo por activo
- Leyenda con ticker + % debajo de la barra
- Máximo 5 segmentos visibles; el resto se agrupa

**Vistas disponibles:**

| Vista | Comportamiento |
|-------|---------------|
| Todos | Lista plana por valor descendente (default) |
| Sectores | Agrupado por sector (Tecnología, Automotriz, etc.) |
| Tipo | Agrupado por tipo de activo (Acciones / ETFs) |
| Dividendos | Filtra y muestra solo activos que pagan dividendo |

#### Lista de posiciones
- Ordenada por valor actual descendente
- Máximo 5 posiciones visibles + botón "Ver más"
- Cada ítem: logo · nombre · cantidad de acciones · valor actual USD · rendimiento % del período seleccionado

**Estado vacío:** Si no hay posiciones, muestra ilustración + texto + botón "Explorar mercado" como único CTA.

#### Accesos directos desde el home
- **Historial de órdenes** → entra al Módulo 6 (vista global de transacciones)
- **Historial de resultados** → entra al Módulo 7 (posiciones cerradas)

#### Indicador contextual de orden activa
Un banner que aparece **solo cuando hay una orden en curso**. Si no hay órdenes activas, no se muestra.

| Estado | Texto | Color |
|--------|-------|-------|
| Procesando | "Compra en proceso · $500 ARS" | 🟡 Amarillo |
| Completada | "Compra completada · $500 ARS" | 🟢 Verde |
| Cancelada | "Compra cancelada · $500 ARS" | 🔴 Rojo |

- Al tocar el indicador → abre el Centro de Órdenes filtrado por esa orden
- El estado "Completada" desaparece automáticamente después de unos segundos
- Solo se muestra si hay al menos una orden en estado Procesando

#### Vista Gráfico ✅ V1
Permite ver el rendimiento del portafolio en el tiempo y comparar curvas. Resuelve la pregunta: *"¿Cómo le está yendo a cada acción, y cómo me está yendo vs el mercado?"*

**Estado por defecto (sin selección):**
- Una sola curva: el portafolio total
- Arranca en 0% y termina en el rendimiento del período activo
- Línea punteada horizontal en 0% como referencia

**Al seleccionar chips:**
- Desaparece la curva del portafolio
- Aparece la curva del activo seleccionado con su color propio
- Se pueden seleccionar múltiples chips simultáneamente (máximo 4)
- El eje Y se recalcula dinámicamente para que todas las curvas quepan

**Tipos de chips:**
- **Mis acciones** — todas las acciones del portafolio del usuario, con rendimiento del período
- **Comparar con** — benchmarks externos fijos (referencias del mercado), consumen del mismo límite de 4

**Scrubber interactivo:** Al arrastrar el dedo sobre el gráfico aparece una línea vertical, cada curva muestra su valor en ese punto exacto.

---

### Módulo 2 — Mercado ✅ V1

**¿Qué es?**
La pantalla de descubrimiento. El usuario explora los activos disponibles para invertir.

**Puntos de acceso:**
- Botón "Explorar mercado" desde el Home vacío
- Botón de compra desde el Home
- Ícono de búsqueda en el header

#### Buscador
- Se activa desde el ícono de lupa en el header
- Búsqueda en tiempo real sobre todos los activos (Packs + ETFs + Acciones)
- Busca por nombre y por ticker

#### Packs
Carteras curadas. El usuario invierte en varias acciones a la vez para diversificar según su perfil de inversor.

Cada pack muestra:
- Nombre y descripción breve
- Rendimiento de los últimos 12 meses (%)
- Avatares apilados de los activos + cantidad ("4 activos")
- Badge de volatilidad: baja / media / alta
- Botón "Ver detalle" → abre detalle del pack

#### Índices (ETFs)
Fondos cotizados que agrupan múltiples activos.

Cada ETF muestra:
- Logo · nombre completo · ticker
- Descripción (ej: "Las 500 empresas más grandes de EE.UU.")
- Variación del día en % (precio actual vs cierre D-1)

#### Acciones
Filtros disponibles: **Todos · Favoritos · Populares · Tecnología · Con dividendos**

Cada acción muestra:
- Logo · nombre completo
- Ticker · Sector
- Variación del día en %

---

### Módulo 3 — Detalle del activo ✅ V1 (con partes diferidas a V2)

**¿Qué es?**
La pantalla individual de un activo. El usuario llega acá desde el portafolio (si ya tiene posición) o desde el Mercado.

Incluye un ícono para agregar el activo a favoritos.

#### Header
- Logo · nombre + ticker · sector
- Precio actual en USD (2 decimales)
- Variación del día (% respecto al cierre D-1, con flecha)

#### Gráfico de precio ✅ V1
Muestra el precio histórico del activo (no el rendimiento del usuario).

Períodos disponibles: **1D (default) · 1W · 1M · 1Y · Histórico**

| Período | Eje X |
|---------|-------|
| 1D | Cada 30 minutos |
| 1W | Lun · Mar · Mié · Jue · Vie |
| 1M | S1 · S2 · S3 · S4 |
| 1Y | Todos los meses |
| Histórico | Desde el inicio |

**Scrubbing táctil:** Al deslizar, muestra precio exacto + fecha/hora en ese punto.

> **V2:** Se agrega un marcador visual del precio promedio de compra del usuario sobre la curva (si tiene el activo).

#### Descripción ✅ V1
Breve descripción de la empresa con tags relacionados.

#### Noticias ✅ V1 (versión básica)
Feed de noticias vinculadas al activo o al sector.

Cada ítem: título · fuente · tiempo transcurrido ("Hace 2h") · tag temático

> **V1:** Noticias provistas por Alpaca, traducidas al español automáticamente.
> **V2 (post-lanzamiento):** Noticias financieras en tiempo real con integración a proveedor de fundamentals.

#### Valoración ⏳ Post-lanzamiento (requiere proveedor externo)
Datos financieros fundamentales del activo. **No disponible en V1** — se incorpora cuando se tenga integración con el proveedor de fundamentals.

Incluirá tooltips con explicaciones amigables para cada concepto.

**Datos principales:**

| Campo técnico | Nombre en UI | Tooltip |
|---------------|-------------|---------|
| Market Cap | Tamaño de la empresa | "Es lo que vale la empresa entera si alguien quisiera comprarla hoy." |
| Ratio P/E | Puntaje de valoración | "Ayuda a saber si la acción está cara o barata comparando su precio actual con las ganancias que genera." |
| Dividendo anual | Pago al accionista | "El porcentaje de dinero extra que la empresa te paga cada año solo por tener sus acciones." |
| Rango 52 semanas | Rango del último año | "El precio más bajo y el más alto de los últimos 12 meses." |

**Datos de actividad y eficiencia:**

| Campo técnico | Nombre en UI | Tooltip |
|---------------|-------------|---------|
| Volumen promedio | Ritmo de compra/venta | "Cantidad de acciones que se compran y venden en un día normal." |
| Volumen prom. 50d | Actividad reciente (50 días) | "El promedio de operaciones en los últimos casi 2 meses." |
| Precio/Ventas (P/S) | Precio vs. Facturación | "Compara el valor de la empresa con todo lo que vende." |
| Margen bruto | Ganancia inicial | "El % que le queda después de restar solo los costos de fabricación." |
| Margen neto | Ganancia limpia | "El % que le queda después de pagar todos sus gastos e impuestos." |

**Financieros (gráficos anuales y trimestrales):**

| Financiero | Nombre en UI |
|-----------|-------------|
| Estado de resultados | Ingresos y Ganancias |
| Balance general | Lo que tiene vs. lo que debe |
| Flujo de caja | Efectivo disponible |

#### Posición del usuario ✅ V1 (visible solo si tiene o tuvo posición)

| Campo | Cálculo |
|-------|---------|
| Valor actual | Precio actual × cantidad total, en USD |
| Variación USD | Valor actual − total invertido |
| Variación % | (variación USD / total invertido) × 100 |
| Cantidad de acciones | Total compras − total ventas |
| Precio promedio de compra | Promedio ponderado de todas las órdenes ejecutadas |
| Total invertido | Suma de (precio × cantidad) de cada orden de compra |

#### Historial de transacciones ✅ V1
Muestra las transacciones del usuario para ese ticker (tipo · estado · fecha · cantidad · precio de operación). Al tocar un ítem se expande el detalle completo.

#### Botones de acción (fijo abajo)
- Sin el activo: **Comprar**
- Con el activo: **Comprar más** + **Vender**

---

### Módulo 4 — Flujo de compra ✅ V1

**¿Qué es?**
El proceso que sigue el usuario para ejecutar una orden de compra.

**Tipo de orden en V1: Orden de mercado**
La orden se ejecuta al precio disponible en el momento de la confirmación. No hay precio garantizado.

**Pasos del flujo:**
1. El usuario selecciona la moneda en la que quiere comprar (ARS o USD)
2. Ve cuánto representa 1 acción del activo en la moneda seleccionada
3. Ve el saldo disponible según el método de pago seleccionado
4. Ingresa el monto (si supera el saldo disponible → error de saldo insuficiente)
5. Ve el resumen completo:
   - Activo + logo
   - Cantidad estimada de acciones
   - Monto en la moneda seleccionada (comisión incluida)
   - % de comisión + monto en pesos
6. Confirmar compra → dispara la orden → va al Módulo 6

---

### Módulo 5 — Flujo de venta ✅ V1

**¿Qué es?**
El proceso que sigue el usuario para ejecutar una orden de venta.

**Tipo de orden en V1: Orden de mercado**
La orden se ejecuta al precio disponible en el momento de la confirmación. No hay precio garantizado.

**Pasos del flujo:**
1. El usuario selecciona la moneda en la que quiere recibir los fondos (ARS o USD)
2. Ve cuánto representa 1 acción en la moneda seleccionada
3. Ve el saldo disponible en el activo
4. Ingresa el monto (si supera el saldo disponible → error de saldo insuficiente)
5. Ve el resumen completo:
   - Activo + logo
   - Cantidad estimada de acciones a vender
   - Monto en la moneda seleccionada (comisión incluida)
   - % de comisión + monto
6. Confirmar venta → dispara la orden → va al Módulo 6

---

### Módulo 6 — Centro de órdenes y actividad ✅ V1 (base) + V2 (extensiones)

**¿Qué es?**
El registro centralizado de todas las órdenes de inversión del usuario. Las órdenes no son instantáneas — pasan por estados. Este módulo permite al usuario saber en todo momento qué pasó con cada una.

**Acceso:** Ícono de actividad en el header de Inversiones Home.

#### V1 — Órdenes de mercado

Flujo de estados:
```
ENVIADA
   └→ PROCESANDO  (en ejecución en el mercado)
         ├→ COMPLETA   (ejecutada exitosamente)
         └→ CANCELADA  (no se pudo ejecutar)
```

| Estado | Color | Qué ve el usuario |
|--------|-------|-------------------|
| Procesando | 🟡 Amarillo | "Tu orden está siendo procesada" |
| Completa | 🟢 Verde | Precio de ejecución real + acciones recibidas/vendidas |
| Cancelada | 🔴 Rojo | Motivo + botón "Reintentar" |

#### Lista de órdenes
- Orden: cronológico descendente (más reciente primero)
- Cada ítem: tipo de movimiento (Compra/Venta) · logo + ticker · fecha y hora · monto USD · cantidad de acciones · estado con color

#### Vista detalle de una orden
Al tocar un ítem se expande con:

| Campo | Descripción |
|-------|-------------|
| Tipo de orden | Mercado (V1) |
| Activo | Nombre + ticker |
| Fecha y hora de creación | Timestamp exacto |
| Fecha y hora de ejecución | Timestamp exacto (si aplica) |
| Precio de referencia | Al momento de confirmar |
| Precio de ejecución real | Precio al que se ejecutó (puede diferir) |
| Cantidad de acciones | Definitiva post-ejecución |
| Monto final | Monto y moneda ingresados por el usuario |
| Monto final en USD | Si seleccionó ARS |
| Comisión | % aplicado |
| Estado + motivo | Si fue cancelada, el motivo |

---

#### V2 — Órdenes límite

El usuario puede definir un precio objetivo. La orden solo se ejecuta si el activo alcanza ese precio dentro de un período definido.

Flujo de estados:
```
CREADA
   └→ ACTIVA      (esperando que el activo alcance el precio objetivo)
         ├→ EJECUTADA  (se alcanzó el precio y se ejecutó)
         ├→ VENCIDA    (el período venció sin alcanzar el precio)
         └→ CANCELADA  (el usuario la canceló manualmente)
```

| Estado | Color | Qué ve el usuario |
|--------|-------|-------------------|
| Activa | 🟡 Amarillo | Precio objetivo + distancia % al precio actual + tiempo restante |
| Ejecutada | 🟢 Verde | Precio de ejecución + acciones recibidas |
| Vencida | ⚪ Gris | "La orden venció" + opción de recrear |
| Cancelada | 🔴 Rojo | "Cancelada por vos" |

> El usuario puede cancelar una orden límite activa desde esta pantalla. Requiere confirmación.

#### V2 — Órdenes after market

Permite crear órdenes de compra fuera del horario regular del mercado (antes de las 9:30am o después de las 4:00pm ET).

**Cuándo se activa:**
- El sistema detecta automáticamente que el mercado está cerrado
- Aparece un banner en el flujo de compra: *"El mercado está cerrado · Tu orden se ejecutará en el after market (hoy 4pm–8pm ET)"*
- El usuario puede continuar con after market o cancelar y esperar el horario regular

Flujo de estados:
```
PROGRAMADA  (creada fuera del horario de mercado regular)
   └→ EN VENTANA  (dentro del período after market)
         ├→ EJECUTADA
         └→ NO EJECUTADA  (cerró la ventana sin match)
```

#### Estructura del Centro de Órdenes en V2

Con la incorporación de órdenes límite y after market, el Centro de Órdenes incorpora un sistema de tabs:

- **Tab Activas** (default si hay órdenes pendientes): órdenes límite en estado Activa y órdenes after market en estado Programada o En ventana
- **Tab Historial**: todas las órdenes finalizadas (completas, canceladas, vencidas, no ejecutadas)

---

### Módulo 7 — Resultados (Posiciones cerradas) ✅ V1

**¿Qué es?**
El historial de posiciones liquidadas. Muestra activos que el usuario compró y ya vendió en su totalidad, con el resultado final de cada operación.

**Acceso:** Ícono en el header de Inversiones Home.

#### Header
- **G/P total realizado:** Suma de todas las ganancias y pérdidas de posiciones cerradas, en USD
- **Rendimiento total %:** G/P total / suma de lo invertido en esas posiciones × 100

#### Lista de posiciones cerradas
Orden: cronológico descendente por fecha de venta (la más reciente primero).

**Vista colapsada de cada ítem:**
- Logo + ticker + nombre completo
- Fecha de venta
- G/P en USD (verde si ganó, rojo si perdió)
- % de rendimiento de esa operación
- Inversión inicial
- Monto de venta

**Vista expandida (al tocar):**
- Unidades
- Días promedio de tenencia
- P&L por unidad
- Precio promedio de compra por unidad
- Precio de venta por unidad

**Filtros:** Por fecha · Por activo

---

## Resumen V1 vs V2

### ✅ V1 — Lo que sale al lanzamiento

| Módulo | Qué incluye |
|--------|-------------|
| **Home / Portafolio** | Balance, P&L con selector de períodos, barra de distribución, lista de posiciones, indicador de órdenes activas, vista gráfico con comparación |
| **Mercado** | Packs, ETFs, Acciones con filtros y buscador |
| **Detalle del activo** | Precio, gráfico histórico, descripción, noticias (Alpaca/ES), posición del usuario, historial de transacciones, favoritos |
| **Flujo de compra** | Orden de mercado en ARS o USD, resumen con comisión |
| **Flujo de venta** | Orden de mercado en ARS o USD, resumen con comisión |
| **Centro de órdenes** | Órdenes de mercado con estados: Procesando → Completa / Cancelada |
| **Resultados** | Posiciones cerradas con G/P realizado, rendimiento total, historial expandible |

### 🔜 V2 — Próximas iteraciones

| Funcionalidad | Descripción |
|--------------|-------------|
| **Órdenes límite** | El usuario define un precio objetivo; la orden se ejecuta automáticamente si se alcanza dentro del período |
| **After market** | Posibilidad de operar fuera del horario regular del mercado (4pm–8pm ET) |
| **Más estados en Centro de Órdenes** | Tabs Activas/Historial, estados Vencida y No ejecutada |
| **Marcador de precio promedio en gráfico** | Línea o punto de referencia sobre la curva de precio del activo |
| **Valoración / Fundamentals** | Métricas financieras (P/E, Market Cap, márgenes, flujo de caja, etc.) — requiere integración con proveedor externo |
| **Noticias en tiempo real** | Reemplaza las noticias de Alpaca por feed financiero en tiempo real con proveedor externo |

### ⏳ Post-lanzamiento (dependencia externa)
Estas funcionalidades están diseñadas pero requieren integración con un proveedor de datos financieros:
- Sección de **Valoración** completa en el Detalle del activo
- **Noticias financieras** en tiempo real
- **Estados financieros** (P&L, Balance, Flujo de caja) con gráficos anuales y trimestrales

---

## Dependencias técnicas externas

| Proveedor | Qué provee | ¿Cuándo? |
|-----------|-----------|---------|
| **Alpaca** | Ejecución de órdenes, precios en tiempo real, noticias (en inglés) | V1 |
| **Proveedor de FX** | Tipo de cambio ARS/USD para flujos en pesos | V1 |
| **Proveedor de fundamentals** | Valoración, estados financieros, noticias en tiempo real | Post-lanzamiento |

---

## Flujo completo de una compra (V1)

```
Usuario en Home
      │
      ▼
Toca "Comprar" o va a Mercado (Módulo 2)
      │
      ▼
Selecciona un activo → Detalle del activo (Módulo 3)
      │
      ▼
Toca "Comprar" → Flujo de compra (Módulo 4)
      │  Selecciona moneda (ARS/USD)
      │  Ingresa monto
      │  Revisa resumen (cantidad estimada + comisión)
      │
      ▼
Confirma compra → Orden disparada
      │
      ▼
Centro de Órdenes (Módulo 6)
      │  Estado: Procesando 🟡
      │       │
      │       ├─ Éxito → Completa 🟢 (precio real + acciones recibidas)
      │       └─ Error  → Cancelada 🔴 (motivo + botón Reintentar)
      │
      ▼
Banner en Home se actualiza con el estado
La posición aparece en la lista del portafolio
```
