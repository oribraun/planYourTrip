import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {

    private _http: HttpClient;
    constructor(http: HttpClient) {
        this._http = http;
    }

    getCities() {
        return this._http.get(environment.apiUrl + '/api/cities/get', {});
    }
}
