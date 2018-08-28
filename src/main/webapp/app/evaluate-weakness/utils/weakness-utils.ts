import {AnswerWeightMgm} from '../../entities/answer-weight-mgm';
import {QuestionType} from '../../entities/enumerations/QuestionType.enum';
import {AnswerLikelihood} from '../../entities/enumerations/AnswerLikelihood.enum';
import {QuestionMgm} from '../../entities/question-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';
import {SkillLevel} from '../../entities/enumerations/SkillLevel.enum';
import {AttackStrategyLikelihood} from '../../entities/enumerations/AttackStrategyLikelihood.enum';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {AugmentedAttackStrategy} from '../models/augmented-attack-strategy.model';
import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {ResourceLevel} from '../../entities/enumerations/ResourceLevel.enum';
import {Frequency} from '../../entities/enumerations/Frequency.enum';
import {Couple} from '../../utils/couple.class';
import {AttackStrategyUpdate} from '../models/attack-strategy-update.model';

export class WeaknessUtils {
    /**
     * Turns the array of AnswerWeights into a Map,
     * QuestionType => AnswerLikelihood => AnswerWeight.
     * @param {AnswerWeightMgm[]} answerWeights
     * @returns {Map<number, Map<number, number>>}
     */
    public static answerWeightsToMap(answerWeights: AnswerWeightMgm[]): Map<number, Map<number, number>> {
        const answerWeightMap: Map<number/*QuestionType*/, Map<number/*AnswerLikelihood*/, number/*AnswerWeight*/>> = new Map<number, Map<number, number>>();

        answerWeights.forEach((answerWeight: AnswerWeightMgm) => {
            const questionType: QuestionType = answerWeight.questionType;
            const questionTypeValue: number = Number(QuestionType[questionType]);
            console.log('QuestionType: ' + questionType);
            console.log('QuestionType value: ' + questionTypeValue);

            const answerLikelihood: AnswerLikelihood = answerWeight.likelihood;
            const answerLikelihoodValue: number = Number(AnswerLikelihood[answerLikelihood]);
            console.log('AnswerLikelihood: ' + answerLikelihood);
            console.log('AnswerLikelihood value: ' + answerLikelihoodValue);

            const weight: number = answerWeight.weight;
            console.log('Weight: ' + weight);

            if (answerWeightMap.has(questionTypeValue)) {// REGULAR, RELEVANT
                // LOW, LOW_MEDIUM, MEDIUM, MEDIUM_HIGH, HIGH
                answerWeightMap.get(questionTypeValue).set(answerLikelihoodValue, weight);
            } else {
                // REGULAR, RELEVANT
                answerWeightMap.set(questionTypeValue, new Map<number, number>());
                // LOW, LOW_MEDIUM, MEDIUM, MEDIUM_HIGH, HIGH
                answerWeightMap.get(questionTypeValue).set(answerLikelihoodValue, weight);
            }
        });

        return answerWeightMap;
    }

    public static getAnswerWeight(question: QuestionMgm, answer: AnswerMgm, weightsMap: Map<number, Map<number, number>>): number {
        const questionTypeValue: number = Number(QuestionType[question.questionType]);
        const answerLikelihoodValue: number = Number(AnswerLikelihood[answer.likelihood]);

        if (weightsMap) {
            if (weightsMap.has(questionTypeValue)) {
                const map: Map<number, number> = weightsMap.get(questionTypeValue);

                if (map.has(answerLikelihoodValue)) {
                    return map.get(answerLikelihoodValue);
                }
            }
        }

        return 0;
    }

    public static isAttackPossible(threatAgentSkills: SkillLevel, attackStrategyDifficulty: SkillLevel): boolean {

        console.log('ENTER isAttackPossible...');

        console.log(threatAgentSkills); // String
        const threatAgentSkillsValue = SkillLevel[threatAgentSkills];
        console.log(threatAgentSkillsValue); // Number

        console.log(attackStrategyDifficulty); // String
        const attackStrategyDifficultyValue = SkillLevel[attackStrategyDifficulty];
        console.log(attackStrategyDifficultyValue); // Number

        return threatAgentSkillsValue >= attackStrategyDifficultyValue;
    }

