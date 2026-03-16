# Tài liệu Public API - Hệ thống CMS 2026
 Tất cả API public đều không yêu cầu xác thực (No Authentication required).

**Base URL:** `/api/public/`

---

## 1. Bài viết (Tin tức / Sự kiện)

### 1.1 Lấy danh sách bài viết
- **Endpoint:** `GET /api/public/posts`
- **Mô tả:** Lấy danh sách bài viết đã được xuất bản (PUBLISHED). Hỗ trợ phân trang, tìm kiếm và lọc.
- **Query Parameters (tùy chọn):**
  - `page` (number): Số trang (mặc định: `1`)
  - `limit` (number): Số lượng bài viết mỗi trang (mặc định: `12`)
  - `locale` (string): Lọc theo ngôn ngữ / quốc gia — giá trị là `slug` của quốc gia (ví dụ: `hoa-ky`, `viet-nam`)
  - `category` (string): Lọc theo `slug` của danh mục (ví dụ: `tin-tuc-su-kien`)
  - `country` (string): Lọc theo `slug` của quốc gia (ví dụ: `uc`)
  - `search` (string): Tìm kiếm theo từ khoá trong tiêu đề bài viết.
- **Cấu trúc Response:**
```json
{
  "posts": [
    {
      "id": "cmm1q3rfv000fe55gatmi33wv",
      "title": "Chính sách Visa EB-5 mới nhất năm 2026",
      "slug": "chinh-sach-visa-eb5-moi-nhat-2026",
      "locale": "hoa-ky",
      "excerpt": "USCIS chính thức cập nhật thời gian thụ lý...",
      "featuredImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "publishedAt": null,
      "createdAt": "2026-02-25T07:38:53.228Z",
      "category": {
        "name": "Tin tức",
        "slug": "tin-tuc"
      },
      "country": {
        "name": "Hoa Kỳ",
        "slug": "hoa-ky",
        "flagIcon": "🇺🇸"
      }
    },
    {
      "id": "cmm1q3rfv000ge55gphbit25f",
      "title": "Hội thảo Định cư Mỹ: Gặp gỡ luật sư di trú hàng đầu",
      "slug": "hoi-thao-dinh-cu-my-gap-go-luat-su-di-tru",
      "excerpt": "Kính mời quý nhà đầu tư tham dự sự kiện chia sẻ lộ trình định cư lấy thẻ xanh Mỹ an toàn thời gian kỷ lục.",
      "featuredImage": "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80",
      "publishedAt": null,
      "createdAt": "2026-02-25T07:38:53.228Z",
      "category": {
        "name": "Sự kiện",
        "slug": "su-kien"
      },
      "country": {
        "name": "Hoa Kỳ",
        "slug": "hoa-ky",
        "flagIcon": "🇺🇸"
      }
    },
    {
      "id": "cmm1q3rfv000he55g2bvmlc6u",
      "title": "Thị trường Bất động sản Úc tăng nhiệt, cơ hội hay thách thức?",
      "slug": "thi-truong-bat-dong-san-uc-tang-nhiet",
      "excerpt": "Phân tích từ chuyên gia về biến động thị trường nhà ở Úc ảnh hưởng thế nào đến các hồ sơ định cư diện đầu tư kinh doanh.",
      "featuredImage": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
      "publishedAt": null,
      "createdAt": "2026-02-25T07:38:53.228Z",
      "category": {
        "name": "Góc đầu tư",
        "slug": "goc-dau-tu"
      },
      "country": {
        "name": "Úc",
        "slug": "uc",
        "flagIcon": "🇦🇺"
      }
    }
  ],
  "pagination": {
    "total": 3,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 12
  }
}
```

