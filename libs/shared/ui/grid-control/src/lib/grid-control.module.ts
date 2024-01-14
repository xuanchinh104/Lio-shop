import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSearchComponent } from './grid-search/grid-search.component';
import { IconModule } from '@asc/shared/ui/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { GridHeaderComponent } from './grid-header/grid-header.component';
import { HideIfUnauthorizedModule } from '@asc/core/auth/utils/directives';

const UIs = [GridSearchComponent, GridHeaderComponent];

@NgModule({
    imports: [CommonModule, IconModule, ReactiveFormsModule, TranslocoModule, HideIfUnauthorizedModule],
    declarations: [...UIs],
    exports: [...UIs],
})
export class GridControlModule {}
