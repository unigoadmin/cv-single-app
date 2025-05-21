import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";


import { GlobalSettingsRoutingModule } from './global-settings-routing.module';
import { GlobalSettingsComponent } from './global-settings.component';
import { AddGsettingsComponent } from './add-gsettings/add-gsettings.component';
import { SettingsPrefixComponent } from './settings-prefix/settings-prefix.component';
import { CustomMessagesComponent } from './custom-messages/custom-messages.component';
import { UpdateCustomMessageComponent } from './update-custom-message/update-custom-message.component';
import { ResumeSourceComponent } from './resume-source/resume-source.component';
import { HashTagsComponent } from './hash-tags/hash-tags.component';
import { KeyWordsComponent } from './key-words/key-words.component';
import {CandidateStatusComponent} from './candidate-status/candidate-status.component';
import { SessionSettingsComponent } from './session-settings/session-settings.component';
import { WorkPermitsComponent } from './work-permits/work-permits.component';

@NgModule({
  declarations: [GlobalSettingsComponent, AddGsettingsComponent, SettingsPrefixComponent, CustomMessagesComponent, UpdateCustomMessageComponent, ResumeSourceComponent, HashTagsComponent, KeyWordsComponent,CandidateStatusComponent, SessionSettingsComponent, WorkPermitsComponent],
  imports: [
    CommonModule,
    GlobalSettingsRoutingModule,

    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule

  ]
})
export class GlobalSettingsModule { }
