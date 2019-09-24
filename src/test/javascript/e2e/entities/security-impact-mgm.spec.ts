import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SecurityImpact e2e test', () => {

    let navBarPage: NavBarPage;
    let securityImpactDialogPage: SecurityImpactDialogPage;
    let securityImpactComponentsPage: SecurityImpactComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SecurityImpacts', () => {
        navBarPage.goToEntity('security-impact-mgm');
        securityImpactComponentsPage = new SecurityImpactComponentsPage();
        expect(securityImpactComponentsPage.getTitle())
            .toMatch(/hermeneutApp.securityImpact.home.title/);

    });

    it('should load create SecurityImpact dialog', () => {
        securityImpactComponentsPage.clickOnCreateButton();
        securityImpactDialogPage = new SecurityImpactDialogPage();
        expect(securityImpactDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.securityImpact.home.createOrEditLabel/);
        securityImpactDialogPage.close();
    });

    it('should create and save SecurityImpacts', () => {
        securityImpactComponentsPage.clickOnCreateButton();
        securityImpactDialogPage.securityPillarSelectLastOption();
        securityImpactDialogPage.impactSelectLastOption();
        securityImpactDialogPage.operationSelectLastOption();
        securityImpactDialogPage.overallSecurityImpactSelectLastOption();
        securityImpactDialogPage.save();
        expect(securityImpactDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SecurityImpactComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-security-impact-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SecurityImpactDialogPage {
    modalTitle = element(by.css('h4#mySecurityImpactLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    securityPillarSelect = element(by.css('select#field_securityPillar'));
    impactSelect = element(by.css('select#field_impact'));
    operationSelect = element(by.css('select#field_operation'));
    overallSecurityImpactSelect = element(by.css('select#field_overallSecurityImpact'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setSecurityPillarSelect = function(securityPillar) {
        this.securityPillarSelect.sendKeys(securityPillar);
    };

    getSecurityPillarSelect = function() {
        return this.securityPillarSelect.element(by.css('option:checked')).getText();
    };

    securityPillarSelectLastOption = function() {
        this.securityPillarSelect.all(by.tagName('option')).last().click();
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

    overallSecurityImpactSelectLastOption = function() {
        this.overallSecurityImpactSelect.all(by.tagName('option')).last().click();
    };

    overallSecurityImpactSelectOption = function(option) {
        this.overallSecurityImpactSelect.sendKeys(option);
    };

    getOverallSecurityImpactSelect = function() {
        return this.overallSecurityImpactSelect;
    };

    getOverallSecurityImpactSelectedOption = function() {
        return this.overallSecurityImpactSelect.element(by.css('option:checked')).getText();
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
