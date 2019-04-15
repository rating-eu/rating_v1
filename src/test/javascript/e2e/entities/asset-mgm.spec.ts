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

describe('Asset e2e test', () => {

    let navBarPage: NavBarPage;
    let assetDialogPage: AssetDialogPage;
    let assetComponentsPage: AssetComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Assets', () => {
        navBarPage.goToEntity('asset-mgm');
        assetComponentsPage = new AssetComponentsPage();
        expect(assetComponentsPage.getTitle())
            .toMatch(/hermeneutApp.asset.home.title/);

    });

    it('should load create Asset dialog', () => {
        assetComponentsPage.clickOnCreateButton();
        assetDialogPage = new AssetDialogPage();
        expect(assetDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.asset.home.createOrEditLabel/);
        assetDialogPage.close();
    });

    it('should create and save Assets', () => {
        assetComponentsPage.clickOnCreateButton();
        assetDialogPage.setNameInput('name');
        expect(assetDialogPage.getNameInput()).toMatch('name');
        assetDialogPage.setDescriptionInput('description');
        expect(assetDialogPage.getDescriptionInput()).toMatch('description');
        assetDialogPage.setCreatedInput(12310020012301);
        expect(assetDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        assetDialogPage.setModifiedInput(12310020012301);
        expect(assetDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        // assetDialogPage.containerSelectLastOption();
        // assetDialogPage.domainsOfInfluenceSelectLastOption();
        assetDialogPage.assetcategorySelectLastOption();
        assetDialogPage.save();
        expect(assetDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AssetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-asset-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AssetDialogPage {
    modalTitle = element(by.css('h4#myAssetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    containerSelect = element(by.css('select#field_container'));
    domainsOfInfluenceSelect = element(by.css('select#field_domainsOfInfluence'));
    assetcategorySelect = element(by.css('select#field_assetcategory'));

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

    domainsOfInfluenceSelectLastOption = function() {
        this.domainsOfInfluenceSelect.all(by.tagName('option')).last().click();
    };

    domainsOfInfluenceSelectOption = function(option) {
        this.domainsOfInfluenceSelect.sendKeys(option);
    };

    getDomainsOfInfluenceSelect = function() {
        return this.domainsOfInfluenceSelect;
    };

    getDomainsOfInfluenceSelectedOption = function() {
        return this.domainsOfInfluenceSelect.element(by.css('option:checked')).getText();
    };

    assetcategorySelectLastOption = function() {
        this.assetcategorySelect.all(by.tagName('option')).last().click();
    };

    assetcategorySelectOption = function(option) {
        this.assetcategorySelect.sendKeys(option);
    };

    getAssetcategorySelect = function() {
        return this.assetcategorySelect;
    };

    getAssetcategorySelectedOption = function() {
        return this.assetcategorySelect.element(by.css('option:checked')).getText();
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
