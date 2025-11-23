Quiero que generes **un microservicio completo llamado “Microservicio Clínica”**, siguiendo exactamente estas **tecnologías**, **arquitectura**, **entidades del dominio**, y **estándares de comunicación entre microservicios**.

---

# 🧱 1. Tecnologías obligatorias

El microservicio debe utilizar:

- **Node.js** (última versión estable)
- **Express** para el servidor HTTP
- **TypeScript**
- **Arquitectura basada en Domain Driven Design (DDD)**
- **Event-Oriented Architecture** para comunicarse con el Microservicio de Genómica (eventos publicados en Redis/BullMQ)
- **Drizzle ORM** como ORM
- **MySQL** como base de datos
- **BullMQ** para colas de eventos y tareas
- **Zod** para validaciones de DTOs
- **OpenAPI/Swagger** para documentación
- **Dotenv** para configuración

---

# 🧩 2. Arquitectura requerida (DDD)


---

# 🧬 3. Entidades obligatorias del Dominio (Microservicio de Clínica)

Debes implementar **todas** las siguientes entidades con sus atributos exactos:

---

## **Entidad: Paciente (Patient)**  
Representa los datos personales del paciente.

Campos:
- `id` (UUID)
- `firstName`
- `lastName`
- `birthDate`
- `gender`
- `status` (Activo, Seguimiento, Inactivo)

---

## **Entidad: Tipo de Tumor (TumorType)**  
Catálogo de patologías oncológicas.

Campos:
- `id` (PK autoincremental)
- `name`
- `systemAffected`

---

## **Entidad: Historia Clínica (ClinicalRecord)**  
Registra diagnósticos y eventos clínicos.

Campos:
- `id` (UUID)
- `patientId` (FK hacia Patient)
- `tumorTypeId` (FK hacia TumorType)
- `diagnosisDate`
- `stage`
- `treatmentProtocol`

---

# 🗄️ 4. Base de datos

Genera las tablas en **MySQL** usando **Drizzle ORM**.  
Incluye migraciones y modelos tipados.

Tablas requeridas:

- `patients`
- `tumor_types`
- `clinical_records`

---

# 🔄 5. Comunicación entre Microservicios (Event-Oriented)

Implementar una arquitectura orientada a eventos usando **BullMQ** y Redis.

## Los siguientes eventos deben publicarse cuando correspondan:

- `PatientCreated`
- `PatientUpdated`
- `ClinicalRecordCreated`

## Formato estándar de evento:

```json
{
  "eventName": "string",
  "timestamp": 1690000000,
  "payload": { ... }
}

Módulos requeridos:

Publishers (emisores)

Subscribers (receptores futuros para el Microservicio de Genómica)

📦 6. Casos de Uso (Application Layer)

Crear casos de uso completos para:

Pacientes

CreatePatient

UpdatePatient

GetPatientById

DisablePatient (soft delete / cambio de estado)

Tipos de Tumor

CreateTumorType

UpdateTumorType

ListTumorTypes

Historias Clínicas

CreateClinicalRecord

ListClinicalRecordsByPatient

Cada caso de uso debe:

Validar DTO con Zod

Utilizar repositorios del dominio

Publicar eventos cuando aplique

Retornar DTOs de salida

🌐 7. Capa HTTP (Express)

Crear rutas y controladores:

Pacientes
POST /patients
GET /patients/:id
PUT /patients/:id
DELETE /patients/:id

Tipos de Tumor
POST /tumor-types
GET /tumor-types
PUT /tumor-types/:id

Historias Clínicas
POST /clinical-records
GET /patients/:id/clinical-records


Todos deben usar controladores, rutas, middlewares y DTOs.

📘 8. Documentación

Generar automáticamente:

Endpoint /docs

OpenAPI/Swagger

Tipos y descripciones completas

🛠️ 9. Otras Reglas

Código limpio, modular y siguiendo DDD estrictamente

No exponer detalles de infraestructura en los controladores

Los DTO deben representar la API pública exactamente

El dominio debe ser framework-agnostic

Los eventos deben tener su propio módulo

El microservicio debe ser totalmente escalable y desacoplado

🎯 Objetivo final

Generar el proyecto completo, incluyendo:

Código fuente en TypeScript

Arquitectura DDD

Eventos con BullMQ

Drizzle ORM + migraciones

Casos de uso

DTOs + validaciones con Zod

Documentación OpenAPI

Configuración del servidor

Instrucciones de despliegue