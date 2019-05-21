import { Component, OnInit, AfterViewInit } from '@angular/core';
import Quagga from 'quagga';

@Component({
  selector: 'app-bar-code-reader',
  templateUrl: './bar-code-reader.component.html',
  styleUrls: ['./bar-code-reader.component.css']
})
export class BarCodeReaderComponent implements OnInit, AfterViewInit{

  //config to double check
  barcode = '';
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
      showPattern: true
  },
  };

  constructor() { }

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

  startScanner() {
    this.barcode = '';

    Quagga.onProcessed((result: any) => this.onProcessed(result));

    Quagga.onDetected((result: any) => this.logCode(result));

    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
      console.log('Barcode: initialization finished. Ready to start');
    });
  }

  private logCode(result) {
    const code = result.codeResult.code;
    if (this.barcode !== code) {
      this.barcode = 'Code-barres EAN : ' + code;
      console.log(this.barcode);
      Quagga.stop();
    }
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.resize, false);
    this.startScanner();

  }


  ngOnInit() {


  }

  resize() {
    let vw = 700 * 0.01;
    if (window.innerWidth < 700) {
      vw = window.innerWidth * 0.01;
    }
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }

}
