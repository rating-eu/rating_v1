import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('LevelWrapper e2e test', () => {

    let navBarPage: NavBarPage;
    let levelWrapperDialogPage: LevelWrapperDialogPage;
    let levelWrapperComponentsPage: LevelWrapperComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load LevelWrappers', () => {
        navBarPage.goToEntity('level-wrapper-mgm');
        levelWrapperComponentsPage = new LevelWrapperComponentsPage();
        expect(levelWrapperComponentsPage.getTitle())
            .toMatch(/hermeneutApp.levelWrapper.home.title/);

    });

    it('should load create LevelWrapper dialog', () => {
        levelWrapperComponentsPage.clickOnCreateButton();
        levelWrapperDialogPage = new LevelWrapperDialogPage();
        expect(levelWrapperDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.levelWrapper.home.createOrEditLabel/);
        levelWrapperDialogPage.close();
    });

    it('should create and save LevelWrappers', () => {
        levelWrapperComponentsPage.clickOnCreateButton();
        levelWrapperDialogPage.levelSelectLastOption();
        levelWrapperDialogPage.attackStrategySelectLastOption();
        levelWrapperDialogPage.save();
        expect(levelWrapperDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class LevelWrapperComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-level-wrapper-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LevelWrapperDialogPage {
    modalTitle = element(by.css('h4#myLevelWrapperLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    levelSelect = element(by.css('select#field_level'));
    attackStrategySelect = element(by.css('select#field_attackStrategy'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setLevelSelect = function(level) {
        this.levelSelect.sendKeys(level);
    };

    getLevelSelect = function() {
        return this.levelSelect.element(by.css('option:checked')).getText();
    };

    levelSelectLastOption = function() {
        this.levelSelect.all(by.tagName('option')).last().click();
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
