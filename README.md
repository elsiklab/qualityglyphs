# qualityglyphs

A plugin to plot quality stats on BAM reads

## Configuration

    [tracks.longreads]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentNGS


    [tracks.longreads_bases]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentBase
