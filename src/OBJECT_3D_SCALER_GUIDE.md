# Object3DScaler - Guia Completo

## 📋 Visão Geral

O `Object3DScaler` é um sistema de escala automática para objetos 3D que garante:

✅ **Ocupação exata de 8 tiles** (ou qualquer número configurável)
✅ **Base alinhada no chão** (Y = 0)
✅ **Sem flutuar** - objeto sempre apoiado
✅ **Sem atravessar o chão** - Y nunca negativo
✅ **Sem ultrapassar tiles vizinhos** - escala ajustada proporcionalmente
✅ **Layout automático** - escolhe 2x4 ou 4x2 (melhor encaixe visual)

---

## 🎯 Características Principais

### 1. **Escala Automática Proporcional**
- Calcula fator de escala baseado no tamanho do modelo 3D
- Ajusta proporções mantendo aspecto visual correto
- Garante que o modelo cabe perfeitamente nos tiles

### 2. **Layout Inteligente**
- Gera automaticamente opções de layout (2x4, 4x2, etc)
- Seleciona melhor layout baseado em preferência
- Suporta preferência 'wide' (4x2) ou 'tall' (2x4)

### 3. **Validação Integrada**
- Funciona com `GridSystem` e `SpatialValidator`
- Garante que objeto escalado é válido no grid
- Previne sobreposições e violações de limites

### 4. **Relatórios Detalhados**
- Gera relatórios de escala e posicionamento
- Mostra dimensões escaladas e layout
- Confirma todas as garantias

---

## 📦 Instalação e Importação

```typescript
import { Object3DScaler, type Object3DMetrics, type ScaledObject3D } from '@/systems';
```

---

## 🚀 Uso Básico

### Exemplo 1: Escalar um Objeto Simples

```typescript
// 1. Criar scaler configurado para 8 tiles
const scaler = new Object3DScaler({
  tileSize: 1,           // Cada tile = 1 unidade
  targetTiles: 8,        // Ocupar exatamente 8 tiles
  layoutOptions: [
    { width: 2, depth: 4 },  // 2x4
    { width: 4, depth: 2 },  // 4x2
  ],
  preferredLayout: 'wide',   // Preferir 4x2 (mais largo)
});

// 2. Definir métricas do modelo 3D original
const metrics: Object3DMetrics = {
  originalWidth: 4,    // Largura original do modelo
  originalHeight: 3,   // Altura original do modelo
  originalDepth: 2,    // Profundidade original do modelo
};

// 3. Definir posição desejada
const position = {
  x: 10,  // Posição X no grid
  z: 10,  // Posição Z no grid
  y: 0,   // Sempre no chão
};

// 4. Escalar objeto
const scaled = scaler.scaleObject3D('building_001', metrics, position, 'wide');

// 5. Usar resultado
console.log(`Fator de escala: ${scaled.scale}x`);
console.log(`Dimensões escaladas: ${scaled.scaledDimensions.width} x ${scaled.scaledDimensions.height} x ${scaled.scaledDimensions.depth}`);
console.log(`Layout: ${scaled.gridLayout.width}x${scaled.gridLayout.depth} tiles`);
```

### Exemplo 2: Aplicar Escala em Three.js

```typescript
import * as THREE from 'three';

// Carregar modelo 3D
const model = await loader.loadAsync('model.gltf');

// Escalar objeto
const scaled = scaler.scaleObject3D('building_001', metrics, position);

// Aplicar escala ao modelo Three.js
model.scale.set(scaled.scale, scaled.scale, scaled.scale);

// Garantir que base está no chão (Y = 0)
model.position.y = 0;

// Posicionar no grid
const worldPos = gridSystem.gridToWorld(scaled.gridObject.position.x, scaled.gridObject.position.z);
model.position.x = worldPos.x;
model.position.z = worldPos.z;

scene.add(model);
```

---

## 🔧 Configuração Avançada

### Diferentes Tamanhos de Objetos

```typescript
// Para 4 tiles (2x2)
const scaler4 = new Object3DScaler({
  tileSize: 1,
  targetTiles: 4,
  layoutOptions: [
    { width: 2, depth: 2 },
  ],
});

// Para 12 tiles (3x4)
const scaler12 = new Object3DScaler({
  tileSize: 1,
  targetTiles: 12,
  layoutOptions: [
    { width: 3, depth: 4 },
    { width: 4, depth: 3 },
  ],
});

// Para 16 tiles (4x4)
const scaler16 = new Object3DScaler({
  tileSize: 1,
  targetTiles: 16,
  layoutOptions: [
    { width: 4, depth: 4 },
  ],
});
```

### Ajustar Escala para Altura Máxima

```typescript
const scaled = scaler.scaleObject3D('building_001', metrics, position);

// Se altura escalada exceder limite, ajustar
const maxHeight = 8;
const adjustedScale = scaler.adjustScaleForMaxHeight(
  scaled.scale,
  scaled.scaledDimensions.height,
  maxHeight
);

// Aplicar escala ajustada
model.scale.set(adjustedScale, adjustedScale, adjustedScale);
```

---

## 📊 Estrutura de Dados

### Object3DMetrics
```typescript
interface Object3DMetrics {
  originalWidth: number;   // Largura original do modelo 3D
  originalHeight: number;  // Altura original do modelo 3D
  originalDepth: number;   // Profundidade original do modelo 3D
}
```

