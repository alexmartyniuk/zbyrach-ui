import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';


@Injectable({
    providedIn: 'root',
})
export class UiService {

    private spinnerTopRef = this.cdkSpinnerCreate();

    constructor(private overlay: Overlay) { }

    private cdkSpinnerCreate() {
        return this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'dark-backdrop',
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically()
        });
    }

    public showSpinner(){
      this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
    }

    public hideSpinner(){
      this.spinnerTopRef.detach() ;
    }
}
