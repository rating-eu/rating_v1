import {Injectable} from '@angular/core';
import {DataThreatLikelihood} from "../../entities/enumerations/gdpr/DataThreatLikelihood.enum";
import {DataImpact} from "../../entities/enumerations/gdpr/DataImpact.enum";
import {DataRiskLevel} from "../../entities/enumerations/gdpr/DataRiskLevel.enum";
import {DataRiskLevelConfigMgm} from "../../entities/data-risk-level-config-mgm";

@Injectable()
export class OverallDataRiskWidgetService {

    constructor() {
    }

    public likelihoodValue(likelihood: DataThreatLikelihood): number {
        let value: number = 0;

        switch (likelihood) {
            case DataThreatLikelihood.LOW: {
                value = 1;
                break;
            }
            case DataThreatLikelihood.MEDIUM: {
                value = 2;
                break;
            }
            case DataThreatLikelihood.HIGH: {
                value = 3;
                break;
            }
        }

        return value;
    }

    public impactValue(impact: DataImpact): number {
        let value: number = 0;

        switch (impact) {
            case DataImpact.LOW: {
                value = 1;
                break;
            }
            case DataImpact.MEDIUM: {
                value = 2;
                break;
            }
            case DataImpact.HIGH: {
                value = 3;
                break;
            }
            case DataImpact.VERY_HIGH: {
                value = 4;
                break;
            }
        }

        return value;
    }

    public riskValue(risk: DataRiskLevel): number {
        let value: number = 0;

        switch (risk) {
            case DataRiskLevel.LOW: {
                value = 1;
                break;
            }
            case DataRiskLevel.MEDIUM: {
                value = 2;
                break;
            }
            case DataRiskLevel.HIGH: {
                value = 3;
                break;
            }
        }

        return value;
    }

    public likelihoodImpactProductValue(config: DataRiskLevelConfigMgm): number {
        let value: number = 0;

        if (config != null) {
            const likelihood: DataThreatLikelihood = config.likelihood;
            const likelihoodValue: number = this.likelihoodValue(likelihood);

            const impact: DataImpact = config.impact;
            const impactValue: number = this.impactValue(impact);

            value = likelihoodValue * impactValue;
        }


        return value;
    }
}
