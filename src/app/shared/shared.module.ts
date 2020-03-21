import { NgModule } from '@angular/core';

import { SearchComponent } from 'src/app/shared/search/search.component';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImageUploadComponent } from '../components/images/image-upload/image-upload.component';
import { ImageGalleryComponent } from '../components/images/image-gallery/image-gallery.component';
import { ImageGalleryItemComponent } from '../components/images/image-gallery/image-gallery-item/image-gallery-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule } from '@angular/material';

@NgModule({
    declarations: [
        SearchComponent,
        AlertComponent,
        LoadingSpinnerComponent,
        PaginationComponent,
        ImageUploadComponent,
        ImageGalleryComponent,
        ImageGalleryItemComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatToolbarModule,
        MatProgressSpinnerModule
    ],
    exports: [
        SearchComponent,
        AlertComponent,
        LoadingSpinnerComponent,
        PaginationComponent,
        ImageUploadComponent,
        ImageGalleryComponent,
        ImageGalleryItemComponent,
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatToolbarModule,
        MatProgressSpinnerModule
    ]
})

export class SharedModule {}