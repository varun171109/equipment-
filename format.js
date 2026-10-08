(function (SE) {
  SE.format = {
    /** 7500 -> "₹7,500"   410.5 -> "₹410.50" */
    price: function (amount) {
      var c = SE.config.currency;
      var hasPaise = Math.round(amount * 100) % 100 !== 0;
      var digits = hasPaise ? 2 : 0;
      var n = new Intl.NumberFormat(c.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
      return c.symbol + n;
    }
  };
})(window.SE);
