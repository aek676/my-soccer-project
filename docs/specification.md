# 1. Especificación del proyecto

El objetivo de este proyecto es desarrollar una aplicación
para la gestión de jugadores y estadísticas de fútbol.

Los usuarios no registrados pueden registrarse en la aplicación,
acceder a un listado completo de jugadores y buscar jugadores.
Dicha búsqueda se debe realizar a partir de una base de datos
local. Los criterios de búsqueda permitirán filtrar por nombre
del jugador, equipo/liga y fecha de alta en el sistema.

Al acceder a un jugador, se mostrarán sus datos y una imagen
identificativa. Se pueden añadir comentarios sobre
cada jugador, con los campos: autor, comentario (máx. 1000
caracteres) y valoración (0 a 5 estrellas).

Los usuarios registrados, previo inicio de sesión, pueden:

- Insertar nuevos jugadores desde API externa: Buscando en
  una API externa de fútbol (p.e. [API Football](https://www.api-football.com/))
  para seleccionar e importar datos. A partir de los resultados
  de la búsqueda, los usuarios podrán seleccionar uno o varios
  jugadores para realizar su inserción en la base de datos local.

- Insertar nuevo jugador desde formulario: Añadiendo la imagen del
  jugador mediante URL o el acceso a la cámara del dispositivo.

- Solicitar la generación de un “Equipo Ideal” basado en los jugadores
  insertados mediante el uso de LLMs con Groq o Google AI Studio (enlace).

- Visualizar noticias de jugadores: Haciendo uso de un consumidor de noticias
  en CORBA

Existirá también un usuario administrador que podrá:

- Dar de alta nuevas noticias de jugadores: Haciendo uso de
  un productor de noticias en CORBA.

- Editar y eliminar jugadores, así como borrar comentarios.

Siempre que se lleve a cabo una operación de inserción, tanto
de jugadores como de comentarios, se almacenará la geolocalización
del cliente desde el cual se está realizando dicha operación. Esta
geolocalización será editable en el caso de insertar nuevo jugador
desde formulario para situar el jugador en un mapa.

Todas las funcionalidades (excepto las relacionadas con CORBA) deben
poder resolverse desde dos backends: uno implementado con el stack tecnológico
de la asignatura TRWM y otro con el de la asignatura DWSC. En el frontend debe
existir un componente tipo toggle para poder conmutar el destino de las peticiones

La navegación en la aplicación debe permitir flexibilidad en el acceso a la funcionalidad
. La aplicación debe tener un estilo personalizado en todos los componentes y páginas.
Además, debe incluir un icono y una pantalla de carga asociados al estilo de la
aplicación.

Se deben implementar pruebas unitarias para los componentes y los servicios desarrollados.
Adicionalmente, se deben implementar las siguientes pruebas e2e: inicio de sesión,
registro, inserción de un nuevo elemento a partir del formulario, y búsqueda de
elementos.

# 2. Diagrama de casos de uso

![DCU](https://www.plantuml.com/plantuml/png/fLR1RXCn4BtlLunwGOgqxHrLKTDGLKLLGKNbrCjqFGJ3hXrihq28d-4J43Uk-J5ixpfsXis2nCdPzyPltipORY-iG-FwhgrQUkV0QJ1oyzw1a8OQ9xMggcUmQfmsP2iCAvmys1wDr72duPusqZg3Gfy0MezaW4UlTRVxfMAO_zahndEfuq8hqKarSYR4HYGQlQSM6s-QB91oXW17vwKngElbQA44-stzBU5HC44vAAHOezKM145lTLWccr7rbXgq12StIZOI3LYoSlTpA7_4tdX8gnoQjXjBCQpuvlwP16VBdTEMYuba0slideBN9sm-aXBHn8XT3b2EVKi6MfyaPFpGR_nYo3wgkdvKYmLzSQI2CzXggPnTB1xLPMyRD6Lia13ai6t99ZpczCJj85t5SVYIk8-4bx6yqkX2I34WXU5S1JSLqm_WouJbw2d3SoMl3NdnHdUaN6XuAkx5g56nJ72wBEg1vt1-FjImN5PvsrpOJ0_Ef6hQVko6zNHPJQvnqdC4rtkiOj_HKFR77EsbNprvY0niIBUwmLP-nMP_9qRocYRKlNocetgiHH0hc1tlgUju7LJG07tgvLQ358Hjp3yILn4_7BdIBbosa8AT5C_UZMJUijhzG25D2lKZy2v8EHgUAXN8guGTEugmUdqJXsSK5eVIeySJAPrppHtBAo4TJeuXsRlJt62HJdQu8GKFzxTdwztt3WqMEsyYMLK7xr4z8NiGSDXznXLDPWplPSM0S79ouzZ1uR6pfopv_w_miaFJfpWTuaPtMpHEYeYGa750UHHp4unSl4VxNt0gz6SL7J1Vyu-7NoR_vhBN8bsGudxaLsCSNU6zbLxgppScuVdYJ-mfvKSmFP-yE__oGF-zZqay_KTG7rQLq2dtd4jQcM0fYdaj3pasfWk_zbtx6m00)

> [!NOTE]
> Para editar el DCU, pulsa [aquí](https://www.plantuml.com/plantuml/uml/fLR1RXCn4BtlLunwGOgqxHrLKTDGLKLLGKNbrCjqFGJ3hXrihq28d-4J43Uk-J5ixpfsXis2nCdPzyPltipORY-iG-FwhgrQUkV0QJ1oyzw1a8OQ9xMggcUmQfmsP2iCAvmys1wDr72duPusqZg3Gfy0MezaW4UlTRVxfMAO_zahndEfuq8hqKarSYR4HYGQlQSM6s-QB91oXW17vwKngElbQA44-stzBU5HC44vAAHOezKM145lTLWccr7rbXgq12StIZOI3LYoSlTpA7_4tdX8gnoQjXjBCQpuvlwP16VBdTEMYuba0slideBN9sm-aXBHn8XT3b2EVKi6MfyaPFpGR_nYo3wgkdvKYmLzSQI2CzXggPnTB1xLPMyRD6Lia13ai6t99ZpczCJj85t5SVYIk8-4bx6yqkX2I34WXU5S1JSLqm_WouJbw2d3SoMl3NdnHdUaN6XuAkx5g56nJ72wBEg1vt1-FjImN5PvsrpOJ0_Ef6hQVko6zNHPJQvnqdC4rtkiOj_HKFR77EsbNprvY0niIBUwmLP-nMP_9qRocYRKlNocetgiHH0hc1tlgUju7LJG07tgvLQ358Hjp3yILn4_7BdIBbosa8AT5C_UZMJUijhzG25D2lKZy2v8EHgUAXN8guGTEugmUdqJXsSK5eVIeySJAPrppHtBAo4TJeuXsRlJt62HJdQu8GKFzxTdwztt3WqMEsyYMLK7xr4z8NiGSDXznXLDPWplPSM0S79ouzZ1uR6pfopv_w_miaFJfpWTuaPtMpHEYeYGa750UHHp4unSl4VxNt0gz6SL7J1Vyu-7NoR_vhBN8bsGudxaLsCSNU6zbLxgppScuVdYJ-mfvKSmFP-yE__oGF-zZqay_KTG7rQLq2dtd4jQcM0fYdaj3pasfWk_zbtx6m00)

# 3. Diagrama Entidad-Relación

```mermaid
erDiagram
    USER {
        int idUser PK
        string email
        string username
        string password
        string rol
    }

    IDEAL_TEAM {
        int idIdealTeam PK
        string name
        datetime created
        int idUser FK
    }

    TEAM_PLAYER {
        int idIdealTeam FK
        int idPlayer FK
    }

    PLAYER {
        int idPlayer PK
        string name
        string firstName
        string lastName
        int age
        date birthdate
        string nationality
        string height
        string weight
        int number
        string team
        string league
        string position
        string photo
        string location
        date created
    }

    COMMENT {
        int idComment PK
        string author
        string text
        int rating
        datetime created
        string location
        int idPlayer FK
        int idUser FK
    }

    NEWS {
        int idNews PK
        string title
        string body
        string tags
        datetime created
        int idPlayer FK
    }

    USER ||--o{ COMMENT : writes
    PLAYER ||--o{ COMMENT : receives

    PLAYER ||--o{ NEWS : creates
    USER ||--o{ IDEAL_TEAM : creates

    IDEAL_TEAM ||--o{ TEAM_PLAYER : contains
    PLAYER ||--o{ TEAM_PLAYER : "belongs to"
```

# 4. Diagrama de Arquitectura

```mermaid
flowchart TB
    subgraph FRONTEND["FRONTEND"]
        FE["Ionic App<br/>Toggle: Springboot/Nodejs"]
    end

    subgraph GATEWAY["SPRING CLOUD GATEWAY"]
        GW["Routing + Firebase Validation"]
    end

    subgraph DISCOVERY["EUREKA SERVER"]
        EU["Service Discovery"]
    end

    subgraph SERVICES["MICROSERVICIOS"]
        PS["players-service"]
        CS["comments-service"]
        IS["ideal-team-service"]
        NS["news-service"]
    end

    subgraph DATABASE["BASE DE DATOS"]
        DB["PostgreSQL/MongoDB"]
    end

    subgraph CORBA["CORBA"]
        ORB["ORB Daemon"]
        SERVER["CORBA Server"]
        SERVER -.->|"CORBA IIOP"| ORB
    end

    subgraph EXTERNAL["SERVICIOS EXTERNOS"]
        APIF["API Football"]
        LLM["Groq / Google AI"]
    end

    subgraph FIREBASE["FIREBASE"]
        FA["Firebase Auth"]
        FS["Firestore"]
        subgraph FUNCTIONS["CLOUD FUNCTIONS"]
            FN["rolsSync"]
        end
        FS -->|"onDocumentWritten"| FN
        FN -->|"setCustomUserClaims"| FA
    end

    FE -->|"Header:<br/>X-Backend=Springboot/Nodejs"| GW
    GW -->|"Route by handler"| SERVICES
    GW -.->|"Validate Token"| FA
    DISCOVERY -->|"Registro"| SERVICES

    PS -->|"Persist"| DB
    CS -->|"Persist"| DB
    IS -->|"Persist"| DB

    CS -->|"OpenFeign"| PS
    IS -->|"OpenFeign"| PS

    PS -->|"OpenFeign"| APIF
    IS -->|"OpenFeign"| LLM

    NS -->|"READ & GET"| CORBA
```

## 4.1 Explicación

La aplicación sigue una **arquitectura de microservicios** con los siguientes componentes:

| Capa               | Componentes                                                  |
| ------------------ | ------------------------------------------------------------ |
| **Frontend**       | Ionic App con toggle para elegir entre SpringBoot o Node.js  |
| **Gateway**        | Spring Cloud Gateway (enrutamiento + Firebase Admin SDK)     |
| **Descubrimiento** | Eureka Server (registro de servicios)                        |
| **Microservicios** | players, comments, ideal-team, news                          |
| **Datos**          | PostgreSQL o MongoDB + Firestore                             |
| **Firebase**       | Firebase Auth + Firestore + Cloud Functions (autenticación, datos de usuario, sincronización de roles) |
| **CORBA**          | Servidor para noticias (productor/consumidor)                |
| **Externos**       | API Football + Groq/Google AI (LLM)                          |

### Flujo principal

1. El frontend envía peticiones con header `X-Backend` indicando el backend destino y el token de Firebase
2. El Gateway valida el token con Firebase Admin SDK y enruta según el header
3. Eureka registra los microservicios disponibles
4. Los servicios se comunican entre sí via OpenFeign
5. CORBA se usa exclusivamente para noticias

### Dual Backend

La característica distintiva es el **toggle** que permite conmutar entre el
stack TRWM (Node.js) y DWSC (SpringBoot), manteniendo la misma interfaz frontend.
