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

describe('EconomicCoefficients e2e test', () => {

    let navBarPage: NavBarPage;
    let economicCoefficientsDialogPage: EconomicCoefficientsDialogPage;
    let economicCoefficientsComponentsPage: EconomicCoefficientsComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load EconomicCoefficients', () => {
        navBarPage.goToEntity('economic-coefficients-mgm');
        economicCoefficientsComponentsPage = new EconomicCoefficientsComponentsPage();
        expect(economicCoefficientsComponentsPage.getTitle())
            .toMatch(/hermeneutApp.economicCoefficients.home.title/);

    });

    it('should load create EconomicCoefficients dialog', () => {
        economicCoefficientsComponentsPage.clickOnCreateButton();
        economicCoefficientsDialogPage = new EconomicCoefficientsDialogPage();
        expect(economicCoefficientsDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.economicCoefficients.home.createOrEditLabel/);
        economicCoefficientsDialogPage.close();
    });

    it('should create and save EconomicCoefficients', () => {
        economicCoefficientsComponentsPage.clickOnCreateButton();
        economicCoefficientsDialogPage.setDiscountingRateInput('5');
        expect(economicCoefficientsDialogPage.getDiscountingRateInput()).toMatch('5');
        economicCoefficientsDialogPage.setPhysicalAssetsReturnInput('5');
        expect(economicCoefficientsDialogPage.getPhysicalAssetsReturnInput()).toMatch('5');
        economicCoefficientsDialogPage.setFinancialAssetsReturnInput('5');
        expect(economicCoefficientsDialogPage.getFinancialAssetsReturnInput()).toMatch('5');
        economicCoefficientsDialogPage.setLossOfIntangibleInput('5');
        expect(economicCoefficientsDialogPage.getLossOfIntangibleInput()).toMatch('5');
        economicCoefficientsDialogPage.selfAssessmentSelectLastOption();
        economicCoefficientsDialogPage.save();
        expect(economicCoefficientsDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class EconomicCoefficientsComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-economic-coefficients-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class EconomicCoefficientsDialogPage {
    modalTitle = element(by.css('h4#myEconomicCoefficientsLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    discountingRateInput = element(by.css('input#field_discountingRate'));
    physicalAssetsReturnInput = element(by.css('input#field_physicalAssetsReturn'));
    financialAssetsReturnInput = element(by.css('input#field_financialAssetsReturn'));
    lossOfIntangibleInput = element(by.css('input#field_lossOfIntangible'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDiscountingRateInput = function(discountingRate) {
        this.discountingRateInput.sendKeys(discountingRate);
    };

    getDiscountingRateInput = function() {
        return this.discountingRateInput.getAttribute('value');
    };

    setPhysicalAssetsReturnInput = function(physicalAssetsReturn) {
        this.physicalAssetsReturnInput.sendKeys(physicalAssetsReturn);
    };

    getPhysicalAssetsReturnInput = function() {
        return this.physicalAssetsReturnInput.getAttribute('value');
    };

    setFinancialAssetsReturnInput = function(financialAssetsReturn) {
        this.financialAssetsReturnInput.sendKeys(financialAssetsReturn);
    };

    getFinancialAssetsReturnInput = function() {
        return this.financialAssetsReturnInput.getAttribute('value');
    };

    setLossOfIntangibleInput = function(lossOfIntangible) {
        this.lossOfIntangibleInput.sendKeys(lossOfIntangible);
    };

    getLossOfIntangibleInput = function() {
        return this.lossOfIntangibleInput.getAttribute('value');
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