### ScaledObject3D
```typescript
interface ScaledObject3D {
  gridObject: GridObject;  // Objeto do grid com posição e dimensões
  scale: number;           // Fator de escala (ex: 0.5, 1.0, 2.0)
  scaledDimensions: {
    width: number;         // Largura em unidades (após escala)
    height: number;        // Altura em unidades (após escala)
    depth: number;         // Profundidade em unidades (após escala)
  };
  gridLayout: {
    width: number;         // Largura em tiles
    depth: number;         // Profundidade em tiles
    totalTiles: number;    // Total de tiles ocupados
  };
}
```

---

## ✅ Garantias e Validações

### Garantias Automáticas

1. **Base no Chão (Y = 0)**
   - Objeto sempre apoiado na plataforma
   - Nunca flutua acima do chão
   - Nunca atravessa o chão

2. **Ocupação Exata**
   - Ocupa exatamente o número de tiles configurado
   - Layout otimizado (2x4 ou 4x2 para 8 tiles)
   - Sem espaços vazios ou sobreposições

3. **Sem Ultrapassar Tiles Vizinhos**
   - Escala ajustada proporcionalmente
   - Respeita limites de cada tile
   - Alinhamento perfeito ao grid

### Validação com GridSystem

```typescript
import { GridSystem, SpatialValidator, ObjectPositioner } from '@/systems';

// Criar grid e validador
const gridSystem = new GridSystem({
  tileSize: 1,
  platformWidth: 50,
  platformDepth: 50,
  platformY: 0,
  maxObjectHeight: 10,
});

const validator = new SpatialValidator(gridSystem);
const positioner = new ObjectPositioner(gridSystem, validator);

// Escalar objeto
const scaled = scaler.scaleObject3D('building_001', metrics, position);

// Validar objeto escalado
const validation = validator.validateObject(scaled.gridObject);
console.log(`Válido: ${validation.isValid}`);
if (!validation.isValid) {
  console.log('Erros:', validation.errors);
}

// Posicionar objeto
const placement = positioner.placeObject(scaled.gridObject);
console.log(`Posicionado: ${placement.success}`);
```

---

## 📈 Exemplos Práticos

### Exemplo 1: Prédio Comercial

```typescript
const scaler = new Object3DScaler({
  tileSize: 1,
  targetTiles: 8,
  preferredLayout: 'wide', // Prédio largo
});

const metrics: Object3DMetrics = {
  originalWidth: 6,
  originalHeight: 4,
  originalDepth: 3,
};

const scaled = scaler.scaleObject3D('building_shop', metrics, { x: 20, z: 20, y: 0 });
// Resultado: 4x2 tiles, escala ~0.67x
```

### Exemplo 2: Torre Residencial

```typescript
const scaler = new Object3DScaler({
  tileSize: 1,
  targetTiles: 8,
  preferredLayout: 'tall', // Torre alta
});

const metrics: Object3DMetrics = {
  originalWidth: 2,
  originalHeight: 6,
  originalDepth: 4,
};

const scaled = scaler.scaleObject3D('building_tower', metrics, { x: 30, z: 30, y: 0 });
// Resultado: 2x4 tiles, escala ~1.0x
```

### Exemplo 3: Monumento Grande

```typescript
const scaler = new Object3DScaler({
  tileSize: 1,
  targetTiles: 16,
  preferredLayout: 'wide',
});

const metrics: Object3DMetrics = {
  originalWidth: 8,
  originalHeight: 5,
  originalDepth: 4,
};

const scaled = scaler.scaleObject3D('monument', metrics, { x: 40, z: 40, y: 0 });
// Resultado: 4x4 tiles, escala ~1.0x
```

---

## 🐛 Troubleshooting

### Problema: Objeto muito pequeno
**Solução:** Aumentar `targetTiles` ou reduzir `originalWidth/Depth`

### Problema: Objeto muito grande
**Solução:** Diminuir `targetTiles` ou aumentar `originalWidth/Depth`

### Problema: Altura excede limite
**Solução:** Usar `adjustScaleForMaxHeight()` para reduzir escala

### Problema: Layout não é o esperado
**Solução:** Usar parâmetro `preference` ('wide' ou 'tall') ao chamar `scaleObject3D()`

---

## 📚 Referência Completa

### Métodos Principais

```typescript
// Escalar objeto 3D
scaleObject3D(
  objectId: string,
  metrics: Object3DMetrics,
  position: GridPosition,
  preference?: 'wide' | 'tall'
): ScaledObject3D

// Ajustar escala para altura máxima
adjustScaleForMaxHeight(
  scale: number,
  scaledHeight: number,
  maxHeight: number
): number

// Gerar relatório
generateScalingReport(scaled: ScaledObject3D): string
```

---

## 🎓 Conclusão

O `Object3DScaler` simplifica o processo de escalar objetos 3D para ocupar exatamente o número de tiles desejado, garantindo:

- ✅ Posicionamento correto no grid
- ✅ Escala proporcional e visual
- ✅ Base sempre no chão
- ✅ Sem violações de limites
- ✅ Layout otimizado

Use este sistema para garantir que todos os seus objetos 3D sejam posicionados corretamente no seu mundo de grid!
