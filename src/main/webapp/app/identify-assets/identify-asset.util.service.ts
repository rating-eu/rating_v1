import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AnswerMgm } from '../entities/answer-mgm';
import { MyAssetMgm } from '../entities/my-asset-mgm';
import { MyAnswerMgm } from '../entities/my-answer-mgm';
import { DirectAssetMgm } from '../entities/direct-asset-mgm';
import { IndirectAssetMgm } from '../entities/indirect-asset-mgm';
import { Subject } from '../../../../../node_modules/rxjs';
import { AssetMgm } from '../entities/asset-mgm';
import { AttackCostMgm } from '../entities/attack-cost-mgm';

@Injectable()
export class IdentifyAssetUtilService {
    private myAnswersComplited: MyAnswerMgm[];
    private myAssets: MyAssetMgm[];
    private myDirectAssets: DirectAssetMgm[];
    private myIndirectAssets: IndirectAssetMgm[];

    // private updateAssetsList: Subject<MyAssetMgm> = new Subject<MyAssetMgm>();

    constructor() {
        if (!this.myAnswersComplited) {
            this.myAnswersComplited = [];
        }
        if (!this.myAssets) {
            this.myAssets = [];
        }
        if (!this.myDirectAssets) {
            this.myDirectAssets = [];
        }
        if (!this.myIndirectAssets) {
            this.myIndirectAssets = [];
        }
    }
    /*
    public getUpdateAssetsList(): Observable<MyAssetMgm> {
        return this.sectionTitle.asObservable();
    }
    
    publi sendSectionTitle(title: string) {
        this.sectionTitle.next(title);
    }
    */
    public getMyDirectAsset(): DirectAssetMgm[] {
        return this.myDirectAssets;
    }

    public getMyIndirectAsset(): IndirectAssetMgm[] {
        return this.myIndirectAssets;
    }

    public getMyAnswersComplited(): MyAnswerMgm[] {
        return this.myAnswersComplited;
    }

    public getMyAssets(): MyAssetMgm[] {
        return this.myAssets;
    }

