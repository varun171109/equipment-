(function (SE) {
  var h = SE.h;
  var fmt = SE.format;
  var P = SE.pricing;

  SE.components.productCard = function (product) {
    var image = SE.media.getProductImages(product)[0];
    var href = '#/product/' + product.id;
    var lastTier = SE.config.tiers[SE.config.tiers.length - 1];

    return h('article', { class: 'product-card' },
      h('a', { class: 'product-card__media', href: href, tabindex: '-1', 'aria-hidden': 'true' },
        h('img', { src: image.src, alt: image.alt, loading: 'lazy', width: '800', height: '800' })
      ),
      h('div', { class: 'product-card__body' },
        h('h3', { class: 'product-card__title' }, product.name),
        h('p', { class: 'product-card__desc' }, product.shortDescription),
        h('div', { class: 'product-card__footer' },
          h('span', { class: 'product-card__price-label' }, 'Starting from'),
          h('p', { class: 'product-card__price' }, fmt.price(P.getStartingPrice(product))),
          h('p', { class: 'product-card__bulk' },
            lastTier.min + '+ pieces: ' + fmt.price(product.pricing[lastTier.priceField]) + ' / piece'),
          h('a', { class: 'btn btn--outline btn--block', href: href },
            'VIEW PRODUCT',
            h('span', { class: 'visually-hidden' }, ': ' + product.name)
          )
        )
      )
    );
  };
})(window.SE);
