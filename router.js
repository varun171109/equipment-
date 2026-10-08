/**
 * Minimal hash router (works when index.html is opened directly from disk).
 *
 *   #/                 home
 *   #/product/<id>     product detail
 *   #/cart  #/about  #/gallery  #/contact
 */
(function (SE) {
  var routes = [
    { name: 'home',    pattern: /^\/$/,                 page: function () { return SE.pages.home; } },
    { name: 'home',    pattern: /^\/product\/([^/]+)$/, page: function () { return SE.pages.product; }, params: ['id'] },
    { name: 'cart',    pattern: /^\/cart$/,             page: function () { return SE.pages.cart; } },
    { name: 'about',   pattern: /^\/about$/,            page: function () { return SE.pages.about; } },
    { name: 'gallery', pattern: /^\/gallery$/,          page: function () { return SE.pages.gallery; } },
    { name: 'contact', pattern: /^\/contact$/,          page: function () { return SE.pages.contact; } }
  ];

  var app = null;
  var token = 0;
  var activeCleanups = [];
  var pendingScroll = null;
  var firstRender = true;

  function currentPath() {
    var hash = window.location.hash.replace(/^#/, '').split('?')[0];
    return hash.charAt(0) === '/' ? hash : '/';
  }

  function runAll(list) { list.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } }); }

  function scrollToPending() {
    if (!pendingScroll) return false;
    var target = document.getElementById(pendingScroll);
    pendingScroll = null;
    if (!target) return false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    return true;
  }

  function errorView() {
    return SE.h('section', { class: 'section not-found' },
      SE.h('div', { class: 'container' },
        SE.h('h1', { class: 'page-title' }, 'Something went wrong'),
        SE.h('p', null, 'Please refresh the page and try again.')
      )
    );
  }

  function render() {
    var mine = ++token;
    runAll(activeCleanups);
    activeCleanups = [];

    var path = currentPath();
    var match = null;
    var params = {};
    for (var i = 0; i < routes.length && !match; i++) {
      var m = path.match(routes[i].pattern);
      if (m) {
        match = routes[i];
        (match.params || []).forEach(function (name, idx) { params[name] = decodeURIComponent(m[idx + 1]); });
      }
    }

    var page = match ? match.page() : SE.pages.notFound;
    var cleanups = [];
    var ctx = {
      params: params,
      title: page.title,
      onLeave: function (fn) { cleanups.push(fn); },
      // Pages that load data after they appear use these:
      isActive: function () { return mine === token; }, // false once the visitor has navigated away
      setTitle: function (title) {
        ctx.title = title;
        if (mine === token) document.title = title + ' | ' + SE.config.siteName;
      }
    };

    Promise.resolve()
      .then(function () { return page.render(ctx); })
      .catch(function (err) { console.error(err); return errorView(); })
      .then(function (view) {
        if (mine !== token) { runAll(cleanups); return; } // a newer navigation took over
        activeCleanups = cleanups;
        app.replaceChildren(view);
        document.title = ctx.title + ' | ' + SE.config.siteName;
        SE.components.header.setActive(match ? match.name : null);

        if (!scrollToPending()) window.scrollTo(0, 0);
        if (!firstRender) app.focus({ preventScroll: true });
        firstRender = false;
      });
  }

  SE.router = {
    /** go('/cart') or go('/', { scrollTo: 'equipment' }) */
    go: function (path, options) {
      pendingScroll = (options && options.scrollTo) || null;
      var target = '#' + path;
      var sameRoute = currentPath() === path && window.location.hash !== '' ;
      var homeAlready = path === '/' && currentPath() === '/';
      if (homeAlready && pendingScroll && scrollToPending()) return;
      if (sameRoute || homeAlready) render();
      else window.location.hash = target;
    },

    start: function (container) {
      app = container;
      window.addEventListener('hashchange', function () {
        var hash = window.location.hash;
        if (hash !== '' && hash !== '#' && hash.charAt(1) !== '/') return; // ignore non-route anchors
        render();
      });
      render();
    }
  };
})(window.SE);
