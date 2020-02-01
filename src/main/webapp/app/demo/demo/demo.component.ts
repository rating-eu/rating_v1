import {Component, OnInit} from '@angular/core';
import {DemoService} from "../demo.service";
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styles: []
})
export class DemoComponent implements OnInit {

    public threatAgentsDemoLoaded = false;

    constructor(private demoService: DemoService,
                private router: Router) {
    }

    ngOnInit() {
    }

    loadThreatAgentsDemo() {
        this.demoService.loadThreatAgentsDemo()
            .toPromise()
            .then((value: boolean) => {
                this.threatAgentsDemoLoaded = value;

                if (this.threatAgentsDemoLoaded) {
                    this.router.navigate(['/dashboard']);
                }
            });
    }
}
