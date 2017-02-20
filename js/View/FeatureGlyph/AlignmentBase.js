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
                    color: function(feature, score) {
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
        _drawMismatches: function(context, fRect, mismatches) {
            var feature = fRect.f;
            var block = fRect.viewInfo.block;
            var scale = block.scale;

            var charSize = this.getCharacterMeasurements(context);
            context.textBaseline = 'middle'; // reset to alphabetic (the default) after loop
            var seq = feature.get('seq');
            var quals = feature.get('qual').split(' ');
            var offset = 0;
            var clip = 0;
            var until = seq.length;
            mismatches.sort(function(a,b) {
                return a.start - b.start;
            }); 
            if(mismatches.length) {
                if(mismatches[0].type == 'softclip' && mismatches[0].start == 0) {
                    clip += +mismatches[0].base.substring(1);
                }
                if(mismatches[mismatches.length-1].type == 'softclip' && feature.get('start')+mismatches[mismatches.length-1].start == feature.get('end')) {
                    until -= +mismatches[mismatches.length-1].base.substring(1);
                }
            }

            for (var i = 0; i < until; i++) {
                var start = feature.get('start') + i + clip + offset;
                var end = start + 1 + clip + offset;
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
                context.fillStyle = this.getConf('style.color', [feature, quals[i+clip], seq[i+clip], this.track]);
                context.fillRect(mRect.l, mRect.t, mRect.w+0.6, mRect.h);
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
