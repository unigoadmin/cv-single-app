import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkerCentralDashboardRoutingModule } from './workercentral-dashboard.routing.module';
import { WorkercentralDashboardComponent } from './workercentral-dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartModule } from 'src/@cv/components/chart/chart.module';
import { MatIconModule } from '@angular/material/icon';
import { WidgetQuickLineChartModule } from 'src/@cv/components/widgets/widget-quick-line-chart/widget-quick-line-chart.module';
import { WidgetQuickValueCenterModule } from 'src/@cv/components/widgets/widget-quick-value-center/widget-quick-value-center.module';
import { WidgetQuickValueStartModule } from 'src/@cv/components/widgets/widget-quick-value-start/widget-quick-value-start.module';
import { WidgetLargeGoalChartModule } from 'src/@cv/components/widgets/widget-large-goal-chart/widget-large-goal-chart.module';
import { IconModule } from '@visurel/iconify-angular';
import { WidgetAssistantModule } from 'src/@cv/components/widgets/widget-assistant/widget-assistant.module';
import { WidgetLargeChartModule } from 'src/@cv/components/widgets/widget-large-chart/widget-large-chart.module';
import { WidgetTableModule } from 'src/@cv/components/widgets/widget-table/widget-table.module';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { MatButtonModule } from '@angular/material/button';
import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { WcApplicantsCountComponent } from './wc-applicants-count/wc-applicants-count.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {WcHeadcountChartComponent} from './wc-headcount-chart/wc-headcount-chart.component';

@NgModule({
    declarations: [WorkercentralDashboardComponent, WcApplicantsCountComponent,WcHeadcountChartComponent],
    imports: [
      CommonModule,
      WorkerCentralDashboardRoutingModule,
      FlexLayoutModule,
      ChartModule,
      MatIconModule,
      WidgetQuickLineChartModule,
      WidgetQuickValueCenterModule,
      WidgetQuickValueStartModule,
      WidgetLargeGoalChartModule,
      IconModule,
      WidgetAssistantModule,
      WidgetLargeChartModule,
      WidgetTableModule,
      SecondaryToolbarModule,
      BreadcrumbsModule,
      MatButtonModule,
      PageLayoutModule,
      ContainerModule,
      MatTooltipModule
    ]
  })
  export class WorkerCentralDashboardModule {
  }