import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm';
import {Couple} from '../../utils/couple.class';
import {QuestionMgm} from '../../entities/question-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';

export class AttackStrategyUpdate extends AttackStrategyMgm {
    constructor(
        public attackStrategy: AttackStrategyMgm,
        public questionsAnswerMap?: Map<number/*Question ID*/, Couple<QuestionMgm, AnswerMgm>>
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
            attackStrategy.mitigations
        );
    }
}
