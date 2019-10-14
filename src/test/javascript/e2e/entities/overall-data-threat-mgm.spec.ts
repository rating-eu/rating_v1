import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('OverallDataThreat e2e test', () => {

    let navBarPage: NavBarPage;
    let overallDataThreatDialogPage: OverallDataThreatDialogPage;
    let overallDataThreatComponentsPage: OverallDataThreatComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load OverallDataThreats', () => {
        navBarPage.goToEntity('overall-data-threat-mgm');
        overallDataThreatComponentsPage = new OverallDataThreatComponentsPage();
        expect(overallDataThreatComponentsPage.getTitle())
            .toMatch(/hermeneutApp.overallDataThreat.home.title/);

    });

    it('should load create OverallDataThreat dialog', () => {
        overallDataThreatComponentsPage.clickOnCreateButton();
        overallDataThreatDialogPage = new OverallDataThreatDialogPage();
        expect(overallDataThreatDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.overallDataThreat.home.createOrEditLabel/);
        overallDataThreatDialogPage.close();
    });

    it('should create and save OverallDataThreats', () => {
        overallDataThreatComponentsPage.clickOnCreateButton();
        overallDataThreatDialogPage.likelihoodSelectLastOption();
        overallDataThreatDialogPage.operationSelectLastOption();
        overallDataThreatDialogPage.save();
        expect(overallDataThreatDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OverallDataThreatComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-overall-data-threat-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OverallDataThreatDialogPage {
    modalTitle = element(by.css('h4#myOverallDataThreatLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    likelihoodSelect = element(by.css('select#field_likelihood'));
    operationSelect = element(by.css('select#field_operation'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

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
