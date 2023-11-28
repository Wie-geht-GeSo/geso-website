import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const gesoTheme: CustomThemeConfig = {
    name: 'geso',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #ffa70f 
		"--color-primary-50": "255 242 219", // #fff2db
		"--color-primary-100": "255 237 207", // #ffedcf
		"--color-primary-200": "255 233 195", // #ffe9c3
		"--color-primary-300": "255 220 159", // #ffdc9f
		"--color-primary-400": "255 193 87", // #ffc157
		"--color-primary-500": "255 167 15", // #ffa70f
		"--color-primary-600": "230 150 14", // #e6960e
		"--color-primary-700": "191 125 11", // #bf7d0b
		"--color-primary-800": "153 100 9", // #996409
		"--color-primary-900": "125 82 7", // #7d5207
		// secondary | #2278c3 
		"--color-secondary-50": "222 235 246", // #deebf6
		"--color-secondary-100": "211 228 243", // #d3e4f3
		"--color-secondary-200": "200 221 240", // #c8ddf0
		"--color-secondary-300": "167 201 231", // #a7c9e7
		"--color-secondary-400": "100 161 213", // #64a1d5
		"--color-secondary-500": "34 120 195", // #2278c3
		"--color-secondary-600": "31 108 176", // #1f6cb0
		"--color-secondary-700": "26 90 146", // #1a5a92
		"--color-secondary-800": "20 72 117", // #144875
		"--color-secondary-900": "17 59 96", // #113b60
		// tertiary | #0EA5E9 
		"--color-tertiary-50": "219 242 252", // #dbf2fc
		"--color-tertiary-100": "207 237 251", // #cfedfb
		"--color-tertiary-200": "195 233 250", // #c3e9fa
		"--color-tertiary-300": "159 219 246", // #9fdbf6
		"--color-tertiary-400": "86 192 240", // #56c0f0
		"--color-tertiary-500": "14 165 233", // #0EA5E9
		"--color-tertiary-600": "13 149 210", // #0d95d2
		"--color-tertiary-700": "11 124 175", // #0b7caf
		"--color-tertiary-800": "8 99 140", // #08638c
		"--color-tertiary-900": "7 81 114", // #075172
		// success | #84cc16 
		"--color-success-50": "237 247 220", // #edf7dc
		"--color-success-100": "230 245 208", // #e6f5d0
		"--color-success-200": "224 242 197", // #e0f2c5
		"--color-success-300": "206 235 162", // #ceeba2
		"--color-success-400": "169 219 92", // #a9db5c
		"--color-success-500": "132 204 22", // #84cc16
		"--color-success-600": "119 184 20", // #77b814
		"--color-success-700": "99 153 17", // #639911
		"--color-success-800": "79 122 13", // #4f7a0d
		"--color-success-900": "65 100 11", // #41640b
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #7E2C22 
		"--color-error-50": "236 223 222", // #ecdfde
		"--color-error-100": "229 213 211", // #e5d5d3
		"--color-error-200": "223 202 200", // #dfcac8
		"--color-error-300": "203 171 167", // #cbaba7
		"--color-error-400": "165 107 100", // #a56b64
		"--color-error-500": "126 44 34", // #7E2C22
		"--color-error-600": "113 40 31", // #71281f
		"--color-error-700": "95 33 26", // #5f211a
		"--color-error-800": "76 26 20", // #4c1a14
		"--color-error-900": "62 22 17", // #3e1611
		// surface | #55717c 
		"--color-surface-50": "230 234 235", // #e6eaeb
		"--color-surface-100": "221 227 229", // #dde3e5
		"--color-surface-200": "213 220 222", // #d5dcde
		"--color-surface-300": "187 198 203", // #bbc6cb
		"--color-surface-400": "136 156 163", // #889ca3
		"--color-surface-500": "85 113 124", // #55717c
		"--color-surface-600": "77 102 112", // #4d6670
		"--color-surface-700": "64 85 93", // #40555d
		"--color-surface-800": "51 68 74", // #33444a
		"--color-surface-900": "42 55 61", // #2a373d
		
	}
}