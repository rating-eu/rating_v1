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

import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('AnswerWeight e2e test', () => {

    let navBarPage: NavBarPage;
    let answerWeightDialogPage: AnswerWeightDialogPage;
    let answerWeightComponentsPage: AnswerWeightComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load AnswerWeights', () => {
        navBarPage.goToEntity('answer-weight-mgm');
        answerWeightComponentsPage = new AnswerWeightComponentsPage();
        expect(answerWeightComponentsPage.getTitle())
            .toMatch(/hermeneutApp.answerWeight.home.title/);

    });

    it('should load create AnswerWeight dialog', () => {
        answerWeightComponentsPage.clickOnCreateButton();
        answerWeightDialogPage = new AnswerWeightDialogPage();
        expect(answerWeightDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.answerWeight.home.createOrEditLabel/);
        answerWeightDialogPage.close();
    });

    it('should create and save AnswerWeights', () => {
        answerWeightComponentsPage.clickOnCreateButton();
        answerWeightDialogPage.likelihoodSelectLastOption();
        answerWeightDialogPage.questionTypeSelectLastOption();
        answerWeightDialogPage.setWeightInput('5');
        expect(answerWeightDialogPage.getWeightInput()).toMatch('5');
        answerWeightDialogPage.save();
        expect(answerWeightDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AnswerWeightComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-answer-weight-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AnswerWeightDialogPage {
    modalTitle = element(by.css('h4#myAnswerWeightLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    likelihoodSelect = element(by.css('select#field_likelihood'));
    questionTypeSelect = element(by.css('select#field_questionType'));
    weightInput = element(by.css('input#field_weight'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setLikelihoodSelect = function(likelihood) {
        this.likelihoodSelect.sendKeys(likelihood);
    };

    getLikelihoodSelect = function() {
        return this.likelihoodSelect.element(by.css('option:checked')).getText();
    };

    likelihoodSelectLastOption = function() {
        this.likelihoodSelect.all(by.tagName('option')).last().click();
    };
    setQuestionTypeSelect = function(questionType) {
        this.questionTypeSelect.sendKeys(questionType);
    };

    getQuestionTypeSelect = function() {
        return this.questionTypeSelect.element(by.css('option:checked')).getText();
    };

    questionTypeSelectLastOption = function() {
        this.questionTypeSelect.all(by.tagName('option')).last().click();
    };
    setWeightInput = function(weight) {
        this.weightInput.sendKeys(weight);
    };

    getWeightInput = function() {
        return this.weightInput.getAttribute('value');
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
