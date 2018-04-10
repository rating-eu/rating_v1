import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DomainOfInfluence e2e test', () => {

    let navBarPage: NavBarPage;
    let domainOfInfluenceDialogPage: DomainOfInfluenceDialogPage;
    let domainOfInfluenceComponentsPage: DomainOfInfluenceComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DomainOfInfluences', () => {
        navBarPage.goToEntity('domain-of-influence-mgm');
        domainOfInfluenceComponentsPage = new DomainOfInfluenceComponentsPage();
        expect(domainOfInfluenceComponentsPage.getTitle())
            .toMatch(/hermeneutApp.domainOfInfluence.home.title/);

    });

    it('should load create DomainOfInfluence dialog', () => {
        domainOfInfluenceComponentsPage.clickOnCreateButton();
        domainOfInfluenceDialogPage = new DomainOfInfluenceDialogPage();
        expect(domainOfInfluenceDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.domainOfInfluence.home.createOrEditLabel/);
        domainOfInfluenceDialogPage.close();
    });

    it('should create and save DomainOfInfluences', () => {
        domainOfInfluenceComponentsPage.clickOnCreateButton();
        domainOfInfluenceDialogPage.setNameInput('name');
        expect(domainOfInfluenceDialogPage.getNameInput()).toMatch('name');
        domainOfInfluenceDialogPage.setDescriptionInput('description');
        expect(domainOfInfluenceDialogPage.getDescriptionInput()).toMatch('description');
        domainOfInfluenceDialogPage.save();
        expect(domainOfInfluenceDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DomainOfInfluenceComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-domain-of-influence-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DomainOfInfluenceDialogPage {
    modalTitle = element(by.css('h4#myDomainOfInfluenceLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));

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
