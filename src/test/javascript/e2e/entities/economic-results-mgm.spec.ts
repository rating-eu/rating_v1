import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('EconomicResults e2e test', () => {

    let navBarPage: NavBarPage;
    let economicResultsDialogPage: EconomicResultsDialogPage;
    let economicResultsComponentsPage: EconomicResultsComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load EconomicResults', () => {
        navBarPage.goToEntity('economic-results-mgm');
        economicResultsComponentsPage = new EconomicResultsComponentsPage();
        expect(economicResultsComponentsPage.getTitle())
            .toMatch(/hermeneutApp.economicResults.home.title/);

    });

    it('should load create EconomicResults dialog', () => {
        economicResultsComponentsPage.clickOnCreateButton();
        economicResultsDialogPage = new EconomicResultsDialogPage();
        expect(economicResultsDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.economicResults.home.createOrEditLabel/);
        economicResultsDialogPage.close();
    });

    it('should create and save EconomicResults', () => {
        economicResultsComponentsPage.clickOnCreateButton();
        economicResultsDialogPage.setEconomicPerformanceInput('5');
        expect(economicResultsDialogPage.getEconomicPerformanceInput()).toMatch('5');
        economicResultsDialogPage.setIntangibleDrivingEarningsInput('5');
        expect(economicResultsDialogPage.getIntangibleDrivingEarningsInput()).toMatch('5');
        economicResultsDialogPage.setIntangibleCapitalInput('5');
        expect(economicResultsDialogPage.getIntangibleCapitalInput()).toMatch('5');
        economicResultsDialogPage.setIntangibleLossByAttacksInput('5');
        expect(economicResultsDialogPage.getIntangibleLossByAttacksInput()).toMatch('5');
        economicResultsDialogPage.selfAssessmentSelectLastOption();
        economicResultsDialogPage.save();
        expect(economicResultsDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class EconomicResultsComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-economic-results-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class EconomicResultsDialogPage {
    modalTitle = element(by.css('h4#myEconomicResultsLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    economicPerformanceInput = element(by.css('input#field_economicPerformance'));
    intangibleDrivingEarningsInput = element(by.css('input#field_intangibleDrivingEarnings'));
    intangibleCapitalInput = element(by.css('input#field_intangibleCapital'));
    intangibleLossByAttacksInput = element(by.css('input#field_intangibleLossByAttacks'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setEconomicPerformanceInput = function(economicPerformance) {
        this.economicPerformanceInput.sendKeys(economicPerformance);
    };

    getEconomicPerformanceInput = function() {
        return this.economicPerformanceInput.getAttribute('value');
    };

    setIntangibleDrivingEarningsInput = function(intangibleDrivingEarnings) {
        this.intangibleDrivingEarningsInput.sendKeys(intangibleDrivingEarnings);
    };

    getIntangibleDrivingEarningsInput = function() {
        return this.intangibleDrivingEarningsInput.getAttribute('value');
    };

    setIntangibleCapitalInput = function(intangibleCapital) {
        this.intangibleCapitalInput.sendKeys(intangibleCapital);
    };

    getIntangibleCapitalInput = function() {
        return this.intangibleCapitalInput.getAttribute('value');
    };

    setIntangibleLossByAttacksInput = function(intangibleLossByAttacks) {
        this.intangibleLossByAttacksInput.sendKeys(intangibleLossByAttacks);
    };

    getIntangibleLossByAttacksInput = function() {
        return this.intangibleLossByAttacksInput.getAttribute('value');
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
