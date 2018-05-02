import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Department e2e test', () => {

    let navBarPage: NavBarPage;
    let departmentDialogPage: DepartmentDialogPage;
    let departmentComponentsPage: DepartmentComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Departments', () => {
        navBarPage.goToEntity('department-mgm');
        departmentComponentsPage = new DepartmentComponentsPage();
        expect(departmentComponentsPage.getTitle())
            .toMatch(/hermeneutApp.department.home.title/);

    });

    it('should load create Department dialog', () => {
        departmentComponentsPage.clickOnCreateButton();
        departmentDialogPage = new DepartmentDialogPage();
        expect(departmentDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.department.home.createOrEditLabel/);
        departmentDialogPage.close();
    });

    it('should create and save Departments', () => {
        departmentComponentsPage.clickOnCreateButton();
        departmentDialogPage.setNameInput('name');
        expect(departmentDialogPage.getNameInput()).toMatch('name');
        departmentDialogPage.setDescriptionInput('description');
        expect(departmentDialogPage.getDescriptionInput()).toMatch('description');
        departmentDialogPage.setCreatedInput(12310020012301);
        expect(departmentDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        departmentDialogPage.setModifiedInput(12310020012301);
        expect(departmentDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        departmentDialogPage.userSelectLastOption();
        departmentDialogPage.companyprofileSelectLastOption();
        departmentDialogPage.save();
        expect(departmentDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DepartmentComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-department-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DepartmentDialogPage {
    modalTitle = element(by.css('h4#myDepartmentLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    userSelect = element(by.css('select#field_user'));
    companyprofileSelect = element(by.css('select#field_companyprofile'));

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
