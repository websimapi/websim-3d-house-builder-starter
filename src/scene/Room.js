import {
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Box3,
} from 'three';

export function buildRoom({ width = 10, depth = 8, height = 3 } = {}) {
  const group = new Group();

  // Materials
  const floorMat = new MeshStandardMaterial({ color: 0x9aa6b2, roughness: 0.9, metalness: 0.0 });
  const wallMat = new MeshStandardMaterial({ color: 0xe6e9ef, roughness: 0.95, metalness: 0.0 });

  // Floor
  const floorGeo = new PlaneGeometry(width, depth);
  const floor = new Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = 'Floor';
  group.add(floor);

  // Walls (four planes)
  const wallThicknessVisual = 0.02; // purely visual thickness using double-sided plane look
  const wallGeoW = new PlaneGeometry(depth, height);
  const wallGeoL = new PlaneGeometry(width, height);

  // North wall (positive Z)
  const wallN = new Mesh(wallGeoL, wallMat);
  wallN.position.set(0, height / 2, depth / 2);
  // face inward
  // plane faces positive z by default; rotate to face inward
  wallN.rotateY(Math.PI);
  wallN.castShadow = true;
  wallN.receiveShadow = true;
  wallN.name = 'Wall_North';
  group.add(wallN);

  // South wall (negative Z)
  const wallS = new Mesh(wallGeoL, wallMat);
  wallS.position.set(0, height / 2, -depth / 2);
  wallS.castShadow = true;
  wallS.receiveShadow = true;
  wallS.name = 'Wall_South';
  group.add(wallS);

  // East wall (positive X)
  const wallE = new Mesh(wallGeoW, wallMat);
  wallE.position.set(width / 2, height / 2, 0);
  wallE.rotateY(-Math.PI / 2);
  wallE.castShadow = true;
  wallE.receiveShadow = true;
  wallE.name = 'Wall_East';
  group.add(wallE);

  // West wall (negative X)
  const wallW = new Mesh(wallGeoW, wallMat);
  wallW.position.set(-width / 2, height / 2, 0);
  wallW.rotateY(Math.PI / 2);
  wallW.castShadow = true;
  wallW.receiveShadow = true;
  wallW.name = 'Wall_West';
  group.add(wallW);

  // Bounds used for framing/topdown
  const bounds = new Box3().setFromObject(group);

  return { group, bounds, size: { width, depth, height } };
}

