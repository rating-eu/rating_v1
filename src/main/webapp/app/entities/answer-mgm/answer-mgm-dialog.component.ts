/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AnswerMgm } from './answer-mgm.model';
import { AnswerMgmPopupService } from './answer-mgm-popup.service';
import { AnswerMgmService } from './answer-mgm.service';
import { AssetMgm, AssetMgmService } from '../asset-mgm';
import { AssetCategoryMgm, AssetCategoryMgmService } from '../asset-category-mgm';
import { QuestionMgm, QuestionMgmService } from '../question-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-answer-mgm-dialog',
    templateUrl: './answer-mgm-dialog.component.html'
})
export class AnswerMgmDialogComponent implements OnInit {

    answer: AnswerMgm;
    isSaving: boolean;

    assets: AssetMgm[];

    assetcategories: AssetCategoryMgm[];

    questions: QuestionMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private answerService: AnswerMgmService,
        private assetService: AssetMgmService,
        private assetCategoryService: AssetCategoryMgmService,
        private questionService: QuestionMgmService,
        private eventManager: JhiEventManager,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.assetService
            .query({ filter: 'answer-is-null' })
            .subscribe((res: HttpResponse<AssetMgm[]>) => {
                if (!this.answer.asset || !this.answer.asset.id) {
                    this.assets = res.body;
                } else {
                    this.assetService
                        .find(this.answer.asset.id)
                        .subscribe((subRes: HttpResponse<AssetMgm>) => {
                            this.assets = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.assetCategoryService
            .query({ filter: 'answer-is-null' })
            .subscribe((res: HttpResponse<AssetCategoryMgm[]>) => {
                if (!this.answer.assetCategory || !this.answer.assetCategory.id) {
                    this.assetcategories = res.body;
                } else {
                    this.assetCategoryService
                        .find(this.answer.assetCategory.id)
                        .subscribe((subRes: HttpResponse<AssetCategoryMgm>) => {
                            this.assetcategories = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionService.query()
            .subscribe((res: HttpResponse<QuestionMgm[]>) => { this.questions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.answer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.answerService.update(this.answer));
        } else {
            this.subscribeToSaveResponse(
                this.answerService.create(this.answer));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AnswerMgm>>) {
        result.subscribe((res: HttpResponse<AnswerMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AnswerMgm) {
        this.eventManager.broadcast({ name: 'answerListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackAssetById(index: number, item: AssetMgm) {
        return item.id;
    }

    trackAssetCategoryById(index: number, item: AssetCategoryMgm) {
        return item.id;
    }

    trackQuestionById(index: number, item: QuestionMgm) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-answer-mgm-popup',
    template: ''
})
export class AnswerMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private answerPopupService: AnswerMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.answerPopupService
                        .open(AnswerMgmDialogComponent as Component, params['id']);
                } else {
                    this.answerPopupService
                        .open(AnswerMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
