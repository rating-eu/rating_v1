import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
import * as path from 'path';
describe('Logo e2e test', () => {

    let navBarPage: NavBarPage;
    let logoDialogPage: LogoDialogPage;
    let logoComponentsPage: LogoComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Logos', () => {
        navBarPage.goToEntity('logo-mgm');
        logoComponentsPage = new LogoComponentsPage();
        expect(logoComponentsPage.getTitle())
            .toMatch(/hermeneutApp.logo.home.title/);

    });

    it('should load create Logo dialog', () => {
        logoComponentsPage.clickOnCreateButton();
        logoDialogPage = new LogoDialogPage();
        expect(logoDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.logo.home.createOrEditLabel/);
        logoDialogPage.close();
    });

    it('should create and save Logos', () => {
        logoComponentsPage.clickOnCreateButton();
        logoDialogPage.getPrimaryInput().isSelected().then((selected) => {
            if (selected) {
                logoDialogPage.getPrimaryInput().click();
                expect(logoDialogPage.getPrimaryInput().isSelected()).toBeFalsy();
            } else {
                logoDialogPage.getPrimaryInput().click();
                expect(logoDialogPage.getPrimaryInput().isSelected()).toBeTruthy();
            }
        });
        logoDialogPage.setImageInput(absolutePath);
        logoDialogPage.save();
        expect(logoDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class LogoComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-logo-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LogoDialogPage {
    modalTitle = element(by.css('h4#myLogoLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    primaryInput = element(by.css('input#field_primary'));
    imageInput = element(by.css('input#file_image'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    getPrimaryInput = function() {
        return this.primaryInput;
    };
    setImageInput = function(image) {
        this.imageInput.sendKeys(image);
    };

    getImageInput = function() {
        return this.imageInput.getAttribute('value');
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
