# AI/ML Study

Working repo for my AI/ML engineering study. Python, scikit-learn, pandas, and neural networks — building toward AI/ML engineering and research.

## Layout

| Path | What's in it |
|---|---|
| `Day_1/` … `Day_22/` | Daily study sessions, in order. Each folder holds that day's notebooks and scripts. |
| `Notebooks/` | Larger standalone projects and topic deep-dives that span more than one day. |
| `datasets/` | Datasets used by the notebooks. |
| `csv files/` | Loose CSVs from earlier pandas practice. |
| `logs/` | Daily progress notes — see [logs/README.md](logs/README.md). |
| `requirements.txt` | Python dependencies. |

## Progress so far

**Days 1–11 — Python foundations**
Syntax, control flow, functions, file I/O, classes.

**Notebooks — data and classical ML**
pandas (`groupby`, merges, feature engineering), SQL practice (`Learning_SQL.ipynb`, `school.db`), then models: decision trees, random forests, k-means, and full preprocessing pipelines (`Credit_Card_Pipeline.ipynb`, `full_scale_pipeline.ipynb`).

**Day 21 — neural networks**
`MLPClassifier`, loss curves, and learning-rate behavior.

**Day 22 — image classification**
Handwritten digits (`load_digits`). Logistic-regression baseline vs. MLP, confusion matrices, and a cross-validated sweep of hidden-layer sizes.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Housekeeping notes

A few things worth cleaning up when there's time:

- Day folders jump from `Day_11` to `Day_21` — the days in between live in `Notebooks/` under topic names rather than day numbers. Worth deciding on one convention.
- `Notebooks/Untitled.ipynb` needs a real name.
- `Notebooks/notebooks-20260731T105803Z-1-001.zip` is a downloaded archive; if it's already extracted, it can go.
- `csv files/` and `datasets/` overlap — consolidating them under `datasets/` would simplify paths.

*(Left in place rather than moved, since renaming folders would break the relative paths inside the notebooks.)*
