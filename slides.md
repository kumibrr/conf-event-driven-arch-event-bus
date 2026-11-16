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

Empezaron las preguntas incómodas, porque no es que perdiésemos esos clientes por la competencia: el nivel de frustración del usuario era extremo, tanto que algunos directamente rechazaban la digitalización de su logística.
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
En ese momento yo estaba actualizando la aplicación móvil de Angular 7 a Angular 20, de Cordova a Capacitor 7 y de Ionic 3 a Ionic 7. Esa migración me había dado bastante contexto sobre los problemas en la app móvil. Investigamos el funcionamiento del producto completo y ese conocimiento dio paso al rediseño de la aplicación desde cero. De todos los problemas que resolvimos, aquí nos centramos en uno: completar una entrega dependía de tener una buena conexión.
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
El sistema tenía tres piezas: panel, app y backend. Los servicios se introducían manualmente, por Excel o por API. Se creaban rutas y el backend asignaba servicios. Ruta y Servicio concentran gran parte de la lógica de negocio del móvil. Su relación es N:N, porque una entrega fallida podía reaparecer en una ruta posterior.
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

Cuando abría la app al inicio del día, se cargaba la lista inicial, sin embargo no tenía toda la información de cada uno de los servicios, solo algunos campos que se mostraban en el listado. Iniciar la ruta cambiaba su estado y recalculaba los ETA. Abrir el servicio cargaba todos los datos. Al completar, el usuario sobreescribía campos de la entidad y mandaba el resultado al backend, que validaba y recalculaba de nuevo. Volver al listado también implicaba una carga. La UI esperaba la respuesta de cada petición HTTP a Spring Boot antes de dejar continuar. Las peticiones no bloqueaban el hilo de JavaScript: el bloqueo era del flujo de trabajo del usuario.
-->

---
class: number-slide
---

<div class="split number-split"><div class="big-number warning-text">1</div><div><h1>entrega offline</h1><p>Después, el repartidor quedaba bloqueado hasta recuperar la conexión.</p></div></div>

<div class="takeaway">El usuario cierra la app durante la subida: 💀</div>

<!--
Si el repartidor no tiene cobertura se guardaba la última entrega en una variable y esperábamos. Si la conexión no volvía, no se podía completar la siguiente. Esto ocurría en sótanos, almacenes o lugares remotos. Con poca cobertura, una foto podía mantener la pantalla de carga durante mucho tiempo. 

Si el usuario cerraba la app desde la multitarea, se perdía el progreso. Ese comportamiento explicaba parte de las inconsistencias del panel.
-->

---
class: broker-options
---

# Las opciones que teníamos

<div class="broker-logos" role="group" aria-label="RabbitMQ y Apache Kafka">
  <img src="/logos/rabbitmq.svg" alt="RabbitMQ" width="350" />
  <img src="/logos/apache-kafka-white.png" alt="Apache Kafka" width="320" />
</div>

<!--
Estaba claro que algo tenía que cambiar. Así que, como buenos ingenieros, miramos qué hacía el resto: enchufamos RabbitMQ o Kafka y listo, ¿no?

Logos oficiales:
RabbitMQ: https://www.rabbitmq.com/trademark-guidelines
Apache Kafka: https://svn.apache.org/repos/asf/kafka/site/logos/originals/png/
-->

---
class: statement
---

# <span class="warning-text">Pues no.</span>

<!--
Pues no.
-->

---
---

# una solución en ambos extremos

<div class="split explanation" style="margin-top: 26px">
<div><div class="index" style="margin-bottom: 13px">En la app móvil</div><h2 style="font-size: 26px">el usuario pueda continuar usando su app móvil.</h2></div>
<div><div class="index" style="margin-bottom: 13px">Y en el backend</div><h2 style="font-size: 26px">no se vea totalmente abrumada</h2><p style="font-size: 19px">por las peticiones de sincronización desde todos los clientes.</p></div>
</div>

<div class="takeaway warning-line">no podemos fiarnos de que esa conexión no sea interrumpida</div>

<!--
RabbitMQ y Kafka son brutales para resolver colas de mensajería una vez el cliente ha mandado esta información al backend, sin embargo no podemos fiarnos de que esa conexión no sea interrumpida, por lo que necesitamos una solución en ambos extremos: En la app móvil, para que en caso de que la conexión se vea interrumpida, el usuario pueda continuar usando su app móvil. Y en el backend que, en el caso de que se caiga de forma generalizada, no se vea totalmente abrumada por las peticiones de sincronización desde todos los clientes.
-->

