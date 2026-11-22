# Dataset audit — pending

No dataset files have been downloaded or inspected. None is approved for
training. The following links are candidates supplied in the project brief,
not verified sources or endorsed datasets.

| Candidate | Intended investigation | Current status |
| --- | --- | --- |
| [Mendeley tm3v4zmh7c v1](https://data.mendeley.com/datasets/tm3v4zmh7c/1) | Public chilli disease images | Unverified |
| [Project-AgML COLD](https://huggingface.co/datasets/Project-AgML/COLD_chili_leaf_disease_classification) | Secondary public image source | Unverified |
| [Sri Lankan Nai Miris agronomic dataset](https://www.kaggle.com/datasets/isurujayasuriya452/sri-lankan-nai-miris-agronomic-dataset) | Inspect modality and agronomic relevance | Unverified; do not assume images |

Phase 4 must record availability, access/download procedure, dataset version,
license and permitted use, source domain, taxon/cultivar evidence, original image
counts, class distribution and definitions, image quality, exact/perceptual
duplicates, pre-generated augmentation, and compatibility of label semantics.
Unknown values must remain unknown until inspected; do not infer image counts
from filenames or marketing descriptions.

Each original photograph should have a stable ID and checksum. Record plant,
session, collection location, and original/augmentation relationships where
available. Preserve group membership across train/validation/test partitions.
Review potential leakage and missing provenance before approving training.

Use [the metadata schema](../datasets/metadata/README.md) when the audit begins.
Local Nai Miris evaluation requires independently collected, expert-reviewed
images and must not reuse fine-tuning plants or sessions.
