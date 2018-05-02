import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('PhaseWrapper e2e test', () => {

    let navBarPage: NavBarPage;
    let phaseWrapperDialogPage: PhaseWrapperDialogPage;
    let phaseWrapperComponentsPage: PhaseWrapperComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load PhaseWrappers', () => {
        navBarPage.goToEntity('phase-wrapper-mgm');
        phaseWrapperComponentsPage = new PhaseWrapperComponentsPage();
        expect(phaseWrapperComponentsPage.getTitle())
            .toMatch(/hermeneutApp.phaseWrapper.home.title/);

    });

    it('should load create PhaseWrapper dialog', () => {
        phaseWrapperComponentsPage.clickOnCreateButton();
        phaseWrapperDialogPage = new PhaseWrapperDialogPage();
        expect(phaseWrapperDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.phaseWrapper.home.createOrEditLabel/);
        phaseWrapperDialogPage.close();
    });

    it('should create and save PhaseWrappers', () => {
        phaseWrapperComponentsPage.clickOnCreateButton();
        phaseWrapperDialogPage.phaseSelectLastOption();
        phaseWrapperDialogPage.attackStrategySelectLastOption();
        phaseWrapperDialogPage.save();
        expect(phaseWrapperDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PhaseWrapperComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-phase-wrapper-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PhaseWrapperDialogPage {
    modalTitle = element(by.css('h4#myPhaseWrapperLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    phaseSelect = element(by.css('select#field_phase'));
    attackStrategySelect = element(by.css('select#field_attackStrategy'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setPhaseSelect = function(phase) {
        this.phaseSelect.sendKeys(phase);
    };

    getPhaseSelect = function() {
        return this.phaseSelect.element(by.css('option:checked')).getText();
    };

    phaseSelectLastOption = function() {
        this.phaseSelect.all(by.tagName('option')).last().click();
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
