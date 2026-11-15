---
theme: default
title: Del CRUD real-time
titleTemplate: '%s · Night terminal'
info: |
  Caso práctico de una app de reparto con una cola de eventos persistida.
  Basado en script.md.
author: ''
colorSchema: dark
background: '#111b17'
fonts:
  provider: none
  sans: IBM Plex Mono
  mono: IBM Plex Mono
layout: default
class: cover
aspectRatio: 16/9
canvasWidth: 980
duration: 35min
drawings:
  persist: false
exportFilename: del-crud-al-tiempo-real
mdc: false
---

# Del CRUD al<br>real-<span class="accent">time</span>

<div class="cover-subtitle">Una app de reparto que funciona sin cobertura</div>

<div class="cover-bottom">Un caso real de arquitectura orientada a eventos</div>

<!--
 La charla sigue nuestro razonamiento a la hora de implementarla para solucionar frustraciones que nuestros clientes tenían. No estoy dando una receta universal de infraestructura. Es un caso concreto de una aplicación de reparto. 
 
 Esta historia empieza en una startup con cinco años que había vivido el pico de la promoción de la digitalización.
-->

---
class: statement
---

# Los clientes<br>se estaban <span class="warning-text">yendo</span>

<div class="statement-sub">Algunos acababan rechazando la digitalización de su logística</div>

<!--
Tras la cresta de la ola empezó a surgir un problema: el churn.
Los clientes se iban tan frustrados que algunos llegaban incluso a rechazar por completo la digitalización de su logística incluso con otras soluciones.

Empezaron las preguntas incómodas porque no solo perdíamos clientes frente a la competencia. El nivel de frustración del usuario era extremo. Preguntamos a usuarios, revisamos el producto y conectamos el feedback externo con lo que el equipo encontraba cada día.
-->

---
---

# Dos perfiles, el mismo problema

<div class="split voices">
<div><div class="index">[repartidor]</div><h2>La app es<br>demasiado lenta</h2><p>Esperas constantes.<br>Entregas que no puede completar.</p></div>
<div><div class="index">[logística]</div><h2>Los datos<br>no cuadran</h2><p>Acciones que no llegan.<br>Estados que no reflejan el reparto.</p></div>
</div>

<div class="takeaway">La información que daba valor al producto nacía en el móvil</div>

<!--
Habíamos diseñado el producto para los directores de logística y para los repartidores. Queríamos ahorrar gestión, papeleo y decisiones repetitivas. Pero quienes debían ser promotores se habían convertido en detractores. Cuando la app era lenta, los repartidores dejaban de usarla. Si no registraban lo que pasaba, el panel perdía valor. Las dos quejas estaban relacionadas.
-->

---
---

# Habíamos perdido el mapa del producto

<div class="terminal-output">
<div><span class="warning-text">[config]</span> Desarrollos a medida para los primeros clientes</div>
<div><span class="warning-text">[flags] </span> Dependencias e incompatibilidades poco visibles</div>
<div><span class="warning-text">[docs]  </span> El nombre de una flag era toda la documentación que había</div>
<div><span class="warning-text">[bugs]  </span> Cada combinación añadía complejidad</div>
</div>

<div class="takeaway">No conocíamos bien el producto que habíamos construido</div>

<!--
Las concesiones iniciales tenían sentido: adaptar el producto a grandes clientes ayudó a arrancar. Sin embargo al crecer las combinaciones de módulos y ajustes hicieron el producto frágil y las flags ni siquiera describían el comportamiento real. Nos repartimos su investigación para reconstruir un árbol de dependencias y decidir cómo queríamos que funcionase la aplicación.
-->

---
class: statement
---

# Necesitábamos<br><span class="accent">primitivos sólidos</span>

<div class="statement-sub">Menos formas de hackear el producto.<br>Menos fricción al registrar cada entrega.</div>

<!--
Llegamos a conclusión de que no conocíamos el producto, que era frágil y que cada persona lo hacía funcionar a su manera. Simplificar significaba construir funcionalidades sobre piezas fiables. Los repartidores eran la base del sistema: ellos registraban la información. Hacer su trabajo más fácil mejoraba el producto para todos.
-->

---
---

# La app ya estaba en obras

<div class="upgrade-list">
<p>Angular 7 a <strong class="accent">Angular 20</strong></p>
<p>Cordova a <strong class="accent">Capacitor 7</strong></p>
<p>Ionic 3 a <strong class="accent">Ionic 7</strong></p>
</div>

<p class="support">Rediseñamos la app. Aquí nos centramos en completar entregas sin una buena conexión.</p>

<!--
En ese momento yo estaba actualizando la aplicación móvil de Angular 7 a Angular 20, de Cordova a Capacitor 7 y de Ionic 3 a Ionic 7. Esa migración me había dado bastante contexto sobre las limitaciones técnicas. La investigación del producto completó ese conocimiento y dio paso al rediseño de la aplicación desde cero. De todos los problemas que resolvimos, aquí nos centramos en uno: completar una entrega dependía de tener una buena conexión.
-->

