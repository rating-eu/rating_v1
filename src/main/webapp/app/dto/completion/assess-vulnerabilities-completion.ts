export class AssessVulnerabilitiesCompletionDTO {
    constructor(
        public questionnaireStatusID?: number,
        public human?: number,
        public it?: number,
        public physical?: number
    ) {
        this.questionnaireStatusID = 0;
        this.human = 0;
        this.it = 0;
        this.physical = 0;
    }
}
