import { TestBed } from '@angular/core/testing';

import { NotifyLogService } from './notify-log.service';

describe('LogService', () => {
    let service: NotifyLogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NotifyLogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
