export const PRODUCT_FORM_INITIAL_STATE = {
  isReviewOpen: false,

  // inputs
  // basic info
  account_id: '',
  account_name: '',
  product_name: '',
  product_thick: '',
  product_length: '',
  product_width: '',
  is_print: 'is_print_false',

  // extrusion
  ext_color: '',
  ext_antistatic: false,
  ext_pretreat: '', // 없음: '', '단면', '양면'
  ext_memo: '',

  // printing
  print_front_color_count: 0,
  print_front_color: '',
  print_front_position: '',
  print_back_color_count: 0,
  print_back_color: '',
  print_back_position: '',
  print_image_file_name: '',
  print_image_preview: '',
  print_image_url: '',
  print_memo: '',

  // cutting
  cut_position: '',
  cut_ultrasonic: false,
  cut_powder_pack: false,
  cut_is_punched: false,
  cut_punch_count: 0,
  cut_punch_size: '',
  cut_punch_position: '',
  cut_memo: '',

  // packaging
  pack_material: '',
  pack_unit: 0,
  pack_deliver_all: false,
  pack_memo: '',

  // for manager
  unit_price: 0,
  product_memo: '',

  // validation errors
  account_name_error: '',
  product_name_error: '',
  product_thick_error: '',
  product_length_error: '',
  product_width_error: '',
  ext_color_error: ''
};

export const PRODUCT_FORM_SECTIONS = [
  {
    title: '기본정보',
    fields: [
      { varName: 'account_name', displayName: '업체명', xs: 12, sm: 5, lg: 3 },
      { varName: 'product_name', displayName: '품명', xs: 12, sm: 7, lg: 4 },
      { varName: 'product_thick', displayName: '두께', xs: 4, sm: 3, lg: 1 },
      {
        varName: 'product_length',
        displayName: '길이(압출)',
        xs: 4,
        sm: 3,
        lg: 1
      },
      {
        varName: 'product_width',
        displayName: '너비(가공)',
        xs: 4,
        sm: 3,
        lg: 1
      },
      {
        type: 'radio',
        varName: 'is_print',
        options: [
          { value: 'is_print_false', label: '무지' },
          { value: 'is_print_true', label: '인쇄' }
        ],
        xs: 12,
        sm: 3,
        lg: 2
      }
    ]
  },
  {
    title: '압출',
    fields: [
      { varName: 'ext_color', displayName: '압출색상', xs: 12, sm: 7, lg: 3 },
      {
        type: 'radio',
        varName: 'ext_pretreat',
        options: [
          { value: '단면', label: '단면' },
          { value: '양면', label: '양면' }
        ],
        xs: 7,
        sm: 3,
        lg: 2
      },
      {
        type: 'checkbox',
        varName: 'ext_antistatic',
        displayName: '대전방지',
        xs: 5,
        sm: 2,
        lg: 2
      },
      {
        varName: 'ext_memo',
        displayName: '압출메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  },
  {
    title: '인쇄',
    fields: [
      {
        varName: 'print_image_url',
        displayName: '기존 도안',
        xs: 12
      },
      {
        type: 'file',
        varName: 'print_image_file_name',
        displayName: '도안',
        xs: 12
      },
      {
        varName: 'print_front_color_count',
        displayName: '전면도수',
        xs: 4,
        sm: 2
      },
      { varName: 'print_front_color', displayName: '전면색상', xs: 8, sm: 4 },
      {
        varName: 'print_front_position',
        displayName: '전면인쇄위치',
        xs: 12,
        sm: 6
      },
      {
        varName: 'print_back_color_count',
        displayName: '후면도수',
        xs: 4,
        sm: 2
      },
      { varName: 'print_back_color', displayName: '후면색상', xs: 8, sm: 4 },
      {
        varName: 'print_back_position',
        displayName: '후면인쇄위치',
        xs: 12,
        sm: 6
      },
      {
        varName: 'print_memo',
        displayName: '인쇄메모',
        xs: 12,
        multiline: true
      }
    ]
  },
  {
    title: '가공',
    fields: [
      {
        varName: 'cut_position',
        displayName: '가공위치',
        xs: 12,
        sm: 7,
        lg: 6
      },
      {
        type: 'checkbox',
        varName: 'cut_ultrasonic',
        displayName: '초음파가공',
        xs: 6,
        sm: 3,
        lg: 2
      },
      {
        type: 'checkbox',
        varName: 'cut_powder_pack',
        displayName: '가루포장',
        xs: 6,
        sm: 2,
        lg: 2
      },
      {
        type: 'checkbox',
        varName: 'cut_is_punched',
        displayName: '바람구멍',
        xs: 12,
        sm: 2,
        lg: 2
      },
      {
        varName: 'cut_punch_count',
        displayName: '바람구멍개수',
        xs: 4,
        sm: 2,
        lg: 2
      },
      {
        varName: 'cut_punch_size',
        displayName: '바람구멍크기',
        xs: 8,
        sm: 3,
        lg: 2
      },
      {
        varName: 'cut_punch_position',
        displayName: '바람구멍위치',
        xs: 12,
        sm: 5,
        lg: 3
      },
      {
        varName: 'cut_memo',
        displayName: '가공메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  },
  {
    title: '포장',
    fields: [
      {
        varName: 'pack_material',
        displayName: '포장방법',
        xs: 5,
        sm: 6,
        lg: 3
      },
      { varName: 'pack_unit', displayName: '포장단위', xs: 3, sm: 4, lg: 2 },
      {
        type: 'checkbox',
        varName: 'pack_deliver_all',
        displayName: '전량납',
        xs: 4,
        sm: 2,
        lg: 2
      },
      {
        varName: 'pack_memo',
        displayName: '포장메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  },
  {
    title: '참고사항',
    fields: [
      { varName: 'unit_price', displayName: '단가', xs: 12, lg: 7 },
      {
        varName: 'product_memo',
        displayName: '메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  }
];

export const PRODUCT_FORM_REQUIRED = [
  {
    varName: 'account_name',
    displayName: '업체명',
    error: '업체명을 선택하세요.'
  },
  { varName: 'product_name', displayName: '품명', error: '품명을 입력하세요.' },
  {
    varName: 'product_thick',
    displayName: '두께',
    error: '두께를 입력하세요.'
  },
  {
    varName: 'product_length',
    displayName: '길이(압출)',
    error: '길이(압출)를 입력하세요.'
  },
  {
    varName: 'product_width',
    displayName: '너비(가공)',
    error: '너비(가공)를 입력하세요.'
  },
  {
    varName: 'ext_color',
    displayName: '원단색상',
    error: '원단색상을 입력하세요.'
  }
];

export const PRODUCT_DETAIL_SECTIONS = [
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
  },
  {
    title: '작업이력',
    fields: [
      { varName: 'old_history', displayName: '작업내역' },
      { varName: 'history', displayName: '작업내역' }
    ]
  }
];
