var x = 1;
define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'QualityGlyphs/View/FeatureGlyph/AlignmentBase'
],
function(
    declare,
    array,
    AlignmentBase
) {
    return declare(AlignmentBase, {
        _defaultConfig: function() {
            return this._mergeConfigs(dojo.clone(this.inherited(arguments)), {
                style: {
                    baseColor: function(feature, score) {
                        var ret = 'hsl(100,80%,' + (+score||0)/2.5 + '%)';
                        if(x++<10) console.log(ret,score);
                        return ret;
                    }
                }
            });
        }
    });
});
