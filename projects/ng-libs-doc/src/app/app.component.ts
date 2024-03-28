import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocThemeToggleComponent,
} from '@ng-doc/app';
import {
    NgDocButtonIconComponent,
    NgDocTooltipDirective,
    NgDocIconComponent,
} from '@ng-doc/ui-kit';

import * as packageJson from '../../../../package.json';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgDocRootComponent,
        NgDocNavbarComponent,
        NgDocSidebarComponent,
        RouterLink,
        NgDocThemeToggleComponent,
        NgDocButtonIconComponent,
        NgDocTooltipDirective,
        NgDocIconComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    githubUrl = packageJson.repository.url;
}
