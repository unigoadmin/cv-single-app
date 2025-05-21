import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'src/@cv/layout/layout.module';
import { PublicLayoutComponent } from './public-layout.component';
import { SidenavModule } from 'src/@cv/layout/sidenav/sidenav.module';
import { ToolbarModule } from 'src/@cv/layout/toolbar/toolbar.module';
import { ToolbarPublicModule } from 'src/@cv/layout/toolbar-public/toolbar-public.module';
import { FooterModule } from 'src/@cv/layout/footer/footer.module';
import { ConfigPanelModule } from 'src/@cv/components/config-panel/config-panel.module';
import { SidebarModule } from 'src/@cv/components/sidebar/sidebar.module';
import { QuickpanelModule } from 'src/@cv/layout/quickpanel/quickpanel.module';


@NgModule({
  declarations: [PublicLayoutComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SidenavModule,
    ToolbarModule,
    ToolbarPublicModule,
    FooterModule,
    ConfigPanelModule,
    SidebarModule,
    QuickpanelModule
  ]
})
export class PublicLayoutModule {
}
