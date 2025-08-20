import { widgetKey } from '../../shared/widgetKey'

export const WidgetConfigs: Partial<
	Record<
		widgetKey,
		{
			minWidth: number
			minHeight: number
			maxWidth?: number
			maxHeight?: number
			[str: string]: any
		}
	>
> = {
	[widgetKey.BTime]: {
		minWidth: 426,
		minHeight: 290,
		maxHeight: 266,
		maxWidth: 510,
		off_calendar_MinHeight: 190,
		off_calendar_MinWidth: 200,
	},
	[widgetKey.Clock]: {
		minWidth: 140,
		minHeight: 170,
	},
	[widgetKey.ArzChand]: {
		minHeight: 110,
		minWidth: 110,
		maxWidth: 410,
		maxHeight: 319,
	},
	[widgetKey.Weather]: {
		minHeight: 203,
		minWidth: 183,
	},
	[widgetKey.DamDasti]: {
		minWidth: 150,
		minHeight: 76,
	},
	[widgetKey.SubShomaar]: {
		minWidth: 150,
		minHeight: 76,
	},
}
