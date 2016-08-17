define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'JBrowse/View/FeatureGlyph/Alignment'
],
function(
    declare,
    array,
    Alignment
) {
    return declare(Alignment, {
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

        // draw both gaps and mismatches
        _drawMismatches: function(context, fRect, mismatches) {
            var feature = fRect.f;
            var block = fRect.viewInfo.block;
            var scale = block.scale;

            var charSize = this.getCharacterMeasurements(context);
            context.textBaseline = 'middle'; // reset to alphabetic (the default) after loop
            var seq = feature.get('seq');
            var quals = feature.get('qual').split(' ');
            var offset = 0;

            for (var i = 0; i < seq.length; i++) {
                var start = feature.get('start') + i + offset;
                var end = start + 1 + offset;
                var mRect;

                for (var j = 0; j < mismatches.length; j++) {
                    if (mismatches[j].start == i && mismatches[j].type == 'skip') {
                        offset += mismatches[j].length;
                    }
                }

                start = feature.get('start') + i + offset;
                end = start + 1;
                mRect = {
                    h: (fRect.rect || {}).h || fRect.h,
                    l: block.bpToX(start),
                    t: fRect.rect.t
                };
                mRect.w = Math.max(block.bpToX(end) - mRect.l, 1);
                context.fillStyle = 'hsl(100,80%,' + parseInt(quals[i]) + '%)';
                context.fillRect(mRect.l, mRect.t, mRect.w, mRect.h);
                if (mRect.w >= charSize.w && mRect.h >= charSize.h - 3) {
                    context.font = this.config.style.mismatchFont;
                    context.fillStyle = 'white';
                    context.fillText(seq[i], mRect.l + (mRect.w - charSize.w) / 2 + 1, mRect.t + mRect.h / 2);
                }
            }
            context.textBaseline = 'alphabetic';
            this.inherited(arguments);
        }
    });
});
