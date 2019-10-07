import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('GDPRQuestionnaireStatus e2e test', () => {

    let navBarPage: NavBarPage;
    let gDPRQuestionnaireStatusDialogPage: GDPRQuestionnaireStatusDialogPage;
    let gDPRQuestionnaireStatusComponentsPage: GDPRQuestionnaireStatusComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load GDPRQuestionnaireStatuses', () => {
        navBarPage.goToEntity('gdpr-questionnaire-status-mgm');
        gDPRQuestionnaireStatusComponentsPage = new GDPRQuestionnaireStatusComponentsPage();
        expect(gDPRQuestionnaireStatusComponentsPage.getTitle())
            .toMatch(/hermeneutApp.gDPRQuestionnaireStatus.home.title/);

    });

    it('should load create GDPRQuestionnaireStatus dialog', () => {
        gDPRQuestionnaireStatusComponentsPage.clickOnCreateButton();
        gDPRQuestionnaireStatusDialogPage = new GDPRQuestionnaireStatusDialogPage();
        expect(gDPRQuestionnaireStatusDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.gDPRQuestionnaireStatus.home.createOrEditLabel/);
        gDPRQuestionnaireStatusDialogPage.close();
    });

    it('should create and save GDPRQuestionnaireStatuses', () => {
        gDPRQuestionnaireStatusComponentsPage.clickOnCreateButton();
        gDPRQuestionnaireStatusDialogPage.statusSelectLastOption();
        gDPRQuestionnaireStatusDialogPage.roleSelectLastOption();
        gDPRQuestionnaireStatusDialogPage.operationSelectLastOption();
        gDPRQuestionnaireStatusDialogPage.questionnaireSelectLastOption();
        gDPRQuestionnaireStatusDialogPage.userSelectLastOption();
        gDPRQuestionnaireStatusDialogPage.save();
        expect(gDPRQuestionnaireStatusDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class GDPRQuestionnaireStatusComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-gdpr-questionnaire-status-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class GDPRQuestionnaireStatusDialogPage {
    modalTitle = element(by.css('h4#myGDPRQuestionnaireStatusLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    statusSelect = element(by.css('select#field_status'));
    roleSelect = element(by.css('select#field_role'));
    operationSelect = element(by.css('select#field_operation'));
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
    setRoleSelect = function(role) {
        this.roleSelect.sendKeys(role);
    };

    getRoleSelect = function() {
        return this.roleSelect.element(by.css('option:checked')).getText();
    };

    roleSelectLastOption = function() {
        this.roleSelect.all(by.tagName('option')).last().click();
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
