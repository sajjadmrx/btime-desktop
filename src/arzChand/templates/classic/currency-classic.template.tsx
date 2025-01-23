import type { CurrencyData } from '../../../api/api'
import { convertPriceToMillions } from '../../../utils/formatPrice'

interface Prop {
	currency: (CurrencyData & { code }) | null
	isTransparent: boolean
	isBackgroundActive: boolean
}
export function CurrencyClassicComponent({
	currency,
	isTransparent,
	isBackgroundActive,
}: Prop) {
	let textColor = 'text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]'
	if (isTransparent || !isBackgroundActive) {
		textColor = 'text-gray-400'
	}

	return (
		<div className="flex flex-row items-center  justify-around  w-full flex-wrap font-[balooTamma]">
			<div className="flex flex-row items-end flex-1 gap-1 truncate w-52 justify ">
				<div className="text-[.9rem] flex flex-col text-gray-600 text-gray-trasnparent  dark:text-[#eee] truncate">
					<div className="flex flex-row items-center justify-end flex-1 p-2 mt-1 truncate rounded-full w-52 ">
						<div className="flex-1 w-40">
							{currency ? (
								<div className="flex flex-col">
									<p
										className={`lg:text-[1.2rem] sm:text-sm md:text-[.9rem]  ${textColor}`}
									>
										{convertPriceToMillions(
											currency.rialPrice.toString(),
											'en',
										)}
									</p>
								</div>
							) : (
								<div className="flex flex-col">
									<div className="h-2 mr-3 animate-pulse items-center  bg-gray-200/70  rounded-full w-5 mb-2.5"></div>
									<div className="h-3 mr-3 animate-pulse items-center  bg-gray-200/70  rounded-full w-14 mb-2.5"></div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-end truncate flex-2 justify">
				{currency ? (
					<>
						<div className="flex justify-center ">
							<div
								className={
									'w-5 h-5 relative flex rounded-full justify-end items-end'
								}
							>
								{currency ? (
									<>
										<img
											src={currency.icon}
											className={`object-cover rounded-full w-4 h-4 ${isTransparent && 'contrast-50'}`}
										/>
									</>
								) : (
									<div className="object-cover w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
								)}
							</div>
						</div>
						<p className={`xs:text-xs sm:text-sm lg:text-[1rem] ${textColor}`}>
							{currency.code?.toUpperCase()}
						</p>
					</>
				) : (
					<>
						<p className="items-center w-5 h-3 mr-3 truncate rounded-full animate-pulse bg-gray-200/70"></p>
						<p className="items-center w-3 h-2 mt-1 mr-3 truncate rounded-full animate-pulse bg-gray-200/70"></p>
					</>
				)}
			</div>
		</div>
	)
}
