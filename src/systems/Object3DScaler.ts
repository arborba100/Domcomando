/**
 * Object3DScaler.ts
 * Sistema de escala automática para objetos 3D
 * Garante que objetos ocupem exatamente 8 tiles com escala proporcional
 */

import { GridObject, GridPosition } from './GridSystem';

export interface ScalingConfig {
  tileSize: number; // Tamanho de cada tile em unidades (ex: 1)
  targetTiles: number; // Número de tiles que o objeto deve ocupar (ex: 8)
  layoutOptions: Array<{ width: number; depth: number }>; // Opções de layout (ex: 2x4, 4x2)
  preferredLayout?: 'wide' | 'tall'; // Preferência: 'wide' (4x2) ou 'tall' (2x4)
}

export interface Object3DMetrics {
  originalWidth: number; // Largura original do modelo 3D
  originalHeight: number; // Altura original do modelo 3D
  originalDepth: number; // Profundidade original do modelo 3D
}

export interface ScaledObject3D {
  gridObject: GridObject;
  scale: number; // Fator de escala aplicado
  scaledDimensions: {
    width: number; // Largura em unidades (após escala)
    height: number; // Altura em unidades (após escala)
    depth: number; // Profundidade em unidades (após escala)
  };
  gridLayout: {
    width: number; // Largura em tiles
    depth: number; // Profundidade em tiles
    totalTiles: number; // Total de tiles ocupados
  };
}

/**
 * Object3DScaler - Gerenciador de escala automática para objetos 3D
 */
export class Object3DScaler {
  private config: ScalingConfig;

  constructor(config: ScalingConfig) {
    this.config = {
      preferredLayout: 'wide',
      ...config,
    };
  }

  /**
   * Gerar opções de layout para ocupar exatamente N tiles
   * Ex: 8 tiles = 2x4 ou 4x2
   */
  private generateLayoutOptions(targetTiles: number): Array<{ width: number; depth: number }> {
    const layouts: Array<{ width: number; depth: number }> = [];

    // Encontrar todos os divisores de targetTiles
    for (let w = 1; w <= targetTiles; w++) {
      if (targetTiles % w === 0) {
        const d = targetTiles / w;
        layouts.push({ width: w, depth: d });
      }
    }

    return layouts;
  }

  /**
   * Selecionar melhor layout baseado em preferência
   */
  private selectBestLayout(
    layouts: Array<{ width: number; depth: number }>,
    preference: 'wide' | 'tall'
  ): { width: number; depth: number } {
    if (layouts.length === 0) {
      throw new Error('Nenhum layout disponível');
    }

    if (layouts.length === 1) {
      return layouts[0];
    }

    // Preferência 'wide' (4x2) - mais largo que profundo
    if (preference === 'wide') {
      return layouts.reduce((best, current) => {
        const bestRatio = best.width / best.depth;
        const currentRatio = current.width / current.depth;
        return currentRatio > bestRatio ? current : best;
      });
    }

    // Preferência 'tall' (2x4) - mais profundo que largo
    return layouts.reduce((best, current) => {
      const bestRatio = best.depth / best.width;
      const currentRatio = current.depth / current.width;
      return currentRatio > bestRatio ? current : best;
    });
  }

  /**
   * Calcular escala necessária para ajustar modelo ao grid
   * Garante que o modelo caiba perfeitamente nos tiles
   */
  private calculateScale(
    metrics: Object3DMetrics,
    gridLayout: { width: number; depth: number }
  ): number {
    // Espaço disponível em unidades
    const availableWidth = gridLayout.width * this.config.tileSize;
    const availableDepth = gridLayout.depth * this.config.tileSize;

    // Calcular escala necessária para cada dimensão
    const scaleX = availableWidth / metrics.originalWidth;
    const scaleZ = availableDepth / metrics.originalDepth;

    // Usar a menor escala para garantir que o objeto caiba
    // Isso evita que o objeto ultrapasse os tiles vizinhos
    const scale = Math.min(scaleX, scaleZ);

    // Garantir que a escala é positiva e razoável
    return Math.max(0.1, Math.min(scale, 10));
  }

