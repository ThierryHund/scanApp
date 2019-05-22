import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Quagga from 'quagga';
import { FoodFactApiService } from 'src/app/services/food-fact-api.service';
import { ProductData } from 'src/app/model/productData.model';

@Component({
  selector: 'app-bar-code-reader',
  templateUrl: './bar-code-reader.component.html',
  styleUrls: ['./bar-code-reader.component.css']
})
export class BarCodeReaderComponent implements OnInit, AfterViewInit {

  @ViewChild('inputBarcode') public videoTag: ElementRef;

  //config to double check
  barcode = '';
  finalBarcode = '';
  configQuagga = {
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: '#inputBarcode',
      // constraints: {
      //   width: { min: 640 },
      //   height: { min: 480 },
      //   aspectRatio: { min: 1, max: 100 },
      //   facingMode: 'environment', // or user
      // },
      singleChannel: false // true: only the red color-channel is read
    },
    frequency: 20,
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    locate: true,
    numOfWorkers: navigator.hardwareConcurrency, // 4
    decoder: {
      readers: ['ean_reader']
    },
    debug: {
      drawBoundingBox: true,
      showFrequency: true,
      drawScanline: true,
      showPattern: true,
      showCanvas: true,
      showPatches: true,
      showFoundPatches: true,
      showSkeleton: true,
      showLabels: true,
      showPatchLabels: true,
      showRemainingPatchLabels: true,
      boxFromPatches: {
          showTransformed: true,
          showTransformedBox: true,
          showBB: true
      }
    },
  };
  detectionHash = {};
  // data: any;
  productData: ProductData = new ProductData();
  constructor(private api: FoodFactApiService) { }

  private startScanner() {
    this.barcode = '';
    Quagga.onProcessed((result: any) => this.onProcessed(result));
    Quagga.onDetected((result: any) => this.onDetected(result));
    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
      console.log('Barcode: initialization finished. Ready to start');
    });
  }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    // drawingCanvas.style.display = 'none';
    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
        result.boxes.filter((box) =>  {
          return box !== result.box;
        }).forEach((box) => {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }

  private onDetected(result) {
    const code = result.codeResult.code;
    if (this.barcode !== code) {
      this.barcode = 'Code-barres EAN : ' + code;
      console.log(this.barcode);
    }

    if (typeof this.detectionHash[result.codeResult.code] === 'undefined') {
      this.detectionHash[result.codeResult.code] = 1;
    } else {
      this.detectionHash[result.codeResult.code]++;
    }
    if (this.detectionHash[result.codeResult.code] >= 5) {
      this.detectionHash = {};
      // Quagga.stop();
      console.log(Quagga);
      Quagga.pause();
      this.onSuccess(result.codeResult.code);
    }
  }

  private onSuccess(result) {
    this.finalBarcode = result;
    this.videoTag.nativeElement.children[0].pause();
    this.api.setBarcode(this.finalBarcode);
    this.getProductData();
  }

  getProductData() {
    this.api.getProductData().then( x => this.productData = x);
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.resize, false);
    this.startScanner();
  }

  ngOnInit() {
  }

  resize() {
    const vw = document.documentElement.clientWidth * 0.01;
    // Then we set the value in the --vw custom property to the root of the document
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }

}