---
---

# Ruta y servicio

<div class="domain-diagram">
<div><h2>Ruta</h2><p>La jornada de reparto</p></div><div class="relation">N : N</div><div><h2>Servicio</h2><p>Cada trabajo de reparto que debe realizar el repartidor</p></div>
</div>

<div class="process-strip"><span>Panel / API / Excel</span><span>Creación de rutas</span><span>Asignación</span><span>App móvil</span></div>

<p class="support">Un servicio puede volver a otra ruta si no se entrega el primer día.</p>

<!--
El sistema tenía tres piezas: panel, app y backend. Los servicios se introducían manualmente, por Excel o por API. Se creaban rutas y el backend asignaba servicios. Ruta y Servicio concentran gran parte de la lógica de negocio del móvil. Su relación era muchos a muchos, porque una entrega fallida podía reaparecer en una ruta posterior.
-->

---
class: delivery-day
---

# El día a día del repartidor.

<div class="wait-list">
<div><span>01</span><strong>Cargar el listado</strong><code>HTTP</code><span class="warning-text">esperar</span></div>
<div><span>02</span><strong>Iniciar ruta</strong><code>HTTP</code><span class="warning-text">esperar</span></div>
<div><span>03</span><strong>Abrir un servicio</strong><code>HTTP</code><span class="warning-text">esperar</span></div>
<div><span>04</span><strong>Completar la entrega</strong><code>HTTP</code><span class="warning-text">esperar</span></div>
<div><span>05</span><strong>Volver al listado</strong><code>HTTP</code><span class="warning-text">esperar</span></div>
<div><span>06</span><strong>Cargar el listado</strong><code>HTTP</code><span class="warning-text">esperar</span></div>
<div><strong>...</strong></div>
</div>

<p class="support">Cada acción esperaba al servidor</p>

<!--
Ahora vamos a ver cómo era la experiencia de un repartidor.

La lista inicial cargaba solo algunos campos del servicio. Iniciar la ruta cambiaba su estado y recalculaba los ETA. Abrir el servicio cargaba todos los datos. Al completar, el usuario sobreescribía campos de la entidad y mandaba el resultado al backend, que validaba y recalculaba de nuevo. Volver al listado también implicaba una carga. La UI esperaba la respuesta de cada petición HTTP a Spring Boot antes de dejar continuar. Las peticiones no bloqueaban el hilo de JavaScript: el bloqueo era del flujo de trabajo del usuario.
-->

---
class: number-slide
---

<div class="split number-split"><div class="big-number warning-text">1</div><div><h1>entrega offline</h1><p>Después, el repartidor quedaba bloqueado hasta recuperar la conexión.</p></div></div>

<div class="takeaway">El usuario cierra la app durante la subida: 💀</div>

<!--
Si el repartidor no tiene cobertura se guardaba la última entrega en una variable y esperábamos. Si la conexión no volvía, no se podía completar la siguiente. Esto ocurría en sótanos, almacenes o lugares remotos. Con poca cobertura, una foto podía mantener la pantalla de carga durante mucho tiempo. Si el usuario cerraba la app desde la multitarea, se perdía el progreso. Ese comportamiento explicaba parte de las inconsistencias del panel.
-->

---
---

# La conexión fallaba antes del broker

<div class="boundary-diagram"><div><strong>App móvil</strong><span>La acción nace aquí</span></div><div class="broken-link">conexión<br>interrumpida</div><div><strong>Backend</strong><span>El broker vive aquí</span></div></div>

<div class="takeaway">Necesitábamos persistencia en ambos extremos</div>

<p class="support">Kafka o RabbitMQ no resuelven por sí solos el tramo entre móvil y backend.</p>

<!--
La primera tentación era introducir RabbitMQ o Kafka. Son herramientas capaces de resolver mensajería una vez la información llega al backend, pero el fallo que sufría el repartidor ocurría antes. Necesitábamos que el móvil siguiera trabajando sin conexión y que el backend pudiera recibir la sincronización de muchos clientes tras una caída. El problema tenía dos extremos.
-->

---
---

# Lo que debía garantizar cada extremo

<div class="split requirements">
<div><div class="index">[móvil]</div><ul><li>Respuesta inmediata en la UI</li><li>Acciones y fotos persistidas</li><li>Estado de sincronización visible</li><li>Cambios externos sin perder trabajo</li></ul></div>
<div><div class="index">[servidor]</div><ul><li>Recepción duradera de los lotes</li><li>Almacenamiento común a 3 nodos</li><li>Confirmación y resultado final</li><li>Historial auditable</li></ul></div>
</div>

<div class="takeaway">La sincronización debía respetar el rendimiento de la UI</div>

