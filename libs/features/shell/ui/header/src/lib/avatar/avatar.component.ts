import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TokenInfo } from '@asc/core/auth/data-access';

@Component({
    selector: 'asc-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
    @Input() user: TokenInfo | null = null;

    get fullname(): string {
        return `${this.user?.lastname} ${this.user?.firstname}`;
    }

    get postfixName(): string {
        return this.user?.firstname ? this.user.firstname[0] : 'A';
    }
}
