import pdfMake from 'pdfmake/build/pdfmake.min.js';
import vfsFonts from 'pdfmake/build/vfs_fonts.js';
import moment from 'moment';
import { comma } from './comma';

export const printOrders = (selectedOrders) => {
	let docContent = [];
	let filename = '작업지시';
	let ordersCount = 0;
	selectedOrders.forEach((order) => {
		filename += `_${order.id}`;

		getTextForDocContent(order).then((response) => {
			docContent.push(getDocContent(response));
			ordersCount++;

			// when last order added to docContent
			if (selectedOrders.length === ordersCount) {
				// sort docContent by orderID
				docContent.sort((a, b) => {
					const a_orderID = a[0].table.body[0][0].text;
					const b_orderID = b[0].table.body[0][0].text;
					if (a_orderID > b_orderID) return 1;
					if (a_orderID < b_orderID) return -1;
					return 0;
				});

				// add pagebreak between each order except the last one
				for (let i = 0; i < selectedOrders.length - 1; i++) {
					docContent[i + 1][0].pageBreak = 'before';
				}

				// generate PDF and open
				const docDefinition = getDocDefinition(filename, docContent);
				openPDF(docDefinition);
			}
		});
	});
};

const openPDF = (docDefinition) => {
	/*==========================================================
  to use custom fonts, follow the steps below
  1. create folder: pdfmake/examples/fonts
  2. copy fonts in the folder
  3. go to root directory of 'pdfmake' package
  4. run 'npm install'
  5. run 'gulp buildFonts'
  ==========================================================*/

	pdfMake.vfs = vfsFonts.pdfMake.vfs;

	pdfMake.fonts = {
		NanumGothic: {
			normal: 'NanumGothic.ttf',
			bold: 'NanumGothicBold.ttf',
			italics: 'NanumGothic.ttf',
			bolditalics: 'NanumGothicExtraBold.ttf'
		}
	};

	pdfMake.createPdf(docDefinition).open();
};

const getTextForDocContent = async ({
	id,
	ordered_at,
	product_thick,
	product_length,
	product_width,
	order_quantity,
	order_quantity_weight,
	product_name,
	account_name,
	deliver_by,
	is_delivery_strict,
	is_urgent,
	ext_color,
	ext_pretreat,
	ext_antistatic,
	ext_memo,
	print_front_color_count,
	print_front_color,
	print_front_position,
	print_back_color_count,
	print_back_color,
	print_back_position,
	print_memo,
	cut_position,
	cut_ultrasonic,
	cut_powder_pack,
	cut_is_punched,
	cut_punch_count,
	cut_punch_size,
	cut_punch_position,
	cut_memo,
	pack_material,
	pack_unit,
	pack_deliver_all,
	pack_memo,
	plate_status,
	order_memo_work,
	order_memo_delivery,
	print_image_url
}) => {
	const orderIDText = id.split('-').pop();
	const orderedAtText = `발주일: ${moment(ordered_at).format('YYYY-MM-DD')}`;
	const sizeText = `${product_thick} x ${product_length} x ${product_width}`;
	const orderQuantityText = `${comma(order_quantity)} 매`;
	const orderQuantityWeightText = `(${comma(order_quantity_weight.toFixed(0))}kg)`;
	const productName = product_name;
	const accountName = account_name;
	let deliverBeforeArray = moment(deliver_by).format('YYYY-MM-DD').split('-');
	deliverBeforeArray.shift();
	const deliverBeforeText = deliverBeforeArray.join('/');

	let deliverRemarkText = '';
	if (is_delivery_strict) {
		if (is_urgent) {
			deliverRemarkText = '납기엄수/지급';
		} else {
			deliverRemarkText = '납기엄수';
		}
	} else if (is_urgent) {
		deliverRemarkText = '지급';
	}

	let extDetailsText = `${ext_color}원단`;
	if (ext_pretreat) extDetailsText += `\n${ext_pretreat}처리`;
	if (ext_antistatic) extDetailsText += '\n대전방지';
	if (ext_memo) extDetailsText += '\n' + ext_memo;

	let printFrontText = '';
	if (print_front_color_count) {
		printFrontText = `${print_front_color_count}도`;
		printFrontText += ` (${print_front_color})`;
		if (print_front_position) printFrontText += `\n위치: ${print_front_position}`;
	}

	let printBackText = '';
	if (print_back_color_count) {
		printBackText = `${print_back_color_count}도`;
		printBackText += ` (${print_back_color})`;
		if (print_back_position) printBackText += `\n위치: ${print_back_position}`;
	}

	let printMemoText = '';
	if (print_memo) printMemoText = print_memo;

	let cutDetailsText = '';
	if (cut_position) cutDetailsText += `가공위치: ${cut_position}`;
	if (cut_ultrasonic) cutDetailsText += '\n초음파가공';
	if (cut_powder_pack) cutDetailsText += '\n가루포장';
	if (cut_is_punched) {
		cutDetailsText += `\nP${cut_punch_count}`;
		if (cut_punch_size) cutDetailsText += ` (${cut_punch_size})`;
		if (cut_punch_position) cutDetailsText += `\n위치: ${cut_punch_position}`;
	}
	if (cut_memo) cutDetailsText += '\n' + cut_memo;

	let packDetailsText = '';
	if (pack_material) packDetailsText += `${pack_material} 포장`;
	if (pack_unit) packDetailsText += `\n(${comma(pack_unit)}씩)`;
	if (pack_deliver_all) packDetailsText += '\n전량납품';
	if (pack_memo) packDetailsText += '\n' + pack_memo;

	let plateStatusText = '';
	if (plate_status) plateStatusText = `동판${plate_status}`;

	const workMemo = order_memo_work;
	const deliverMemo = order_memo_delivery;

	let productImage = '';
	if (print_image_url) {
		productImage = await imageToBase64(print_image_url);
	}

	return {
		orderIDText,
		orderedAtText,
		sizeText,
		orderQuantityText,
		orderQuantityWeightText,
		productName,
		accountName,
		deliverBeforeText,
		deliverRemarkText,
		extDetailsText,
		printFrontText,
		printBackText,
		printMemoText,
		cutDetailsText,
		packDetailsText,
		plateStatusText,
		workMemo,
		deliverMemo,
		productImage
	};
};

