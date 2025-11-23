export class Patient {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        public birthDate: Date,
        public gender: string,
        public status: 'Activo' | 'Seguimiento' | 'Inactivo'
    ) { }
}
