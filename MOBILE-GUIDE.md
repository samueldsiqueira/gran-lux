# Guia de Uso em Dispositivos Móveis

## 📱 Melhorias de Responsividade

Este projeto foi otimizado para funcionar em celulares e tablets com as seguintes funcionalidades:

### ✨ Recursos Mobile

#### 1. **Layout Responsivo**
- **Desktop (>1024px)**: Layout de 3 colunas (Biblioteca | Canvas | Propriedades)
- **Tablet (768px-1024px)**: Layout de 3 colunas com larguras reduzidas
- **Mobile (<768px)**: Layout de 1 coluna com painéis deslizantes

#### 2. **Painéis Deslizantes**
Em dispositivos móveis, os painéis laterais ficam ocultos e podem ser acessados através de botões:
- **📚 Biblioteca**: Botão na parte inferior para abrir a biblioteca de fixtures
- **⚙️ Propriedades**: Botão na parte inferior para abrir o painel de propriedades

#### 3. **Interação por Toque**
- Todos os botões têm altura mínima de 44px para facilitar o toque
- Gestos de arraste funcionam nativamente no canvas
- Pinch-to-zoom suportado no stage

#### 4. **Otimizações de Tela**
- **Fontes reduzidas** em telas pequenas para melhor legibilidade
- **Espaçamentos ajustados** para economizar espaço
- **Grids adaptáveis** que reorganizam os itens conforme o tamanho da tela

### 📐 Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) { ... }

/* Mobile Landscape */
@media (max-width: 768px) { ... }

/* Mobile Portrait */
@media (max-width: 480px) { ... }
```

### 🎯 Como Usar no Mobile

1. **Adicionar Fixtures**:
   - Toque no botão "📚 Biblioteca"
   - Selecione um fixture
   - Toque para adicionar ao canvas
   - Feche o painel tocando fora dele

2. **Editar Propriedades**:
   - Toque em um fixture no canvas
   - Toque no botão "⚙️ Propriedades"
   - Edite as propriedades desejadas
   - Feche o painel tocando fora dele

3. **Movimentar Fixtures**:
   - Toque e arraste os fixtures no canvas
   - Use dois dedos para zoom (pinch)
   - Use pan (arrastar com um dedo no fundo) para mover o canvas

### 🔧 Configurações Técnicas

#### Viewport Meta Tag
```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}
```

#### CSS Touch-Friendly
```css
@media (hover: none) and (pointer: coarse) {
  .btn, .item {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

### 📊 Suporte de Navegadores

- ✅ Safari iOS 12+
- ✅ Chrome Android 80+
- ✅ Samsung Internet 12+
- ✅ Firefox Mobile 68+

### 🚀 Performance em Mobile

- Canvas otimizado para touch events
- Lazy loading de componentes pesados
- Transições CSS para animações suaves
- Debounce em eventos de redimensionamento

### 💡 Dicas de Uso

1. **Use landscape** para melhor experiência em telas pequenas
2. **Feche painéis** quando não estiver usando para ter mais espaço no canvas
3. **Use zoom** para trabalhos de precisão
4. **Salve frequentemente** usando o menu de exportação

### 🐛 Problemas Conhecidos

- Alguns gestos podem conflitar com o navegador (refresh, voltar)
- Performance pode ser reduzida em dispositivos mais antigos com muitos fixtures
- Drag & drop pode ter comportamento diferente entre iOS e Android

### 📱 Testado Em

- iPhone 12/13/14 (iOS 15+)
- Samsung Galaxy S21/S22
- iPad Pro 11"
- Tablets Android 10+

---

**Desenvolvido com Next.js 15 + React 19**
