import jQuery from 'jquery';

// var $ = jQuery.noConflict();

(function($) {
  if (typeof window === 'undefined') return;

  $(document).ready(function() {});

  $(window).on('load', function() {
    jQuery(".svg-convert").each(function () {
      var getImgWd = $(this).width();
      var getImgHt = $(this).height();
      var $img = jQuery(this);
      var imgID = $img.attr("id");
      var imgClass = $img.attr("class");
      var imgURL = $img.attr("src");
      jQuery.get(
        imgURL,
        function (data) {
          var $svg = jQuery(data).find("svg");
          if (typeof imgID !== "undefined") {
            $svg = $svg.attr("id", imgID);
          }
          if (typeof imgClass !== "undefined") {
            $svg = $svg.attr("class", imgClass + " svg-img");
          }
          $svg = $svg.removeAttr("xmlns:a");
          $img.replaceWith($svg);
        },
        "xml"
      );
    });
  });

  $(window).on('resize', function() {});

  $(window).on('scroll', function() {});
})(jQuery);
