# Guia de Uso em Dispositivos Móveis

## 📱 Melhorias de Responsividade - Versão 2.0

Este projeto foi completamente otimizado para funcionar em celulares e tablets com interfaces dedicadas para mobile.

### ✨ Recursos Mobile

#### 1. **Interfaces Específicas para Mobile**
- **Biblioteca**: Interface colapsável com seções organizadas
- **Propriedades**: Formulário otimizado com grupos visuais
- **Detecção automática**: O app detecta se está em mobile e ajusta automaticamente

#### 2. **Biblioteca Mobile (📚)**
**Seções Colapsáveis:**
- 🏷️ **Grupos**: Gerenciar varas e agrupamentos
  - Botão grande "➕ Nova Vara"
  - Lista com ícones visuais
  - Seleção por toque

- 💡 **Equipamentos**: Todos os fixtures disponíveis
  - Ícones maiores (32x32px)
  - Informações mais legíveis
  - Nome e especificações em linhas separadas

- ⚡ **Ações**: Ferramentas e configurações
  - Auto-patch DMX
  - Remover item selecionado
  - Ajuste de tamanho do palco (3 tamanhos pré-definidos)

**Características:**
- ✅ Cabeçalho fixo com título
- ✅ Seções expandem/colapsam com animação suave
- ✅ Chevron (▼) indica estado aberto/fechado
- ✅ Apenas uma seção por vez (foco no conteúdo)
- ✅ Ícones emojis para identificação rápida

#### 3. **Propriedades Mobile (⚙️)**
**Quando nenhum item está selecionado:**
- Mensagem clara com ícone
- Instruções de como selecionar

**Quando item está selecionado:**

**Grupos Organizados:**
1. **Informações Básicas**
   - Nome do item
   - Grupo associado

2. **Transformação**
   - Slider de rotação com valor em tempo real
   - Largura e altura lado a lado (grid 2 colunas)

3. **Equipamento** (apenas para fixtures)
   - Potência e Número do marcador em grid
   - Seletor de cor visual
   - Dropdown de ícones
   - Modos e modo padrão

4. **Ações**
   - Botões grandes com ícones
   - "🏷️ Aplicar Marcador ao Grupo"
   - "📤 Enviar para Trás"

**Características:**
- ✅ Labels claras acima de cada campo
- ✅ Inputs com altura de 44px (touch-friendly)
- ✅ Grupos visuais separados por bordas
- ✅ Tipografia otimizada (13-15px)
- ✅ Estados de foco destacados

#### 4. **Layout Responsivo**
- **Desktop (>1024px)**: 3 colunas lado a lado
- **Tablet (768px-1024px)**: 3 colunas compactas
- **Mobile (<768px)**: 1 coluna com painéis deslizantes

#### 5. **Painéis Deslizantes**
Em dispositivos móveis:
- **📚 Biblioteca**: Desliza da esquerda (85% da tela, máx 320px)
- **⚙️ Propriedades**: Desliza da direita (85% da tela, máx 320px)
- **Backdrop escuro**: Fecha painéis ao tocar fora
- **Apenas 1 painel aberto**: Abre automaticamente fecha o outro

#### 6. **Interação por Toque Otimizada**
- ✅ Altura mínima de 44px em todos os elementos clicáveis
- ✅ Áreas de toque generosas
- ✅ Feedback visual ao tocar (active state)
- ✅ Sem necessidade de arrastar (toque para adicionar)
- ✅ Smooth scrolling nativo
- ✅ Sem prevenção de zoom (beliscar para dar zoom)

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
