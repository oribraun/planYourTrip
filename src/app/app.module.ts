import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GoogleMapService } from './services/google.map/google.map.service';
import { CountriesService } from './services/countries/countries.service';
import { CitiesService } from './services/cities/cities.service';
import { HomeComponent } from './components/home/home.component';
import { AutoCompleteComponent } from './components/auto.complete/auto.complete.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AutoCompleteComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        GoogleMapService,
        CountriesService,
        CitiesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
