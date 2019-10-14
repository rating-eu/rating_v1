import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DataRecipient e2e test', () => {

    let navBarPage: NavBarPage;
    let dataRecipientDialogPage: DataRecipientDialogPage;
    let dataRecipientComponentsPage: DataRecipientComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DataRecipients', () => {
        navBarPage.goToEntity('data-recipient-mgm');
        dataRecipientComponentsPage = new DataRecipientComponentsPage();
        expect(dataRecipientComponentsPage.getTitle())
            .toMatch(/hermeneutApp.dataRecipient.home.title/);

    });

    it('should load create DataRecipient dialog', () => {
        dataRecipientComponentsPage.clickOnCreateButton();
        dataRecipientDialogPage = new DataRecipientDialogPage();
        expect(dataRecipientDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.dataRecipient.home.createOrEditLabel/);
        dataRecipientDialogPage.close();
    });

    it('should create and save DataRecipients', () => {
        dataRecipientComponentsPage.clickOnCreateButton();
        dataRecipientDialogPage.setNameInput('name');
        expect(dataRecipientDialogPage.getNameInput()).toMatch('name');
        dataRecipientDialogPage.typeSelectLastOption();
        dataRecipientDialogPage.operationSelectLastOption();
        dataRecipientDialogPage.save();
        expect(dataRecipientDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DataRecipientComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-data-recipient-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DataRecipientDialogPage {
    modalTitle = element(by.css('h4#myDataRecipientLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    typeSelect = element(by.css('select#field_type'));
    operationSelect = element(by.css('select#field_operation'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
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
