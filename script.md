Esta historia comienza con un problema que ocurre en la mayoría de startups cuando empiezan a crecer: el churn. Nuestros clientes se estaban yendo, y no solo a buscar competencia, sino directamente rechazando la digitalización de su logística. Esto nos indicaba una cosa muy clara: los usuarios acababan tan frustrados con el producto que acababan rechazando cualquier otra implantación.

Cuando la anécdota se convirtió en un problema real, empezaron a salir las preguntas incómodas. Tras discutirlo, preguntar a los usuarios y analizar el producto, nos dimos cuenta de lo siguiente:

 1. El producto se había plagado de ajustes configurables desde nuestro panel de administración. Al inicio de una startup se tienen que hacer concesiones y hacer desarrollos a medida para los primeros grandes clientes para adaptar el producto a sus gustos y necesidades. 

    Esto tiene sentido en las etapas iniciales de un producto, no obstante cuando se llega a una masa crítica de usuarios y de trabajadores en la misma startup puede generar múltiples problemas, algunos técnicos, como incompatibilidades entre un set de features o módulos que el cliente desea tener y que provocan una marabunta de bugs, complejidad del propio software y, sobre todo, desconocimiento sobre el producto.

    Una persona, por muy inteligente que sea, no es capaz de conocer la base de código por completo en cualquier proyecto relevante. Y sin documentación sobre cómo funciona un producto, este problema solo puede ir a más. Solo teníamos como referencia los nombres de las feature flags, que a veces no correspondían con la realidad ni explicaban de qué otras variables dependían para funcionar correctamente.

2. Quienes queríamos que fuesen promotores eran detractores:
 El producto estaba hecho para facilitar la vida de dos perfiles: los directores de logística que gestionan el reparto y los repartidores, que no se ven envueltos en papeleo, no tienen que pensar en qué camino coger, y qué información dar y recibir de los clientes. Cuando se recogió feedback de ambos perfiles las quejas estaban relacionadas: los repartidores decían que la aplicación era extremadamente lenta, por lo que dejaban de usarla. Y los directores de logística decían que la información tenía incongruencias, acciones que jamás llegaban, etc.

Tras recibir feedback tanto interno como externo, estudiamos el problema y llegamos a las siguientes conclusiones:

1. No conocíamos el producto que habíamos construido.
2. El producto era frágil.
3. Cada persona "hackeaba" el producto para hacerlo funcionar a su manera. Debíamos simplificar la aplicación: crear primitivos sólidos a partir de los cuales se construyesen las funcionalidades.
4. Los repartidores son la base: ellos tienen que registrar la información, y esa información es lo que da valor al producto. Cuantas menos fricciones, más contentos van a estar todos.

Yo en ese momento me encontraba actualizando la aplicación móvil: de Angular 7 a Angular 20, de Cordova a Capacitor 7, de Ionic 3 a Ionic 7, por lo que conocía los problemas técnicos de la aplicación móvil en profundidad.

Nos pusimos a investigar en profundidad el producto. Nos repartimos feature flags entre todos con el objetivo de crear un árbol de dependencias y conocer cómo funcionaba cada feature y definir cómo queríamos que fuese la app móvil.

Y así empezó el rediseño de cero de la aplicación. De todos los rompecabezas que resolví, hoy me voy a centrar en uno de ellos: completar una entrega dependía de tener una buena conexión.

---
Cómo funcionaba (simplificado)
---

Tenemos tres piezas: panel (webapp), app móvil y backend.

1. (panel) Un servicio se introduce manualmente, a través de Excel o inyección por API. Llamamos servicio a cada trabajo de reparto que debe realizar el repartidor.
2. (panel/app) Una persona crea las rutas para su jornada de reparto.
3. (backend) El sistema asigna un servicio a una ruta.
Acabamos de mencionar dos entidades: ruta y servicio, que son grandes protagonistas en la app móvil. La mayoría de lógica de negocio se centra en estas dos entidades. Tienen una relación N-N, ya que un mismo servicio podía entrar en rutas diferentes si, por ejemplo, no se pudo entregar en el primer día que estuvo disponible para repartir.

