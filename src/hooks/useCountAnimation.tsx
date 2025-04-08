import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

export function useCountAnimation(
	targetValue: number,
	duration = 1500,
	isEnabled = true,
) {
	const [count, setCount] = useState(0)

	useEffect(() => {
		if (!isEnabled) {
			setCount(targetValue)
			return
		}

		setCount(targetValue)
	}, [targetValue, isEnabled])

	return count
}

export const CountUpAnimation = ({
	end,
	duration = 1500,
	decimals = 0,
	separator = ',',
	...props
}: {
	end: number
	duration?: number
	decimals?: number
	separator?: string
	[key: string]: any
}) => (
	<CountUp
		end={end}
		duration={duration / 1000}
		decimals={decimals}
		separator={separator}
		{...props}
	/>
)
