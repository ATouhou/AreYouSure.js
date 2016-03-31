/*!
 * jQuery AreYouSure 1.0.0
 *
 * Copyright 2016 Nikolaj Løvenhardt Petersen
 * Released under the MIT license
 */
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.areYouSure = function (fn) {
        // Remove listener
        if (fn == 'remove') {
            areYouSure.elements = $.grep(areYouSure.elements, function (element) {
                return (element != this);
            });

            return;
        }

        // Add listener
        var opts = $.extend({}, $.fn.areYouSure.defaults, fn);

        return areYouSure.bindListener(this, opts);
    };

    // Plugin defaults
    $.fn.areYouSure.defaults = {
        except: '',
        warningText: 'You have made changes that have not been saved. Do you want to leave?'
    };

    // Exception
    function AreYouSureException (msg) {
        this.message = msg;

        /**
         * Get message
         *
         * @returns {*}
         */
        this.getMessage = function () {
            return this.message;
        }
    }

    var areYouSure = {
        elements: [],
        slug: 'areyousure-',

        /**
         * Validate elements
         *
         * @returns {string}
         */
        validate: function () {
            try {
                areYouSure.elements.forEach(function (elm) {
                    var $elm = $(elm);

                    // Initial values and values now
                    var initial = $elm.data(areYouSure.slug + 'serialize');
                    var now = $elm.serialize();

                    // No changes or disabled
                    if (initial == now || $elm.data(areYouSure.slug + 'disabled') == 'disabled') {
                        return false;
                    }

                    // Confirm with warning text
                    throw new AreYouSureException($elm.data(areYouSure.slug + 'warningText'));
                });
            } catch (e) {
                // Check for other exceptions
                if (!(e instanceof AreYouSureException)) {
                    throw e;
                }

                return e.getMessage();
            }
        },

        /**
         * Bind listener to element(s)
         *
         * @param selector
         * @param opts
         */
        bindListener: function (selector, opts) {
            var $elements = $(selector).not(opts.except);

            // Set options
            $elements.data(areYouSure.slug + 'except', opts.except);
            $elements.data(areYouSure.slug + 'warningText', opts.warningText);

            // Detect if element or parent element is a form
            $.each($elements, function (key, elm) {
                var $elm = $(elm);

                // Add listener to list
                areYouSure.elements.push(elm);

                if ($elm.is('form')) {
                    $elm.on('submit', function () {
                        $elm.data(areYouSure.slug + 'disabled', 'disabled');
                    });
                }

                $elm.parents('form').on('submit', function () {
                    $elm.data(areYouSure.slug + 'disabled', 'disabled');
                });
            });

            areYouSure.setData($elements);
        },

        /**
         * Set data
         *
         * @param $elements
         */
        setData: function ($elements) {
            $elements.each(function (key, elm) {
                var $elm = $(elm);
                $elm.data(areYouSure.slug + 'serialize', $elm.serialize());
            });
        }
    };

    // Add event on before unload
    $(window).on('beforeunload', function () {
        return areYouSure.validate();
    });
}));