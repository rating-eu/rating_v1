import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ImpactLevelDescription e2e test', () => {

    let navBarPage: NavBarPage;
    let impactLevelDescriptionDialogPage: ImpactLevelDescriptionDialogPage;
    let impactLevelDescriptionComponentsPage: ImpactLevelDescriptionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ImpactLevelDescriptions', () => {
        navBarPage.goToEntity('impact-level-description-mgm');
        impactLevelDescriptionComponentsPage = new ImpactLevelDescriptionComponentsPage();
        expect(impactLevelDescriptionComponentsPage.getTitle())
            .toMatch(/hermeneutApp.impactLevelDescription.home.title/);

    });

    it('should load create ImpactLevelDescription dialog', () => {
        impactLevelDescriptionComponentsPage.clickOnCreateButton();
        impactLevelDescriptionDialogPage = new ImpactLevelDescriptionDialogPage();
        expect(impactLevelDescriptionDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.impactLevelDescription.home.createOrEditLabel/);
        impactLevelDescriptionDialogPage.close();
    });

    it('should create and save ImpactLevelDescriptions', () => {
        impactLevelDescriptionComponentsPage.clickOnCreateButton();
        impactLevelDescriptionDialogPage.setImpactInput('5');
        expect(impactLevelDescriptionDialogPage.getImpactInput()).toMatch('5');
        impactLevelDescriptionDialogPage.setPeopleEffectsInput('peopleEffects');
        expect(impactLevelDescriptionDialogPage.getPeopleEffectsInput()).toMatch('peopleEffects');
        impactLevelDescriptionDialogPage.setReputationInput('reputation');
        expect(impactLevelDescriptionDialogPage.getReputationInput()).toMatch('reputation');
        impactLevelDescriptionDialogPage.setServiceOutputsInput('serviceOutputs');
        expect(impactLevelDescriptionDialogPage.getServiceOutputsInput()).toMatch('serviceOutputs');
        impactLevelDescriptionDialogPage.setLegalAndComplianceInput('legalAndCompliance');
        expect(impactLevelDescriptionDialogPage.getLegalAndComplianceInput()).toMatch('legalAndCompliance');
        impactLevelDescriptionDialogPage.setManagementImpactInput('managementImpact');
        expect(impactLevelDescriptionDialogPage.getManagementImpactInput()).toMatch('managementImpact');
        impactLevelDescriptionDialogPage.save();
        expect(impactLevelDescriptionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ImpactLevelDescriptionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-impact-level-description-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ImpactLevelDescriptionDialogPage {
    modalTitle = element(by.css('h4#myImpactLevelDescriptionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    impactInput = element(by.css('input#field_impact'));
    peopleEffectsInput = element(by.css('input#field_peopleEffects'));
    reputationInput = element(by.css('input#field_reputation'));
    serviceOutputsInput = element(by.css('input#field_serviceOutputs'));
    legalAndComplianceInput = element(by.css('input#field_legalAndCompliance'));
    managementImpactInput = element(by.css('input#field_managementImpact'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setImpactInput = function(impact) {
        this.impactInput.sendKeys(impact);
    };

    getImpactInput = function() {
        return this.impactInput.getAttribute('value');
    };

    setPeopleEffectsInput = function(peopleEffects) {
        this.peopleEffectsInput.sendKeys(peopleEffects);
    };

    getPeopleEffectsInput = function() {
        return this.peopleEffectsInput.getAttribute('value');
    };

    setReputationInput = function(reputation) {
        this.reputationInput.sendKeys(reputation);
    };

    getReputationInput = function() {
        return this.reputationInput.getAttribute('value');
    };

    setServiceOutputsInput = function(serviceOutputs) {
        this.serviceOutputsInput.sendKeys(serviceOutputs);
    };

    getServiceOutputsInput = function() {
        return this.serviceOutputsInput.getAttribute('value');
    };

    setLegalAndComplianceInput = function(legalAndCompliance) {
        this.legalAndComplianceInput.sendKeys(legalAndCompliance);
    };

    getLegalAndComplianceInput = function() {
        return this.legalAndComplianceInput.getAttribute('value');
    };

    setManagementImpactInput = function(managementImpact) {
        this.managementImpactInput.sendKeys(managementImpact);
    };

    getManagementImpactInput = function() {
        return this.managementImpactInput.getAttribute('value');
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
