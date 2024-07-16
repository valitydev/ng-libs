import { Component, input, booleanAttribute, output, numberAttribute } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { ActionsModule } from '../../actions';
import { TagModule } from '../../tag';

@Component({
    selector: 'v-table-info-bar',
    standalone: true,
    imports: [MatIcon, MatIconButton, MatTooltip, TagModule, MatBadge, ActionsModule],
    template: `
        <v-actions>
            <div class="details">
                <div class="count">
                    <v-tag
                        [matBadge]="selectedCount() || ''"
                        [matBadgeDisabled]="progress()"
                        [progress]="progress()"
                        matBadgePosition="above after"
                        matBadgeSize="small"
                    >
                        @if ((!count() && count() !== 0) || (progress() && !count())) {
                            <span>...</span>
                        } @else {
                            {{
                                count()
                                    ? (filteredCount() ? filteredCount() + '/' : '') +
                                      (hasMore() ? '>' : '') +
                                      count()
                                    : '0'
                            }}
                        }
                    </v-tag>
                </div>
                <button
                    [disabled]="progress()"
                    mat-icon-button
                    matTooltip="Reload {{ size() }} elements"
                    (click)="load.emit()"
                >
                    <mat-icon>refresh</mat-icon>
                </button>
                <button
                    [disabled]="progress() || !hasMore()"
                    mat-icon-button
                    matTooltip="Preload {{ preloadSize() }}{{
                        isPreload() && hasMore() ? ' more' : ''
                    }} elements"
                    (click)="preload.emit()"
                >
                    <mat-icon>
                        {{
                            hasMore() || progress()
                                ? isPreload() && hasMore()
                                    ? 'downloading'
                                    : 'download'
                                : 'download_done'
                        }}
                    </mat-icon>
                </button>
                <button
                    [disabled]="progress()"
                    mat-icon-button
                    matTooltip="Download CSV"
                    (click)="downloadCsv.emit()"
                >
                    <mat-icon>file_save</mat-icon>
                </button>
            </div>
            <v-actions>
                <ng-content></ng-content>
            </v-actions>
        </v-actions>
    `,
    styles: `
        .details {
            display: flex;
            align-items: center;

            .count {
                min-width: 65px;

                & > * {
                    display: inline-block;
                }

                ::ng-deep .mat-badge-content {
                    width: auto;
                    border-radius: 1000px;
                    padding: 0 4px;
                }
            }

            ::ng-deep button {
                margin: -6px 0;
            }
        }
    `,
})
export class TableInfoBarComponent {
    progress = input(false, { transform: booleanAttribute });
    hasMore = input(false, { transform: booleanAttribute });
    isPreload = input(false, { transform: booleanAttribute });

    size = input(0, { transform: numberAttribute });
    preloadSize = input(0, { transform: numberAttribute });

    count = input<number | undefined | null>(undefined);
    filteredCount = input<number | undefined>(0);
    selectedCount = input<number | undefined>(0);

    downloadCsv = output();
    load = output();
    preload = output();
}
