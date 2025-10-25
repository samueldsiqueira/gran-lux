# Funcionalidades Touch para Mobile

## 🎮 Gestos Implementados

### 📚 **Na Biblioteca**

#### Adicionar Itens:
1. **Toque Simples**: Adiciona o item no centro do palco
2. **Arrastar e Soltar**: 
   - Pressione e segure o item
   - Arraste até o palco
   - Solte para posicionar exatamente onde deseja
   - Preview visual durante o arraste

#### Visual Feedback:
- ✅ Item fantasma segue o dedo durante arraste
- ✅ Sombra e opacidade indicam estado de arraste
- ✅ Instrução no topo: "Toque para adicionar ou arraste para o palco"

### 🎨 **No Palco (Stage)**

#### Seleção:
- **Toque simples** no item para selecioná-lo
- Borda azul indica item selecionado
- Painel de propriedades abre automaticamente

#### Movimento:
- **Toque e arraste** para mover itens pelo palco
- Movimento suave e responsivo
- Snap automático em varas (quando próximo)

#### Rotação (2 dedos):
- **Gesto de rotação** com dois dedos
- Rotaciona o item em tempo real
- Útil para ajustar direção de spots e PARs

#### Zoom (Pinch):
- **Beliscar** com dois dedos para zoom in/out
- Zoom mantém centralização
- Range: 25% a 400%

## 🎯 Como Usar

### Adicionar Fixture ao Palco:

**Método 1 - Toque Rápido:**
```
1. Abra 📚 Biblioteca
2. Toque em um equipamento
3. Item aparece no centro do palco
4. Arraste para posicionar
```

**Método 2 - Drag & Drop:**
```
1. Abra 📚 Biblioteca
2. Pressione e segure o equipamento
3. Arraste para o palco
4. Solte no local desejado
5. Sidebar fecha automaticamente
```

### Mover Item:
```
1. Toque no item para selecionar
2. Arraste com 1 dedo
3. Solte para confirmar posição
```

### Girar Item:
```
1. Selecione o item
2. Use 2 dedos em movimento circular
3. O item rotaciona em tempo real
```

### Zoom no Palco:
```
1. Belisque com 2 dedos no palco
2. Afaste para zoom in
3. Aproxime para zoom out
```

### Editar Propriedades:
```
1. Toque no item
2. Abra ⚙️ Propriedades
3. Use o slider de rotação para ajuste fino
4. Edite outros campos conforme necessário
```

## 🔧 Detalhes Técnicos

### Touch Events:
- `onTouchStart`: Inicia gesture
- `onTouchMove`: Rastreia movimento
- `onTouchEnd`: Finaliza e processa ação

### Custom Events:
```javascript
// Fixture dropped from library
window.dispatchEvent(new CustomEvent('fixtureDropped', {
  detail: { fixture, x, y }
}));
```

### Gesture Detection:
- **Tap**: < 300ms, movimento < 10px
- **Long Press**: > 500ms sem movimento
- **Drag**: Movimento > 10px
- **Rotate**: 2 dedos, detecta ângulo
- **Pinch**: 2 dedos, detecta distância

## 📱 Compatibilidade

- ✅ iOS Safari 12+
- ✅ Chrome Android 80+
- ✅ Samsung Internet 12+
- ✅ Firefox Mobile 68+

## ⚡ Performance

- Eventos com `preventDefault()` para evitar scroll
- `touch-action: none` no canvas
- Debounce em gestos complexos
- RAF (requestAnimationFrame) para animações suaves

## 🎨 Visual Feedback

### Durante Arraste:
- Item fantasma translúcido (opacity: 0.7)
- Sombra destacada
- Segue o dedo em tempo real

### Item Selecionado:
- Borda azul (#0ea5e9)
- Controles de transformação visíveis
- Destaque no painel de propriedades

### Hints:
- Mensagem de ajuda na biblioteca
- Feedback visual em todos os toques
- Active states em botões

## 💡 Dicas de UX

1. **Use dois dedos** para gestos avançados (rotação, zoom)
2. **Toque longo** em items pode abrir menu contextual
3. **Sidebar fecha automaticamente** após adicionar item
4. **Selecione antes de rotacionar** para melhor controle
5. **Zoom no palco** facilita posicionamento preciso

## 🔮 Funcionalidades Futuras

- [ ] Menu contextual com toque longo
- [ ] Multi-seleção com tap múltiplo
- [ ] Snap visual durante arraste
- [ ] Gesto de "shake" para desfazer
- [ ] Haptic feedback (vibração)

---

**Desenvolvido com React Touch Events + Konva.js**
