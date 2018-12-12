import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('AttackCost e2e test', () => {

    let navBarPage: NavBarPage;
    let attackCostDialogPage: AttackCostDialogPage;
    let attackCostComponentsPage: AttackCostComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load AttackCosts', () => {
        navBarPage.goToEntity('attack-cost-mgm');
        attackCostComponentsPage = new AttackCostComponentsPage();
        expect(attackCostComponentsPage.getTitle())
            .toMatch(/hermeneutApp.attackCost.home.title/);

    });

    it('should load create AttackCost dialog', () => {
        attackCostComponentsPage.clickOnCreateButton();
        attackCostDialogPage = new AttackCostDialogPage();
        expect(attackCostDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.attackCost.home.createOrEditLabel/);
        attackCostDialogPage.close();
    });

    it('should create and save AttackCosts', () => {
        attackCostComponentsPage.clickOnCreateButton();
        attackCostDialogPage.typeSelectLastOption();
        attackCostDialogPage.setDescriptionInput('description');
        expect(attackCostDialogPage.getDescriptionInput()).toMatch('description');
        attackCostDialogPage.setCostsInput('5');
        expect(attackCostDialogPage.getCostsInput()).toMatch('5');
        attackCostDialogPage.myAssetSelectLastOption();
        attackCostDialogPage.directAssetSelectLastOption();
        attackCostDialogPage.indirectAssetSelectLastOption();
        attackCostDialogPage.save();
        expect(attackCostDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AttackCostComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-attack-cost-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AttackCostDialogPage {
    modalTitle = element(by.css('h4#myAttackCostLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    typeSelect = element(by.css('select#field_type'));
    descriptionInput = element(by.css('input#field_description'));
    costsInput = element(by.css('input#field_costs'));
    myAssetSelect = element(by.css('select#field_myAsset'));
    directAssetSelect = element(by.css('select#field_directAsset'));
    indirectAssetSelect = element(by.css('select#field_indirectAsset'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
    };
    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    };

    setCostsInput = function(costs) {
        this.costsInput.sendKeys(costs);
    };

    getCostsInput = function() {
        return this.costsInput.getAttribute('value');
    };

    myAssetSelectLastOption = function() {
        this.myAssetSelect.all(by.tagName('option')).last().click();
    };

    myAssetSelectOption = function(option) {
        this.myAssetSelect.sendKeys(option);
    };

    getMyAssetSelect = function() {
        return this.myAssetSelect;
    };

    getMyAssetSelectedOption = function() {
        return this.myAssetSelect.element(by.css('option:checked')).getText();
    };

    directAssetSelectLastOption = function() {
        this.directAssetSelect.all(by.tagName('option')).last().click();
    };

    directAssetSelectOption = function(option) {
        this.directAssetSelect.sendKeys(option);
    };

    getDirectAssetSelect = function() {
        return this.directAssetSelect;
    };

    getDirectAssetSelectedOption = function() {
        return this.directAssetSelect.element(by.css('option:checked')).getText();
    };

    indirectAssetSelectLastOption = function() {
        this.indirectAssetSelect.all(by.tagName('option')).last().click();
    };

    indirectAssetSelectOption = function(option) {
        this.indirectAssetSelect.sendKeys(option);
    };

    getIndirectAssetSelect = function() {
        return this.indirectAssetSelect;
    };

    getIndirectAssetSelectedOption = function() {
        return this.indirectAssetSelect.element(by.css('option:checked')).getText();
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
