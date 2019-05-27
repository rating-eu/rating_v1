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

describe('EBIT e2e test', () => {

    let navBarPage: NavBarPage;
    let eBITDialogPage: EBITDialogPage;
    let eBITComponentsPage: EBITComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load EBITS', () => {
        navBarPage.goToEntity('ebit-mgm');
        eBITComponentsPage = new EBITComponentsPage();
        expect(eBITComponentsPage.getTitle())
            .toMatch(/hermeneutApp.eBIT.home.title/);

    });

    it('should load create EBIT dialog', () => {
        eBITComponentsPage.clickOnCreateButton();
        eBITDialogPage = new EBITDialogPage();
        expect(eBITDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.eBIT.home.createOrEditLabel/);
        eBITDialogPage.close();
    });

    it('should create and save EBITS', () => {
        eBITComponentsPage.clickOnCreateButton();
        eBITDialogPage.setYearInput('5');
        expect(eBITDialogPage.getYearInput()).toMatch('5');
        eBITDialogPage.setValueInput('5');
        expect(eBITDialogPage.getValueInput()).toMatch('5');
        eBITDialogPage.setCreatedInput(12310020012301);
        expect(eBITDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        eBITDialogPage.selfAssessmentSelectLastOption();
        eBITDialogPage.save();
        expect(eBITDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class EBITComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-ebit-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class EBITDialogPage {
    modalTitle = element(by.css('h4#myEBITLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    yearInput = element(by.css('input#field_year'));
    valueInput = element(by.css('input#field_value'));
    createdInput = element(by.css('input#field_created'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setYearInput = function(year) {
        this.yearInput.sendKeys(year);
    };

    getYearInput = function() {
        return this.yearInput.getAttribute('value');
    };

    setValueInput = function(value) {
        this.valueInput.sendKeys(value);
    };

    getValueInput = function() {
        return this.valueInput.getAttribute('value');
    };

    setCreatedInput = function(created) {
        this.createdInput.sendKeys(created);
    };

    getCreatedInput = function() {
        return this.createdInput.getAttribute('value');
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
