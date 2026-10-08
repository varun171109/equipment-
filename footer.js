(function (SE) {
  var h = SE.h;
  var cfg = SE.config;

  function mount(container) {
    var contactRows = [
      ['WhatsApp', cfg.contact.whatsapp],
      ['Phone', cfg.contact.phone],
      ['Email', cfg.contact.email],
      ['Instagram', cfg.contact.instagram]
    ];

    container.appendChild(
      h('div', { class: 'container' },
        h('div', { class: 'footer-grid' },
          h('div', { class: 'footer-brand' },
            SE.components.logo(),
            h('p', null, 'Professional Silambam equipment for practitioners, trainers and academies.')
          ),
          h('nav', { class: 'footer-col', 'aria-label': 'Footer' },
            h('h2', null, 'Explore'),
            h('ul', null,
              cfg.nav.map(function (item) { return h('li', null, h('a', { href: item.href }, item.label)); }),
              h('li', null, h('a', { href: '#/cart' }, 'CART'))
            )
          ),
          h('div', { class: 'footer-col' },
            h('h2', null, 'Contact'),
            h('ul', null, contactRows.map(function (row) { return h('li', null, row[0] + ': ' + row[1]); }))
          )
        ),
        h('p', { class: 'footer-bottom' }, '© ' + new Date().getFullYear() + ' ' + cfg.siteName + '. All rights reserved.')
      )
    );
  }

  SE.components.footer = { mount: mount };
})(window.SE);
