export const htmlentities = {
  // FROM: https://ourcodeworld.com/articles/read/188/encode-and-decode-html-entities-using-pure-javascript
  /*
   * Converts a string to its html characters completely.
   *
   * @param {String} str String with unescaped HTML characters
   **/
  encode: function(str) {
    var buf = [];

    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
  },
  /**
   * Converts an html characterSet into its original character.
   *
   * @param {String} str htmlSet entities
   **/
  decode: function(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  },
};

export const stripTags = s => {
  return htmlentities.decode(s.replace(/<[^>]+>/g, ''));
};

export const slugify = s => {
  return s.toLowerCase().replace(/\s+/, '-');
};

export const formatDate = date_obj => {
  let date = date_obj;
  if (!date) return '';
  if (typeof date_obj === 'string') {
    date = new Date(date_obj);
  }
  var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day + ', ' + year;
};

// Check for passive event listeners
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
let passiveIfSupportedComputed = false;
(() => {
  if (typeof window === 'undefined') return;
  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line
        get: function() {
          passiveIfSupportedComputed = { passive: true };
        },
      })
    );
  } catch (err) {}
})();
export const passiveIfSupported = passiveIfSupportedComputed;

export const stringExcerpt = (str, count) => {
  const rawSubstring = str.substring(0, count);
  const reverseIndex = Array.from(rawSubstring)
    .reverse()
    .join('')
    .search(/\s+/);
  const lastIndex = rawSubstring.length - reverseIndex;
  let final = rawSubstring.substring(0, lastIndex);
  if (final.length < str.length) final += '…';
  return final;
};
