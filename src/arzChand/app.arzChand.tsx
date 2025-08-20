import type { ArzChandSettingStore } from 'electron/store'
import { useEffect, useState } from 'react'
import { MdOutlineDragIndicator } from 'react-icons/md'
import { widgetKey } from '../../shared/widgetKey'
import { useAnalytics } from '../hooks/useAnalytics'
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
	useAnalytics('arz-chand')

	return (
		<div className="w-screen h-screen overflow-hidden ">
			<div className="flex flex-col items-center p-2 h-[calc(100vh-2rem)] w-full">
				{setting.template === 'default' || !setting.template ? (
					<CurrenciesDefault currencies={setting.currencies} />
				) : (
					<CurrenciesClassic currencies={setting.currencies} />
				)}
			</div>
			<div className="flex justify-end px-1 cursor-pointer moveable text-content">
				<MdOutlineDragIndicator size={14} />
			</div>
		</div>
	)
}

export default App
//bg-gray-400/50
