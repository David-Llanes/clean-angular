import { HttpContextToken } from '@angular/common/http';

export const NO_INTERCEPT = new HttpContextToken<boolean>(() => false);

export const WITH_MEDICAL_UNIT_ID = new HttpContextToken<boolean>(() => false);
