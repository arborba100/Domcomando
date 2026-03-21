/**
 * Object3DScalerExample.ts
 * Exemplos práticos de uso do Object3DScaler
 * Demonstra como escalar objetos 3D para ocupar exatamente 8 tiles
 */

import { Object3DScaler, Object3DMetrics, ScaledObject3D } from './Object3DScaler';
import { GridSystem, GridPosition } from './GridSystem';
import { SpatialValidator } from './SpatialValidator';
import { ObjectPositioner } from './ObjectPositioner';

/**
 * Exemplo 1: Escalar um objeto 3D simples
 * Um prédio que deve ocupar 8 tiles (2x4 ou 4x2)
 */
export function example1_ScaleSimpleBuilding() {
  // Configurar scaler para 8 tiles
  const scaler = new Object3DScaler({
    tileSize: 1, // Cada tile = 1 unidade
    targetTiles: 8, // Ocupar exatamente 8 tiles
    layoutOptions: [
      { width: 2, depth: 4 }, // 2x4
      { width: 4, depth: 2 }, // 4x2
    ],
    preferredLayout: 'wide', // Preferir 4x2 (mais largo)
  });

  // Métricas do modelo 3D original
  const metrics: Object3DMetrics = {
    originalWidth: 4, // Largura original do modelo
    originalHeight: 3, // Altura original do modelo
    originalDepth: 2, // Profundidade original do modelo
  };

  // Posição desejada no grid
  const position: GridPosition = {
    x: 10,
    z: 10,
    y: 0, // Sempre no chão
  };

  // Escalar objeto
  const scaled = scaler.scaleObject3D('building_001', metrics, position, 'wide');

  console.log('=== EXEMPLO 1: Escalar Prédio ===');
  console.log(scaler.generateScalingReport(scaled));

  return scaled;
}

/**
 * Exemplo 2: Escalar múltiplos objetos com layouts diferentes
 */
export function example2_ScaleMultipleObjects() {
  const scaler = new Object3DScaler({
    tileSize: 1,
    targetTiles: 8,
    layoutOptions: [
      { width: 2, depth: 4 },
      { width: 4, depth: 2 },
    ],
  });

  // Objeto 1: Preferir layout largo (4x2)
  const metrics1: Object3DMetrics = {
    originalWidth: 4,
    originalHeight: 2,
    originalDepth: 2,
  };

  const scaled1 = scaler.scaleObject3D('building_001', metrics1, { x: 5, z: 5, y: 0 }, 'wide');

  // Objeto 2: Preferir layout alto (2x4)
  const metrics2: Object3DMetrics = {
    originalWidth: 2,
    originalHeight: 3,
    originalDepth: 4,
  };

  const scaled2 = scaler.scaleObject3D('building_002', metrics2, { x: 15, z: 15, y: 0 }, 'tall');

  console.log('=== EXEMPLO 2: Múltiplos Objetos ===');
  console.log('Objeto 1 (Largo):');
  console.log(scaler.generateScalingReport(scaled1));
  console.log('\nObjeto 2 (Alto):');
  console.log(scaler.generateScalingReport(scaled2));

  return [scaled1, scaled2];
}

/**
 * Exemplo 3: Integração completa com GridSystem e validação
 */