    public addMyDirectAssets(asset: MyAssetMgm) {
        const index = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.asset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index === -1) {
            const direct = new DirectAssetMgm();
            direct.asset = asset;
            direct.costs = undefined;
            direct.effects = undefined;
            this.myDirectAssets.push(direct);
        }
    }

    public removeFromMyDirectAssets(asset: MyAssetMgm) {
        const index = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.asset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index !== -1) {
            this.myDirectAssets.splice(index, 1);
        }
    }

    public updateMyDirectAssets(asset: MyAssetMgm, cost: AttackCostMgm, effect: IndirectAssetMgm) {
        const index = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.asset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index !== -1) {
            if (cost) {
                if (!this.myDirectAssets[index].costs) {
                    this.myDirectAssets[index].costs = [];
                }
                const indexC = _.findIndex(this.myDirectAssets,
                    (myDirectAsset) => (myDirectAsset.costs as AttackCostMgm).id === cost.id
                );
                if (indexC === -1) {
                    this.myDirectAssets[index].costs.push(cost);
                } else {
                    this.myDirectAssets[index].costs.splice(indexC, 1);
                }
            }
            if (effect) {
                if (!this.myDirectAssets[index].effects) {
                    this.myDirectAssets[index].effects = [];
                }
                const indexF = _.findIndex(this.myDirectAssets,
                    (myDirectAsset) => (myDirectAsset.effects as IndirectAssetMgm).id === effect.id
                );
                if (indexF === -1) {
                    this.myDirectAssets[index].effects.push(effect);
                } else {
                    this.myDirectAssets[index].effects.splice(indexF, 1);
                }
            }
        }
    }

    public addMyIndirectAssets(asset: MyAssetMgm, directAsset: AssetMgm) {
        const index = _.findIndex(this.myIndirectAssets,
            (myIndirectAsset) => (myIndirectAsset.asset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index === -1) {
            const indirect = new IndirectAssetMgm();
            indirect.asset = asset;
            indirect.costs = undefined;
            indirect.directAsset = directAsset;
            this.myIndirectAssets.push(indirect);
        }
    }

    public removeFromMyIndirectAssets(asset: MyAssetMgm) {
        const index = _.findIndex(this.myIndirectAssets,
            (myIndirectAsset) => (myIndirectAsset.asset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index !== -1) {
            this.myIndirectAssets.splice(index, 1);
        }
    }

    public updateMyIndirectAssets(asset: MyAssetMgm, cost: AttackCostMgm) {
        const index = _.findIndex(this.myIndirectAssets,
            (myIndirectAsset) => (myIndirectAsset.asset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index !== -1) {
            if (cost) {
                if (!this.myIndirectAssets[index].costs) {
                    this.myIndirectAssets[index].costs = [];
                }
                const indexC = _.findIndex(this.myIndirectAssets,
                    (myIndirectAsset) => (myIndirectAsset.costs as AttackCostMgm).id === cost.id
                );
                if (indexC === -1) {
                    this.myIndirectAssets[index].costs.push(cost);
                } else {
                    this.myIndirectAssets[index].costs.splice(indexC, 1);
                }
            }
        }
    }

    public addMyAnswer(answer: MyAnswerMgm) {
        const index = _.findIndex(this.myAnswersComplited,
            (myAnswer) => myAnswer.answer.id === answer.answer.id && myAnswer.question.id === answer.question.id
        );
        if (index === -1) {
            this.myAnswersComplited.push(answer);
        }
    }

    public removeFromMyAnswer(answer: MyAnswerMgm) {
        const index = _.findIndex(this.myAnswersComplited,
            (myAnswer) => myAnswer.answer.id === answer.answer.id && myAnswer.question.id === answer.question.id
        );
        this.myAnswersComplited.splice(index, 1);
    }

    public updateMyAnswers(answer: MyAnswerMgm) {
        const index = _.findIndex(this.myAnswersComplited,
            (myAnswer) => myAnswer.answer.id === answer.answer.id && myAnswer.question.id === answer.question.id
        );
        this.myAnswersComplited.splice(index, 1, answer);
    }

    public addMyAsset(asset: MyAssetMgm) {
        const index = _.findIndex(this.myAssets,
            (myAsset) => myAsset.asset.id === asset.asset.id
        );
        if (index === -1) {
            this.myAssets.push(asset);
        }
    }

    public updateMyAssets(asset: MyAssetMgm, property: string) {
        const index = _.findIndex(this.myAssets,
            (myAsset) => myAsset.asset.id === asset.asset.id
        );
        switch (property) {
            case 'asset': {
                this.myAssets[index].asset = asset.asset;
                break;
            }
            case 'estimated': {
                this.myAssets[index].estimated = asset.estimated;
                break;
            }
            case 'id': {
                this.myAssets[index].id = asset.id;
                break;
            }
            case 'magnitude': {
                this.myAssets[index].magnitude = asset.magnitude;
                break;
            }
            case 'questionnaire': {
                this.myAssets[index].questionnaire = asset.questionnaire;
                break;
            }
            case 'ranking': {
                this.myAssets[index].ranking = asset.ranking;
                break;
            }
            case 'selfAssessment': {
                this.myAssets[index].selfAssessment = asset.selfAssessment;
                break;
            }
        }
        /*
        if (index !== -1) {
            asset.asset ? this.myAssets[index].asset = asset.asset : this.myAssets[index].asset = undefined;
            asset.estimated ? this.myAssets[index].estimated = asset.estimated : this.myAssets[index].estimated = undefined;
            asset.id ? this.myAssets[index].id = asset.id : this.myAssets[index].id = undefined;
            asset.magnitude ? this.myAssets[index].magnitude = asset.magnitude : this.myAssets[index].magnitude = undefined;
            asset.questionnaire ? this.myAssets[index].questionnaire = asset.questionnaire : this.myAssets[index].questionnaire = undefined;
            asset.ranking ? this.myAssets[index].ranking = asset.ranking : this.myAssets[index].ranking = undefined;
            asset.selfAssessment ? this.myAssets[index].selfAssessment = asset.selfAssessment : this.myAssets[index].selfAssessment = undefined;
        } else {
            this.myAssets.push(asset);
        }
        */
    }

    public removeFromMyAssets(asset: MyAssetMgm) {
        const index = _.findIndex(this.myAssets,
            (myAsset) => myAsset.asset.id === asset.asset.id
        );
        if (this.myAssets[index].estimated === undefined &&
            this.myAssets[index].magnitude === undefined &&
            this.myAssets[index].ranking === undefined
        ) {
            this.myAssets.splice(index, 1);
        }
    }

}
