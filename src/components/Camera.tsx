import * as React from 'react';

import '../styles/Camera.css';

interface IState {
  stream: MediaStream | null;
}

class Camera extends React.Component<any, IState> {

  public videoRef = React.createRef<HTMLVideoElement>();
  public canvasRef = React.createRef<HTMLCanvasElement>();
  public canvasContext: CanvasRenderingContext2D | null;

  constructor(props: any) {
    super(props);
    this.state = { stream: null };
  }

  public async componentDidMount() {
    await this.getStream();

    if (this.canvasRef.current) {
      // set up canvas size
      this.canvasRef.current.width = window.innerWidth;
      this.canvasRef.current.height = window.innerHeight;

      // get canvas context
      this.canvasContext = this.canvasRef.current.getContext('2d');
    }
  }

  public async getStream() {
    console.log('here');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    });

    if (this.videoRef.current) {
      this.setState({
        stream
      }, () => {
        if (this.videoRef.current) {
          this.videoRef.current.srcObject = stream;
        }
      })
    }
  }

  getColor = () => {
    if (this.canvasContext && this.videoRef.current && this.canvasRef.current) {
      this.canvasContext.drawImage(this.videoRef.current, 0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
      const data = this.canvasRef.current.toDataURL();

      this.doRequest(data);
    }
  }

  async doRequest(imageData: string) {
    const fullUrl = "https://vision.googleapis.com/v1/images:annotate?key=";

    const requestData = {
      "requests": [
        {
          "image": {
            "content": imageData.split(',')[1]
          },
          "features": [
            {
              "type": "IMAGE_PROPERTIES",
              "maxResults": 1
            }
          ]
        }
      ]
    };

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(requestData)
    });
    const data = await response.json();
    console.log(data);
    this.parseData(data);
  }

  parseData(colorData: any[]) {
    const dominantColor = colorData[0].imagePropertiesAnnotation.dominantColors.colors[0];
    console.log(dominantColor);
  }

  public render() {
    return (
      <div id='camera'>
        <video autoPlay ref={this.videoRef} />
        <canvas id="canvas" ref={this.canvasRef} />

        <div id='colorButtonBlock'>
          <button onClick={this.getColor} id='colorButton'>Get Color</button>
        </div>
      </div>
    )
  }
}

export default Camera;