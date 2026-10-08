(function (SE) {
  var h = SE.h;
  var fmt = SE.format;
  var P = SE.pricing;

  function gallery(product) {
    var images = SE.media.getProductImages(product);
    var mainImg = h('img', { src: images[0].src, alt: images[0].alt, width: '800', height: '800' });

    var thumbs = images.map(function (img, i) {
      return h('button', {
        class: 'pgallery__thumb' + (i === 0 ? ' is-active' : ''), type: 'button',
        'aria-label': 'Show image ' + (i + 1) + ' of ' + images.length,
        'aria-pressed': i === 0 ? 'true' : 'false',
        onclick: function () { select(i); }
      }, h('img', { src: img.src, alt: '', width: '160', height: '160' }));
    });

    function select(index) {
      mainImg.src = images[index].src;
      mainImg.alt = images[index].alt;
      thumbs.forEach(function (t, j) {
        t.classList.toggle('is-active', j === index);
        t.setAttribute('aria-pressed', String(j === index));
      });
    }

    return h('div', { class: 'pgallery' },
      h('div', { class: 'pgallery__main' }, mainImg),
      images.length > 1 ? h('div', { class: 'pgallery__thumbs' }, thumbs) : null
    );
  }

  function notFound(ctx) {
    ctx.setTitle('Product not found');
    return h('section', { class: 'section not-found' },
      h('div', { class: 'container' },
        h('h1', { class: 'page-title' }, 'Product not found'),
        h('p', null, 'We could not find that product.'),
        h('a', { class: 'btn btn--primary', href: '#/' }, 'BACK TO EQUIPMENT')
      )
    );
  }

  /** Loading / error message with the same page spacing as the product page. */
  function statusSection(block) {
    return h('section', { class: 'section' }, h('div', { class: 'container' }, block));
  }

  /** Builds the full product page. The quantity, tier and price logic is unchanged from Phase 1. */
  function buildPage(product, ctx) {
    ctx.setTitle(product.name);

    var qty = 1;
    var unitEl = h('span', { class: 'price-box__unit' });
    var totalEl = h('strong', { class: 'price-box__total' });
    var tierEl = h('p', { class: 'price-box__tier' });
    var hintEl = h('p', { class: 'price-box__hint' });
    var tiers = SE.components.pricingTiers(product);

    var selector = SE.components.quantitySelector({
      id: 'product-qty',
      label: 'Quantity',
      value: 1,
      onChange: function (q) { qty = q; update(); }
    });

    function update() {
      var tier = P.getTier(qty);
      var unit = P.getPriceForQuantity(product, qty);
      unitEl.textContent = fmt.price(unit) + ' / piece';
      totalEl.textContent = fmt.price(P.getLineTotal(product, qty));
      tierEl.textContent = qty + ' × ' + fmt.price(unit) + ' – ' + tier.label + ' pricing (' + P.getRangeLabel(tier) + ')';
      var next = P.getNextTier(qty);
      hintEl.textContent = next
        ? 'Add ' + (next.min - qty) + ' more to unlock ' + next.label + ' pricing at ' + fmt.price(product.pricing[next.priceField]) + ' / piece.'
        : 'You are getting our lowest per-piece price.';
      tiers.update(qty);
    }

    function addToCart() { SE.cartService.add(product.id, qty); }

    var addBtn = h('button', {
      class: 'btn btn--primary', type: 'button',
      onclick: function () {
        addToCart();
        SE.toast.show('Added ' + qty + ' × ' + product.name + ' to your cart.', { label: 'View cart', href: '#/cart' });
      }
    }, 'ADD TO CART');

    var buyBtn = h('button', {
      class: 'btn btn--dark', type: 'button',
      onclick: function () { addToCart(); SE.router.go('/cart'); }
    }, 'BUY NOW');

    var bulkLink = h('a', {
      href: '#/contact',
      onclick: function (e) {
        e.preventDefault();
        SE.state.contactPrefill = 'I would like to enquire about a bulk / academy order for: ' + product.name + '.';
        SE.router.go('/contact');
      }
    }, 'Enquire about bulk orders');

    var specs = h('dl', { class: 'specs' },
      product.specifications.map(function (s) {
        return h('div', { class: 'specs__row' }, h('dt', null, s.label), h('dd', null, s.value));
      })
    );

    var page = h('div', { class: 'container' },
      h('nav', { class: 'breadcrumb', 'aria-label': 'Breadcrumb' },
        h('ol', null,
          h('li', null, h('a', { href: '#/' }, 'Home')),
          h('li', null, h('a', { href: '#/' }, 'Equipment')),
          h('li', { 'aria-current': 'page' }, product.name)
        )
      ),
      h('div', { class: 'product' },
        gallery(product),
        h('div', { class: 'pinfo' },
          h('h1', { class: 'pinfo__title' }, product.name),
          h('p', { class: 'pinfo__short' }, product.shortDescription),

          h('div', { class: 'pinfo__block' },
            h('h2', { class: 'field-label' }, 'QUANTITY'),
            selector.el
          ),
          h('div', { class: 'pinfo__block' },
            h('h2', { class: 'field-label' }, 'PRICING'),
            tiers.el
          ),

          h('div', { class: 'price-box', 'aria-live': 'polite', 'aria-atomic': 'true' },
            h('span', { class: 'price-box__label' }, 'Total'),
            totalEl,
            h('p', null, unitEl),
            tierEl,
            hintEl
          ),

          h('div', { class: 'pinfo__actions' }, addBtn, buyBtn),
          h('p', { class: 'pinfo__bulk' }, 'Need a larger quantity or custom equipment? ', bulkLink, '.'),
          SE.config.showPlaceholderNotice
            ? h('p', { class: 'notice' }, 'Prices, description and specifications are placeholders and will be updated.')
            : null,

          h('div', { class: 'pinfo__block' },
            h('h2', { class: 'pinfo__heading' }, 'Description'),
            h('p', { class: 'pinfo__desc' }, product.description)
          ),
          h('div', { class: 'pinfo__block' },
            h('h2', { class: 'pinfo__heading' }, 'Specifications'),
            specs
          )
        )
      )
    );

    update();
    return page;
  }

  SE.pages.product = {
    title: 'Product',
    render: function (ctx) {
      var S = SE.components.statusBlock;
      var root = h('div', { class: 'product-page' });

      function load() {
        root.replaceChildren(statusSection(S.loading()));
        SE.productService.getProductById(ctx.params.id)
          .then(function (product) {
            if (!ctx.isActive()) return;
            root.replaceChildren(product ? buildPage(product, ctx) : notFound(ctx));
          })
          .catch(function () {
            if (!ctx.isActive()) return;
            root.replaceChildren(statusSection(S.error(load)));
          });
      }

      load();
      return root;
    }
  };
})(window.SE);
