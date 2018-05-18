
import { ProfilePipe } from "./profile.pipe";
import { NgModule } from '@angular/core';
import {StorageBrowser} from "../shared/sdk/storage/storage.browser";
import {LoopBackAuth} from "../shared/sdk/services/core/auth.service";

@NgModule({
  declarations: [ProfilePipe],
  exports: [ProfilePipe],
  providers: [StorageBrowser, LoopBackAuth]
})
export class PipesModule { }
