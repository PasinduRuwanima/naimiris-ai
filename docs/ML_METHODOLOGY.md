# ML methodology — planned

No training or evaluation has been run. This document defines the future protocol.

1. Audit actual dataset files, licenses, domain, labels, and provenance.
2. Freeze explicit label mappings. Do not merge incompatible disease labels.
3. Detect duplicates and group originals, plants, sessions, and augmented copies
   before creating seeded train/validation/test manifests.
4. Fit preprocessing only on training data; augment training images only.
5. Compare a Custom CNN and transfer-learning MobileNetV3, EfficientNet-B0, and
   ResNet50 with identical splits and a documented tuning budget.
6. Select with validation macro F1 when classes are imbalanced. Freeze the model
   and thresholds before final test evaluation; never tune on the test set.
7. Report accuracy, macro precision/recall/F1, per-class precision/recall, confusion
   matrix, latency with hardware/batch details, and serialized model size.
8. Export checkpoint, checksum, class order, preprocessing, dependency versions,
   random seeds, dataset/split IDs, and validation-derived uncertainty thresholds.

Stages: A public training; B held-out public evaluation; C verified local photo
collection; D local fine-tuning; E independent local evaluation. Until E has
completed, Nai Miris-specific performance is **not established**.

Future local integration will use immutable manifests with plant/session groups
and expert-reviewed labels. Data inspection, splitting, training, evaluation,
comparison, and inference scripts belong in the [ML workspace](../ml/README.md)
and will be implemented in Phases 4–6. A folder is not a working ML pipeline.
