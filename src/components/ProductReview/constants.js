export const SECTIONS = [
  {
    title: '기본정보',
    fields: [
      { varName: 'account_name', displayName: '업체명' },
      { varName: 'product_name', displayName: '품명' },
      { varName: 'product_size', displayName: '규격' },
      { varName: 'is_print', displayName: '무지/인쇄' }
    ]
  },
  {
    title: '압출',
    fields: [
      { varName: 'ext_color', displayName: '압출색상' },
      { varName: 'ext_pretreat', displayName: '인쇄전처리' },
      { varName: 'ext_antistatic', displayName: '대전방지' },
      { varName: 'ext_memo', displayName: '압출메모' }
    ]
  },
  {
    title: '인쇄',
    fields: [
      { varName: 'print_image_preview', displayName: '도안' },
      { varName: 'print_front_color_count', displayName: '전면도수' },
      { varName: 'print_front_color', displayName: '전면색상' },
      { varName: 'print_front_position', displayName: '전면인쇄위치' },
      { varName: 'print_back_color_count', displayName: '후면도수' },
      { varName: 'print_back_color', displayName: '후면색상' },
      { varName: 'print_back_position', displayName: '후면인쇄위치' },
      { varName: 'print_memo', displayName: '인쇄메모' }
    ]
  },
  {
    title: '가공',
    fields: [
      { varName: 'cut_position', displayName: '가공위치' },
      { varName: 'cut_ultrasonic', displayName: '초음파가공' },
      { varName: 'cut_powder_pack', displayName: '가루포장' },
      { varName: 'cut_is_punched', displayName: '바람구멍' },
      { varName: 'cut_punch_count', displayName: '바람구멍개수' },
      { varName: 'cut_punch_size', displayName: '바람구멍크기' },
      { varName: 'cut_punch_position', displayName: '바람구멍위치' },
      { varName: 'cut_memo', displayName: '가공메모' }
    ]
  },
  {
    title: '포장',
    fields: [
      { varName: 'pack_material', displayName: '포장방법' },
      { varName: 'pack_unit', displayName: '포장단위' },
      { varName: 'pack_deliver_all', displayName: '전량납' },
      { varName: 'pack_memo', displayName: '포장메모' }
    ]
  },
  {
    title: '참고사항',
    fields: [
      { varName: 'unit_price', displayName: '단가' },
      { varName: 'product_memo', displayName: '메모' }
    ]
  }
];
