// https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
const $ = window.jQuery;

const animate = {
  getObserverSegmentation: function ($ele) {
    $ele.each(function () {
      if (!$(this).data('animation-offset')) {
        $(this).attr('data-animation-offset', 'top-into-view');
      }
    });

    const collections = {
      'top-into-view': $ele.filter('[data-animation-offset="top-into-view"]'),
      'top-mid-of-view': $ele.filter(
        '[data-animation-offset="top-mid-of-view"]'
      ),
      'bottom-in-view': $ele.filter('[data-animation-offset="bottom-in-view"]')
    };

    $.each(collections, function (index, item) {
      if (!item.length) {
        delete collections[index];
      }
    });

    if (Object.keys(collections).length === 0) {
      collections['top-into-view'] = $ele;
    }

    return collections;
  },

  getAnimationIntersectionData: function (e) {
    let t = '';
    let threshold = 0;
    let margin = '0px 0px 0px 0px';

    if (typeof e === 'string') {
      t = e;
    } else if (e.data('animation-offset')) {
      t = e.data('animation-offset');
    }

    if (t === 'top-mid-of-view') {
      margin = '0px 0px -50% 0px';
    }

    if (t === 'bottom-in-view') {
      threshold = [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1];
    }

    return {
      root: null,
      rootMargin: margin,
      threshold: threshold,
    };
  },

  shouldObserverEntryAnimate: function (entry, option) {
    // entry.boundingClientRect
    // entry.intersectionRatio
    // entry.intersectionRect
    // entry.isIntersecting
    // entry.rootBounds
    // entry.target
    // entry.time

    let enter = false;
    let ratio = 1;

    if (option.thresholds.length > 1) {
      if (entry.boundingClientRect.height > entry.rootBounds.height) {
        ratio = entry.rootBounds.height / entry.boundingClientRect.height;

        let l = option.thresholds.filter(function (threshold) {
          return threshold >= entry.intersectionRatio && threshold <= ratio;
        }).length;

        if (!l) {
          enter = true;
        }
      } else if (entry.isIntersecting) {
        entry.intersectionRatio = 1;
        enter = true;
      }
    } else if (entry.isIntersecting) {
      enter = true;
    }

    return enter;
  },
};

window.awbAnimationObservers = {};

$.fn.initElementAnimations = function () {
  $.each(window.awbAnimationObservers, (index, item) => {
    $.each(item[0], (n, i) => {
      item[1].unobserve(i);
    });

    delete window.awbAnimationObservers[index];
  });

  $.each(
    animate.getObserverSegmentation($(this)),
    function (key) {
      const option = animate.getAnimationIntersectionData(key);
      const observer = new IntersectionObserver(function (entries, _observer) {
        $.each(entries, function (index, entry) {
          // https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry

          let animationClassName;
          let animationDuration;
          let enter;

          let $element = $(entry.target);

          if (entry.isIntersecting) {
            enter = true;

            if (option.threshold) {
              
              if ($(window).height() < $element.outerHeight()) {
                if (
                  $(window).height() / $element.outerHeight() >
                  entry.intersectionRatio
                ) {
                  enter = false;
                }
              } else if (entry.intersectionRatio < 1) {
                enter = false;
              }
            }
          }

          if (enter) {
            if (!$element.parents('.delayed-animation').length) {
              $element.css('visibility', 'visible');
            }

            animationClassName = $element.data('animation-type');
            animationDuration = $element.data('animation-duration');

            $element.addClass(animationClassName);

            if (animationDuration) {
              $element.css('animation-duration', animationDuration + 's');
            }

            setTimeout(function () {
              $element.removeClass(animationClassName);
            }, 1000 * animationDuration);

            _observer.unobserve(entry.target);
          }
        });
      }, option);

      $(this).each(function () {
        observer.observe(this);
      });

      window.awbAnimationObservers[key] = [this, observer];
    }
  );
};

$.fn.initAnimatePostCards = function () {
  $.each(animate.getObserverSegmentation($(this)), function (item) {
    let option = animate.getAnimationIntersectionData(item);
    let observer = new IntersectionObserver(function (entries, _observer) {
      $.each(entries, function (index, entry) {
        const $element = $(entry.target);
        const animationClass = $element.attr('data-animation-type');
        const animationDuration = $element.attr('data-animation-duration');
        const animationDelay = parseInt(1000 * $element.attr('data-animation-delay'), 10);
        let countDelay = 0;
        
        if (animate.shouldObserverEntryAnimate(entry, _observer)) {
          $element.find('.animate-card').each(function () {
            let $ele = $(this);

            setTimeout(function () {
              $ele.css('visibility', 'visible');
              $ele.addClass(animationClass);

              if (animationDuration) {
                $ele.css('-moz-animation-duration', animationDuration + 's');
                $ele.css('-webkit-animation-duration', animationDuration + 's');
                $ele.css('-o-animation-duration', animationDuration + 's');
                $ele.css('animation-duration', animationDuration + 's');
              }
                
              setTimeout(function () {
                $ele.removeClass(animationClass);
              }, 1000 * animationDuration);
            }, countDelay);

            countDelay += animationDelay;
          });
          _observer.unobserve(entry.target);
        }
      });
    }, option);

    $(this).each(function () {
      observer.observe(this);
    });
  });
};

$('.ui-animate').initElementAnimations();
$('.ui-animate-card').initAnimatePostCards();
