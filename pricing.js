/**
 * Tiered pricing logic. Tier boundaries live in config.tiers and each
 * product's prices live in product.pricing, so nothing is hard-coded here.
 */
(function (SE) {
  function tiers() {
    return SE.config.tiers.slice().sort(function (a, b) { return a.min - b.min; });
  }

  var pricing = {
    /** Whole number between 1 and config.maxQuantity. */
    clampQuantity: function (value) {
      var n = Math.floor(Number(value));
      if (!isFinite(n) || n < 1) return 1;
      return Math.min(n, SE.config.maxQuantity);
    },

    /** The tier that applies to a quantity. */
    getTier: function (quantity) {
      var q = pricing.clampQuantity(quantity);
      var list = tiers();
      var found = list[0];
      list.forEach(function (t) { if (q >= t.min) found = t; });
      return found;
    },

    /** The tier after the one currently applied, or null if already on the last. */
    getNextTier: function (quantity) {
      var list = tiers();
      var current = pricing.getTier(quantity);
      var index = list.indexOf(current);
      return index >= 0 && index < list.length - 1 ? list[index + 1] : null;
    },

    /**
     * THE one function that decides the per-piece price for a quantity:
     *   1-19 -> retail, 20-49 -> bulk20, 50+ -> bulk50
     * (product.pricing is filled from retail_price / bulk_20_price /
     * bulk_50_price in the database; see productService.mapRow).
     */
    getPriceForQuantity: function (product, quantity) {
      return product.pricing[pricing.getTier(quantity).priceField];
    },

    getLineTotal: function (product, quantity) {
      var q = pricing.clampQuantity(quantity);
      // rounded to paise so decimal prices never show 0.1 + 0.2 style artefacts
      return Math.round(q * pricing.getPriceForQuantity(product, q) * 100) / 100;
    },

    /** "1–19 pieces" or "50+ pieces" */
    getRangeLabel: function (tier) {
      return tier.max == null
        ? tier.min + '+ pieces'
        : tier.min + '–' + tier.max + ' pieces';
    },

    /** Price shown as "Starting from" on product cards (single piece). */
    getStartingPrice: function (product) {
      return product.pricing[tiers()[0].priceField];
    },

    /** Lowest per-piece price across all tiers. */
    getLowestPrice: function (product) {
      return Math.min.apply(null, tiers().map(function (t) { return product.pricing[t.priceField]; }));
    }
  };

  // Older name still used by the product page and cart.
  pricing.getUnitPrice = pricing.getPriceForQuantity;

  SE.pricing = pricing;
})(window.SE);