4. (app) Cuando llegaba el día marcado para esa jornada de reparto, al repartidor le llega el listado de servicios a ejecutar en su jornada, con el cálculo de kilómetros y tiempo estimado.
Esta pantalla no recibía todos los datos necesarios para ejecutar un reparto ya que la entidad Servicio solo se cargaba con los campos que se mostraban.
5. (app) El repartidor le da click a "Iniciar ruta" (pantalla de carga).
Esta operación cambia el estado de la ruta a 'in-progress' y recalcula el ETA de todos los servicios de la ruta.
6. (app) El usuario llega a su destino le da click a "Completar" o "Incidencia" (pantalla de carga).
En este paso, estamos cargando por completo la entidad "Servicio" con todos los datos.
7. (app) Rellena todos los campos que tenga que rellenar y le da a Completar (pantalla de carga).
Cuando el usuario rellena los datos, escribe (y sobreescribe) múltiples campos dentro de la propia entidad.
Cuando el backend lo recibe después de darle a completar, verifica si el estado es posible y vuelve a recalcular el ETA de los servicios restantes. Si el servicio fallase, devolvería un error y el usuario tendría que remediarlo.
8. (app) Se vuelve al listado de servicios (pantalla de carga).


Como hemos visto, la aplicación en aquel momento tenía un funcionamiento bastante simple: un flujo que esperaba la respuesta de cada petición HTTP a un servidor con Spring Boot antes de dejar continuar al usuario.
Si un usuario no tenía cobertura, se guardaba en una variable la última entrega que había hecho y se rezaba para que se reanudase la conexión. Si la cobertura no volvía, no se le permitía al usuario completar ninguna entrega más. Esto es problemático porque un repartidor puede quedarse sin cobertura al entregar en un sótano, un almacén o un lugar remoto.
Otro problema era la espera hasta recibir la respuesta del backend. Si un usuario tenía poca cobertura y subía una foto junto al resto de datos, veía la pantalla de carga durante un largo rato. Si cerraba la aplicación desde la multitarea y la volvía a abrir, todos esos datos se perdían por completo. Por aquí venían los problemas de inconsistencia que los gestores del reparto nos contaron.

---
Las opciones que teníamos
---

Estaba claro que algo tenía que cambiar. Así que, como buenos ingenieros, miramos qué hacía el resto: enchufamos RabbitMQ o Kafka y listo, ¿no? 

Pues no.

RabbitMQ y Kafka son brutales para desacoplar sistemas y distribuir y procesar eventos una vez el cliente ha mandado esta información al backend, sin embargo el problema lo tenemos antes, ya que no podemos fiarnos de que esa conexión no sea interrumpida, necesitamos una solución en ambos extremos: En la app móvil, para que en caso de que la conexión se vea interrumpida el usuario pueda continuar usando su app móvil. Y en el backend que, en el caso de que se caiga de forma generalizada, no se vea totalmente abrumada por las peticiones de sincronización desde todos los clientes.

Desde mi punto de vista de main-frontend en esta feature el cliente móvil es quien manda y tiene la prioridad, así que veamos sus necesidades desde el punto de vista de la app.
- La información debe actualizarse inmediatamente para el usuario de la app.
- El usuario debe ser consciente de la realidad: si está operando en modo offline, cuántos eventos mandados por él están siendo aún procesados o si toda su información está al día.
- Es posible que haya entidades que cambien desde fuera de la app móvil: los directores de ruta son capaces de alterar el orden de la ruta desde su panel de control, añadir nuevos servicios, marcar servicios como incidencia o incluso corregir datos que los usuarios de la app hayan introducido de manera errónea. Esto puede ocurrir en desorden: un evento siempre se va a procesar inmediatamente si llega desde panel, y es posible que una actualización haya ocurrido en el dispositivo móvil pero que aún no se haya procesado en el backend.
- Se debe poder encolar la subida de archivos pesados (fotos).
- NO DEBE PERJUDICAR EL RENDIMIENTO DE LA UI.


¿Qué requisitos tenemos para el servidor?
- Tiene que ser capaz de almacenar todas estas peticiones de golpe.
- Tenemos tres nodos, por lo que necesitamos guardar estas peticiones en un store centralizado para que en caso de que uno deje de estar operativo, no se pierda información.
- Tiene que informar al cliente de las actualizaciones de estado: ACK cuando lo recibe, y una respuesta cuando termine de procesarlo, ya sea FAIL u OK.
- Debe ser fácilmente auditable.

