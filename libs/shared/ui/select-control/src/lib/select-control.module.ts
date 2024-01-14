import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectControlComponent } from './select-control.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ConditionDataSourceDirective } from './directives/condition-data-source.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { CatalogDataSourceDirective } from './directives/catalog-data-source.directive';

const DIRECTIVES = [CatalogDataSourceDirective, SelectControlComponent, ConditionDataSourceDirective];

@NgModule({
    imports: [CommonModule, NzSelectModule, ReactiveFormsModule],
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES],
})
export class SelectControlModule {}
