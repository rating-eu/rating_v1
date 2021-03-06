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

describe('DomainOfInfluence e2e test', () => {

    let navBarPage: NavBarPage;
    let domainOfInfluenceDialogPage: DomainOfInfluenceDialogPage;
    let domainOfInfluenceComponentsPage: DomainOfInfluenceComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DomainOfInfluences', () => {
        navBarPage.goToEntity('domain-of-influence-mgm');
        domainOfInfluenceComponentsPage = new DomainOfInfluenceComponentsPage();
        expect(domainOfInfluenceComponentsPage.getTitle())
            .toMatch(/hermeneutApp.domainOfInfluence.home.title/);

    });

    it('should load create DomainOfInfluence dialog', () => {
        domainOfInfluenceComponentsPage.clickOnCreateButton();
        domainOfInfluenceDialogPage = new DomainOfInfluenceDialogPage();
        expect(domainOfInfluenceDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.domainOfInfluence.home.createOrEditLabel/);
        domainOfInfluenceDialogPage.close();
    });

    it('should create and save DomainOfInfluences', () => {
        domainOfInfluenceComponentsPage.clickOnCreateButton();
        domainOfInfluenceDialogPage.setNameInput('name');
        expect(domainOfInfluenceDialogPage.getNameInput()).toMatch('name');
        domainOfInfluenceDialogPage.setDescriptionInput('description');
        expect(domainOfInfluenceDialogPage.getDescriptionInput()).toMatch('description');
        domainOfInfluenceDialogPage.containerSelectLastOption();
        domainOfInfluenceDialogPage.save();
        expect(domainOfInfluenceDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DomainOfInfluenceComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-domain-of-influence-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DomainOfInfluenceDialogPage {
    modalTitle = element(by.css('h4#myDomainOfInfluenceLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    containerSelect = element(by.css('select#field_container'));

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

    containerSelectLastOption = function() {
        this.containerSelect.all(by.tagName('option')).last().click();
    };

    containerSelectOption = function(option) {
        this.containerSelect.sendKeys(option);
    };

    getContainerSelect = function() {
        return this.containerSelect;
    };

    getContainerSelectedOption = function() {
        return this.containerSelect.element(by.css('option:checked')).getText();
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
