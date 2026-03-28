# Tài liệu Public API — CMS 2026

> Tất cả API public đều **không yêu cầu xác thực** (No Authentication required).
>
> **Base URL:** `https://your-domain.com/api/public/`

---

## Mục lục

1. [Bài viết (Posts)](#1-bài-viết-posts)
2. [Danh mục & Quốc gia](#2-danh-mục--quốc-gia)
3. [Chương trình định cư (Programs)](#3-chương-trình-định-cư-programs)
4. [Dự án (Projects)](#4-dự-án-projects)
5. [Banner](#5-banner)
6. [Tư vấn / Liên hệ (Consultations)](#6-tư-vấn--liên-hệ-consultations)

---

## 1. Bài viết (Posts)

### 1.1 Lấy danh sách bài viết

**`GET /api/public/posts`**

Lấy danh sách bài viết đã xuất bản (`PUBLISHED`). Hỗ trợ phân trang, lọc, tìm kiếm.

**Query Parameters (tùy chọn):**

| Tham số | Kiểu | Mô tả | Ví dụ |
|---------|------|-------|-------|
| `page` | number | Số trang (mặc định: `1`) | `?page=2` |
| `limit` | number | Số bài mỗi trang (mặc định: `12`) | `?limit=6` |
| `locale` | string | Lọc theo ngôn ngữ: `vi` hoặc `en` | `?locale=vi` |
| `category` | string | Lọc theo `slug` của danh mục | `?category=tin-tuc` |
| `country` | string | Lọc theo `slug` của quốc gia | `?country=hoa-ky` |
| `search` | string | Tìm kiếm theo từ khóa trong tiêu đề | `?search=visa+eb5` |
| `translationKey` | string | Lọc theo key liên kết bản dịch | `?translationKey=eb5-program` |

**Response `200 OK`:**
```json
{
  "posts": [
    {
      "id": "cld9abc123",
      "title": "Chính sách Visa EB-5 mới nhất năm 2026",
      "slug": "chinh-sach-visa-eb5-moi-nhat-2026",
      "locale": "vi",
      "translationKey": "eb5-policy-2026",
      "excerpt": "USCIS chính thức cập nhật thời gian thụ lý...",
      "featuredImage": "https://example.com/image.jpg",
      "publishedAt": "2026-03-01T07:00:00.000Z",
      "createdAt": "2026-03-01T06:00:00.000Z",
      "category": {
        "name": "Tin tức",
        "slug": "tin-tuc"
      },
      "country": {
        "name": "Hoa Kỳ",
        "slug": "hoa-ky",
        "flagIcon": "🇺🇸"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 12
  }
}
```

> **Đa ngôn ngữ (i18n):**
> - `locale`: `"vi"` = tiếng Việt, `"en"` = tiếng Anh
> - `translationKey`: Key liên kết giữa bài VI và EN cùng chủ đề. Có thể `null` nếu chưa gán.
>
> **Flow chuyển ngôn ngữ:**
> 1. FE đang xem bài VI, lấy `translationKey` từ response (VD: `"eb5-policy-2026"`)
> 2. Gọi `GET /api/public/posts?translationKey=eb5-policy-2026&locale=en`
> 3. Nhận bài EN tương ứng → redirect sang slug của nó

---

### 1.2 Lấy chi tiết một bài viết

**`GET /api/public/posts/[slug]`**

Lấy toàn bộ nội dung chi tiết của một bài viết theo `slug`. Chỉ trả về bài có `status = PUBLISHED`.

**Ví dụ:** `/api/public/posts/chinh-sach-visa-eb5-moi-nhat-2026`

**Response `200 OK`:**
```json
{
  "id": "cld9abc123",
  "title": "Chính sách Visa EB-5 mới nhất năm 2026",
  "slug": "chinh-sach-visa-eb5-moi-nhat-2026",
  "locale": "vi",
  "translationKey": "eb5-policy-2026",
  "excerpt": "USCIS chính thức cập nhật thời gian thụ lý...",
  "content": "[{\"id\":\"sec001\",\"title\":\"Nội dung\",\"blocks\":[{\"id\":\"blk001\",\"type\":\"paragraph\",\"content\":\"Năm 2026 đánh dấu nhiều thay đổi...\"}]}]",
  "featuredImage": "https://example.com/image.jpg",
  "status": "PUBLISHED",
  "publishedAt": "2026-03-01T07:00:00.000Z",
  "createdAt": "2026-03-01T06:00:00.000Z",
  "updatedAt": "2026-03-01T06:00:00.000Z",
  "category": {
    "name": "Tin tức",
    "slug": "tin-tuc"
  },
  "country": {
    "name": "Hoa Kỳ",
    "slug": "hoa-ky",
    "flagIcon": "🇺🇸"
  },
  "author": {
    "name": "Admin"
  }
}
```

**Response `404`:**
```json
{ "error": "Post not found" }
```

---

### Cấu trúc `content` (Block Editor)

Field `content` là **JSON string** chứa mảng các **Section**, mỗi section có mảng **Block**:

```json
[
  {
    "id": "sec001",
    "title": "Tiêu đề section",
    "blocks": [
      { "id": "b1", "type": "heading",   "content": "Tiêu đề phụ" },
      { "id": "b2", "type": "paragraph", "content": "Đoạn văn bản..." },
      { "id": "b3", "type": "image",     "content": "/uploads/img.jpg", "caption": "Chú thích" },
      { "id": "b4", "type": "list",
        "items": [
          { "text": "Mục chính 1", "children": ["Mục con 1.1", "Mục con 1.2"] },
          { "text": "Mục chính 2", "children": [] }
        ]
      }
    ]
  }
]
```

**Các loại `type` block:**

| type | Dùng trong | Các field đặc trưng |
|------|-----------|---------------------|
| `heading` | Tất cả | `content` (string) |
| `paragraph` | Tất cả | `content` (string) |
| `image` | Tất cả | `content` (URL), `caption` (string, optional) |
| `list` | Tất cả | `items` (mảng `{ text, children[] }`) |
| `info_table` | Programs, Projects | `infoRows` (mảng `{ label, value }`) |
| `benefits` | Programs, Projects | `benefitItems` (mảng `{ title, description }`) |
| `requirements` | Programs, Projects | `requirementItems` (mảng `{ icon, title, description }`) |
| `steps` | Programs, Projects | `stepItems` (mảng `{ title, description }`) |
| `timeline` | Programs, Projects | `timelineItems` (mảng `{ time, title, details[] }`) |

> **Lưu ý:** Các block `info_table`, `benefits`, `steps`, `timeline` **không có** trong bài viết (Tin tức/Sự kiện), chỉ xuất hiện ở Chương trình và Dự án.

---

## 2. Danh mục & Quốc gia

### 2.1 Danh sách Danh mục

**`GET /api/public/categories`**

Trả về tất cả danh mục kèm số bài viết `PUBLISHED`.

**Response `200 OK`:**
```json
[
  {
    "id": "cld9cat001",
    "name": "Tin tức",
    "slug": "tin-tuc",
    "locale": "vi",
    "description": "Tin tức mới nhất về di trú",
    "_count": { "posts": 5 }
  },
  {
    "id": "cld9cat002",
    "name": "News",
    "slug": "news",
    "locale": "en",
    "description": "Latest immigration news",
    "_count": { "posts": 2 }
  }
]
```

> **Lưu ý:** Mỗi danh mục có `locale` (`"vi"` hoặc `"en"`). Tạo danh mục riêng cho mỗi ngôn ngữ.

---

### 2.2 Danh sách Quốc gia

**`GET /api/public/countries`**

Trả về tất cả quốc gia kèm số bài viết `PUBLISHED`.

**Response `200 OK`:**
```json
[
  {
    "id": "cld9ctr001",
    "name": "Hoa Kỳ",
    "slug": "hoa-ky",
    "locale": "vi",
    "flagIcon": "🇺🇸",
    "_count": { "posts": 8 }
  },
  {
    "id": "cld9ctr002",
    "name": "United States",
    "slug": "united-states",
    "locale": "en",
    "flagIcon": "🇺🇸",
    "_count": { "posts": 3 }
  }
]
```

> **Lưu ý:** Mỗi quốc gia có `locale` (`"vi"` hoặc `"en"`). Tạo quốc gia riêng cho mỗi ngôn ngữ.

---

## 3. Chương trình định cư (Programs)

### 3.1 Lấy danh sách Chương trình

**`GET /api/public/programs`**

Lấy danh sách chương trình định cư đã xuất bản (`PUBLISHED`). Kết quả đã được sắp xếp theo `serviceGroup.sortOrder` → `sortOrder`.

**Query Parameters (tùy chọn):**

| Tham số | Kiểu | Mô tả | Ví dụ |
|---------|------|-------|-------|
| `locale` | string | Lọc theo ngôn ngữ: `vi` hoặc `en` | `?locale=vi` |
| `serviceGroup` | string | Lọc theo `slug` nhóm dịch vụ | `?serviceGroup=dinh-cu-my` |
| `country` | string | Lọc theo `slug` quốc gia | `?country=hoa-ky` |

**Response `200 OK`:**
```json
{
  "programs": [
    {
      "id": "cld9prg001",
      "name": "Visa EB-5: Định cư Mỹ",
      "slug": "visa-eb5-my",
      "locale": "vi",
      "translationKey": "eb5-visa",
      "excerpt": "Đầu tư $800,000 lấy thẻ xanh Mỹ cho cả gia đình.",
      "featuredImage": "https://example.com/image.jpg",
      "sortOrder": 1,
      "serviceGroup": {
        "name": "Đầu tư & Định cư Mỹ",
        "slug": "dinh-cu-my"
      },
      "country": {
        "name": "Hoa Kỳ",
        "slug": "hoa-ky",
        "flagIcon": "🇺🇸"
      }
    }
  ]
}
```

---

### 3.2 Lấy chi tiết một Chương trình

**`GET /api/public/programs/[slug]`**

Lấy toàn bộ thông tin chi tiết của một chương trình theo `slug`. Chỉ trả về chương trình có `status = PUBLISHED`.

**Ví dụ:** `/api/public/programs/visa-eb5-my`

**Response `200 OK`:**
```json
{
  "id": "cld9prg001",
  "name": "Visa EB-5: Định cư Mỹ",
  "slug": "visa-eb5-my",
  "locale": "vi",
  "translationKey": "eb5-visa",
  "excerpt": "Đầu tư $800,000 lấy thẻ xanh Mỹ cho cả gia đình.",
  "content": "[...]",
  "featuredImage": "https://example.com/image.jpg",
  "status": "PUBLISHED",
  "sortOrder": 1,
  "createdAt": "2026-03-01T06:00:00.000Z",
  "updatedAt": "2026-03-10T06:00:00.000Z",
  "serviceGroupId": "cld9sg001",
  "countryId": "cld9ctr001",
  "serviceGroup": {
    "name": "Đầu tư & Định cư Mỹ",
    "slug": "dinh-cu-my"
  },
  "country": {
    "name": "Hoa Kỳ",
    "slug": "hoa-ky",
    "flagIcon": "🇺🇸"
  }
}
```

**Response `404`:**
```json
{ "error": "Program not found" }
```

> Trường `content` có cấu trúc Block Editor như mô tả ở [mục 1](#cấu-trúc-content-block-editor), hỗ trợ đầy đủ tất cả 8 loại block.

---

## 4. Dự án (Projects)

### 4.1 Lấy danh sách Dự án

**`GET /api/public/projects`**

Lấy danh sách dự án đã xuất bản (`PUBLISHED`). Kết quả sắp xếp theo `sortOrder` → `createdAt desc`.

> **Mặc định `locale = "vi"`** nếu không truyền tham số.

**Query Parameters (tùy chọn):**

| Tham số | Kiểu | Mô tả | Ví dụ |
|---------|------|-------|-------|
| `locale` | string | Lọc theo ngôn ngữ: `vi` hoặc `en` (mặc định: `vi`) | `?locale=en` |
| `program` | string | Lọc theo `slug` chương trình cha | `?program=visa-eb5-my` |
| `limit` | number | Giới hạn số kết quả trả về | `?limit=4` |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "cld9prj001",
      "name": "Dự án EB-5 Mother Gaston",
      "slug": "du-an-eb5-mother-gaston",
      "locale": "vi",
      "translationKey": "mother-gaston",
      "excerpt": "Dự án EB-5 an toàn, vùng TEA, hoàn vốn sau 2 năm.",
      "featuredImage": "https://example.com/image.jpg",
      "availability": "AVAILABLE",
      "createdAt": "2026-03-01T06:00:00.000Z",
      "program": {
        "name": "Visa EB-5: Định cư Mỹ",
        "slug": "visa-eb5-my"
      }
    }
  ]
}
```

---

### 4.2 Lấy chi tiết một Dự án

**`GET /api/public/projects/[slug]`**

Lấy toàn bộ thông tin chi tiết của một dự án theo `slug`. Chỉ trả về dự án có `status = PUBLISHED`.

**Ví dụ:** `/api/public/projects/du-an-eb5-mother-gaston`

**Response `200 OK`:**
```json
{
  "data": {
    "id": "cld9prj001",
    "name": "Dự án EB-5 Mother Gaston",
    "slug": "du-an-eb5-mother-gaston",
    "locale": "vi",
    "translationKey": "mother-gaston",
    "excerpt": "Dự án EB-5 an toàn, vùng TEA...",
    "content": "[...]",
    "featuredImage": "https://example.com/image.jpg",
    "status": "PUBLISHED",
    "availability": "AVAILABLE",
    "sortOrder": 1,
    "createdAt": "2026-03-01T06:00:00.000Z",
    "updatedAt": "2026-03-10T06:00:00.000Z",
    "programId": "cld9prg001",
    "program": {
      "name": "Visa EB-5: Định cư Mỹ",
      "slug": "visa-eb5-my"
    }
  }
}
```

**Response `404`:**
```json
{ "error": "Project not found" }
```

---

## 5. Banner

### 5.1 Lấy tất cả Banner đang bật

**`GET /api/public/banners`**

Lấy tất cả banner có `isActive = true` kèm danh sách ảnh `isActive = true`, đã sắp xếp theo `sortOrder`.

**Response `200 OK`:**
```json
{
  "banners": [
    {
      "id": "cld9ban001",
      "name": "Banner trang chủ",
      "slug": "banner-trang-chu",
      "description": "Slide ảnh trang chủ",
      "isActive": true,
      "createdAt": "2026-03-01T06:00:00.000Z",
      "updatedAt": "2026-03-10T06:00:00.000Z",
      "images": [
        {
          "id": "cld9img001",
          "url": "/api/public/uploads/slide1.jpg",
          "title": "Chương trình EB-5",
          "titleEn": "EB-5 Program",
          "link": "/chuong-trinh/visa-eb5-my",
          "sortOrder": 0,
          "isActive": true,
          "createdAt": "2026-03-01T06:00:00.000Z"
        },
        {
          "id": "cld9img002",
          "url": "/api/public/uploads/slide2.jpg",
          "title": "Golden Visa",
          "titleEn": "Golden Visa Portugal",
          "link": "/chuong-trinh/golden-visa-bo-dao-nha",
          "sortOrder": 1,
          "isActive": true,
          "createdAt": "2026-03-01T06:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### 5.2 Lấy một Banner theo Slug

**`GET /api/public/banners?slug=[slug]`**

Lấy chi tiết một banner cụ thể. Trả `404` nếu không tìm thấy hoặc banner bị tắt.

**Ví dụ:** `/api/public/banners?slug=banner-trang-chu`

**Response `200 OK`:** Cùng cấu trúc với một phần tử trong mảng `banners` ở trên (không có wrapper).

**Response `404`:**
```json
{ "error": "Banner not found" }
```

---

## 6. Tư vấn / Liên hệ (Consultations)

### 6.1 Lấy danh sách Chương trình (cho Dropdown)

**`GET /api/public/consultations`**

Lấy danh sách tên chương trình đang `PUBLISHED` để hiển thị trong dropdown form "Chương trình bạn quan tâm". Đã sắp xếp theo nhóm dịch vụ.

**Response `200 OK`:**
```json
{
  "programs": [
    {
      "id": "cld9prg001",
      "name": "Visa EB-5: Định cư Mỹ",
      "serviceGroup": { "name": "Đầu tư & Định cư Mỹ" }
    },
    {
      "id": "cld9prg002",
      "name": "Dự án EB-5 Mother Gaston",
      "serviceGroup": { "name": "Đầu tư & Định cư Mỹ" }
    }
  ]
}
```

---

### 6.2 Gửi yêu cầu đặt lịch tư vấn

**`POST /api/public/consultations`**

Gửi thông tin từ form đặt lịch tư vấn. API sẽ validate và lưu vào hệ thống.

**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0938965878",
  "city": "TP. Hồ Chí Minh",
  "program": "Visa EB-5: Định cư Mỹ",
  "email": "email@example.com",
  "note": "Tôi muốn tư vấn vào buổi chiều"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `fullName` | ✅ | Họ và tên |
| `phone` | ✅ | SĐT Việt Nam (10-11 số, bắt đầu `0` hoặc `+84`) |
| `city` | ✅ | Thành phố / tỉnh |
| `program` | ✅ | Tên chương trình quan tâm |
| `email` | ❌ | Email liên hệ |
| `note` | ❌ | Ghi chú thêm |

**Response `200` — Thành công:**
```json
{
  "success": true,
  "message": "Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.",
  "id": "cld9con001"
}
```

**Response `400` — Lỗi validation:**
```json
{ "error": "Số điện thoại không hợp lệ" }
```

Các lỗi có thể trả về:
- `"Vui lòng điền đầy đủ thông tin bắt buộc"`
- `"Số điện thoại không hợp lệ"`
- `"Email không hợp lệ"`

**Response `500` — Lỗi server:**
```json
{ "error": "Đã xảy ra lỗi, vui lòng thử lại" }
```

---

## Tóm tắt tất cả Endpoints

| # | Method | Endpoint | Mô tả |
|---|--------|----------|-------|
| 1 | GET | `/api/public/posts` | Danh sách bài viết (có filter, phân trang) |
| 2 | GET | `/api/public/posts/[slug]` | Chi tiết một bài viết |
| 3 | GET | `/api/public/categories` | Danh sách danh mục |
| 4 | GET | `/api/public/countries` | Danh sách quốc gia |
| 5 | GET | `/api/public/programs` | Danh sách chương trình định cư |
| 6 | GET | `/api/public/programs/[slug]` | Chi tiết một chương trình |
| 7 | GET | `/api/public/projects` | Danh sách dự án |
| 8 | GET | `/api/public/projects/[slug]` | Chi tiết một dự án |
| 9 | GET | `/api/public/banners` | Tất cả banner đang bật |
| 10 | GET | `/api/public/banners?slug=[slug]` | Một banner theo slug |
| 11 | GET | `/api/public/consultations` | Danh sách chương trình (cho dropdown) |
| 12 | POST | `/api/public/consultations` | Gửi form đặt lịch tư vấn |
