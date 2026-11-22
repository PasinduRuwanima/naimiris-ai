# Inference workspace

Future inference must load a real artifact and verify its checksum, class order,
and preprocessing contract. An absent or incompatible artifact must result in
an explicit unavailable service, never a generated prediction.
