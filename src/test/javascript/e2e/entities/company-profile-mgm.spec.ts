import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('CompanyProfile e2e test', () => {

    let navBarPage: NavBarPage;
    let companyProfileDialogPage: CompanyProfileDialogPage;
    let companyProfileComponentsPage: CompanyProfileComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CompanyProfiles', () => {
        navBarPage.goToEntity('company-profile-mgm');
        companyProfileComponentsPage = new CompanyProfileComponentsPage();
        expect(companyProfileComponentsPage.getTitle())
            .toMatch(/hermeneutApp.companyProfile.home.title/);

    });

    it('should load create CompanyProfile dialog', () => {
        companyProfileComponentsPage.clickOnCreateButton();
        companyProfileDialogPage = new CompanyProfileDialogPage();
        expect(companyProfileDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.companyProfile.home.createOrEditLabel/);
        companyProfileDialogPage.close();
    });

    it('should create and save CompanyProfiles', () => {
        companyProfileComponentsPage.clickOnCreateButton();
        companyProfileDialogPage.setNameInput('name');
        expect(companyProfileDialogPage.getNameInput()).toMatch('name');
        companyProfileDialogPage.setDescriptionInput('description');
        expect(companyProfileDialogPage.getDescriptionInput()).toMatch('description');
        companyProfileDialogPage.setCreatedInput(12310020012301);
        expect(companyProfileDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        companyProfileDialogPage.setModifiedInput(12310020012301);
        expect(companyProfileDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        companyProfileDialogPage.typeSelectLastOption();
        companyProfileDialogPage.userSelectLastOption();
        // companyProfileDialogPage.containersSelectLastOption();
        companyProfileDialogPage.save();
        expect(companyProfileDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CompanyProfileComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-company-profile-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CompanyProfileDialogPage {
    modalTitle = element(by.css('h4#myCompanyProfileLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    typeSelect = element(by.css('select#field_type'));
    userSelect = element(by.css('select#field_user'));
    containersSelect = element(by.css('select#field_containers'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
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

    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
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

    containersSelectLastOption = function() {
        this.containersSelect.all(by.tagName('option')).last().click();
    };

    containersSelectOption = function(option) {
        this.containersSelect.sendKeys(option);
    };

    getContainersSelect = function() {
        return this.containersSelect;
    };

    getContainersSelectedOption = function() {
        return this.containersSelect.element(by.css('option:checked')).getText();
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