<!--
El móvil debía mostrar los cambios inmediatamente, poder encolar archivos pesados y explicar si estaba offline, enviando o al día. También podía recibir cambios del panel mientras acumulaba acciones locales. En el servidor necesitábamos absorber peticiones, compartir el almacenamiento entre tres nodos y no perder datos si uno dejaba de funcionar. Había que separar la confirmación de recepción del resultado del procesamiento, y poder auditar lo sucedido.
-->

---
---

# Un event-bus propio, para este contexto

<div class="terminal-output compact-output">
<div><span class="accent">[equipo]</span> Sin experiencia previa con Kafka o RabbitMQ</div>
<div><span class="accent">[carga] </span> El volumen previsto cabía en el setup existente</div>
<div><span class="accent">[infra] </span> La complejidad añadida nos frenaba en ese momento</div>
</div>

<p class="support prominent">Elegimos una cola persistida sobre la infraestructura que ya conocíamos.</p>

<!--
No descartamos esas herramientas por sus capacidades. El equipo no había trabajado con ellas y su operación añadía complejidad. El número de usuarios y la carga prevista eran modestos. Construir esta pieza con lo que conocíamos nos parecía una decisión proporcionada. No presentamos benchmarks ni afirmamos que una implementación propia sea preferible en general: esta decisión dependía de nuestro contexto.
-->

---
class: statement
---

# Cada escritura<br>se convierte en<br><span class="accent">un evento</span>

<div class="statement-sub">La acción conserva su identidad y su payload.</div>

<!--
Hasta entonces enviábamos una entidad cuyos campos se habían sobreescrito. A partir de aquí describimos la operación que el usuario realizó. El evento lleva un tipo, los datos necesarios y una identidad. Ese cambio nos permite conservar la intención de la acción, reintentar su envío y relacionar su resultado sin depender de mantener abierta una petición HTTP.
-->

---
---

# La forma de una acción

<div class="code-caption">Ejemplo reducido de un evento</div>

```json
{
  "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76",
  "kind": "SERVICE_COMPLETED",
  "creationTimestamp": 1793867600,
  "payload": { "serviceId": "service-42", "status": "OK" },
  "metadata": { "contractVersion": "1" }
}
```

<div class="takeaway">La identidad del evento permite seguir la misma acción durante todo el flujo</div>

<!--
El guion incluye llegada, firma, tracking y finalización. Aquí usamos un único evento para que se lea su estructura. El UUIDv7 se genera en el frontend de origen. creationTimestamp representa cuándo ocurrió la acción, no cuándo conseguimos enviarla. contractVersion permite comprobar qué contrato usó el productor. Este JSON es un ejemplo reducido, no la definición completa de la API. El batch completo aparece en el apéndice.
-->

---
---

# Un contrato, dos validaciones

<div class="contract-source">OpenAPI <span class="muted">/ contrato versionado</span></div>
<div class="split validation"><div><div class="index">[frontend]</div><h2>Zod</h2><p>Feedback inmediato.<br>Validación del payload.</p></div><div><div class="index">[backend]</div><h2>Jakarta Validation</h2><p>Payload y reglas sobre<br>el estado actual.</p></div></div>

<div class="takeaway">CI comprueba la versión del contrato. Los conflictos van a conciliación.</div>

<!--
Validamos en el front para responder rápido y volvemos a validar en el servidor antes de aplicar nada. Ambos usan un contrato común definido con OpenAPI: Zod en frontend y Jakarta Validation en backend. CI comprueba que los paquetes usen la misma versión. Eso reduce divergencias, pero no evita que una acción válida offline choque con un estado que ha cambiado. El backend conserva esa acción y la deriva a conciliación, sin aplicar automáticamente el cambio solicitado.
-->

---
---

# Historial y estado actual

<div class="storage-rows"><div><code>Route_events</code><span class="muted">historial</span><code>Route</code><span>proyección actual</span></div><div><code>Service_events</code><span class="muted">historial</span><code>Service</code><span>proyección actual</span></div></div>

<div class="transaction-note">Una transacción guarda el evento aplicado y actualiza su proyección.</div>

<p class="support">Los frontends leen las proyecciones. El backend conserva el historial para reconstruir y auditar.</p>

<!--
Creamos Route_events y Service_events como fuente de verdad. Mantuvimos Route y Service como proyecciones del estado actual, para no reconstruir cada entidad en cada lectura. Guardar el evento aplicado y actualizar la proyección en la misma transacción evita que queden desalineados por una escritura parcial. El móvil no descarga ni reproduce todo el historial. El panel puede consultarlo al investigar una discrepancia.
-->

---
---

# UUIDv7 aporta identidad y localidad

<div class="split explanation"><div><div class="index">[identidad]</div><h2>Se genera<br>en el origen</h2><p>La acción ya tiene ID mientras el dispositivo sigue offline.</p></div><div><div class="index">[índice]</div><h2>Componente<br>temporal</h2><p>Favorece la localidad de inserciones frente a IDs totalmente aleatorios.</p></div></div>

