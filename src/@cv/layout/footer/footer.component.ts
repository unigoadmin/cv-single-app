import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import icShoppingBasket from '@iconify/icons-ic/twotone-shopping-basket';
import { TermsAndCondtionsComponent } from 'src/@shared/components/terms-and-condtions/terms-and-condtions.component';

@Component({
  selector: 'vex-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  @Input() customTemplate: TemplateRef<any>;
  icShoppingBasket = icShoppingBasket;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {}

  viewTermsAndCondtions() {
    this.dialog.open(TermsAndCondtionsComponent, {
      data: null,
      width: '900px',
      disableClose: false
    });
  }

}
