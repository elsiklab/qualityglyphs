# qualityglyphs

A plugin to plot quality stats on BAM reads


## Glyphs

- AlignmentNGS - Plot base all letters
- AlignmentBase - Plot base quality scores
- AlignmentMQ - Plot mapping quality scores

## Configuration

    [tracks.longreads]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentNGS


    [tracks.longreads_bases]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentBase


    [tracks.longreads_mq]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentMQ

## Notes

Incompatible with NeatCanvasFeatures which does not allow hsl colors as of writing