<div class="takeaway warning-line">No garantiza orden global ni elimina la fragmentación</div>

<!--
El componente temporal de UUIDv7 favorece la localidad de las inserciones en un B-tree frente a identificadores totalmente aleatorios. No conviene exagerar esa propiedad: los eventos de dispositivos offline pueden llegar mucho después, y los relojes tampoco establecen un orden global fiable. El identificador de un evento sirve para su identidad. La resolución de conflictos requiere reglas adicionales.
-->

---
class: ack-slide
---

# <span class="accent">202</span> Accepted

<p class="ack-definition">El backend ha persistido la recepción.<br>El procesamiento continúa después.</p>

<div class="takeaway">Recibido y procesado son dos momentos distintos</div>

<!--
Antes de confirmar la recepción guardamos el lote recibido en mobile_app_events, un almacenamiento central compartido por los nodos. Después puede procesarse de forma asíncrona. Así una caída de un nodo no implica perder los datos ya recibidos. Si hay un error que requiere inspección, la petición se conserva en una dead-letter inbox.
-->

---
---

# Dos endpoints y un canal de resultados

<div class="server-flow endpoint-flow">
<div><span>01 / endpoint</span><h2>Recibir</h2><code>lote de eventos</code><p>Persistir y responder con HTTP 202</p></div>
<div><span>02 / endpoint</span><h2>Consultar</h2><code>estado de eventos</code><p>Recuperar una resolución que no llegó</p></div>
<div><span>canal</span><h2>Comunicar</h2><code>resultado final</code><p>SSE, polling o Firebase Cloud Messaging</p></div>
</div>

<div class="takeaway">La recepción del lote y la resolución de sus eventos tienen contratos distintos</div>

<!--
Necesitamos dos endpoints para recibir y consultar eventos, además de un mecanismo para comunicar las resoluciones. La entrada guarda la petición antes de responder 202. La consulta recupera el estado de los eventos cuando el móvil no ha recibido alguna resolución. Para comunicar el resultado podemos usar SSE, polling o Firebase Cloud Messaging, mi opción favorita para dispositivos móviles. No son tres endpoints obligatorios ni se asume que todos esos transportes se utilicen a la vez. Cada resolución incluye eventId, código HTTP y mensaje de error si corresponde.
-->

---
---

# eventId es la clave de idempotencia

<table class="idempotency-table">
<thead><tr><th>eventId</th><th>Contenido</th><th>Acción del backend</th></tr></thead>
<tbody>
<tr><td>Nuevo</td><td>Evento recibido</td><td>Procesar el evento</td></tr>
<tr><td>Ya existe</td><td>Igual</td><td class="accent">Ignorar el duplicado</td></tr>
<tr><td>Ya existe</td><td>Distinto</td><td class="warning-text">Alarma en Slack</td></tr>
</tbody>
</table>

<div class="takeaway">Una acción conserva su eventId aunque vuelva a enviarse</div>

<!--
Si perdemos la respuesta, no sabemos por ese hecho si el evento llegó o no. Al reenviarlo, el eventId permite reconocer la misma acción en el backend. Cuando ya existe ese identificador, comparamos el contenido: si el evento es el mismo, ignoramos el duplicado. Si el mismo eventId aparece con otro contenido, activamos una alarma en Slack para investigarlo. Hasta donde pude comprobar, ese último caso no llegó a ocurrir. La idempotencia aquí descrita se basa en la identidad y la comparación del evento, no en asumir que la red entrega una sola vez.
-->

---
---

# El recorrido en el backend

<div class="server-flow">
<div><span>01</span><h2>Persistir</h2><code>mobile_app_events</code><p>Confirmar con HTTP 202</p></div>
<div><span>02</span><h2>Procesar</h2><code>evento + proyección</code><p>Validar el estado actual</p></div>
<div><span>03</span><h2>Resolver</h2><code>eventId + resultado</code><p>Comunicar la resolución final</p></div>
</div>

<div class="takeaway">Cada evento se mapea a una operación que ya existía</div>

<!--
La entrada conserva la petición y el bus la procesa después. Para cada evento aplicable se guarda el historial y se actualiza la proyección. Una acción conflictiva se conserva para conciliación. La resolución contiene el eventId, el código HTTP y un mensaje de error si corresponde. Podemos comunicarla por SSE, polling o Firebase Cloud Messaging, mi opción favorita para dispositivos móviles. La consulta permite recuperar resultados que el dispositivo no haya recibido. Reutilizamos la mayoría de la lógica existente: el adaptador de eventos llama a sus métodos.
-->

---
---

# Cuándo ocurrió y cuándo llegó

<div class="time-equation">hora estimada del evento<br><span class="accent">= reloj del dispositivo + offset</span></div>

<div class="time-steps"><p><strong>Al abrir la app</strong><span>Consultar hora del servidor y estimar latencia</span></p><p><strong>Durante el uso offline</strong><span>Aplicar el último offset guardado</span></p></div>

