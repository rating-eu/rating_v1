import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ExternalAudit e2e test', () => {

    let navBarPage: NavBarPage;
    let externalAuditDialogPage: ExternalAuditDialogPage;
    let externalAuditComponentsPage: ExternalAuditComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ExternalAudits', () => {
        navBarPage.goToEntity('external-audit-mgm');
        externalAuditComponentsPage = new ExternalAuditComponentsPage();
        expect(externalAuditComponentsPage.getTitle())
            .toMatch(/hermeneutApp.externalAudit.home.title/);

    });

    it('should load create ExternalAudit dialog', () => {
        externalAuditComponentsPage.clickOnCreateButton();
        externalAuditDialogPage = new ExternalAuditDialogPage();
        expect(externalAuditDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.externalAudit.home.createOrEditLabel/);
        externalAuditDialogPage.close();
    });

    it('should create and save ExternalAudits', () => {
        externalAuditComponentsPage.clickOnCreateButton();
        externalAuditDialogPage.setNameInput('name');
        expect(externalAuditDialogPage.getNameInput()).toMatch('name');
        externalAuditDialogPage.userSelectLastOption();
        externalAuditDialogPage.save();
        expect(externalAuditDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ExternalAuditComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-external-audit-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ExternalAuditDialogPage {
    modalTitle = element(by.css('h4#myExternalAuditLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    };

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    };

    getUserSelect = function() {
        return this.userSelect;
    };

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
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
