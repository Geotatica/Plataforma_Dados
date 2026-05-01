# GeoTática | Plataforma com Tati Quinha IA

Este pacote contém a plataforma com a Tati Quinha IA preparada para funcionar com Gemini API por meio de Cloudflare Worker.

## Segurança

A chave da Gemini API NÃO está neste ZIP.

Não coloque a chave no:

- `index.html`
- `style.css`
- `script.js`
- `worker-tatiquinha-gemini.js`
- GitHub Pages
- repositório público

A chave deve ser configurada como Secret no Cloudflare Worker.

## Arquivos principais

- `index.html`
- `style.css`
- `script.js`
- `worker-tatiquinha-gemini.js`
- `wrangler.toml`

## Como configurar a chave da Gemini no Cloudflare Worker

No terminal, dentro da pasta do projeto:

```bash
npm install -g wrangler
wrangler login
wrangler secret put GEMINI_API_KEY
```

Quando o terminal pedir, cole a chave da Gemini API.

Depois publique o Worker:

```bash
wrangler deploy
```

Ao publicar, o Cloudflare retornará uma URL parecida com:

```text
https://tati-quinha-ia.SEUSUBDOMINIO.workers.dev
```

## Como ligar a plataforma ao Worker

No arquivo `script.js`, localize esta linha:

```js
window.GEOTATICA_AI_BACKEND_URL = window.GEOTATICA_AI_BACKEND_URL || "";
```

Troque por:

```js
window.GEOTATICA_AI_BACKEND_URL = "https://tati-quinha-ia.SEUSUBDOMINIO.workers.dev";
```

## Observação importante

Se uma chave foi compartilhada em conversa, e-mail, print ou arquivo, o mais seguro é revogar essa chave e gerar outra.

## Modo local

Mesmo sem configurar a API, a Tati Quinha funciona em modo local:

- busca termos dentro do array `sources`;
- sugere fontes da própria curadoria;
- retorna nome, tema/metadados e link.


## Worker conectado nesta versão

A plataforma está apontando para:

```text
https://tati-quinha-ia.geo-daniellecorrea.workers.dev
```

No `script.js`, a linha configurada é:

```js
window.GEOTATICA_AI_BACKEND_URL = "https://tati-quinha-ia.geo-daniellecorrea.workers.dev";
```

A chave Gemini permanece protegida no Cloudflare Worker como Secret `GEMINI_API_KEY`.
