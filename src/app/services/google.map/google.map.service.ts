import {EventEmitter, Injectable, Output} from '@angular/core';

declare var $: any;

declare var google: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleMapService {

    @Output() setAddress: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.init();
    }

    init() {
        const apiKey = 'AIzaSyCZk5yVYzDxUQdzhC7lrFwjWe7m8u0cv00';
        const url = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + apiKey;
        this.injectScript(url);
    }

    injectScript(url) {
        const el = document.getElementById('analyticsScript');
        if (!el) {
            // $(el).remove();
            const script = document.createElement('script');
            script.type = 'application/javascript';
            script.src = url;
            script.id = 'analyticsScript';
            document.getElementsByTagName('body')[0].appendChild(script);
        }
    }

    getPlaceAutocomplete(element) {
        const autocomplete = new google.maps.places.Autocomplete(element,
            {
                componentRestrictions: { country: 'US' },
                types: 'address'  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            // this.invokeEvent(place);
            console.log('place', place);
        });
    }
}