---
---

# el cliente móvil es quien manda

<div class="split requirements">
<div><div class="index">modo offline</div><ul><li>La información debe actualizarse inmediatamente</li><li>cuántos eventos mandados por él están siendo aún procesados</li></ul></div>
<div><div class="index">desde fuera de la app móvil</div><ul><li>alterar el orden de la ruta</li><li>añadir nuevos servicios</li><li>Se debe poder encolar la subida de archivos pesados (fotos).</li></ul></div>
</div>
<div class="takeaway">La app se debe sentir rapidíssssima 🏎️</div>

<!--
Desde mi punto de vista de main-frontend en esta feature el cliente móvil es quien manda y tiene la prioridad, así que veamos sus necesidades desde el punto de vista de la app.
- La información debe actualizarse inmediatamente para el usuario de la app.
- El usuario debe ser consciente de la realidad: si está operando en modo offline, cuántos eventos mandados por él están siendo aún procesados o si toda su información está al día.
- Es posible que haya entidades que cambien desde fuera de la app móvil: los directores de ruta son capaces de alterar el orden de la ruta desde su panel de control, añadir nuevos servicios, marcar servicios como incidencia o incluso corregir datos que los usuarios de la app hayan introducido de manera errónea. Esto puede ocurrir en desorden: un evento siempre se va a procesar inmediatamente si llega desde panel, y es posible que una actualización haya ocurrido en el dispositivo móvil pero que aún no se haya procesado en el backend.
- Se debe poder encolar la subida de archivos pesados (fotos).
- NO DEBE PERJUDICAR EL RENDIMIENTO DE LA UI.
-->

---
---

# ¿Qué requisitos tenemos para el servidor?

<p>tres nodos: <strong class="accent">store centralizado</strong></p>
<p>Respuesta inmediata, solo en lo importante: <strong class="accent">ACK, OK, FAIL</strong></p>
<p>¿Outage? <strong class="accent">Va a poder aguantarlo</strong></p>
<div class="takeaway">Ni un solo dato perdido. Todo auditable</div>

<!--
¿Qué requisitos tenemos para el servidor?
- Tenemos tres nodos, por lo que necesitamos guardar estas peticiones en un store centralizado para que en caso de que uno deje de estar operativo, no se pierda información.
- Tiene que informar al cliente de las actualizaciones de estado: ACK cuando lo recibe, y una respuesta cuando termine de procesarlo, ya sea FAIL u OK.
- Tiene que ser capaz de almacenar todas estas peticiones de golpe.
- Debe ser fácilmente auditable.
-->

---
---

# Sin Kafka, sin RabbitMQ


<!--
Al final descartamos RabbitMQ y Kafka. Aumentaban significativamente la complejidad de nuestra infraestructura, el equipo jamás había trabajado con estas herramientas y en lugar de acelerarnos en ese momento, nos hubiese frenado. Además, era totalmente estúpido, ya que nuestro backend es monolítico. 
Ya la última razón es simplemente que el número de usuarios no es grande y nuestro humilde setup podía con la carga que le pedíamos sobre el papel, luego vemos en la práctica.

Así que nos decidimos a implementar nosotros mismos un event-bus.
-->

---
---

# Validación

<div class="contract-source">OpenAPI</div>
<div class="split validation">
<div><div class="index">frontend</div><h2>Zod</h2><p>dar feedback inmediato al usuario</p></div>
<div><div class="index">backend</div><h2>Jakarta Validation</h2><p>la operación sea válida con el estado actual.</p></div>
</div>
<div class="takeaway">Compartir contrato reduce divergencias de validación, pero no elimina los conflictos que pueden aparecer al sincronizar acciones realizadas offline.</div>

<!--
Una característica gorda de este event-bus es que es cross-application. El event-bus se compone de dos event-buses. Uno en la app (lo que tiene soportar offline), y otro en el backend.
Por este motivo una cosa crucial es validar el payload antes de que salga de la app, y una vez ha llegado al back.

En el front validamos para dar feedback inmediato al usuario, si hay algo que deba solucionar se lo hacemos saber para que lo solucione. Volvemos a validar en el backend en el momento que recibimos la petición. Ambos usan validaciones basadas en un contrato común definido con OpenAPI: Zod en frontend y Jakarta Validation en backend. 

Una detalle adicional es que en CI comprobamos que los paquetes utilicen la misma versión del contrato para reducir divergencias e incompatibilidades. 
-->

