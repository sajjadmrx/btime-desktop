import type React from 'react'

interface TextInputProps {
	id?: string
	type?: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	direction?: 'rtl' | 'ltr'
}

export const TextInput: React.FC<TextInputProps> = ({
	id,
	type = 'text',
	value,
	onChange,
	placeholder,
	disabled = false,
	direction = 'rtl',
}) => {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			disabled={disabled}
			dir={direction}
			className={`
        w-full px-4 py-2.5 rounded-lg
        bg-gray-100 dark:bg-gray-700
        text-gray-800 dark:text-white
        border border-transparent
        focus:border-blue-500 dark:focus:border-blue-400
        focus:ring-2 focus:ring-blue-500/20
        focus:outline-none
        transition duration-200
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
		/>
	)
}
