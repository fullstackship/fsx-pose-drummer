import { Component, OnInit, ElementRef } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'fsx-p5-play',
  templateUrl: './p5-play.component.html',
  styleUrls: ['./p5-play.component.scss']
})
export class P5PlayComponent implements OnInit {

  canvas: any;
  canvasSizeX = 200;
  canvasSizeY = 200;
  sw = 2;
  c = [];
  strokeColor = 0;


  constructor(private el: ElementRef) { }

  ngOnInit(): void {

    const p = new p5(p => {
      p.setup = () => {
        this.setup_p5(p);
      };

      p.draw = () => {
        this.draw(p);
      };

      p.windowResized = () => {
        console.log('windowResized: ',p.windowWidth, p.windowHeight);

        this.canvasSizeX = p.windowWidth - 300;
        this.canvasSizeY = p.windowHeight - 300;
        let sCanvas = p.resizeCanvas(this.canvasSizeX, this.canvasSizeY);
        // https://p5js.org/reference/#/p5/resizeCanvas
        // let sCanvas = p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.mouseReleased = () => {
        console.log('mouseReleased');
        // modulo math forces the color to swap through the array provided
        this.strokeColor = (this.strokeColor + 1) % this.c.length;
        p.stroke(this.c[this.strokeColor]);
        console.log(`color is now ${this.c[this.strokeColor]}`);

      };

      p.keyPressed = () => {
        console.log('keyPressed');
        if (p.key === 'c') {
          window.location.reload();
        }
      };

    }, this.el.nativeElement);

  }

  setup_p5(p) {
    console.log('setup_p5');
    this.canvasSizeX = p.windowWidth - 200;
    this.canvasSizeY = p.windowHeight - 200;

    let sCanvas = p.createCanvas(this.canvasSizeX, this.canvasSizeY);
    sCanvas.parent('sketch-canvas-container');

    //for Drawing

    p.background(255);
    p.strokeWeight(this.sw);

    this.c[0] = p.color(148, 0, 211);
    this.c[1] = p.color(75, 0, 130);
    this.c[2] = p.color(0, 0, 255);
    this.c[3] = p.color(0, 255, 0);
    this.c[4] = p.color(255, 255, 0);
    this.c[5] = p.color(255, 127, 0);
    this.c[6] = p.color(255, 0, 0);

    p.rect(0, 0, p.width, p.height);

    p.stroke(this.c[this.strokeColor]);

  }

  // refreshing every millisecond
  draw(p) {
    // console.log('draw()')

    // p.background('white'); //to clear the canvas
    this.draw_figure(p, 0.2, 0.5, 200.0, 82, 3, 'red');
    this.draw_figure(p, 0.5, 0.5, 50.0, 80, 20, 'blue');
    this.draw_figure(p, 0.8, 0.5, -100.0, 70, 7, 'green');

    //for Drawing
    if (p.mouseIsPressed) {
      if (p.mouseButton === p.LEFT) {
        p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
      } else if (p.mouseButton === p.CENTER) {
        p.background(255);
      }
    }
  }

  polygon(p, x, y, radius, npoints, color) {
    const angle = p.TWO_PI / npoints;
    p.beginShape();
    p.fill(color);
    for (let a = 0; a < p.TWO_PI; a += angle) {
      const sx = x + Math.cos(a) * radius;
      const sy = y + Math.sin(a) * radius;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }
  draw_figure(p, scaleX, scaleY, divisor, radius, npoints, color) {
    p.push();
    p.translate(this.canvasSizeX * scaleX, this.canvasSizeY * scaleY);
    p.rotate(p.frameCount / divisor);
    this.polygon(p, 0, 0, radius, npoints, color);
    p.pop();
  }


}
