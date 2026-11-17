export type CoffeeMemberPreset = {
	id: string
	label: string
	members: string[]
	createdAt: number
}

const PRESETS_KEY = 'bobmukzaCoffeePresets'
const MAX_PRESETS = 30
const MAX_LABEL_LEN = 24

type LegacySlotStore = Partial<Record<1 | 2 | 3, string[]>>

const normalizeMembers = (raw: unknown): string[] => {
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

const normalizeLabel = (raw: unknown): string => {
	if (typeof raw !== 'string') {
		return ''
	}
	return raw.trim().slice(0, MAX_LABEL_LEN)
}

const newPresetId = (): string => {
	const cryptoApi = globalThis.crypto
	if (cryptoApi?.randomUUID) {
		return cryptoApi.randomUUID()
	}
	return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const normalizePreset = (raw: unknown): CoffeeMemberPreset | null => {
	if (!raw || typeof raw !== 'object') {
		return null
	}
	const o = raw as Record<string, unknown>
	const id = typeof o.id === 'string' ? o.id.trim() : ''
	const label = normalizeLabel(o.label)
	const members = normalizeMembers(o.members)
	const createdAt =
		typeof o.createdAt === 'number' && Number.isFinite(o.createdAt)
			? o.createdAt
			: 0
	if (!id || !label || members.length === 0) {
		return null
	}
	return { id, label, members, createdAt }
}

const migrateLegacySlots = (parsed: unknown): CoffeeMemberPreset[] => {
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return []
	}
	const legacy = parsed as LegacySlotStore
	const migrated: CoffeeMemberPreset[] = []
	for (const slot of [1, 2, 3] as const) {
		const members = normalizeMembers(legacy[slot])
		if (members.length === 0) {
			continue
		}
		migrated.push({
			id: `legacy-slot-${slot}`,
			label: `프리셋 ${slot}`,
			members,
			createdAt: slot,
		})
	}
	return migrated
}

const readPresetsRaw = (): CoffeeMemberPreset[] => {
	try {
		const raw = localStorage.getItem(PRESETS_KEY)
		if (!raw) {
			return []
		}
		const parsed: unknown = JSON.parse(raw)

		if (Array.isArray(parsed)) {
			const list = parsed
				.map(normalizePreset)
				.filter((p): p is CoffeeMemberPreset => p !== null)
			return list
		}

		const migrated = migrateLegacySlots(parsed)
		if (migrated.length > 0) {
			writePresets(migrated)
			return migrated
		}
		return []
	} catch {
		return []
	}
}

const writePresets = (presets: CoffeeMemberPreset[]) => {
	localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}

export const listCoffeePresets = (): CoffeeMemberPreset[] => {
	return readPresetsRaw().sort((a, b) => a.createdAt - b.createdAt)
}

export type CreateCoffeePresetResult =
	| { ok: true; preset: CoffeeMemberPreset }
	| { ok: false; message: string }

export const createCoffeePreset = (
	labelInput: string,
	members: string[],
): CreateCoffeePresetResult => {
	const label = normalizeLabel(labelInput)
	if (!label) {
		return { ok: false, message: '프리셋명을 입력해 주세요.' }
	}
	const normalizedMembers = normalizeMembers(members)
	if (normalizedMembers.length === 0) {
		return { ok: false, message: '저장할 참여자가 없어요.' }
	}

	const presets = readPresetsRaw()
	if (presets.length >= MAX_PRESETS) {
		return {
			ok: false,
			message: `프리셋은 최대 ${MAX_PRESETS}개까지 저장할 수 있어요.`,
		}
	}

	const preset: CoffeeMemberPreset = {
		id: newPresetId(),
		label,
		members: normalizedMembers,
		createdAt: Date.now(),
	}
	writePresets([...presets, preset])
	return { ok: true, preset }
}

export const deleteCoffeePreset = (id: string): boolean => {
	const presets = readPresetsRaw()
	const next = presets.filter(p => p.id !== id)
	if (next.length === presets.length) {
		return false
	}
	writePresets(next)
	return true
}