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
                    color: function (feature) {
                        var mq = feature.get('mq');
                        return mq ? 'hsl(20,80%,' + mq + '%)' : 'orange';
                    }
                }
            });
        }
    });
});
