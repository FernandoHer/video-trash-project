import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  ngOnInit(): void {
   
  }
 isEditing: boolean = false;
  videoSegments = [
    { active: false, src: 'assets/video1.mp4', videoEnded: false, showMessage: false, message: 'Gracias por ayudar a mejorar el mundo' },
    { active: false, src: 'assets/video2.mp4', videoEnded: false, showMessage: false, message: 'Gracias por tu colaboración' },
    { active: false, src: 'assets/video3.mp4', videoEnded: false, showMessage: false, message: 'Gracias el mundo te lo agradece' },
    { active: false, src: 'assets/video4.mp4', videoEnded: false, showMessage: false, message: 'Gracias ' },
  ];

  // Evento para cuando termina el video inicial
  onVideoEnd() {
    this.resetState();
  }

  // Evento para cuando termina un video de segmento
  onSegmentVideoEnd(index: number) {
    this.videoSegments[index].videoEnded = true;
    this.videoSegments[index].showMessage = true;

    // Mostrar mensaje por 5 segundos
    setTimeout(() => {
      this.videoSegments[index].showMessage = false;
      this.videoSegments[index].active = false; // Desactivar el segmento después del mensaje

      // Verificar si es momento de regresar al video inicial
      this.checkForReturnToInitialVideo();
    }, 5000); // 5 segundos
  }

  // Método para verificar si todos los videos están inactivos y no hay mensajes activos
  checkForReturnToInitialVideo() {
    const noActiveVideos = this.videoSegments.every(segment => !segment.active);
    const noActiveMessages = this.videoSegments.every(segment => !segment.showMessage);

    if (noActiveVideos && noActiveMessages) {
      this.resetState();
    }
  }

  // Método para reiniciar el estado al video inicial
  resetState() {
    this.isEditing = false;
    this.videoSegments.forEach(segment => {
      segment.active = false;
      segment.videoEnded = false;
      segment.showMessage = false;
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;

    if (key === '1' || key === '2' || key === '3' || key === '4') {
      this.isEditing = true;
      const index = parseInt(key, 10) - 1;
      this.videoSegments[index].active = !this.videoSegments[index].active;

      // Reiniciar estados al presionar la tecla
      if (this.videoSegments[index].active) {
        this.videoSegments[index].videoEnded = false;
        this.videoSegments[index].showMessage = false;
      }
    }
  }
}
