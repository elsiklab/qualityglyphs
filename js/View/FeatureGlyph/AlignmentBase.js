define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'JBrowse/View/FeatureGlyph/Alignment'
],
function (
    declare,
    array,
    Alignment
) {
    return declare(Alignment, {
        _defaultConfig: function () {
            return this._mergeConfigs(dojo.clone(this.inherited(arguments)), {
                style: {
                    baseColor: function () {
                        return 'grey';
                    },
                    color: function () {
                        return 'grey';
                    },
                    strandArrow: false,
                    height: 7,
                    marginBottom: 1,
                    showMismatches: true,
                    mismatchFont: 'bold 10px Courier New,monospace'
                }
            });
        },

        // draw both gaps and mismatches
        _drawMismatches: function (context, fRect, mismatches) {
            var feature = fRect.f;
            var block = fRect.viewInfo.block;
            var scale = block.scale;
            var correctionFactor = 0;
            if (scale >= 1) {
                correctionFactor = 0.6;
            } else if (scale >= 0.2) {
                correctionFactor = 0.1;
            } else if (scale >= 0.02) {
                correctionFactor = 0.03;
            }

            var reg = this.track.browser.view.visibleRegion();
            var rw = reg.end - reg.start;

            var charSize = this.getCharacterMeasurements(context);
            context.textBaseline = 'middle'; // reset to alphabetic (the default) after loop
            var seq = feature.get('seq');
            var quals = feature.get('qual').split(' ');
            var offset = 0;
            var clip = 0;
            var until = seq.length;
            var skipMap = {};

            if (mismatches.length) {
                mismatches.sort(function (a, b) {
                    return a.start - b.start;
                });
                if (mismatches[0].type === 'softclip' && mismatches[0].start === 0) {
                    clip += +mismatches[0].base.substring(1);
                }
                if (mismatches[mismatches.length - 1].type === 'softclip' && feature.get('start') + mismatches[mismatches.length - 1].start === feature.get('end')) {
                    until = mismatches[mismatches.length - 1].start;
                }
                for (var j = 0; j < mismatches.length; j++) {
                    if (mismatches[j].type === 'skip') {
                        skipMap[mismatches[j].start] = mismatches[j].length;
                    }
                }
            }

            for (var i = 0; i < until; i++) {
                var start = feature.get('start') + i + clip + offset;
                var end = start + 1;
                var mRect;

                if (skipMap[i]) {
                    offset += skipMap[i];
                }


                mRect = {
                    h: (fRect.rect || {}).h || fRect.h,
                    l: block.bpToX(start),
                    t: fRect.rect.t
                };
                mRect.w = Math.max(block.bpToX(end) - mRect.l, 1);
                if (start > (reg.start - rw / 2) && start < (reg.end + rw / 2)) {
                    context.fillStyle = this.getConf('style.baseColor', [feature, quals[i + clip] || 0, seq[i + clip], this.track]);
                    context.fillRect(mRect.l, mRect.t, mRect.w + correctionFactor, mRect.h);
                    if (mRect.w >= charSize.w && mRect.h >= charSize.h - 3) {
                        context.font = this.config.style.mismatchFont;
                        context.fillStyle = 'white';
                        context.fillText(seq[i], mRect.l + (mRect.w - charSize.w) / 2 + 1, mRect.t + mRect.h / 2);
                    }
                }
            }
            context.textBaseline = 'alphabetic';
            this.inherited(arguments);
        }
    });
});
