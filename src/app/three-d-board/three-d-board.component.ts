import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Input,
  AfterViewInit
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-d-board',
  templateUrl: './three-d-board.component.html',
  styleUrls: ['./three-d-board.component.css']
})
export class ThreeDBoardComponent implements OnInit, AfterViewInit {
  @ViewChild('tdcanvas', { static: true }) tdcanvasRef: ElementRef<HTMLCanvasElement>;

  // Cube properties
  @Input() public rotationSpeedX: number = 0.05
  @Input() public rotationSpeedY: number = 0.05
  @Input() public size: number = 200
  @Input() public texture: string = ''

  // Stage properties
  @Input() public cameraZ: number = 400
  @Input() public fieldOfView: number = 1
  @Input('nearClipping') public nearClippingPlane: number = 1
  @Input('farClipping') public farClippingPlane: number = 1000

  // Helper properties (optional)
  private camera!: THREE.PerspectiveCamera
  private loader = new THREE.TextureLoader()
  private geometry = new THREE.BoxGeometry(1,1,1)
  private material = new THREE.MeshBasicMaterial({color: 0xFF8001}) // map: this.loader.load(this.texture)

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)
  private renderer!: THREE.WebGL1Renderer
  private scene!: THREE.Scene

  constructor() {
  }

  ngOnInit() {

  }

  private get canvas(): HTMLCanvasElement{
    return this.tdcanvasRef.nativeElement
  }

  private createScene(){
    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
    this.scene.add(this.cube)
    // Camera
    let aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ
  }

  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private animateCube(){
    this.cube.rotation.x = 2 //+= this.rotationSpeedX
    this.cube.rotation.y = 1 //+= this.rotationSpeedY
  }

  private startRenderingLoop(){
    // Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGL1Renderer({canvas: this.canvas})
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    let component: ThreeDBoardComponent = this;
    (function render(){
      requestAnimationFrame(render)
      component.animateCube()
      component.renderer.render(component.scene, component.camera)
    }());
  }

  ngAfterViewInit(){
    this.createScene();
    this.startRenderingLoop();
  }

}
