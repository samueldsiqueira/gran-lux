# 🐛 Guia de Debug - Drag and Drop Mobile

## Como Testar o Drag & Drop

### 1. **Abrir o Console do Navegador**
```
Chrome Mobile:
1. chrome://inspect
2. Ou use o DevTools no desktop conectado ao dispositivo

Desktop (teste responsivo):
1. F12 → DevTools
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Selecione iPhone ou Android
4. Abra Console tab
```

### 2. **Logs para Verificar**

Quando você arrastar um item, deve ver no console:

```javascript
// Ao iniciar o arraste:
"Touch start on fixture: PAR LED"

// Durante o arraste:
(position atualiza continuamente)

// Ao soltar:
"Touch end, dragging: PAR LED"
"Drop position: 450, 320"
"Element at point: CANVAS"
"Stage canvas found: true"
"Is on stage: true"
"Dispatching fixtureDropped event"

// No receptor (page.tsx):
"fixtureDropped event received! {fixture: {...}, x: 450, y: 320}"
"Fixture: PAR LED Position: 450 320"
"Stage ref: Stage {...}"
"Stage rect: DOMRect {...}"
"Stage scale: 1"
"Relative position: 123 456"
"Adding new item: {...}"
"Item added, sidebar closed"
```

### 3. **Checklist de Funcionamento**

✅ **Visual Feedback:**
- [ ] Item na biblioteca fica com opacity 0.3 ao arrastar
- [ ] Preview flutuante aparece (caixa branca com borda azul)
- [ ] Preview segue o dedo

✅ **Arraste:**
- [ ] Console mostra "Touch start on fixture"
- [ ] Preview se move suavemente
- [ ] Pode arrastar até o palco

✅ **Soltar:**
- [ ] Console mostra "Touch end"
- [ ] Console mostra "fixtureDropped event received"
- [ ] Item aparece no palco
- [ ] Sidebar fecha automaticamente

### 4. **Problemas Comuns e Soluções**

#### ❌ Preview não aparece:
**Causa:** Z-index muito baixo ou elemento coberto
**Solução:** Preview está com z-index 99999, deve estar visível

#### ❌ "Element at point: DIV" (não CANVAS):
**Causa:** Preview flutuante está bloqueando o elementFromPoint
**Solução:** Já tem `pointerEvents: 'none'` no preview

#### ❌ "Is on stage: false":
**Causa:** Soltou fora do canvas
**Solução:** Item será adicionado no centro como fallback

#### ❌ Evento não é disparado:
**Causa:** Event listener não registrado
**Solução:** Verificar console: "Adding fixtureDropped event listener"

#### ❌ Item aparece em posição errada:
**Causa:** Cálculo de coordenadas relativas
**Solução:** Verificar logs de "Relative position"

### 5. **Teste Passo-a-Passo**

```
1. Abra o app no mobile ou emulador
2. Abra o console (F12)
3. Toque em 📚 Biblioteca
4. Pressione e segure "PAR LED"
   → Deve ver "Touch start on fixture: PAR LED"
   → Item fica transparente
   → Preview flutuante aparece

5. Arraste até o centro do palco
   → Preview segue o dedo
   → Está sobre o canvas

6. Solte o dedo
   → Vários logs aparecem no console
   → "fixtureDropped event received!"
   → Item aparece no palco
   → Sidebar fecha

7. Se não funcionou:
   → Copie TODOS os logs do console
   → Envie para análise
```

### 6. **Debug Avançado**

Se ainda não funcionar, adicione breakpoint:

```javascript
// Em Library.tsx, linha ~87:
const handleTouchEnd = (e: React.TouchEvent) => {
  debugger; // ← Adicione aqui
  // ...
}

// Em page.tsx, linha ~49:
const handleFixtureDropped = (e: any) => {
  debugger; // ← Adicione aqui
  // ...
}
```

### 7. **Verificar Requisitos**

✅ **Navegador:**
- [ ] Chrome/Safari mobile ou emulador
- [ ] Touch events habilitados
- [ ] JavaScript habilitado

✅ **Tela:**
- [ ] Largura < 768px (mobile mode ativo)
- [ ] Sidebar esquerda aberta
- [ ] Palco visível

✅ **Estado:**
- [ ] Biblioteca carregada
- [ ] Items aparecem na lista
- [ ] Canvas renderizado no DOM

### 8. **Fallback Manual**

Se drag & drop não funcionar, você AINDA PODE:
```
1. Toque no item na biblioteca
2. Ele será adicionado no centro do palco
3. Use toque e arraste para reposicionar
```

### 9. **Informações para Suporte**

Se relatar um bug, inclua:
```
- Dispositivo: (iPhone 12, Android Galaxy S21, etc)
- Navegador: (Safari 15, Chrome 120, etc)
- Largura da tela: (check no console: window.innerWidth)
- Logs do console: (copie TODOS os logs)
- Screenshot ou vídeo do comportamento
```

---

**Versão:** 1.0
**Última atualização:** 2025-10-25
