# qualityglyphs

A plugin to plot quality stats on BAM reads


## Glyphs

- AlignmentBaseQuality - Plot per-base quality scores
- AlignmentLetters - Plot each letter in different color, so pileup creates stripe pattern
- AlignmentMQ - Plot mapping quality scores (MQ tag)

## Configuration

    [tracks.longreads]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentBaseQuality


    [tracks.longreads_bases]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentLetters


    [tracks.longreads_mq]
    urlTemplate = file.bam
    type = Alignments2
    glyph = QualityGlyphs/View/FeatureGlyph/AlignmentMQ

## Notes

Incompatible with NeatCanvasFeatures which does not allow hsl colors as of writing

## Screenshot

![](img/example.png)

Shows a variety of glyphs. First track is AlignmentsBaseQuality shown in green with per-base scores (all bases had approx equal scores). Second track with red/blue is stock jbrowse. Striped color track is AlignmentLetters. Bottom orange is AlignmentMQ showing mapping quality.

## Configuration

See test/tracks.conf for sample config
