import { Application, Graphics, Assets, Container } from "pixi.js";
import { GifSprite } from "pixi.js/gif";
import { Viewport } from "pixi-viewport";
import getData from "./data.ts";

// Load and create a GIF sprite
let source;
const SCALE = 2;
const ONE_LINK_MILLISECONDS = 20000;

function doubleCoors({ x, y }: { x: number; y: number }) {
  return { x: x * SCALE, y: y * SCALE };
}

function go() {
  const input = document.getElementById("input").value;
  document.getElementById("start")?.remove();
  start(getData(input));
}
window.go = go;

async function start(data) {
  const app = new Application();
  await app.init({ background: "black", resizeTo: window });
  source = await Assets.load("./assets/neon-cat-rainbow.gif");

  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 2500,
    worldHeight: 2500,
    events: app.renderer.events,
  });
  viewport.drag().pinch().wheel(); //.clampZoom()
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  app.stage.addChild(viewport);

  const linksG = new Graphics();
  const nodesG = new Graphics();

  viewport.addChild(linksG);
  viewport.addChild(nodesG);
  viewport.fit();

  let links;
  const graph = () => {
    linksG.clear();
    nodesG.clear();

    const nodes = data.nodes.map(doubleCoors);
    links = data.links.map(({ source, target }) => ({
      source: doubleCoors(source),
      target: doubleCoors(target),
    }));

    for (const l of links) {
      const s = l.source;
      const t = l.target;

      linksG.moveTo(s.x, s.y);
      linksG.lineTo(t.x, t.y).stroke({ width: 2, color: 0xffaaaa, alpha: 0.2 });
    }

    for (const n of nodes) {
      const x = n.x;
      const y = n.y;
      nodesG.fill(0xffffff);
      nodesG.setStrokeStyle({ width: 2, color: 0x000000 });
      nodesG.circle(x, y, 4);
      nodesG.fill();
    }
  };

  let lastReset = -Infinity;
  let cats;
  const catAnimation = () => {
    const now = Date.now();
    if (now - lastReset > ONE_LINK_MILLISECONDS) {
      cats.forEach((cat) => {
        cat.sprite.x = cat.link.source.x;
        cat.sprite.y = cat.link.source.y;
      });
      lastReset = now;
      return;
    }
    const proportionPassed = (now - lastReset) / ONE_LINK_MILLISECONDS;
    cats.forEach((cat) => {
      const sx = cat.link.source.x;
      const sy = cat.link.source.y;
      const tx = cat.link.target.x;
      const ty = cat.link.target.y;

      const dx = tx - sx;
      const dy = ty - sy;
      const posX = sx + dx * proportionPassed;
      const posY = sy + dy * proportionPassed;

      cat.sprite.x = posX;
      cat.sprite.y = posY;
    });
  };

  app.ticker.add(graph);
  setTimeout(() => {
    app.ticker.remove(graph);
    cats = links!.map(spawnCatForLink);
    app.ticker.add(catAnimation);
    const audio = new Audio("assets/cat.mp3");
    audio.loop = true;
    audio.play();
  }, 5000);

  const catsContainer = new Container();
  viewport.addChild(catsContainer);

  // set rotation here
  function spawnCatForLink(link) {
    const spr = new GifSprite({
      source,
      animationSpeed: 1,
      loop: true,
      autoPlay: true,
      scale: 0.01,
      rotation: Math.atan2(
        link.target.y - link.source.y,
        link.target.x - link.source.x
      ),
      anchor: 0.5,
    });
    if (link.target.x < link.source.x) {
      spr.scale.y *= -1;
    }
    catsContainer.addChild(spr);
    return {
      sprite: spr,
      link,
    };
  }
}
