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

describe('SplittingValue e2e test', () => {

    let navBarPage: NavBarPage;
    let splittingValueDialogPage: SplittingValueDialogPage;
    let splittingValueComponentsPage: SplittingValueComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SplittingValues', () => {
        navBarPage.goToEntity('splitting-value-mgm');
        splittingValueComponentsPage = new SplittingValueComponentsPage();
        expect(splittingValueComponentsPage.getTitle())
            .toMatch(/hermeneutApp.splittingValue.home.title/);

    });

    it('should load create SplittingValue dialog', () => {
        splittingValueComponentsPage.clickOnCreateButton();
        splittingValueDialogPage = new SplittingValueDialogPage();
        expect(splittingValueDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.splittingValue.home.createOrEditLabel/);
        splittingValueDialogPage.close();
    });

    it('should create and save SplittingValues', () => {
        splittingValueComponentsPage.clickOnCreateButton();
        splittingValueDialogPage.sectorTypeSelectLastOption();
        splittingValueDialogPage.categoryTypeSelectLastOption();
        splittingValueDialogPage.setValueInput('5');
        expect(splittingValueDialogPage.getValueInput()).toMatch('5');
        splittingValueDialogPage.selfAssessmentSelectLastOption();
        splittingValueDialogPage.save();
        expect(splittingValueDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SplittingValueComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-splitting-value-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SplittingValueDialogPage {
    modalTitle = element(by.css('h4#mySplittingValueLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    sectorTypeSelect = element(by.css('select#field_sectorType'));
    categoryTypeSelect = element(by.css('select#field_categoryType'));
    valueInput = element(by.css('input#field_value'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setSectorTypeSelect = function(sectorType) {
        this.sectorTypeSelect.sendKeys(sectorType);
    };

    getSectorTypeSelect = function() {
        return this.sectorTypeSelect.element(by.css('option:checked')).getText();
    };

    sectorTypeSelectLastOption = function() {
        this.sectorTypeSelect.all(by.tagName('option')).last().click();
    };
    setCategoryTypeSelect = function(categoryType) {
        this.categoryTypeSelect.sendKeys(categoryType);
    };

    getCategoryTypeSelect = function() {
        return this.categoryTypeSelect.element(by.css('option:checked')).getText();
    };

    categoryTypeSelectLastOption = function() {
        this.categoryTypeSelect.all(by.tagName('option')).last().click();
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
