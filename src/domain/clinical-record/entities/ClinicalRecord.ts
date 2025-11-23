export class ClinicalRecord {
    constructor(
        public readonly id: string,
        public patientId: string,
        public tumorTypeId: number,
        public diagnosisDate: Date,
        public stage: string,
        public treatmentProtocol: string
    ) { }
}
