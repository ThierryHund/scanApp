export class ProductData {

  constructor(name: string = '', imageUrl: string = '', novaGroup: string = '') {
    this.name = name;
    this.imageUrl = imageUrl;
    this.novaGroup = novaGroup;
  }

  name: string;
  imageUrl: string;
  novaGroup: string;
}
