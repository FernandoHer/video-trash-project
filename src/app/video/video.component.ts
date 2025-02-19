import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  showInitialImage: boolean = true; // Imagen principal al inicio
  showInitialVideo: boolean = false; // Video principal después de la imagen
  isEditing: boolean = false; // Control de segmentos activos

  videoSegments = [
    { active: false, src: 'assets/video1.mp4', videoEnded: false, showMessage: false, showImage: false, imageSrc: 'assets/reciclaje1.jpeg', message: 'Gracias por ayudar a mejorar el mundo' },
    { active: false, src: 'assets/video2.mp4', videoEnded: false, showMessage: false, showImage: false, imageSrc: 'assets/reciclaje2.jpeg', message: 'Gracias por tu colaboración' },
    { active: false, src: 'assets/video3.mp4', videoEnded: false, showMessage: false, showImage: false, imageSrc: 'assets/reciclaje3.jpeg', message: 'Gracias el mundo te lo agradece' },
    { active: false, src: 'assets/video4.mp4', videoEnded: false, showMessage: false, showImage: false, imageSrc: 'assets/reciclaje4.jpeg', message: 'Gracias' },
  ];

  ngOnInit(): void {
    this.startInitialImage();
  }

  // Muestra la imagen inicial por 10 segundos antes del video principal
  startInitialImage() {
    this.showInitialImage = true;
    this.showInitialVideo = false;
    this.isEditing = false;

    setTimeout(() => {
      this.showInitialImage = false;
      this.showInitialVideo = true;
    }, 5000); // 10 segundos
  }

  // Evento cuando termina un video de segmento
  onSegmentVideoEnd(index: number) {
    this.videoSegments[index].videoEnded = true;
    this.videoSegments[index].showMessage = true;

    // Mostrar mensaje por 5 segundos y luego la imagen del segmento
    setTimeout(() => {
      this.videoSegments[index].showMessage = false;
      this.videoSegments[index].showImage = true;
      this.videoSegments[index].active = false;

      // Verificar si todos los segmentos han terminado
      this.checkForReturnToInitial();
    }, 5000);
  }

  // Verifica si todos los segmentos han terminado para regresar al estado inicial
  checkForReturnToInitial() {
    const allVideosFinished = this.videoSegments.every(segment => segment.videoEnded);
    if (!allVideosFinished) {
      setTimeout(() => {
        this.startInitialImage();
        this.videoSegments.forEach(segment => {
          segment.videoEnded = false;
          segment.showImage = false;
        });
      }, 5000); // 5 segundos después de que se muestren todas las imágenes
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;

    if (this.videoSegments.some(segment => segment.active || segment.showMessage)) {
      return;
    }

    if (key === '0') {
      this.isEditing = true;
      this.videoSegments.forEach(segment => {
        segment.showImage = true;
        segment.active = false;
        segment.showMessage = false;
      });

      // Si en 10 segundos no se presiona otra tecla, mostrar el video inicial
      setTimeout(() => {
        if (!this.videoSegments.some(seg => seg.active)) {
          this.startInitialImage();
        }
      }, 5000);
    }

    if (['1', '2', '3', '4'].includes(key)) {
      this.isEditing = true;
      const index = parseInt(key, 10) - 1;

      this.videoSegments[index].active = true;
      this.videoSegments[index].videoEnded = false;
      this.videoSegments[index].showMessage = false;
      this.videoSegments[index].showImage = false;

      // Los segmentos que no están activos deben mostrar su imagen
      this.videoSegments.forEach((segment, i) => {
        if (i !== index && !segment.active) {
          segment.showImage = true;
        }
      });
    }
  }
}
