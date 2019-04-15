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

describe('CompanyGroup e2e test', () => {

    let navBarPage: NavBarPage;
    let companyGroupDialogPage: CompanyGroupDialogPage;
    let companyGroupComponentsPage: CompanyGroupComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CompanyGroups', () => {
        navBarPage.goToEntity('company-group-mgm');
        companyGroupComponentsPage = new CompanyGroupComponentsPage();
        expect(companyGroupComponentsPage.getTitle())
            .toMatch(/hermeneutApp.companyGroup.home.title/);

    });

    it('should load create CompanyGroup dialog', () => {
        companyGroupComponentsPage.clickOnCreateButton();
        companyGroupDialogPage = new CompanyGroupDialogPage();
        expect(companyGroupDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.companyGroup.home.createOrEditLabel/);
        companyGroupDialogPage.close();
    });

    it('should create and save CompanyGroups', () => {
        companyGroupComponentsPage.clickOnCreateButton();
        companyGroupDialogPage.setNameInput('name');
        expect(companyGroupDialogPage.getNameInput()).toMatch('name');
        companyGroupDialogPage.setDescriptionInput('description');
        expect(companyGroupDialogPage.getDescriptionInput()).toMatch('description');
        companyGroupDialogPage.setCreatedInput(12310020012301);
        expect(companyGroupDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        companyGroupDialogPage.setModifiedInput(12310020012301);
        expect(companyGroupDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        companyGroupDialogPage.userSelectLastOption();
        companyGroupDialogPage.companyprofileSelectLastOption();
        companyGroupDialogPage.save();
        expect(companyGroupDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CompanyGroupComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-company-group-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CompanyGroupDialogPage {
    modalTitle = element(by.css('h4#myCompanyGroupLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    userSelect = element(by.css('select#field_user'));
    companyprofileSelect = element(by.css('select#field_companyprofile'));

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

    setCreatedInput = function(created) {
        this.createdInput.sendKeys(created);
    };

    getCreatedInput = function() {
        return this.createdInput.getAttribute('value');
    };

    setModifiedInput = function(modified) {
        this.modifiedInput.sendKeys(modified);
    };

    getModifiedInput = function() {
        return this.modifiedInput.getAttribute('value');
    };

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    };

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    };

    getUserSelect = function() {
        return this.userSelect;
    };

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
    };

    companyprofileSelectLastOption = function() {
        this.companyprofileSelect.all(by.tagName('option')).last().click();
    };

    companyprofileSelectOption = function(option) {
        this.companyprofileSelect.sendKeys(option);
    };

    getCompanyprofileSelect = function() {
        return this.companyprofileSelect;
    };

    getCompanyprofileSelectedOption = function() {
        return this.companyprofileSelect.element(by.css('option:checked')).getText();
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
