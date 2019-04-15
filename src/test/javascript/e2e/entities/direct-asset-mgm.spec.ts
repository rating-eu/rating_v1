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

describe('DirectAsset e2e test', () => {

    let navBarPage: NavBarPage;
    let directAssetDialogPage: DirectAssetDialogPage;
    let directAssetComponentsPage: DirectAssetComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DirectAssets', () => {
        navBarPage.goToEntity('direct-asset-mgm');
        directAssetComponentsPage = new DirectAssetComponentsPage();
        expect(directAssetComponentsPage.getTitle())
            .toMatch(/hermeneutApp.directAsset.home.title/);

    });

    it('should load create DirectAsset dialog', () => {
        directAssetComponentsPage.clickOnCreateButton();
        directAssetDialogPage = new DirectAssetDialogPage();
        expect(directAssetDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.directAsset.home.createOrEditLabel/);
        directAssetDialogPage.close();
    });

    it('should create and save DirectAssets', () => {
        directAssetComponentsPage.clickOnCreateButton();
        directAssetDialogPage.myAssetSelectLastOption();
        directAssetDialogPage.save();
        expect(directAssetDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DirectAssetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-direct-asset-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DirectAssetDialogPage {
    modalTitle = element(by.css('h4#myDirectAssetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    myAssetSelect = element(by.css('select#field_myAsset'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    myAssetSelectLastOption = function() {
        this.myAssetSelect.all(by.tagName('option')).last().click();
    };

    myAssetSelectOption = function(option) {
        this.myAssetSelect.sendKeys(option);
    };

    getMyAssetSelect = function() {
        return this.myAssetSelect;
    };

    getMyAssetSelectedOption = function() {
        return this.myAssetSelect.element(by.css('option:checked')).getText();
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
