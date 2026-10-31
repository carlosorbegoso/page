import { Group, Vector3, type Sprite, type Texture } from 'three';
import { withFluidDisplacement } from '../fx/fluid';
import { tokenColor } from '../tokens';
import { glowSprite, mulberry32, NodeNetwork } from './common';

/** About station: a cluster of stack nodes inside two faint nebula clouds (4 draw calls). */
export class Nebula {
  readonly root = new Group();
  readonly height = 1.6;
  private readonly network: NodeNetwork;
  private readonly clouds: Sprite[];

  constructor(sprite: Texture) {
    const random = mulberry32(53);
    const gaussian = () => (random() + random() + random() - 1.5) / 1.5;
    const points = Array.from({ length: 64 }, () => new Vector3(gaussian() * 1.1, gaussian() * 0.7 + 0.8, gaussian() * 0.8));
    this.network = new NodeNetwork(points, 13, 0.55);
    this.network.addTo(this.root);
    this.clouds = [glowSprite(sprite, 3.6, 0.22), glowSprite(sprite, 2.6, 0.18)];
    this.clouds[0]!.position.set(-0.3, 0.9, -0.4);
    this.clouds[1]!.position.set(0.5, 0.6, 0.1);
    for (const cloud of this.clouds) withFluidDisplacement(cloud.material);
    this.root.add(...this.clouds);
    this.applyTokens();
  }

  setBoost(boost: number): void {
    this.network.setBoost(boost);
  }

  update(time: number, motion: boolean): void {
    if (!motion) return;
    this.root.rotation.y = time * 0.04;
  }

  applyTokens(): void {
    this.network.applyTokens();
    this.clouds[0]!.material.color.copy(tokenColor('--color-scene-node'));
    this.clouds[1]!.material.color.copy(tokenColor('--color-ventixs')).multiplyScalar(0.7);
  }

  dispose(): void {
    this.network.dispose();
    for (const cloud of this.clouds) cloud.material.dispose();
  }
}
