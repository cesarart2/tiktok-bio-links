// go-click-logger — logs every /go/* hit to Workers Analytics Engine, then
// passes the request through to GitHub Pages untouched. If logging throws,
// the redirect still works: the origin page is always returned.
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const slug = (url.pathname.match(/^\/go\/([^/]+)/) || [])[1] || "";
      const src = url.searchParams.get("src") || "";
      const referer = request.headers.get("referer") || "";
      const ua = request.headers.get("user-agent") || "";
      env.GO_CLICKS.writeDataPoint({
        blobs: [slug, src, referer.slice(0, 256), ua.slice(0, 256)],
        doubles: [1],
        indexes: [slug.slice(0, 32)],
      });
    } catch (e) {
      // never let logging break the redirect
    }
    return fetch(request);
  },
};
