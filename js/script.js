import * as THREE from "three";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const renderer = new THREE.WebGLRenderer();


renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
const axexHelper = new THREE.AxesHelper(3);
scene.add(axexHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff25 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);

const myBox = new THREE.Mesh(new RoundedBoxGeometry(5, 5, 5, 1, 1));
myBox.material = new THREE.MeshStandardMaterial({ color: 0x00ff25, wireframe:false, side: THREE.DoubleSide });
myBox.castShadow = true;
scene.add(myBox)

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: false,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const sphereGeometry = new THREE.SphereGeometry(4, 50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directLight)
// directLight.position.set(-30, 50, 0);
// directLight.castShadow = true;
// directLight.shadow.camera.bottom = -12;

// const directLightHelper = new THREE.DirectionalLightHelper(directLight, 5);
// scene.add(directLightHelper)

// const directLightShadowHelper = new THREE.CameraHelper(directLight.shadow.camera)
// scene.add(directLightShadowHelper)

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

scene.fog = new THREE.Fog(0xffffff, 0, 200);

renderer.setClearColor('skyblue');

const gui = new dat.GUI();

const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

let step = 0;

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
  myBox.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  myBox.rotation.x = time / 1000;
  myBox.rotation.y = time / 1000;
  myBox.position.x = 10 * Math.abs(Math.cos(step))
  myBox.position.y = 10 * Math.abs(Math.cos(step))


  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  spotLightHelper.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
