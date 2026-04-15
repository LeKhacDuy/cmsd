'use client';

import { useState } from 'react';
import {
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineChevronUp,
    HiOutlineChevronDown,
    HiOutlinePhoto,
    HiOutlineBars3BottomLeft,
    HiOutlineListBullet,
    HiOutlineDocumentText,
    HiOutlineTableCells,
    HiOutlineCheckBadge,
    HiOutlineQueueList,
    HiOutlineClock,
    HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2';
import ImageUpload from '@/components/ImageUpload';

// ---- Types ----

type ListItem = { text: string; children: string[] };
type InfoRow = { label: string; value: string };
type BenefitItem = { title: string; description: string };
type RequirementItem = { icon: string; title: string; description: string };
type StepItem = { title: string; description: string };
type TimelineItem = { time: string; title: string; details: string[] };

export type Block = {
    id: string;
    type: 'heading' | 'paragraph' | 'image' | 'list' | 'info_table' | 'benefits' | 'requirements' | 'steps' | 'timeline';
    content: string;
    caption?: string;
    items?: ListItem[];
    infoRows?: InfoRow[];
    benefitItems?: BenefitItem[];
    requirementItems?: RequirementItem[];
    stepItems?: StepItem[];
    timelineItems?: TimelineItem[];
};

export type Section = {
    id: string;
    title: string;
    blocks: Block[];
};

interface BlockEditorProps {
    initialSections?: Section[];
    onChange: (sections: Section[]) => void;
    hideAdvancedBlocks?: boolean;
    hideListBlock?: boolean;
    hiddenBlockTypes?: string[];
    maxSections?: number;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

export default function BlockEditor({ initialSections = [], onChange, hideAdvancedBlocks = false, hideListBlock = false, hiddenBlockTypes = [], maxSections }: BlockEditorProps) {
    const [sections, setSections] = useState<Section[]>(initialSections);

    const update = (newSections: Section[]) => {
        setSections(newSections);
        onChange(newSections);
    };

    // ---- Section actions ----
    const addSection = () => {
        update([...sections, { id: generateId(), title: '', blocks: [] }]);
    };

    const removeSection = (sectionId: string) => {
        update(sections.filter((s) => s.id !== sectionId));
    };

    const updateSectionTitle = (sectionId: string, title: string) => {
        update(sections.map((s) => (s.id === sectionId ? { ...s, title } : s)));
    };

    const moveSectionUp = (index: number) => {
        if (index === 0) return;
        const arr = [...sections];
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        update(arr);
    };

    const moveSectionDown = (index: number) => {
        if (index >= sections.length - 1) return;
        const arr = [...sections];
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        update(arr);
    };

    // ---- Block actions ----
    const addBlock = (sectionId: string, type: Block['type']) => {
        update(
            sections.map((s) => {
                if (s.id !== sectionId) return s;
                const newBlock: Block = {
                    id: generateId(),
                    type,
                    content: '',
                    ...(type === 'list' ? { items: [{ text: '', children: [] }] } : {}),
                    ...(type === 'image' ? { caption: '' } : {}),
                    ...(type === 'info_table' ? { infoRows: [{ label: '', value: '' }] } : {}),
                    ...(type === 'benefits' ? { benefitItems: [{ title: '', description: '' }] } : {}),
                    ...(type === 'requirements' ? { requirementItems: [{ icon: '📋', title: '', description: '' }] } : {}),
                    ...(type === 'steps' ? { stepItems: [{ title: '', description: '' }] } : {}),
                    ...(type === 'timeline' ? { timelineItems: [{ time: '', title: '', details: [''] }] } : {}),
                };
                return { ...s, blocks: [...s.blocks, newBlock] };
            })
        );
    };

    const removeBlock = (sectionId: string, blockId: string) => {
        update(
            sections.map((s) => {
                if (s.id !== sectionId) return s;
                return { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) };
            })
        );
    };

    const updateBlock = (sectionId: string, blockId: string, data: Partial<Block>) => {
        update(
            sections.map((s) => {
                if (s.id !== sectionId) return s;
                return {
                    ...s,
                    blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...data } : b)),
                };
            })
        );
    };

    const moveBlockUp = (sectionId: string, index: number) => {
        if (index === 0) return;
        update(
            sections.map((s) => {
                if (s.id !== sectionId) return s;
                const arr = [...s.blocks];
                [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
                return { ...s, blocks: arr };
            })
        );
    };

    const moveBlockDown = (sectionId: string, index: number) => {
        update(
            sections.map((s) => {
                if (s.id !== sectionId) return s;
                if (index >= s.blocks.length - 1) return s;
                const arr = [...s.blocks];
                [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
                return { ...s, blocks: arr };
            })
        );
    };

    // ---- List item helpers ----
    const normalizeListItems = (raw: any[]): ListItem[] =>
        raw.map((i) =>
            typeof i === 'string'
                ? { text: i, children: [] }
                : { text: i.text ?? '', children: i.children ?? [] }
        );

    const updateListItems = (sectionId: string, blockId: string, updater: (items: ListItem[]) => ListItem[]) => {
        update(sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
                ...s, blocks: s.blocks.map((b) => {
                    if (b.id !== blockId) return b;
                    const normalized = normalizeListItems(b.items || []);
                    return { ...b, items: updater(normalized) };
                })
            };
        }));
    };

    const addListItem = (sectionId: string, blockId: string) =>
        updateListItems(sectionId, blockId, (items) => [...items, { text: '', children: [] }]);

    const updateListItemText = (sectionId: string, blockId: string, idx: number, value: string) =>
        updateListItems(sectionId, blockId, (items) =>
            items.map((it, i) => i === idx ? { ...it, text: value } : it)
        );

    const removeListItem = (sectionId: string, blockId: string, idx: number) =>
        updateListItems(sectionId, blockId, (items) => items.filter((_, i) => i !== idx));

    const addChildItem = (sectionId: string, blockId: string, parentIdx: number) =>
        updateListItems(sectionId, blockId, (items) =>
            items.map((it, i) => i === parentIdx ? { ...it, children: [...it.children, ''] } : it)
        );

    const updateChildItem = (sectionId: string, blockId: string, parentIdx: number, childIdx: number, value: string) =>
        updateListItems(sectionId, blockId, (items) =>
            items.map((it, i) => {
                if (i !== parentIdx) return it;
                const children = [...it.children];
                children[childIdx] = value;
                return { ...it, children };
            })
        );

    const removeChildItem = (sectionId: string, blockId: string, parentIdx: number, childIdx: number) =>
        updateListItems(sectionId, blockId, (items) =>
            items.map((it, i) => i === parentIdx
                ? { ...it, children: it.children.filter((_, ci) => ci !== childIdx) }
                : it
            )
        );

    // ---- Generic array item helpers ----
    const updateArrayField = <T,>(sectionId: string, blockId: string, field: string, updater: (arr: T[]) => T[]) => {
        update(sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
                ...s, blocks: s.blocks.map((b) => {
                    if (b.id !== blockId) return b;
                    return { ...b, [field]: updater((b as any)[field] || []) };
                })
            };
        }));
    };

    // ---- Block Label ----
    const blockLabel = (type: Block['type']) => {
        const map: Record<string, string> = {
            heading: '📝 Tiêu đề phụ',
            paragraph: '📄 Đoạn văn',
            image: '🖼️ Hình ảnh',
            list: '📋 Danh sách',
            info_table: '📊 Bảng thông tin',
            benefits: '✅ Lợi ích nổi bật',
            steps: '🔢 Quy trình',
            timeline: '⏱️ Timeline',
        };
        return map[type] || type;
    };

    // ---- Render ----

    const renderInfoTable = (section: Section, block: Block) => {
        const rows = block.infoRows || [];
        return (
            <div className="be-info-table">
                {rows.map((row, idx) => (
                    <div key={idx} className="be-info-row">
                        <input
                            type="text"
                            className="be-input be-info-label"
                            placeholder="Nhãn (VD: Quốc gia)"
                            value={row.label}
                            onChange={(e) => {
                                const updated = [...rows];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                updateBlock(section.id, block.id, { infoRows: updated });
                            }}
                        />
                        <textarea
                            className="be-textarea be-info-value"
                            placeholder="Giá trị (mỗi dòng = 1 bullet)"
                            value={row.value}
                            rows={2}
                            onChange={(e) => {
                                const updated = [...rows];
                                updated[idx] = { ...updated[idx], value: e.target.value };
                                updateBlock(section.id, block.id, { infoRows: updated });
                            }}
                        />
                        <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => {
                            updateBlock(section.id, block.id, { infoRows: rows.filter((_, i) => i !== idx) });
                        }}>
                            <HiOutlineTrash />
                        </button>
                    </div>
                ))}
                <button type="button" className="be-add-item" onClick={() => {
                    updateBlock(section.id, block.id, { infoRows: [...rows, { label: '', value: '' }] });
                }}>
                    <HiOutlinePlus /> Thêm hàng
                </button>
            </div>
        );
    };

    const renderBenefits = (section: Section, block: Block) => {
        const items = block.benefitItems || [];
        return (
            <div className="be-benefits">
                {items.map((item, idx) => (
                    <div key={idx} className="be-benefit-card">
                        <div className="be-benefit-card-header">
                            <span className="be-benefit-icon">✅</span>
                            <span className="be-benefit-num">Lợi ích {idx + 1}</span>
                            <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => {
                                updateBlock(section.id, block.id, { benefitItems: items.filter((_, i) => i !== idx) });
                            }}>
                                <HiOutlineTrash />
                            </button>
                        </div>
                        <input
                            type="text"
                            className="be-input"
                            placeholder="Tiêu đề lợi ích"
                            value={item.title}
                            onChange={(e) => {
                                const updated = [...items];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                updateBlock(section.id, block.id, { benefitItems: updated });
                            }}
                        />
                        <textarea
                            className="be-textarea"
                            placeholder="Mô tả chi tiết..."
                            value={item.description}
                            rows={2}
                            onChange={(e) => {
                                const updated = [...items];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                updateBlock(section.id, block.id, { benefitItems: updated });
                            }}
                        />
                    </div>
                ))}
                <button type="button" className="be-add-item" onClick={() => {
                    updateBlock(section.id, block.id, { benefitItems: [...items, { title: '', description: '' }] });
                }}>
                    <HiOutlinePlus /> Thêm lợi ích
                </button>
            </div>
        );
    };

    const REQUIREMENT_ICONS = [
        { path: '/icon-dieu-kien-tham-gia/Bank.png', label: 'Bank' },
        { path: '/icon-dieu-kien-tham-gia/Coins.png', label: 'Coins' },
        { path: '/icon-dieu-kien-tham-gia/MinusCircle.png', label: 'MinusCircle' },
        { path: '/icon-dieu-kien-tham-gia/ReadCvLogo.png', label: 'ReadCvLogo' },
        { path: '/icon-dieu-kien-tham-gia/Vector.png', label: 'Vector' },
    ];

    const renderRequirements = (section: Section, block: Block) => {
        const items = block.requirementItems || [];
        return (
            <div className="be-benefits">
                {items.map((item, idx) => (
                    <div key={idx} className="be-benefit-card">
                        <div className="be-benefit-card-header">
                            <span className="be-benefit-num">Điều kiện {idx + 1}</span>
                            <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => {
                                updateBlock(section.id, block.id, { requirementItems: items.filter((_, i) => i !== idx) });
                            }}>
                                <HiOutlineTrash />
                            </button>
                        </div>

                        {/* Icon picker */}
                        <div className="be-req-icon-section">
                            <span className="be-req-icon-label">Chọn icon:</span>
                            <div className="be-req-icon-grid">
                                {REQUIREMENT_ICONS.map((ic) => (
                                    <button
                                        key={ic.path}
                                        type="button"
                                        className={`be-req-icon-btn${item.icon === ic.path ? ' be-req-icon-btn--active' : ''}`}
                                        onClick={() => {
                                            const updated = [...items];
                                            updated[idx] = { ...updated[idx], icon: ic.path };
                                            updateBlock(section.id, block.id, { requirementItems: updated });
                                        }}
                                        title={ic.label}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={ic.path} alt={ic.label} width={32} height={32} style={{ objectFit: 'contain' }} />
                                    </button>
                                ))}
                            </div>
                            {item.icon && (
                                <div className="be-req-icon-preview">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.icon} alt="preview" width={40} height={40} style={{ objectFit: 'contain' }} />
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>Đã chọn</span>
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            className="be-input"
                            placeholder="Tiêu đề điều kiện"
                            value={item.title}
                            onChange={(e) => {
                                const updated = [...items];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                updateBlock(section.id, block.id, { requirementItems: updated });
                            }}
                        />
                        <textarea
                            className="be-textarea"
                            placeholder="Mô tả chi tiết..."
                            value={item.description}
                            rows={2}
                            onChange={(e) => {
                                const updated = [...items];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                updateBlock(section.id, block.id, { requirementItems: updated });
                            }}
                        />
                    </div>
                ))}
                <button type="button" className="be-add-item" onClick={() => {
                    updateBlock(section.id, block.id, { requirementItems: [...items, { icon: '', title: '', description: '' }] });
                }}>
                    <HiOutlinePlus /> Thêm điều kiện
                </button>
            </div>
        );
    };

    const renderSteps = (section: Section, block: Block) => {
        const items = block.stepItems || [];
        return (
            <div className="be-steps">
                {items.map((item, idx) => (
                    <div key={idx} className="be-step-item">
                        <div className="be-step-number">{idx + 1}</div>
                        <div className="be-step-content">
                            <input
                                type="text"
                                className="be-input"
                                placeholder={`Bước ${idx + 1}: Tiêu đề`}
                                value={item.title}
                                onChange={(e) => {
                                    const updated = [...items];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    updateBlock(section.id, block.id, { stepItems: updated });
                                }}
                            />
                            <textarea
                                className="be-textarea"
                                placeholder="Mô tả bước này..."
                                value={item.description}
                                rows={2}
                                onChange={(e) => {
                                    const updated = [...items];
                                    updated[idx] = { ...updated[idx], description: e.target.value };
                                    updateBlock(section.id, block.id, { stepItems: updated });
                                }}
                            />
                        </div>
                        <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => {
                            updateBlock(section.id, block.id, { stepItems: items.filter((_, i) => i !== idx) });
                        }}>
                            <HiOutlineTrash />
                        </button>
                    </div>
                ))}
                <button type="button" className="be-add-item" onClick={() => {
                    updateBlock(section.id, block.id, { stepItems: [...items, { title: '', description: '' }] });
                }}>
                    <HiOutlinePlus /> Thêm bước
                </button>
            </div>
        );
    };

    const renderTimeline = (section: Section, block: Block) => {
        const items = block.timelineItems || [];
        return (
            <div className="be-timeline">
                <input
                    type="text"
                    className="be-input"
                    placeholder="Tiêu đề Timeline (VD: Lộ trình thực hiện)"
                    value={block.content}
                    onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })}
                    style={{ marginBottom: 16, fontWeight: 600, fontSize: 15 }}
                />
                {items.map((item, idx) => (
                    <div key={idx} className="be-timeline-item">
                        <div className="be-timeline-marker" />
                        <div className="be-timeline-content">
                            <div className="be-timeline-top">
                                <input
                                    type="text"
                                    className="be-input be-timeline-time"
                                    placeholder="Thời gian (VD: 6-8 tuần)"
                                    value={item.time}
                                    onChange={(e) => {
                                        const updated = [...items];
                                        updated[idx] = { ...updated[idx], time: e.target.value };
                                        updateBlock(section.id, block.id, { timelineItems: updated });
                                    }}
                                />
                                <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => {
                                    updateBlock(section.id, block.id, { timelineItems: items.filter((_, i) => i !== idx) });
                                }}>
                                    <HiOutlineTrash />
                                </button>
                            </div>
                            <input
                                type="text"
                                className="be-input"
                                placeholder="Tiêu đề mốc"
                                value={item.title}
                                onChange={(e) => {
                                    const updated = [...items];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    updateBlock(section.id, block.id, { timelineItems: updated });
                                }}
                            />
                            <div className="be-timeline-details">
                                {(item.details || []).map((d, dIdx) => (
                                    <div key={dIdx} className="be-list-item">
                                        <span className="be-list-bullet">•</span>
                                        <input
                                            type="text"
                                            className="be-input"
                                            placeholder={`Chi tiết ${dIdx + 1}`}
                                            value={d}
                                            onChange={(e) => {
                                                const updated = [...items];
                                                const details = [...updated[idx].details];
                                                details[dIdx] = e.target.value;
                                                updated[idx] = { ...updated[idx], details };
                                                updateBlock(section.id, block.id, { timelineItems: updated });
                                            }}
                                        />
                                        <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => {
                                            const updated = [...items];
                                            updated[idx] = { ...updated[idx], details: updated[idx].details.filter((_, i) => i !== dIdx) };
                                            updateBlock(section.id, block.id, { timelineItems: updated });
                                        }}>
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="be-add-item-sm" onClick={() => {
                                    const updated = [...items];
                                    updated[idx] = { ...updated[idx], details: [...updated[idx].details, ''] };
                                    updateBlock(section.id, block.id, { timelineItems: updated });
                                }}>
                                    <HiOutlinePlus /> Thêm chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="be-add-item" onClick={() => {
                    updateBlock(section.id, block.id, {
                        timelineItems: [...items, { time: '', title: '', details: [''] }],
                    });
                }}>
                    <HiOutlinePlus /> Thêm mốc thời gian
                </button>
            </div>
        );
    };

    return (
        <div className="block-editor">
            {sections.map((section, sIndex) => (
                <div key={section.id} className="be-section">
                    <div className="be-section-header">
                        <div className="be-section-drag">
                            <button type="button" className="be-btn-icon" onClick={() => moveSectionUp(sIndex)} disabled={sIndex === 0} title="Lên">
                                <HiOutlineChevronUp />
                            </button>
                            <button type="button" className="be-btn-icon" onClick={() => moveSectionDown(sIndex)} disabled={sIndex === sections.length - 1} title="Xuống">
                                <HiOutlineChevronDown />
                            </button>
                        </div>
                        <div className="be-section-title-wrap">
                            <span className="be-section-label">Section {sIndex + 1}</span>
                            <input
                                type="text"
                                className="be-section-title"
                                placeholder="Tiêu đề section (VD: Giới thiệu chung, Lợi ích nổi bật...)"
                                value={section.title}
                                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                            />
                        </div>
                        <button type="button" className="be-btn-icon be-btn-danger" onClick={() => removeSection(section.id)} title="Xoá section">
                            <HiOutlineTrash />
                        </button>
                    </div>

                    <div className="be-blocks">
                        {section.blocks.map((block, bIndex) => (
                            <div key={block.id} className="be-block">
                                <div className="be-block-header">
                                    <span className="be-block-type">{blockLabel(block.type)}</span>
                                    <div className="be-block-actions">
                                        <button type="button" className="be-btn-icon-sm" onClick={() => moveBlockUp(section.id, bIndex)} disabled={bIndex === 0}>
                                            <HiOutlineChevronUp />
                                        </button>
                                        <button type="button" className="be-btn-icon-sm" onClick={() => moveBlockDown(section.id, bIndex)} disabled={bIndex === section.blocks.length - 1}>
                                            <HiOutlineChevronDown />
                                        </button>
                                        <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => removeBlock(section.id, block.id)}>
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>

                                {block.type === 'heading' && (
                                    <input type="text" className="be-input" placeholder="Nhập tiêu đề phụ..." value={block.content} onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })} />
                                )}

                                {block.type === 'paragraph' && (
                                    <textarea className="be-textarea" placeholder="Nhập nội dung đoạn văn..." value={block.content} onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })} rows={4} />
                                )}

                                {block.type === 'image' && (
                                    <div className="be-image-block img-upload-sm">
                                        <ImageUpload value={block.content} onChange={(url) => updateBlock(section.id, block.id, { content: url })} height={160} />
                                        <input type="text" className="be-input be-input-caption" placeholder="Chú thích ảnh (không bắt buộc)" value={block.caption || ''} onChange={(e) => updateBlock(section.id, block.id, { caption: e.target.value })} />
                                    </div>
                                )}

                                {block.type === 'list' && (() => {
                                    const listItems: ListItem[] = (block.items || []).map((i: any) =>
                                        typeof i === 'string' ? { text: i, children: [] } : { text: i.text ?? '', children: i.children ?? [] }
                                    );
                                    return (
                                        <div className="be-list-block">
                                            {listItems.map((item, iIndex) => (
                                                <div key={iIndex} className="be-list-parent-wrap">
                                                    <div className="be-list-item">
                                                        <span className="be-list-bullet">•</span>
                                                        <input
                                                            type="text"
                                                            className="be-input"
                                                            placeholder={`Mục ${iIndex + 1}`}
                                                            value={item.text}
                                                            onChange={(e) => updateListItemText(section.id, block.id, iIndex, e.target.value)}
                                                        />
                                                        <button type="button" className="be-btn-icon-sm" title="Thêm mục con" onClick={() => addChildItem(section.id, block.id, iIndex)} style={{ color: 'var(--primary)' }}>
                                                            <HiOutlinePlus />
                                                        </button>
                                                        <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => removeListItem(section.id, block.id, iIndex)}>
                                                            <HiOutlineTrash />
                                                        </button>
                                                    </div>
                                                    {item.children.length > 0 && (
                                                        <div className="be-list-children">
                                                            {item.children.map((child, cIndex) => (
                                                                <div key={cIndex} className="be-list-item be-list-child-item">
                                                                    <span className="be-list-bullet be-list-child-bullet">◦</span>
                                                                    <input
                                                                        type="text"
                                                                        className="be-input"
                                                                        placeholder={`Mục con ${cIndex + 1}`}
                                                                        value={child}
                                                                        onChange={(e) => updateChildItem(section.id, block.id, iIndex, cIndex, e.target.value)}
                                                                    />
                                                                    <button type="button" className="be-btn-icon-sm be-btn-danger" onClick={() => removeChildItem(section.id, block.id, iIndex, cIndex)}>
                                                                        <HiOutlineTrash />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" className="be-add-item" onClick={() => addListItem(section.id, block.id)}>
                                                <HiOutlinePlus /> Thêm mục
                                            </button>
                                        </div>
                                    );
                                })()}

                                {block.type === 'info_table' && renderInfoTable(section, block)}
                                {block.type === 'benefits' && renderBenefits(section, block)}
                                {block.type === 'requirements' && renderRequirements(section, block)}
                                {block.type === 'steps' && renderSteps(section, block)}
                                {block.type === 'timeline' && renderTimeline(section, block)}
                            </div>
                        ))}

                        <div className="be-add-block">
                            <span className="be-add-block-label">Thêm block:</span>
                            <div className="be-add-block-grid">
                                <button type="button" className="be-add-block-btn" onClick={() => addBlock(section.id, 'heading')}>
                                    <HiOutlineDocumentText /> Tiêu đề phụ
                                </button>
                                <button type="button" className="be-add-block-btn" onClick={() => addBlock(section.id, 'paragraph')}>
                                    <HiOutlineBars3BottomLeft /> Đoạn văn
                                </button>
                                <button type="button" className="be-add-block-btn" onClick={() => addBlock(section.id, 'image')}>
                                    <HiOutlinePhoto /> Hình ảnh
                                </button>
                                {!hideListBlock && (
                                    <button type="button" className="be-add-block-btn" onClick={() => addBlock(section.id, 'list')}>
                                        <HiOutlineListBullet /> Danh sách
                                    </button>
                                )}
                                {!hideAdvancedBlocks && (() => {
                                    const has = (t: string) => section.blocks.some(b => b.type === t);
                                    const hidden = (t: string) => hiddenBlockTypes.includes(t);
                                    return (
                                        <>
                                            {!has('info_table') && (
                                                <button type="button" className="be-add-block-btn be-add-block-new" onClick={() => addBlock(section.id, 'info_table')}>
                                                    <HiOutlineTableCells /> Bảng thông tin
                                                </button>
                                            )}
                                            {!has('benefits') && !hidden('benefits') && (
                                                <button type="button" className="be-add-block-btn be-add-block-new" onClick={() => addBlock(section.id, 'benefits')}>
                                                    <HiOutlineCheckBadge /> Lợi ích
                                                </button>
                                            )}
                                            {!has('requirements') && !hidden('requirements') && (
                                                <button type="button" className="be-add-block-btn be-add-block-new" onClick={() => addBlock(section.id, 'requirements')}>
                                                    <HiOutlineClipboardDocumentCheck /> Điều kiện tham gia
                                                </button>
                                            )}
                                            {!has('steps') && !hidden('steps') && (
                                                <button type="button" className="be-add-block-btn be-add-block-new" onClick={() => addBlock(section.id, 'steps')}>
                                                    <HiOutlineQueueList /> Quy trình
                                                </button>
                                            )}
                                            {!has('timeline') && !hidden('timeline') && (
                                                <button type="button" className="be-add-block-btn be-add-block-new" onClick={() => addBlock(section.id, 'timeline')}>
                                                    <HiOutlineClock /> Timeline
                                                </button>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {(!maxSections || sections.length < maxSections) && (
                <button type="button" className="be-add-section" onClick={addSection}>
                    <HiOutlinePlus /> Thêm Section
                </button>
            )}
        </div>
    );
}
