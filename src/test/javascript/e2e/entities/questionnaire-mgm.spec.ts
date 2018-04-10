import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Questionnaire e2e test', () => {

    let navBarPage: NavBarPage;
    let questionnaireDialogPage: QuestionnaireDialogPage;
    let questionnaireComponentsPage: QuestionnaireComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Questionnaires', () => {
        navBarPage.goToEntity('questionnaire-mgm');
        questionnaireComponentsPage = new QuestionnaireComponentsPage();
        expect(questionnaireComponentsPage.getTitle())
            .toMatch(/hermeneutApp.questionnaire.home.title/);

    });

    it('should load create Questionnaire dialog', () => {
        questionnaireComponentsPage.clickOnCreateButton();
        questionnaireDialogPage = new QuestionnaireDialogPage();
        expect(questionnaireDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.questionnaire.home.createOrEditLabel/);
        questionnaireDialogPage.close();
    });

    it('should create and save Questionnaires', () => {
        questionnaireComponentsPage.clickOnCreateButton();
        questionnaireDialogPage.setNameInput('name');
        expect(questionnaireDialogPage.getNameInput()).toMatch('name');
        questionnaireDialogPage.scopeSelectLastOption();
        questionnaireDialogPage.setCreatedInput(12310020012301);
        expect(questionnaireDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        questionnaireDialogPage.setModifiedInput(12310020012301);
        expect(questionnaireDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        questionnaireDialogPage.save();
        expect(questionnaireDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class QuestionnaireComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-questionnaire-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class QuestionnaireDialogPage {
    modalTitle = element(by.css('h4#myQuestionnaireLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    scopeSelect = element(by.css('select#field_scope'));
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

    setScopeSelect = function(scope) {
        this.scopeSelect.sendKeys(scope);
    };

    getScopeSelect = function() {
        return this.scopeSelect.element(by.css('option:checked')).getText();
    };

    scopeSelectLastOption = function() {
        this.scopeSelect.all(by.tagName('option')).last().click();
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