Finalmente, sin ser un requisito en sí, consideramos que RabbitMQ y Kafka aumentaban significativamente la complejidad de nuestra infraestructura, el equipo jamás había trabajado con estas herramientas y en lugar de acelerarnos en ese momento, nos hubiese frenado, la última razón es simplemente que el número de usuarios no es grande y nuestro humilde setup podía con la carga que le pedíamos sobre el papel.

Nos decidimos a implementar nosotros mismos un event-bus con las siguientes características.
1. Validamos en el front para dar feedback inmediato al usuario y volvemos a validar en el backend antes de aplicar la operación. Ambos usan validaciones basadas en un contrato común definido con OpenAPI: Zod en frontend y Jakarta Validation en backend. En CI comprobamos que los paquetes utilicen la misma versión del contrato para reducir divergencias. El backend comprueba además que la operación sea válida con el estado actual. Si existe un conflicto, conserva la acción recibida y la deriva a conciliación, sin aplicar automáticamente el cambio solicitado. Compartir contrato reduce divergencias de validación, pero no elimina los conflictos que pueden aparecer al sincronizar acciones realizadas offline.
2. En lugar de enviar la entidad completa modificada, enviaremos eventos con los datos de cada acción.
3. Para ahorrar batería, todas estas operaciones de escritura se enviarían en batch. Damos una ventana de 200 ms que se refresca si entra un nuevo evento para mandarlas todas juntas con un máximo de 5 segundos.
4. La cola debe poder pararse y ser respetuosa: Si el teléfono se queda sin cobertura, debe dejar de intentar de mandar eventos para guardar batería y cuando se reconecte, enviará el batch al backend, que almacenará los eventos para procesarlos en segundo plano, separando su recepción de la ejecución de la lógica de negocio.

---
Pasos previos a la implementación
---

Antes de ponernos a implementar tenemos que permitir a nuestro modelo de datos amoldarse a lo que tenemos pensado.

Como ya hemos dicho, las entidades más importantes son Ruta y Servicio. Para registrar los cambios que reciben, vamos a crear dos tablas o colecciones: `Route_events` y `Service_events`. Cada evento tendrá como clave primaria un UUIDv7 generado en el frontend donde se origine. Su componente temporal favorece la localidad de las inserciones en los índices B-tree frente a identificadores completamente aleatorios. Esto no garantiza un orden cronológico global ni elimina la fragmentación, especialmente cuando llegan eventos creados por dispositivos que han estado offline.

A partir de ahora, el historial de eventos será nuestra fuente de verdad: podremos reconstruir el estado de cada entidad a partir de él. Tanto ese historial como las entidades se almacenan en el backend.
Para evitar reconstruir las entidades en cada lectura, mantendremos una proyección de su estado actual en `Route` y `Service`. Cada vez que apliquemos un evento, guardaremos el evento y actualizaremos su proyección en la misma transacción.

Los frontends consultarán esas proyecciones, sin descargar ni reproducir todo el historial. Así también evitamos cargar de trabajo a los móviles, que pueden ser auténticos patatófonos. El historial solo se consultará desde el panel cuando sea necesario revisar una discrepancia.

También necesitamos persistir los eventos pendientes de procesamiento para conservarlos si se cae el backend. Lo último que queremos es perder datos que el usuario ya ha mandado. Nuestro método fue extremadamente simple y efectivo: crear una tabla o colección `mobile_app_events` y introducir los eventos tal cual llegan a ella.

Con solo modificar dos tablas y añadir otras tres ya teníamos preparada la persistencia necesaria.

---
Implementando el backend
---

¿Qué necesitamos?

Dos endpoints para recibir y consultar eventos, y un mecanismo para comunicar sus resultados.

