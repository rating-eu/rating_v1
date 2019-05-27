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

describe('Container e2e test', () => {

    let navBarPage: NavBarPage;
    let containerDialogPage: ContainerDialogPage;
    let containerComponentsPage: ContainerComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Containers', () => {
        navBarPage.goToEntity('container-mgm');
        containerComponentsPage = new ContainerComponentsPage();
        expect(containerComponentsPage.getTitle())
            .toMatch(/hermeneutApp.container.home.title/);

    });

    it('should load create Container dialog', () => {
        containerComponentsPage.clickOnCreateButton();
        containerDialogPage = new ContainerDialogPage();
        expect(containerDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.container.home.createOrEditLabel/);
        containerDialogPage.close();
    });

    it('should create and save Containers', () => {
        containerComponentsPage.clickOnCreateButton();
        containerDialogPage.setNameInput('name');
        expect(containerDialogPage.getNameInput()).toMatch('name');
        containerDialogPage.setDescriptionInput('description');
        expect(containerDialogPage.getDescriptionInput()).toMatch('description');
        containerDialogPage.containerTypeSelectLastOption();
        containerDialogPage.setCreatedInput(12310020012301);
        expect(containerDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        containerDialogPage.save();
        expect(containerDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ContainerComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-container-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ContainerDialogPage {
    modalTitle = element(by.css('h4#myContainerLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    containerTypeSelect = element(by.css('select#field_containerType'));
    createdInput = element(by.css('input#field_created'));

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

    setContainerTypeSelect = function(containerType) {
        this.containerTypeSelect.sendKeys(containerType);
    };

    getContainerTypeSelect = function() {
        return this.containerTypeSelect.element(by.css('option:checked')).getText();
    };

    containerTypeSelectLastOption = function() {
        this.containerTypeSelect.all(by.tagName('option')).last().click();
    };
    setCreatedInput = function(created) {
        this.createdInput.sendKeys(created);
    };

    getCreatedInput = function() {
        return this.createdInput.getAttribute('value');
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
