import { ISetting } from "./setting.interface";
import SettingModel from "./setting.schema";

export class SettingService {
    private settingModel = SettingModel;

    async getSetting() {
        let setting = await this.settingModel.findOne();
        if (!setting) {
            // Nếu chưa có, trả về object rỗng để FE không bị lỗi
            return {};
        }
        return setting;
    }

    async updateSetting(data: Partial<ISetting>, userId: string) {
        // Upsert: true giúp tự động tạo nếu chưa có bản ghi nào
        const setting = await this.settingModel.findOneAndUpdate(
            {}, 
            { ...data, updatedBy: userId },
            { new: true, upsert: true, runValidators: true }
        );
        return setting;
    }
}