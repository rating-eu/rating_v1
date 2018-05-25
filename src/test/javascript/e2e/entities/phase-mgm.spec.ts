import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Phase e2e test', () => {

    let navBarPage: NavBarPage;
    let phaseDialogPage: PhaseDialogPage;
    let phaseComponentsPage: PhaseComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Phases', () => {
        navBarPage.goToEntity('phase-mgm');
        phaseComponentsPage = new PhaseComponentsPage();
        expect(phaseComponentsPage.getTitle())
            .toMatch(/hermeneutApp.phase.home.title/);

    });

    it('should load create Phase dialog', () => {
        phaseComponentsPage.clickOnCreateButton();
        phaseDialogPage = new PhaseDialogPage();
        expect(phaseDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.phase.home.createOrEditLabel/);
        phaseDialogPage.close();
    });

    it('should create and save Phases', () => {
        phaseComponentsPage.clickOnCreateButton();
        phaseDialogPage.setNameInput('name');
        expect(phaseDialogPage.getNameInput()).toMatch('name');
        phaseDialogPage.setDescriptionInput('description');
        expect(phaseDialogPage.getDescriptionInput()).toMatch('description');
        phaseDialogPage.attackStrategySelectLastOption();
        phaseDialogPage.save();
        expect(phaseDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PhaseComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-phase-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PhaseDialogPage {
    modalTitle = element(by.css('h4#myPhaseLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    attackStrategySelect = element(by.css('select#field_attackStrategy'));

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

    attackStrategySelectLastOption = function() {
        this.attackStrategySelect.all(by.tagName('option')).last().click();
    };

    attackStrategySelectOption = function(option) {
        this.attackStrategySelect.sendKeys(option);
    };

    getAttackStrategySelect = function() {
        return this.attackStrategySelect;
    };

    getAttackStrategySelectedOption = function() {
        return this.attackStrategySelect.element(by.css('option:checked')).getText();
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
