// import crypto from "crypto";
// import { VNPayConfig } from "../config/vnpay.config";

// export const buildVNPayParams = (data: { amount: number; txnRef: string; ipAddr: string }) => {
//     const date = new Date();
//     const createDate = formatVnpayDate(date);

//     let vnp_Params: any = {
//         vnp_Version: '2.1.0',
//         vnp_Command: 'pay',
//         vnp_TmnCode: VNPayConfig.vnp_TmnCode,
//         vnp_Locale: 'vn',
//         vnp_CurrCode: 'VND',
//         vnp_TxnRef: data.txnRef,
//         vnp_OrderInfo: `Thanh toan don hang ${data.txnRef}`,
//         vnp_OrderType: 'other',
//         vnp_Amount: data.amount * 100, // VNPAY nhân 100
//         vnp_ReturnUrl: VNPayConfig.vnp_ReturnUrl,
//         vnp_IpAddr: data.ipAddr,
//         vnp_CreateDate: createDate,
//     };

//     vnp_Params = sortObject(vnp_Params);
//     const signData = new URLSearchParams(vnp_Params).toString();
//     const hmac = crypto.createHmac("sha512", VNPayConfig.vnp_HashSecret);
//     const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
//     vnp_Params['vnp_SecureHash'] = signed;
//     return new URLSearchParams(vnp_Params).toString();
// };

// export const verifyVNPaySignature = (vnpParams: any) => {
//     const secureHash = vnpParams['vnp_SecureHash'];
//     delete vnpParams['vnp_SecureHash'];
//     delete vnpParams['vnp_SecureHashType'];

//     const sortedParams = sortObject(vnpParams);
//     const signData = new URLSearchParams(sortedParams).toString();
//     const hmac = crypto.createHmac("sha512", VNPayConfig.vnp_HashSecret);
//     const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

//     return secureHash === signed;
// };

// // Helper function để sort key object
// function sortObject(obj: any) {
//     let sorted: any = {};
//     let str = [];
//     let key;
//     for (key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             str.push(encodeURIComponent(key));
//         }
//     }
//     str.sort();
//     for (key = 0; key < str.length; key++) {
//         sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//     }
//     return sorted;
// }

// function formatVnpayDate(date: Date) {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     const h = String(date.getHours()).padStart(2, '0');
//     const mi = String(date.getMinutes()).padStart(2, '0');
//     const s = String(date.getSeconds()).padStart(2, '0');
//     return `${y}${m}${d}${h}${mi}${s}`;
// }