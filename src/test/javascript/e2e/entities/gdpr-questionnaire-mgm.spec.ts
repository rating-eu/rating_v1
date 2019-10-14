import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('GDPRQuestionnaire e2e test', () => {

    let navBarPage: NavBarPage;
    let gDPRQuestionnaireDialogPage: GDPRQuestionnaireDialogPage;
    let gDPRQuestionnaireComponentsPage: GDPRQuestionnaireComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load GDPRQuestionnaires', () => {
        navBarPage.goToEntity('gdpr-questionnaire-mgm');
        gDPRQuestionnaireComponentsPage = new GDPRQuestionnaireComponentsPage();
        expect(gDPRQuestionnaireComponentsPage.getTitle())
            .toMatch(/hermeneutApp.gDPRQuestionnaire.home.title/);

    });

    it('should load create GDPRQuestionnaire dialog', () => {
        gDPRQuestionnaireComponentsPage.clickOnCreateButton();
        gDPRQuestionnaireDialogPage = new GDPRQuestionnaireDialogPage();
        expect(gDPRQuestionnaireDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.gDPRQuestionnaire.home.createOrEditLabel/);
        gDPRQuestionnaireDialogPage.close();
    });

    it('should create and save GDPRQuestionnaires', () => {
        gDPRQuestionnaireComponentsPage.clickOnCreateButton();
        gDPRQuestionnaireDialogPage.setNameInput('name');
        expect(gDPRQuestionnaireDialogPage.getNameInput()).toMatch('name');
        gDPRQuestionnaireDialogPage.purposeSelectLastOption();
        gDPRQuestionnaireDialogPage.save();
        expect(gDPRQuestionnaireDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class GDPRQuestionnaireComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-gdpr-questionnaire-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class GDPRQuestionnaireDialogPage {
    modalTitle = element(by.css('h4#myGDPRQuestionnaireLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    purposeSelect = element(by.css('select#field_purpose'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setPurposeSelect = function(purpose) {
        this.purposeSelect.sendKeys(purpose);
    };

    getPurposeSelect = function() {
        return this.purposeSelect.element(by.css('option:checked')).getText();
    };

    purposeSelectLastOption = function() {
        this.purposeSelect.all(by.tagName('option')).last().click();
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
