/** Start-up: apply theme from config, mount header/footer, start the router. */
(function (SE) {
  function applyTheme() {
    var c = SE.config.colors;
    var root = document.documentElement.style;
    root.setProperty('--color-primary', c.primary);
    root.setProperty('--color-secondary', c.secondary);
    root.setProperty('--color-accent', c.accent);
    root.setProperty('--color-bg', c.background);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', c.secondary);
  }

  var started = false;

  function init() {
    if (started) return; // never mount twice
    started = true;
    applyTheme();
    var app = document.getElementById('app');

    document.getElementById('skip-link').addEventListener('click', function (e) {
      e.preventDefault();
      app.focus();
    });

    SE.components.header.mount(document.getElementById('site-header'));
    SE.components.footer.mount(document.getElementById('site-footer'));
    SE.router.start(app);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.SE);
