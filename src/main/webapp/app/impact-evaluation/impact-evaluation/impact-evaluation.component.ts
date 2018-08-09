import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'jhi-inpact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styles: []
})
export class ImpactEvaluationComponent implements OnInit {

  public impactFormStepOne: FormGroup;
  public impactFormStepTwo: FormGroup;
  constructor() { }

  ngOnInit() {
    const firstYear = (new Date().getFullYear()) - 2;
    const lastYear = (new Date().getFullYear()) + 3;
    this.impactFormStepOne = new FormGroup({
      ebit1: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit2: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit3: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit4: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit5: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit6: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      firstYear: new FormControl(firstYear , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      lastYear: new FormControl(lastYear , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      discountingRate: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
    });
    this.impactFormStepTwo = new FormGroup({
      tangibleAssets: new FormControl(undefined , Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
    });
    /*
    this.userForm = new FormGroup({
      email: new FormControl(undefined, Validators.compose([
        Validators.email,
        Validators.required,
        // Validators.pattern('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')
      ])),
      password: new FormControl(password, Validators.compose([
        // Validators.required,
        // Validators.minLength(6),
        Validators.maxLength(15),
        // Validators.pattern('(?:(?:(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_])|(?:(?=.*?[0-9])|(?=.*?[A-Z])|(?=.*?[-!@#$%&*ˆ+=_])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_]))[A-Za-z0-9-!@#$%&*ˆ+=_]{6,15}')
      ])),
      name: new FormControl(undefined, Validators.compose([
        Validators.required
      ])),
      surname: new FormControl(undefined, Validators.compose([
        Validators.required
      ])),
      age: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(3),
        Validators.max(120)
      ])),
      gender: new FormControl('male'),
      taxCode: new FormControl(undefined),
      address: new FormControl(undefined),
      city: new FormControl(undefined),
      zipCode: new FormControl(undefined),
      telephone: new FormControl(undefined, Validators.compose([
        Validators.required
      ])),
      serviceTerm: new FormControl(false, Validators.requiredTrue),
      privacyPolicy: new FormControl(false, Validators.requiredTrue)
    });
  }
    */
  }

}
