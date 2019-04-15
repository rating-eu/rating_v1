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

describe('AttackCostParam e2e test', () => {

    let navBarPage: NavBarPage;
    let attackCostParamDialogPage: AttackCostParamDialogPage;
    let attackCostParamComponentsPage: AttackCostParamComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load AttackCostParams', () => {
        navBarPage.goToEntity('attack-cost-param-mgm');
        attackCostParamComponentsPage = new AttackCostParamComponentsPage();
        expect(attackCostParamComponentsPage.getTitle())
            .toMatch(/hermeneutApp.attackCostParam.home.title/);

    });

    it('should load create AttackCostParam dialog', () => {
        attackCostParamComponentsPage.clickOnCreateButton();
        attackCostParamDialogPage = new AttackCostParamDialogPage();
        expect(attackCostParamDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.attackCostParam.home.createOrEditLabel/);
        attackCostParamDialogPage.close();
    });

    it('should create and save AttackCostParams', () => {
        attackCostParamComponentsPage.clickOnCreateButton();
        attackCostParamDialogPage.typeSelectLastOption();
        attackCostParamDialogPage.setValueInput('5');
        expect(attackCostParamDialogPage.getValueInput()).toMatch('5');
        attackCostParamDialogPage.selfAssessmentSelectLastOption();
        attackCostParamDialogPage.save();
        expect(attackCostParamDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AttackCostParamComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-attack-cost-param-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AttackCostParamDialogPage {
    modalTitle = element(by.css('h4#myAttackCostParamLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    typeSelect = element(by.css('select#field_type'));
    valueInput = element(by.css('input#field_value'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
    };
    setValueInput = function(value) {
        this.valueInput.sendKeys(value);
    };

    getValueInput = function() {
        return this.valueInput.getAttribute('value');
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
