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

describe('Phase e2e test', () => {

    let navBarPage: NavBarPage;
    let phaseDialogPage: PhaseDialogPage;
    let phaseComponentsPage: PhaseComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Phases', () => {
        navBarPage.goToEntity('phase-mgm');
        phaseComponentsPage = new PhaseComponentsPage();
        expect(phaseComponentsPage.getTitle())
            .toMatch(/hermeneutApp.phase.home.title/);

    });

    it('should load create Phase dialog', () => {
        phaseComponentsPage.clickOnCreateButton();
        phaseDialogPage = new PhaseDialogPage();
        expect(phaseDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.phase.home.createOrEditLabel/);
        phaseDialogPage.close();
    });

    it('should create and save Phases', () => {
        phaseComponentsPage.clickOnCreateButton();
        phaseDialogPage.setNameInput('name');
        expect(phaseDialogPage.getNameInput()).toMatch('name');
        phaseDialogPage.setDescriptionInput('description');
        expect(phaseDialogPage.getDescriptionInput()).toMatch('description');
        phaseDialogPage.setWeightInput('5');
        expect(phaseDialogPage.getWeightInput()).toMatch('5');
        phaseDialogPage.save();
        expect(phaseDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PhaseComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-phase-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PhaseDialogPage {
    modalTitle = element(by.css('h4#myPhaseLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    weightInput = element(by.css('input#field_weight'));

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
