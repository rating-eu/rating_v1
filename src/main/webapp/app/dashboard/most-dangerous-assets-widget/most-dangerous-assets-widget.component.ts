import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { SelfAssessmentOverview } from '../../my-self-assessments/models/SelfAssessmentOverview.model';
import { AugmentedMyAsset } from '../../my-self-assessments/models/AugmentedMyAsset.model';

@Component({
  selector: 'jhi-most-dangerous-assets-widget',
  templateUrl: './most-dangerous-assets-widget.component.html',
  styles: []
})
export class MostDangerousAssetsWidgetComponent implements OnInit {
  public isCollapsed = false;
  public loading = false;
  public assets: AugmentedMyAsset[];
  public overview: SelfAssessmentOverview;
  public assetAttacksNumbMap: Map<number, number> = new Map<number, number>();

  // high; medium-high ; medium; medium low; low
  // Likelihood: 5, 4, 3 , 2, 1
  // Vulnerability: 5, 4, 3, 2, 1
  constructor(
    private selfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.selfAssessmentService.getOverwiew().toPromise().then((res: SelfAssessmentOverview) => {
      if (res) {
          this.overview = res;
          this.assets = [];
          for (const item of this.overview.augmentedMyAssets) {
              if (this.assetAttacksNumbMap.has(item.asset.id)) {
                  this.assetAttacksNumbMap.set(
                      item.asset.id,
                      this.assetAttacksNumbMap.get(item.asset.id) + 1
                  );
              } else {
                  this.assetAttacksNumbMap.set(item.asset.id, 1);
                  this.assets.push(item);
              }
          }
          this.loading = false;
      }
  });
  }

}
