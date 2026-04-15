/**
 * Enrich các icon URL dạng relative path trong content JSON string thành full URL.
 * Trả về JSON string (giữ nguyên kiểu dữ liệu, không đổi cấu trúc API).
 *
 * @param contentStr - raw JSON string từ DB (mảng Section[])
 * @param baseUrl    - origin URL của CMS (vd: https://cms.d-immigration.com)
 * @returns JSON string với icon đã là full URL
 */
export function enrichContentIcons(contentStr: string, baseUrl: string): string {
    try {
        const sections = JSON.parse(contentStr);
        if (!Array.isArray(sections)) return contentStr;

        const enriched = sections.map((section: any) => ({
            ...section,
            blocks: (section.blocks || []).map((block: any) => {
                if (block.type === 'requirements' && Array.isArray(block.requirementItems)) {
                    return {
                        ...block,
                        requirementItems: block.requirementItems.map((item: any) => ({
                            ...item,
                            icon: item.icon && item.icon.startsWith('/')
                                ? `${baseUrl}${item.icon}`
                                : item.icon,
                        })),
                    };
                }
                return block;
            }),
        }));

        return JSON.stringify(enriched);
    } catch {
        return contentStr;
    }
}
