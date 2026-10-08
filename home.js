(function (SE) {
  var h = SE.h;
  var cfg = SE.config;

  function heroArt() {
    var t = document.createElement('template');
    t.innerHTML =
      '<svg class="hero__art" viewBox="0 0 600 600" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-linecap="round">' +
      '<line x1="80" y1="540" x2="540" y2="80" stroke-width="18"/>' +
      '<line x1="140" y1="560" x2="560" y2="140" stroke-width="6"/>' +
      '<circle cx="300" cy="300" r="230" stroke-width="2"/></svg>';
    return t.content.firstElementChild;
  }

  function scrollLink(className, label, sectionId) {
    return h('a', {
      class: 'btn ' + className, href: '#/',
      onclick: function (e) {
        e.preventDefault();
        SE.router.go('/', { scrollTo: sectionId });
      }
    }, label);
  }

  function hero() {
    return h('section', { class: 'hero', 'aria-labelledby': 'hero-title' },
      heroArt(),
      h('div', { class: 'container' },
        h('div', { class: 'hero__copy' },
          h('p', { class: 'eyebrow' }, 'Silambam training equipment'),
          h('h1', { class: 'hero__title', id: 'hero-title' },
            h('span', null, 'Tradition.'),
            h('span', null, 'Discipline.'),
            h('span', null, 'Craftsmanship.')
          ),
          h('p', { class: 'hero__sub' }, 'Professional Silambam Equipment Built for Practitioners and Academies.'),
          h('div', { class: 'hero__actions' },
            scrollLink('btn--primary', 'EXPLORE EQUIPMENT', 'equipment'),
            scrollLink('btn--outline-light', 'BULK ORDERS', 'bulk')
          )
        )
      )
    );
  }

  /** `area` is where the product grid (or a loading / error / empty message) goes. */
  function equipmentSection(area) {
    return h('section', { class: 'section', id: 'equipment', 'aria-labelledby': 'equipment-title' },
      h('div', { class: 'container' },
        h('header', { class: 'section-head' },
          h('h2', { class: 'section-title', id: 'equipment-title' }, 'OUR EQUIPMENT'),
          h('p', { class: 'section-lead' }, 'Silambam training equipment for practitioners, trainers and academies.')
        ),
        area,
        cfg.showPlaceholderNotice
          ? h('p', { class: 'notice' }, 'Prices, descriptions and images on this site are placeholders and will be updated before launch.')
          : null
      )
    );
  }

  function bulkSection() {
    var tiers = cfg.tiers.slice(1); // wholesale and bulk tiers
    return h('section', { class: 'section bulk', id: 'bulk', 'aria-labelledby': 'bulk-title' },
      h('div', { class: 'container' },
        h('header', { class: 'section-head' },
          h('h2', { class: 'section-title', id: 'bulk-title' }, 'EQUIPPING YOUR ACADEMY?'),
          h('p', { class: 'section-lead' }, 'Special pricing is available for bulk and academy orders.')
        ),
        h('div', { class: 'bulk__tiers' },
          tiers.map(function (tier) {
            return h('div', { class: 'bulk__tier' },
              h('p', { class: 'bulk__qty' }, tier.min + '+ pieces'),
              h('p', { class: 'bulk__name' }, tier.label)
            );
          })
        ),
        h('a', {
          class: 'btn btn--primary', href: '#/contact',
          onclick: function (e) {
            e.preventDefault();
            SE.state.contactPrefill = 'I would like to enquire about a bulk / academy order.';
            SE.router.go('/contact');
          }
        }, 'ENQUIRE FOR BULK ORDER')
      )
    );
  }

  SE.pages.home = {
    title: 'Home',
    render: function (ctx) {
      var S = SE.components.statusBlock;
      var area = h('div');

      // The hero and bulk sections appear straight away; only the product
      // area waits for Supabase.
      function load() {
        area.replaceChildren(S.loading());
        SE.productService.getProducts()
          .then(function (products) {
            if (!ctx.isActive()) return;
            if (!products.length) {
              area.replaceChildren(S.empty());
              return;
            }
            area.replaceChildren(
              h('div', { class: 'product-grid' },
                products.map(function (p) { return SE.components.productCard(p); }))
            );
          })
          .catch(function () {
            if (!ctx.isActive()) return;
            area.replaceChildren(S.error(load));
          });
      }

      load();
      return h('div', null, hero(), equipmentSection(area), bulkSection());
    }
  };
})(window.SE);