<div class="takeaway warning-line">Mejora la estimación. No ordena globalmente ni resuelve conflictos.</div>

<!--
Al abrir la app consultamos la hora del servidor y estimamos la diferencia con el dispositivo teniendo en cuenta la latencia. Guardamos el offset y el momento de la última sincronización. Podemos aplicarlo al crear eventos sin cobertura. Pero el reloj puede desviarse o cambiar manualmente después. Nuestra implementación no detectaba esos cambios. Eso seguía siendo una limitación. El timestamp nos ayuda a entender lo ocurrido, no decide por sí solo qué acción debe ganar.
-->

---
class: statement
---

# Completar.<br><span class="accent">Seguir repartiendo.</span>

<div class="statement-sub">La UI responde después de guardar la acción localmente.<br>La sincronización continúa en segundo plano.</div>

<!--
Hasta ahora solo hemos preparado el backend. El repartidor todavía no percibe ninguna mejora. Volvamos al momento en que pulsa Completar: lo que necesita es ver la entrega completada y su siguiente destino, con o sin cobertura. La UI optimista anticipa el resultado, como un like. En este caso además tenemos que conservar la acción si cierra la app. La secuencia deseada es validar, persistir y permitir continuar, mientras se comunica que falta sincronizar. Los fallos no siempre se pueden revertir sin más: algunos requieren corrección o conciliación.
-->

---
---

# Los datos también deben estar offline

<div class="server-flow offline-reads">
<div><span>01</span><h2>Consultar</h2><p>Al iniciar la app, obtener los servicios de ese día</p></div>
<div><span>02</span><h2>Guardar</h2><p>Conservar el listado en el dispositivo</p></div>
<div><span>03</span><h2>Refrescar</h2><p>Actualizar periódicamente los datos locales</p></div>
</div>

<div class="takeaway">La cola conserva las escrituras. El listado local permite disponer de los datos.</div>

<!--
La UI optimista y la cola de escrituras no bastan para disponer de la información sin conexión. Al iniciar la aplicación comprobamos qué servicios tiene el usuario para ese día y guardamos el listado localmente. Lo refrescamos periódicamente. Separamos así dos necesidades: tener los datos disponibles para trabajar y conservar las acciones pendientes de sincronizar. Este mecanismo no implica descargar todo el historial de eventos ni garantiza que pueda arrancarse con datos de una jornada que nunca se haya descargado.
-->

---
---

# Una superficie pequeña

<div class="code-caption">API conceptual de SyncService</div>

```ts
interface SyncService {
  push(event: AppEvent, callback?: OnResolution): void
  readonly queue$: Observable<QueueEvent[]>
}
```

<div class="split api-detail"><div><code>push()</code><p>Las escrituras entran por un único punto.</p></div><div><code>queue$</code><p>La UI observa las acciones y sus estados.</p></div></div>

<div class="takeaway">Los productores reciben el servicio mediante inyección de dependencias</div>

<!--
SyncService contiene el bus y recibe las escrituras que pueden ejecutarse de forma asíncrona. La API pública es reducida: push y queue$. El ejemplo explica esa forma, no pretende definir la firma exacta de producción ni su contrato de retorno. Los tipos son conceptuales. Un productor valida los campos de la pantalla, crea el evento y lo pasa al servicio. El motor deduplica y valida de nuevo el payload con Zod antes de añadirlo a la cola.
-->

---
---

# La persistencia viene antes del envío

<div class="local-flow"><div><span>01</span><h2>Crear</h2><p>Validar campos<br>Generar el evento</p></div><div><span>02</span><h2>Encolar</h2><p>Deduplicar<br>Validar con Zod</p></div><div class="highlight-step"><span>03</span><h2>Persistir</h2><p>Conservar la acción<br>Permitir continuar</p></div><div><span>04</span><h2>Enviar</h2><p>Cuando la cola<br>pueda trabajar</p></div></div>

<div class="takeaway">Cerrar la app no debe borrar las acciones pendientes</div>

<!--
Lo importante no es solo mantener una lista en memoria. La cola se persiste para recuperar las acciones después de cerrar y abrir la app. La conectividad se gestiona fuera de la cola: un listener la pausa o la reanuda. Mientras está pausada, siguen entrando acciones persistidas, pero no se lanzan nuevos envíos. Ese límite mantiene separado el almacenamiento de la decisión de cuándo usar la red.
-->

---
---

# Agrupar para usar menos la red

<div class="split batch-numbers"><div><strong class="accent">200<span>ms</span></strong><p>Ventana que se renueva<br>con cada nuevo evento</p></div><div><strong>5<span>s</span></strong><p>Máximo de espera<br>antes de enviar el lote</p></div></div>

<div class="batch-details"><span>JSON de eventos + metadatos del lote</span><span>FormData cuando hay archivos</span></div>