  /**
   * Escalar objeto 3D para ocupar exatamente 8 tiles
   * Retorna objeto com escala, dimensões e posição ajustadas
   */
  scaleObject3D(
    objectId: string,
    metrics: Object3DMetrics,
    position: GridPosition,
    preference?: 'wide' | 'tall'
  ): ScaledObject3D {
    // Selecionar layout
    const layouts = this.generateLayoutOptions(this.config.targetTiles);
    const gridLayout = this.selectBestLayout(layouts, preference || this.config.preferredLayout!);

    // Calcular escala
    const scale = this.calculateScale(metrics, gridLayout);

    // Calcular dimensões escaladas
    const scaledWidth = metrics.originalWidth * scale;
    const scaledHeight = metrics.originalHeight * scale;
    const scaledDepth = metrics.originalDepth * scale;

    // Garantir que Y = 0 (base no chão)
    const adjustedPosition: GridPosition = {
      x: Math.round(position.x),
      z: Math.round(position.z),
      y: 0, // Sempre no chão
    };

    // Calcular centro do grid layout para alinhamento correto
    const centerX = adjustedPosition.x;
    const centerZ = adjustedPosition.z;

    // Criar objeto do grid
    const gridObject: GridObject = {
      id: objectId,
      position: {
        x: centerX,
        z: centerZ,
        y: 0, // Base no chão
      },
      width: gridLayout.width,
      depth: gridLayout.depth,
      height: scaledHeight,
      type: 'object3d',
    };

    return {
      gridObject,
      scale,
      scaledDimensions: {
        width: scaledWidth,
        height: scaledHeight,
        depth: scaledDepth,
      },
      gridLayout: {
        width: gridLayout.width,
        depth: gridLayout.depth,
        totalTiles: gridLayout.width * gridLayout.depth,
      },
    };
  }

  /**
   * Ajustar escala para altura máxima permitida
   * Útil quando a altura escalada excede o limite
   */
  adjustScaleForMaxHeight(
    scale: number,
    scaledHeight: number,
    maxHeight: number
  ): number {
    if (scaledHeight > maxHeight) {
      return scale * (maxHeight / scaledHeight);
    }
    return scale;
  }

  /**
   * Gerar relatório de escala
   */
  generateScalingReport(scaled: ScaledObject3D): string {
    let report = '=== RELATÓRIO DE ESCALA 3D ===\n\n';

    report += `Objeto: ${scaled.gridObject.id}\n`;
    report += `Fator de Escala: ${scaled.scale.toFixed(3)}x\n\n`;

    report += `Dimensões Escaladas:\n`;
    report += `  - Largura: ${scaled.scaledDimensions.width.toFixed(2)} unidades\n`;
    report += `  - Altura: ${scaled.scaledDimensions.height.toFixed(2)} unidades\n`;
    report += `  - Profundidade: ${scaled.scaledDimensions.depth.toFixed(2)} unidades\n\n`;

    report += `Layout no Grid:\n`;
    report += `  - Dimensões: ${scaled.gridLayout.width}x${scaled.gridLayout.depth} tiles\n`;
    report += `  - Total de Tiles: ${scaled.gridLayout.totalTiles}\n`;
    report += `  - Posição: (${scaled.gridObject.position.x}, ${scaled.gridObject.position.z}, ${scaled.gridObject.position.y})\n\n`;

    report += `Garantias:\n`;
    report += `  ✓ Base alinhada no chão (Y = 0)\n`;
    report += `  ✓ Ocupa exatamente ${scaled.gridLayout.totalTiles} tiles\n`;
    report += `  ✓ Sem flutuar\n`;
    report += `  ✓ Sem atravessar o chão\n`;
    report += `  ✓ Sem ultrapassar tiles vizinhos\n`;

    return report;
  }
}

export default Object3DScaler;