El de recibir eventos es bastante sencillo. Recibe la petición, la mete en base de datos y la guarda para ser procesada por el event-bus. Respondemos con HTTP 202 Accepted: la petición ha sido aceptada, pero su procesamiento todavía no ha terminado. Si hubiese algún error, guardamos la petición en una dead-letter inbox para inspección manual. La estructura será la siguiente:
```json
{
    "transactionId": "01a1aad1-b80d-7348-8bc7-19875207892d", // id de transacción,
    "user_id": "01a1bafb-9334-7e47-86fe-d753b3ffc1ed",
    "device_id": "01a1bafb-9334-72e2-9ee9-644059a61746",
    "sentTimestamp": 1793867294, // Cuándo se ha mandado el evento
    "events": [
        {
            "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76", // id del evento
            "kind": SERVICE_ARRIVAL, // Qué evento es
            "creationTimestamp": "1793867100", // Cuándo se ha creado el evento
            "payload": {
                "serviceId": "01a1bf98-c4da-797e-97c8-2109c2436edf"
            },
            "metadata": {
                "contractVersion": "1"
            }
        },
        {
            "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76", // id del evento
            "kind": SERVICE_SIGNATURE_FILLED, // Qué evento es
            "creationTimestamp": "1793867400", // Cuándo se ha creado el evento
            "payload": {
                "service_id": "01a1bf98-c4da-797e-97c8-2109c2436edf",
                "uri": "file:///storage/emulated/0/logistics_app/picture.jpg"
            }
            "metadata": {
                "contractVersion": "1"
            }
        },
        {
            "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76", // id del evento
            "kind": LOCATION_TRACKING, // Qué evento es
            "creationTimestamp": "1793867600", // Cuándo se ha creado el evento
            "payload": { // data that the kind requires.
                "latitude": -99.656900,
                "longitude": 19.292500,
                "height": 123,
                "speed": 0
            },
            "metadata": {
                "contractVersion": "1"
            }
        },
        {
            "eventId": "01a1aad3-9e4f-7239-a286-e7ab962c8c76", // id del evento
            "kind": SERVICE_COMPLETED, // Qué evento es
            "creationTimestamp": "179386603", // Cuándo se ha creado el evento
            "payload": { // data that the kind requires.
                "serviceId": "01a1bf98-c4da-797e-97c8-2109c2436edf",
                "status": SERVICE_STATUS.OK,
                "location": {
                    "latitude": -99.656900,
                    "longitude": 19.292500,
                    "height": 123,
                    "speed": 0
                }
            },
            "metadata": {
                "contractVersion": "1"
            }
        },
    ]
}
```

Como se puede observar, tenemos `eventId`: esta es nuestra clave de idempotencia. Si hubiese ya un id en base de datos con esta clave, comprobamos si el evento es el mismo y lo ignoramos si fuese el caso. Para el caso de un mismo `eventId` con distinto contenido, configuramos una alarma en Slack. Aunque es extremadamente improbable, cosas más improbables han pasado. Hasta donde pude comprobar, nunca ocurrió.

Una vez el evento ha sido procesado, mandamos una respuesta, ya sea a través de un canal SSE, haciendo polling o mi opción favorita para dispositivos móviles, Firebase Cloud Messaging. En esta respuesta incluimos todos los eventos que han sido resueltos con sus respectivas resoluciones. Si una petición ha fallado, mandamos junto al id del evento el mensaje de error.

El `creationTimestamp` nos permite registrar cuándo ocurrió una acción. Como el reloj del dispositivo puede estar desajustado, estimamos su diferencia respecto al servidor mediante una sincronización de hora simplificada. Al abrir la app, consultamos la hora del servidor y calculamos un offset teniendo en cuenta la latencia estimada de la petición.

Guardamos ese offset junto al momento de la última sincronización y lo aplicamos al crear cada evento, también cuando estamos offline. Así conservamos una estimación de cuándo ocurrió la acción, independientemente de cuándo consigamos enviarla.

Este mecanismo mejora la precisión de los timestamps, pero no garantiza un orden global entre dispositivos ni resuelve por sí mismo los conflictos. Además, el reloj puede desviarse o cambiar manualmente después de sincronizarlo. En nuestra implementación no detectamos esos cambios, por lo que esta sigue siendo una limitación.

Una ventaja de hacerlo de esta forma es que podemos mantener la mayoría de endpoints que ya teníamos sin reescribirlo. Simplemente necesitamos mapear un evento a su método.

Por último, el endpoint de consulta permite recuperar el estado de los eventos cuando el dispositivo del repartidor no ha recibido alguna resolución.

---
Implementando el frontend
---

