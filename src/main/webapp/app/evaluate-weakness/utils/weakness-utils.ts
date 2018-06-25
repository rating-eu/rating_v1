import {AnswerWeightMgm} from '../../entities/answer-weight-mgm';
import {QuestionType} from '../../entities/enumerations/QuestionType.enum';
import {AnswerLikelihood} from '../../entities/enumerations/AnswerLikelihood.enum';
import {QuestionMgm} from '../../entities/question-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';
import {SkillLevel} from '../../entities/enumerations/SkillLevel.enum';
import {AttackStrategyLikelihood} from '../../entities/enumerations/AttackStrategyLikelihood.enum';

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
}
