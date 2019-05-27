export class AssessVulnerabilitiesCompletionDTO {
    constructor(
        public questionnaireStatusID: number,
        public human: number,
        public it: number,
        public physical: number
    ) {

    }
}
