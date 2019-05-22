import { BarCodeReaderComponent } from './../components/bar-code-reader/bar-code-reader.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodFactApiService {
  barcode = '';
  ApiRoot = 'https://fr.openfoodfacts.org/api/v0/produit/';

  constructor(private httpClient: HttpClient) { }

  setBarcode(cb: string) {
    this.barcode = cb;
    console.log(this.barcode, this.ApiRoot)
  }

  getProductData() {
    return this.httpClient.request('GET', this.ApiRoot + this.barcode + '.json', {responseType: 'json'});
  }

}
