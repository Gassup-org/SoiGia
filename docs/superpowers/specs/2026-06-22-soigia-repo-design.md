# SoiGia Repository Design

## 1. Objective

Thiết kế một monorepo chuẩn cho dự án SoiGia, đủ để khởi tạo và chạy local ở mức nền tảng ngay từ đầu, đồng thời giữ ranh giới rõ ràng giữa frontend, backend, worker, và các package dùng chung.

Phạm vi của spec này là cấu trúc repo, trách nhiệm thư mục, tooling, môi trường local, và skeleton ứng dụng. Spec này không bao gồm việc triển khai đầy đủ các business feature như crawl dữ liệu thật, danh mục thật, hay so sánh giá hoàn chỉnh.

## 2. Design Goals

- Repo phải phản ánh đúng kiến trúc hệ thống trong `description.md`: React frontend, Node.js backend, Python crawler worker, PostgreSQL, Redis, RabbitMQ, Docker Compose, GitHub Actions.
- Cấu trúc phải đủ chuẩn để mở rộng thành nhiều module nghiệp vụ mà không phải tổ chức lại repo sớm.
- Backend phải giữ được layered architecture rõ ràng: `routes -> controllers -> services -> repositories`.
- Worker Python phải là một package đúng nghĩa, có thể test và mở rộng theo từng nguồn dữ liệu.
- Các cấu hình dùng chung phải được tách khỏi từng app để tránh lặp lại.
- Skeleton ban đầu phải chạy được ở mức cơ bản: web app render được, API có health endpoint, worker có entrypoint và wiring khởi động tối thiểu.

## 3. Chosen Approach

SoiGia sẽ dùng package-heavy monorepo với ba runtime chính:

- `apps/web`: ứng dụng React + Vite + TypeScript cho frontend.
- `apps/api`: dịch vụ Express + TypeScript + Prisma cho HTTP API và nghiệp vụ web.
- `workers/crawler`: Python package độc lập để crawl, parse, publish/consume message.

Song song, repo sẽ tách sớm các package chia sẻ cấu hình và contract:

- `packages/shared-types`
- `packages/eslint-config`
- `packages/tsconfig`
- `packages/config`
- `packages/ui`
- `packages/utils`

Lý do chọn hướng này:

- Giữ chuẩn scale dài hạn ngay từ đầu thay vì dồn logic vào từng app.
- Loại bỏ cấu hình lặp giữa `web` và `api`.
- Tạo chỗ đứng rõ ràng cho contract dùng chung như DTO, queue name, constants.
- Hạn chế over-coupling bằng cách chỉ cho phép tái sử dụng qua package public nội bộ, thay vì import chéo thư mục tùy tiện.

## 4. Repository Structure

```text
.
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── config/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── middlewares/
│   │   │   ├── validators/
│   │   │   ├── dtos/
│   │   │   ├── mappers/
│   │   │   ├── lib/
│   │   │   └── modules/
│   │   │       ├── categories/
│   │   │       ├── products/
│   │   │       ├── prices/
│   │   │       └── ingestion/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── app/
│       │   ├── pages/
│       │   ├── features/
│       │   │   ├── categories/
│       │   │   ├── products/
│       │   │   └── price-comparison/
│       │   ├── components/
│       │   ├── services/
│       │   ├── hooks/
│       │   ├── layouts/
│       │   ├── lib/
│       │   ├── styles/
│       │   └── types/
│       ├── package.json
│       └── tsconfig.json
├── workers/
│   └── crawler/
│       ├── src/
│       │   ├── crawler/
│       │   ├── consumers/
│       │   ├── publishers/
│       │   ├── parsers/
│       │   ├── clients/
│       │   ├── models/
│       │   ├── config/
│       │   └── main.py
│       ├── tests/
│       ├── pyproject.toml
│       └── uv.lock
├── packages/
│   ├── config/
│   ├── eslint-config/
│   ├── shared-types/
│   ├── tsconfig/
│   ├── ui/
│   └── utils/
├── infra/
│   ├── docker/
│   ├── nginx/
│   └── scripts/
├── .github/
│   └── workflows/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── runbooks/
│   └── superpowers/
│       └── specs/
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .gitignore
```

