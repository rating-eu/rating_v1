import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('OverallDataRisk e2e test', () => {

    let navBarPage: NavBarPage;
    let overallDataRiskDialogPage: OverallDataRiskDialogPage;
    let overallDataRiskComponentsPage: OverallDataRiskComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load OverallDataRisks', () => {
        navBarPage.goToEntity('overall-data-risk-mgm');
        overallDataRiskComponentsPage = new OverallDataRiskComponentsPage();
        expect(overallDataRiskComponentsPage.getTitle())
            .toMatch(/hermeneutApp.overallDataRisk.home.title/);

    });

    it('should load create OverallDataRisk dialog', () => {
        overallDataRiskComponentsPage.clickOnCreateButton();
        overallDataRiskDialogPage = new OverallDataRiskDialogPage();
        expect(overallDataRiskDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.overallDataRisk.home.createOrEditLabel/);
        overallDataRiskDialogPage.close();
    });

    it('should create and save OverallDataRisks', () => {
        overallDataRiskComponentsPage.clickOnCreateButton();
        overallDataRiskDialogPage.riskLevelSelectLastOption();
        overallDataRiskDialogPage.operationSelectLastOption();
        overallDataRiskDialogPage.save();
        expect(overallDataRiskDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OverallDataRiskComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-overall-data-risk-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OverallDataRiskDialogPage {
    modalTitle = element(by.css('h4#myOverallDataRiskLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    riskLevelSelect = element(by.css('select#field_riskLevel'));
    operationSelect = element(by.css('select#field_operation'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setRiskLevelSelect = function(riskLevel) {
        this.riskLevelSelect.sendKeys(riskLevel);
    };

    getRiskLevelSelect = function() {
        return this.riskLevelSelect.element(by.css('option:checked')).getText();
    };

    riskLevelSelectLastOption = function() {
        this.riskLevelSelect.all(by.tagName('option')).last().click();
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