    public static numberToAttackStrategyLikelihood(likelihoodNumber: number): AttackStrategyLikelihood {
        // Round it to the nearest integer value
        const integerLikelihood: number = Math.round(likelihoodNumber);
        console.log('Integer LikelihoodNumber: ' + integerLikelihood);

        // Get the corresponding Likelihood enum entry
        const likelihood: AttackStrategyLikelihood = AttackStrategyLikelihood[AttackStrategyLikelihood[integerLikelihood]];
        console.log('Likelihood enum: ' + likelihood);

        return likelihood;
    }

    public static threatAgentChanged(threatAgent: ThreatAgentMgm, augmentedAttackStrategiesMap: Map<number/*AttackStrategy ID*/, AugmentedAttackStrategy/*AttackStrategy likelihoods*/>) {
        console.log('ThreatAgent Changed: ' + JSON.stringify(threatAgent));
        // Update the enabled status of each AttackStrategy depending on the Skills of
        // the ThreatAgent and the Skills required to perform the attack.
        augmentedAttackStrategiesMap.forEach((augmentedAttackStrategy: AugmentedAttackStrategy) => {
            const attackStrategy: AttackStrategyMgm = augmentedAttackStrategy;
            console.log('AttackStrategy: ' + JSON.stringify(attackStrategy));

            // Check if the ThreatAgent is defined or not
            if (threatAgent) {
                augmentedAttackStrategy.enabled = WeaknessUtils.isAttackPossible(threatAgent.skillLevel, attackStrategy.skill);
            } else {
                augmentedAttackStrategy.enabled = false;
            }

            console.log('Enabled: ' + augmentedAttackStrategy.enabled);
        });
    }

    public static attackStrategyInitialLikelihood(attackStrategy: AttackStrategyMgm): AttackStrategyLikelihood {
        const frequencyValue = Number(Frequency[attackStrategy.frequency]);
        const resourcesValue = Number(ResourceLevel[attackStrategy.resources]);

        const attackStrategyInitialLikelihoodMatrix: {} = {
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

        console.log('Matrix:');
        console.log(JSON.stringify(attackStrategyInitialLikelihoodMatrix));

        // Reducing matrix index by one, since it's zero-based
        const likelihood: AttackStrategyLikelihood = attackStrategyInitialLikelihoodMatrix[frequencyValue][resourcesValue];
        console.log('Likelihood: ' + likelihood);

        return likelihood;
    }

    public static attackStrategyAnswersLikelihood(attackStrategyUpdate: AttackStrategyUpdate, answerWeightMap: Map<number, Map<number, number>>): number {

        if (attackStrategyUpdate) {
            let numerator = 0;
            let denominator = 0;

            if (attackStrategyUpdate.questionsAnswerMap) {
                const questionAnswersMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = attackStrategyUpdate.questionsAnswerMap;

                questionAnswersMap.forEach((value: Couple<QuestionMgm, AnswerMgm>, key: Number) => {
                    const question: QuestionMgm = value.key;
                    const answer: AnswerMgm = value.value;
                    const answerLikelihoodValue: number = Number(AnswerLikelihood[answer.likelihood]);

                    const answerWeight: number = WeaknessUtils.getAnswerWeight(question, answer, answerWeightMap);

                    numerator += answerWeight * answerLikelihoodValue;
                    denominator += answerWeight;
                });
            }

            if (denominator !== 0) {
                return numerator / denominator;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    public static attackStrategyContextualLikelihood(initialLikelihood: number, answersLikelihood: number) {
        return (initialLikelihood + answersLikelihood) / 2;
    }
}
