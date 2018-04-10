import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Mitigation e2e test', () => {

    let navBarPage: NavBarPage;
    let mitigationDialogPage: MitigationDialogPage;
    let mitigationComponentsPage: MitigationComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Mitigations', () => {
        navBarPage.goToEntity('mitigation-mgm');
        mitigationComponentsPage = new MitigationComponentsPage();
        expect(mitigationComponentsPage.getTitle())
            .toMatch(/hermeneutApp.mitigation.home.title/);

    });

    it('should load create Mitigation dialog', () => {
        mitigationComponentsPage.clickOnCreateButton();
        mitigationDialogPage = new MitigationDialogPage();
        expect(mitigationDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.mitigation.home.createOrEditLabel/);
        mitigationDialogPage.close();
    });

    it('should create and save Mitigations', () => {
        mitigationComponentsPage.clickOnCreateButton();
        mitigationDialogPage.setNameInput('name');
        expect(mitigationDialogPage.getNameInput()).toMatch('name');
        mitigationDialogPage.setDescriptionInput('description');
        expect(mitigationDialogPage.getDescriptionInput()).toMatch('description');
        mitigationDialogPage.setCreatedInput(12310020012301);
        expect(mitigationDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        mitigationDialogPage.setModifiedInput(12310020012301);
        expect(mitigationDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        mitigationDialogPage.save();
        expect(mitigationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MitigationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-mitigation-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MitigationDialogPage {
    modalTitle = element(by.css('h4#myMitigationLabel'));
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