## 5. Responsibilities by Area

### 5.1 `apps/web`

- Chứa toàn bộ giao diện người dùng.
- Tổ chức theo feature để bám sát luồng người dùng chính trong `description.md`.
- `features/` chứa logic gắn với nghiệp vụ như danh mục, sản phẩm, so sánh giá.
- `components/` chỉ chứa UI tái sử dụng, không giữ business flow đặc thù.
- `services/` là lớp gọi API; không nhúng URL hay fetch logic rải rác trong component.

### 5.2 `apps/api`

- Sở hữu HTTP API, auth về sau, nghiệp vụ web, cache logic, và xử lý message từ worker.
- Prisma schema nằm ở đây vì backend Node là owner của database contract.
- Giữ layered architecture theo trách nhiệm:
  - `routes/`: khai báo endpoint và nối middleware/controller.
  - `controllers/`: nhận request, validate sơ bộ, gọi service, trả response.
  - `services/`: chứa business logic.
  - `repositories/`: là lớp duy nhất nói chuyện với Prisma/PostgreSQL.
- `modules/` gom domain theo feature để tránh code bị phẳng khi hệ thống lớn dần.
- `lib/` chứa wiring hạ tầng như prisma client, redis client, rabbitmq connection helper.

### 5.3 `workers/crawler`

- Chạy độc lập với Node runtime.
- Chia ranh giới rõ giữa:
  - `crawler/`: orchestration theo nguồn crawl.
  - `parsers/`: bóc tách HTML/response thành dữ liệu chuẩn hóa.
  - `clients/`: HTTP client hoặc source adapter.
  - `publishers/`: đẩy message vào RabbitMQ.
  - `consumers/`: nhận job hoặc command nếu sau này cần queue kéo ngược.
- Worker không ghi trực tiếp vào PostgreSQL ở giai đoạn scaffold. Dữ liệu đi qua message broker để backend xử lý từ từ như mô tả kiến trúc ban đầu.

### 5.4 `packages/*`

- `shared-types`: kiểu dùng chung giữa `web`, `api`, và contract message.
- `eslint-config`: cấu hình lint tái sử dụng.
- `tsconfig`: base TS config cho app/package Node và browser.
- `config`: constants dùng chung như queue names, app names, default pagination, cache key prefix.
- `ui`: component library nội bộ nếu frontend bắt đầu hình thành design system.
- `utils`: helper thuần, không phụ thuộc runtime web hay Node cụ thể.

## 6. Dependency and Boundary Rules

- `apps/web` chỉ được phụ thuộc vào `packages/*`, không import từ `apps/api`.
- `apps/api` có thể phụ thuộc vào `packages/shared-types`, `packages/config`, `packages/utils`.
- `workers/crawler` không import code từ `apps/api`; giao tiếp qua queue contract và payload schema.
- `packages/ui` chỉ dành cho frontend-facing code; `api` không được import package này.
- Prisma client không được dùng ngoài `repositories/` trừ phần wiring hạ tầng tối thiểu.
- Business logic không đặt trong controller hay route.

## 7. Tooling Decisions

### 7.1 Workspace and Package Management

- Dùng `pnpm workspace` để quản lý `apps/*` và `packages/*`.
- Không dùng Turborepo ở vòng scaffold đầu tiên.
- Root `package.json` sẽ cung cấp script đồng nhất như:
  - `dev`
  - `build`
  - `lint`
  - `test`
  - `typecheck`
  - `format`

### 7.2 Frontend Stack

- React + Vite + TypeScript
- `react-router-dom` cho flow danh mục -> sản phẩm -> chi tiết so sánh giá
- `@tanstack/react-query` cho API fetching và client cache
- `vitest` + `@testing-library/react` cho test

### 7.3 Backend Stack

- Express + TypeScript
- Prisma + PostgreSQL
- Validation bằng `zod`
- `vitest` cho unit test và integration test mức app/service khi có scaffold test setup

