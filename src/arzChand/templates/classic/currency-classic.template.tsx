import { useEffect, useState } from 'react'
import type { CurrencyData } from '../../../api/api'
import { extractMainColorFromImage } from '../../../utils/colorUtils'

interface Prop {
	currency: (CurrencyData & { code }) | null
	isTransparent: boolean
}
export function CurrencyClassicComponent({ currency, isTransparent }: Prop) {
	return (
		<div className="flex flex-row items-center  justify-around  w-full flex-wrap font-[balooTamma]">
			<div className="flex-1 flex flex-row gap-1 w-52 justify items-end truncate ">
				<div className="text-[.9rem] flex flex-col text-gray-600 text-gray-trasnparent  dark:text-[#eee] truncate">
					<div className="flex-1 flex flex-row w-52 items-center justify-end mt-1 p-2 rounded-full truncate ">
						<div className="flex-1 w-40">
							{currency ? (
								<div className="flex flex-col">
									<p className="lg:text-[1.2rem] sm:text-sm md:text-[.9rem]  text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]">
										{currency.todyPrice.toLocaleString()}
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
			<div className="flex-2 flex flex-col justify items-end truncate">
				{currency ? (
					<>
						<div className=" flex justify-center">
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
									<div className="animate-pulse bg-gray-200 w-5 h-5 rounded-full object-cover"></div>
								)}
							</div>
						</div>
						<p className="xs:text-xs sm:text-sm lg:text-[1rem] text-gray-600 text-gray-trasnparent dark:text-[#d3d3d3]">
							{currency.code}
						</p>
					</>
				) : (
					<>
						<p className="mr-3 items-center truncate w-5 h-3 animate-pulse bg-gray-200/70  rounded-full"></p>
						<p className="mr-3 items-center truncate w-3 h-2 mt-1 animate-pulse bg-gray-200/70  rounded-full"></p>
					</>
				)}
			</div>
		</div>
	)
}
