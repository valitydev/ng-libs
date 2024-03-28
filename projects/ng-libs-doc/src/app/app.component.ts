import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent } from '@ng-doc/app';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'ng-libs-doc';
}
