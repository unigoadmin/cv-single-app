import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarPublicComponent } from './toolbar-public.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { IconModule } from '@visurel/iconify-angular';
import { NavigationModule } from '../navigation/navigation.module';
import { RouterModule } from '@angular/router';
import { NavigationItemModule } from '../../components/navigation-item/navigation-item.module';
import { MegaMenuModule } from '../../components/mega-menu/mega-menu.module';
import { ContainerModule } from '../../directives/container/container.module';


@NgModule({
  declarations: [ToolbarPublicComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    IconModule,
    NavigationModule,
    RouterModule,
    NavigationItemModule,
    MegaMenuModule,
    ContainerModule
  ],
  exports: [ToolbarPublicComponent]
})
export class ToolbarPublicModule {
}
