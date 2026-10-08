(function (SE) {
  var h = SE.h;
  var cfg = SE.config;

  /** Temporary text wordmark. Uses cfg.logo.imageUrl when a real logo exists. */
  function logo() {
    var link = h('a', { class: 'logo', href: '#/', 'aria-label': cfg.siteName + ' – home' });
    if (cfg.logo.imageUrl) {
      link.appendChild(h('img', { class: 'logo__img', src: cfg.logo.imageUrl, alt: cfg.siteName }));
    } else {
      var words = (cfg.logo.text || cfg.siteName).split(' ');
      link.appendChild(h('span', null,
        words[0],
        words.length > 1 ? [' ', h('span', { class: 'logo__accent' }, words.slice(1).join(' '))] : null
      ));
    }
    return link;
  }

  var links = [];

  function mount(container) {
    var nav = h('nav', { class: 'nav', id: 'primary-nav', 'aria-label': 'Primary' },
      h('ul', { class: 'nav__list' },
        cfg.nav.map(function (item) {
          var a = h('a', { class: 'nav__link', href: item.href, 'data-route': item.route }, item.label);
          links.push(a);
          return h('li', null, a);
        })
      )
    );

    var badge = h('span', { class: 'cart-link__badge', hidden: true }, '0');
    var cartLink = h('a', { class: 'cart-link', href: '#/cart', 'data-route': 'cart' },
      h('span', { class: 'cart-link__icon' }, SE.icon('cart', 24), badge),
      h('span', { class: 'cart-link__label' }, 'CART')
    );
    links.push(cartLink);

    var toggle = h('button', {
      class: 'menu-toggle', type: 'button',
      'aria-expanded': 'false', 'aria-controls': 'primary-nav', 'aria-label': 'Menu'
    }, SE.icon('menu', 26));

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.replaceChildren(SE.icon(open ? 'close' : 'menu', 26));
    }
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    function updateCount() {
      var count = SE.cartService.getCount();
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count === 0;
      cartLink.setAttribute('aria-label',
        count === 0 ? 'Cart, empty' : 'Cart, ' + count + (count === 1 ? ' item' : ' items'));
    }
    SE.cartService.subscribe(updateCount);
    updateCount();

    container.appendChild(
      h('div', { class: 'container site-header__inner' },
        logo(), nav,
        h('div', { class: 'header-actions' }, cartLink, toggle)
      )
    );
  }

  function setActive(route) {
    links.forEach(function (a) {
      var on = a.getAttribute('data-route') === route;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  SE.components.logo = logo;
  SE.components.header = { mount: mount, setActive: setActive };
})(window.SE);
