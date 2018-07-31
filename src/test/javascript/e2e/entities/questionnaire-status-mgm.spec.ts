import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('QuestionnaireStatus e2e test', () => {

    let navBarPage: NavBarPage;
    let questionnaireStatusDialogPage: QuestionnaireStatusDialogPage;
    let questionnaireStatusComponentsPage: QuestionnaireStatusComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load QuestionnaireStatuses', () => {
        navBarPage.goToEntity('questionnaire-status-mgm');
        questionnaireStatusComponentsPage = new QuestionnaireStatusComponentsPage();
        expect(questionnaireStatusComponentsPage.getTitle())
            .toMatch(/hermeneutApp.questionnaireStatus.home.title/);

    });

    it('should load create QuestionnaireStatus dialog', () => {
        questionnaireStatusComponentsPage.clickOnCreateButton();
        questionnaireStatusDialogPage = new QuestionnaireStatusDialogPage();
        expect(questionnaireStatusDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.questionnaireStatus.home.createOrEditLabel/);
        questionnaireStatusDialogPage.close();
    });

    it('should create and save QuestionnaireStatuses', () => {
        questionnaireStatusComponentsPage.clickOnCreateButton();
        questionnaireStatusDialogPage.statusSelectLastOption();
        questionnaireStatusDialogPage.setCreatedInput(12310020012301);
        expect(questionnaireStatusDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        questionnaireStatusDialogPage.setModifiedInput(12310020012301);
        expect(questionnaireStatusDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        questionnaireStatusDialogPage.roleSelectLastOption();
        questionnaireStatusDialogPage.selfAssessmentSelectLastOption();
        questionnaireStatusDialogPage.questionnaireSelectLastOption();
        questionnaireStatusDialogPage.userSelectLastOption();
        questionnaireStatusDialogPage.save();
        expect(questionnaireStatusDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class QuestionnaireStatusComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-questionnaire-status-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class QuestionnaireStatusDialogPage {
    modalTitle = element(by.css('h4#myQuestionnaireStatusLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    statusSelect = element(by.css('select#field_status'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    roleSelect = element(by.css('select#field_role'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));
    questionnaireSelect = element(by.css('select#field_questionnaire'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    };

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    };

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
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

    setRoleSelect = function(role) {
        this.roleSelect.sendKeys(role);
    };

    getRoleSelect = function() {
        return this.roleSelect.element(by.css('option:checked')).getText();
    };

    roleSelectLastOption = function() {
        this.roleSelect.all(by.tagName('option')).last().click();
    };
    selfAssessmentSelectLastOption = function() {
        this.selfAssessmentSelect.all(by.tagName('option')).last().click();
    };

    selfAssessmentSelectOption = function(option) {
        this.selfAssessmentSelect.sendKeys(option);
    };

    getSelfAssessmentSelect = function() {
        return this.selfAssessmentSelect;
    };

    getSelfAssessmentSelectedOption = function() {
        return this.selfAssessmentSelect.element(by.css('option:checked')).getText();
    };

    questionnaireSelectLastOption = function() {
        this.questionnaireSelect.all(by.tagName('option')).last().click();
    };

    questionnaireSelectOption = function(option) {
        this.questionnaireSelect.sendKeys(option);
    };

    getQuestionnaireSelect = function() {
        return this.questionnaireSelect;
    };

    getQuestionnaireSelectedOption = function() {
        return this.questionnaireSelect.element(by.css('option:checked')).getText();
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
