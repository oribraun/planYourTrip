import { Component, OnInit } from '@angular/core';
import {CountriesService} from '../../services/countries/countries.service';
import {CitiesService} from '../../services/cities/cities.service';
import {FormControl, FormGroup} from "@angular/forms";

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
    public _countryOptions: any = {};
    public _citiesOptions: any = {};
    public test: any = '';
    constructor(countriesService: CountriesService, citiesService: CitiesService) {
        this._countriesService = countriesService;
        this._citiesService = citiesService;
    }

    ngOnInit() {
        this._countryOptions = {
            list: [],
            prefix: 'prefix',
            itemKey: 'name',
            inputClass: '',
            placeholder: 'Countries',
            inputName: 'countries',
            required: true,
            onNgClass: {'empty': !this._currentCountry}
        };
        this._citiesOptions = {
            list: [],
            prefix: 'prefix 2',
            itemKey: '',
            inputClass: '',
            placeholder: 'Cities',
            inputName: 'cities',
            required: true,
            onNgClass: {'empty': !this._currentCity}
        };

        this._countriesService.getCountries().subscribe(
            (data: any) => {
                console.log(data);
                if (!data.err) {
                    this._countries = data.countries;
                    this._countryOptions.list = this._countries;
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
                    if (this._currentCountry.key) {
                        this._citiesOptions.list = this._cities[this._currentCountry.key];
                    }
                }
            },
            (error: any) => {

            }
        );
    }

    onCountryChange() {
        this._currentCity = '';
        setTimeout(() => {
            if (this._currentCountry.key) {
                this._citiesOptions.list = this._cities[this._currentCountry.key];
            }
        });
    }

    submit(form: any) {
        console.log('form', form)
    }

}
