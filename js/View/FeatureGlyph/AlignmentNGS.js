define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'JBrowse/View/FeatureGlyph/Box',
    'JBrowse/Store/SeqFeature/_MismatchesMixin'
],
function(
    declare,
    array,
    BoxGlyph,
    MismatchesMixin
) {

    return declare([BoxGlyph, MismatchesMixin], {

        constructor: function() {

            // if showMismatches is false, stub out this object's
            // _drawMismatches to be a no-op
            if (!this.config.style.showMismatches)
                this._drawMismatches = function() {};

        },

        _defaultConfig: function() {
            return this._mergeConfigs(dojo.clone(this.inherited(arguments)), {
                style: {
                    strandArrow: false,
                    height: 7,
                    marginBottom: 1,
                    showMismatches: true,
                    mismatchFont: 'bold 10px Courier New,monospace'
                }
            });
        },

        renderFeature: function(context, fRect) {
            this.inherited(arguments);
            if (fRect.w > 2) {
                if (fRect.viewInfo.scale > 0.2)
                    this._drawMismatches(context, fRect, this._getMismatches(fRect.f));
                else
                    this._drawMismatches(context, fRect, this._getSkipsAndDeletions(fRect.f));
            }
        },

        // draw both gaps and mismatches
        _drawMismatches: function(context, fRect, mismatches) {
            var feature = fRect.f;
            var block = fRect.viewInfo.block;
            var scale = block.scale;

            var charSize = this.getCharacterMeasurements(context);
            context.textBaseline = 'middle'; // reset to alphabetic (the default) after loop
            var seq = feature.get('seq');
            var quals = feature.get('qual').split(' ');

            for (var i = 0; i < seq.length; i++) {
                var start = feature.get('start') + i;
                var end = start + 1;

                var mRect = {
                    h: (fRect.rect || {}).h || fRect.h,
                    l: block.bpToX(start),
                    t: fRect.rect.t
                };
                mRect.w = Math.max(block.bpToX(end) - mRect.l, 1);
                context.fillStyle = 'hsl(100,80%,' + parseInt(quals[i]) + '%)';
                for (var j = 0; j < mismatches.length; j++) {
                    if (feature.get('start') + mismatches[j].start == start) {
                        context.fillStyle = 'hsl(20,80%,' + parseInt(quals[i]) + '%)';
                    }
                }
                context.fillRect(mRect.l, mRect.t, mRect.w, mRect.h);
                if (mRect.w >= charSize.w && mRect.h >= charSize.h - 3) {
                    context.font = this.config.style.mismatchFont;
                    context.fillStyle = 'white';
                    context.fillText(seq[i], mRect.l + (mRect.w - charSize.w) / 2 + 1, mRect.t + mRect.h / 2);
                }
            }


            context.textBaseline = 'alphabetic';
        },

        getCharacterMeasurements: function(context) {
            return this.charSize = this.charSize || function() {
                var fpx;

                try {
                    fpx = (this.config.style.mismatchFont.match(/(\d+)px/i) || [])[1];
                } catch (e) {}

                fpx = fpx || Infinity;
                return { w: fpx, h: fpx };
            }.call(this);
        }

    });
});
