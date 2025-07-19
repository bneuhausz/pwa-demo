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

      @if (width || height) {
        <p>
          Video Resolution: {{ width }} x {{ height }}
        </p>
      }

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
  width: number | null = null;
  height: number | null = null;
  private controls?: IScannerControls;

  async startScanner() {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13]);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 200,
    });

    const videoElement = document.getElementById('video') as HTMLVideoElement;

    videoElement.onloadedmetadata = () => {
      console.log('Actual resolution:', videoElement.videoWidth, 'x', videoElement.videoHeight);
      this.width = videoElement.videoWidth;
      this.height = videoElement.videoHeight;
    };

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const rearCamera = devices.find(d => /back|rear|environment/i.test(d.label)) || devices[0];

      const constraints = {
        video: {
          deviceId: rearCamera.deviceId,
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', 'true');
      await videoElement.play();

      const controls = await reader.decodeFromVideoElement(videoElement, (result, error, scannerControls) => {
        if (result) {
          this.scannedResult = result.getText();
          console.log('✅ Scanned:', this.scannedResult);
          scannerControls.stop();
        }
      });
      this.controls = controls;
    } catch (err) {
      console.error('❌ Camera initialization failed:', err);
    }
  }

  ngOnDestroy(): void {
    this.controls?.stop();
  }
}
