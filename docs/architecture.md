# SoiGia Architecture Notes

## Main user flow

1. User vao trang chu va mo danh muc tu header.
2. Frontend goi API lay category level 1, sau do tai danh sach san pham theo danh muc.
3. User ap bo loc category level 2 de thu hep ket qua.
4. Trang chi tiet san pham hien thi danh sach gia theo tung cua hang / tram xang.

## Runtime flow

- `web` goi `api` qua HTTP.
- `api` doc/ghi PostgreSQL, cache Redis va co the tieu thu message tu RabbitMQ.
- `price-crawler` lay du lieu tu nguon ngoai, chuan hoa va publish vao RabbitMQ.
- `api` xu ly message, chong trung lap, cap nhat gia va phat du lieu moi ra API.

## Why this layout

- Dung `apps/` de tach ro executable services.
- Dung `packages/` cho code chia se.
- Dung `database/` de khong khoa chat vao mot ORM qua som.
- Dung `docs/` de luu quyet dinh kien truc ngay tu luc scaffold.