Ya tenemos un backend capaz de recibir nuestros eventos, almacenarlos y procesarlos asíncronamente. Ahora falta la aplicación móvil. Recordemos que el problema original era que los repartidores se podían quedar bloqueados por una conexión lenta o la falta de ella. Aunque ahora nuestro backend pueda recibir y procesar los eventos, el usuario no ha percibido ninguna mejora aún.

Así que vamos a cambiar de perspectiva. Ahora estamos repartiendo paquetes y hemos llegado al destino, rellenado toda la información necesaria y pulso "Completar".

¿Qué debería ocurrir?

Pues que la entrega se debe marcar como completada y mostrarme cuál es mi siguiente destino. Todo esto debe ocurrir del tirón, con o sin cobertura.

Pues vamos a tener que cambiar cómo se gestiona el estado de nuestra aplicación.

Seguramente se ha hablado mil y una veces en el pasado sobre UI optimista, pero para refrescar la memoria esto es una idea muy sencilla: anticiparnos a la respuesta del servidor para dar feedback inmediato de que todo ha ido bien. El clásico ejemplo del botón de like: cuando pulsamos el like, inmediatamente aparece reflejado. Si algo sale mal, el cambio se revierte y veremos ese corazón vacío.

Además de dar feedback inmediato, necesitamos disponer de los datos sin conexión. Al iniciar la aplicación, comprobamos qué servicios tiene el usuario para ese día y guardamos el listado localmente. Ese listado se refresca periódicamente.

Hasta ahora, ejecutábamos una acción, que ejecutaba una petición HTTP, esperábamos hasta recibir la respuesta y actualizábamos la UI. Ahora cambia el tema, cuando ejecutamos la acción le mostramos al usuario que puede continuar y ya la sincronizamos en segundo plano cuando pueda.
Sin embargo, sale un nuevo problema de esta solución: El usuario cierra la app porque en la interfaz sale como que todo ha salido bien, sin embargo, todavía no se ha mandado el evento.

Por este motivo tenemos dos mecanismos: uno visual para indicar al usuario las tareas que quedan pendientes y otro para persistir localmente las acciones que ha ejecutado. Vamos a empezar por la persistencia.

Para poder persistir localmente todas las acciones del usuario vamos a implementar un servicio `SyncService` que contendrá nuestro event-bus y por el que pasarán todas las acciones que impliquen una operación de escritura que pueda ser asíncrona. El servicio tiene una superficie bastante reducida: el método `push()` y la cola en sí `readonly queue$`

---
*Explicación diagrama queue-flow.png*
---

Los productores de eventos obtienen SyncService a través de inyección de dependencias. Cuando se ejecuta una acción, antes se validan los campos necesarios para ejecutar el evento localmente y se crea el `Event`. Se llama al método `push()` del SyncService que recibe el evento y un callback opcional, deduplica, valida el payload otra vez con Zod y lo introduce a la cola de eventos. 
Una vez en la cola, el evento se persiste para poder procesarlo.
Si no hay conexión y la cola está pausada, espera hasta que vuelva la conexión. La cola no se encarga de comprobar la conexión. Hay un listener que pausa o reanuda la cola según el estado de la conexión.
Si hay conexión cambiamos en la cola el estado de los eventos a "in-progress", se agrupan los eventos encolados en un batch y se añaden los metadatos de la cola al batch (reintentos, versión, id del usuario, id del dispositivo, etc) y se mandan al handler.
En el handler creamos un FormData y metemos el JSON y, si tenemos archivos que han de ser mandados, los metemos también. Cambiamos el estado de los eventos a "sending" y enviamos la petición.

Si la petición falla, eliminamos el batch y reintentamos cada evento individual dejando un intervalo de tiempo entre reintentos. 

Y si sigue fallando con errores HTTP que no sean 4xx, entonces pausamos la cola, devolvemos los eventos al estado anterior y fuera de la cola habilitamos que se compruebe la conexión al servidor periódicamente hasta que vuelva y rehabilite la cola.

Si son errores 400 entonces llamamos a un endpoint de "muerte" con todos los eventos para no perder el progreso e informamos que hay problemas graves y que no puede continuar con su ruta y que verifique la página de status.

Si todo sale bien y recibimos un 202 Accepted, volvemos a cambiar el estado de los eventos que han sido mandados a "processing" y esperamos a la respuesta del servidor. La resolución final contiene, para cada evento, su identificador, el código HTTP y un mensaje de error si corresponde.

