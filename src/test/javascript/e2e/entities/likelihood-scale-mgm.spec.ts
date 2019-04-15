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

describe('LikelihoodScale e2e test', () => {

    let navBarPage: NavBarPage;
    let likelihoodScaleDialogPage: LikelihoodScaleDialogPage;
    let likelihoodScaleComponentsPage: LikelihoodScaleComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load LikelihoodScales', () => {
        navBarPage.goToEntity('likelihood-scale-mgm');
        likelihoodScaleComponentsPage = new LikelihoodScaleComponentsPage();
        expect(likelihoodScaleComponentsPage.getTitle())
            .toMatch(/hermeneutApp.likelihoodScale.home.title/);

    });

    it('should load create LikelihoodScale dialog', () => {
        likelihoodScaleComponentsPage.clickOnCreateButton();
        likelihoodScaleDialogPage = new LikelihoodScaleDialogPage();
        expect(likelihoodScaleDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.likelihoodScale.home.createOrEditLabel/);
        likelihoodScaleDialogPage.close();
    });

    it('should create and save LikelihoodScales', () => {
        likelihoodScaleComponentsPage.clickOnCreateButton();
        likelihoodScaleDialogPage.setNameInput('name');
        expect(likelihoodScaleDialogPage.getNameInput()).toMatch('name');
        likelihoodScaleDialogPage.setDescriptionInput('description');
        expect(likelihoodScaleDialogPage.getDescriptionInput()).toMatch('description');
        likelihoodScaleDialogPage.setLikelihoodInput('5');
        expect(likelihoodScaleDialogPage.getLikelihoodInput()).toMatch('5');
        likelihoodScaleDialogPage.setFrequencyInput('5');
        expect(likelihoodScaleDialogPage.getFrequencyInput()).toMatch('5');
        likelihoodScaleDialogPage.selfAssessmentSelectLastOption();
        likelihoodScaleDialogPage.save();
        expect(likelihoodScaleDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class LikelihoodScaleComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-likelihood-scale-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LikelihoodScaleDialogPage {
    modalTitle = element(by.css('h4#myLikelihoodScaleLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    likelihoodInput = element(by.css('input#field_likelihood'));
    frequencyInput = element(by.css('input#field_frequency'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    };

    setLikelihoodInput = function(likelihood) {
        this.likelihoodInput.sendKeys(likelihood);
    };

    getLikelihoodInput = function() {
        return this.likelihoodInput.getAttribute('value');
    };

    setFrequencyInput = function(frequency) {
        this.frequencyInput.sendKeys(frequency);
    };

    getFrequencyInput = function() {
        return this.frequencyInput.getAttribute('value');
    };

    selfAssessmentSelectLastOption = function() {
        this.selfAssessmentSelect.all(by.tagName('option')).last().click();
    };

    selfAssessmentSelectOption = function(option) {
        this.selfAssessmentSelect.sendKeys(option);
    };

    getSelfAssessmentSelect = function() {
        return this.selfAssessmentSelect;
    };

    getSelfAssessmentSelectedOption = function() {
        return this.selfAssessmentSelect.element(by.css('option:checked')).getText();
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
