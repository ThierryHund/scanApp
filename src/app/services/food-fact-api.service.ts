import { BarCodeReaderComponent } from './../components/bar-code-reader/bar-code-reader.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductData } from '../model/productData.model';

@Injectable({
  providedIn: 'root'
})
export class FoodFactApiService {
  barcode = '';
  ApiRoot = 'https://fr.openfoodfacts.org/api/v0/produit/';
  productData: ProductData;
  constructor(private httpClient: HttpClient) { }

  setBarcode(cb: string) {
    this.barcode = cb;
    console.log(this.barcode, this.ApiRoot)
  }

  async getProductData() {
    await this.httpClient.get<ProductData>(this.ApiRoot + this.barcode + '.json')
    .toPromise()
    .then((data: ProductData) => this.productData = {
      name: data['product']['name'],
      novaGroup: data['product']['nova_group'],
      imageUrl: data['product']['selected_images']['front']['thumb']['fr']
    });
    return this.productData;
  }

}
