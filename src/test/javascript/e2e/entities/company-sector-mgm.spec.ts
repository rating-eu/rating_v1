import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('CompanySector e2e test', () => {

    let navBarPage: NavBarPage;
    let companySectorDialogPage: CompanySectorDialogPage;
    let companySectorComponentsPage: CompanySectorComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CompanySectors', () => {
        navBarPage.goToEntity('company-sector-mgm');
        companySectorComponentsPage = new CompanySectorComponentsPage();
        expect(companySectorComponentsPage.getTitle())
            .toMatch(/hermeneutApp.companySector.home.title/);

    });

    it('should load create CompanySector dialog', () => {
        companySectorComponentsPage.clickOnCreateButton();
        companySectorDialogPage = new CompanySectorDialogPage();
        expect(companySectorDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.companySector.home.createOrEditLabel/);
        companySectorDialogPage.close();
    });

    it('should create and save CompanySectors', () => {
        companySectorComponentsPage.clickOnCreateButton();
        companySectorDialogPage.setDepartmentInput('department');
        expect(companySectorDialogPage.getDepartmentInput()).toMatch('department');
        companySectorDialogPage.setDescriptionInput('description');
        expect(companySectorDialogPage.getDescriptionInput()).toMatch('description');
        companySectorDialogPage.setCreatedInput(12310020012301);
        expect(companySectorDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        companySectorDialogPage.setModifiedInput(12310020012301);
        expect(companySectorDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        companySectorDialogPage.userSelectLastOption();
        companySectorDialogPage.companyprofileSelectLastOption();
        companySectorDialogPage.save();
        expect(companySectorDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CompanySectorComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-company-sector-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CompanySectorDialogPage {
    modalTitle = element(by.css('h4#myCompanySectorLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    departmentInput = element(by.css('input#field_department'));
    descriptionInput = element(by.css('input#field_description'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    userSelect = element(by.css('select#field_user'));
    companyprofileSelect = element(by.css('select#field_companyprofile'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDepartmentInput = function(department) {
        this.departmentInput.sendKeys(department);
    };

    getDepartmentInput = function() {
        return this.departmentInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    };

    setCreatedInput = function(created) {
        this.createdInput.sendKeys(created);
    };

    getCreatedInput = function() {
        return this.createdInput.getAttribute('value');
    };

    setModifiedInput = function(modified) {
        this.modifiedInput.sendKeys(modified);
    };

    getModifiedInput = function() {
        return this.modifiedInput.getAttribute('value');
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

    companyprofileSelectLastOption = function() {
        this.companyprofileSelect.all(by.tagName('option')).last().click();
    };

    companyprofileSelectOption = function(option) {
        this.companyprofileSelect.sendKeys(option);
    };

    getCompanyprofileSelect = function() {
        return this.companyprofileSelect;
    };

    getCompanyprofileSelectedOption = function() {
        return this.companyprofileSelect.element(by.css('option:checked')).getText();
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
