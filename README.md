# Jason & Co. Construction

Website for Jason & Co. Construction, a finish-carpentry business serving Augusta and the Central Savannah River Area.

Live site: https://jasonandcoconstruction.com/

## Open on a new computer

Prerequisite: Node.js 22.13 or newer.

```bash
git clone --branch codex/website-source https://github.com/Ajohnson706/jason-and-co-construction.git
cd jason-and-co-construction
npm install
npm run dev
```

Open the local address printed by the development server. The main website code is in `app/page.tsx` and `app/globals.css`. Portfolio photos are in `public/images`, and the scrolling background video is in `public/video`.

## Validate changes

```bash
npx vinext build
node --test tests/rendered-html.test.mjs
```

The `.openai/hosting.json` file connects the project to its existing Sites deployment. Keep that file in the repository when editing or publishing from another computer.