---
class: payload-slide
---

# Payload

<PayloadComparison />

<!--
La segunda característica es que en lugar de enviar la entidad completa modificada, enviaremos eventos con los datos de cada acción.
-->

---
---

# Batching

<div class="split batch-numbers">
<div><strong class="accent">200<span> ms</span></strong><p>se refresca si entra un nuevo evento</p></div>
<div><strong>5<span> segundos</span></strong><p>un máximo de 5 segundos.</p></div>
</div>

<!--
La tercera es hacer batching, cada petición HTTP que hacemos consume batería, así que todas estas operaciones de escritura se enviarían en batch. Damos una ventana de 200 ms que se refresca si entra un nuevo evento para mandarlas todas juntas con un máximo de 5 segundos.
-->

---
---

# Pausa y reconexión

<div class="split explanation">
<div><div class="index">Sin cobertura / sin conexión</div><h2>Pausar la cola</h2><p>Conservar batería</p></div>
<div><div class="index">Conexión recuperada</div><h2>Enviar el batch</h2><p>Procesar en segundo plano</p></div>
</div>

<div class="takeaway">Recepción → persistencia → procesamiento</div>

<!--
Y ya la última es que la cola debe poder pararse y ser respetuosa con la batería: Si el teléfono se queda sin cobertura, debe dejar de intentar de mandar eventos y cuando se reconecte, enviará el batch al backend, que almacenará los eventos para procesarlos en segundo plano, separando su recepción de la ejecución de la lógica de negocio.
-->

---
---

# Ruta y Servicio

<div class="domain-diagram">
<div><h2>Route_events</h2><p>Ruta</p></div><div class="relation">y</div><div><h2>Service_events</h2><p>Servicio</p></div>
</div>
<div class="takeaway">vamos a crear dos tablas o colecciones</div>

<!--
Pasos previos a la implementación

Antes de ponernos a implementar tenemos que permitir a nuestro modelo de datos amoldarse a lo que tenemos pensado.

Como ya hemos dicho, las entidades más importantes son Ruta y Servicio. Para registrar los cambios que reciben, vamos a crear dos tablas o colecciones: `Route_events` y `Service_events`.
-->

---
---

# Cada evento tendrá como clave primaria un UUIDv7

<div class="uuid-breakdown" style="display: flex; justify-content: center; margin-top: 8px">
<img src="/images/uuidv7-structure.svg?v=131f167071" alt="Estructura de un UUIDv7: timestamp, secuencia opcional, versión, variante y aleatoriedad" width="800" />
</div>
<div class="takeaway warning-line">Esto no garantiza un orden cronológico global ni elimina la fragmentación</div>

<!--
Cada evento tendrá como clave primaria un UUIDv7 generado en el frontend donde se origine. Su componente temporal favorece la localidad de las inserciones en los índices B-tree frente a identificadores completamente aleatorios. Esto no garantiza un orden cronológico global ni elimina la fragmentación, especialmente cuando llegan eventos creados por dispositivos que han estado offline, pero ayuda.

Diagrama vectorial recreado a partir de la referencia. Campos y secuencia opcional: https://www.rfc-editor.org/rfc/rfc9562.html#section-5.7
-->

---
class: projection-slide
---

<div class="projection-layout">
<img class="projection-animation" src="/images/service-event-update.gif" alt="Se añade SERVICE_COMPLETED al historial y después Service.status cambia de pending a completed" />
<div class="projection-copy">
<h1>Historial y estado actual</h1>
<div class="projection-mapping">
<code>Route_events</code><span aria-hidden="true">→</span><code>Route</code>
<code>Service_events</code><span aria-hidden="true">→</span><code>Service</code>
</div>
<p class="projection-transaction">Una misma transacción</p>
<p class="support">El frontend consulta el estado actual</p>
</div>
</div>

<!--
A partir de ahora, el historial de eventos será nuestra fuente de verdad: podremos reconstruir el estado de cada entidad a partir de él. Tanto ese historial como las entidades se almacenan en el backend.
Para evitar reconstruir las entidades en cada lectura, mantendremos una proyección de su estado actual en `Route` y `Service`. Cada vez que apliquemos un evento, guardaremos el evento y actualizaremos su proyección en la misma transacción.

Los frontends consultarán esas proyecciones, sin descargar ni reproducir todo el historial. Así también evitamos cargar de trabajo a los móviles, que pueden ser auténticos patatófonos. El historial solo se consultará desde el panel cuando sea necesario revisar una discrepancia.
-->

