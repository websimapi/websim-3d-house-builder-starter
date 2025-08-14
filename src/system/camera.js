import { PerspectiveCamera, Vector3, Box3, MathUtils } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createCamera() {
  const camera = new PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(8, 12, 8);
  camera.up.set(0, 1, 0);
  return camera;
}

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.minDistance = 1.0;
  controls.maxDistance = 200;
  controls.maxPolarAngle = Math.PI; // allow full control, not locking to top-down
  controls.target.set(0, 0, 0);
  controls.update();
  return controls;
}

export function fitRoomToView(camera, controls, bounds) {
  const b = bounds instanceof Box3 ? bounds.clone() : new Box3().copy(bounds);
  const size = b.getSize(new Vector3());
  const center = b.getCenter(new Vector3());

  const maxDim = Math.max(size.x, size.z);
  const fov = camera.fov * (Math.PI / 180);
  // assume viewing from some angle, add padding factor
  const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.2;

  const dir = new Vector3(1, 0.8, 1).normalize();
  const pos = center.clone().addScaledVector(dir, distance * 1.6);
  pos.y = Math.max(pos.y, size.y * 1.5 + 2);

  camera.position.copy(pos);
  controls.target.copy(center.setY(0));
  camera.updateProjectionMatrix();
  controls.update();
}

export function topDownView(camera, controls, bounds) {
  const b = bounds instanceof Box3 ? bounds.clone() : new Box3().copy(bounds);
  const size = b.getSize(new Vector3());
  const center = b.getCenter(new Vector3());
  const radius = Math.max(size.x, size.z) * 0.6;
  const height = Math.max(size.x, size.z) * 2.2;

  camera.position.set(center.x, height, center.z + 0.0001); // tiny z offset to avoid gimbal edge
  controls.target.set(center.x, 0, center.z);
  // Allow near-top orthographic-like feel
  controls.maxPolarAngle = Math.PI; // keep full control
  camera.updateProjectionMatrix();
  controls.update();
}

export function resetCamera(camera, controls, bounds) {
  // Reset to a pleasant isometric-ish angle framing the room
  fitRoomToView(camera, controls, bounds);
  // Restore control limits if changed
  controls.maxPolarAngle = Math.PI;
}

