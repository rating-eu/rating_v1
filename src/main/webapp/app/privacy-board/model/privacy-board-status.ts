import {Status} from "../../entities/enumerations/Status.enum";

export class PrivacyBoardStatus {
    operationDefinition: Status;
    impactEvaluation: Status;
    threatIdentification: Status;
    riskEvaluation: Status;

    constructor() {
        this.operationDefinition = Status.EMPTY;
        this.impactEvaluation = Status.EMPTY;
        this.threatIdentification = Status.EMPTY;
        this.riskEvaluation = Status.EMPTY;
    }
}