---
class: projection-slide
---

<div class="projection-layout">
<img class="projection-animation" src="/images/raw-events-schema.svg" alt="Diagrama de Ruta, Servicio y sus historiales, con la tabla raw_events destacada en verde" />
<div class="projection-copy">
<h1><code>Tabla de persistencia</code></h1>
<div class="terminal-output compact-output">
</div>
</div>
</div>

<!--
También vamos a persistir los eventos pendientes de procesamiento para conservarlos por si se cae el backend o si queremos investigar algo que ha salido mal, conservar el dato tal y como llegó. Lo último que queremos es perder datos que el usuario ya ha mandado. Nuestro método fue extremadamente simple y efectivo: crear una tabla o colección `raw_events` y introducir los eventos tal cual llegan a ella.

Con solo modificar dos tablas y añadir otras tres ya teníamos preparado el modelo de datos.

Optamos por no hacer ninguna migración, simplemente incrementar la versión del schema de Route y Service. Como solo habíamos añadido datos nuevos, no hay incompatibilidad.
-->

---
---

# Implementando el backend

<div class="server-flow endpoint-flow">
<div><span>recibir</span></div>
<div><span>consultar</span></div>
<div><span>responder</span></div>
</div>

<!--
Para implementar el backend... ¿Qué necesitamos?

Dos endpoints para recibir y consultar eventos, y un mecanismo para comunicar sus resultados.
-->

---
class: reception-slide
---

# Recepción de eventos

<div class="reception-summary"><span>App móvil</span><span aria-hidden="true">→</span><span>Backend</span><span aria-hidden="true">→</span><code>raw_events</code></div>

```json
{
    "transactionId": "01a1aad1-b80d-7348-8bc7-19875207892d", // id de transacción,
    "user_id": "01a1bafb-9334-7e47-86fe-d753b3ffc1ed",
    "device_id": "01a1bafb-9334-72e2-9ee9-644059a61746",
    "sentTimestamp": 1793867294, // Cuándo se ha mandado el evento
    "events": [{
        "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76", // id del evento
        "kind": SERVICE_ARRIVAL, // Qué evento es
        "creationTimestamp": "1793867100", // Cuándo se ha creado el evento
        "payload": {
            "serviceId": "01a1bf98-c4da-797e-97c8-2109c2436edf"
        },
        "metadata": {
            "contractVersion": "1"
        }
    }]
}
```

<!--
El endpoint de recibir es sencillo, recibe el batch enviado por la app y guarda la petición en raw_events.
-->

---
class: ack-slide
---

# 202 Accepted

<p class="ack-definition">la petición ha sido aceptada, pero su procesamiento todavía no ha terminado.</p>
<div class="takeaway">Si hubiese algún error: 🚨</div>

<!--
Y validamos el batch usando nuestro validador de confianza.
Respondemos con HTTP 202 ßAccepted: la petición ha sido aceptada, pero su procesamiento todavía no ha terminado. Si hubiese algún error, aviso al Slack y para inspección manual.
-->

---
---

# Las cosas pueden salir mal

<div class="split explanation">
<div><div class="index">eventId</div><h2>el evento es el mismo</h2><p>lo ignoramos si fuese el caso.</p></div>
<div><div class="index">eventId</div><h2>distinto contenido</h2><p>Alarma en Slack.</p></div>
</div>
<div class="takeaway">Hasta donde pude comprobar, nunca ocurrió.</div>

<!--
En las tablas que vimos antes, tenemos `eventId`: esta es nuestra clave de idempotencia. Si hubiese ya un id en base de datos con esta clave, comprobamos si el evento es el mismo y lo ignoramos si fuese el caso. Para el caso de un mismo `eventId` con distinto contenido, configuramos una alarma en Slack. Aunque es extremadamente improbable, cosas más improbables han pasado. Hasta donde pude comprobar, nunca ocurrió.
-->

---
---

# Respuesta

<div class="server-flow" style="margin-top: 35px">
<div><h2>SSE</h2></div>
<div><h2>polling</h2></div>
<div><h2>Firebase Cloud Messaging</h2><p>⭐️</p></div>
</div>

<!--
Una vez el evento ha sido procesado, mandamos una respuesta, ya sea a través de un canal SSE, haciendo polling o mi opción favorita para dispositivos móviles, Firebase Cloud Messaging. En esta respuesta incluimos todos los eventos que han sido resueltos con sus respectivas resoluciones. Si una petición ha fallado, mandamos junto al id del evento el código y mensaje de error.
-->

