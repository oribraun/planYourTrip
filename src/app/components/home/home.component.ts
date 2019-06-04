import { Component, OnInit } from '@angular/core';
import {CountriesService} from '../../services/countries/countries.service';
import {CitiesService} from '../../services/cities/cities.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    public _countries: any = [];
    public _cities: any = [];
    public _currentCountry: any = '';
    public _currentCity: any = '';
    public _countriesService: CountriesService;
    public _citiesService: CitiesService;
    constructor(countriesService: CountriesService, citiesService: CitiesService) {
        this._countriesService = countriesService;
        this._citiesService = citiesService;
    }

    ngOnInit() {
        this._countriesService.getCountries().subscribe(
            (data: any) => {
                console.log(data);
                if (!data.err) {
                    this._countries = data.countries;
                }
            },
            (error: any) => {

            }
        );
        this._citiesService.getCities().subscribe(
            (data: any) => {
                console.log(data);
                if (!data.err) {
                    this._cities = data.cities;
                }
            },
            (error: any) => {

            }
        );
    }

    onCountryChange() {
        this._currentCity = '';
    }

}