<div class="takeaway">Sin conexión, la cola se pausa para ahorrar batería</div>

<!--
Agrupamos las escrituras en lotes. Esperamos 200 milisegundos y renovamos la ventana si llega otro evento, con un máximo de cinco segundos. No es una promesa de latencia de procesamiento ni aplica cuando la cola está pausada. El lote incorpora identidad de usuario y dispositivo, versión, reintentos y sus eventos. El handler prepara el JSON y añade los archivos en FormData cuando corresponda. Las fotos deben conservarse localmente hasta poder enviarlas.
-->

---
---

# Estado local y estado del servidor

<div class="state-list"><div><code>in-progress</code><span>La cola prepara y agrupa los eventos</span></div><div><code>sending</code><span>El handler está enviando el lote</span></div><div><code>processing</code><span>El servidor ha respondido 202</span></div><div><code class="accent">OK / FAIL</code><span>Llega la resolución de cada evento</span></div></div>

<div class="takeaway">HTTP 202 deja los eventos en processing hasta su resolución final</div>

<!--
El guion distingue in-progress al preparar el lote, sending al enviarlo y processing cuando el servidor acepta la recepción. Después llega el resultado asíncrono. Correlacionamos cada resolución con su evento, volvemos a persistir el estado y ejecutamos los callbacks. No confundimos una respuesta HTTP de aceptación con la aplicación de la operación. Tampoco usamos el orden de llegada de las respuestas como identidad.
-->

---
---

# La resolución también se persiste

<div class="server-flow resolution-flow">
<div><span>01</span><h2>Relacionar</h2><code>eventId</code><p>Encontrar el evento de cada resolución</p></div>
<div><span>02</span><h2>Persistir</h2><code>estado de la cola</code><p>Guardar el resultado recibido</p></div>
<div><span>03</span><h2>Notificar</h2><code>callbacks</code><p>Comunicar la resolución a sus consumidores</p></div>
</div>

<div class="takeaway">Primero se guarda el estado resuelto. Después se ejecutan los callbacks.</div>

<!--
Una vez recibida la respuesta final, mapeamos cada resolución al evento, volvemos a persistir el estado y ejecutamos los callbacks. La persistencia no termina al encolar o enviar: también hay que conservar el resultado del procesamiento. Así distinguimos el evento enviado, el aceptado y el que ya tiene una resolución guardada localmente. El mecanismo de consulta cubre los casos en que esa resolución no llega al dispositivo.
-->

---
---

# Cuando el envío falla

<div class="recovery-list"><div><strong>Falla el lote</strong><p>Deshacer el agrupamiento y reintentar eventos individualmente, con baja cadencia.</p></div><div><strong>Persiste un fallo de red o servidor</strong><p>Pausar la cola. Comprobar disponibilidad fuera de ella y reanudar después.</p></div><div><strong>La petición devuelve 400</strong><p>Conservar el progreso por una vía de emergencia y avisar del problema grave.</p></div></div>

<!--
Estas son las decisiones que describe el guion. Ante un fallo del lote, deshacemos el agrupamiento de transporte, no borramos las acciones persistidas. Reintentamos individualmente para aislar problemas. Si siguen los fallos de conexión o del servidor, pausamos y dejamos que un mecanismo externo compruebe disponibilidad. El caso 400 se trata como un error grave: se manda la información a un endpoint de emergencia para inspección y se informa al usuario de que no puede continuar y debe verificar el estado del servicio. No extendemos esa regla a todos los 4xx ni inventamos una política para cada código. Los eventos siguen persistidos aunque cambie su agrupamiento para el transporte.
-->

---
---

# El repartidor ve qué falta

<div class="split notifications-layout"><div><div class="index">[sincronización]</div><h2>Offline.<br>Enviando.<br>Error.<br><span class="accent">Al día.</span></h2><p>Detalle al tocar el aviso.<br>Acceso desde el menú lateral.</p></div><div class="notification-demo"><SyncNotifications compact /></div></div>

<!--
Nos inspiramos en los pop-ups de los AirPods. El aviso resume el estado y abre una sheet con el detalle. En la pantalla principal hay espacio para mostrarlo. En otras pantallas se oculta, salvo cuando cambia el estado: aparece durante unos segundos, con feedback háptico ligero, y desaparece. También queda accesible desde el menú lateral. El componente visual del repositorio reproduce los cuatro estados; los contadores son ilustrativos, no métricas del proyecto.
-->

---
---

# Un error que el usuario puede corregir

<div class="correction-flow"><div><span>01</span><h2>Ver el fallo</h2><p>Un evento y una explicación comprensible</p></div><div><span>02</span><h2>Volver al contexto</h2><p>La misma pantalla donde ejecutó la acción</p></div><div><span>03</span><h2>Corregir y enviar</h2><p>Una nueva oportunidad de completar su trabajo</p></div></div>

<div class="takeaway">El móvil muestra los errores que el repartidor puede remediar</div>

