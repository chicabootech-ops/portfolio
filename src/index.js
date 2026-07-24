/**
 * Minimal chicaboo.co Worker — logo page only.
 */
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chic A Boo</title>
  <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
  <link rel="apple-touch-icon" href="/logo.jpeg" />
  <meta name="theme-color" content="#f7f3ea" />
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f7f3ea;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
    img {
      width: min(72vw, 280px);
      height: auto;
      display: block;
    }
  </style>
</head>
<body>
  <img src="/logo.jpeg" alt="Chic A Boo" width="280" height="280" />
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/" || path === "") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
          "cache-control": "public, max-age=300",
        },
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
