import { mysqlTable, varchar, timestamp, text, int, boolean } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const patients = mysqlTable('patients', {
    id: varchar('id', { length: 36 }).primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    birthDate: timestamp('birth_date').notNull(),
    gender: varchar('gender', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // Activo, Seguimiento, Inactivo
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const tumorTypes = mysqlTable('tumor_types', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    systemAffected: varchar('system_affected', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const clinicalRecords = mysqlTable('clinical_records', {
    id: varchar('id', { length: 36 }).primaryKey(),
    patientId: varchar('patient_id', { length: 36 }).notNull().references(() => patients.id),
    tumorTypeId: int('tumor_type_id').notNull().references(() => tumorTypes.id),
    diagnosisDate: timestamp('diagnosis_date').notNull(),
    stage: varchar('stage', { length: 50 }).notNull(),
    treatmentProtocol: text('treatment_protocol').notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});