<!--
El detalle de la sincronización enumera las acciones con un resumen. Si una falla y puede arreglarla el repartidor, al tocarla lo llevamos a la pantalla donde realizó esa acción. Puede corregir los datos y enviarlos de nuevo. Mostrar un código técnico no basta: el estado necesita una salida útil. Otros conflictos requieren más contexto y deben resolverse desde logística.
-->

---
---

# Dos acciones válidas pueden entrar en conflicto

<div class="conflict-timeline"><div><div class="index">[panel]</div><h2>Servicio completado</h2><p>Logística actualiza el servicio.</p></div><div><div class="index">[móvil offline]</div><h2>Servicio con incidencia</h2><p>El repartidor guarda otra acción.</p></div></div>

<div class="conflict-result">Al sincronizar, el backend encuentra una discrepancia.</div>

<div class="takeaway warning-line">Conservar la acción y derivarla a conciliación, sin aplicarla automáticamente</div>

<!--
Un contrato compartido no evita este caso. El panel puede marcar como completado un servicio mientras el repartidor está offline y registra una incidencia. Cuando llega esa acción, el estado del backend ha cambiado. No elegimos un ganador usando solo el timestamp, ni tratamos la hora del dispositivo como autoridad. Conservamos la acción recibida y damos al director de logística las herramientas para revisar la discrepancia.
-->

---
---

# Conciliación con contexto

<div class="reconcile-lines"><div><span class="accent">servicio</span><p>Estado actual y datos relevantes</p></div><div><span class="accent">historial</span><p>Eventos enviados y resultados</p></div><div><span class="accent">decisión</span><p>Logística revisa y solventa la discrepancia</p></div></div>

<div class="takeaway">La trazabilidad convierte una inconsistencia en un caso que se puede investigar</div>

<!--
En el panel hay una pantalla de conciliación. El director puede ver qué servicios tienen discrepancias, inspeccionar los datos y revisar cada evento recibido. El historial aporta el contexto que antes no existía. No afirmamos que todos los conflictos se resuelvan solos: aquí la revisión humana forma parte del diseño. La acción del repartidor se conserva aunque no se aplique automáticamente.
-->

---
---

# Los fallos también necesitan trazabilidad

<div class="observability"><div><span>01</span><h2>PostHog</h2><p>Error tracking por defecto en la aplicación</p></div><div><span>02</span><h2>Canal de cola</h2><p>Avisos de cola, payloads malformados y colisiones de eventId</p></div><div><span>03</span><h2>Contexto</h2><p>Errores del backend y trazas de ejecución relacionadas</p></div></div>

<div class="takeaway">Conectar la acción del usuario con el fallo que hay que investigar</div>

<!--
Usábamos el seguimiento de errores de PostHog. Los errores de la cola tenían un canal propio en Slack y se relacionaban con los errores y trazas de ejecución del backend. Entre los avisos estaban los payloads malformados y los eventos con el mismo eventId pero distinto contenido. El objetivo era disponer de todo el contexto para investigar el fallo sin reconstruir la historia manualmente.
-->

---
class: statement
---

# Querían quedarse<br>en <span class="accent">la beta</span>

<div class="statement-sub">Al anunciar la vuelta a la versión anterior,<br>muchos usuarios pidieron seguir con la nueva app.</div>

<!--
Unos seis meses antes del lanzamiento general dimos acceso a una beta a usuarios que querían probarla durante un par de semanas. Cuando les avisamos de que volverían automáticamente a la versión anterior tras recoger feedback, muchos pidieron quedarse. El consenso era que la app se sentía instantánea y mucho más rápida. También habíamos rediseñado la aplicación, así que no podemos atribuir todo ese feedback exclusivamente a la cola. No tenemos aquí métricas aisladas de rendimiento ni de churn.
-->

---
class: closing
---

# «Es el día<br>y <span class="accent">la noche</span>»

<div class="closing-sub">El repartidor puede seguir trabajando.<br>El sistema conserva y sincroniza sus acciones.</div>

<div class="cover-bottom">Preguntas</div>

<!--
Un mes después del lanzamiento general dejé de trabajar en la empresa, así que no conozco cómo evolucionó el sistema después. Me quedo con los comentarios de los repartidores: era el día y la noche. La arquitectura importó porque cambió una acción cotidiana. El usuario podía seguir trabajando, sabiendo qué quedaba por sincronizar, y el equipo podía investigar qué había pasado. Este es el cierre de la charla. Las diapositivas siguientes son material de apoyo para preguntas.
-->

---
class: appendix
---

# Una actualización borraba el formulario

<div class="split incident"><div><div class="index warning-text">[problema]</div><h2>La ruta cambia<br>mientras escribes</h2><p>Se reordena el listado y el detalle salta a otro servicio.</p></div><div><div class="index accent">[solución]</div><h2>Fijar el servicio<br>que se está editando</h2><p>Las actualizaciones respetan la identidad de ese servicio.</p></div></div>

