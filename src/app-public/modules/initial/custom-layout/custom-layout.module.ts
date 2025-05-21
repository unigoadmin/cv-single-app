import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'src/@cv/layout/layout.module';
import { CustomLayoutComponent } from './custom-layout.component';
import { SidenavModule } from 'src/@cv/layout/sidenav/sidenav.module';
import { ToolbarModule } from 'src/@cv/layout/toolbar/toolbar.module';
import { FooterModule } from 'src/@cv/layout/footer/footer.module';
import { ConfigPanelModule } from 'src/@cv/components/config-panel/config-panel.module';
import { SidebarModule } from 'src/@cv/components/sidebar/sidebar.module';
import { QuickpanelModule } from 'src/@cv/layout/quickpanel/quickpanel.module';

// Import NgIdle Modules
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterComponentsModules } from 'src/@shared/components/filter-components/filter-component.module';

@NgModule({
  declarations: [CustomLayoutComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SidenavModule,
    ToolbarModule,
    FooterModule,
    ConfigPanelModule,
    SidebarModule,
    QuickpanelModule,
    MatDialogModule,
    FilterComponentsModules,
    NgIdleKeepaliveModule.forRoot()
  ]
})
export class CustomLayoutModule {
}
