import { Component, Input, Output } from '@angular/core';
import {PatreonReward} from "../objects/PatreonReward";
import {BaseBootstrapSelect} from "../../helpers/directives/base-bootstrap-select";

/**
 * Example of a bootstrap-select component using Object type for option values
 */
@Component({
  selector: 'patreon-reward-select',
  templateUrl: './patreon-reward-select.component.html',
})
export class PatreonRewardSelectComponent extends BaseBootstrapSelect {

  // public compareFunction: any = function(ra, rb) {
  //   return ra && rb ? ra.id === rb.id : false;
  // };

  public title: string = "Patreon Reward Tiers";

  compareRewards(ra: PatreonReward, rb: PatreonReward): boolean {
    return ra && rb ? ra.id === rb.id : false;
  }
  // boxing of options (see base class), allows us to define the type in this component
  public get rewards(): Array<PatreonReward> {
    return this.options as Array<PatreonReward>;
  }

  @Input('accounts')
  public set accounts(val: Array<PatreonReward>) {
    this.options = val;
  }

  // boxing of selected options (see base class)
  @Input()
  public get selectedRewards(): Array<PatreonReward> {
    let selectedString = "";
    for (let reward of this.mySelections) {
      selectedString += reward['title'] + ', ';
    }

    this.title = selectedString;
    return this.mySelections as Array<PatreonReward>;
  }

  // // @Input()
  // public get compareWith(): any {
  //   return this.compareFunction;
  // }

  public set selectedRewards(val: Array<PatreonReward>) {
    this.mySelections = val;
  }

  /**
   * method to compare City objects for use in the compareWith directive
   * In our case, two cities are equal if their id's are equal
   */

}
