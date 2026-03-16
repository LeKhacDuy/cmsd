import { PrismaClient, Role } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

async function main() {
  console.log('🌱 Bắt đầu xoá dữ liệu cũ và gieo hạt dữ liệu mới (Seeding)...');

  // Xoá dữ liệu cũ để tránh trùng lặp
  await prisma.consultation.deleteMany();
  await prisma.post.deleteMany();
  await prisma.program.deleteMany();
  await prisma.serviceGroup.deleteMany();
  await prisma.category.deleteMany();
  await prisma.country.deleteMany();

  // 1. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dimmigration.com' },
    update: {},
    create: {
      email: 'admin@dimmigration.com',
      password: hashSync('admin123', 10),
      name: 'Admin',
      role: Role.ADMIN,
    },
  });
  const adminId = admin.id;

  // 2. Categories
  console.log('📦 Tảo Danh mục & Quốc gia...');
  const catTinTuc = await prisma.category.create({ data: { name: 'Tin tức', slug: 'tin-tuc', description: 'Tin tức mới nhất về di trú' } });
  const catSuKien = await prisma.category.create({ data: { name: 'Sự kiện', slug: 'su-kien', description: 'Các sự kiện hội thảo' } });
  const catDauTu = await prisma.category.create({ data: { name: 'Góc đầu tư', slug: 'goc-dau-tu', description: 'Kiến thức đầu tư định cư' } });

  // 3. Countries
  const cMy = await prisma.country.create({ data: { name: 'Hoa Kỳ', slug: 'hoa-ky', flagIcon: '🇺🇸' } });
  const cUc = await prisma.country.create({ data: { name: 'Úc', slug: 'uc', flagIcon: '🇦🇺' } });
  const cCanada = await prisma.country.create({ data: { name: 'Canada', slug: 'canada', flagIcon: '🇨🇦' } });
  const cChauAu = await prisma.country.create({ data: { name: 'Châu Âu (Schengen)', slug: 'chau-au', flagIcon: '🇪🇺' } });

  // 4. Service Groups
  console.log('🏛️ Tạo Service Groups...');
  const sgMy = await prisma.serviceGroup.create({ data: { name: 'Đầu tư & Định cư Mỹ', slug: 'dinh-cu-my', sortOrder: 1 } });
  const sgUc = await prisma.serviceGroup.create({ data: { name: 'Đầu tư & Định cư Úc', slug: 'dinh-cu-uc', sortOrder: 2 } });
  const sgChauAu = await prisma.serviceGroup.create({ data: { name: 'Đầu tư & Định cư Châu Âu', slug: 'dinh-cu-chau-au', sortOrder: 3 } });

  // Sample Section JSON Data
  const sampleBlocks = [
    {
      id: generateId(),
      title: "Tổng quan chương trình",
      blocks: [
        { id: generateId(), type: "paragraph", content: "Đây là một trong những chương trình định cư hấp dẫn nhất hiện nay, mang lại cơ hội trở thành công dân toàn cầu cho cả gia đình." },
        {
          id: generateId(), type: "info_table", infoRows: [
            { label: "Quốc gia", value: "Hoa Kỳ" },
            { label: "Thời gian thụ lý", value: "24 - 36 tháng" },
            { label: "Mức đầu tư", value: "$800,000" }
          ]
        }
      ]
    },
    {
      id: generateId(),
      title: "Lợi ích nổi bật",
      blocks: [
        {
          id: generateId(), type: "benefits", benefitItems: [
            { title: "Thẻ xanh cho cả gia đình", description: "Vợ/chồng và con cái dưới 21 tuổi độc thân được cấp thẻ xanh." },
            { title: "Hoàn vốn an toàn", description: "Lộ trình hoàn vốn rõ ràng sau 5 năm đầu tư vào dự án." },
            { title: "Giáo dục miễn phí", description: "Con cái học trường công lập miễn phí đến hết cấp 3." },
            { title: "Quyền lợi công dân", description: "Tự do sinh sống, làm việc và kinh doanh tại bất kỳ tiểu bang nào." }
          ]
        }
      ]
    },
    {
      id: generateId(),
      title: "Quy trình thực hiện",
      blocks: [
        {
          id: generateId(), type: "steps", stepItems: [
            { title: "Tư vấn & Thẩm định", description: "Đánh giá hồ sơ và nguồn tiền, chọn dự án an toàn." },
            { title: "Đầu tư & Nộp đơn", description: "Chuyển tiền vào quỹ Escrow và nộp đơn I-526E." },
            { title: "Nhận phê duyệt", description: "USCIS phê duyệt đơn I-526E và tiến hành phỏng vấn visa." },
            { title: "Nhận thẻ xanh", description: "Cả gia đình nhận thẻ xanh có điều kiện 2 năm." }
          ]
        }
      ]
    }
  ];
  const stringifiedBlocks = JSON.stringify(sampleBlocks);

  // 5. Programs
  console.log('📜 Tạo Programs...');
  await prisma.program.createMany({
    data: [
      { name: 'Visa EB-5: Định cư Mỹ', slug: 'visa-eb5-my', excerpt: 'Đầu tư $800,000 lấy thẻ xanh Mỹ cho cả gia đình (Vợ/chồng và con dưới 21 tuổi).', status: 'PUBLISHED', serviceGroupId: sgMy.id, countryId: cMy.id, content: stringifiedBlocks, featuredImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', sortOrder: 1 },
      { name: 'Dự án EB-5 Mother Gaston', slug: 'du-an-eb5-mother-gaston', excerpt: 'Dự án EB-5 an toàn, vùng TEA, tỷ lệ tạo việc làm cao, hoàn vốn sau 2 năm.', status: 'PUBLISHED', serviceGroupId: sgMy.id, countryId: cMy.id, content: stringifiedBlocks, featuredImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80', sortOrder: 2 },
      { name: 'Visa 188: Đầu tư & Đổi mới Úc', slug: 'visa-188-uc', excerpt: 'Dành cho doanh nhân và nhà đầu tư có kinh nghiệm kinh doanh thành công.', status: 'PUBLISHED', serviceGroupId: sgUc.id, countryId: cUc.id, content: stringifiedBlocks, featuredImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80', sortOrder: 1 },
      { name: 'Golden Visa Bồ Đào Nha', slug: 'golden-visa-bo-dao-nha', excerpt: 'Đầu tư quỹ mở từ €500,000 nhận thẻ cư trú Châu Âu, tự do đi lại Schengen.', status: 'PUBLISHED', serviceGroupId: sgChauAu.id, countryId: cChauAu.id, content: stringifiedBlocks, featuredImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80', sortOrder: 1 },
    ],
  });

  // 6. Posts
  console.log('📰 Tạo Posts...');
  await prisma.post.createMany({
    data: [
      {
        title: 'Chính sách Visa EB-5 mới nhất năm 2026',
        slug: 'chinh-sach-visa-eb5-moi-nhat-2026',
        excerpt: 'USCIS chính thức cập nhật thời gian thụ lý và quy định về chứng minh nguồn tiền cho các nhà đầu tư EB-5 năm nay.',
        content: JSON.stringify([{ id: generateId(), title: 'Nội dung bài viết', blocks: [{ id: generateId(), type: 'paragraph', content: 'Năm 2026 đánh dấu nhiều sự thay đổi tích cực trong chính sách thụ lý visa EB-5...' }] }]),
        featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        status: 'PUBLISHED',
        categoryId: catTinTuc.id,
        countryId: cMy.id,
        authorId: adminId,
      },
      {
        title: 'Hội thảo Định cư Mỹ: Gặp gỡ luật sư di trú hàng đầu',
        slug: 'hoi-thao-dinh-cu-my-gap-go-luat-su-di-tru',
        excerpt: 'Kính mời quý nhà đầu tư tham dự sự kiện chia sẻ lộ trình định cư lấy thẻ xanh Mỹ an toàn thời gian kỷ lục.',
        content: JSON.stringify([{ id: generateId(), title: 'Nội dung sự kiện', blocks: [{ id: generateId(), type: 'paragraph', content: 'Sự kiện diễn ra vào sáng thứ Bảy tại khách sạn Park Hyatt Sài Gòn...' }] }]),
        featuredImage: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80',
        status: 'PUBLISHED',
        categoryId: catSuKien.id,
        countryId: cMy.id,
        authorId: adminId,
      },
      {
        title: 'Thị trường Bất động sản Úc tăng nhiệt, cơ hội hay thách thức?',
        slug: 'thi-truong-bat-dong-san-uc-tang-nhiet',
        excerpt: 'Phân tích từ chuyên gia về biến động thị trường nhà ở Úc ảnh hưởng thế nào đến các hồ sơ định cư diện đầu tư kinh doanh.',
        content: JSON.stringify([{ id: generateId(), title: 'Góc nhìn chuyên gia', blocks: [{ id: generateId(), type: 'paragraph', content: 'Nhiều nhà đầu tư đang cân nhắc chuyển hướng Portfolio sang mảng thương mại thay vì nhà ở...' }] }]),
        featuredImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
        status: 'PUBLISHED',
        categoryId: catDauTu.id,
        countryId: cUc.id,
        authorId: adminId,
      }
    ]
  });

  // 7. Consultations
  console.log('💬 Tạo Consultations...');
  await prisma.consultation.createMany({
    data: [
      { fullName: 'Trần Minh Tuấn', phone: '0901234567', city: 'Hà Nội', program: 'Visa EB-5: Định cư Mỹ', note: 'Đã hẹn tư vấn lúc 2h chiều T5', isRead: true },
      { fullName: 'Lê Thị Mỹ', phone: '0939876543', city: 'TP. Hồ Chí Minh', email: 'lemy@gmail.com', program: 'Dự án EB-5 Mother Gaston', isRead: false },
      { fullName: 'Phạm Quang Hùng', phone: '0861112223', city: 'Đà Nẵng', program: 'Golden Visa Bồ Đào Nha', isRead: false },
    ]
  });

  console.log('✅ ĐÃ TẠO XONG TOÀN BỘ DATA MẪU!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
