import QRCode, { QRCodeToDataURLOptions } from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
    try {
        // Sử dụng Interface QRCodeToDataURLOptions để đảm bảo đúng kiểu dữ liệu
        const qrOption: QRCodeToDataURLOptions = {
            errorCorrectionLevel: 'H', // Mức độ sửa lỗi cao
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
            type: 'image/png'
        };

        const base64Image = await QRCode.toDataURL(data, qrOption);
        return base64Image;
    } catch (err) {
        console.error('Lỗi tạo QR Code:', err);
        return '';
    }
};