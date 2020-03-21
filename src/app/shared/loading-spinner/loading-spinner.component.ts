import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoadingSpinnerService } from './loading-spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
    spinnerSubscription: Subscription;
    @Input() isLoading = false;

    constructor(private loadingSpinnerService: LoadingSpinnerService) {}

    ngOnInit() {
        this.spinnerSubscription = this.loadingSpinnerService.isLoading.subscribe(
            state => {
                this.isLoading = state;
            }
        );
    }

    ngOnDestroy() {
        this.spinnerSubscription.unsubscribe();
    }
    
}
