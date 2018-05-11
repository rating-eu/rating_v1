import {Injectable} from '@angular/core';

@Injectable()
export class DatasharingService {

    _message: String = 'Default';

    constructor() {
    }

    setMessage(m: String) {
        this._message = m;
    }

    getMessage() {
        return this._message;
    }
}