const imageToBase64 = (imageURL) => {
	return new Promise((resolve, reject) => {
		fetch(imageURL)
			.then((response) => response.arrayBuffer())
			.then((buffer) => {
				let binary = '';
				let bytes = [].slice.call(new Uint8Array(buffer));
				bytes.forEach((byte) => {
					binary += String.fromCharCode(byte);
				});

				const imageString = 'data:image/jpeg;base64,' + window.btoa(binary);
				resolve(imageString);
			})
			.catch((error) => {
				resolve('');
			})
	});
};

const getDocContent = ({
	orderIDText,
	orderedAtText,
	sizeText,
	orderQuantityText,
	orderQuantityWeightText,
	productName,
	accountName,
	deliverBeforeText,
	deliverRemarkText,
	extDetailsText,
	printFrontText,
	printBackText,
	printMemoText,
	cutDetailsText,
	packDetailsText,
	plateStatusText,
	workMemo,
	deliverMemo,
	productImage
}) => {
	let docContent = [
		{
			layout: 'noBorders',
			table: {
				widths: [ '23%', '*', '23%' ],
				body: [
					[
						{ rowSpan: 2, text: orderIDText, style: 'orderNo' },
						{ text: '작업지시서', style: 'title' },
						{
							text: deliverRemarkText,
							style: 'deliverRemark'
						}
					],
					[
						{},
						{
							colSpan: 2,
							text: orderedAtText,
							style: 'orderedAt'
						},
						{}
					]
				]
			}
		},
		{
			style: 'table',
			table: {
				widths: [ '33%', '21%', '34%', '12%' ],
				body: [
					[
						{ rowSpan: 2, text: sizeText, style: 'productSize' },
						{
							text: orderQuantityText,
							style: 'orderQuantity',
							border: [ true, true, true, false ]
						},
						{ text: productName, style: 'productName' },
						{
							rowSpan: 2,
							text: deliverBeforeText,
							style: 'deliverBefore'
						}
					],
					[
						{},
						{
							text: orderQuantityWeightText,
							style: 'orderQuantityWeight',
							border: [ true, false, true, true ]
						},
						{ text: accountName, style: 'accountName' },
						{}
					]
				]
			}
		},
		{
			style: 'table',
			table: {
				widths: [ '14%', '19%', '5%', '9%', '20%', '9%', '24%' ],
				heights: [ 'auto', 60, 60, 50, 20, 20, 20 ],
				body: [
					[
						{ colSpan: 2, text: '압출부', style: 'workOrderHeader' },
						{},
						{ colSpan: 3, text: '인쇄부', style: 'workOrderHeader' },
						{},
						{},
						{ colSpan: 2, text: '가공부', style: 'workOrderHeader' },
						{}
					],
					[
						{
							rowSpan: 4,
							colSpan: 2,
							text: extDetailsText,
							style: 'workOrderBody'
						},
						{},
						{ text: '전\n면', style: 'workOrderHeader', margin: [ 0, 15 ] },
						{
							colSpan: 2,
							text: printFrontText,
							style: 'workOrderBody'
						},
						{},
						{
							rowSpan: 2,
							colSpan: 2,
							text: cutDetailsText,
							style: 'workOrderBody'
						},
						{}
					],
					[
						{},
						{},
						{ text: '후\n면', style: 'workOrderHeader', margin: [ 0, 15 ] },
						{
							colSpan: 2,
							text: printBackText,
							style: 'workOrderBody'
						},
						{},
						{},
						{}
					],
					[
						{},
						{},
						{
							colSpan: 3,
							text: printMemoText,
							style: 'workOrderBody'
						},
						{},
						{},
						{
							rowSpan: 2,
							text: '포장',
							style: 'workOrderHeader',
							margin: [ 0, 30 ]
						},
						{
							rowSpan: 2,
							text: packDetailsText,
							style: 'workOrderBody'
						}
					],
					[
						{},
						{},
						{
							colSpan: 2,
							text: plateStatusText,
							style: 'workOrderBody'
						},
						{},
						{
							/* plate location goes here */
						},
						{},
						{}
					],
					[
						{ text: '작업참고', style: 'workOrderHeader' },
						{
							colSpan: 6,
							text: workMemo,
							style: 'workOrderMemo'
						}
					],
					[
						{ text: '납품참고', style: 'workOrderHeader' },
						{
							colSpan: 6,
							text: deliverMemo,
							style: 'workOrderMemo'
						}
					]
				]
			}
		}
	];

	// add product image if exist
	if (productImage) {
		docContent.push({
			image: productImage,
			fit: [ 515, 300 ],
			alignment: 'center'
		});
	}

	return docContent;
};