### 1.2 Lấy chi tiết một bài viết
- **Endpoint:** `GET /api/public/posts/[slug]`
- **Mô tả:** Lấy toàn bộ nội dung chi tiết của một bài viết theo `slug`. Nếu không tìm thấy hoặc bài viết chưa xuất bản sẽ trả về `404`.
- **Ví dụ gọi API:** `/api/public/posts/chinh-sach-visa-eb5-moi-nhat-2026`
- **Cấu trúc Response:**
```json
{
  "id": "cmm1q3rfv000fe55gatmi33wv",
  "title": "Chính sách Visa EB-5 mới nhất năm 2026",
  "slug": "chinh-sach-visa-eb5-moi-nhat-2026",
  "content": "[{\"id\":\"435133n0t\",\"title\":\"Nội dung bài viết\",\"blocks\":[{\"id\":\"m1y29z1u2\",\"type\":\"paragraph\",\"content\":\"Năm 2026 đánh dấu nhiều sự thay đổi tích cực trong chính sách thụ lý visa EB-5...\"}]}]",
  "excerpt": "USCIS chính thức cập nhật thời gian thụ lý và quy định về chứng minh nguồn tiền cho các nhà đầu tư EB-5 năm nay.",
  "featuredImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "status": "PUBLISHED",
  "publishedAt": null,
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

---

## 2. Phân loại (Categories & Countries)

### 2.1 Danh sách Danh mục bài viết
- **Endpoint:** `GET /api/public/categories`
- **Mô tả:** Danh sách các danh mục kèm theo số lượng bài viết đang PUBLISH trong mỗi danh mục.
- **Cấu trúc Response:**
```json
[
  {
    "id": "cmm1q3rfh0003e55guw0hjesb",
    "name": "Góc đầu tư",
    "slug": "goc-dau-tu",
    "description": "Kiến thức đầu tư định cư",
    "_count": {
      "posts": 1
    }
  },
  {
    "id": "cmm1q3rfh0002e55g52fz3t5k",
    "name": "Sự kiện",
    "slug": "su-kien",
    "description": "Các sự kiện hội thảo",
    "_count": {
      "posts": 1
    }
  },
  {
    "id": "cmm1q3rfg0001e55gk7fro7id",
    "name": "Tin tức",
    "slug": "tin-tuc",
    "description": "Tin tức mới nhất về di trú",
    "_count": {
      "posts": 1
    }
  }
]
```

### 2.2 Danh sách Quốc gia
- **Endpoint:** `GET /api/public/countries`
- **Mô tả:** Danh sách các quốc gia kèm icon cờ và số lượng bài viết tương ứng.
- **Cấu trúc Response:**
```json
[
  {
    "id": "cmm1q3rfk0006e55gpkfx2fxl",
    "name": "Canada",
    "slug": "canada",
    "flagIcon": "🇨🇦",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": "cmm1q3rfk0007e55ggemk2ajz",
    "name": "Châu Âu (Schengen)",
    "slug": "chau-au",
    "flagIcon": "🇪🇺",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": "cmm1q3rfi0004e55g4nqktrge",
    "name": "Hoa Kỳ",
    "slug": "hoa-ky",
    "flagIcon": "🇺🇸",
    "_count": {
      "posts": 2
    }
  },
  {
    "id": "cmm1q3rfj0005e55ggy870wgc",
    "name": "Úc",
    "slug": "uc",
    "flagIcon": "🇦🇺",
    "_count": {
      "posts": 1
    }
  }
]
```

---

## 3. Liên hệ & Đặt lịch tư vấn

### 3.1 Lấy danh sách Chương trình định cư (Cho Dropdown Form)
- **Endpoint:** `GET /api/public/consultations`
- **Mô tả:** Lấy danh sách các Chương trình định cư (đang PUBLISHED) để người dùng chọn trong form "Chương trình bạn đang quan tâm". Đã được sắp xếp theo nhóm dịch vụ.
- **Cấu trúc Response:**
```json
{
  "programs": [
    {
      "id": "cmm1q3rfo000be55g64avayz5",
      "name": "Visa EB-5: Định cư Mỹ",
      "serviceGroup": {
        "name": "Đầu tư & Định cư Mỹ"
      }
    },
    {
      "id": "cmm1q3rfo000ce55g697rwqi9",
      "name": "Dự án EB-5 Mother Gaston",
      "serviceGroup": {
        "name": "Đầu tư & Định cư Mỹ"
      }
    },
    {
      "id": "cmm1q3rfo000de55gptpz6hrr",
      "name": "Visa 188: Đầu tư & Đổi mới Úc",
      "serviceGroup": {
        "name": "Đầu tư & Định cư Úc"
      }
    },
    {
      "id": "cmm1q3rfo000ee55gkyw1skuz",
      "name": "Golden Visa Bồ Đào Nha",
      "serviceGroup": {
        "name": "Đầu tư & Định cư Châu Âu"
      }
    }
  ]
}
```

### 3.2 Gửi yêu cầu Đặt lịch tư vấn
- **Endpoint:** `POST /api/public/consultations`
- **Mô tả:** Frontend gửi data từ form Đặt lịch tư vấn. API sẽ validate số điện thoại Việt Nam và lưu vào hệ thống admin.
- **Headers:** `Content-Type: application/json`
- **Body Request:**
```json
{
  "fullName": "Nguyễn Văn A",      // (Bắt buộc)
  "phone": "0938965878",         // (Bắt buộc) Format: 10-11 số, có thể bắt đầu bằng +84 hoặc 0
  "city": "TP. Hồ Chí Minh",     // (Bắt buộc)
  "program": "Visa EB-5",        // (Bắt buộc) Tên chương trình KH quan tâm
  "email": "email@example.com"   // (Không bắt buộc)
}
```
- **Cấu trúc Response - Thành công (Status 200):**
```json
{
  "success": true,
  "message": "Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.",
  "id": "cuid..."
}
```
- **Cấu trúc Response - Lỗi Validate (Status 400):**
```json
{
  "error": "Số điện thoại không hợp lệ"
}
```
*(Các lỗi có thể trả về: "Vui lòng điền đầy đủ thông tin bắt buộc", "Số điện thoại không hợp lệ", "Email không hợp lệ").*

---


## 4. Chương trình định cư (Programs)

### 4.1 Lấy danh sách Chương trình
- **Endpoint:** `GET /api/public/programs`
- **Mô tả:** Lấy danh sách các chương trình định cư đã được xuất bản (PUBLISHED).
- **Query Parameters (tùy chọn):**
  - `serviceGroup` (string): Lọc theo slug của nhóm dịch vụ (ví dụ: `dinh-cu-my`)
  - `country` (string): Lọc theo slug của quốc gia (ví dụ: `hoa-ky`)
  - `locale` (string): Lọc theo ngôn ngữ / quốc gia — giá trị là `slug` của quốc gia (ví dụ: `hoa-ky`, `viet-nam`)
- **Cấu trúc Response:**
```json
{
  "programs": [
    {
      "id": "cmm1q3rfo000be55g64avayz5",
      "name": "Visa EB-5: Định cư Mỹ",
      "slug": "visa-eb5-my",
      "excerpt": "Đầu tư $800,000 lấy thẻ xanh Mỹ cho cả gia đình (Vợ/chồng và con dưới 21 tuổi).",
      "featuredImage": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
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
    },
    {
      "id": "cmm1q3rfo000ce55g697rwqi9",
      "name": "Dự án EB-5 Mother Gaston",
      "slug": "du-an-eb5-mother-gaston",
      "excerpt": "Dự án EB-5 an toàn, vùng TEA, tỷ lệ tạo việc làm cao, hoàn vốn sau 2 năm.",
      "featuredImage": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80",
      "sortOrder": 2,
      "serviceGroup": {
        "name": "Đầu tư & Định cư Mỹ",
        "slug": "dinh-cu-my"
      },
      "country": {
        "name": "Hoa Kỳ",
        "slug": "hoa-ky",
        "flagIcon": "🇺🇸"
      }
    },
    {
      "id": "cmm1q3rfo000de55gptpz6hrr",
      "name": "Visa 188: Đầu tư & Đổi mới Úc",
      "slug": "visa-188-uc",
      "excerpt": "Dành cho doanh nhân và nhà đầu tư có kinh nghiệm kinh doanh thành công.",
      "featuredImage": "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
      "sortOrder": 1,
      "serviceGroup": {
        "name": "Đầu tư & Định cư Úc",
        "slug": "dinh-cu-uc"
      },
      "country": {
        "name": "Úc",
        "slug": "uc",
        "flagIcon": "🇦🇺"
      }
    },
    {
      "id": "cmm1q3rfo000ee55gkyw1skuz",
      "name": "Golden Visa Bồ Đào Nha",
      "slug": "golden-visa-bo-dao-nha",
      "excerpt": "Đầu tư quỹ mở từ €500,000 nhận thẻ cư trú Châu Âu, tự do đi lại Schengen.",
      "featuredImage": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      "sortOrder": 1,
      "serviceGroup": {
        "name": "Đầu tư & Định cư Châu Âu",
        "slug": "dinh-cu-chau-au"
      },
      "country": {
        "name": "Châu Âu (Schengen)",
        "slug": "chau-au",
        "flagIcon": "🇪🇺"
      }
    }
  ]
}
```

### 4.2 Lấy chi tiết một Chương trình
- **Endpoint:** `GET /api/public/programs/[slug]`
- **Mô tả:** Lấy cấu trúc dữ liệu chi tiết của 1 chương trình. Trường `content` lưu danh sách các khối Block Editor dưới định dạng JSON.
- **Ví dụ gọi API:** `/api/public/programs/visa-eb5-my`
- **Cấu trúc Response:**
```json
{
  "id": "cmm1q3rfo000be55g64avayz5",
  "name": "Visa EB-5: Định cư Mỹ",
  "slug": "visa-eb5-my",
  "excerpt": "Đầu tư $800,000 lấy thẻ xanh Mỹ cho cả gia đình (Vợ/chồng và con dưới 21 tuổi).",
  "content": "[{\"id\":\"4j8c8ydwj\",\"title\":\"Tổng quan chương trình\",\"blocks\":[{\"id\":\"bcuaz1457\",\"type\":\"paragraph\",\"content\":\"Đây là một trong những chương trình định cư hấp dẫn nhất hiện nay, mang lại cơ hội trở thành công dân toàn cầu cho cả gia đình.\"},{\"id\":\"9s4ud7e4f\",\"type\":\"info_table\",\"infoRows\":[{\"label\":\"Quốc gia\",\"value\":\"Hoa Kỳ\"},{\"label\":\"Thời gian thụ lý\",\"value\":\"24 - 36 tháng\"},{\"label\":\"Mức đầu tư\",\"value\":\"$800,000\"}]}]},{\"id\":\"exj9fgzgl\",\"title\":\"Lợi ích nổi bật\",\"blocks\":[{\"id\":\"8gxr5g2tf\",\"type\":\"benefits\",\"benefitItems\":[{\"title\":\"Thẻ xanh cho cả gia đình\",\"description\":\"Vợ/chồng và con cái dưới 21 tuổi độc thân được cấp thẻ xanh.\"},{\"title\":\"Hoàn vốn an toàn\",\"description\":\"Lộ trình hoàn vốn rõ ràng sau 5 năm đầu tư vào dự án.\"},{\"title\":\"Giáo dục miễn phí\",\"description\":\"Con cái học trường công lập miễn phí đến hết cấp 3.\"},{\"title\":\"Quyền lợi công dân\",\"description\":\"Tự do sinh sống, làm việc và kinh doanh tại bất kỳ tiểu bang nào.\"}]}]},{\"id\":\"rk59kcvkc\",\"title\":\"Quy trình thực hiện\",\"blocks\":[{\"id\":\"oghoi3zia\",\"type\":\"steps\",\"stepItems\":[{\"title\":\"Tư vấn & Thẩm định\",\"description\":\"Đánh giá hồ sơ và nguồn tiền, chọn dự án an toàn.\"},{\"title\":\"Đầu tư & Nộp đơn\",\"description\":\"Chuyển tiền vào quỹ Escrow và nộp đơn I-526E.\"},{\"title\":\"Nhận phê duyệt\",\"description\":\"USCIS phê duyệt đơn I-526E và tiến hành phỏng vấn visa.\"},{\"title\":\"Nhận thẻ xanh\",\"description\":\"Cả gia đình nhận thẻ xanh có điều kiện 2 năm.\"}]}]}]",
  "featuredImage": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  "status": "PUBLISHED",
  "sortOrder": 1,
  "createdAt": "2026-02-25T07:38:53.221Z",
  "updatedAt": "2026-02-25T07:38:53.221Z",
  "serviceGroupId": "cmm1q3rfm0008e55gzibodlkv",
  "countryId": "cmm1q3rfi0004e55g4nqktrge",
  "serviceGroup": {
    "name": "Đầu tư & Định cư Mỹ",
    "slug": "dinh-cu-my"
  },
  "country": {
    "name": "Hoa Kỳ",
    "slug": "hoa-ky",
    "flagIcon": "🇺🇸"
  },
  "locale": "hoa-ky"
}
```

---

## 5. Banner

### 5.1 Lấy tất cả Banner đang bật
- **Endpoint:** `GET /api/public/banners`
- **Mô tả:** Lấy danh sách tất cả banner `isActive = true` kèm mảng `images` đang bật, đã sắp xếp theo `sortOrder`.
- **Cấu trúc Response:**
```json
{
  "banners": [
    {
      "id": "abc123",
      "name": "Banner trang chủ",
      "slug": "banner-trang-chu",
      "description": "Slide ảnh hiển thị ở trang chủ",
      "isActive": true,
      "images": [
        {
          "id": "img001",
          "url": "/uploads/slide1.jpg",
          "title": "Chương trình EB-5",
          "link": "/chuong-trinh/visa-eb5-my",
          "sortOrder": 0,
          "isActive": true
        },
        {
          "id": "img002",
          "url": "/uploads/slide2.jpg",
          "title": "Golden Visa",
          "link": "/chuong-trinh/golden-visa-bo-dao-nha",
          "sortOrder": 1,
          "isActive": true
        }
      ]
    }
  ]
}
```

### 5.2 Lấy một Banner theo Slug
- **Endpoint:** `GET /api/public/banners?slug=[slug]`
- **Mô tả:** Lấy chi tiết một banner cụ thể kèm danh sách ảnh đang bật. Trả `404` nếu không tìm thấy hoặc banner đị tắt.
- **Ví dụ gọi API:** `/api/public/banners?slug=banner-trang-chu`
- **Cấu trúc Response:** Cấu trúc giống một phần tử trong mảng `banners` ở trên (không có wrapper).

> **Lưu ý:** Chỉ các banner và ảnh có `isActive = true` mới được trả về. Ảnh đã được sắp xếp theo `sortOrder` sẵn.

---

## 6. Dự án (Projects)

### 6.1 Lấy danh sách Dự án
- **Endpoint:** `GET /api/public/projects`
- **Mô tả:** Lấy danh sách các dự án đã được xuất bản (PUBLISHED).
- **Query Parameters (tùy chọn):**
  - `program` (string): Lọc dự án thuộc về một chương trình cụ thể (slug của chương trình, ví dụ: `dinh-cu-my`)
  - `locale` (string): Lọc dự án theo ngôn ngữ (mặc định là `vi`).
  - `limit` (number): Số lượng kết quả muốn lấy.
- **Cấu trúc Response:**
```json
{
  "data": [
    {
      "id": "cmm1q3rfo000ce55g697rwqi9",
      "name": "Dự án EB-5 Mother Gaston",
      "slug": "du-an-eb5-mother-gaston",
      "excerpt": "Dự án EB-5 an toàn, vùng TEA, tỷ lệ tạo việc làm cao, hoàn vốn sau 2 năm.",
      "featuredImage": "https://example.com/image.jpg",
      "createdAt": "2026-03-16T12:00:00.000Z",
      "program": {
        "name": "Visa EB-5: Định cư Mỹ",
        "slug": "visa-eb5-my"
      }
    }
  ]
}
```

### 6.2 Lấy chi tiết một Dự án
- **Endpoint:** `GET /api/public/projects/[slug]`
- **Mô tả:** Lấy cấu trúc chi tiết của một dự án (chỉ PUBLISHED). Trường `content` chứa JSON Array các block nội dung hiển thị tương tự như Chương trình/Bài viết.
- **Ví dụ gọi API:** `/api/public/projects/du-an-eb5-mother-gaston`
- **Cấu trúc Response:**
```json
{
  "data": {
    "id": "cmm1q3rfo000ce55g697rwqi9",
    "name": "Dự án EB-5 Mother Gaston",
    "slug": "du-an-eb5-mother-gaston",
    "excerpt": "Dự án EB-5 an toàn, vùng TEA...",
    "content": "[{\"id\":\"1a2b3c\",\"title\":\"Tổng quan dự án\",\"blocks\":[...]}]",
    "featuredImage": "https://example.com/image.jpg",
    "status": "PUBLISHED",
    "locale": "vi",
    "sortOrder": 0,
    "createdAt": "2026-03-16T12:00:00.000Z",
    "updatedAt": "2026-03-16T12:00:00.000Z",
    "programId": "cuid_program",
    "program": {
      "name": "Visa EB-5: Định cư Mỹ",
      "slug": "visa-eb5-my"
    }
  }
}
```