---
---

# <code>creationTimestamp</code>

<div class="time-equation"><span class="accent">calculamos un offset</span></div>
<div class="time-steps">
<p><strong>Al abrir la app</strong><span>consultamos la hora del servidor</span></p>
<p><strong>Guardamos ese offset</strong><span>lo aplicamos al crear cada evento, también cuando estamos offline.</span></p>
</div>
<div class="takeaway warning-line">no garantiza un orden global entre dispositivos ni resuelve por sí mismo los conflictos.</div>

<!--
El `creationTimestamp` nos permite registrar cuándo ocurrió una acción. Como el reloj del dispositivo puede estar desajustado, estimamos su diferencia respecto al servidor mediante una sincronización de hora simplificada. Al abrir la app, consultamos la hora del servidor y calculamos un offset teniendo en cuenta la latencia estimada de la petición.

Guardamos ese offset junto al momento de la última sincronización y lo aplicamos al crear cada evento, también cuando estamos offline. Así conservamos una estimación de cuándo ocurrió la acción, independientemente de cuándo consigamos enviarla.

Este mecanismo mejora la precisión de los timestamps, pero no garantiza un orden global entre dispositivos ni resuelve por sí mismo los conflictos. Además, el reloj puede desviarse o cambiar manualmente después de sincronizarlo. En nuestra implementación no detectamos esos cambios, por lo que esta sigue siendo una limitación.
-->

---
---

# el endpoint de consulta

<div class="terminal-output compact-output">
<div>podemos mantener la mayoría de endpoints que ya teníamos sin reescribirlo.</div>
<div>Simplemente necesitamos mapear un evento a su método.</div>
</div>
<div class="takeaway">recuperar el estado de los eventos cuando el dispositivo del repartidor no ha recibido alguna resolución.</div>

<!--
Una ventaja de hacerlo de esta forma es que podemos mantener la mayoría de endpoints que ya teníamos sin reescribirlo. Simplemente necesitamos mapear un evento a su método.

Por último, el endpoint de consulta permite recuperar el estado de los eventos cuando el dispositivo del repartidor no ha recibido alguna resolución.
-->

---
class: statement
---

# con o sin cobertura.

<div class="statement-sub">la entrega se debe marcar como completada y mostrarme cuál es mi siguiente destino.</div>

<!--
Implementando el frontend

Ya tenemos un backend capaz de recibir nuestros eventos, almacenarlos y procesarlos asíncronamente. Ahora falta la aplicación móvil. Recordemos que el problema original era que los repartidores se podían quedar bloqueados por una conexión lenta o la falta de ella. Aunque ahora nuestro backend pueda recibir y procesar los eventos, el usuario no ha percibido ninguna mejora aún.

Así que vamos a cambiar de perspectiva. Ahora estamos repartiendo paquetes y hemos llegado al destino, rellenado toda la información necesaria y pulso "Completar".

¿Qué debería ocurrir?

Pues que la entrega se debe marcar como completada y mostrarme cuál es mi siguiente destino. Todo esto debe ocurrir del tirón, con o sin cobertura.

Pues vamos a tener que cambiar cómo se gestiona el estado de nuestra aplicación.

Seguramente se ha hablado mil y una veces en el pasado sobre UI optimista, pero para refrescar la memoria esto es una idea muy sencilla: anticiparnos a la respuesta del servidor para dar feedback inmediato de que todo ha ido bien. El clásico ejemplo del botón de like: cuando pulsamos el like, inmediatamente aparece reflejado. Si algo sale mal, el cambio se revierte y veremos ese corazón vacío.
-->

---
---

# disponer de los datos sin conexión

<div class="server-flow offline-reads">
<div><h2>comprobamos</h2><p>qué servicios tiene el usuario para ese día</p></div>
<div><h2>guardamos</h2><p>el listado localmente.</p></div>
<div><h2>se refresca</h2><p>periódicamente.</p></div>
</div>
<div class="takeaway">Al iniciar la aplicación</div>

<!--
Además de dar feedback inmediato, necesitamos disponer de los datos sin conexión. Al iniciar la aplicación, comprobamos qué servicios tiene el usuario para ese día y guardamos el listado localmente. Ese listado se refresca periódicamente.
-->

---
---

# dos mecanismos

