import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('MyCompany e2e test', () => {

    let navBarPage: NavBarPage;
    let myCompanyDialogPage: MyCompanyDialogPage;
    let myCompanyComponentsPage: MyCompanyComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load MyCompanies', () => {
        navBarPage.goToEntity('my-company-mgm');
        myCompanyComponentsPage = new MyCompanyComponentsPage();
        expect(myCompanyComponentsPage.getTitle())
            .toMatch(/hermeneutApp.myCompany.home.title/);

    });

    it('should load create MyCompany dialog', () => {
        myCompanyComponentsPage.clickOnCreateButton();
        myCompanyDialogPage = new MyCompanyDialogPage();
        expect(myCompanyDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.myCompany.home.createOrEditLabel/);
        myCompanyDialogPage.close();
    });

    it('should create and save MyCompanies', () => {
        myCompanyComponentsPage.clickOnCreateButton();
        myCompanyDialogPage.userSelectLastOption();
        myCompanyDialogPage.companyProfileSelectLastOption();
        myCompanyDialogPage.save();
        expect(myCompanyDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MyCompanyComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-my-company-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MyCompanyDialogPage {
    modalTitle = element(by.css('h4#myMyCompanyLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    userSelect = element(by.css('select#field_user'));
    companyProfileSelect = element(by.css('select#field_companyProfile'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

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

    companyProfileSelectLastOption = function() {
        this.companyProfileSelect.all(by.tagName('option')).last().click();
    };

    companyProfileSelectOption = function(option) {
        this.companyProfileSelect.sendKeys(option);
    };

    getCompanyProfileSelect = function() {
        return this.companyProfileSelect;
    };

    getCompanyProfileSelectedOption = function() {
        return this.companyProfileSelect.element(by.css('option:checked')).getText();
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
