import {
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocThemeToggleComponent,
} from '@ng-doc/app';
import { Component } from '@angular/core';
import { NgDocButtonIconComponent, NgDocIconComponent } from '@ng-doc/ui-kit';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CONFIG } from '../config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgDocRootComponent,
        NgDocNavbarComponent,
        NgDocSidebarComponent,
        NgDocIconComponent,
        RouterModule,
        NgDocThemeToggleComponent,
        NgDocButtonIconComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = CONFIG.name;
    repoUrl = CONFIG.repoUrl;
}