<div class="split voices">
<div><div class="index">El usuario cierra la app</div><h2>todavía no se ha mandado el evento.</h2><p>en la interfaz sale como que todo ha salido bien</p></div>
<div><div class="index">dos mecanismos</div><h2>persistir localmente las acciones</h2><p>indicar al usuario las tareas que quedan pendientes</p></div>
</div>
<div class="takeaway">Vamos a empezar por la persistencia.</div>

<!--
Hasta ahora, ejecutábamos una acción, que ejecutaba una petición HTTP, esperábamos hasta recibir la respuesta y actualizábamos la UI. Ahora cambia el tema, cuando ejecutamos la acción le mostramos al usuario que puede continuar y ya la sincronizamos en segundo plano cuando pueda.
Sin embargo, sale un nuevo problema de esta solución: El usuario cierra la app porque en la interfaz sale como que todo ha salido bien, sin embargo, todavía no se ha mandado el evento.

Por este motivo tenemos dos mecanismos: uno visual para indicar al usuario las tareas que quedan pendientes y otro para persistir localmente las acciones que ha ejecutado. Vamos a empezar por la persistencia.
-->

---
---

# <code>SyncService</code>

<div class="code-caption">El servicio tiene una superficie bastante reducida</div>
<div class="split api-detail">
<div><code>push()</code><p>todas las acciones que impliquen una operación de escritura que pueda ser asíncrona.</p></div>
<div><code>readonly queue$</code><p>la cola en sí</p></div>
</div>
<div class="takeaway">persistir localmente todas las acciones del usuario</div>

<!--
Para poder persistir localmente todas las acciones del usuario vamos a implementar un servicio `SyncService` que contendrá nuestro event-bus y por el que pasarán todas las acciones que impliquen una operación de escritura que pueda ser asíncrona. El servicio tiene una superficie bastante reducida: el método `push()` y la cola en sí `readonly queue$`


*Explicación diagrama queue-flow.png*
-->

---
---

# Los productores de eventos

<div class="local-flow">
<div><h2>se validan</h2><p>los campos necesarios</p></div>
<div><h2>se crea</h2><p><code>Event</code></p></div>
<div><h2><code>push()</code></h2><p>deduplica, valida el payload otra vez con Zod</p></div>
<div class="highlight-step"><h2>se persiste</h2><p>para poder procesarlo.</p></div>
</div>
<div class="takeaway">Los productores de eventos obtienen SyncService a través de inyección de dependencias.</div>

<!--
Los productores de eventos obtienen SyncService a través de inyección de dependencias. Cuando se ejecuta una acción, antes se validan los campos necesarios para ejecutar el evento localmente y se crea el `Event`. Se llama al método `push()` del SyncService que recibe el evento y un callback opcional, deduplica, valida el payload otra vez con Zod y lo introduce a la cola de eventos.
Una vez en la cola, el evento se persiste para poder procesarlo.
-->

---
---

# Hay un listener que pausa o reanuda la cola

<div class="split explanation">
<div><div class="index">Si no hay conexión</div><h2>la cola está pausada</h2><p>espera hasta que vuelva la conexión.</p></div>
<div><div class="index">Hay un listener</div><h2>pausa o reanuda la cola</h2><p>según el estado de la conexión.</p></div>
</div>
<div class="takeaway">La cola no se encarga de comprobar la conexión.</div>

<!--
Si no hay conexión y la cola está pausada, espera hasta que vuelva la conexión. La cola no se encarga de comprobar la conexión. Hay un listener que pausa o reanuda la cola según el estado de la conexión.
-->

---
---

# se agrupan los eventos encolados en un batch

<div class="server-flow">
<div><h2>in-progress</h2><p>se agrupan los eventos encolados en un batch</p></div>
<div><h2>FormData</h2><p>metemos el JSON</p><p>archivos que han de ser mandados</p></div>
<div><h2>sending</h2><p>enviamos la petición.</p></div>
</div>
<div class="takeaway">reintentos, versión, id del usuario, id del dispositivo, etc</div>

<!--
Si hay conexión cambiamos en la cola el estado de los eventos a "in-progress", se agrupan los eventos encolados en un batch y se añaden los metadatos de la cola al batch (reintentos, versión, id del usuario, id del dispositivo, etc) y se mandan al handler.
En el handler creamos un FormData y metemos el JSON y, si tenemos archivos que han de ser mandados, los metemos también. Cambiamos el estado de los eventos a "sending" y enviamos la petición.
-->

---
---

# Si la petición falla

