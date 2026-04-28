# La Camiceria — Provador Virtual AI

> Experiência de virtual try-on premium para a marca La Camiceria.
> Moda masculina de alto padrão com tecnologia de inteligência artificial.

---

## ✦ Visão Geral

Plataforma de virtual try-on onde o usuário:
1. Faz upload de uma foto própria
2. Seleciona uma peça da coleção La Camiceria
3. A IA gera realisticamente o look final

**Stack:** Next.js 14 · React · TailwindCSS · Framer Motion · OpenAI / Freepik API

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta OpenAI **ou** Freepik (para geração de imagens)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/la-camiceria-tryon
cd la-camiceria-tryon

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# 4. Rode localmente
npm run dev
```

Acesse `http://localhost:3000`

---

## 🔑 Variáveis de Ambiente

Crie `.env.local` na raiz do projeto:

```env
# Opção A — OpenAI DALL-E 3 (recomendado)
OPENAI_API_KEY=sk-...

# Opção B — Freepik Mystic
FREEPIK_API_KEY=...

# Opcional — Cloudinary para upload
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Sem API key configurada, o sistema roda em **modo demo** com imagem placeholder.

---

## 📁 Estrutura do Projeto

```
la-camiceria/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── try-on/
│   │   │   └── page.tsx          # Experiência de try-on
│   │   └── api/
│   │       ├── generate/route.ts # API de geração IA
│   │       └── upload/route.ts   # API de upload
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   └── StepIndicator.tsx
│   │   └── tryOn/
│   │       ├── ImageUpload.tsx
│   │       ├── ProductGrid.tsx
│   │       ├── GenerationResult.tsx
│   │       └── HistoryPanel.tsx
│   │
│   ├── lib/
│   │   └── products.ts           # Catálogo de produtos
│   │
│   ├── services/
│   │   ├── aiService.ts          # Integração IA (OpenAI / Freepik)
│   │   └── historyService.ts     # Histórico local
│   │
│   └── types/
│       └── index.ts              # Tipos TypeScript
│
├── public/
│   └── products/                 # Imagens dos produtos
│
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design System

### Paleta
| Token | Cor | Hex |
|-------|-----|-----|
| Navy | Principal | `#102A43` |
| Navy Mid | Secundário | `#243B53` |
| Sand | Acento | `#C8B49A` |
| Cream | Background | `#F7F4EF` |
| Off-white | Superfície | `#FAFAF8` |

### Tipografia
| Fonte | Uso |
|-------|-----|
| Playfair Display | Headings / Display |
| Cormorant Garamond | Textos serif elegantes |
| Jost | Body / UI |
| DM Mono | Labels técnicos |

---

## 🤖 Integrações de IA

### OpenAI DALL-E 3 (padrão)

O sistema usa DALL-E 3 com prompt editorial automático que inclui:
- Contexto da peça (tipo, nome, categoria)
- Estilo mediterrâneo / resort premium
- Instruções de iluminação e qualidade
- Fidelidade da peça original

### Freepik Mystic (alternativa)

Fallback para Freepik com configuração de estilo `photo`.

### Modo Demo

Sem chaves configuradas, retorna uma imagem placeholder elegante.

---

## 🧩 Adicionar Produtos

Edite `src/lib/products.ts`:

```typescript
{
  id: 'meu-produto-unico',
  name: 'Nome do Produto',
  category: 'camisa', // camisa | polo | bermuda | trico | blazer
  categoryLabel: 'Camisa',
  imageUrl: '/products/meu-produto.jpg',
  colors: ['#HEX1', '#HEX2'],
  description: 'Descrição elegante.',
  featured: true, // aparece no hero
}
```

Adicione a imagem em `public/products/meu-produto.jpg`.

---

## 🚢 Deploy na Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configure Environment Variables no painel Vercel:
#    Settings → Environment Variables
#    Adicione todas as variáveis do .env.example
```

Ou clique em:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/la-camiceria-tryon)

---

## 📸 Adicionar Imagens Reais dos Produtos

Para substituir os placeholders:

1. Fotografe as peças em fundo branco/neutro
2. Exporte em JPG, resolução mínima 800×1067px (proporção 3:4)
3. Coloque em `public/products/[id-do-produto].jpg`
4. O `imageUrl` no `products.ts` já aponta para o caminho correto

---

## 🔧 Scripts

```bash
npm run dev     # Servidor de desenvolvimento
npm run build   # Build de produção
npm run start   # Servidor de produção
npm run lint    # Linting
```

---

## 📋 Roadmap

- [ ] Integração com Supabase para histórico persistente
- [ ] Autenticação com magic link
- [ ] Compartilhamento de looks via link
- [ ] Múltiplas peças em um único look (outfit completo)
- [ ] IA de try-on especializada (IDM-VTON ou similar)
- [ ] Métricas e analytics
- [ ] Integração com e-commerce / WhatsApp

---

## 📄 Licença

Proprietário La Camiceria. Todos os direitos reservados.

---

<p align="center">
  <strong>LA CAMICERIA</strong><br>
  <em>Elegância sem esforço · Mediterrâneo · Old Money Contemporâneo</em>
</p>
