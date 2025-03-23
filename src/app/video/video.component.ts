import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],

})
export class VideoComponent implements OnInit {

  showInitialImage: boolean = true;
  isEditing: boolean = false;
  videoSegments = [
    { id: 1, active: false, src: 'assets/video1.mp4', videoEnded: false, showMessage: false, showImage: true, imageSrc: '', videoSrc:'', title: '', message: '' },
    { id: 2, active: false, src: 'assets/video2.mp4', videoEnded: false, showMessage: false, showImage: true, imageSrc: '', videoSrc:'', title: '', message: '' },
    { id: 3, active: false, src: 'assets/video3.mp4', videoEnded: false, showMessage: false, showImage: true, imageSrc: '', videoSrc:'', title: '', message: '' },
    { id: 4, active: false, src: 'assets/video4.mp4', videoEnded: false, showMessage: false, showImage: true, imageSrc: '', videoSrc:'', title: '', message: '' }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadMultimediaData();
  }

 // Cargar los datos de cada franja desde su respectivo JSON
loadMultimediaData() {
  this.videoSegments.forEach((segment, index) => {
    this.http.get<any>(`assets/multimedia_branch${segment.id}.json`).subscribe(data => {
      segment.title = data.title;
      segment.message = data.message;
      segment.imageSrc = this.sanitizeBase64(data.image, 'image/png'); // Convertir imagen base64
      segment.videoSrc = this.sanitizeBase64(data.video, 'video/mp4'); // Convertir video base64
    });
  });
}

// Método para sanear base64
sanitizeBase64(base64Data: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64Data.split(',')[1]}`; 
}

  // Cuando termina un video
  onSegmentVideoEnd(index: number) {
    this.videoSegments[index].active = false; // Oculta el video
    this.videoSegments[index].showMessage = true; // Muestra el mensaje
    setTimeout(() => {
      this.videoSegments[index].showMessage = false; // Oculta el mensaje
      this.videoSegments[index].showImage = true; // Muestra la imagen de nuevo
      this.checkForReturnToInitialImage();
    }, 5000); // Muestra el mensaje por 5 segundos antes de regresar a la imagen
  }

  // Regresar a la imagen inicial si todos los videos y mensajes han terminado
  checkForReturnToInitialImage() {
    const allInactive = this.videoSegments.every(segment => !segment.active && !segment.showMessage);
    console.log("allInactive", allInactive)
    if (allInactive) {
      setTimeout(() => {
        // Ocultar todas las imágenes de los segmentos
        this.videoSegments.forEach(segment => segment.showImage = false);
        this.videoSegments.forEach(segment => segment.active = false);

        // Mostrar la imagen principal
        this.showInitialImage = true;
        this.isEditing = false

      }, 1500);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === '0') {
      // Bloquear si hay videos o mensajes activos
      const someActive = this.videoSegments.some(segment => segment.active || segment.showMessage);
      console.log("someactive", someActive)
      if (someActive) return;

      this.isEditing = true;
      this.videoSegments.forEach(segment => {
        segment.showImage = true;
        segment.active = false;
      });

      setTimeout(() => {
        const someActive = this.videoSegments.some(segment => segment.active || segment.showMessage);
      console.log("someactive2", someActive)
      if (someActive) return;
        this.videoSegments.forEach(segment => {
          segment.showImage = false;
        });
        this.isEditing = false;
        this.showInitialImage = true; // Mostrar la imagen principal
      }, 10000);

    }

    const key = parseInt(event.key, 10);
    if (key >= 1 && key <= 4) {
      this.isEditing = true;
      this.videoSegments.forEach(segment => {
        segment.showImage = true;
        segment.active = false;
      });
     
      const index = key - 1;
      this.videoSegments[index].active = true;
      this.videoSegments[index].showImage = false;
      this.videoSegments[index].videoEnded = false;
      this.videoSegments[index].showMessage = false;
    }

  }
}
