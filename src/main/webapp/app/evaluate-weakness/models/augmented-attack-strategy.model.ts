import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm';
import {AttackStrategyLikelihood} from '../../entities/enumerations/AttackStrategyLikelihood.enum';
import {ResourceLevel} from '../../entities/enumerations/ResourceLevel.enum';
import {Frequency} from '../../entities/enumerations/Frequency.enum';

export class AugmentedAttackStrategy extends AttackStrategyMgm {
    public static readonly attackStrategyInitialLikelihoodMatrix: {} = {
        1: {
            3: AttackStrategyLikelihood.LOW,
            2: AttackStrategyLikelihood.LOW_MEDIUM,
            1: AttackStrategyLikelihood.MEDIUM
        },
        2: {
            3: AttackStrategyLikelihood.LOW_MEDIUM,
            2: AttackStrategyLikelihood.MEDIUM,
            1: AttackStrategyLikelihood.MEDIUM_HIGH
        },
        3: {
            3: AttackStrategyLikelihood.MEDIUM,
            2: AttackStrategyLikelihood.MEDIUM_HIGH,
            1: AttackStrategyLikelihood.HIGH
        }
    };

    public static calculateInitialLikelihood(attackStrategy: AttackStrategyMgm): AttackStrategyLikelihood {
        const frequencyValue = Number(Frequency[attackStrategy.frequency]);
        const resourcesValue = Number(ResourceLevel[attackStrategy.resources]);

        const likelihood: AttackStrategyLikelihood = this.attackStrategyInitialLikelihoodMatrix[frequencyValue][resourcesValue];
        console.log('Initial Likelihood: ' + likelihood);

        return likelihood;
    }

    constructor(
        public attackStrategy: AttackStrategyMgm,
        /**
         * The enabled field specifies if the AttackStrategy can
         * be performed by the selected ThreatAgent.
         * @type {boolean}
         */
        public enabled: boolean = false,
        /**
         * The initialLikelihood of the AttackStrategy.
         * It is calculated as the AttackStrategy's Frequency over Resources ratio.
         * @type {AttackStrategyLikelihood}
         */
        public initialLikelihood?: AttackStrategyLikelihood,
        /**
         * The cisoAnswersLikelihood of the AttackStrategy.
         * It is calculated as the GEOMETRIC MEAN of the answers given by the CISO
         * to the SelfAssessment Questionnaire, and depends uniquely on them.
         * The weight of each answer depends on its QuestionType (REGULAR or RELEVANT).
         * The value of each answer is given by its Likelihood field.
         * @type {AttackStrategyLikelihood}
         */
        public cisoAnswersLikelihood?: AttackStrategyLikelihood,
        /**
         * The contextualLikelihood of the AttackStrategy, according to the answers of the CISO.
         * It is calculated as the mean between the @initialLikelihood and the @cisoAnswersLikelihood.
         * @type {AttackStrategyLikelihood}
         */
        public contextualLikelihood?: AttackStrategyLikelihood,
        /**
         * The externalAuditAnswersLikelihood of the AttackStrategy.
         * It is calculated as the GEOMETRIC MEAN of the answers given by the ExternalAudit,
         * during the external audit phase, to the SelfAssessment Questionnaire,
         * and depends uniquely on them.
         * The weight of each answer depends on its QuestionType (REGULAR or RELEVANT).
         * The value of each answer is given by its Likelihood field.
         * @type {AttackStrategyLikelihood}
         */
        public externalAuditAnswersLikelihood?: AttackStrategyLikelihood,
        /**
         * The refinedLikelihood of the AttackStrategy, according to the answers of the External Audit.
         * It is calculated as the mean between the @initialLikelihood and the @externalAuditAnswersLikelihood.
         * @type {AttackStrategyLikelihood}
         */
        public refinedLikelihood?: AttackStrategyLikelihood,
        /**
         * The CSS class used to show the color of the AttackStrategy.
         * @type {string}
         */
        public cssClass: string = 'disabled'
    ) {
        super(
            attackStrategy.id,
            attackStrategy.name,
            attackStrategy.description,
            attackStrategy.frequency,
            attackStrategy.skill,
            attackStrategy.resources,
            attackStrategy.likelihood,
            attackStrategy.created,
            attackStrategy.modified,
            attackStrategy.levels,
            attackStrategy.phases,
            attackStrategy.mitigations,
            attackStrategy.questions,
            attackStrategy.selfassessments
        );

        this.initialLikelihood = AugmentedAttackStrategy.calculateInitialLikelihood(this);
    }

    updateCssClass() {
        this.cssClass = this.calculateCssClass();
    }

    /**
     * Calculates the CSS class used to show the color of the AttackStrategy.
     * @type {string}
     */
    private calculateCssClass(): string {
        if (this.enabled) {// This AttackStrategy CAN be performed by the selected ThreatAgent.

            if (this.contextualLikelihood === undefined) {// The CISO has not answered the Questionnaire yet.

                switch (this.initialLikelihood) {
                    case AttackStrategyLikelihood.LOW: {
                        return 'low';
                    }
                    case AttackStrategyLikelihood.LOW_MEDIUM: {
                        return 'low-medium';
                    }
                    case AttackStrategyLikelihood.MEDIUM: {
                        return 'medium';
                    }
                    case AttackStrategyLikelihood.MEDIUM_HIGH: {
                        return 'medium-high';
                    }
                    case AttackStrategyLikelihood.HIGH: {
                        return 'high';
                    }
                }
            } else {// The CISO has answered the Questionnaire.

                if (this.refinedLikelihood === undefined) {// The ExternalAudit has not refined the Questionnaire yet.
                    // Use only the ContextualLikelihood to determine the CSS class.
                    switch (this.contextualLikelihood) {
                        case AttackStrategyLikelihood.LOW: {
                            return 'low';
                        }
                        case AttackStrategyLikelihood.LOW_MEDIUM: {
                            return 'low-medium';
                        }
                        case AttackStrategyLikelihood.MEDIUM: {
                            return 'medium';
                        }
                        case AttackStrategyLikelihood.MEDIUM_HIGH: {
                            return 'medium-high';
                        }
                        case AttackStrategyLikelihood.HIGH: {
                            return 'high';
                        }
                    }
                } else {// The ExternalAudit has refined the Questionnaire.
                    switch (this.refinedLikelihood) {
                        case AttackStrategyLikelihood.LOW: {
                            return 'low';
                        }
                        case AttackStrategyLikelihood.LOW_MEDIUM: {
                            return 'low-medium';
                        }
                        case AttackStrategyLikelihood.MEDIUM: {
                            return 'medium';
                        }
                        case AttackStrategyLikelihood.MEDIUM_HIGH: {
                            return 'medium-high';
                        }
                        case AttackStrategyLikelihood.HIGH: {
                            return 'high';
                        }
                    }
                }
            }
        } else {// This AttackStrategy CANNOT be performed by the selected ThreatAgent.
            return 'disabled';
        }
    }
}
