import {
  Scene,
  Color,
  AmbientLight,
  DirectionalLight,
  GridHelper,
  AxesHelper,
} from 'three';

export function createScene({ showGrid = true, showAxes = true } = {}) {
  const scene = new Scene();
  scene.background = new Color(0x0f1115);

  // Lighting
  const amb = new AmbientLight(0xffffff, 0.5);
  scene.add(amb);

  const sun = new DirectionalLight(0xffffff, 1.0);
  sun.position.set(10, 15, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 50;
  sun.shadow.camera.left = -20;
  sun.shadow.camera.right = 20;
  sun.shadow.camera.top = 20;
  sun.shadow.camera.bottom = -20;
  scene.add(sun);

  // Helpers
  const grid = new GridHelper(100, 100, 0x2b2f3a, 0x1b202b);
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  grid.visible = !!showGrid;
  scene.add(grid);

  const axes = new AxesHelper(2.0);
  axes.visible = !!showAxes;
  scene.add(axes);

  const helpers = {
    toggleGrid() { grid.visible = !grid.visible; },
    toggleAxes() { axes.visible = !axes.visible; },
  };

  return { scene, helpers };
}

