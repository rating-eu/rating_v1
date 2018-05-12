import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
import * as path from 'path';
describe('ThreatAgent e2e test', () => {

    let navBarPage: NavBarPage;
    let threatAgentDialogPage: ThreatAgentDialogPage;
    let threatAgentComponentsPage: ThreatAgentComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ThreatAgents', () => {
        navBarPage.goToEntity('threat-agent-mgm');
        threatAgentComponentsPage = new ThreatAgentComponentsPage();
        expect(threatAgentComponentsPage.getTitle())
            .toMatch(/hermeneutApp.threatAgent.home.title/);

    });

    it('should load create ThreatAgent dialog', () => {
        threatAgentComponentsPage.clickOnCreateButton();
        threatAgentDialogPage = new ThreatAgentDialogPage();
        expect(threatAgentDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.threatAgent.home.createOrEditLabel/);
        threatAgentDialogPage.close();
    });

    it('should create and save ThreatAgents', () => {
        threatAgentComponentsPage.clickOnCreateButton();
        threatAgentDialogPage.setNameInput('name');
        expect(threatAgentDialogPage.getNameInput()).toMatch('name');
        threatAgentDialogPage.setDescriptionInput('description');
        expect(threatAgentDialogPage.getDescriptionInput()).toMatch('description');
        threatAgentDialogPage.setImageInput(absolutePath);
        threatAgentDialogPage.skillLevelSelectLastOption();
        threatAgentDialogPage.intentSelectLastOption();
        threatAgentDialogPage.accessSelectLastOption();
        threatAgentDialogPage.setCreatedInput(12310020012301);
        expect(threatAgentDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        threatAgentDialogPage.setModifiedInput(12310020012301);
        expect(threatAgentDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        // threatAgentDialogPage.motivationSelectLastOption();
        threatAgentDialogPage.save();
        expect(threatAgentDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ThreatAgentComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-threat-agent-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ThreatAgentDialogPage {
    modalTitle = element(by.css('h4#myThreatAgentLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    imageInput = element(by.css('input#file_image'));
    skillLevelSelect = element(by.css('select#field_skillLevel'));
    intentSelect = element(by.css('select#field_intent'));
    accessSelect = element(by.css('select#field_access'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    motivationSelect = element(by.css('select#field_motivation'));

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

    setImageInput = function(image) {
        this.imageInput.sendKeys(image);
    };

    getImageInput = function() {
        return this.imageInput.getAttribute('value');
    };

    setSkillLevelSelect = function(skillLevel) {
        this.skillLevelSelect.sendKeys(skillLevel);
    };

    getSkillLevelSelect = function() {
        return this.skillLevelSelect.element(by.css('option:checked')).getText();
    };

    skillLevelSelectLastOption = function() {
        this.skillLevelSelect.all(by.tagName('option')).last().click();
    };
    setIntentSelect = function(intent) {
        this.intentSelect.sendKeys(intent);
    };

    getIntentSelect = function() {
        return this.intentSelect.element(by.css('option:checked')).getText();
    };

    intentSelectLastOption = function() {
        this.intentSelect.all(by.tagName('option')).last().click();
    };
    setAccessSelect = function(access) {
        this.accessSelect.sendKeys(access);
    };

    getAccessSelect = function() {
        return this.accessSelect.element(by.css('option:checked')).getText();
    };

    accessSelectLastOption = function() {
        this.accessSelect.all(by.tagName('option')).last().click();
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

    motivationSelectLastOption = function() {
        this.motivationSelect.all(by.tagName('option')).last().click();
    };

    motivationSelectOption = function(option) {
        this.motivationSelect.sendKeys(option);
    };

    getMotivationSelect = function() {
        return this.motivationSelect;
    };

    getMotivationSelectedOption = function() {
        return this.motivationSelect.element(by.css('option:checked')).getText();
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
