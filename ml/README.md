# ML workspace

Phase 1 creates the workspace only. No trained model, executable training
pipeline, dataset, experiment result, or evaluation notebook exists yet.

| Directory | Future responsibility |
| --- | --- |
| `configs/` | Versioned hyperparameters and reproducible seeds |
| `data/` | Audit, cleaning, label mapping, leakage-safe split tooling |
| `models/` | Architecture definitions; checkpoints live externally |
| `training/` | Training loops and validation selection |
| `evaluation/` | Test metrics, confusion matrices, consistent comparisons |
| `inference/` | Validated artifact loading and shared preprocessing |
| `notebooks/` | Explicitly requested Colab-compatible experiment notebooks |

Add PyTorch, Torchvision, scikit-learn, pandas, NumPy, Pillow, and Matplotlib in
Phases 4–5 with a tested CPU/GPU-compatible environment. Do not install them
merely to populate folders. Follow [the methodology](../docs/ML_METHODOLOGY.md).
