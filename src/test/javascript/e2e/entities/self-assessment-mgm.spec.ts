import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SelfAssessment e2e test', () => {

    let navBarPage: NavBarPage;
    let selfAssessmentDialogPage: SelfAssessmentDialogPage;
    let selfAssessmentComponentsPage: SelfAssessmentComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SelfAssessments', () => {
        navBarPage.goToEntity('self-assessment-mgm');
        selfAssessmentComponentsPage = new SelfAssessmentComponentsPage();
        expect(selfAssessmentComponentsPage.getTitle())
            .toMatch(/hermeneutApp.selfAssessment.home.title/);

    });

    it('should load create SelfAssessment dialog', () => {
        selfAssessmentComponentsPage.clickOnCreateButton();
        selfAssessmentDialogPage = new SelfAssessmentDialogPage();
        expect(selfAssessmentDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.selfAssessment.home.createOrEditLabel/);
        selfAssessmentDialogPage.close();
    });

    it('should create and save SelfAssessments', () => {
        selfAssessmentComponentsPage.clickOnCreateButton();
        selfAssessmentDialogPage.setNameInput('name');
        expect(selfAssessmentDialogPage.getNameInput()).toMatch('name');
        selfAssessmentDialogPage.setCreatedInput(12310020012301);
        expect(selfAssessmentDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        selfAssessmentDialogPage.setModifiedInput(12310020012301);
        expect(selfAssessmentDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        selfAssessmentDialogPage.companyProfileSelectLastOption();
        selfAssessmentDialogPage.userSelectLastOption();
        selfAssessmentDialogPage.externalAuditSelectLastOption();
        // selfAssessmentDialogPage.companyGroupSelectLastOption();
        // selfAssessmentDialogPage.threatagentSelectLastOption();
        // selfAssessmentDialogPage.questionnaireSelectLastOption();
        selfAssessmentDialogPage.save();
        expect(selfAssessmentDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SelfAssessmentComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-self-assessment-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SelfAssessmentDialogPage {
    modalTitle = element(by.css('h4#mySelfAssessmentLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    companyProfileSelect = element(by.css('select#field_companyProfile'));
    userSelect = element(by.css('select#field_user'));
    externalAuditSelect = element(by.css('select#field_externalAudit'));
    companyGroupSelect = element(by.css('select#field_companyGroup'));
    threatagentSelect = element(by.css('select#field_threatagent'));
    questionnaireSelect = element(by.css('select#field_questionnaire'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
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

    externalAuditSelectLastOption = function() {
        this.externalAuditSelect.all(by.tagName('option')).last().click();
    };

    externalAuditSelectOption = function(option) {
        this.externalAuditSelect.sendKeys(option);
    };

    getExternalAuditSelect = function() {
        return this.externalAuditSelect;
    };

    getExternalAuditSelectedOption = function() {
        return this.externalAuditSelect.element(by.css('option:checked')).getText();
    };

    companyGroupSelectLastOption = function() {
        this.companyGroupSelect.all(by.tagName('option')).last().click();
    };

    companyGroupSelectOption = function(option) {
        this.companyGroupSelect.sendKeys(option);
    };

    getCompanyGroupSelect = function() {
        return this.companyGroupSelect;
    };

    getCompanyGroupSelectedOption = function() {
        return this.companyGroupSelect.element(by.css('option:checked')).getText();
    };

    threatagentSelectLastOption = function() {
        this.threatagentSelect.all(by.tagName('option')).last().click();
    };

    threatagentSelectOption = function(option) {
        this.threatagentSelect.sendKeys(option);
    };

    getThreatagentSelect = function() {
        return this.threatagentSelect;
    };

    getThreatagentSelectedOption = function() {
        return this.threatagentSelect.element(by.css('option:checked')).getText();
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