<div class="recovery-list">
<div><strong>Si la petición falla</strong><p>eliminamos el batch y reintentamos cada evento individual dejando un intervalo de tiempo entre reintentos.</p></div>
<div><strong>errores HTTP que no sean 4xx</strong><p>pausamos la cola, devolvemos los eventos al estado anterior</p></div>
<div><strong>Si son errores 400</strong><p>llamamos a un endpoint de &quot;muerte&quot; con todos los eventos para no perder el progreso</p></div>
</div>

<!--
Si la petición falla, eliminamos el batch y reintentamos cada evento individual dejando un intervalo de tiempo entre reintentos.

Y si sigue fallando con errores HTTP que no sean 4xx, entonces pausamos la cola, devolvemos los eventos al estado anterior y fuera de la cola habilitamos que se compruebe la conexión al servidor periódicamente hasta que vuelva y rehabilite la cola.

Si son errores 400 entonces llamamos a un endpoint de "muerte" con todos los eventos para no perder el progreso e informamos que hay problemas graves y que no puede continuar con su ruta y que verifique la página de status.
-->

---
---

# Una vez recibida la respuesta

<div class="state-list">
<div><code>202 Accepted</code><span>processing</span></div>
<div><code>processing</code><span>esperamos a la respuesta del servidor.</span></div>
<div><code>identificador</code><span>el código HTTP y un mensaje de error si corresponde.</span></div>
<div><code>persistir el estado</code><span>ejecutamos los callbacks.</span></div>
</div>
<div class="takeaway">mapeamos cada resolución al evento</div>

<!--
Si todo sale bien y recibimos un 202 Accepted, volvemos a cambiar el estado de los eventos que han sido mandados a "processing" y esperamos a la respuesta del servidor. La resolución final contiene, para cada evento, su identificador, el código HTTP y un mensaje de error si corresponde.

Una vez recibida la respuesta, mapeamos cada resolución al evento, volvemos a persistir el estado y ejecutamos los callbacks.
-->

---
---

# la cola y el estado de los eventos

<div class="split notifications-layout">
<div><div class="index">los pop-ups de los AirPods</div><h2>sincronizar</h2><p>un modal de tipo sheet</p><p>el menú lateral de la app.</p></div>
<div class="notification-demo"><SyncNotifications compact /></div>
</div>

<!--
*Fin explicación diagrama queue-flow.png*

Además de sincronizar, debemos mostrar al repartidor la cola y el estado de los eventos. En nuestro caso simplemente nos copiamos de los pop-ups de los AirPods.

Si el usuario lo toca, mostramos un modal de tipo sheet con todos los eventos que ha subido. Los eventos que han salido mal que mostramos en la app móvil son únicamente los eventos que pueden ser remediados por el usuario. *SyncNotifications.vue*

Ese pop-up se muestra en la pantalla principal, donde hay espacio, y se oculta en el resto de las pantallas. Si cambia el estado, aparece durante unos segundos con feedback háptico ligero y desaparece de nuevo. Y siempre está disponible desde el menú lateral de la app.
-->

---
---

# los eventos que han fallado

<div class="correction-flow">
<div><h2>un evento fallido</h2><p>explicamos cómo resolverlo</p></div>
<div><h2>la pantalla</h2><p>donde realizó la acción</p></div>
<div><h2>corrija los datos</h2><p>la envíe de nuevo.</p></div>
</div>
<div class="takeaway">Ese listado muestra un resumen de lo ocurrido.</div>

<!--
Ese listado muestra un resumen de lo ocurrido. Lo interesante es qué pasa con los eventos que han fallado.
Cuando pulsa un evento fallido, explicamos cómo resolverlo y lo llevamos a la pantalla donde realizó la acción para que corrija los datos y la envíe de nuevo.
-->

---
---

# Esto nos lleva al panel.

<div class="conflict-timeline">
<div><div class="index">en el panel</div><h2>completado</h2><p>han marcado un servicio como completado</p></div>
<div><div class="index">mientras el repartidor estaba offline</div><h2>una incidencia</h2><p>que el repartidor había registrado en el móvil.</p></div>
</div>
<div class="takeaway">Para ello tenemos una pantalla de conciliación.</div>

<!--
Esto nos lleva al panel. Hay veces que el error es algo que el mismo repartidor no puede solucionar, por ejemplo, si en el panel han marcado un servicio como completado mientras el repartidor estaba offline y al sincronizar llega una incidencia que el repartidor había registrado en el móvil.

