/**
 * Image helpers. When a product or gallery item has no real image yet,
 * a neutral placeholder is generated, so nothing breaks while photos are
 * still being taken. Real images simply replace these (see products.js).
 */
(function (SE) {
  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var ART = [
    // 0: single staff
    '<line x1="170" y1="610" x2="630" y2="150" stroke="{g}" stroke-width="16" stroke-linecap="round"/>' +
    '<line x1="190" y1="630" x2="650" y2="170" stroke="{g}" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>',
    // 1: crossed pair
    '<line x1="190" y1="590" x2="610" y2="170" stroke="{g}" stroke-width="14" stroke-linecap="round"/>' +
    '<line x1="190" y1="170" x2="610" y2="590" stroke="{g}" stroke-opacity=".6" stroke-width="14" stroke-linecap="round"/>',
    // 2: detail view
    '<circle cx="400" cy="380" r="190" fill="none" stroke="{g}" stroke-opacity=".5" stroke-width="3"/>' +
    '<line x1="250" y1="530" x2="550" y2="230" stroke="{g}" stroke-width="22" stroke-linecap="round"/>'
  ];

  var SHADES = ['#16342b', '#122a24', '#0f2a33'];

  SE.media = {
    /** Returns a data-URI SVG placeholder. */
    placeholder: function (label, variant) {
      var v = (variant || 0) % 3;
      var gold = SE.config.colors.accent;
      var light = SE.config.colors.background;
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">' +
        '<rect width="800" height="800" fill="' + SHADES[v] + '"/>' +
        '<rect x="24" y="24" width="752" height="752" fill="none" stroke="' + gold + '" stroke-opacity=".35"/>' +
        ART[v].replace(/\{g\}/g, gold) +
        '<text x="400" y="700" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="' + light + '" fill-opacity=".85">' +
        esc(String(label).toUpperCase()) + '</text>' +
        '<text x="400" y="742" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="' + light + '" fill-opacity=".5">PLACEHOLDER IMAGE</text>' +
        '</svg>';
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    },

    /**
     * Always returns at least one { src, alt }.
     * product.images entries may be { src, alt } objects or plain URL strings.
     */
    getProductImages: function (product) {
      var real = (product.images || []).map(function (img, i) {
        var src = typeof img === 'string' ? img : img.src;
        var alt = typeof img === 'string' || !img.alt ? product.name + ' – image ' + (i + 1) : img.alt;
        return { src: src, alt: alt };
      });
      if (real.length) return real;
      return [0, 1, 2].map(function (i) {
        return {
          src: SE.media.placeholder(product.name, i),
          alt: product.name + ' – placeholder image ' + (i + 1)
        };
      });
    }
  };
})(window.SE);
