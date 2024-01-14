import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'asc-view-avatar',
  templateUrl: './view-avatar.component.html',
  styleUrls: ['./view-avatar.component.scss']
})
export class ViewAvatarComponent{
    @Input() avatar!: string;
    constructor(private ref: NzModalRef) {}

    close(): void {
        this.ref.close();
    }
}
