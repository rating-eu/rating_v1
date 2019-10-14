import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DataRiskLevelConfig e2e test', () => {

    let navBarPage: NavBarPage;
    let dataRiskLevelConfigDialogPage: DataRiskLevelConfigDialogPage;
    let dataRiskLevelConfigComponentsPage: DataRiskLevelConfigComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DataRiskLevelConfigs', () => {
        navBarPage.goToEntity('data-risk-level-config-mgm');
        dataRiskLevelConfigComponentsPage = new DataRiskLevelConfigComponentsPage();
        expect(dataRiskLevelConfigComponentsPage.getTitle())
            .toMatch(/hermeneutApp.dataRiskLevelConfig.home.title/);

    });

    it('should load create DataRiskLevelConfig dialog', () => {
        dataRiskLevelConfigComponentsPage.clickOnCreateButton();
        dataRiskLevelConfigDialogPage = new DataRiskLevelConfigDialogPage();
        expect(dataRiskLevelConfigDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.dataRiskLevelConfig.home.createOrEditLabel/);
        dataRiskLevelConfigDialogPage.close();
    });

    it('should create and save DataRiskLevelConfigs', () => {
        dataRiskLevelConfigComponentsPage.clickOnCreateButton();
        dataRiskLevelConfigDialogPage.setRationaleInput('rationale');
        expect(dataRiskLevelConfigDialogPage.getRationaleInput()).toMatch('rationale');
        dataRiskLevelConfigDialogPage.likelihoodSelectLastOption();
        dataRiskLevelConfigDialogPage.impactSelectLastOption();
        dataRiskLevelConfigDialogPage.riskSelectLastOption();
        dataRiskLevelConfigDialogPage.operationSelectLastOption();
        dataRiskLevelConfigDialogPage.save();
        expect(dataRiskLevelConfigDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DataRiskLevelConfigComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-data-risk-level-config-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DataRiskLevelConfigDialogPage {
    modalTitle = element(by.css('h4#myDataRiskLevelConfigLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    rationaleInput = element(by.css('input#field_rationale'));
    likelihoodSelect = element(by.css('select#field_likelihood'));
    impactSelect = element(by.css('select#field_impact'));
    riskSelect = element(by.css('select#field_risk'));
    operationSelect = element(by.css('select#field_operation'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setRationaleInput = function(rationale) {
        this.rationaleInput.sendKeys(rationale);
    };

    getRationaleInput = function() {
        return this.rationaleInput.getAttribute('value');
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
    setImpactSelect = function(impact) {
        this.impactSelect.sendKeys(impact);
    };

    getImpactSelect = function() {
        return this.impactSelect.element(by.css('option:checked')).getText();
    };

    impactSelectLastOption = function() {
        this.impactSelect.all(by.tagName('option')).last().click();
    };
    setRiskSelect = function(risk) {
        this.riskSelect.sendKeys(risk);
    };

    getRiskSelect = function() {
        return this.riskSelect.element(by.css('option:checked')).getText();
    };

    riskSelectLastOption = function() {
        this.riskSelect.all(by.tagName('option')).last().click();
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
