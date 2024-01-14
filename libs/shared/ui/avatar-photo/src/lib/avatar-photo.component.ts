import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'as-avatar-photo',
    templateUrl: './avatar-photo.component.html',
    styleUrls: ['./avatar-photo.component.scss'],
})
export class AvatarPhotoComponent implements OnInit, OnChanges {
    @Input()
    public photoUrl = '';

    @Input()
    public name = '';

    @Input()
    public size = 30;

    @Input() isShowName = true;

    public showInitials = false;
    public initials?: string;
    public circleColor?: string;

    private colors = [
        '#3B9AF7', // red
        '#E3313C', // green
        '#8060FF', // yellow
        '#3670B2', // blue,
        '#01AA81',
        '#FB982A',
        '#436A8D',
    ];

    ngOnChanges(changes: SimpleChanges): void {
        const { photoUrl, name } = changes;
        if (name?.currentValue) {
            this.name = name.currentValue;
        }
        if (!photoUrl?.currentValue) {
            this.handleRender();
        }
    }

    ngOnInit(): void {
        if (!this.photoUrl) {
            this.handleRender();
        }
    }

    private handleRender(): void {
        this.showInitials = true;
        this.createInititals();

        const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
        this.circleColor = this.colors[randomIndex];
    }

    private createInititals(): void {
        let initials = '';

        for (let i = 0; i < this.name.length; i++) {
            if (this.name.charAt(i) === ' ') {
                continue;
            }

            if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
                initials += this.name.charAt(i);

                if (initials.length === 2) {
                    break;
                }
            }
        }

        this.initials = initials;
    }
}
