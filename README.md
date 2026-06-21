# SoiGia

Monorepo scaffold cho nen tang theo doi va so sanh gia giua nhieu cua hang, dai ly va tram xang.

## Cau truc de xuat

```text
.
|- apps/
|  |- api/                    # Node.js backend theo layered architecture
|  `- web/                    # React + Vite frontend
|- database/
|  |- migrations/             # SQL migrations / ORM migrations
|  `- seeds/                  # Du lieu mau
|- infra/
|  |- nginx/                  # Reverse proxy / gateway config
|  `- scripts/                # Script deploy len VPS
|- docs/
|  `- architecture.md         # Ghi chu kien truc tong the
|- packages/
|  |- shared-types/           # TypeScript contracts dung chung
|  `- tsconfig/               # Cau hinh TypeScript dung chung
|- workers/
|  `- price-crawler/          # Python crawler + RabbitMQ publisher
|- .github/workflows/         # CI scaffold
|- .env.example               # Bien moi truong mau
`- docker-compose.yml         # Khoi dong local stack
```

## Nguyen tac kien truc

- `apps/web` chi xu ly giao dien, dieu huong, goi API va hien thi du lieu so sanh gia.
- `apps/api` tach ro `routes -> controllers -> services -> repositories`, dung Redis cho cache va RabbitMQ de nhan du lieu tu worker.
- `workers/price-crawler` thu thap gia, chuan hoa payload va day message vao RabbitMQ.
- `packages/shared-types` chua contracts va types dung chung de tranh lech schema giua frontend va backend.
- `database`, `infra` va `docker-compose.yml` giu cho local/devops setup ro rang ngay tu dau.

## Buoc tiep theo nen lam

1. Chon framework backend cu the trong `apps/api` (Express, Fastify hoac Nest-like custom layering).
2. Chon ORM / migration tool cho PostgreSQL.
3. Noi `apps/web` vao API that va hoan thien auth, cache, consumer, crawler sources.
