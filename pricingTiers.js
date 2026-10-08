/**
 * The three-tier price list on the product page.
 * returns { el, update(quantity) }. update() highlights the active tier.
 */
(function (SE) {
  var h = SE.h;
  var fmt = SE.format;
  var P = SE.pricing;

  SE.components.pricingTiers = function (product) {
    var rows = SE.config.tiers.map(function (tier) {
      var li = h('li', { class: 'tier', 'data-tier': tier.key },
        h('div', { class: 'tier__info' },
          h('span', { class: 'tier__range' }, P.getRangeLabel(tier)),
          h('span', { class: 'tier__name' }, tier.label)
        ),
        h('div', { class: 'tier__side' },
          h('span', { class: 'tier__badge', 'aria-hidden': 'true' }, 'APPLIED'),
          h('span', { class: 'tier__price' }, fmt.price(product.pricing[tier.priceField]) + ' / piece')
        )
      );
      return { tier: tier, li: li };
    });

    var el = h('ul', { class: 'tiers', 'aria-label': 'Quantity pricing tiers' },
      rows.map(function (r) { return r.li; }));

    function update(quantity) {
      var active = P.getTier(quantity).key;
      rows.forEach(function (r) {
        var on = r.tier.key === active;
        r.li.classList.toggle('tier--active', on);
        if (on) r.li.setAttribute('aria-current', 'true');
        else r.li.removeAttribute('aria-current');
      });
    }

    update(1);
    return { el: el, update: update };
  };
})(window.SE);
