# Future dataset metadata contract

Use reviewed CSV/JSON manifests, excluding personal/location identifiers unless
collection consent permits them. No real manifest exists yet.

Required fields: dataset ID/version, source URL, license evidence, retrieval
date, relative/external image ID, SHA-256, original photograph ID, label and
definition, source domain, annotation provenance, duplicate/augmentation group,
split, and review status. Record plant/session IDs where known; mark unknown
values explicitly. Never invent provenance or silently merge label mappings.

Split manifests must be immutable per experiment and verify group isolation.
