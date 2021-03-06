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

describe('AttackStrategy e2e test', () => {

    let navBarPage: NavBarPage;
    let attackStrategyDialogPage: AttackStrategyDialogPage;
    let attackStrategyComponentsPage: AttackStrategyComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load AttackStrategies', () => {
        navBarPage.goToEntity('attack-strategy-mgm');
        attackStrategyComponentsPage = new AttackStrategyComponentsPage();
        expect(attackStrategyComponentsPage.getTitle())
            .toMatch(/hermeneutApp.attackStrategy.home.title/);

    });

    it('should load create AttackStrategy dialog', () => {
        attackStrategyComponentsPage.clickOnCreateButton();
        attackStrategyDialogPage = new AttackStrategyDialogPage();
        expect(attackStrategyDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.attackStrategy.home.createOrEditLabel/);
        attackStrategyDialogPage.close();
    });

    it('should create and save AttackStrategies', () => {
        attackStrategyComponentsPage.clickOnCreateButton();
        attackStrategyDialogPage.setNameInput('name');
        expect(attackStrategyDialogPage.getNameInput()).toMatch('name');
        attackStrategyDialogPage.setDescriptionInput('description');
        expect(attackStrategyDialogPage.getDescriptionInput()).toMatch('description');
        attackStrategyDialogPage.frequencySelectLastOption();
        attackStrategyDialogPage.skillSelectLastOption();
        attackStrategyDialogPage.resourcesSelectLastOption();
        attackStrategyDialogPage.likelihoodSelectLastOption();
        attackStrategyDialogPage.setCreatedInput(12310020012301);
        expect(attackStrategyDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        attackStrategyDialogPage.setModifiedInput(12310020012301);
        expect(attackStrategyDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        // attackStrategyDialogPage.mitigationSelectLastOption();
        // attackStrategyDialogPage.levelSelectLastOption();
        // attackStrategyDialogPage.phaseSelectLastOption();
        attackStrategyDialogPage.save();
        expect(attackStrategyDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AttackStrategyComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-attack-strategy-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AttackStrategyDialogPage {
    modalTitle = element(by.css('h4#myAttackStrategyLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    frequencySelect = element(by.css('select#field_frequency'));
    skillSelect = element(by.css('select#field_skill'));
    resourcesSelect = element(by.css('select#field_resources'));
    likelihoodSelect = element(by.css('select#field_likelihood'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    mitigationSelect = element(by.css('select#field_mitigation'));
    levelSelect = element(by.css('select#field_level'));
    phaseSelect = element(by.css('select#field_phase'));

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

    setFrequencySelect = function(frequency) {
        this.frequencySelect.sendKeys(frequency);
    };

    getFrequencySelect = function() {
        return this.frequencySelect.element(by.css('option:checked')).getText();
    };

    frequencySelectLastOption = function() {
        this.frequencySelect.all(by.tagName('option')).last().click();
    };
    setSkillSelect = function(skill) {
        this.skillSelect.sendKeys(skill);
    };

    getSkillSelect = function() {
        return this.skillSelect.element(by.css('option:checked')).getText();
    };

    skillSelectLastOption = function() {
        this.skillSelect.all(by.tagName('option')).last().click();
    };
    setResourcesSelect = function(resources) {
        this.resourcesSelect.sendKeys(resources);
    };

    getResourcesSelect = function() {
        return this.resourcesSelect.element(by.css('option:checked')).getText();
    };

    resourcesSelectLastOption = function() {
        this.resourcesSelect.all(by.tagName('option')).last().click();
    };
    setLikelihoodSelect = function(likelihood) {
        this.likelihoodSelect.sendKeys(likelihood);
    };

    getLikelihoodSelect = function() {
        return this.likelihoodSelect.element(by.css('option:checked')).getText();
    };

    likelihoodSelectLastOption = function() {
        this.likelihoodSelect.all(by.tagName('option')).last().click();
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

    mitigationSelectLastOption = function() {
        this.mitigationSelect.all(by.tagName('option')).last().click();
    };

    mitigationSelectOption = function(option) {
        this.mitigationSelect.sendKeys(option);
    };

    getMitigationSelect = function() {
        return this.mitigationSelect;
    };

    getMitigationSelectedOption = function() {
        return this.mitigationSelect.element(by.css('option:checked')).getText();
    };

    levelSelectLastOption = function() {
        this.levelSelect.all(by.tagName('option')).last().click();
    };

    levelSelectOption = function(option) {
        this.levelSelect.sendKeys(option);
    };

    getLevelSelect = function() {
        return this.levelSelect;
    };

    getLevelSelectedOption = function() {
        return this.levelSelect.element(by.css('option:checked')).getText();
    };

    phaseSelectLastOption = function() {
        this.phaseSelect.all(by.tagName('option')).last().click();
    };

    phaseSelectOption = function(option) {
        this.phaseSelect.sendKeys(option);
    };

    getPhaseSelect = function() {
        return this.phaseSelect;
    };

    getPhaseSelectedOption = function() {
        return this.phaseSelect.element(by.css('option:checked')).getText();
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
