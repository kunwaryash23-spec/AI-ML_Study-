# Daily Logs

One file per day, named `YYYY-MM-DD.md`. Each entry records what was worked on, which concepts were covered, mistakes worth remembering, and what to pick up next.

These are written automatically by the daily GitHub sync task. On days with no new work, the entry says so and summarizes the most recent session instead.

## Index

| Date | Summary |
|---|---|
| [2026-08-06](2026-08-06.md) | No new work. Recap of Day 21 loss curves + scaler data-leak note. |
| [2026-08-07](2026-08-07.md) | Day 22 — digit recognition. LogReg 0.978 beat MLP 0.962; hidden-size CV sweep. |
| [2026-08-13](2026-08-13.md) | Days 23–26 + first project. TF-IDF → embeddings → RAG → LLM call; lyrics retriever. **Leaked API key scrubbed — rotate it.** |
| [2026-08-13](2026-08-13.md#2026-08-13--sync-2-0933) | *(sync 2)* No new work. Ignored a stray 17 MB zip; key rotation + `.env` still outstanding. |
| [2026-08-15](2026-08-15.md) | Days 27–28 — PyTorch from autograd up to `nn.Sequential` on digits. Lyrics project shipped as a FastAPI + React app; notebook became an eval harness. **Test accuracy computed but never printed.** |
| [2026-08-19](2026-08-19.md) | Days 29–30 — first embeddings: `nn.Embedding` + mean pooling → sentiment net. BPE tokenizer started. Day 28 re-run on Adam. **Day 28 scaler commented out — notebook no longer reproducible.** |
| [2026-08-21](2026-08-21.md) | Days 31–32 — BPE trained and producing subwords; first `transformers` pipeline; retrieval moved into Chroma. **Day 31 retrieval returns wrong docs: `n_components=2` collapses 287 chunks into 2-D.** |
| [2026-08-24](2026-08-24.md) | Scripts → classes. `Network(nn.Module)` with `fit`/`predict`/`score` hits 97.4% on MNIST; `Retriever` class fixes the `fit_transform`-per-query bug and drops the 2-D SVD. RAGAS + LLM-metadata notebooks blocked on kernel/quota. **Two more keys scrubbed — rotate them; five older files still leak in history.** |
| [2026-08-25](2026-08-25.md) | Days 33-34 - first tool-calling agent; persistent Chroma + search tool; two kinds of agent memory. **Live RCE demoed via `eval()`; `list_notes` can't feed `delete_note`; notebook cells run out of order.** |
| [2026-08-26](2026-08-26.md) | Day 35 - custom system prompt, 4 tools, provider swapped to OpenRouter. **Notebook never ran past cell 3: `TOOLS` references tools defined below it, `random_excuse` undefined. Two keys scrubbed (one a regression) - rotate them.** |
| [2026-08-27](2026-08-27.md) | First shipped agent app — `ai_blog_search_v1`: LangGraph Corrective RAG (agent → retrieve → grade → rewrite loop) over Qdrant Cloud + Gemini, in Streamlit. Day 35 ordering bug fixed, now runs end to end. **The LangGraph agent is dead code — `main()` answers via a plain retrieve-prompt chain instead. One Gemini key scrubbed from two files (third sync running) — rotate it. CV excluded from the repo.** |