const getDocDefinition = (filename, docContent) => {
	return {
		info: {
			title: filename
		},
		pageMargins: 25,
		content: docContent,

		defaultStyle: {
			font: 'NanumGothic'
		},

		styles: {
			table: {
				margin: [ 0, 0, 0, 10 ]
			},
			title: {
				fontSize: 24,
				bold: true,
				alignment: 'center'
			},
			orderNo: {
				fontSize: 30,
				bold: true,
				margin: [ 10, 20, 0, 0 ]
			},
			deliverRemark: {
				fontSize: 18,
				bold: true,
				background: '#555',
				color: '#fff',
				alignment: 'right',
				margin: 5
			},
			orderedAt: {
				alignment: 'right',
				margin: 3
			},
			productSize: {
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [ 2, 15 ]
			},
			orderQuantity: {
				fontSize: 16,
				bold: true,
				alignment: 'center',
				margin: [ 5, 5, 5, 0 ]
			},
			productName: {
				fontSize: 12,
				alignment: 'center',
				margin: [ 3, 8 ]
			},
			deliverBefore: {
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [ 3, 15 ]
			},
			orderQuantityWeight: {
				fontSize: 12,
				alignment: 'center',
				margin: [ 5, 0, 5, 5 ]
			},
			accountName: {
				fontSize: 9,
				alignment: 'center',
				margin: 3
			},
			workOrderHeader: {
				fontSize: 12,
				bold: true,
				alignment: 'center',
				margin: 3
			},
			workOrderBody: {
				fontSize: 12,
				alignment: 'center',
				margin: 3
			},
			workOrderRemark: {
				fontSize: 12,
				margin: 3
			}
		}
	};
};
