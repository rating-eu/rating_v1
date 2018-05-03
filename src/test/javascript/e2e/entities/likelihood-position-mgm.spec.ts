import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('LikelihoodPosition e2e test', () => {

    let navBarPage: NavBarPage;
    let likelihoodPositionDialogPage: LikelihoodPositionDialogPage;
    let likelihoodPositionComponentsPage: LikelihoodPositionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load LikelihoodPositions', () => {
        navBarPage.goToEntity('likelihood-position-mgm');
        likelihoodPositionComponentsPage = new LikelihoodPositionComponentsPage();
        expect(likelihoodPositionComponentsPage.getTitle())
            .toMatch(/hermeneutApp.likelihoodPosition.home.title/);

    });

    it('should load create LikelihoodPosition dialog', () => {
        likelihoodPositionComponentsPage.clickOnCreateButton();
        likelihoodPositionDialogPage = new LikelihoodPositionDialogPage();
        expect(likelihoodPositionDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.likelihoodPosition.home.createOrEditLabel/);
        likelihoodPositionDialogPage.close();
    });

    it('should create and save LikelihoodPositions', () => {
        likelihoodPositionComponentsPage.clickOnCreateButton();
        likelihoodPositionDialogPage.likelihoodSelectLastOption();
        likelihoodPositionDialogPage.setPositionInput('5');
        expect(likelihoodPositionDialogPage.getPositionInput()).toMatch('5');
        likelihoodPositionDialogPage.save();
        expect(likelihoodPositionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class LikelihoodPositionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-likelihood-position-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LikelihoodPositionDialogPage {
    modalTitle = element(by.css('h4#myLikelihoodPositionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    likelihoodSelect = element(by.css('select#field_likelihood'));
    positionInput = element(by.css('input#field_position'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setLikelihoodSelect = function(likelihood) {
        this.likelihoodSelect.sendKeys(likelihood);
    };

    getLikelihoodSelect = function() {
        return this.likelihoodSelect.element(by.css('option:checked')).getText();
    };

    likelihoodSelectLastOption = function() {
        this.likelihoodSelect.all(by.tagName('option')).last().click();
    };
    setPositionInput = function(position) {
        this.positionInput.sendKeys(position);
    };

    getPositionInput = function() {
        return this.positionInput.getAttribute('value');
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