export function example3_FullIntegration() {
  // Criar grid
  const gridSystem = new GridSystem({
    tileSize: 1,
    platformWidth: 50,
    platformDepth: 50,
    platformY: 0,
    maxObjectHeight: 10,
  });

  // Criar validador e posicionador
  const validator = new SpatialValidator(gridSystem);
  const positioner = new ObjectPositioner(gridSystem, validator);

  // Criar scaler
  const scaler = new Object3DScaler({
    tileSize: 1,
    targetTiles: 8,
    layoutOptions: [
      { width: 2, depth: 4 },
      { width: 4, depth: 2 },
    ],
    preferredLayout: 'wide',
  });

  // Métricas do modelo 3D
  const metrics: Object3DMetrics = {
    originalWidth: 4,
    originalHeight: 2.5,
    originalDepth: 2,
  };

  // Escalar objeto
  const scaled = scaler.scaleObject3D('building_001', metrics, { x: 10, z: 10, y: 0 });

  // Validar objeto escalado
  const validation = validator.validateObject(scaled.gridObject);

  // Posicionar objeto
  const placement = positioner.placeObject(scaled.gridObject, {
    validateBeforePlace: true,
    throwOnError: false,
  });

  console.log('=== EXEMPLO 3: Integração Completa ===');
  console.log('Escala:');
  console.log(scaler.generateScalingReport(scaled));
  console.log('\nValidação:');
  console.log(`Válido: ${validation.isValid}`);
  if (!validation.isValid) {
    console.log('Erros:', validation.errors);
  }
  console.log('\nPosicionamento:');
  console.log(`Sucesso: ${placement.success}`);
  if (placement.success) {
    console.log(positioner.generatePositioningReport());
  }

  return { scaled, validation, placement };
}

/**
 * Exemplo 4: Ajustar escala para altura máxima
 */
export function example4_AdjustForMaxHeight() {
  const scaler = new Object3DScaler({
    tileSize: 1,
    targetTiles: 8,
    layoutOptions: [
      { width: 2, depth: 4 },
      { width: 4, depth: 2 },
    ],
  });

  const metrics: Object3DMetrics = {
    originalWidth: 4,
    originalHeight: 5, // Altura original
    originalDepth: 2,
  };

  // Escalar normalmente
  const scaled = scaler.scaleObject3D('building_001', metrics, { x: 10, z: 10, y: 0 });

  console.log('=== EXEMPLO 4: Ajustar para Altura Máxima ===');
  console.log(`Escala original: ${scaled.scale.toFixed(3)}x`);
  console.log(`Altura escalada: ${scaled.scaledDimensions.height.toFixed(2)} unidades`);

  // Ajustar para altura máxima de 8 unidades
  const maxHeight = 8;
  const adjustedScale = scaler.adjustScaleForMaxHeight(
    scaled.scale,
    scaled.scaledDimensions.height,
    maxHeight
  );

  console.log(`\nAltura máxima permitida: ${maxHeight} unidades`);
  console.log(`Escala ajustada: ${adjustedScale.toFixed(3)}x`);
  console.log(`Nova altura: ${(scaled.scaledDimensions.height * (adjustedScale / scaled.scale)).toFixed(2)} unidades`);

  return { original: scaled, adjustedScale };
}

/**
 * Exemplo 5: Diferentes tamanhos de objetos (4, 8, 12, 16 tiles)
 */
export function example5_DifferentSizes() {
  console.log('=== EXEMPLO 5: Diferentes Tamanhos ===\n');

  const sizes = [4, 8, 12, 16];

  sizes.forEach((targetTiles) => {
    const scaler = new Object3DScaler({
      tileSize: 1,
      targetTiles,
      layoutOptions: [], // Será gerado automaticamente
    });

    const metrics: Object3DMetrics = {
      originalWidth: 2,
      originalHeight: 2,
      originalDepth: 2,
    };

    const scaled = scaler.scaleObject3D(`object_${targetTiles}`, metrics, { x: 0, z: 0, y: 0 });

    console.log(`Tamanho: ${targetTiles} tiles (${scaled.gridLayout.width}x${scaled.gridLayout.depth})`);
    console.log(`Escala: ${scaled.scale.toFixed(3)}x`);
    console.log(`Dimensões: ${scaled.scaledDimensions.width.toFixed(2)} x ${scaled.scaledDimensions.height.toFixed(2)} x ${scaled.scaledDimensions.depth.toFixed(2)}\n`);
  });
}

// Executar exemplos (comentar/descomentar conforme necessário)
if (typeof window !== 'undefined') {
  // Apenas em ambiente de browser
  console.log('Object3DScaler Examples loaded');
}
