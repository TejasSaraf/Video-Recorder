import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  @ViewChild('recordedVideo') recordedVideoElementRef: ElementRef;
  @ViewChild('video') videoElementRef: ElementRef;

  videoElement: HTMLVideoElement;
  recordedVideoElement: HTMLVideoElement;
  mediaRecorder: MediaRecorder;
  recordedVideo: Blob[] = [];
  isRecording = false;
  downloadUrl: string;
  stream: MediaStream;

  constructor() {}
 
  async ngOnInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 360 }});
      this.videoElement = this.videoElementRef.nativeElement;
      this.recordedVideoElement = this.recordedVideoElementRef.nativeElement;
      this.videoElement.srcObject = this.stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  startRecording() {
    if (!this.stream) {
      console.error('No media stream available.');
      return;
    }

    const options = { mimeType: 'video/webm' };
    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event: any) => {
      if (event.data && event.data.size > 0) {
        this.recordedVideo.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.processRecording();
      // this.stream.getTracks().forEach(track => track.stop());
    };

    this.mediaRecorder.start();
    this.isRecording = true;
  }


  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  playRecording() {
    if (this.recordedVideo.length === 0) {
      console.log('No recording available.');
      return;
    }
    this.recordedVideoElement.play();
  }

  private processRecording() {
    const videoBuffer = new Blob(this.recordedVideo, { type: 'video/webm' });
    this.downloadUrl = URL.createObjectURL(videoBuffer);
    this.recordedVideoElement.src = this.downloadUrl;
  }
}

