import type { ArzChandSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { MdOutlineDragIndicator } from 'react-icons/md'
import { widgetKey } from '../../shared/widgetKey'
import { useThemeMode } from '../hooks/useTheme'
import { CurrenciesClassic } from './templates/classic'
import { CurrenciesDefault } from './templates/default'

function App() {
	const [setting, setSetting] = useState<ArzChandSettingStore>(
		window.store.get(widgetKey.ArzChand),
	)

	useEffect(() => {
		window.ipcRenderer.on('updated-setting', () => {
			const arzChandSetting = window.store.get(widgetKey.ArzChand)
			setSetting(arzChandSetting)
		})
	}, [])

	useThemeMode()

	return (
		<div className="w-screen h-screen overflow-hidden moveable">
			<div className="h-full">
				<div className="flex flex-col items-center h-full p-2">
					{setting.template === 'default' || !setting.template ? (
						<CurrenciesDefault currencies={setting.currencies} />
					) : (
						<CurrenciesClassic currencies={setting.currencies} />
					)}
				</div>
			</div>
		</div>
	)
}

export default App
//bg-gray-400/50
