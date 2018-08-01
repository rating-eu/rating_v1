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

@Injectable()
export class IdentifyAssetUtilService {
    private myAnswersComplited: MyAnswerMgm[];
    private myAssets: MyAssetMgm[];
    private myDirectAsset: DirectAssetMgm[];
    private myIndirectAsset: IndirectAssetMgm[];

    private updateAssetsList: Subject<MyAssetMgm> = new Subject<MyAssetMgm>();

    constructor() {
        if (!this.myAnswersComplited) {
            this.myAnswersComplited = [];
        }
        if (!this.myAssets) {
            this.myAssets = [];
        }
    }

    public getUpdateAssetsList(): Observable<MyAssetMgm> {
        return this.sectionTitle.asObservable();
    }
    
    publi sendSectionTitle(title: string) {
        this.sectionTitle.next(title);
    }

    public getMyAnswersComplited(): MyAnswerMgm[] {
        return this.myAnswersComplited;
    }

    public getMyAssets(): MyAssetMgm[] {
        return this.myAssets;
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
