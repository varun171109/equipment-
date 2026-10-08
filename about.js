(function (SE) {
  var h = SE.h;

  function pillar(title, text) {
    return h('div', { class: 'pillar' }, h('h2', null, title), h('p', null, text));
  }

  SE.pages.about = {
    title: 'About',
    render: function () {
      return h('div', null,
        h('section', { class: 'page-hero' },
          h('div', { class: 'container' },
            h('p', { class: 'eyebrow' }, 'About'),
            h('h1', null, 'Born from Silambam. Built for Silambam.')
          )
        ),
        h('section', { class: 'section' },
          h('div', { class: 'container' },
            h('div', { class: 'about-copy' },
              h('p', null, 'We focus on providing quality Silambam training equipment for practitioners, trainers and academies.'),
              h('p', null, 'Whether you are a student starting out, a parent buying for a child, a trainer equipping a class, or an academy ordering in bulk, our aim is the same: dependable equipment that respects the art.')
            ),
            h('div', { class: 'pillars' },
              pillar('Practitioners', 'Equipment for individual practice, at retail prices for single pieces.'),
              pillar('Trainers', 'Equipment for classes and demonstrations, with better prices as quantities grow.'),
              pillar('Academies', 'Bulk and academy pricing for larger orders.')
            ),
            h('p', { class: 'notice' }, 'More about the business will be added here soon.')
          )
        )
      );
    }
  };
})(window.SE);
