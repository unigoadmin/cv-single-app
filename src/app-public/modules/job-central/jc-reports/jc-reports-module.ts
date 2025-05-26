import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module';
import { DateTokensModule } from 'src/@cv/pipes/date-tokens/date-tokens.module';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { SafeHtmlModule } from 'src/@cv/pipes/safe-html/safe-html.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
//import { ProcessMenuModule } from 'src/@cv/components/process-menu/process-menu.module';
import { FilterComponentsModules } from 'src/@shared/components/filter-components/filter-component.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
//import { TalentCentralModule } from 'src/app-ats/talent-central/talent-central.module';   
import { ValidationService } from 'src/@cv/services/validation.service';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatSliderModule } from '@angular/material/slider';
import { PopoverService } from 'src/@cv/components/popover/popover.service';
import { PopoverModule } from 'src/@cv/components/popover/popover.module';
import { MegaMenuModule } from 'src/@cv/components/mega-menu/mega-menu.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DisableDirective } from 'src/@shared/directives/htmlformdisable';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

import { JobCentralReportsRoutingModule } from './jc-reports-routing.module';

import {JcReportsComponent} from './jc-reports.component';
import {JcCustomReportsComponent} from './jc-custom-reports/jc-custom-reports.component';
import {JcStandardReportsComponent} from './jc-standard-reports/jc-standard-reports.component';


@NgModule({
    declarations: [JcReportsComponent,JcCustomReportsComponent,JcStandardReportsComponent],
    imports: [
        JobCentralReportsRoutingModule,
        CommonModule,
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
        MatSidenavModule,
        MatCardModule,
        MatDividerModule,
        DragDropModule,
        ScrollbarModule,
        DateTokensModule,
        MatInputModule,
        MatGridListModule,
        MatTabsModule,
        MatListModule,
        MatDialogModule,
        MatRadioModule,
        MatStepperModule,
        MatExpansionModule,
        MatSlideToggleModule,
        SecondaryToolbarModule,
        FileUploadModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectSearchModule,
        MatAutocompleteModule,
        MatChipsModule,
        NgxDocViewerModule,
        TitleCaseModule,
        NgxPermissionsModule.forChild(),
        SafeHtmlModule,
        MatSliderModule,
        ShortenpipeModule,
        //TalentCentralModule,
        FilterComponentsModules,
        //ProcessMenuModule,
        PopoverModule,
        MegaMenuModule,
        NgxMaterialTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA ],
    providers:[ValidationService,PopoverService]
})
export class JobCentralReportsModule { }
