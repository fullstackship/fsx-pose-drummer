import { PoseTrainDataComponent } from './../pose-train-data/pose-train-data.component';
import { Component, OnInit, ElementRef, NgZone, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ComponentFactoryResolver, SimpleChanges, SimpleChange } from '@angular/core';
import { DynamicComp } from '../dynamicComp';
import { AnchorDirective } from '@app/shared/components/anchor.directive';
import { NotificationService } from '@app/shared/services/notification.service';
//p5 library
import * as p5 from 'p5';
import { HTMLAudioService } from '@app/core/services/htmlAudio.service';

declare let ml5: any;


/**
 *
 * PoseDrummer Component
 * Please report issues : https://github.com/fullstackship/fsx-pose-drummer
 *
 * @Author : Fullstackship.com
 *
 */

@Component({
  selector: 'fsx-pose-drummer',
  templateUrl: './pose-drummer.component.html',
  styleUrls: ['./pose-drummer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoseDrummerComponent implements OnInit {

  @ViewChild(AnchorDirective, { static: true }) anchor: AnchorDirective;
  // @Output() changeEmit: EventEmitter<string> = new EventEmitter<string>();


  p5; //p5 sketch instance
  canvas: any;
  canvasSizeX = 640;
  canvasSizeY = 480;

  poseNet;
  video;
  pose;
  skeleton;

  nn;
  poseLabel = "";

  currState = 'wating-to-collect';
  targetLabel;

  /* NeuralNetwork Options */
  nn_inputs = 34;
  nn_outputs = 3;

  capturedImages: Array<any> = [];
  nn_data; //NeuralNetworkData.data.raw

  dynamicComponent = PoseTrainDataComponent;
  currComponentRef;
  currData; //data from PoseTrainDataComponent

  //Audio
  files: Array<any> = [];
  state;
  currentFile: any = {};


  @ViewChild('video', { static: true }) public videoEl: ElementRef;
  @ViewChild('p5Container', { static: true }) p5Container: ElementRef;
  @ViewChild('snapCanvas', { static: false }) snapCanvas: ElementRef;

  constructor(
    private notiSV: NotificationService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private zone: NgZone,
    private webAudioSV: HTMLAudioService
  ) {
    // listen to stream state
    this.webAudioSV.getState()
      .subscribe(state => {
        this.state = state;
      });
  };

  ngOnInit(): void {

  };

  ngAfterViewInit() {
    new p5(this.sketch(), this.p5Container.nativeElement);


  }

  ngAfterContentInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {

    //dispose and relase the memory for the model
    if (this.nn !== null && this.nn !== undefined) {
      this.nn.dispose();
    }
  }

  sketch() {
    return p5 => {
      p5.setup = () => {
        this.setup(p5);

      };

      p5.preload = () => {

      };

      p5.draw = () => {
        this.draw(p5);
      };

      p5.windowResized = () => {
        console.log('windowResized: ', p5.windowWidth, p5.windowHeight);

        // this.canvasSizeX = p5.windowWidth - 300;
        // this.canvasSizeY = p5.windowHeight - 300;
        // https://p5js.org/reference/#/p5/resizeCanvas
        let sCanvas = p5.resizeCanvas(this.canvasSizeX, this.canvasSizeY);
      };

      // p5.mouseReleased = () => {
      //   console.log('mouseReleased');


      // };

      p5.keyPressed = () => {
        // console.log('keyPressed');
        if (p5.key === 'r') {
          //window.location.reload();
        } else if (p5.key == 't') {
          // this.nn.normalizeData();
          // this.nn.train({ epochs: 50 }, this.trainFinished);
        } else if (p5.key == 's') {
          //this.nn.saveData();
        } else {
        }
      };

    };
  }

  setup(p5) {
    console.log('setup');
    this.p5 = p5;
    // this.canvasSizeX = p5.windowWidth - 200;
    // this.canvasSizeY = p5.windowHeight - 200;

    let sCanvas = p5.createCanvas(this.canvasSizeX, this.canvasSizeY);
    sCanvas.parent('canvas-container');

    this.video = p5.createCapture(p5.VIDEO);
    this.video.hide();

    console.log("webkitURL: ", webkitURL);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.videoEl.nativeElement.srcObject = stream;
        this.videoEl.nativeElement.play();
      })
        .catch((err) => {
          console.log("getUserMedia Error occred: ", err);
        });
    }



    this.poseNet = ml5.poseNet(this.video, this.modelLoaded);

    //Called every time it gets some pose
    // this.poseNet.on('pose', this.gotPoses);
    this.poseNet.on('pose', (poses) => {
      // console.log('gotPoses: ', poses);
      if (poses.length > 0) {
        this.pose = poses[0].pose;
        this.skeleton = poses[0].skeleton;
        if (this.currState == 'collecting-data') {
          this.SnapshotCanvas();
          let inputs = [];
          for (let i = 0; i < this.pose.keypoints.length; i++) {
            let x = this.pose.keypoints[i].position.x;
            let y = this.pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
          }
          let target = [this.currData.targetLabel];
          // https://github.com/ml5js/ml5-library/blob/development/src/NeuralNetwork/index.js#L166
          this.nn.addData(inputs, target);

        }
      }
    });

    this.createNewNN();

  }


  createNewNN() {

    if (this.nn !== null && this.nn !== undefined) {
      console.log("Dispose the previous NeuralNet");
      this.nn.dispose();
    }

    /**
     *
     *  PoseNet currently detects 17 keypoints
     *  https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
     * https://learn.ml5js.org/docs/#/reference/neural-network
     *
     */
    let options = {
      inputs: this.nn_inputs,
      output: this.nn_outputs,
      task: 'classification',
      debug: true
    };
    // https://github.com/ml5js/ml5-library/blob/development/src/NeuralNetwork/NeuralNetwork.js
    this.nn = ml5.neuralNetwork(options);
    console.log("this.nn : ", this.nn);
  }

  loadData() {
    this.nn.loadData('.json', this.dataLoaded);
  }


  loadPretrainedModel() {
    const modelInfo = {
      model: 'model/model.json',
      metadata: 'model/model_meta.json',
      weights: 'model/model.weights.bin',
    };
    this.nn.load(modelInfo, this.nnLoaded);
  }

  modelLoaded() {
    console.log('PoseNet Now Ready');
  }

  nnLoaded() {
    console.log('Model is loaded!');
    this.classifyPose();
  }

  dataLoaded() {
    this.nn.normalizeData();
    this.nn.train({
      epochs: 50
    }, this.trainFinished);
  }

  downloadModel() {
    this.nn.saveData();
  }


  captureCanvas() {

  }

  autoCollectData() {
    console.log('targetLabel: ', this.currData.targetLabel);

    setTimeout(() => {
      this.notiSV.success("Start Collecting!");
      console.log('Collecting Data...');
      this.currState = 'collecting-data';
      setTimeout(() => {
        console.log('Not Collecting Data!');
        this.currState = 'wating-to-collect';
        console.log(" --> this.nn.neuralNetworkData.data : ", this.nn.neuralNetworkData.data);
        this.notiSV.success("Successfully collected the training data!");
        this.updateJsonData();
      }, 5000);
    }, 100);
  }

  updateJsonData() {
    this.nn_data = JSON.parse(JSON.stringify(Object.assign({}, this.nn.neuralNetworkData.data.raw)));
    // console.log("nn_data: ", this.nn_data);
  }



  SnapshotCanvas() {
    // Issue: Live Video Freezing
    // const snapshot = this.video.get();
    // console.log("manualSnapCanvas()|snapshot: ", snapshot);
    // this.capturedImages.push(snapshot.canvas.toDataURL('image/png'));

    const context = this.snapCanvas.nativeElement.getContext('2d').drawImage(this.videoEl.nativeElement, 0, 0, 80, 60);

    const capturedImage = this.snapCanvas.nativeElement.toDataURL('image/png');

    (<DynamicComp>this.currComponentRef.instance).capturedImage = capturedImage;

    const changes = {
      capturedImage: new SimpleChange('', capturedImage, false)
    };

  }

  addPoseTrainDataComp() {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dynamicComponent);
    const viewContainerRef = this.anchor.viewContainerRef;
    // viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    /* Subscribe an event from a Dynamic Component(PoseTrainDataComponent)  */
    (componentRef.instance as DynamicComp).event.subscribe(
      data => {
        console.log(" data from DynamicComp: ", data);
        this.currComponentRef = componentRef;
        this.currData = data;
        this.autoCollectData();
      }
    );
  }


  startTraining() {
    this.notiSV.success("Start Training!");
    console.log("  -->this.nn: ", this.nn);
    this.nn.normalizeData();
    this.nn.train({ epochs: 50 }, this.trainFinished);
  }

  trainFinished = () => {
    this.notiSV.success("Training Finished!");
    console.log('The Model is trained!');
    console.log("  -->this.nn: ", this.nn);

  };


  startClassifyPose() {
    this.classifyPose();
  }

  classifyPose = () => {
    if (this.pose) {
      let inputs = [];
      for (let i = 0; i < this.pose.keypoints.length; i++) {
        let x = this.pose.keypoints[i].position.x;
        let y = this.pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      this.nn.classify(inputs, this.gotResult);
    } else {
      setTimeout(this.classifyPose, 100);
    }
  };



  gotResult = (err, results) => {
    // console.log("gotResult: ", results);
    if (results && results.length > 0) {
      if (results[0].confidence > 0.75) {
        const currPose = results[0].label.toUpperCase();
        console.log("  --> poseLabel: ", currPose);
        this.playSound(currPose);
      }
    }
    this.classifyPose();
  };

  // TODO: Upgrade to RXJS version and 'hard-coding' labels
  playSound(currPose: string) {
    // console.log("  --> currPose: ", currPose, " | this.poseLabel: ", this.poseLabel);

    const audio1 = 'assets/audio/wav/crash1.wav';
    const audio2 = 'assets/audio/wav/glass1.wav';
    const audio3 = 'assets/audio/wav/snare1.wav';

    if (this.poseLabel != currPose) {
      if (currPose == 'POSE1') {
        this.playPoseAudio(audio1);
      } else if (currPose == 'POSE2') {
        this.playPoseAudio(audio2);
      } else if (currPose == 'POSE3') {
        this.playPoseAudio(audio3);
      }
    }

    this.poseLabel = currPose;
  }

  playPoseAudio(audioSrc: string) {
    console.log("  --> playPoseAudio: ", audioSrc);
    this.stop();
    this.playStream(audioSrc);
    this.play();
  }


  audioPlayTest() {
    this.stop();
    this.playStream('assets/audio/wav/glass1.wav');
    this.play();
  }



  // refreshing every millisecond
  draw(p) {
    // The push() function saves the current drawing style settings and transformations, while pop() restores these settings.
    this.p5.push();
    this.p5.translate(this.video.width, 0);
    this.p5.scale(-1, 1); //Important!

    //Draw an image to the p5.js canvas.
    // https://p5js.org/reference/#/p5/image
    // https://p5js.org/examples/image-load-and-display-image.html
    this.p5.image(this.video, 0, 0, this.video.width, this.video.height);

    if (this.pose) {
      for (let i = 0; i < this.skeleton.length; i++) {
        let a = this.skeleton[i][0];
        let b = this.skeleton[i][1];
        this.p5.strokeWeight(2);
        this.p5.stroke(0);

        this.p5.line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
      for (let i = 0; i < this.pose.keypoints.length; i++) {
        let x = this.pose.keypoints[i].position.x;
        let y = this.pose.keypoints[i].position.y;
        this.p5.fill(0);
        this.p5.stroke(255);
        this.p5.ellipse(x, y, 16, 16);
      }
    }

    this.p5.pop();

    this.p5.fill(255, 0, 255);
    this.p5.noStroke();
    this.p5.textSize(100);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    //this.p5.width/height : System variable that stores the width of the drawing canvas. This value is set by the first parameter of the createCanvas() function.
    this.p5.text(this.poseLabel, this.p5.width / 2, this.p5.height / 2);


  }



  /**
   * Audio Part
   *
   */

  playStream(url) {
    this.webAudioSV.playStream(url)
      .subscribe(events => {
        // listening for fun here
      });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.webAudioSV.stop();
    this.playStream(file.url);
  }

  pause() {
    this.webAudioSV.pause();
  }

  play() {
    this.webAudioSV.play();
  }

  stop() {
    this.webAudioSV.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.webAudioSV.seekTo(change.value);
  }

}
