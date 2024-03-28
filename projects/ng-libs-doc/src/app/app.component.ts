import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent } from '@ng-doc/app';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgDocRootComponent,
        NgDocNavbarComponent,
        NgDocSidebarComponent,
        RouterLink,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
