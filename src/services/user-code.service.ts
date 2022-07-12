import moment from 'moment';
import { User, UserDoc, ConfirmCodeTypes } from '../models/user.model';
import { generateRandomString } from '../utils';

const INDEX_OF_NOT_FOUND_VALUE = -1;

export interface CodeData {
  value: string;
  typeOfCode: ConfirmCodeTypes;
  expires_at: Date;
};

export class UserCodeService {

  async generateCode (user: UserDoc, type: ConfirmCodeTypes, expirationDiff = 172800): Promise<CodeData | null> { // 48 hours

    const expiresAt = moment().add(expirationDiff, 'seconds').toDate();
    const value = await this.generateNewConfirmCode(user, type);
    const codeData: CodeData = {
      value: value,
      typeOfCode: type,
      expires_at: expiresAt
    };

    const userWithConfirmCodes = await User.findOne({ _id: user._id }, { confirm_codes: 1 });

    if (userWithConfirmCodes) {
      const codeIndex = userWithConfirmCodes.confirm_codes.findIndex(i => i.typeOfCode === type);

      if (codeIndex === INDEX_OF_NOT_FOUND_VALUE) {
        userWithConfirmCodes.confirm_codes.push(codeData);
      } else {
        userWithConfirmCodes.confirm_codes[codeIndex] = codeData;
      }

      await userWithConfirmCodes.save();

      return codeData;
    }

    return null;
  };

  async getUserByCode(code: string, type: ConfirmCodeTypes): Promise<any> {
    const condition = {
      confirm_codes: {
        $elemMatch: {
          typeOfCode: type,
          value: code
        }
      }
    };

    return User.findOne(condition);
  }

  isExpiredCode (user: UserDoc, type: ConfirmCodeTypes) {
    if (!user.confirm_codes) {
      return false;
    }

    const code = user.confirm_codes.find(i => i.typeOfCode === type);

    if (!code) {
      return false;
    }

    const expirationDate = moment(code.expires_at).utc();
    const now = moment().utc();

    return now > expirationDate;
  };

  async removeCode (user: UserDoc, type: ConfirmCodeTypes): Promise<boolean> {
    await User.findByIdAndUpdate(user._id, { $pull: { confirm_codes: { typeOfCode: type } } });

    return true;
  };

  async generateNewConfirmCode(user: UserDoc, type: ConfirmCodeTypes): Promise<string> {
    let exists = true;

    do {
      const code = generateRandomString(20) + user._id;
      exists = await this.getUserByCode(code, type);

      if (!exists) return code;

    } while (exists);

    return '';
  }
}
