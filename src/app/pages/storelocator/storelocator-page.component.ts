import { AgmGeocoder } from '@agm/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoreLocation } from 'ish-core/models/storelocation/storelocation.model';
import { StoresService } from 'ish-core/services/stores/stores.service';

@Component({
  selector: 'ish-storelocator-page',
  styles: [
    `
      agm-map {
        height: 600px;
      }
    `,
  ],
  templateUrl: './storelocator-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorelocatorPageComponent implements OnInit {
  mapCenter = {
    lat: 50.927223,
    lng: 11.586111,
  };

  stores$: Observable<StoreLocation[]>;

  previousInfoWindow;

  constructor(private storesService: StoresService, private geoCoderService: AgmGeocoder) {}

  ngOnInit(): void {
    this.stores$ = this.storesService.getStores();

    this.stores$ = this.stores$.pipe(
      map(stores =>
        stores.map(store => {
          store.location$ = this.geocodeStoreLocation(store);
          return store;
        })
      )
    );
  }

  clickedMarker(infowindow) {
    if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infowindow;
  }

  private geocodeStoreLocation(store: StoreLocation) {
    return this.geoCoderService
      .geocode({
        address: store.address.concat(',', store.city, ',', store.country),
      })
      .pipe(map(results => results[0].geometry.location));
  }
}