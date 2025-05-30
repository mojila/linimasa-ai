@PHONY: all

run-web:
	cd web && pnpm install && pnpm run dev

run-api:
	cd api && cargo run