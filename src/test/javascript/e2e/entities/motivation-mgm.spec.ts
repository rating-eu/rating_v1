import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Motivation e2e test', () => {

    let navBarPage: NavBarPage;
    let motivationDialogPage: MotivationDialogPage;
    let motivationComponentsPage: MotivationComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Motivations', () => {
        navBarPage.goToEntity('motivation-mgm');
        motivationComponentsPage = new MotivationComponentsPage();
        expect(motivationComponentsPage.getTitle())
            .toMatch(/hermeneutApp.motivation.home.title/);

    });

    it('should load create Motivation dialog', () => {
        motivationComponentsPage.clickOnCreateButton();
        motivationDialogPage = new MotivationDialogPage();
        expect(motivationDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.motivation.home.createOrEditLabel/);
        motivationDialogPage.close();
    });

    it('should create and save Motivations', () => {
        motivationComponentsPage.clickOnCreateButton();
        motivationDialogPage.setNameInput('name');
        expect(motivationDialogPage.getNameInput()).toMatch('name');
        motivationDialogPage.setDescriptionInput('description');
        expect(motivationDialogPage.getDescriptionInput()).toMatch('description');
        motivationDialogPage.setCreatedInput(12310020012301);
        expect(motivationDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        motivationDialogPage.setModifiedInput(12310020012301);
        expect(motivationDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        motivationDialogPage.save();
        expect(motivationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MotivationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-motivation-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MotivationDialogPage {
    modalTitle = element(by.css('h4#myMotivationLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));

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
