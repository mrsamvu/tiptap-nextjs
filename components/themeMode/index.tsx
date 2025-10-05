'use client'
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() =>
                setTheme(theme === 'light' ? 'dark' : 'light')
            }
            className="text-sm"
        >
            {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
    )
}