Para ello tenemos una pantalla de conciliación. En ella el director de logística puede ver qué servicios tienen discrepancias y ver su información en detalle, junto a cada evento que se ha mandado, y así solventar el error.
-->

---
---

# Seguimiento de errores

<div class="observability">
<div><h2>PostHog</h2><p>Todos los errores se reportan por defecto en la aplicación.</p></div>
<div><h2>Slack</h2><p>Los errores de la cola tienen su propio canal de Slack</p></div>
<div><h2>trazas de ejecución</h2><p>todo el contexto de forma inmediata.</p></div>
</div>
<div class="takeaway">los payloads malformados y los eventos con el mismo <code>eventId</code> pero distinto contenido.</div>

<!--
Seguimiento de errores

Para manejar los errores, usamos el módulo de seguimiento de errores de PostHog.
Todos los errores se reportan por defecto en la aplicación. Los errores de la cola tienen su propio canal de Slack en el que se avisan inmediatamente para solventarlos. Se relacionan con los errores generados en el backend y trazas de ejecución para tener todo el contexto de forma inmediata.
Entre esos avisos están los payloads malformados y los eventos con el mismo `eventId` pero distinto contenido.
-->

---
class: statement
---

# pidieron quedarse en la beta

<div class="statement-sub">A la vez que introdujimos la cola, rediseñamos toda la aplicación, así que no podemos atribuir toda la mejora a la sincronización.</div>

<!--
Cierre

Para terminar, obtuvimos un feedback muy bueno por parte de muchos repartidores. A la vez que introdujimos la cola, rediseñamos toda la aplicación, así que no podemos atribuir toda la mejora a la sincronización. Sin embargo, el consenso fue que se sentía instantánea y mucho más rápida que la versión anterior.
De hecho, habilitamos unos 6 meses antes la aplicación para algunos usuarios que querían probar la beta durante un par de semanas y cuando les comentamos que ya habíamos obtenido muchos comentarios útiles y que volverían a la versión anterior automáticamente, muchísimos se quejaron y pidieron quedarse en la beta hasta que la lanzásemos.
-->

---
class: closing
---

# &quot;es el día y la noche&quot;

<div class="closing-sub">El cambio fundamental fue que el repartidor podía seguir trabajando</div>
<div class="cover-bottom">la aplicación se responsabilizaba de sincronizar después.</div>

<!--
Ya no estoy en la empresa, ya que al mes siguiente de lanzar la actualización para todo el mundo me despidieron, sin embargo me quedo con esos comentarios de "es el día y la noche".

El cambio fundamental fue que el repartidor podía seguir trabajando y la aplicación se responsabilizaba de sincronizar después.
-->

---
class: appendix
---

# Apéndice: algunos problemas que tuvimos

<div class="split incident">
<div><div class="index warning-text">Problema:</div><h2>el orden de los servicios había cambiado.</h2><p>borraba todos los datos, y el servicio cambiaba.</p></div>
<div><div class="index accent">Solución:</div><h2>guardábamos su identificador.</h2><p>respetábamos el servicio que estaba modificando.</p></div>
</div>

<!--
Apéndice: algunos problemas que tuvimos

Problema: Cuando un repartidor estaba en mitad de completar un servicio, se ejecutaba una actualización asíncrona y la app recibía que el orden de los servicios había cambiado. El usuario veía cómo la pantalla que estaba completando borraba todos los datos, y el servicio cambiaba.

Solución: Cuando el usuario entraba en el detalle de un servicio, guardábamos su identificador. Cuando llegaba una actualización asíncrona, respetábamos el servicio que estaba modificando.
-->

---
class: appendix
---

# Los eventos no llegan a un usuario

<div class="local-flow recovery-flow">
<div><h2>al volver al primer plano</h2></div>
<div><h2>consultamos el estado</h2><p>de los eventos que todavía no tienen una resolución</p></div>
<div><h2>reconciliamos</h2><p>la información local.</p></div>
<div class="highlight-step"><h2>al abrir la aplicación</h2><p>una vez recuperado el event-bus persistido.</p></div>
</div>
<div class="takeaway">Esto es extremadamente extraño, pero se dio un caso.</div>

<!--
P: Los eventos no llegan a un usuario

S: Esto es extremadamente extraño, pero se dio un caso. Por ese motivo al volver al primer plano, consultamos el estado de los eventos que todavía no tienen una resolución y reconciliamos la información local.
Si es al abrir la aplicación, esta comprobación se hace igualmente una vez recuperado el event-bus persistido.
-->
