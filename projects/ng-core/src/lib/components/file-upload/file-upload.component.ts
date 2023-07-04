import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'v-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
    @Input() label?: string;

    @Output() upload = new EventEmitter<File | null>();

    protected file?: File | null;

    loadFile(event: Event) {
        this.file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
        this.upload.emit(this.file);
    }
}
