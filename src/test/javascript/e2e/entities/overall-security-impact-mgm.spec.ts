import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('OverallSecurityImpact e2e test', () => {

    let navBarPage: NavBarPage;
    let overallSecurityImpactDialogPage: OverallSecurityImpactDialogPage;
    let overallSecurityImpactComponentsPage: OverallSecurityImpactComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load OverallSecurityImpacts', () => {
        navBarPage.goToEntity('overall-security-impact-mgm');
        overallSecurityImpactComponentsPage = new OverallSecurityImpactComponentsPage();
        expect(overallSecurityImpactComponentsPage.getTitle())
            .toMatch(/hermeneutApp.overallSecurityImpact.home.title/);

    });

    it('should load create OverallSecurityImpact dialog', () => {
        overallSecurityImpactComponentsPage.clickOnCreateButton();
        overallSecurityImpactDialogPage = new OverallSecurityImpactDialogPage();
        expect(overallSecurityImpactDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.overallSecurityImpact.home.createOrEditLabel/);
        overallSecurityImpactDialogPage.close();
    });

    it('should create and save OverallSecurityImpacts', () => {
        overallSecurityImpactComponentsPage.clickOnCreateButton();
        overallSecurityImpactDialogPage.impactSelectLastOption();
        overallSecurityImpactDialogPage.operationSelectLastOption();
        overallSecurityImpactDialogPage.save();
        expect(overallSecurityImpactDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OverallSecurityImpactComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-overall-security-impact-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OverallSecurityImpactDialogPage {
    modalTitle = element(by.css('h4#myOverallSecurityImpactLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    impactSelect = element(by.css('select#field_impact'));
    operationSelect = element(by.css('select#field_operation'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setImpactSelect = function(impact) {
        this.impactSelect.sendKeys(impact);
    };

    getImpactSelect = function() {
        return this.impactSelect.element(by.css('option:checked')).getText();
    };

    impactSelectLastOption = function() {
        this.impactSelect.all(by.tagName('option')).last().click();
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