Una vez recibida la respuesta, mapeamos cada resolución al evento, volvemos a persistir el estado y ejecutamos los callbacks.

---
*Fin explicación diagrama queue-flow.png*
---

Además de sincronizar, debemos mostrar al repartidor la cola y el estado de los eventos. En nuestro caso simplemente nos copiamos de los pop-ups de los AirPods.

Si el usuario lo toca, mostramos un modal de tipo sheet con todos los eventos que ha subido. Los eventos que han salido mal que mostramos en la app móvil son únicamente los eventos que pueden ser remediados por el usuario. *SyncNotifications.vue*

Ese pop-up se muestra en la pantalla principal, donde hay espacio, y se oculta en el resto de las pantallas. Si cambia el estado, aparece durante unos segundos con feedback háptico ligero y desaparece de nuevo. Y siempre está disponible desde el menú lateral de la app.

Ese listado muestra un resumen de lo ocurrido. Lo interesante es qué pasa con los eventos que han fallado.
Cuando pulsa un evento fallido, explicamos cómo resolverlo y lo llevamos a la pantalla donde realizó la acción para que corrija los datos y la envíe de nuevo.

Esto nos lleva al panel. Hay veces que el error es algo que el mismo repartidor no puede solucionar, por ejemplo, si en el panel han marcado un servicio como completado mientras el repartidor estaba offline y al sincronizar llega una incidencia que el repartidor había registrado en el móvil.

Para ello tenemos una pantalla de conciliación. En ella el director de logística puede ver qué servicios tienen discrepancias y ver su información en detalle, junto a cada evento que se ha mandado, y así solventar el error.

---
Seguimiento de errores
---

Para manejar los errores, usamos el módulo de seguimiento de errores de PostHog.
Todos los errores se reportan por defecto en la aplicación. Los errores de la cola tienen su propio canal de Slack en el que se avisan inmediatamente para solventarlos. Se relacionan con los errores generados en el backend y trazas de ejecución para tener todo el contexto de forma inmediata.
Entre esos avisos están los payloads malformados y los eventos con el mismo `eventId` pero distinto contenido.

---
Cierre
---
Para terminar, obtuvimos un feedback muy bueno por parte de muchos repartidores. A la vez que introdujimos la cola, rediseñamos toda la aplicación, así que no podemos atribuir toda la mejora a la sincronización. Sin embargo, el consenso fue que se sentía instantánea y mucho más rápida que la versión anterior. 
De hecho, habilitamos unos 6 meses antes la aplicación para algunos usuarios que querían probar la beta durante un par de semanas y cuando les comentamos que ya habíamos obtenido muchos comentarios útiles y que volverían a la versión anterior automáticamente, muchísimos se quejaron y pidieron quedarse en la beta hasta que la lanzásemos.

Ya no estoy en la empresa, ya que al mes siguiente de lanzar la actualización para todo el mundo me despidieron, sin embargo me quedo con esos comentarios de "es el día y la noche".

El cambio fundamental fue que el repartidor podía seguir trabajando y la aplicación se responsabilizaba de sincronizar después.

---
Apéndice: algunos problemas que tuvimos
---

Problema: Cuando un repartidor estaba en mitad de completar un servicio, se ejecutaba una actualización asíncrona y la app recibía que el orden de los servicios había cambiado. El usuario veía cómo la pantalla que estaba completando borraba todos los datos, y el servicio cambiaba.

Solución: Cuando el usuario entraba en el detalle de un servicio, guardábamos su identificador. Cuando llegaba una actualización asíncrona, respetábamos el servicio que estaba modificando.

P: Los eventos no llegan a un usuario

S: Esto es extremadamente extraño, pero se dio un caso. Por ese motivo al volver al primer plano, consultamos el estado de los eventos que todavía no tienen una resolución y reconciliamos la información local.
Si es al abrir la aplicación, esta comprobación se hace igualmente una vez recuperado el event-bus persistido.


P: Cuántos eventos puede ingestar el backend?

S: Esto es una información extremadamente útil y valiosa, cuando se implementó en el backend hice un stress test y los datos arrojaban que estabamos muy por debajo de los límites.