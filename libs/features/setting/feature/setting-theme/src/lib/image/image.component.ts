import { Component, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppEnvironment, APP_ENVIRONMENT } from '@asc/shared/app-config';
import { SafeEvent } from '@asc/shared/utils';
import { takeUntil } from 'rxjs/operators';
import { FileService } from '@asc/shared/services/common';
import { CourseService } from '@asc/features/shell/data-access/service';

@Component({
    selector: 'asc-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ImageComponent,
            multi: true,
        },
    ],
})
export class ImageComponent implements OnDestroy, ControlValueAccessor {
    _path: string | null | undefined = '';
    @Input() set url(value: string | null | undefined) {
        this._path = value;
    }
    @Output() fileUpload = new EventEmitter<string>();

    progress = 0;

    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange!: Function;
    private destroyed$ = new Subject<void>();
    constructor(@Inject(APP_ENVIRONMENT) private env: AppEnvironment, private courseService: CourseService) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    clear(): void {
        this._path = '';
        this.onChange(this._path);
    }

    uploadImage(event: SafeEvent): void {
        const file = event.target.files[0];
        const fd = new FormData();
        fd.append('files', file);

        this.courseService
            .upload(`Media/Files/UploadFiles?moduleName=Course&functionName=Course`, fd)
            .pipe(takeUntil(this.destroyed$))
            // eslint-disable-next-line @typescript-eslint/no-shadow
            .subscribe((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        console.warn('Request has been made!');
                        break;
                    case HttpEventType.ResponseHeader:
                        console.warn('Response header has been received!');
                        break;
                    case HttpEventType.UploadProgress:
                        this.progress = Math.round((event.loaded / (event.total ?? 1)) * 100);
                        console.warn(`Uploaded! ${this.progress}%`);
                        break;
                    case HttpEventType.Response:
                        this.onChange(`${event.body?.result[0]?.path}`);
                        this._path = `${event.body?.result[0]?.path}`;
                        setTimeout(() => {
                            this.progress = 0;
                        }, 1500);
                }
            });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        // code here
    }

    writeValue(obj: any): void {
        this._path = obj;
    }
}
