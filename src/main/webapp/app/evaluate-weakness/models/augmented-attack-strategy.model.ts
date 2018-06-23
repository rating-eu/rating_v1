import {AttackStrategyMgm} from "../../entities/attack-strategy-mgm";
import {AttackStrategyLikelihood} from "../../entities/enumerations/AttackStrategyLikelihood.enum";

export class AugmentedAttackStrategy extends AttackStrategyMgm {

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
        public refinedLikelihood?: AttackStrategyLikelihood
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
    }
}
