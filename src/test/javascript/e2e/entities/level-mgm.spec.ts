import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Level e2e test', () => {

    let navBarPage: NavBarPage;
    let levelDialogPage: LevelDialogPage;
    let levelComponentsPage: LevelComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Levels', () => {
        navBarPage.goToEntity('level-mgm');
        levelComponentsPage = new LevelComponentsPage();
        expect(levelComponentsPage.getTitle())
            .toMatch(/hermeneutApp.level.home.title/);

    });

    it('should load create Level dialog', () => {
        levelComponentsPage.clickOnCreateButton();
        levelDialogPage = new LevelDialogPage();
        expect(levelDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.level.home.createOrEditLabel/);
        levelDialogPage.close();
    });

    it('should create and save Levels', () => {
        levelComponentsPage.clickOnCreateButton();
        levelDialogPage.setNameInput('name');
        expect(levelDialogPage.getNameInput()).toMatch('name');
        levelDialogPage.setDescriptionInput('description');
        expect(levelDialogPage.getDescriptionInput()).toMatch('description');
        levelDialogPage.attackStrategySelectLastOption();
        levelDialogPage.save();
        expect(levelDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class LevelComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-level-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LevelDialogPage {
    modalTitle = element(by.css('h4#myLevelLabel'));
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
