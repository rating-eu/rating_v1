import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DataThreat e2e test', () => {

    let navBarPage: NavBarPage;
    let dataThreatDialogPage: DataThreatDialogPage;
    let dataThreatComponentsPage: DataThreatComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DataThreats', () => {
        navBarPage.goToEntity('data-threat-mgm');
        dataThreatComponentsPage = new DataThreatComponentsPage();
        expect(dataThreatComponentsPage.getTitle())
            .toMatch(/hermeneutApp.dataThreat.home.title/);

    });

    it('should load create DataThreat dialog', () => {
        dataThreatComponentsPage.clickOnCreateButton();
        dataThreatDialogPage = new DataThreatDialogPage();
        expect(dataThreatDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.dataThreat.home.createOrEditLabel/);
        dataThreatDialogPage.close();
    });

    it('should create and save DataThreats', () => {
        dataThreatComponentsPage.clickOnCreateButton();
        dataThreatDialogPage.threatAreaSelectLastOption();
        dataThreatDialogPage.likelihoodSelectLastOption();
        dataThreatDialogPage.operationSelectLastOption();
        dataThreatDialogPage.overallDataThreatSelectLastOption();
        dataThreatDialogPage.save();
        expect(dataThreatDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DataThreatComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-data-threat-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DataThreatDialogPage {
    modalTitle = element(by.css('h4#myDataThreatLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    threatAreaSelect = element(by.css('select#field_threatArea'));
    likelihoodSelect = element(by.css('select#field_likelihood'));
    operationSelect = element(by.css('select#field_operation'));
    overallDataThreatSelect = element(by.css('select#field_overallDataThreat'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setThreatAreaSelect = function(threatArea) {
        this.threatAreaSelect.sendKeys(threatArea);
    };

    getThreatAreaSelect = function() {
        return this.threatAreaSelect.element(by.css('option:checked')).getText();
    };

    threatAreaSelectLastOption = function() {
        this.threatAreaSelect.all(by.tagName('option')).last().click();
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
    operationSelectLastOption = function() {
        this.operationSelect.all(by.tagName('option')).last().click();
    };

    operationSelectOption = function(option) {
        this.operationSelect.sendKeys(option);
    };

    getOperationSelect = function() {
        return this.operationSelect;
    };

    getOperationSelectedOption = function() {
        return this.operationSelect.element(by.css('option:checked')).getText();
    };

    overallDataThreatSelectLastOption = function() {
        this.overallDataThreatSelect.all(by.tagName('option')).last().click();
    };

    overallDataThreatSelectOption = function(option) {
        this.overallDataThreatSelect.sendKeys(option);
    };

    getOverallDataThreatSelect = function() {
        return this.overallDataThreatSelect;
    };

    getOverallDataThreatSelectedOption = function() {
        return this.overallDataThreatSelect.element(by.css('option:checked')).getText();
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
