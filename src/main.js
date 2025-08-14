import { WebGLRenderer, SRGBColorSpace, ACESFilmicToneMapping, Clock } from 'three';
import { createScene } from './scene/createScene.js';
import { createCamera, createControls, fitRoomToView, topDownView, resetCamera } from './system/camera.js';
import { buildRoom } from './scene/Room.js';
import { initPanels } from './ui/panels.js';

const canvas = document.getElementById('c');
const renderer = new WebGLRenderer({ antialias: true, canvas, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = SRGBColorSpace;
renderer.toneMapping = ACESFilmicToneMapping;

const { scene, helpers } = createScene({ showGrid: true, showAxes: true });

const ROOM_SIZE = { width: 12, depth: 10, height: 3 }; // meters
const room = buildRoom(ROOM_SIZE);
scene.add(room.group);

const camera = createCamera();
const controls = createControls(camera, renderer.domElement);
fitRoomToView(camera, controls, room.bounds);

const clock = new Clock();

function resizeRendererToDisplaySize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = (canvas.width !== Math.floor(width * renderer.getPixelRatio())) ||
                     (canvas.height !== Math.floor(height * renderer.getPixelRatio()));
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  controls.update(dt);
  resizeRendererToDisplaySize();
  renderer.render(scene, camera);
}
animate();

// UI wiring
const api = {
  topDown: () => topDownView(camera, controls, room.bounds),
  fit: () => fitRoomToView(camera, controls, room.bounds),
  grid: () => helpers.toggleGrid(),
  axes: () => helpers.toggleAxes(),
  reset: () => resetCamera(camera, controls, room.bounds),
};

initPanels(api);

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
  switch (e.key.toLowerCase()) {
    case 't': api.topDown(); break;
    case 'f': api.fit(); break;
    case 'g': api.grid(); break;
    case 'a': api.axes(); break;
    case 'r': api.reset(); break;
  }
});

// Handle DPR changes (zooming on some devices)
matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener?.('change', () => {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

