# AI/ML Study

Working repo for my AI/ML engineering study. Python, scikit-learn, pandas, and neural networks — building toward AI/ML engineering and research.

## Layout

| Path | What's in it |
|---|---|
| `Day_1/` … `Day_32/` | Daily study sessions, in order. Each folder holds that day's notebooks and scripts. |
| `Projects/` | Self-directed builds that outgrew a single day. |
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

**Days 23–26 — NLP and retrieval**
Bag-of-words and TF-IDF, cosine similarity from scratch, a sliding-window RAG pipeline over a PDF (TF-IDF → TruncatedSVD → Normalizer), then retrieval-augmented generation against a Gemini endpoint with an adversarially tested guardrail.

**Days 27–28 — PyTorch**
Tensors and autograd by hand (manual forward/backward/step loop), then the same loop rebuilt with `nn.Linear`, `nn.MSELoss`, and `torch.optim.SGD`. A `nn.Sequential` MLP on `load_digits` with `CrossEntropyLoss`. Reranking of PDF chunks started. Day 28 later re-run on `torch.optim.Adam` to compare convergence against SGD.

**Days 29–30 — embeddings and tokenization**
`nn.Embedding` as a trainable lookup table, mean pooling as a sentence encoder, and a small `nn.Module` sentiment classifier trained end to end on a hand-built vocabulary (`Day_29/sentiment_checker.ipynb`). Byte-pair encoding with HuggingFace `tokenizers` — a `BpeTrainer` trained from scratch on raw reviews, subword output inspected, then `[PAD]`/`[UNK]` special tokens and batch padding (`Day_30/Tokenizer.ipynb`, `Notebooks/tokenizer.ipynb`). First pretrained model call via `transformers.pipeline("sentiment-analysis")`.

**Days 31–32 — vector databases**
Retrieval moved out of hand-written cosine similarity and into ChromaDB: LSA embeddings (TF-IDF → `TruncatedSVD`) fitted once and reused via `.transform()`, collections created with an explicit cosine space, and `col.query()` for nearest-neighbour search over 287 review chunks (`Day_31/RAG_Again.ipynb`) and over a chunked PDF (`Day_32/RAG_Chroma_Syllabus.ipynb`). Hybrid keyword + vector search with an `alpha` blend covered in class (`Notebooks/RAG_again_wtih_chroma.ipynb`).

**Projects — RAG Lyrics Generator**
Timestamped transcript search, shipped as a FastAPI backend (`video-search/backend/transcript_search.py`) with a React + TypeScript frontend. `RAG_lyrics.ipynb` imports that engine and serves as the evaluation harness — gold query set, `chunk_size` sweep, TF-IDF vs LSA, score-threshold histogram.

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
- `requirements.txt` is a full `pip freeze` from 21 July saved as UTF-16 — it renders as garbage and is missing `chromadb`, `tokenizers`, `transformers`, `pymupdf` and `torch`. Regenerate as UTF-8, or hand-write a short list of only what's actually imported.
- New notebooks belong in a `Day_NN/` folder, not the repo root — the daily sync will file stray root notebooks into the current day folder.
- `Notebooks/notebooks-20260731T105803Z-1-001.zip` is a downloaded archive; if it's already extracted, it can go.
- `csv files/` and `datasets/` overlap — consolidating them under `datasets/` would simplify paths.

*(Left in place rather than moved, since renaming folders would break the relative paths inside the notebooks.)*