### 7.4 Worker Stack

- Python package theo `src/` layout
- Dependency manager: `uv`
- `httpx`, `beautifulsoup4`, `pydantic`
- `pytest` cho test

### 7.5 Infrastructure and Operations

- `docker-compose.yml` khởi tạo:
  - `postgres`
  - `redis`
  - `rabbitmq`
  - `api`
  - `web`
  - `worker`
- `.github/workflows/ci.yml` chạy lint, typecheck, test cho phần JS/TS và pytest cho worker.

## 8. Runtime Skeleton Scope

Scaffold mức đầu tiên phải tạo được các thành phần sau:

- Root monorepo config hoạt động được.
- `apps/web` render một trang chủ cơ bản.
- `apps/api` khởi động được server và expose ít nhất endpoint `GET /health`.
- `workers/crawler` khởi động được entrypoint và log rằng worker đã sẵn sàng.
- Docker Compose có thể dựng được dependency services và wiring môi trường cơ bản.
- Shared packages có manifest và export tối thiểu để dùng thật, không chỉ là thư mục rỗng.

Những thứ chưa làm ở vòng này:

- Auth thật
- Category/product/price API hoàn chỉnh
- Crawl thật theo từng website nguồn
- Job retry policy chi tiết
- Production deployment scripts hoàn chỉnh cho VPS

## 9. Environment and Configuration

- Root `.env.example` mô tả biến môi trường dùng chung:
  - database URL
  - redis URL
  - rabbitmq URL
  - API port
  - web port
  - worker log level
- Mỗi app có thể có `.env.example` riêng nếu phát sinh biến runtime đặc thù.
- Shared constants như queue names và app identifiers sẽ đặt trong `packages/config`.

## 10. Testing Strategy

- `web`: component test và page-level smoke test.
- `api`: unit test cho service/repository adapter và health route smoke test.
- `worker`: parser/unit test và startup smoke test.
- CI chỉ cần chứng minh scaffold không vỡ:
  - lint pass
  - typecheck pass
  - test pass
  - build pass với phần JS/TS

## 11. Initial Data and Domain Direction

Để bám theo `description.md`, các domain đầu tiên cần được dành sẵn chỗ trong cấu trúc:

- `categories`
- `products`
- `prices`
- `ingestion`

Mục tiêu là để khi bắt đầu triển khai nghiệp vụ thật, nhóm phát triển chỉ cần điền vào đúng module thay vì tổ chức lại repo.

## 12. Risks and Mitigations

### Risk: Over-structuring too early

Package-heavy monorepo có thể tạo cảm giác nhiều thư mục khi code còn ít.

Mitigation:
- Chỉ tách package dùng chung thật sự cần cho vòng scaffold.
- Mỗi package phải có trách nhiệm rõ ràng và export tối thiểu có ý nghĩa.

### Risk: Layered architecture bị phá vỡ khi thêm feature nhanh

Controller dễ nuốt business logic, hoặc service nhảy thẳng vào Prisma.

Mitigation:
- Scaffold sẵn folder và ví dụ wiring theo đúng luồng layer.
- Đặt boundary rule rõ ràng trong README và cấu trúc import.

### Risk: Worker và API coupling quá chặt

Nếu worker import trực tiếp code backend, việc deploy và test độc lập sẽ khó.

Mitigation:
- Chỉ chia sẻ contract qua package hoặc payload schema.
- Dùng RabbitMQ làm boundary chính cho ingestion flow.

## 13. Implementation Outcome

Sau khi hoàn thành scaffold theo spec này, repo phải cho phép một developer mới:

1. Cài dependencies cho workspace JS/TS và worker Python.
2. Khởi động các service nền bằng Docker Compose.
3. Chạy `web`, `api`, và `worker` ở local.
4. Thấy frontend render được, API trả health check, và worker khởi động thành công.
5. Có sẵn điểm mở rộng rõ ràng để bắt đầu triển khai domain `categories`, `products`, `prices`, và ingestion pipeline.
