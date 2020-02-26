import { InjectionToken } from '@angular/core';

export interface IAppConfig {
	fieldPattern: RegExp;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('app.config');
