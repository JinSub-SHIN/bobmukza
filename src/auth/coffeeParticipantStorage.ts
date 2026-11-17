export type CoffeePresetSlot = 1 | 2 | 3

const PRESETS_KEY = 'bobmukzaCoffeePresets'

type PresetStore = Partial<Record<CoffeePresetSlot, string[]>>

const normalizeNames = (raw: unknown): string[] => {
	if (!Array.isArray(raw)) {
		return []
	}
	const seen = new Set<string>()
	const out: string[] = []
	for (const item of raw) {
		if (typeof item !== 'string') {
			continue
		}
		const name = item.trim()
		if (!name || name.length > 20 || seen.has(name)) {
			continue
		}
		seen.add(name)
		out.push(name)
	}
	return out
}

const readPresets = (): PresetStore => {
	try {
		const raw = localStorage.getItem(PRESETS_KEY)
		if (!raw) {
			return {}
		}
		const parsed = JSON.parse(raw) as PresetStore
		const out: PresetStore = {}
		for (const slot of [1, 2, 3] as const) {
			const names = normalizeNames(parsed[slot])
			if (names.length > 0) {
				out[slot] = names
			}
		}
		return out
	} catch {
		return {}
	}
}

const writePresets = (store: PresetStore) => {
	localStorage.setItem(PRESETS_KEY, JSON.stringify(store))
}

export const loadCoffeePreset = (slot: CoffeePresetSlot): string[] | null => {
	const store = readPresets()
	const names = store[slot]
	return names && names.length > 0 ? [...names] : null
}

export const saveCoffeePreset = (
	slot: CoffeePresetSlot,
	names: string[],
): string[] => {
	const normalized = normalizeNames(names)
	const store = readPresets()
	if (normalized.length === 0) {
		delete store[slot]
	} else {
		store[slot] = normalized
	}
	writePresets(store)
	return normalized
}

export const getCoffeePresetCounts = (): Record<CoffeePresetSlot, number> => ({
	1: loadCoffeePreset(1)?.length ?? 0,
	2: loadCoffeePreset(2)?.length ?? 0,
	3: loadCoffeePreset(3)?.length ?? 0,
})

export const clearCoffeePreset = (slot: CoffeePresetSlot): boolean => {
	const store = readPresets()
	if (!store[slot]?.length) {
		return false
	}
	delete store[slot]
	writePresets(store)
	return true
}

export const clearAllCoffeePresets = (): boolean => {
	const store = readPresets()
	if (Object.keys(store).length === 0) {
		return false
	}
	localStorage.removeItem(PRESETS_KEY)
	return true
}