<div class="takeaway">Recibir datos nuevos no debe destruir el trabajo en curso</div>

<!--
Este fue uno de los problemas concretos que aparecieron. Mientras el repartidor completaba un servicio, una actualización asíncrona cambiaba el orden de los servicios. La pantalla podía cambiar de entidad y borrar lo rellenado. La solución consistió en guardar qué servicio estaba editando al entrar en su detalle y respetar esa identidad cuando llegaban actualizaciones. La selección debe representar el servicio, no su posición accidental en el listado.
-->

---
class: appendix
---

# Si una resolución no llega al móvil

<div class="local-flow recovery-flow">
<div><span>01</span><h2>Recuperar</h2><p>Al abrir, cargar el event-bus persistido</p></div>
<div><span>02</span><h2>Localizar</h2><p>Identificar eventos todavía sin resolución</p></div>
<div><span>03</span><h2>Consultar</h2><p>Pedir su estado al backend</p></div>
<div class="highlight-step"><span>04</span><h2>Conciliar</h2><p>Reconciliar la información local</p></div>
</div>

<div class="takeaway">Se comprueba al abrir la app y al volver al primer plano</div>

<!--
Hubo un caso extraño en que las resoluciones no llegaron a un usuario. Por eso, al volver al primer plano consultamos el estado de los eventos que todavía no tienen resolución y reconciliamos la información local. Al abrir la aplicación hacemos la misma comprobación, una vez recuperado el event-bus persistido. No asumimos que la ausencia de una notificación implique que la operación no se haya ejecutado, ni empezamos aplicando otra vez las acciones: primero consultamos el estado que conoce el servidor.
-->

---
class: appendix
---

# Un lote conserva ambas identidades

<div class="code-caption">Ejemplo reducido. Cada evento tiene su propio eventId.</div>

```json
{
  "transactionId": "01a1aad1-b80d-7348-8bc7-19875207892d",
  "user_id": "01a1bafb-9334-7e47-86fe-d753b3ffc1ed",
  "device_id": "01a1bafb-9334-72e2-9ee9-644059a61746",
  "sentTimestamp": 1793867700,
  "events": [{
      "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76",
      "kind": "SERVICE_COMPLETED", "creationTimestamp": 1793867600,
      "payload": { "serviceId": "service-42", "status": "OK" },
      "metadata": { "contractVersion": "1" }
  }]
}
```

<!--
transactionId identifica el lote y eventId identifica la acción y actúa como clave de idempotencia. Reenviar la misma acción conserva su eventId; una acción distinta tiene otro identificador. El lote incluye usuario, dispositivo y momento de envío. El ejemplo reduce el payload a un servicio ilustrativo. Los archivos se añaden mediante FormData; la URI local sirve para localizar el archivo en el dispositivo, no para que el backend lo abra.
-->

---
class: appendix
---

# Garantías y límites del diseño

<div class="limits-list"><div><strong>Idempotencia por eventId</strong><p>El backend ignora el mismo evento si ya existe con igual contenido.</p></div><div><strong>Identidad inconsistente</strong><p>Mismo eventId y distinto contenido: alarma en Slack.</p></div><div><strong>Orden entre dispositivos</strong><p>UUIDv7 y el offset de reloj no establecen un orden global.</p></div><div><strong>Conflictos de negocio</strong><p>Un payload válido puede requerir conciliación con el estado actual.</p></div></div>

<!--
Un envío puede haber llegado aunque la respuesta se pierda. El eventId permite al backend reconocerlo: si ya existe con el mismo contenido, ignora el duplicado; si cambia el contenido, activa una alarma en Slack. Esta idempotencia no establece el orden entre dispositivos ni hace desaparecer los conflictos de negocio. La comparación de contenido, los timestamps y las reglas de conciliación tienen responsabilidades distintas.
-->

---
class: appendix
---

# Las decisiones que sostienen el flujo

<div class="terminal-output checklist-output">
<div><span class="accent">[local]   </span> Persistir antes de depender de la red</div>
<div><span class="accent">[ingesta] </span> Confirmar después de guardar la recepción</div>
<div><span class="accent">[reenvío] </span> Mismo eventId y contenido: ignorar duplicado</div>
<div><span class="accent">[aplicado]</span> Evento y proyección en una transacción</div>
<div><span class="accent">[conflicto]</span> Conservar la acción y revisarla</div>
<div><span class="accent">[usuario] </span> Mostrar pendientes y permitir corregir</div>
</div>

<!--
Resumen de apoyo para preguntas. El almacenamiento de entrada y el historial de eventos tienen papeles distintos. mobile_app_events conserva lo recibido antes de procesarlo; Route_events y Service_events registran el historial de dominio, mientras Route y Service sirven las lecturas. La persistencia local cubre el tramo móvil-backend. El estado de sincronización y la conciliación hacen visible el trabajo pendiente y las discrepancias.
-->
