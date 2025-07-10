import { Component, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

@Component({
  selector: 'app-data-matrix-scanner',
  template: `
    <div class="scanner-container">
      <button (click)="startScanner()">Start Scanner</button>

      <video
        id="video"
        width="400"
        height="300"
        style="border: 1px solid black; margin-top: 1rem;"
        autoplay
        muted
        playsinline
      ></video>

      @if (scannedResult) {
        <p class="result">
          ✅ Scanned Code: {{ scannedResult }}
        </p>
      }
    </div>
  `,
  styles: [`
    .scanner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .result {
      margin-top: 1rem;
      font-weight: bold;
      color: green;
    }
  `],
})
export default class DataMatrixScannerComponent implements OnDestroy {
  scannedResult: string | null = null;
  private controls?: IScannerControls;

  startScanner() {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX]);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 300,
    });

    const videoElement = document.getElementById('video') as HTMLVideoElement;

    reader.decodeFromVideoDevice(undefined, videoElement, (result, error, controls) => {
      this.controls = controls;

      if (result) {
        this.scannedResult = result.getText();
        console.log('✅ Scanned Data Matrix:', this.scannedResult);
        controls.stop();
      }
    });
  }

  ngOnDestroy(): void {
    this.controls?.stop();
  }
}
