import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

@Component({
  selector: 'app-data-matrix-scanner',
  template: `
    <div class="scanner-container">
      <button (click)="startScanner()">Start Scanner</button>

        <video
          #video
          id="video"
          width="320"
          height="480"
          [style.display]="isCameraActive() ? 'block' : 'none'"
          style="border: 1px solid black; margin-top: 1rem;"
          autoplay
          muted
          playsinline
        ></video>     

      @if (width() || height()) {
        <p>
          Video Resolution: {{ width() }} x {{ height() }}
        </p>
      }

      @if (scannedResult()) {
        <p class="result">
          ✅ Scanned Code: {{ scannedResult() }}
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
  readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  scannedResult = signal<string | null>(null);
  isCameraActive = signal<boolean>(false);
  width = signal<number | null>(null);
  height = signal<number | null>(null);
  private controls?: IScannerControls;
  videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');

  async startScanner() {
    if (!this.isBrowser) return;

    this.isCameraActive.set(true);
    this.scannedResult.set(null);

    queueMicrotask(() => {
      setTimeout(() => this.tryStartScanner(), 0);
    });
  }

  private async tryStartScanner() {
    const videoElement = this.videoRef();
    if (!videoElement) {
      console.warn('Video element not yet available');
      return;
    }

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13
    ]);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 200,
    });

    videoElement.nativeElement.onloadedmetadata = () => {
      this.width.set(videoElement.nativeElement.videoWidth);
      this.height.set(videoElement.nativeElement.videoHeight);
    };

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const rearCamera = devices.find(d => /back|rear|environment/i.test(d.label)) || devices[0];

      const constraints = {
        video: {
          deviceId: rearCamera.deviceId,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.nativeElement.srcObject = stream;
      videoElement.nativeElement.setAttribute('playsinline', 'true');
      await videoElement.nativeElement.play();

      const controls = await reader.decodeFromVideoElement(videoElement.nativeElement, (result, error, scannerControls) => {
        if (result) {
          this.scannedResult.set(result.getText());
          this.stopScanner();
        }
      });

      this.controls = controls;
    } catch (err) {
      console.error('❌ Camera initialization failed:', err);
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  stopScanner() {
    if (!this.isBrowser) return;

    this.controls?.stop();
    const videoElement = this.videoRef();
    if (videoElement?.nativeElement.srcObject instanceof MediaStream) {
      videoElement.nativeElement.srcObject.getTracks().forEach(track => track.stop());
      videoElement.nativeElement.srcObject = null;
    }

    this.isCameraActive.set(false);
    this.controls = undefined;
  }
}
