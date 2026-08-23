import e, { cloneElement as t, createContext as n, createElement as r, isValidElement as i, useCallback as a, useContext as o, useDeferredValue as s, useEffect as c, useId as l, useMemo as u, useReducer as d, useRef as f, useState as p } from "react";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
import { useLocation as _, useNavigate as v } from "react-router-dom";
//#region src/GraphCadUi.jsx
var y = Object.freeze({
	cyan: "#00fbfb",
	blue: "#4bc8ff",
	magenta: "#ff00ff",
	violet: "#b86dff",
	green: "#80ff00",
	amber: "#ff8a00",
	neutral: "#94a3b8"
}), b = (...e) => e.filter(Boolean).join(" "), x = (e) => y[e] || e || y.cyan;
function S({ as: t = "section", tone: n = "cyan", density: r = "regular", visualStrength: i = "standard", scroll: a = !0, className: o, style: s, children: c, ...l }) {
	return e.createElement(t, {
		...l,
		"data-tone": n,
		"data-density": r,
		"data-visual-strength": i,
		className: b("cad-ui-panel", a && "cad-ui-panel--scroll", o),
		style: {
			"--cad-ui-accent": x(n),
			...s
		}
	}, c);
}
function C({ icon: e, eyebrow: t, title: n, description: r, status: i, actions: a, compact: o = !1, className: s, children: c }) {
	return /* @__PURE__ */ g("header", {
		className: b("cad-ui-panel__header", o && "cad-ui-panel__header--compact", s),
		children: [/* @__PURE__ */ g("div", {
			className: "cad-ui-panel__heading",
			children: [e && /* @__PURE__ */ h("span", {
				className: "cad-ui-panel__icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h(e, { size: o ? 12 : 14 })
			}), /* @__PURE__ */ g("div", {
				className: "cad-ui-panel__copy",
				children: [
					t && /* @__PURE__ */ h("p", {
						className: "cad-ui-panel__eyebrow",
						children: t
					}),
					n && /* @__PURE__ */ h("h2", {
						className: "cad-ui-panel__title",
						children: n
					}),
					r && /* @__PURE__ */ h("p", {
						className: "cad-ui-panel__description",
						children: r
					}),
					c
				]
			})]
		}), (i || a) && /* @__PURE__ */ g("div", {
			className: "cad-ui-panel__header-actions",
			children: [i && /* @__PURE__ */ h("span", {
				className: "cad-ui-status",
				children: i
			}), a]
		})]
	});
}
function w({ as: t = "section", icon: n, eyebrow: r, title: i, description: a, actions: o, compact: s = !1, className: c, children: l, ...u }) {
	let d = /* @__PURE__ */ g(m, { children: [!!(n || r || i || a || o) && /* @__PURE__ */ g("header", {
		className: "cad-ui-section__header",
		children: [/* @__PURE__ */ g("div", {
			className: "cad-ui-section__copy",
			children: [
				(n || r) && /* @__PURE__ */ g("p", {
					className: "cad-ui-section__eyebrow",
					children: [n && /* @__PURE__ */ h(n, {
						size: 11,
						"aria-hidden": "true"
					}), r]
				}),
				i && /* @__PURE__ */ h("h3", {
					className: "cad-ui-section__title",
					children: i
				}),
				a && /* @__PURE__ */ h("p", {
					className: "cad-ui-section__description",
					children: a
				})
			]
		}), o && /* @__PURE__ */ h("div", {
			className: "cad-ui-section__actions",
			children: o
		})]
	}), /* @__PURE__ */ h("div", {
		className: "cad-ui-section__body",
		children: l
	})] });
	return e.createElement(t, {
		...u,
		className: b("cad-ui-section", s && "cad-ui-section--compact", c)
	}, d);
}
function T({ items: e, activeId: t, onChange: n, label: r, className: i }) {
	return /* @__PURE__ */ h("div", {
		className: b("cad-ui-segment-tabs", i),
		role: "tablist",
		"aria-label": r,
		children: e.map(({ id: e, label: r, icon: i, disabled: a = !1 }) => /* @__PURE__ */ g("button", {
			type: "button",
			role: "tab",
			"aria-selected": t === e,
			disabled: a,
			onClick: () => n(e),
			children: [i && /* @__PURE__ */ h(i, {
				size: 11,
				"aria-hidden": "true"
			}), /* @__PURE__ */ h("span", { children: r })]
		}, e))
	});
}
function E({ icon: e, tone: t = "inherit", compact: n = !1, className: r, children: i, type: a = "button", ...o }) {
	return /* @__PURE__ */ g("button", {
		...o,
		type: a,
		"data-tone": t,
		className: b("cad-ui-action", n && "cad-ui-action--compact", r),
		children: [e && /* @__PURE__ */ h(e, {
			size: n ? 11 : 13,
			"aria-hidden": "true"
		}), /* @__PURE__ */ h("span", { children: i })]
	});
}
function D({ icon: e, label: t, tone: n = "inherit", className: r, type: i = "button", ...a }) {
	return /* @__PURE__ */ h("button", {
		...a,
		type: i,
		"data-tone": n,
		className: b("cad-ui-icon-action", r),
		"aria-label": t,
		title: t,
		children: e && /* @__PURE__ */ h(e, {
			size: 13,
			"aria-hidden": "true"
		})
	});
}
function O({ as: t = "div", icon: n, title: r, detail: i, meta: a, status: o, actions: s, active: c = !1, tone: l = "inherit", className: u, children: d, ...f }) {
	let p = /* @__PURE__ */ g(m, { children: [
		n && /* @__PURE__ */ h("span", {
			className: "cad-ui-data-row__icon",
			"aria-hidden": "true",
			children: /* @__PURE__ */ h(n, { size: 13 })
		}),
		/* @__PURE__ */ g("span", {
			className: "cad-ui-data-row__copy",
			children: [
				r && /* @__PURE__ */ h("strong", { children: r }),
				i && /* @__PURE__ */ h("small", { children: i }),
				d
			]
		}),
		(a || o || s) && /* @__PURE__ */ g("span", {
			className: "cad-ui-data-row__trailing",
			children: [
				a && /* @__PURE__ */ h("em", { children: a }),
				o && /* @__PURE__ */ h("span", {
					className: "cad-ui-status",
					children: o
				}),
				s
			]
		})
	] }), _ = t === "button" && !f.type ? {
		...f,
		type: "button"
	} : f;
	return e.createElement(t, {
		..._,
		"data-active": c ? "true" : "false",
		"data-tone": l,
		className: b("cad-ui-data-row", u)
	}, p);
}
function k({ items: e, className: t, label: n = "Summary data" }) {
	return /* @__PURE__ */ h("dl", {
		className: b("cad-ui-stat-grid", t),
		"aria-label": n,
		children: e.map((e) => /* @__PURE__ */ g("div", {
			"data-tone": e.tone || "inherit",
			children: [
				/* @__PURE__ */ h("dt", { children: e.label }),
				/* @__PURE__ */ h("dd", { children: e.value }),
				e.detail && /* @__PURE__ */ h("small", { children: e.detail })
			]
		}, e.id || e.label))
	});
}
function A({ className: e, children: t }) {
	return /* @__PURE__ */ h("footer", {
		className: b("cad-ui-panel__footer", e),
		children: t
	});
}
function j({ icon: e, title: t = "NO DATA TO DISPLAY", children: n, className: r }) {
	return /* @__PURE__ */ g("div", {
		className: b("cad-ui-empty-state", r),
		children: [e && /* @__PURE__ */ h(e, {
			size: 16,
			"aria-hidden": "true"
		}), /* @__PURE__ */ g("div", { children: [/* @__PURE__ */ h("strong", { children: t }), n && /* @__PURE__ */ h("p", { children: n })] })]
	});
}
//#endregion
//#region src/CadCuiRuntime.jsx
var M = Object.freeze([]), N = Object.freeze({}), P = n(null), F = 1, I = (e) => String(e ?? "").trim(), L = (e) => [...new Set((Array.isArray(e) ? e : M).map(I).filter(Boolean))], R = (e) => ({
	id: I(e?.id),
	label: I(e?.label) || I(e?.id),
	detail: I(e?.detail),
	color: I(e?.color)
}), ee = (e) => Object.freeze({ ...e && typeof e == "object" ? e : N }), te = (e, t) => !!(e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, t)), z = (e) => e ?? "", B = (e) => Object.freeze({
	surface: I(e?.surface),
	tab: I(e?.tab),
	menu: I(e?.menu),
	group: I(e?.group),
	groupId: I(e?.groupId),
	control: I(e?.control),
	label: I(e?.label),
	detail: I(e?.detail),
	icon: I(e?.icon),
	tone: I(e?.tone),
	badge: z(e?.badge),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), V = (e) => ({
	id: I(e?.id),
	label: I(e?.label) || I(e?.id),
	detail: I(e?.detail || e?.description),
	icon: I(e?.icon),
	tone: I(e?.tone) || "cyan",
	surface: I(e?.surface),
	tab: I(e?.tab),
	menu: I(e?.menu),
	control: I(e?.control),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), ne = (e) => !e || typeof e != "object" || Object.isFrozen(e) ? e : (Object.freeze(e), Object.values(e).forEach(ne), e), re = (e, t) => Array.isArray(e) ? e.includes(t) : !!e?.[t], ie = (e) => e instanceof HTMLElement && !!e.closest("input, textarea, select, [contenteditable=\"true\"]"), ae = (e) => {
	let t = I(e.key).toUpperCase();
	return !t || [
		"CONTROL",
		"ALT",
		"SHIFT",
		"META"
	].includes(t) ? "" : [...[
		e.ctrlKey || e.metaKey ? "CTRL" : "",
		e.altKey ? "ALT" : "",
		e.shiftKey ? "SHIFT" : ""
	].filter(Boolean), t].join("+");
}, oe = (e) => I(e).toUpperCase().replace(/CMD|COMMAND/g, "CTRL").replace(/\s+/g, "");
function se(e = N) {
	let t = (Array.isArray(e.commands) ? e.commands : M).map((e) => ({
		id: I(e?.id),
		label: I(e?.label),
		detail: I(e?.detail || e?.description),
		icon: I(e?.icon),
		tone: I(e?.tone) || "cyan",
		toolId: I(e?.toolId),
		shortcut: I(e?.shortcut),
		requires: L(e?.requires),
		customizable: e?.customizable !== !1,
		alwaysVisible: !!e?.alwaysVisible,
		disabled: !!e?.disabled,
		active: !!e?.active,
		badge: z(e?.badge),
		intent: ee(e?.intent),
		placements: (Array.isArray(e?.placements) ? e.placements : M).map(B)
	})).filter((e) => e.id && e.label), n = new Set(t.map((e) => e.id)), r = (Array.isArray(e.tabs) ? e.tabs : M).map((e) => ({
		id: I(e?.id),
		label: I(e?.label) || I(e?.id),
		color: I(e?.color) || "#00fbfb",
		tone: I(e?.tone) || "cyan"
	})).filter((e) => e.id), i = /* @__PURE__ */ new Set(), a = (Array.isArray(e.groups) ? e.groups : M).map(V).filter((e) => !e.id || i.has(e.id) ? !1 : (i.add(e.id), !0)), o = e.calibration && typeof e.calibration == "object" ? e.calibration : N, s = (Array.isArray(o.accentModes) ? o.accentModes : M).map(R).filter((e) => e.id), c = (Array.isArray(o.densities) ? o.densities : M).map(R).filter((e) => e.id), l = (Array.isArray(o.details) ? o.details : M).map(R).filter((e) => e.id), u = (Array.isArray(e.panels) ? e.panels : M).map((e) => ({
		...e,
		id: I(e?.id),
		title: I(e?.title) || I(e?.id)
	})).filter((e) => e.id), d = e.defaults && typeof e.defaults == "object" ? e.defaults : N, f = {
		version: Number(e.version) || 1,
		activeTab: r.some((e) => e.id === d.activeTab) ? d.activeTab : r[0]?.id || "",
		hiddenCommandIds: L(d.hiddenCommandIds).filter((e) => n.has(e)),
		accentMode: s.some((e) => e.id === d.accentMode) ? d.accentMode : s[0]?.id || "",
		density: c.some((e) => e.id === d.density) ? d.density : c[0]?.id || "",
		detail: l.some((e) => e.id === d.detail) ? d.detail : l[0]?.id || "",
		quickAccessIds: L(d.quickAccessIds).filter((e) => n.has(e)),
		recentCommandIds: M,
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
	return ne({
		id: I(e.id) || "cad-cui",
		version: Number(e.version) || 1,
		storageKey: I(e.storageKey) || "cad-cui-preferences:v1",
		tabs: r,
		groups: a,
		panels: u,
		commands: t,
		calibration: {
			accentModes: s,
			densities: c,
			details: l
		},
		defaultState: f
	});
}
var ce = se({ id: "cad-cui-default" }), le = (e) => new Map(e.commands.map((e) => [e.id, e])), ue = (e, t) => e.some((e) => e.id === t), de = (e, t) => {
	let n = typeof e == "function" ? e(t) : e instanceof Map ? e.get(t?.id) : e?.[t?.id];
	return n && typeof n == "object" ? n : N;
};
function fe(e, { state: t = N, capabilities: n = N, commandStates: r = N, placement: i = e?.placement } = N) {
	if (!e) return null;
	let a = de(r, e), o = new Set(t?.hiddenCommandIds || M), s = Array.isArray(e.requires) ? e.requires : M, c = (e.alwaysVisible || !o.has(e.id)) && s.every((e) => re(n, e)) && a.visible !== !1, l = !!(e.disabled || a.disabled || a.enabled === !1), u = te(a, "active") ? !!a.active : !!e.active, d = te(a, "badge") ? z(a.badge) : te(i, "badge") && i.badge !== "" ? i.badge : e.badge;
	return {
		...e,
		placement: i,
		visible: c,
		disabled: l,
		active: u,
		badge: d
	};
}
var pe = fe, me = (e, t) => ({
	...e,
	label: t.label || e.label,
	detail: t.detail || e.detail,
	icon: t.icon || e.icon,
	tone: t.tone || e.tone,
	placement: t
});
function H(e, t) {
	let n = t && typeof t == "object" ? t : N, r = le(e), i = Array.isArray(n.hiddenToolIds) ? e.commands.filter((e) => n.hiddenToolIds.includes(e.toolId)).map((e) => e.id) : M, a = L(n.hiddenCommandIds || i).filter((e) => r.has(e) && !r.get(e).alwaysVisible);
	return {
		version: e.version,
		activeTab: e.tabs.some((e) => e.id === n.activeTab) ? n.activeTab : e.defaultState.activeTab,
		hiddenCommandIds: a,
		accentMode: ue(e.calibration.accentModes, n.accentMode) ? n.accentMode : e.defaultState.accentMode,
		density: ue(e.calibration.densities, n.density) ? n.density : e.defaultState.density,
		detail: ue(e.calibration.details, n.detail) ? n.detail : e.defaultState.detail,
		quickAccessIds: L(n.quickAccessIds || e.defaultState.quickAccessIds).filter((e) => r.has(e)),
		recentCommandIds: L(n.recentCommandIds).filter((e) => r.has(e)).slice(0, 8),
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
}
function he(e, t = typeof window > "u" ? null : window.localStorage) {
	if (!t) return H(e, e.defaultState);
	try {
		let n = t.getItem(e.storageKey);
		if (!n) return H(e, e.defaultState);
		let r = JSON.parse(n);
		return H(e, r?.preferences || r);
	} catch {
		return H(e, e.defaultState);
	}
}
function ge(e, t, n = typeof window > "u" ? null : window.localStorage) {
	if (!n) return !1;
	try {
		let r = H(e, t);
		return n.setItem(e.storageKey, JSON.stringify({
			version: e.version,
			preferences: {
				activeTab: r.activeTab,
				hiddenCommandIds: r.hiddenCommandIds,
				accentMode: r.accentMode,
				density: r.density,
				detail: r.detail,
				quickAccessIds: r.quickAccessIds
			}
		})), !0;
	} catch {
		return !1;
	}
}
function _e(e, t, { surface: n = "palette", tabId: r = "", menuId: i = "", groupId: a = "", capabilities: o = N, commandStates: s = N } = N) {
	let c = new Set(t?.hiddenCommandIds || M);
	return e.commands.flatMap((e) => {
		if (c.has(e.id) && !e.alwaysVisible || e.requires.some((e) => !re(o, e))) return M;
		let l = n === "palette" ? {
			surface: "palette",
			order: 0
		} : e.placements.find((e) => e.surface === n && (!r || e.tab === r) && (!i || e.menu === i) && (!a || e.groupId === a));
		if (!l) return M;
		let u = fe(me(e, l), {
			state: t,
			capabilities: o,
			commandStates: s,
			placement: l
		});
		return u?.visible ? [u] : M;
	}).sort((e, t) => e.placement.order - t.placement.order || e.label.localeCompare(t.label, "hu"));
}
function ve(e, t, { surface: n = "ribbon", tabId: r = "", menuId: i = "", capabilities: a = N, commandStates: o = N } = N) {
	let s = (Array.isArray(e?.groups) ? e.groups : M).filter((e) => (!e.surface || e.surface === n) && (!r || !e.tab || e.tab === r) && (!i || !e.menu || e.menu === i)).sort((e, t) => e.order - t.order || e.label.localeCompare(t.label, "hu"));
	if (!s.length) return M;
	let c = _e(e, t, {
		surface: n,
		tabId: r,
		menuId: i,
		capabilities: a,
		commandStates: o
	}), l = /* @__PURE__ */ new Set(), u = s.map((e) => {
		let t = c.filter((t) => t.placement.groupId === e.id).map((t) => t.placement.control || !e.control ? t : {
			...t,
			placement: {
				...t.placement,
				control: e.control
			}
		});
		return t.forEach((e) => l.add(e.id)), {
			...e,
			commands: t
		};
	}).filter((e) => e.commands.length), d = c.filter((e) => !l.has(e.id));
	return d.length && u.push({
		id: "__ungrouped__",
		label: "EGYÉB PARANCSOK",
		detail: "",
		icon: "",
		tone: "cyan",
		surface: n,
		tab: r,
		menu: i,
		control: "",
		order: 2 ** 53 - 1,
		commands: d
	}), u;
}
var ye = (e) => (t, n) => {
	switch (n.type) {
		case "tab.select": return H(e, {
			...t,
			activeTab: n.tabId
		});
		case "command.visibility": {
			let r = e.commands.find((e) => e.id === n.commandId);
			if (!r || r.alwaysVisible) return t;
			let i = t.hiddenCommandIds.includes(n.commandId) ? t.hiddenCommandIds.filter((e) => e !== n.commandId) : [...t.hiddenCommandIds, n.commandId];
			return H(e, {
				...t,
				hiddenCommandIds: i
			});
		}
		case "preference.set": return H(e, {
			...t,
			[n.key]: n.value
		});
		case "preferences.reset": return H(e, e.defaultState);
		case "command.completed": return {
			...t,
			recentCommandIds: L([n.commandId, ...t.recentCommandIds]).slice(0, 8),
			commandStatus: {
				phase: "idle",
				id: n.commandId,
				error: ""
			}
		};
		case "command.failed": return {
			...t,
			commandStatus: {
				phase: "error",
				id: n.commandId,
				error: I(n.error) || "COMMAND_FAILED"
			}
		};
		default: return t;
	}
};
function be({ registry: e = ce, capabilities: t = N, commandStates: n = N, handlers: r = N, onCommand: i, children: o }) {
	let s = v(), l = _(), [f, p] = d(ye(e), e, (e) => he(e)), m = u(() => le(e), [e]);
	c(() => {
		ge(e, f);
	}, [e, f]);
	let g = a((e, r) => fe(e, {
		state: f,
		capabilities: t,
		commandStates: n,
		placement: r
	}), [
		t,
		n,
		f
	]), y = a((e) => {
		let t = g(e);
		return !!(t?.visible && !t.disabled);
	}, [g]), b = a((r = N) => _e(e, f, {
		...r,
		capabilities: t,
		commandStates: n
	}), [
		t,
		n,
		e,
		f
	]), x = a((r = N) => ve(e, f, {
		...r,
		capabilities: t,
		commandStates: n
	}), [
		t,
		n,
		e,
		f
	]), S = a(async (e, { source: t = "api", payload: n = N } = N) => {
		let a = m.get(e);
		if (!a) return {
			ok: !1,
			reason: "COMMAND_NOT_FOUND"
		};
		let o = g(a);
		if (!o?.visible || o.disabled) return {
			ok: !1,
			reason: "COMMAND_NOT_AVAILABLE"
		};
		let c = {
			...a.intent,
			...n && typeof n == "object" ? n : N
		}, u = {
			commandId: e,
			command: a,
			resolvedCommand: o,
			intent: c,
			payload: n,
			source: t,
			state: f,
			location: l
		};
		try {
			if (c.type === "route.navigate") s(c.to, c.options);
			else {
				let e = r[c.type];
				if (typeof e != "function") return {
					ok: !1,
					reason: "COMMAND_HANDLER_NOT_FOUND"
				};
				await e({
					...u,
					navigate: s
				});
			}
			return i?.(u), p({
				type: "command.completed",
				commandId: e
			}), {
				ok: !0,
				event: u
			};
		} catch (t) {
			return p({
				type: "command.failed",
				commandId: e,
				error: t instanceof Error ? t.message : String(t)
			}), {
				ok: !1,
				reason: "COMMAND_FAILED",
				error: t
			};
		}
	}, [
		m,
		r,
		l,
		s,
		i,
		g,
		f
	]);
	c(() => {
		if (typeof window > "u") return;
		let t = (t) => {
			if (t.defaultPrevented || ie(t.target)) return;
			let n = ae(t), r = e.commands.find((e) => oe(e.shortcut) === n && y(e));
			r && (t.preventDefault(), S(r.id, { source: "shortcut" }));
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [
		y,
		S,
		e.commands
	]);
	let C = u(() => ({
		registry: e,
		state: f,
		capabilities: t,
		commandStates: n,
		resolveCommand: g,
		selectCommands: b,
		selectCommandGroups: x,
		executeCommand: S,
		setActiveTab: (e) => p({
			type: "tab.select",
			tabId: e
		}),
		setPreference: (e, t) => p({
			type: "preference.set",
			key: e,
			value: t
		}),
		toggleCommandVisibility: (e) => p({
			type: "command.visibility",
			commandId: e
		}),
		resetPreferences: () => p({ type: "preferences.reset" }),
		canExecute: y
	}), [
		y,
		t,
		n,
		S,
		e,
		g,
		b,
		x,
		f
	]);
	return /* @__PURE__ */ h(P.Provider, {
		value: C,
		children: o
	});
}
function U() {
	let e = o(P);
	if (!e) throw Error("useCadCui must be used below CadCuiProvider.");
	return e;
}
function xe(e, t = "api") {
	let { executeCommand: n } = U();
	return a((r) => n(e, {
		source: t,
		payload: r
	}), [
		e,
		n,
		t
	]);
}
var Se = (e, t) => e?.[t] || null;
function Ce({ command: e, iconMap: t, source: n, role: r, badge: i, className: a }) {
	let { executeCommand: o } = U(), s = Se(t, e.icon), c = e.placement?.control || "button", l = [
		"toggle",
		"switch",
		"checkbox",
		"radio"
	].includes(c.toLocaleLowerCase("en")), u = e.badge !== "" && e.badge !== void 0 && e.badge !== null;
	return /* @__PURE__ */ g(E, {
		type: "button",
		role: r,
		icon: s,
		tone: e.tone,
		className: a,
		"data-command-id": e.id,
		"data-command-control": c,
		"data-active": e.active ? "true" : "false",
		"data-badge": u ? String(e.badge) : void 0,
		title: e.detail || e.label,
		"aria-label": u ? `${e.label}, ${e.badge}` : e.label,
		"aria-pressed": l ? e.active : void 0,
		disabled: e.disabled,
		onClick: () => {
			o(e.id, { source: n });
		},
		children: [i ?? e.label, u && /* @__PURE__ */ h("em", {
			"data-cui-command-badge": "true",
			"aria-hidden": "true",
			children: e.badge
		})]
	});
}
function we({ iconMap: e = N, className: t, title: n = "PARANCS SZALAG", description: r = "Deklaratív CUI-regiszterből épített munkatéri parancsok", renderBadge: i, ...a }) {
	let { registry: o, state: s, selectCommands: c, selectCommandGroups: l, setActiveTab: u } = U(), d = o.tabs.find((e) => e.id === s.activeTab) || o.tabs[0], f = c({
		surface: "ribbon",
		tabId: d?.id
	}), p = o.groups?.length ? l({
		surface: "ribbon",
		tabId: d?.id
	}) : M, m = p.length > 0;
	return /* @__PURE__ */ g(S, {
		...a,
		tone: d?.tone || "cyan",
		scroll: !1,
		className: t,
		"data-testid": a["data-testid"] || "cad-cui-ribbon",
		children: [/* @__PURE__ */ h(C, {
			eyebrow: "CUI REGISZTER",
			title: n,
			description: r,
			status: d?.label || "NÉZET"
		}), /* @__PURE__ */ g(w, {
			eyebrow: "MUNKATÉR",
			title: "PARANCSCSOPORT",
			compact: !0,
			children: [/* @__PURE__ */ h(T, {
				label: "CAD szalag fülek",
				activeId: d?.id,
				onChange: u,
				items: o.tabs.map((e) => ({
					id: e.id,
					label: e.label
				}))
			}), m ? /* @__PURE__ */ h("div", {
				className: "cad-cui-command-groups cad-cui-command-grid--ribbon",
				"data-cui-grouped-ribbon": "true",
				children: p.map((t) => /* @__PURE__ */ g("section", {
					className: "cad-cui-command-group",
					"data-command-group-id": t.id,
					"data-command-control": t.control || void 0,
					role: "group",
					"aria-label": t.label,
					children: [/* @__PURE__ */ g("header", { children: [t.label, t.detail && /* @__PURE__ */ h("small", { children: t.detail })] }), /* @__PURE__ */ h("div", {
						className: "cad-cui-command-grid",
						role: "toolbar",
						"aria-label": `${t.label} parancsok`,
						children: t.commands.map((t) => /* @__PURE__ */ h(Ce, {
							command: t,
							iconMap: e,
							source: "ribbon",
							badge: i?.(t) ?? t.label
						}, t.id))
					})]
				}, t.id))
			}) : /* @__PURE__ */ h("div", {
				className: "cad-cui-command-grid cad-cui-command-grid--ribbon",
				role: "toolbar",
				"aria-label": `${d?.label || "CAD"} parancsok`,
				children: f.map((t) => /* @__PURE__ */ h(Ce, {
					command: t,
					iconMap: e,
					source: "ribbon",
					badge: i?.(t) ?? t.label
				}, t.id))
			})]
		})]
	});
}
function Te({ iconMap: e = N, commandIds: t, className: n, ...r }) {
	let { registry: i, state: a, resolveCommand: o } = U(), s = (Array.isArray(t) ? t : a.quickAccessIds).map((e) => i.commands.find((t) => t.id === e)).filter(Boolean).map((e) => {
		let t = e.placements.find((e) => e.surface === "quick-access");
		return o(t ? me(e, t) : e, t);
	}).filter((e) => e?.visible);
	return /* @__PURE__ */ h("div", {
		...r,
		className: ["cad-cui-quick-access", n].filter(Boolean).join(" "),
		"data-testid": r["data-testid"] || "cad-cui-quick-access",
		role: "toolbar",
		"aria-label": "Gyors elérés",
		children: s.map((t) => /* @__PURE__ */ h(Ce, {
			command: t,
			iconMap: e,
			source: "quick-access"
		}, t.id))
	});
}
function Ee({ menuId: e = "canvas", iconMap: t = N, className: n, onClose: r, ...i }) {
	let { selectCommands: a } = U(), o = a({
		surface: "context",
		menuId: e
	});
	return /* @__PURE__ */ g(S, {
		...i,
		as: "aside",
		role: "menu",
		"aria-label": "CUI helyi menü",
		tone: "magenta",
		density: "compact",
		scroll: !1,
		className: n,
		"data-testid": i["data-testid"] || "cad-cui-context-menu",
		children: [/* @__PURE__ */ h(C, {
			eyebrow: "KONTEXTUS",
			title: "GYORSPARANCSOK",
			actions: r && /* @__PURE__ */ h(E, {
				compact: !0,
				onClick: r,
				"aria-label": "Helyi menü bezárása",
				children: "BEZÁR"
			})
		}), /* @__PURE__ */ h(w, {
			compact: !0,
			children: /* @__PURE__ */ g("div", {
				className: "cad-cui-command-grid",
				children: [o.map((e) => /* @__PURE__ */ h(Ce, {
					command: e,
					iconMap: t,
					source: "context",
					role: "menuitem"
				}, e.id)), !o.length && /* @__PURE__ */ h(j, {
					title: "NINCS ELÉRHETŐ PARANCS",
					children: "A jogosultság vagy a profil jelenleg elrejti ezt a menüt."
				})]
			})
		})]
	});
}
function De({ iconMap: e = N, className: t, ...n }) {
	let { selectCommands: r, state: i } = U(), [a, o] = p(""), c = s(a), l = u(() => {
		let e = I(c).toLocaleLowerCase("hu");
		return r({ surface: "palette" }).filter((t) => !e || `${t.label} ${t.detail} ${t.shortcut}`.toLocaleLowerCase("hu").includes(e));
	}, [c, r]);
	return /* @__PURE__ */ g(S, {
		...n,
		tone: "violet",
		className: t,
		"data-testid": n["data-testid"] || "cad-cui-command-palette",
		children: [
			/* @__PURE__ */ h(C, {
				eyebrow: "CUI PARANCSOK",
				title: "PARANCS PALETTA",
				description: "A szalag, a gyorselérés és a helyi menük közös kereshető parancsregisztere.",
				status: `${l.length} TALÁLAT`
			}),
			/* @__PURE__ */ g(w, {
				compact: !0,
				children: [
					/* @__PURE__ */ h("label", {
						className: "cad-cui-sr-only",
						htmlFor: "cad-cui-command-query",
						children: "Parancs keresése"
					}),
					/* @__PURE__ */ h("input", {
						id: "cad-cui-command-query",
						value: a,
						onChange: (e) => o(e.target.value),
						placeholder: "PARANCS KERESÉSE…",
						className: "cad-cui-command-palette__input"
					}),
					/* @__PURE__ */ g("div", {
						className: "cad-cui-command-grid",
						children: [l.map((t) => /* @__PURE__ */ h(Ce, {
							command: t,
							iconMap: e,
							source: "palette"
						}, t.id)), !l.length && /* @__PURE__ */ h(j, {
							title: "NINCS TALÁLAT",
							children: "Próbálj meg másik parancsnevet vagy engedélyezd a rejtett elemet."
						})]
					})
				]
			}),
			/* @__PURE__ */ g(A, { children: ["UTOLSÓ PARANCS: ", i.recentCommandIds[0] || "NINCS"] })
		]
	});
}
function Oe({ className: e, ...t }) {
	let { registry: n, state: r, setPreference: i, toggleCommandVisibility: a, resetPreferences: o } = U(), s = new Set(r.hiddenCommandIds);
	return /* @__PURE__ */ g(S, {
		...t,
		tone: "magenta",
		className: e,
		"data-testid": t["data-testid"] || "cad-cui-customizer",
		children: [
			/* @__PURE__ */ h(C, {
				eyebrow: "MUNKATÉR KALIBRÁLÁSA",
				title: "CUI PROFIL",
				description: "A beállítások csak a személyes munkatéri nézetet módosítják; a parancsok és a jogosultságok központilag definiáltak.",
				actions: /* @__PURE__ */ h(E, {
					compact: !0,
					onClick: o,
					children: "ALAPÉRTELMEZETT"
				})
			}),
			/* @__PURE__ */ h(w, {
				eyebrow: "VIZUÁLIS PROFIL",
				title: "AKCENTUS",
				compact: !0,
				children: /* @__PURE__ */ h(T, {
					label: "Akcentusszín",
					activeId: r.accentMode,
					onChange: (e) => i("accentMode", e),
					items: n.calibration.accentModes.map((e) => ({
						id: e.id,
						label: e.label
					}))
				})
			}),
			/* @__PURE__ */ h(w, {
				eyebrow: "TARTALMI NÉZET",
				title: "INFORMÁCIÓS SŰRŰSÉG",
				compact: !0,
				children: /* @__PURE__ */ g("div", {
					className: "cad-cui-stack cad-cui-stack--regular",
					children: [/* @__PURE__ */ h(T, {
						label: "Tartalmi sűrűség",
						activeId: r.density,
						onChange: (e) => i("density", e),
						items: n.calibration.densities.map((e) => ({
							id: e.id,
							label: e.label
						}))
					}), /* @__PURE__ */ h(T, {
						label: "Információs részletesség",
						activeId: r.detail,
						onChange: (e) => i("detail", e),
						items: n.calibration.details.map((e) => ({
							id: e.id,
							label: e.label
						}))
					})]
				})
			}),
			/* @__PURE__ */ h(w, {
				eyebrow: "PARANCSKIOSZTÁS",
				title: "LÁTHATÓ PARANCSOK",
				compact: !0,
				children: /* @__PURE__ */ h("div", {
					className: "cad-cui-command-grid",
					children: n.commands.filter((e) => e.customizable).map((e) => /* @__PURE__ */ h(O, {
						as: "label",
						title: e.label,
						detail: e.detail,
						active: !s.has(e.id),
						tone: e.tone,
						actions: /* @__PURE__ */ h("input", {
							"aria-label": `${e.label} láthatósága`,
							type: "checkbox",
							checked: !s.has(e.id),
							onChange: () => a(e.id)
						})
					}, e.id))
				})
			})
		]
	});
}
//#endregion
//#region src/cadUiUtils.js
var W = (...e) => e.filter(Boolean).join(" "), G = (e) => Array.isArray(e) ? e : [], K = (e) => String(typeof e == "string" || typeof e == "number" ? e : e?.label ?? e?.name ?? e?.id ?? "");
function q(e, t, n) {
	let [r, i] = p(t), o = e !== void 0, s = o ? e : r;
	return [s, a((e, ...t) => {
		let r = typeof e == "function" ? e(s) : e;
		o || i(r), n?.(r, ...t);
	}, [
		o,
		n,
		s
	])];
}
var J = (e, t, n) => Number.isFinite(e) ? Number.isFinite(t) && e < t ? t : Number.isFinite(n) && e > n ? n : e : e, ke = (e, t, n) => {
	e?.disabled || (e?.onClick?.(e, t), n?.(e, t));
};
function Y({ shortcut: e, className: t }) {
	return e ? /* @__PURE__ */ h("kbd", {
		className: W("cad-shortcut-hint", t),
		children: e
	}) : null;
}
function Ae({ icon: e, label: t, shortcut: n, active: r = !1, toggle: i = !1, tone: a = "inherit", badge: o, compact: s = !1, className: c, children: l, title: u, type: d = "button", ...f }) {
	let p = t || (typeof l == "string" ? l : "CAD tool");
	return /* @__PURE__ */ g("button", {
		...f,
		type: d,
		"data-tone": a,
		"data-active": r ? "true" : "false",
		"aria-pressed": i ? r : void 0,
		"aria-label": f["aria-label"] || p,
		title: u || [p, n].filter(Boolean).join(" · "),
		className: W("cad-tool-button", s && "cad-tool-button--compact", c),
		children: [
			e && /* @__PURE__ */ h("span", {
				className: "cad-tool-button__icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h(e, { size: s ? 13 : 16 })
			}),
			(t || l) && /* @__PURE__ */ h("span", {
				className: "cad-tool-button__label",
				children: l || t
			}),
			o && /* @__PURE__ */ h("span", {
				className: "cad-tool-button__badge",
				children: o
			}),
			n && /* @__PURE__ */ h(Y, { shortcut: n })
		]
	});
}
function je({ active: e = !1, onChange: t, onClick: n, ...r }) {
	return /* @__PURE__ */ h(Ae, {
		...r,
		active: e,
		toggle: !0,
		onClick: (r) => {
			t?.(!e, r), n?.(r);
		}
	});
}
function Me({ icon: e, label: t, shortcut: n, tone: r = "inherit", disabled: i = !1, menu: a, menuId: o, menuOpen: s, defaultMenuOpen: u = !1, onMenuOpenChange: d, onClick: p, className: m, children: _, ...v }) {
	let y = l(), b = o || `cad-split-menu-${y}`, x = f(null), S = f(null), [C, w] = q(s, u, (e, t) => d?.(e, t));
	c(() => {
		if (!C) return;
		let e = window.setTimeout(() => S.current?.querySelector("[role=\"menuitem\"]:not(:disabled), button:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [C]);
	let T = (e) => {
		w(!1, e), window.setTimeout(() => x.current?.focus(), 0);
	};
	return /* @__PURE__ */ g("span", {
		className: W("cad-split-button", m),
		"data-tone": r,
		children: [
			/* @__PURE__ */ g("button", {
				...v,
				type: "button",
				disabled: i,
				className: "cad-split-button__primary",
				onClick: p,
				title: [t, n].filter(Boolean).join(" · "),
				children: [
					e && /* @__PURE__ */ h(e, {
						size: 14,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ h("span", { children: _ || t }),
					n && /* @__PURE__ */ h(Y, { shortcut: n })
				]
			}),
			/* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-split-button__menu-trigger",
				disabled: i,
				"aria-label": `${t || "Action"} options`,
				"aria-haspopup": "menu",
				"aria-expanded": C,
				"aria-controls": C ? b : void 0,
				ref: x,
				onKeyDown: (e) => {
					(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), w(!0, e));
				},
				onClick: (e) => w(!C, e),
				children: "⌄"
			}),
			C && a && /* @__PURE__ */ h("div", {
				id: b,
				ref: S,
				className: "cad-split-button__menu",
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), T(e));
				},
				children: a
			})
		]
	});
}
function Ne({ label: e, items: t = [], onAction: n, className: r, children: i }) {
	return /* @__PURE__ */ g("section", {
		className: W("cad-toolbar-group", r),
		"aria-label": e,
		children: [/* @__PURE__ */ g("div", {
			className: "cad-toolbar-group__tools",
			children: [G(t).map((e, t) => {
				if (e?.type === "separator") return /* @__PURE__ */ h("span", {
					className: "cad-toolbar-group__separator",
					role: "separator",
					"aria-orientation": "vertical"
				}, e.id || `separator-${t}`);
				let r = e.id || `${K(e)}-${t}`, i = {
					icon: e.icon,
					label: K(e),
					shortcut: e.shortcut,
					tone: e.tone,
					disabled: e.disabled,
					active: e.active,
					badge: e.badge,
					title: e.title || e.detail,
					className: e.className
				}, a = (t) => ke(e, t, n);
				return e?.type === "split" ? /* @__PURE__ */ h(Me, {
					...i,
					menu: e.menu,
					menuOpen: e.menuOpen,
					onMenuOpenChange: (t, n) => e.onMenuOpenChange?.(t, e, n),
					onClick: a
				}, r) : e?.toggle ? /* @__PURE__ */ h(je, {
					...i,
					onChange: (t, r) => {
						e.onChange?.(t, e, r), n?.({
							...e,
							active: t
						}, r);
					}
				}, r) : /* @__PURE__ */ h(Ae, {
					...i,
					onClick: a
				}, r);
			}), i]
		}), e && /* @__PURE__ */ h("span", {
			className: "cad-toolbar-group__label",
			children: e
		})]
	});
}
function Pe({ groups: e, items: t, label: n = "CAD tools", orientation: r = "horizontal", onAction: i, className: a, children: o, ...s }) {
	let c = G(e).length ? G(e) : [{
		id: "default",
		items: G(t)
	}];
	return /* @__PURE__ */ g("div", {
		...s,
		className: W("cad-toolbar", `cad-toolbar--${r}`, a),
		role: "toolbar",
		"aria-label": n,
		"aria-orientation": r,
		children: [c.map((e, t) => /* @__PURE__ */ h(Ne, {
			label: e.label,
			items: e.items,
			onAction: i
		}, e.id || e.label || t)), o]
	});
}
function Fe({ groups: e, items: t, label: n = "CAD tool palette", className: r, ...i }) {
	return /* @__PURE__ */ h(Pe, {
		...i,
		groups: e,
		items: t,
		label: n,
		orientation: "vertical",
		className: W("cad-tool-palette", r)
	});
}
function Ie({ id: e, label: t, value: n, defaultValue: r = "", onValueChange: i, onChange: a, min: o, max: s, step: c = 1, unit: u, prefix: d, suffix: f, asNumber: p = !0, disabled: m = !1, readOnly: _ = !1, showSteppers: v = !0, className: y, inputClassName: b, ...x }) {
	let S = l(), C = e || `cad-number-${S}`, [w, T] = q(n, r, (e, t) => {
		i?.(e, t), a?.(e, t);
	}), E = (e, t) => {
		let n = p && e !== "" ? Number(e) : e;
		T(n, t);
	}, D = (e, t) => {
		let n = Number(w), r = Number(c) || 1, i = J((Number.isFinite(n) ? n : 0) + e * r, Number(o), Number(s));
		E(i, t);
	};
	return /* @__PURE__ */ g("div", {
		className: W("cad-numeric-input", m && "cad-numeric-input--disabled", y),
		children: [t && /* @__PURE__ */ h("label", {
			className: "cad-numeric-input__label",
			htmlFor: C,
			children: t
		}), /* @__PURE__ */ g("span", {
			className: "cad-numeric-input__control",
			children: [
				d && /* @__PURE__ */ h("span", {
					className: "cad-numeric-input__adornment",
					children: d
				}),
				/* @__PURE__ */ h("input", {
					...x,
					id: C,
					className: W("cad-numeric-input__field", b),
					type: "number",
					value: w ?? "",
					min: o,
					max: s,
					step: c,
					disabled: m,
					readOnly: _,
					onChange: (e) => E(e.target.value, e)
				}),
				(u || f) && /* @__PURE__ */ h("span", {
					className: "cad-numeric-input__adornment",
					children: f || u
				}),
				v && !_ && /* @__PURE__ */ g("span", {
					className: "cad-numeric-input__steppers",
					children: [/* @__PURE__ */ h("button", {
						type: "button",
						tabIndex: -1,
						disabled: m,
						"aria-label": `Increase ${t || "value"}`,
						onClick: (e) => D(1, e),
						children: "+"
					}), /* @__PURE__ */ h("button", {
						type: "button",
						tabIndex: -1,
						disabled: m,
						"aria-label": `Decrease ${t || "value"}`,
						onClick: (e) => D(-1, e),
						children: "−"
					})]
				})
			]
		})]
	});
}
function Le({ unit: e = "mm", ...t }) {
	return /* @__PURE__ */ h(Ie, {
		...t,
		unit: e
	});
}
function Re({ unit: e = "°", ...t }) {
	return /* @__PURE__ */ h(Ie, {
		...t,
		unit: e
	});
}
function ze({ value: e, defaultValue: t = {
	x: "",
	y: "",
	z: ""
}, onValueChange: n, onChange: i, axes: a = [
	"X",
	"Y",
	"Z"
], unit: o = "mm", label: s = "Coordinates", className: c, ...l }) {
	let [u, d] = q(e, t, (e, t, r) => {
		n?.(e, t, r), i?.(e, t, r);
	});
	return /* @__PURE__ */ g("fieldset", {
		className: W("cad-coordinate-input", c),
		children: [s && /* @__PURE__ */ h("legend", { children: s }), /* @__PURE__ */ h("div", {
			className: "cad-coordinate-input__axes",
			children: G(a).map((e) => {
				let t = String(e).toLowerCase();
				return /* @__PURE__ */ r(Le, {
					...l,
					key: t,
					label: String(e).toUpperCase(),
					unit: o,
					value: u?.[t] ?? u?.[e] ?? "",
					onValueChange: (n, r) => d({
						...u || {},
						[t]: n
					}, String(e).toUpperCase(), r)
				});
			})
		})]
	});
}
function Be({ color: e = "#ffffff", label: t, size: n = "regular", onClick: r, className: i, style: a, ...o }) {
	let s = /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("span", {
		className: "cad-color-swatch__chip",
		style: { "--cad-swatch-color": e },
		"aria-hidden": "true"
	}), t && /* @__PURE__ */ h("span", {
		className: "cad-color-swatch__label",
		children: t
	})] }), c = {
		...o,
		className: W("cad-color-swatch", `cad-color-swatch--${n}`, i),
		style: a,
		title: o.title || t || e
	};
	return r ? /* @__PURE__ */ h("button", {
		...c,
		type: "button",
		"aria-label": o["aria-label"] || t || e,
		onClick: r,
		children: s
	}) : /* @__PURE__ */ h("span", {
		...c,
		"aria-label": o["aria-label"] || t || e,
		children: s
	});
}
function Ve({ type: e = "continuous", color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ g("span", {
		className: W("cad-linetype-preview", r),
		"data-type": e,
		style: { "--cad-line-color": t },
		title: n || e,
		"aria-label": n || e,
		children: [/* @__PURE__ */ h("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ h("small", { children: n })]
	});
}
function He({ weight: e = .25, color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ g("span", {
		className: W("cad-lineweight-preview", r),
		style: {
			"--cad-line-color": t,
			"--cad-line-weight": `${Math.max(1, Number(e) * 4)}px`
		},
		title: n || `${e} mm`,
		"aria-label": n || `${e} mm`,
		children: [/* @__PURE__ */ h("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ h("small", { children: n })]
	});
}
function Ue({ className: e }) {
	return /* @__PURE__ */ h("div", {
		className: W("cad-menu__separator", e),
		role: "separator"
	});
}
function We({ item: e, label: t, detail: n, shortcut: r, icon: i, checked: a, disabled: o = !1, type: s = "action", tone: c = "inherit", onClick: l, className: u }) {
	let d = t || K(e), f = a ?? e?.checked, p = o || e?.disabled, m = s === "checkbox" ? "menuitemcheckbox" : s === "radio" ? "menuitemradio" : "menuitem";
	return /* @__PURE__ */ g("button", {
		type: "button",
		role: m,
		disabled: p,
		"data-tone": c || e?.tone || "inherit",
		"aria-checked": m === "menuitem" ? void 0 : !!f,
		className: W("cad-menu__item", f && "cad-menu__item--checked", u),
		onClick: (t) => l?.(e, t),
		children: [
			/* @__PURE__ */ h("span", {
				className: "cad-menu__check",
				"aria-hidden": "true",
				children: f ? "✓" : ""
			}),
			i && /* @__PURE__ */ h(i, {
				size: 13,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-menu__copy",
				children: [/* @__PURE__ */ h("strong", { children: d }), n && /* @__PURE__ */ h("small", { children: n })]
			}),
			r && /* @__PURE__ */ h(Y, { shortcut: r })
		]
	});
}
function Ge({ items: e = [], label: t = "CAD menu", onAction: n, onClose: r, className: i, children: a, menuRef: o, ...s }) {
	let c = f(null), l = o || c, u = (e) => {
		let t = [...l.current?.querySelectorAll("[role^=\"menuitem\"]") || []].filter((e) => !e.disabled);
		t.length && t[(t.indexOf(document.activeElement) + e + t.length) % t.length].focus();
	};
	return /* @__PURE__ */ g("div", {
		...s,
		ref: l,
		className: W("cad-menu", i),
		role: "menu",
		"aria-label": t,
		onKeyDown: (e) => {
			if (e.key === "ArrowDown" && (e.preventDefault(), u(1)), e.key === "ArrowUp" && (e.preventDefault(), u(-1)), e.key === "Home" && (e.preventDefault(), (l.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)"))?.focus()), e.key === "End") {
				e.preventDefault();
				let t = l.current?.querySelectorAll("[role^=\"menuitem\"]:not(:disabled)");
				t?.[t.length - 1]?.focus();
			}
			e.key === "Escape" && (e.preventDefault(), r?.(e));
		},
		children: [G(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ h(Ue, {}, e.id || `separator-${t}`) : /* @__PURE__ */ h(We, {
			item: e,
			label: K(e),
			detail: e.detail,
			shortcut: e.shortcut,
			icon: e.icon,
			checked: e.checked,
			disabled: e.disabled,
			type: e.type,
			tone: e.tone,
			onClick: (e, t) => ke(e, t, n)
		}, e.id || `${K(e)}-${t}`)), a]
	});
}
function Ke({ items: e = [], label: t = "More options", open: n, defaultOpen: r = !1, onOpenChange: i, onAction: a, className: o, triggerLabel: s = "More", ...u }) {
	let [d, p] = q(n, r, (e, t) => i?.(e, t)), m = `cad-overflow-menu-${l()}`, _ = f(null), v = f(null);
	c(() => {
		if (!d) return;
		let e = window.setTimeout(() => v.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [d]);
	let y = (e) => {
		p(!1, e), window.setTimeout(() => _.current?.focus(), 0);
	};
	return /* @__PURE__ */ g("span", {
		className: W("cad-overflow-menu", o),
		children: [/* @__PURE__ */ h("button", {
			...u,
			ref: _,
			type: "button",
			className: "cad-overflow-menu__trigger",
			"aria-label": t,
			"aria-haspopup": "menu",
			"aria-expanded": d,
			"aria-controls": d ? m : void 0,
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), p(!0, e));
			},
			onClick: (e) => p(!d, e),
			children: s === "More" ? "⋯" : s
		}), d && /* @__PURE__ */ h(Ge, {
			menuRef: v,
			id: m,
			items: e,
			label: t,
			onClose: y,
			onAction: (e, t) => {
				a?.(e, t), y(t);
			}
		})]
	});
}
//#endregion
//#region src/CadWorkspaceRibbon.jsx
var X = (e) => String(e ?? "").trim(), qe = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, Je = (e) => X(e?.tabId || e?.tab || e?.placement?.tab), Ye = (e, t) => X(e?.groupId || e?.group || e?.placement?.groupId || e?.placement?.group) || t, Xe = (e, t) => X(e?.groupLabel || e?.placement?.groupLabel || e?.placement?.group) || t, Ze = (e, t) => qe(e?.order ?? e?.placement?.order, t), Qe = (e) => X(e?.tabId || e?.tab || e?.placement?.tab), $e = (e) => G(e?.commands).length ? G(e.commands) : G(e?.items), et = (e) => X(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace";
function tt(e = [], { tabId: t = "", defaultGroupId: n = "commands", defaultGroupLabel: r = "COMMANDS" } = {}) {
	let i = /* @__PURE__ */ new Map();
	return G(e).forEach((e, a) => {
		if (!e || typeof e != "object") return;
		let o = Je(e);
		if (t && o && o !== t) return;
		let s = Ye(e, n), c = Xe(e, r), l = Ze(e, a), u = i.get(s);
		if (u) {
			u.commands.push({
				command: e,
				order: l,
				index: a
			}), u.order = Math.min(u.order, l);
			return;
		}
		i.set(s, {
			id: s,
			label: c,
			order: l,
			index: a,
			commands: [{
				command: e,
				order: l,
				index: a
			}]
		});
	}), [...i.values()].sort((e, t) => e.order - t.order || e.index - t.index).map((e) => ({
		id: e.id,
		label: e.label,
		commands: e.commands.sort((e, t) => e.order - t.order || e.index - t.index).map((e) => e.command)
	}));
}
var nt = ({ groups: e, commands: t, activeTabId: n, defaultGroupId: r, defaultGroupLabel: i }) => {
	let a = G(e).filter((e) => e && typeof e == "object" && (!n || !Qe(e) || Qe(e) === n)).map((e, t) => ({
		id: X(e.id) || `group-${t + 1}`,
		label: X(e.label) || i,
		order: qe(e.order, t),
		commands: $e(e).filter((e) => !n || !Je(e) || Je(e) === n)
	})).filter((e) => e.commands.length);
	return a.length ? a.sort((e, t) => e.order - t.order) : tt(t, {
		tabId: n,
		defaultGroupId: r,
		defaultGroupLabel: i
	});
}, rt = (t, n) => e.isValidElement(t?.icon) ? t.icon : typeof t?.icon == "function" ? e.createElement(t.icon, {
	size: n ? 13 : 16,
	"aria-hidden": !0
}) : null;
function it({ command: e, group: t, activeTab: n, compact: r, renderIcon: i, renderCommand: a, onCommand: o }) {
	let s = K(e) || "COMMAND", c = !!(e?.toggle || e?.pressed !== void 0 || e?.active !== void 0), l = {
		command: e,
		group: t,
		activeTab: n,
		compact: r,
		source: "workspace-ribbon",
		execute: (i) => {
			e?.disabled || (e?.onClick?.(e, i), o?.(e, {
				group: t,
				activeTab: n,
				compact: r,
				source: "workspace-ribbon"
			}, i));
		}
	}, u = typeof i == "function" ? i(e, l) : rt(e, r), d = {
		type: "button",
		disabled: !!e?.disabled,
		"data-cad-ribbon-tool": e?.toolId || e?.id || s,
		"data-command-id": e?.id,
		"data-tone": e?.tone || "inherit",
		"data-active": e?.active || e?.pressed ? "true" : "false",
		"data-testid": e?.testId,
		className: "cad-workspace-ribbon__tool",
		style: e?.color ? { "--cad-ribbon-tool-accent": e.color } : void 0,
		"aria-label": e?.ariaLabel || e?.accessibleLabel || s,
		"aria-pressed": c ? !!(e?.pressed ?? e?.active) : void 0,
		title: e?.title || e?.detail || e?.description || s,
		onClick: l.execute
	};
	if (typeof a == "function") return a(e, {
		...l,
		icon: u,
		buttonProps: d
	});
	let f = e?.badge !== void 0 && e?.badge !== null && e.badge !== "";
	return /* @__PURE__ */ g("button", {
		...d,
		children: [
			u && /* @__PURE__ */ g("span", {
				className: "cad-workspace-ribbon__tool-icon",
				"aria-hidden": "true",
				children: [u, f && /* @__PURE__ */ h("em", { children: e.badge })]
			}),
			!u && f && /* @__PURE__ */ h("span", {
				className: "cad-workspace-ribbon__tool-badge-only",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h("em", { children: e.badge })
			}),
			/* @__PURE__ */ h("span", {
				className: "cad-workspace-ribbon__tool-label",
				children: s
			}),
			e?.shortcut && /* @__PURE__ */ h(Y, { shortcut: e.shortcut })
		]
	});
}
function at({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: i, groups: a, commands: o = [], defaultGroupId: s = "commands", defaultGroupLabel: c = "COMMANDS", label: d = "CAD workspace ribbon", tabListLabel: p = "Workspace commands", minimized: m, defaultMinimized: _ = !1, onMinimizedChange: v, collapsible: y = !0, compact: b = !1, identity: x, renderIdentity: S, status: C, statusLabel: w = "Workspace status", renderStatus: T, endSlot: E, renderIcon: D, renderCommand: O, renderMinimizeControl: k, onCommand: A, className: j, style: M, children: N, ...P }) {
	let F = `cad-workspace-ribbon-${et(l())}`, I = f(/* @__PURE__ */ new Map()), L = u(() => G(t).filter((e) => e && X(e.id)).map((e) => ({
		...e,
		id: X(e.id),
		label: K(e) || X(e.id)
	})), [t]), R = L.find((e) => !e.disabled)?.id || L[0]?.id || "", [ee, te] = q(n, r || R, (e, t) => i?.(e, L.find((t) => t.id === e), t)), z = L.find((e) => e.id === ee) || L.find((e) => !e.disabled) || L[0] || null, B = z?.id || "", [V, ne] = q(m, _, (e, t) => v?.(!!e, t)), re = u(() => nt({
		groups: a,
		commands: o,
		activeTabId: B,
		defaultGroupId: s,
		defaultGroupLabel: c
	}), [
		o,
		s,
		c,
		a,
		B
	]), ie = {
		activeTab: z,
		groups: re,
		compact: b,
		minimized: !!V
	}, ae = typeof S == "function" ? S(ie) : x, oe = typeof T == "function" ? T(ie) : C, se = `${F}-panel-${et(B || "commands")}`, ce = (e, t) => {
		e.disabled || te(e.id, t);
	}, le = (e, t, n) => {
		let r = L.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), ce(i, n), I.current.get(i.id)?.focus();
	}, ue = (e, t) => {
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && le(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && le(e.id, -1, t), t.key === "Home" && le(L.find((e) => !e.disabled)?.id || e.id, 0, t), t.key === "End") {
			let e = L.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), ce(e, t), I.current.get(e.id)?.focus();
		}
	}, de = (e) => ne((e) => !e, e), fe = typeof k == "function" ? k({
		minimized: !!V,
		toggle: de
	}) : y && /* @__PURE__ */ g("button", {
		type: "button",
		className: "cad-workspace-ribbon__minimize",
		"aria-label": V ? "Expand ribbon" : "Minimize ribbon",
		"aria-expanded": !V,
		title: V ? "Expand ribbon" : "Minimize ribbon",
		onClick: de,
		children: [/* @__PURE__ */ h("span", {
			"aria-hidden": "true",
			children: V ? "⌄" : "⌃"
		}), /* @__PURE__ */ h("b", { children: V ? "EXPAND" : "COMPACT" })]
	});
	return /* @__PURE__ */ g("header", {
		...P,
		className: W("cad-workspace-ribbon", b && "cad-workspace-ribbon--compact", V && "cad-workspace-ribbon--minimized", j),
		"data-active-tab": B || void 0,
		"data-minimized": V ? "true" : "false",
		"aria-label": d,
		style: {
			"--cad-ribbon-accent": z?.color || void 0,
			...M
		},
		children: [/* @__PURE__ */ g("div", {
			className: "cad-workspace-ribbon__tabbar",
			children: [
				ae && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__identity",
					children: ae
				}),
				L.length > 0 && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__tabs",
					role: "tablist",
					"aria-label": p,
					children: L.map((t) => {
						let n = t.id === B, r = `${F}-tab-${et(t.id)}`;
						return /* @__PURE__ */ g("button", {
							id: r,
							ref: (e) => {
								e ? I.current.set(t.id, e) : I.current.delete(t.id);
							},
							type: "button",
							role: "tab",
							disabled: !!t.disabled,
							"aria-selected": n,
							"aria-controls": `${F}-panel-${et(t.id)}`,
							tabIndex: n ? 0 : -1,
							"data-tone": t.tone || "inherit",
							"data-active": n ? "true" : "false",
							className: "cad-workspace-ribbon__tab",
							style: t.color ? { "--cad-ribbon-tab-accent": t.color } : void 0,
							onClick: (e) => ce(t, e),
							onKeyDown: (e) => ue(t, e),
							children: [t.icon && /* @__PURE__ */ h("span", {
								className: "cad-workspace-ribbon__tab-icon",
								"aria-hidden": "true",
								children: e.isValidElement(t.icon) ? t.icon : typeof t.icon == "function" ? e.createElement(t.icon, { size: 12 }) : null
							}), /* @__PURE__ */ h("span", { children: t.label })]
						}, t.id);
					})
				}),
				E && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__end-slot",
					children: E
				}),
				fe
			]
		}), !V && /* @__PURE__ */ g("div", {
			id: se,
			role: "tabpanel",
			"aria-labelledby": B ? `${F}-tab-${et(B)}` : void 0,
			tabIndex: 0,
			className: "cad-workspace-ribbon__commands",
			children: [
				/* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__groups",
					role: "toolbar",
					"aria-label": `${z?.label || "CAD"} commands`,
					children: re.map((e, t) => /* @__PURE__ */ g("section", {
						className: "cad-workspace-ribbon__group",
						"data-cad-group": e.label,
						"data-primary": t === 0 ? "true" : "false",
						"aria-label": `${e.label} command group`,
						children: [/* @__PURE__ */ h("div", {
							className: "cad-workspace-ribbon__group-tools",
							children: e.commands.map((t, n) => /* @__PURE__ */ h(it, {
								command: t,
								group: e,
								activeTab: z,
								compact: b,
								renderIcon: D,
								renderCommand: O,
								onCommand: A
							}, t?.id || `${e.id}-${n}`))
						}), e.label && /* @__PURE__ */ h("span", {
							className: "cad-workspace-ribbon__group-label",
							children: e.label
						})]
					}, e.id))
				}),
				oe && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__status",
					"aria-label": w,
					children: oe
				}),
				N && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__content",
					children: N
				})
			]
		})]
	});
}
//#endregion
//#region src/CadContextUi.jsx
var ot = Object.freeze([
	Object.freeze({
		id: "pan",
		label: "Pan",
		glyph: "✥",
		shortcut: "P",
		mode: !0
	}),
	Object.freeze({
		id: "zoom-in",
		label: "Zoom in",
		glyph: "+",
		shortcut: "+"
	}),
	Object.freeze({
		id: "zoom-out",
		label: "Zoom out",
		glyph: "−",
		shortcut: "−"
	}),
	Object.freeze({
		id: "zoom-window",
		label: "Zoom window",
		glyph: "⌗",
		shortcut: "W"
	}),
	Object.freeze({
		id: "zoom-extents",
		label: "Zoom extents",
		glyph: "⤢",
		shortcut: "E"
	}),
	Object.freeze({
		id: "orbit",
		label: "Orbit",
		glyph: "◌",
		shortcut: "Shift+Middle",
		mode: !0
	}),
	Object.freeze({
		id: "home",
		label: "Home view",
		glyph: "⌂",
		shortcut: "Home"
	})
]), st = Object.freeze([
	Object.freeze({
		id: "2d-wireframe",
		label: "2D Wireframe"
	}),
	Object.freeze({
		id: "hidden",
		label: "Hidden"
	}),
	Object.freeze({
		id: "conceptual",
		label: "Conceptual"
	}),
	Object.freeze({
		id: "realistic",
		label: "Realistic"
	}),
	Object.freeze({
		id: "shaded",
		label: "Shaded"
	}),
	Object.freeze({
		id: "shaded-with-edges",
		label: "Shaded with edges"
	}),
	Object.freeze({
		id: "x-ray",
		label: "X-ray"
	})
]), ct = Object.freeze([
	Object.freeze({
		id: "1:1",
		label: "1:1"
	}),
	Object.freeze({
		id: "1:2",
		label: "1:2"
	}),
	Object.freeze({
		id: "1:4",
		label: "1:4"
	}),
	Object.freeze({
		id: "1:5",
		label: "1:5"
	}),
	Object.freeze({
		id: "1:10",
		label: "1:10"
	}),
	Object.freeze({
		id: "1:20",
		label: "1:20"
	}),
	Object.freeze({
		id: "1:25",
		label: "1:25"
	}),
	Object.freeze({
		id: "1:50",
		label: "1:50"
	}),
	Object.freeze({
		id: "1:100",
		label: "1:100"
	})
]), lt = (e, t) => G(e).map((e, n) => {
	if (typeof e == "string" || typeof e == "number") return {
		id: String(e),
		label: String(e)
	};
	let r = K(e) || `${t} ${n + 1}`;
	return {
		...e,
		id: e?.id ?? `${t}-${n + 1}`,
		label: r
	};
}), ut = (e) => G(e).find((e) => !e?.disabled)?.id ?? "", dt = (e, t, n, r) => {
	let i = {
		pan: t.onPan,
		"zoom-in": t.onZoomIn,
		"zoom-out": t.onZoomOut,
		"zoom-window": t.onZoomWindow,
		"zoom-extents": t.onZoomExtents,
		orbit: t.onOrbit,
		home: t.onHome
	};
	e.startsWith("zoom") && t.onZoom?.(n, r), i[e]?.(n, r);
};
function ft({ actions: e = ot, activeId: t, defaultActiveId: n = "", onActiveChange: r, onChange: i, onAction: a, onPan: o, onZoom: s, onZoomIn: c, onZoomOut: l, onZoomWindow: d, onZoomExtents: f, onOrbit: p, onHome: m, label: _ = "Viewport navigation", orientation: v = "vertical", className: y, ...b }) {
	let x = u(() => lt(e, "navigation-action"), [e]), [S, C] = q(t, n, (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), w = (e, t) => {
		e.disabled || ((e.toggle ?? e.mode ?? !1) && C(S === e.id ? "" : e.id, e, t), e.onClick?.(e, t), a?.(e, t), dt(e.id, {
			onPan: o,
			onZoom: s,
			onZoomIn: c,
			onZoomOut: l,
			onZoomWindow: d,
			onZoomExtents: f,
			onOrbit: p,
			onHome: m
		}, e, t));
	};
	return /* @__PURE__ */ h("nav", {
		...b,
		className: W("cad-navigation-bar", `cad-navigation-bar--${v}`, y),
		"aria-label": _,
		children: /* @__PURE__ */ h("div", {
			className: "cad-navigation-bar__tools",
			role: "toolbar",
			"aria-label": _,
			"aria-orientation": v,
			children: x.map((e, t) => {
				if (e.type === "separator") return /* @__PURE__ */ h("span", {
					className: "cad-navigation-bar__separator",
					role: "separator",
					"aria-orientation": v === "vertical" ? "horizontal" : "vertical"
				}, e.id || t);
				let n = e.icon, r = e.toggle ?? e.mode ?? !1, i = r && S === e.id, a = K(e);
				return /* @__PURE__ */ g("button", {
					type: "button",
					className: "cad-navigation-bar__action",
					"data-action": e.id,
					"data-active": i ? "true" : "false",
					"aria-label": e.ariaLabel || a,
					"aria-pressed": r ? i : void 0,
					"aria-keyshortcuts": e.ariaKeyShortcuts || void 0,
					disabled: e.disabled,
					title: e.title || [a, e.shortcut].filter(Boolean).join(" · "),
					onClick: (t) => w(e, t),
					children: [typeof n == "function" ? /* @__PURE__ */ h(n, {
						size: 14,
						"aria-hidden": "true"
					}) : /* @__PURE__ */ h("span", {
						className: "cad-navigation-bar__glyph",
						"aria-hidden": "true",
						children: n || e.glyph || "•"
					}), /* @__PURE__ */ h("span", {
						className: "cad-navigation-bar__label",
						children: a
					})]
				}, e.id);
			})
		})
	});
}
function pt({ styles: e = st, value: t, defaultValue: n, onChange: r, onStyleChange: i, label: a = "Visual style", id: o, selectProps: s = {}, disabled: c = !1, className: d, ...f }) {
	let p = l(), m = o || `cad-visual-style-${p}`, _ = u(() => lt(e, "visual-style"), [e]), [v, y] = q(t, n ?? _[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), b = _.find((e) => e.id === v) || _[0];
	return /* @__PURE__ */ g("div", {
		...f,
		className: W("cad-visual-style-picker", d),
		"data-visual-style": b?.id || "",
		children: [/* @__PURE__ */ h("label", {
			htmlFor: m,
			children: a
		}), /* @__PURE__ */ g("span", {
			className: "cad-visual-style-picker__control",
			children: [/* @__PURE__ */ h("span", {
				className: "cad-visual-style-picker__preview",
				"data-style": b?.id || "",
				"aria-hidden": "true"
			}), /* @__PURE__ */ h("select", {
				...s,
				id: m,
				value: v ?? "",
				disabled: c || s.disabled,
				onChange: (e) => {
					let t = _.find((t) => t.id === e.target.value);
					y(e.target.value, t, e), s.onChange?.(e);
				},
				children: _.map((e) => /* @__PURE__ */ h("option", {
					value: e.id,
					disabled: e.disabled,
					children: e.label
				}, e.id))
			})]
		})]
	});
}
function mt({ scales: e = ct, value: t, defaultValue: n, onChange: r, onScaleChange: i, onManage: a, manageLabel: o = "Manage", label: s = "Viewport scale", id: c, selectProps: d = {}, disabled: f = !1, className: p, ...m }) {
	let _ = l(), v = c || `cad-viewport-scale-${_}`, y = u(() => lt(e, "viewport-scale"), [e]), [b, x] = q(t, n ?? y[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), S = y.find((e) => e.id === b) || y[0];
	return /* @__PURE__ */ g("div", {
		...m,
		className: W("cad-viewport-scale-picker", p),
		"data-scale": S?.id || "",
		children: [/* @__PURE__ */ h("label", {
			htmlFor: v,
			children: s
		}), /* @__PURE__ */ g("span", {
			className: "cad-viewport-scale-picker__control",
			children: [/* @__PURE__ */ h("select", {
				...d,
				id: v,
				value: b ?? "",
				disabled: f || d.disabled,
				onChange: (e) => {
					let t = y.find((t) => t.id === e.target.value);
					x(e.target.value, t, e), d.onChange?.(e);
				},
				children: y.map((e) => /* @__PURE__ */ h("option", {
					value: e.id,
					disabled: e.disabled,
					children: e.label
				}, e.id))
			}), a && /* @__PURE__ */ h("button", {
				type: "button",
				disabled: f || d.disabled,
				onClick: (e) => a(S, e),
				children: o
			})]
		})]
	});
}
function ht({ sets: e = [], activeId: t, defaultActiveId: n, onChange: r, onApply: i, onCreate: a, onRename: o, onDelete: s, filter: c, defaultFilter: d = "", onFilterChange: f, showFilter: p = !0, title: m = "Selection sets", filterLabel: _ = "Filter selection sets", emptyLabel: v = "No selection sets match the current filter", createLabel: y = "New", applyLabel: b = "Select", renameLabel: x = "Rename", deleteLabel: S = "Delete", className: C, children: w, ...T }) {
	let E = `cad-selection-set-filter-${l()}`, D = u(() => lt(e, "selection-set"), [e]), [O, k] = q(t, n ?? ut(D), (e, t, n) => r?.(e, t, n)), [A, j] = q(c, d, (e, t) => f?.(e, t)), M = D.find((e) => e.id === O), N = u(() => {
		let e = String(A || "").trim().toLocaleLowerCase();
		return e ? D.filter((t) => [
			K(t),
			t.description,
			t.group
		].filter(Boolean).join(" ").toLocaleLowerCase().includes(e)) : D;
	}, [D, A]), P = !!(M?.disabled || M?.locked || M?.protected || M?.system);
	return /* @__PURE__ */ g("section", {
		...T,
		className: W("cad-selection-set-panel", C),
		"aria-label": m,
		children: [
			/* @__PURE__ */ g("header", {
				className: "cad-selection-set-panel__header",
				children: [/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("h2", { children: m }), /* @__PURE__ */ h("output", {
					"aria-label": `${D.length} selection sets`,
					children: D.length
				})] }), a && /* @__PURE__ */ h("button", {
					type: "button",
					className: "cad-selection-set-panel__create",
					onClick: (e) => a(e),
					children: y
				})]
			}),
			p && /* @__PURE__ */ g("div", {
				className: "cad-selection-set-panel__filter",
				children: [
					/* @__PURE__ */ h("label", {
						htmlFor: E,
						children: _
					}),
					/* @__PURE__ */ h("input", {
						id: E,
						type: "search",
						value: A ?? "",
						onChange: (e) => j(e.target.value, e)
					}),
					A && /* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": "Clear selection set filter",
						onClick: (e) => j("", e),
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ h("ul", {
				className: "cad-selection-set-panel__list",
				children: N.map((e) => {
					let t = e.id === O, n = e.count ?? e.entityCount, r = e.countLabel || `${n} objects`;
					return /* @__PURE__ */ g("li", {
						"data-selected": t ? "true" : "false",
						children: [/* @__PURE__ */ g("button", {
							type: "button",
							className: "cad-selection-set-panel__set",
							"aria-label": e.ariaLabel || K(e),
							"aria-pressed": t,
							"aria-current": t ? "true" : void 0,
							disabled: e.disabled,
							onClick: (t) => k(e.id, e, t),
							children: [
								/* @__PURE__ */ h("span", {
									className: "cad-selection-set-panel__set-name",
									children: K(e)
								}),
								e.description && /* @__PURE__ */ h("small", { children: e.description }),
								e.group && /* @__PURE__ */ h("em", { children: e.group })
							]
						}), n !== void 0 && /* @__PURE__ */ h("output", {
							"aria-label": `${K(e)}: ${r}`,
							children: n
						})]
					}, e.id);
				})
			}),
			!N.length && /* @__PURE__ */ h("p", {
				className: "cad-selection-set-panel__empty",
				role: "status",
				children: v
			}),
			(i || o || s || w) && /* @__PURE__ */ g("footer", {
				className: "cad-selection-set-panel__actions",
				role: "group",
				"aria-label": `${m} actions`,
				children: [
					i && /* @__PURE__ */ h("button", {
						type: "button",
						disabled: !M || M.disabled,
						onClick: (e) => i(M, e),
						children: b
					}),
					o && /* @__PURE__ */ h("button", {
						type: "button",
						disabled: !M || P,
						onClick: (e) => o(M, e),
						children: x
					}),
					s && /* @__PURE__ */ h("button", {
						type: "button",
						disabled: !M || P,
						onClick: (e) => s(M, e),
						children: S
					}),
					w
				]
			})
		]
	});
}
//#endregion
//#region src/CadDraftingUi.jsx
var gt = Object.freeze({
	point: Object.freeze([
		{
			id: "x",
			label: "X",
			unit: "mm"
		},
		{
			id: "y",
			label: "Y",
			unit: "mm"
		},
		{
			id: "z",
			label: "Z",
			unit: "mm"
		}
	]),
	polar: Object.freeze([{
		id: "distance",
		label: "Distance",
		unit: "mm"
	}, {
		id: "angle",
		label: "Angle",
		type: "angle",
		unit: "°"
	}]),
	displacement: Object.freeze([
		{
			id: "deltaX",
			label: "ΔX",
			unit: "mm"
		},
		{
			id: "deltaY",
			label: "ΔY",
			unit: "mm"
		},
		{
			id: "deltaZ",
			label: "ΔZ",
			unit: "mm"
		}
	])
}), _t = Object.freeze([
	{
		id: "endpoint",
		label: "Endpoint",
		glyph: "□",
		shortcut: "END"
	},
	{
		id: "midpoint",
		label: "Midpoint",
		glyph: "△",
		shortcut: "MID"
	},
	{
		id: "center",
		label: "Center",
		glyph: "○",
		shortcut: "CEN"
	},
	{
		id: "node",
		label: "Node",
		glyph: "◆",
		shortcut: "NOD"
	},
	{
		id: "quadrant",
		label: "Quadrant",
		glyph: "◇",
		shortcut: "QUA"
	},
	{
		id: "intersection",
		label: "Intersection",
		glyph: "×",
		shortcut: "INT"
	},
	{
		id: "perpendicular",
		label: "Perpendicular",
		glyph: "⊥",
		shortcut: "PER"
	},
	{
		id: "tangent",
		label: "Tangent",
		glyph: "◒",
		shortcut: "TAN"
	},
	{
		id: "nearest",
		label: "Nearest",
		glyph: "•",
		shortcut: "NEA"
	},
	{
		id: "parallel",
		label: "Parallel",
		glyph: "∥",
		shortcut: "PAR"
	}
]), vt = Object.freeze([
	{
		id: "coincident",
		label: "Coincident",
		glyph: "⊙"
	},
	{
		id: "horizontal",
		label: "Horizontal",
		glyph: "↔"
	},
	{
		id: "vertical",
		label: "Vertical",
		glyph: "↕"
	},
	{
		id: "parallel",
		label: "Parallel",
		glyph: "∥"
	},
	{
		id: "perpendicular",
		label: "Perpendicular",
		glyph: "⊥"
	},
	{
		id: "tangent",
		label: "Tangent",
		glyph: "◒"
	},
	{
		id: "concentric",
		label: "Concentric",
		glyph: "◎"
	},
	{
		id: "equal",
		label: "Equal",
		glyph: "="
	},
	{
		id: "fix",
		label: "Fix",
		glyph: "▣"
	}
]), yt = Object.freeze([
	"1:1",
	"1:2",
	"1:5",
	"1:10",
	"1:20",
	"1:50",
	"1:100"
]), bt = Object.freeze([
	{
		id: "top",
		label: "Top"
	},
	{
		id: "bottom",
		label: "Bottom"
	},
	{
		id: "front",
		label: "Front"
	},
	{
		id: "back",
		label: "Back"
	},
	{
		id: "left",
		label: "Left"
	},
	{
		id: "right",
		label: "Right"
	},
	{
		id: "isometric",
		label: "Isometric"
	}
]), xt = (e) => G(e).map((e, t) => typeof e == "string" ? {
	id: e,
	label: e
} : {
	...e,
	id: e?.id || `${K(e)}-${t}`,
	label: K(e)
});
function St({ mode: e = "point", fields: t, value: n, defaultValue: r = {}, onChange: i, onSubmit: a, prompt: o = "Specify point", unit: s = "mm", visible: c = !0, submitLabel: d = "Accept", className: f, children: p, ...m }) {
	let _ = l(), v = G(t).length ? G(t) : gt[e] || gt.point, y = u(() => v.reduce((e, t) => t?.id && t.value !== void 0 ? {
		...e,
		[t.id]: t.value
	} : e, {}), [v]), [b, x] = q(n, u(() => ({
		...y,
		...r && typeof r == "object" ? r : {}
	}), [r, y]), (e, t, n) => i?.(e, t, n)), S = {
		...y,
		...b && typeof b == "object" ? b : {}
	}, C = (e, t, n) => x({
		...S,
		[e.id]: t
	}, e, n);
	return c ? /* @__PURE__ */ g("form", {
		...m,
		className: W("cad-dynamic-input", f),
		"data-mode": e,
		"aria-label": o,
		onSubmit: (e) => {
			e.preventDefault(), a?.(S, e);
		},
		children: [
			/* @__PURE__ */ h("output", {
				className: "cad-dynamic-input__prompt",
				children: o
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-dynamic-input__fields",
				children: [v.map((e, t) => {
					let n = e.id || t, r = {
						id: `cad-dynamic-${_}-${e.id || t}`,
						label: e.label || e.id,
						value: S[e.id] ?? "",
						min: e.min,
						max: e.max,
						step: e.step,
						disabled: e.disabled,
						unit: e.unit || s,
						onValueChange: (t, n) => C(e, t, n),
						showSteppers: !1
					};
					return e.type === "angle" ? /* @__PURE__ */ h(Re, {
						...r,
						unit: e.unit || "°"
					}, n) : e.type === "unit" ? /* @__PURE__ */ h(Le, { ...r }, n) : /* @__PURE__ */ h(Ie, { ...r }, n);
				}), p]
			}),
			a && /* @__PURE__ */ g("button", {
				type: "submit",
				className: "cad-dynamic-input__submit",
				children: [d, /* @__PURE__ */ h("span", {
					"aria-hidden": "true",
					children: "↵"
				})]
			})
		]
	}) : null;
}
function Ct({ modes: e = _t, activeIds: t, defaultActiveIds: n = [], multiple: r = !0, onChange: i, onClose: a, label: o = "Object snaps", className: s, ...c }) {
	let l = u(() => xt(e), [e]), [d, f] = q(t, n, (e, t, n) => i?.(e, t, n)), p = new Set(G(d)), m = (e, t) => {
		if (e.disabled) return;
		let n = r ? p.has(e.id) ? [...p].filter((t) => t !== e.id) : [...p, e.id] : p.has(e.id) ? [] : [e.id];
		f(n, e, t);
	};
	return /* @__PURE__ */ g("aside", {
		...c,
		className: W("cad-object-snap-menu", s),
		"aria-label": o,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: o }), a && /* @__PURE__ */ h("button", {
			type: "button",
			"aria-label": `Close ${o}`,
			onClick: a,
			children: "×"
		})] }), /* @__PURE__ */ h("div", {
			className: "cad-object-snap-menu__grid",
			role: "group",
			"aria-label": o,
			children: l.map((e) => /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-object-snap-menu__item",
				"data-active": p.has(e.id) ? "true" : "false",
				"aria-pressed": p.has(e.id),
				disabled: e.disabled,
				title: [e.label, e.shortcut].filter(Boolean).join(" · "),
				onClick: (t) => m(e, t),
				children: [
					/* @__PURE__ */ h("span", {
						className: "cad-object-snap-menu__glyph",
						"aria-hidden": "true",
						children: e.glyph || "•"
					}),
					/* @__PURE__ */ h("span", { children: e.label }),
					e.shortcut && /* @__PURE__ */ h(Y, { shortcut: e.shortcut })
				]
			}, e.id))
		})]
	});
}
function wt({ tools: e = [], selectionCount: t, label: n = "Selection tools", onAction: r, onDismiss: i, className: a, ...o }) {
	return /* @__PURE__ */ g("aside", {
		...o,
		className: W("cad-grip-toolbar", a),
		"aria-label": n,
		children: [
			t !== void 0 && /* @__PURE__ */ g("output", {
				className: "cad-grip-toolbar__selection",
				children: [t, " selected"]
			}),
			/* @__PURE__ */ h("div", {
				role: "group",
				"aria-label": n,
				children: G(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ h("span", {
					className: "cad-grip-toolbar__separator",
					role: "separator"
				}, e.id || t) : /* @__PURE__ */ h(Ae, {
					icon: e?.icon,
					label: K(e),
					shortcut: e?.shortcut,
					tone: e?.tone,
					active: e?.active,
					toggle: e?.toggle,
					disabled: e?.disabled,
					compact: !0,
					onClick: (t) => {
						e?.onClick?.(e, t), r?.(e, t);
					}
				}, e?.id || t))
			}),
			i && /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-grip-toolbar__dismiss",
				"aria-label": `Dismiss ${n}`,
				onClick: i,
				children: "×"
			})
		]
	});
}
function Tt({ constraints: e = vt, activeIds: t, defaultActiveIds: n = [], onChange: r, onAction: i, label: a = "Geometric constraints", className: o, ...s }) {
	let c = u(() => xt(e), [e]), [l, d] = q(t, n, (e, t, n) => r?.(e, t, n)), f = new Set(G(l)), p = (e, t) => {
		if (e.disabled) return;
		let n = f.has(e.id) ? [...f].filter((t) => t !== e.id) : [...f, e.id];
		d(n, e, t), i?.(e, t);
	};
	return /* @__PURE__ */ h("div", {
		...s,
		className: W("cad-constraint-bar", o),
		role: "group",
		"aria-label": a,
		children: c.map((e) => /* @__PURE__ */ g("button", {
			type: "button",
			"data-active": f.has(e.id) ? "true" : "false",
			"aria-label": e.label,
			"aria-pressed": f.has(e.id),
			disabled: e.disabled,
			title: e.label,
			onClick: (t) => p(e, t),
			children: [/* @__PURE__ */ h("span", {
				"aria-hidden": "true",
				children: e.glyph || "•"
			}), /* @__PURE__ */ h("small", { children: e.shortLabel || e.label })]
		}, e.id))
	});
}
function Et({ scales: e = yt, value: t, defaultValue: n, onChange: r, label: i = "Annotation scale", onManage: a, id: o, selectProps: s = {}, disabled: c = !1, className: d, ...f }) {
	let p = l(), m = o || `cad-annotation-scale-${p}`, _ = u(() => xt(e), [e]), [v, y] = q(t, n ?? _[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("div", {
		...f,
		className: W("cad-annotation-scale-picker", d),
		children: [
			/* @__PURE__ */ h("label", {
				htmlFor: m,
				children: i
			}),
			/* @__PURE__ */ h("select", {
				...s,
				id: m,
				value: v,
				disabled: c || s.disabled,
				onChange: (e) => {
					let t = _.find((t) => t.id === e.target.value);
					y(e.target.value, t, e), s.onChange?.(e);
				},
				children: _.map((e) => /* @__PURE__ */ h("option", {
					value: e.id,
					disabled: e.disabled,
					children: e.label
				}, e.id))
			}),
			a && /* @__PURE__ */ h("button", {
				type: "button",
				disabled: c,
				onClick: a,
				children: "Manage"
			})
		]
	});
}
function Dt({ presets: e = bt, value: t, defaultValue: n, onChange: r, label: i = "View preset", id: a, selectProps: o = {}, disabled: s = !1, className: c, ...d }) {
	let f = l(), p = a || `cad-view-preset-${f}`, m = u(() => xt(e), [e]), [_, v] = q(t, n ?? m[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("div", {
		...d,
		className: W("cad-view-preset-picker", c),
		children: [/* @__PURE__ */ h("label", {
			htmlFor: p,
			children: i
		}), /* @__PURE__ */ h("select", {
			...o,
			id: p,
			value: _,
			disabled: s || o.disabled,
			onChange: (e) => {
				let t = m.find((t) => t.id === e.target.value);
				v(e.target.value, t, e), o.onChange?.(e);
			},
			children: m.map((e) => /* @__PURE__ */ h("option", {
				value: e.id,
				disabled: e.disabled,
				children: e.label
			}, e.id))
		})]
	});
}
function Ot({ angle: e, distance: t, increment: n, active: r, defaultActive: i = !1, onActiveChange: a, className: o, label: s = "Polar tracking", ...c }) {
	let [l, u] = q(r, i, (e, t) => a?.(e, t));
	return /* @__PURE__ */ g("div", {
		...c,
		className: W("cad-polar-tracker", l && "cad-polar-tracker--active", o),
		role: "group",
		"aria-label": s,
		children: [
			/* @__PURE__ */ g("button", {
				type: "button",
				"aria-pressed": l,
				onClick: (e) => u(!l, e),
				children: [/* @__PURE__ */ h("span", {
					className: "cad-polar-tracker__ray",
					"aria-hidden": "true"
				}), "POLAR"]
			}),
			e !== void 0 && /* @__PURE__ */ g("span", { children: [
				/* @__PURE__ */ h("small", { children: "∠" }),
				e,
				n && /* @__PURE__ */ g("em", { children: ["/", n] })
			] }),
			t !== void 0 && /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("small", { children: "D" }), t] })
		]
	});
}
function kt({ type: e = "endpoint", label: t, active: n = !0, className: r, style: i, ...a }) {
	let o = _t.find((t) => t.id === e)?.glyph || "•";
	return /* @__PURE__ */ g("span", {
		...a,
		className: W("cad-object-snap-marker", n && "cad-object-snap-marker--active", r),
		"data-type": e,
		style: i,
		role: t ? "img" : void 0,
		"aria-label": t || void 0,
		children: [/* @__PURE__ */ h("span", {
			"aria-hidden": "true",
			children: o
		}), t && /* @__PURE__ */ h("small", { children: t })]
	});
}
function At({ label: e = "Selection grip", variant: t = "square", active: n = !1, disabled: r = !1, onPointerDown: i, onClick: a, className: o, ...s }) {
	return /* @__PURE__ */ h("button", {
		...s,
		type: "button",
		className: W("cad-selection-grip", n && "cad-selection-grip--active", o),
		"data-variant": t,
		"aria-label": e,
		disabled: r,
		onPointerDown: i,
		onClick: a,
		children: /* @__PURE__ */ h("span", { "aria-hidden": "true" })
	});
}
//#endregion
//#region src/CadOverlayUi.jsx
var jt = (e, t) => (n) => {
	e?.(n), n.defaultPrevented || t?.(n);
}, Mt = "button:not(:disabled):not([tabindex=\"-1\"]), input:not(:disabled):not([tabindex=\"-1\"]), select:not(:disabled):not([tabindex=\"-1\"]), textarea:not(:disabled):not([tabindex=\"-1\"]), [contenteditable=\"true\"]:not([tabindex=\"-1\"]), [href]:not([tabindex=\"-1\"]), [tabindex]:not([tabindex=\"-1\"])", Nt = (e) => !!(e && !e.hidden && !e.closest?.("[hidden], [aria-hidden=\"true\"], [inert]") && e.getAttribute("aria-hidden") !== "true" && e.getAttribute("aria-disabled") !== "true" && !e.hasAttribute("disabled")), Pt = (e) => [...e?.querySelectorAll(Mt) || []].filter(Nt), Ft = (e) => {
	if (e?.isConnected) try {
		e.focus({ preventScroll: !0 });
	} catch {
		e.focus?.();
	}
}, It = (e) => {
	if (typeof document > "u" || !e) return !1;
	let t = document.querySelectorAll("[data-cad-dialog=\"true\"]");
	return t[t.length - 1] === e;
};
function Lt({ open: e = !1, onClose: t, title: n, description: r, actions: i, tone: a = "neutral", closeOnBackdrop: o = !0, closeOnEscape: s = !0, className: u, children: d, ...p }) {
	let m = l(), _ = `cad-dialog-title-${m}`, v = `cad-dialog-description-${m}`, y = f(null), b = f(t), x = f(s), { "aria-label": S, "aria-labelledby": C, "aria-describedby": w, onKeyDown: T, ...E } = p;
	if (b.current = t, x.current = s, c(() => {
		if (!e || typeof document > "u") return;
		let t = document.activeElement, n = () => {
			let e = y.current;
			if (!It(e)) return;
			let t = Pt(e);
			Ft(t.find((e) => e.hasAttribute("data-autofocus")) || t[0] || e);
		}, r = (e) => {
			let t = y.current;
			if (e.defaultPrevented || !It(t)) return;
			if (e.key === "Escape" && x.current) {
				e.preventDefault(), b.current?.(e);
				return;
			}
			if (e.key !== "Tab") return;
			let n = Pt(t);
			if (!n.length) {
				e.preventDefault(), Ft(t);
				return;
			}
			let r = n[0], i = n[n.length - 1], a = document.activeElement;
			t?.contains(a) ? e.shiftKey && a === r ? (e.preventDefault(), Ft(i)) : !e.shiftKey && a === i && (e.preventDefault(), Ft(r)) : (e.preventDefault(), Ft(e.shiftKey ? i : r));
		}, i = window.setTimeout(n, 0);
		return window.addEventListener("keydown", r), () => {
			window.clearTimeout(i), window.removeEventListener("keydown", r), Ft(t);
		};
	}, [e]), !e) return null;
	let D = n ? _ : C, O = [r ? v : void 0, w].filter(Boolean).join(" ") || void 0, k = D ? void 0 : S || "CAD dialog", A = typeof n == "string" && n.trim() ? `Close ${n}` : "Close dialog";
	return /* @__PURE__ */ h("div", {
		className: "cad-dialog-backdrop",
		"data-tone": a,
		role: "presentation",
		onMouseDown: (e) => {
			o && e.target === e.currentTarget && b.current?.(e);
		},
		children: /* @__PURE__ */ g("section", {
			...E,
			ref: y,
			tabIndex: -1,
			className: W("cad-dialog", u),
			"data-cad-dialog": "true",
			"data-tone": a,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": k,
			"aria-labelledby": D,
			"aria-describedby": O,
			onKeyDown: (e) => T?.(e),
			children: [
				/* @__PURE__ */ g("header", {
					className: "cad-dialog__header",
					children: [/* @__PURE__ */ g("div", { children: [n && /* @__PURE__ */ h("h2", {
						id: _,
						children: n
					}), r && /* @__PURE__ */ h("p", {
						id: v,
						children: r
					})] }), t && /* @__PURE__ */ h("button", {
						type: "button",
						className: "cad-dialog__close",
						"aria-label": A,
						onClick: t,
						children: "×"
					})]
				}),
				/* @__PURE__ */ h("div", {
					className: "cad-dialog__body",
					children: d
				}),
				i && /* @__PURE__ */ h("footer", {
					className: "cad-dialog__footer",
					children: i
				})
			]
		})
	});
}
function Rt({ open: e, title: t = "Confirm action", description: n, confirmLabel: r = "Confirm", cancelLabel: i = "Cancel", destructive: a = !1, onConfirm: o, onCancel: s, children: c, className: l, ...u }) {
	return /* @__PURE__ */ h(Lt, {
		...u,
		open: e,
		title: t,
		description: n,
		onClose: s,
		className: W("cad-confirm-dialog", l),
		actions: /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("button", {
			type: "button",
			...a ? { "data-autofocus": !0 } : {},
			className: "cad-dialog__button cad-dialog__button--quiet",
			onClick: s,
			children: i
		}), /* @__PURE__ */ h("button", {
			type: "button",
			...a ? {} : { "data-autofocus": !0 },
			className: W("cad-dialog__button", a && "cad-dialog__button--danger"),
			onClick: o,
			children: r
		})] }),
		children: c
	});
}
function zt({ toast: e, onDismiss: t, className: n }) {
	let r = e || {}, i = r.tone || "neutral";
	return /* @__PURE__ */ g("article", {
		className: W("cad-toast", n),
		"data-tone": i,
		role: i === "danger" || i === "error" ? "alert" : "status",
		children: [
			/* @__PURE__ */ h("span", {
				className: "cad-toast__signal",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-toast__copy",
				children: [/* @__PURE__ */ h("strong", { children: r.title || K(r) || "CAD notification" }), r.message && /* @__PURE__ */ h("p", { children: r.message })]
			}),
			r.action && /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-toast__action",
				onClick: (e) => r.action.onClick?.(r, e),
				children: r.action.label || "Open"
			}),
			t && /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-toast__close",
				"aria-label": `Dismiss ${r.title || K(r) || "notification"}`,
				onClick: (e) => t(r, e),
				children: "×"
			})
		]
	});
}
function Bt({ toasts: e = [], onDismiss: t, placement: n = "bottom-right", label: r = "Notifications", className: i, ...a }) {
	return /* @__PURE__ */ h("section", {
		...a,
		className: W("cad-toast-stack", `cad-toast-stack--${n}`, i),
		"aria-label": r,
		"aria-live": "polite",
		children: G(e).map((e, n) => /* @__PURE__ */ h(zt, {
			toast: e,
			onDismiss: t
		}, e?.id || n))
	});
}
function Vt({ trigger: e, content: n, open: r, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", label: u = "More options", contentRole: d = "region", closeOnOutside: p = !0, closeOnEscape: m = !0, restoreFocus: _ = !0, className: v, contentClassName: y, ...b }) {
	let x = `cad-popover-${l()}`, S = f(null), C = f(r === void 0 ? a : r), [w, T] = q(r, a, (e, t) => o?.(e, t)), E = d === !1 ? void 0 : d, D = [
		"dialog",
		"grid",
		"listbox",
		"menu",
		"tree"
	].includes(E) ? E : void 0, O = (e) => T(!1, e), k = (e) => T(!w, e);
	c(() => {
		let e = C.current;
		if (C.current = w, !e || w || !_ || typeof window > "u") return;
		let t = window.requestAnimationFrame(() => {
			let e = S.current?.querySelector("[data-cad-popover-trigger=\"true\"]");
			e && document.contains(e) && e.focus?.();
		});
		return () => window.cancelAnimationFrame(t);
	}, [w, _]), c(() => {
		if (!w || typeof document > "u") return;
		let e = (e) => {
			p && !S.current?.contains(e.target) && T(!1, e);
		}, t = (e) => {
			!m || e.defaultPrevented || e.key !== "Escape" || (e.preventDefault(), T(!1, e));
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t);
		};
	}, [
		m,
		p,
		w,
		T
	]);
	let A = i(e) ? t(e, {
		"data-cad-popover-trigger": "true",
		"aria-haspopup": e.props["aria-haspopup"] ?? D,
		"aria-expanded": w,
		"aria-controls": w ? x : void 0,
		onClick: jt(e.props.onClick, k)
	}) : /* @__PURE__ */ h("button", {
		type: "button",
		"data-cad-popover-trigger": "true",
		className: "cad-popover__fallback-trigger",
		"aria-haspopup": D,
		"aria-expanded": w,
		"aria-controls": w ? x : void 0,
		onClick: k,
		children: e || "Options"
	});
	return /* @__PURE__ */ g("div", {
		...b,
		ref: S,
		className: W("cad-popover", `cad-popover--${s}`, v),
		onKeyDown: (e) => {
			b.onKeyDown?.(e), !e.defaultPrevented && m && e.key === "Escape" && w && (e.preventDefault(), O(e));
		},
		children: [A, w && /* @__PURE__ */ h("div", {
			id: x,
			className: W("cad-popover__content", y),
			role: E,
			"aria-label": u,
			children: typeof n == "function" ? n({ close: O }) : n
		})]
	});
}
function Ht({ content: e, placement: n = "top", className: r, children: a }) {
	let o = l(), [s, c] = p(!1);
	if (!e || !i(a)) return a || null;
	let u = t(a, {
		"aria-describedby": [a.props["aria-describedby"], `cad-tooltip-${o}`].filter(Boolean).join(" "),
		onMouseEnter: jt(a.props.onMouseEnter, () => c(!0)),
		onMouseLeave: jt(a.props.onMouseLeave, () => c(!1)),
		onFocus: jt(a.props.onFocus, () => c(!0)),
		onBlur: jt(a.props.onBlur, () => c(!1))
	});
	return /* @__PURE__ */ g("span", {
		className: W("cad-tooltip", `cad-tooltip--${n}`, s && "cad-tooltip--visible", r),
		children: [u, /* @__PURE__ */ h("span", {
			id: `cad-tooltip-${o}`,
			className: "cad-tooltip__bubble",
			role: "tooltip",
			children: e
		})]
	});
}
function Ut({ shortcuts: e = [], title: t = "Keyboard shortcuts", onClose: n, className: r, ...i }) {
	let a = G(e).reduce((e, t, n) => {
		let r = t?.group || "General";
		return e[r] || (e[r] = []), e[r].push({
			...t,
			id: t?.id || `${r}-${n}`
		}), e;
	}, {});
	return /* @__PURE__ */ g("section", {
		...i,
		className: W("cad-shortcut-reference", r),
		"aria-label": t,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("h2", { children: t }), n && /* @__PURE__ */ h("button", {
			type: "button",
			"aria-label": `Close ${t}`,
			onClick: n,
			children: "×"
		})] }), /* @__PURE__ */ h("div", {
			className: "cad-shortcut-reference__groups",
			children: Object.entries(a).map(([e, t]) => /* @__PURE__ */ g("section", { children: [/* @__PURE__ */ h("h3", { children: e }), /* @__PURE__ */ h("dl", { children: t.map((e) => /* @__PURE__ */ g("div", { children: [
				/* @__PURE__ */ h("dt", { children: e.label || e.command || e.id }),
				/* @__PURE__ */ h("dd", { children: /* @__PURE__ */ h(Y, { shortcut: e.shortcut || e.keys }) }),
				e.detail && /* @__PURE__ */ h("small", { children: e.detail })
			] }, e.id)) })] }, e))
		})]
	});
}
function Wt({ open: e = !0, label: t = "Command input", prompt: n, value: r, defaultValue: i = "", onChange: a, onSubmit: o, onCancel: s, placeholder: c, submitLabel: u = "Accept", className: d, ...f }) {
	let p = l(), [m, _] = q(r, i, (e, t) => a?.(e, t));
	return e ? /* @__PURE__ */ g("form", {
		...f,
		className: W("cad-command-prompt", d),
		"aria-label": t,
		onKeyDown: (e) => {
			f.onKeyDown?.(e), !e.defaultPrevented && e.key === "Escape" && (e.preventDefault(), s?.(e));
		},
		onSubmit: (e) => {
			e.preventDefault(), o?.(m, e);
		},
		children: [
			n && /* @__PURE__ */ h("label", {
				htmlFor: `cad-command-prompt-${p}`,
				children: n
			}),
			/* @__PURE__ */ h("input", {
				id: `cad-command-prompt-${p}`,
				"aria-label": n || t,
				value: m ?? "",
				placeholder: c,
				autoFocus: !0,
				onChange: (e) => _(e.target.value, e)
			}),
			(s || o) && /* @__PURE__ */ g("div", { children: [s && /* @__PURE__ */ h("button", {
				type: "button",
				onClick: s,
				children: "Cancel"
			}), o && /* @__PURE__ */ h("button", {
				type: "submit",
				children: u
			})] })
		]
	}) : null;
}
//#endregion
//#region src/CadLayoutUi.jsx
var Gt = Object.freeze([
	"#ff0000",
	"#ffff00",
	"#00ff00",
	"#00ffff",
	"#0000ff",
	"#ff00ff",
	"#ffffff",
	"#9a9a9a",
	"#7f0000",
	"#7f7f00",
	"#007f00",
	"#007f7f",
	"#00007f",
	"#7f007f",
	"#d0d0d0",
	"#444444",
	"#ff7f7f",
	"#ffff7f",
	"#7fff7f",
	"#7fffff",
	"#7f7fff",
	"#ff7fff",
	"#ffffff",
	"#202020"
]), Kt = Object.freeze([
	{
		id: "continuous",
		label: "Continuous"
	},
	{
		id: "dashed",
		label: "Dashed"
	},
	{
		id: "dotted",
		label: "Dotted"
	},
	{
		id: "dashdot",
		label: "Dash dot"
	}
]), qt = Object.freeze([
	{
		id: "default",
		label: "Default",
		value: .13
	},
	{
		id: "0.18",
		label: "0.18 mm",
		value: .18
	},
	{
		id: "0.25",
		label: "0.25 mm",
		value: .25
	},
	{
		id: "0.35",
		label: "0.35 mm",
		value: .35
	},
	{
		id: "0.50",
		label: "0.50 mm",
		value: .5
	},
	{
		id: "0.70",
		label: "0.70 mm",
		value: .7
	},
	{
		id: "1.00",
		label: "1.00 mm",
		value: 1
	}
]), Z = (e) => G(e).map((e, t) => typeof e == "string" || typeof e == "number" ? {
	id: String(e),
	label: String(e),
	value: e
} : {
	...e,
	id: e?.id || `${K(e)}-${t}`,
	label: K(e)
}), Jt = (e) => typeof e == "string" ? {
	mode: "rgb",
	value: e
} : !e || typeof e != "object" ? { mode: "by-layer" } : {
	...e,
	mode: e.mode || "rgb",
	value: e.value || e.hex
}, Yt = (e) => {
	let t = Jt(e);
	return t.mode === "by-layer" ? "ByLayer" : t.mode === "by-block" ? "ByBlock" : t.value || t.hex || "Color";
};
function Xt({ orientation: e = "horizontal", size: t, defaultSize: n = 30, minSize: r = 12, maxSize: i = 88, keyboardStep: a = 5, primary: o, secondary: s, onSizeChange: l, onResizeStart: u, onResizeEnd: d, separatorLabel: p = "Resize panels", className: m, ..._ }) {
	let v = f(null), y = f(null), b = f(n), x = f(null), S = f(d), C = f(null), w = f(null), T = f(null), E = Number(r), D = Number(i), O = Number.isFinite(E) ? E : 0, k = Math.max(O, Number.isFinite(D) ? D : 100), A = Number(n), j = J(Number.isFinite(A) ? A : O, O, k), M = Number(a), N = Number.isFinite(M) && M > 0 ? M : 5, [P, F] = q(t, n, (e, t, n) => l?.(e, t, n)), I = Number(P), L = J(Number.isFinite(I) ? I : j, O, k), R = e === "vertical" ? "y" : "x", ee = e === "vertical" ? "horizontal" : "vertical";
	b.current = L, x.current = F, S.current = d, T.current ||= () => {
		typeof window > "u" || (window.removeEventListener("pointermove", C.current), window.removeEventListener("pointerup", w.current), window.removeEventListener("pointercancel", w.current));
	}, C.current ||= (e) => {
		let t = y.current, n = v.current;
		if (!t || !n || t.pointerId !== null && e.pointerId !== t.pointerId) return;
		let r = n.getBoundingClientRect(), i = t.orientation === "vertical" ? r.height : r.width, a = t.orientation === "vertical" ? e.clientY - r.top : e.clientX - r.left;
		if (!Number.isFinite(i) || i <= 0 || !Number.isFinite(a)) return;
		let o = J(Math.round(a / Math.max(i, 1) * 100 * 10) / 10, t.minSize, t.maxSize);
		b.current = o, x.current?.(o, {
			source: "pointer",
			axis: t.axis
		}, e);
	}, w.current ||= (e) => {
		let t = y.current;
		if (!t || t.pointerId !== null && e.pointerId !== t.pointerId) return;
		y.current = null, T.current?.();
		try {
			t.pointerId !== null && t.divider?.releasePointerCapture?.(t.pointerId);
		} catch {}
		let n = J(Number(b.current), t.minSize, t.maxSize);
		b.current = n, S.current?.(n, e);
	}, c(() => () => {
		let e = y.current;
		y.current = null, T.current?.();
		try {
			e?.pointerId !== null && e?.pointerId !== void 0 && e.divider?.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []);
	let te = (t) => {
		if (!(t.button !== 0 || y.current)) {
			t.preventDefault(), b.current = L, y.current = {
				pointerId: t.pointerId ?? null,
				divider: t.currentTarget,
				orientation: e,
				minSize: O,
				maxSize: k,
				axis: R
			};
			try {
				t.pointerId !== void 0 && t.currentTarget.setPointerCapture?.(t.pointerId);
			} catch {}
			u?.(L, t), window.addEventListener("pointermove", C.current), window.addEventListener("pointerup", w.current), window.addEventListener("pointercancel", w.current);
		}
	}, z = (e, t) => {
		let n = J(J(Number(b.current), O, k) + e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: R
		}, t);
	}, B = (e, t) => {
		let n = J(e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: R
		}, t);
	};
	return /* @__PURE__ */ g("section", {
		..._,
		ref: v,
		className: W("cad-split-pane", `cad-split-pane--${e}`, m),
		style: {
			"--cad-split-size": `${L}%`,
			..._.style
		},
		children: [
			/* @__PURE__ */ h("div", {
				className: "cad-split-pane__primary",
				children: o
			}),
			/* @__PURE__ */ h("div", {
				className: "cad-split-pane__divider",
				role: "separator",
				"aria-label": p,
				"aria-orientation": ee,
				"aria-valuemin": O,
				"aria-valuemax": k,
				"aria-valuenow": L,
				"aria-valuetext": `${L}%`,
				tabIndex: 0,
				onPointerDown: te,
				onPointerCancel: w.current,
				onLostPointerCapture: w.current,
				onKeyDown: (t) => {
					let n = e === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"], r = e === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
					if (n.includes(t.key)) {
						t.preventDefault(), z(N, t);
						return;
					}
					if (r.includes(t.key)) {
						t.preventDefault(), z(-N, t);
						return;
					}
					if (t.key === "Home") {
						t.preventDefault(), B(O, t);
						return;
					}
					t.key === "End" && (t.preventDefault(), B(k, t));
				},
				children: /* @__PURE__ */ h("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ h("div", {
				className: "cad-split-pane__secondary",
				children: s
			})
		]
	});
}
function Zt({ item: e, open: t, onToggle: n, onAction: r, onClose: i }) {
	let a = Z(e?.items), o = `cad-menu-bar-popup-${l()}`, s = a.length > 0;
	return /* @__PURE__ */ g("div", {
		className: W("cad-menu-bar__menu", t && "cad-menu-bar__menu--open"),
		"data-menu-id": e.id,
		role: "none",
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			role: "menuitem",
			"data-menu-id": e.id,
			"aria-haspopup": s ? "menu" : void 0,
			"aria-expanded": s ? t : void 0,
			"aria-controls": t ? o : void 0,
			disabled: e?.disabled,
			onClick: (t) => {
				s && !e?.disabled && n(e, t);
			},
			children: [K(e), e?.shortcut && /* @__PURE__ */ h(Y, { shortcut: e.shortcut })]
		}), t && /* @__PURE__ */ h("div", {
			id: o,
			className: "cad-menu-bar__popup",
			role: "menu",
			"aria-label": K(e),
			children: a.map((e) => e.type === "separator" ? /* @__PURE__ */ h("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ h(Qt, {
				item: e,
				onAction: r,
				onClose: i
			}, e.id))
		})]
	});
}
function Qt({ item: e, onAction: t, onClose: n, className: r }) {
	let i = Z(e?.items), a = i.length > 0, [o, s] = q(void 0, !1);
	return /* @__PURE__ */ g("div", {
		className: W("cad-submenu", o && "cad-submenu--open", r),
		role: "none",
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			role: e?.checked === void 0 ? "menuitem" : "menuitemcheckbox",
			"aria-checked": e?.checked === void 0 ? void 0 : !!e.checked,
			"aria-haspopup": a ? "menu" : void 0,
			"aria-expanded": a ? o : void 0,
			disabled: e?.disabled,
			"data-checked": e?.checked ? "true" : "false",
			onClick: (r) => {
				if (!e?.disabled) {
					if (a) {
						s(!o, r);
						return;
					}
					e?.onClick?.(e, r), t?.(e, r), n?.(r);
				}
			},
			children: [
				/* @__PURE__ */ h("span", {
					className: "cad-submenu__check",
					"aria-hidden": "true",
					children: e?.checked ? "✓" : ""
				}),
				/* @__PURE__ */ h("span", {
					className: "cad-submenu__label",
					children: K(e)
				}),
				e?.shortcut && /* @__PURE__ */ h(Y, { shortcut: e.shortcut }),
				a && /* @__PURE__ */ h("span", {
					className: "cad-submenu__caret",
					"aria-hidden": "true",
					children: "›"
				})
			]
		}), a && o && /* @__PURE__ */ h("div", {
			className: "cad-submenu__popup",
			role: "menu",
			"aria-label": K(e),
			children: i.map((e) => e.type === "separator" ? /* @__PURE__ */ h("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ h(Qt, {
				item: e,
				onAction: t,
				onClose: n
			}, e.id))
		})]
	});
}
function $t({ items: e = [], openId: t, defaultOpenId: n = "", onOpenChange: r, onAction: i, label: a = "CAD application menu", className: o, ...s }) {
	let l = u(() => Z(e), [e]), [d, p] = q(t, n, (e, t, n) => r?.(e, t, n)), m = f(null), g = f(""), _ = l.find((e) => e.id === d && !e.disabled && Z(e.items).length > 0), v = _?.id || "", y = (e) => {
		!e || typeof window > "u" || window.requestAnimationFrame(() => {
			[...m.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(":scope > button:not(:disabled)")?.focus?.();
		});
	}, b = (e) => {
		[...m.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(".cad-menu-bar__popup [role^=\"menuitem\"]:not(:disabled)")?.focus?.();
	}, x = (e, t, n = !1) => {
		v && (p("", e || _, t), n && y(e?.id || v));
	}, S = (e, t) => {
		if (!(e?.disabled || Z(e?.items).length === 0)) {
			if (e.id === v) {
				x(e, t);
				return;
			}
			p(e.id, e, t);
		}
	};
	c(() => {
		let e = g.current;
		if (!e || e !== v || typeof window > "u") return;
		g.current = "";
		let t = window.requestAnimationFrame(() => b(e));
		return () => window.cancelAnimationFrame(t);
	}, [v]), c(() => {
		if (!v || typeof document > "u") return;
		let e = (e) => {
			m.current?.contains(e.target) || x(_, e);
		}, t = (e) => {
			e.defaultPrevented || e.key !== "Escape" || (e.preventDefault(), x(_, e, !0));
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t);
		};
	}, [
		v,
		_,
		p
	]);
	let C = (e, t) => {
		let n = [...e.currentTarget.querySelectorAll(":scope > .cad-menu-bar__menu > button:not(:disabled)")];
		if (!n.length) return;
		let r = n.indexOf(document.activeElement), i = n[((r >= 0 ? r : Math.max(0, n.findIndex((e) => e.dataset.menuId === v))) + t + n.length) % n.length];
		i?.focus();
		let a = i?.dataset.menuId;
		a && v && p(a, l.find((e) => e.id === a), e);
	};
	return /* @__PURE__ */ h("nav", {
		...s,
		ref: m,
		className: W("cad-menu-bar", o),
		role: "menubar",
		"aria-label": a,
		onKeyDown: (e) => {
			if (s.onKeyDown?.(e), !e.defaultPrevented && (e.key === "ArrowRight" && (e.preventDefault(), C(e, 1)), e.key === "ArrowLeft" && (e.preventDefault(), C(e, -1)), e.key === "Escape" && v && (e.preventDefault(), x(_, e, !0)), e.key === "ArrowDown" && document.activeElement?.dataset.menuId)) {
				let t = l.find((e) => e.id === document.activeElement.dataset.menuId);
				t && !t.disabled && Z(t.items).length > 0 && (e.preventDefault(), t.id === v ? window.requestAnimationFrame(() => b(t.id)) : (g.current = t.id, p(t.id, t, e)));
			}
		},
		children: l.map((e) => /* @__PURE__ */ h(Zt, {
			item: e,
			open: v === e.id,
			onToggle: S,
			onAction: i,
			onClose: (t) => x(e, t, !0)
		}, e.id))
	});
}
function en({ value: e, defaultValue: t = { mode: "by-layer" }, onChange: n, colors: r = Gt, allowByLayer: i = !0, allowByBlock: a = !0, label: o = "Color", className: s, ...c }) {
	let [l, u] = q(e, t, (e, t) => n?.(e, t)), d = Jt(l), f = (e, t) => u(e, t);
	return /* @__PURE__ */ g("section", {
		...c,
		className: W("cad-color-picker", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: o }), /* @__PURE__ */ h(Be, {
				color: d.value || (d.mode === "by-layer" ? "#b4bdc7" : "#ffffff"),
				label: Yt(d)
			})] }),
			(i || a) && /* @__PURE__ */ g("div", {
				className: "cad-color-picker__modes",
				role: "group",
				"aria-label": "Color source",
				children: [i && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-pressed": d.mode === "by-layer",
					"data-active": d.mode === "by-layer" ? "true" : "false",
					onClick: (e) => f({ mode: "by-layer" }, e),
					children: "ByLayer"
				}), a && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-pressed": d.mode === "by-block",
					"data-active": d.mode === "by-block" ? "true" : "false",
					onClick: (e) => f({ mode: "by-block" }, e),
					children: "ByBlock"
				})]
			}),
			/* @__PURE__ */ h("div", {
				className: "cad-color-picker__swatches",
				role: "group",
				"aria-label": "Indexed colors",
				children: G(r).map((e, t) => {
					let n = typeof e == "string" ? e : e?.value || e?.hex, r = typeof e == "string" ? `Color ${t + 1}` : K(e), i = d.mode === "rgb" && String(d.value || "").toLowerCase() === String(n || "").toLowerCase();
					return /* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": r,
						"aria-pressed": i,
						"data-active": i ? "true" : "false",
						style: { "--cad-picker-color": n },
						onClick: (e) => f({
							mode: "rgb",
							value: n,
							index: t + 1
						}, e)
					}, `${n}-${t}`);
				})
			}),
			/* @__PURE__ */ g("label", {
				className: "cad-color-picker__custom",
				children: [
					/* @__PURE__ */ h("span", { children: "Custom RGB" }),
					/* @__PURE__ */ h("input", {
						type: "color",
						value: d.mode === "rgb" && d.value ? d.value : "#ffffff",
						onChange: (e) => f({
							mode: "rgb",
							value: e.target.value
						}, e)
					}),
					/* @__PURE__ */ h("output", { children: d.mode === "rgb" ? d.value : "—" })
				]
			})
		]
	});
}
function tn({ value: e, onChange: t, label: n = "Color", className: r, ...i }) {
	let a = Jt(e);
	return /* @__PURE__ */ h(Vt, {
		label: n,
		className: W("cad-color-picker-button", r),
		trigger: /* @__PURE__ */ h("button", {
			type: "button",
			className: "cad-color-picker-button__trigger",
			children: /* @__PURE__ */ h(Be, {
				color: a.value || "#b4bdc7",
				label: Yt(a)
			})
		}),
		content: ({ close: r }) => /* @__PURE__ */ h(en, {
			...i,
			value: e,
			onChange: (e, n) => {
				t?.(e, n), r(n);
			},
			label: n
		})
	});
}
function nn({ linetypes: e = Kt, value: t, defaultValue: n, onChange: r, label: i = "Linetype", className: a, ...o }) {
	let s = u(() => Z(e), [e]), [c, l] = q(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), d = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ h(Vt, {
		label: i,
		className: W("cad-linetype-picker", a),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ h(Ve, {
				type: d?.id || "continuous",
				label: d?.label
			}), /* @__PURE__ */ h("span", { children: "⌄" })]
		}),
		content: ({ close: e }) => /* @__PURE__ */ h("div", {
			...o,
			className: "cad-style-picker",
			role: "listbox",
			"aria-label": i,
			children: s.map((t) => /* @__PURE__ */ h("button", {
				type: "button",
				role: "option",
				"aria-selected": t.id === c,
				onClick: (n) => {
					l(t.id, t, n), e(n);
				},
				children: /* @__PURE__ */ h(Ve, {
					type: t.id,
					label: t.label
				})
			}, t.id))
		})
	});
}
function rn({ lineweights: e = qt, value: t, defaultValue: n, onChange: r, label: i = "Lineweight", className: a, ...o }) {
	let s = u(() => Z(e), [e]), [c, l] = q(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), d = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ h(Vt, {
		label: i,
		className: W("cad-lineweight-picker", a),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ h(He, {
				weight: d?.value ?? .25,
				label: d?.label
			}), /* @__PURE__ */ h("span", { children: "⌄" })]
		}),
		content: ({ close: e }) => /* @__PURE__ */ h("div", {
			...o,
			className: "cad-style-picker",
			role: "listbox",
			"aria-label": i,
			children: s.map((t) => {
				let n = Number(t.value ?? t.id), r = Number.isFinite(n) ? n : .25;
				return /* @__PURE__ */ h("button", {
					type: "button",
					role: "option",
					"aria-selected": t.id === c,
					onClick: (n) => {
						l(t.id, t, n), e(n);
					},
					children: /* @__PURE__ */ h(He, {
						weight: r,
						label: t.label
					})
				}, t.id);
			})
		})
	});
}
function an({ block: e, selected: t = !1, onSelect: n, onInsert: r, onEdit: i, onDelete: a, renderThumbnail: o, className: s }) {
	let c = e || {}, l = K(c);
	return /* @__PURE__ */ g("article", {
		className: W("cad-block-tile", t && "cad-block-tile--selected", s),
		"data-selected": t ? "true" : "false",
		role: "listitem",
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-block-tile__select",
			"aria-pressed": t,
			onClick: (e) => n?.(c, e),
			children: [/* @__PURE__ */ h("span", {
				className: "cad-block-tile__thumbnail",
				children: o ? o(c) : c.thumbnail ? /* @__PURE__ */ h("img", {
					src: c.thumbnail,
					alt: ""
				}) : /* @__PURE__ */ h("span", {
					"aria-hidden": "true",
					children: "▧"
				})
			}), /* @__PURE__ */ g("span", {
				className: "cad-block-tile__copy",
				children: [/* @__PURE__ */ h("strong", { children: l }), c.category && /* @__PURE__ */ h("small", { children: c.category })]
			})]
		}), (r || i || a) && /* @__PURE__ */ g("footer", { children: [
			r && /* @__PURE__ */ h("button", {
				type: "button",
				onClick: (e) => r(c, e),
				children: "Insert"
			}),
			i && /* @__PURE__ */ h("button", {
				type: "button",
				"aria-label": `Edit ${l}`,
				onClick: (e) => i(c, e),
				children: "✎"
			}),
			a && /* @__PURE__ */ h("button", {
				type: "button",
				"aria-label": `Delete ${l}`,
				onClick: (e) => a(c, e),
				children: "×"
			})
		] })]
	});
}
function on({ blocks: e = [], value: t, defaultValue: n = "", onChange: r, onInsert: i, onCreate: a, onEdit: o, onDelete: s, filter: c, defaultFilter: d = "", onFilterChange: f, view: p = "grid", renderThumbnail: m, title: _ = "Blocks", className: v, emptyLabel: y = "No blocks match the current filter" }) {
	let b = `cad-block-filter-${l()}`, [x, S] = q(t, n, (e, t, n) => r?.(e, t, n)), [C, w] = q(c, d, (e, t) => f?.(e, t)), T = u(() => G(e).filter((e) => `${K(e)} ${e?.category || ""}`.toLocaleLowerCase().includes(String(C || "").toLocaleLowerCase())), [e, C]);
	return /* @__PURE__ */ g("section", {
		className: W("cad-block-palette", `cad-block-palette--${p}`, v),
		"aria-label": _,
		children: [
			/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("h2", { children: _ }), a && /* @__PURE__ */ h("button", {
				type: "button",
				onClick: a,
				children: "+ New"
			})] }),
			/* @__PURE__ */ g("div", {
				className: "cad-block-palette__filter",
				children: [
					/* @__PURE__ */ h("label", {
						htmlFor: b,
						children: "Filter blocks"
					}),
					/* @__PURE__ */ h("input", {
						id: b,
						value: C ?? "",
						placeholder: "Filter blocks",
						onChange: (e) => w(e.target.value, e)
					}),
					C && /* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": "Clear block filter",
						onClick: (e) => w("", e),
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-block-palette__blocks",
				role: "list",
				children: [T.map((e, t) => /* @__PURE__ */ h(an, {
					block: e,
					selected: e?.id === x,
					onSelect: (e, t) => S(e.id, e, t),
					onInsert: i,
					onEdit: o,
					onDelete: s,
					renderThumbnail: m
				}, e?.id || t)), !T.length && /* @__PURE__ */ h("p", { children: y })]
			})
		]
	});
}
function sn({ value: e, defaultValue: t = {
	scale: 1,
	rotation: 0,
	uniform: !0,
	specifyOnScreen: !1,
	explode: !1
}, onChange: n, label: r = "Insert options", className: i }) {
	let [a, o] = q(e, t, (e, t, r) => n?.(e, t, r)), s = (e, t, n) => o({
		...a || {},
		[e]: t
	}, e, n);
	return /* @__PURE__ */ g("fieldset", {
		className: W("cad-block-insert-options", i),
		children: [
			/* @__PURE__ */ h("legend", { children: r }),
			/* @__PURE__ */ g("label", { children: ["Scale", /* @__PURE__ */ h("input", {
				type: "number",
				step: "0.1",
				value: a?.scale ?? 1,
				onChange: (e) => s("scale", Number(e.target.value), e)
			})] }),
			/* @__PURE__ */ g("label", { children: [
				"Rotation",
				/* @__PURE__ */ h("input", {
					type: "number",
					step: "1",
					value: a?.rotation ?? 0,
					onChange: (e) => s("rotation", Number(e.target.value), e)
				}),
				/* @__PURE__ */ h("small", { children: "°" })
			] }),
			/* @__PURE__ */ g("label", { children: [/* @__PURE__ */ h("input", {
				type: "checkbox",
				checked: !!a?.uniform,
				onChange: (e) => s("uniform", e.target.checked, e)
			}), "Uniform scale"] }),
			/* @__PURE__ */ g("label", { children: [/* @__PURE__ */ h("input", {
				type: "checkbox",
				checked: !!a?.specifyOnScreen,
				onChange: (e) => s("specifyOnScreen", e.target.checked, e)
			}), "Specify on-screen"] }),
			/* @__PURE__ */ g("label", { children: [/* @__PURE__ */ h("input", {
				type: "checkbox",
				checked: !!a?.explode,
				onChange: (e) => s("explode", e.target.checked, e)
			}), "Explode"] })
		]
	});
}
//#endregion
//#region src/CadInspectorUi.jsx
function cn({ value: e, defaultValue: t = "", onChange: n, placeholder: r = "Filter", label: i = "Filter list", className: a, ...o }) {
	let s = l(), [c, u] = q(e, t, (e, t) => n?.(e, t));
	return /* @__PURE__ */ g("div", {
		className: W("cad-filter-bar", a),
		children: [
			/* @__PURE__ */ h("label", {
				className: "cad-filter-bar__label",
				htmlFor: `cad-filter-${s}`,
				children: i
			}),
			/* @__PURE__ */ h("input", {
				...o,
				id: `cad-filter-${s}`,
				value: c ?? "",
				placeholder: r,
				onChange: (e) => u(e.target.value, e)
			}),
			c && /* @__PURE__ */ h("button", {
				type: "button",
				"aria-label": `Clear ${i.toLowerCase()}`,
				onClick: (e) => u("", e),
				children: "×"
			})
		]
	});
}
function ln({ property: e, value: t, onValueChange: n, inputId: r, className: i }) {
	let a = e || {}, o = a.type || "text", s = t ?? a.value ?? "", c = (e, t) => {
		a.onChange?.(e, a, t), n?.(a.id, e, a, t);
	};
	return typeof a.render == "function" ? /* @__PURE__ */ h("div", {
		className: W("cad-property-field", i),
		children: a.render({
			id: r,
			property: a,
			value: s,
			onChange: c
		})
	}) : a.readOnly || o === "readonly" ? /* @__PURE__ */ h("output", {
		className: W("cad-property-field", "cad-property-field--readonly", i),
		title: String(s),
		children: s || "—"
	}) : o === "toggle" || o === "boolean" ? /* @__PURE__ */ g("label", {
		className: W("cad-property-field", "cad-property-field--toggle", i),
		children: [/* @__PURE__ */ h("input", {
			id: r,
			type: "checkbox",
			"aria-label": a.label || a.id,
			checked: !!s,
			disabled: a.disabled,
			onChange: (e) => c(e.target.checked, e)
		}), /* @__PURE__ */ h("span", { children: s ? a.onLabel || "On" : a.offLabel || "Off" })]
	}) : o === "select" || o === "enum" ? /* @__PURE__ */ h("select", {
		id: r,
		className: W("cad-property-field", i),
		value: s,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e),
		children: G(a.options).map((e, t) => {
			let n = typeof e == "string" || typeof e == "number" ? {
				value: e,
				label: e
			} : e;
			return /* @__PURE__ */ h("option", {
				value: n.value ?? n.id,
				children: K(n)
			}, n.id || n.value || t);
		})
	}) : o === "color" ? /* @__PURE__ */ g("span", {
		className: W("cad-property-field", "cad-property-field--color", i),
		children: [/* @__PURE__ */ h(Be, {
			color: s || "#ffffff",
			label: s || "#ffffff"
		}), /* @__PURE__ */ h("input", {
			id: r,
			type: "color",
			value: s || "#ffffff",
			disabled: a.disabled,
			onChange: (e) => c(e.target.value, e)
		})]
	}) : o === "cad-color" ? /* @__PURE__ */ h(tn, {
		value: s,
		onChange: c,
		label: a.label || a.id,
		className: W("cad-property-field", "cad-property-field--cad-color", i),
		colors: a.colors,
		allowByLayer: a.allowByLayer,
		allowByBlock: a.allowByBlock
	}) : o === "linetype" ? /* @__PURE__ */ h(nn, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: W("cad-property-field", "cad-property-field--style", i),
		linetypes: a.options
	}) : o === "lineweight" ? /* @__PURE__ */ h(rn, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: W("cad-property-field", "cad-property-field--style", i),
		lineweights: a.options
	}) : o === "scale" ? /* @__PURE__ */ h(Et, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: W("cad-property-field", "cad-property-field--style", i),
		scales: a.options
	}) : o === "number" ? /* @__PURE__ */ h(Ie, {
		id: r,
		className: W("cad-property-field", i),
		value: s,
		min: a.min,
		max: a.max,
		step: a.step,
		unit: a.unit,
		prefix: a.prefix,
		suffix: a.suffix,
		disabled: a.disabled,
		readOnly: a.readOnly,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "unit" ? /* @__PURE__ */ h(Le, {
		id: r,
		className: W("cad-property-field", i),
		value: s,
		unit: a.unit,
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "angle" ? /* @__PURE__ */ h(Re, {
		id: r,
		className: W("cad-property-field", i),
		value: s,
		unit: a.unit || "°",
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "coordinate" ? /* @__PURE__ */ h(ze, {
		className: W("cad-property-field", i),
		value: s,
		axes: a.axes,
		unit: a.unit,
		disabled: a.disabled,
		onValueChange: (e) => c(e),
		label: a.label || a.id
	}) : o === "multiline" ? /* @__PURE__ */ h("textarea", {
		id: r,
		className: W("cad-property-field", "cad-property-field--multiline", i),
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	}) : /* @__PURE__ */ h("input", {
		id: r,
		className: W("cad-property-field", i),
		type: o,
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	});
}
function un({ property: e, value: t, onValueChange: n, className: r }) {
	let i = l(), a = e || {};
	if (a.hidden) return null;
	let o = `cad-property-${i}-${a.id || "field"}`, s = !a.readOnly && typeof a.render != "function" && ![
		"toggle",
		"boolean",
		"coordinate",
		"readonly"
	].includes(a.type || "text");
	return /* @__PURE__ */ g("div", {
		className: W("cad-property-row", a.readOnly && "cad-property-row--readonly", r),
		"data-type": a.type || "text",
		children: [s ? /* @__PURE__ */ h("label", {
			className: "cad-property-row__label",
			htmlFor: o,
			title: a.description || a.label,
			children: a.label || a.id
		}) : /* @__PURE__ */ h("span", {
			className: "cad-property-row__label",
			title: a.description || a.label,
			children: a.label || a.id
		}), /* @__PURE__ */ h(ln, {
			property: a,
			value: t,
			inputId: o,
			onValueChange: n
		})]
	});
}
function dn({ id: e, title: t, properties: n = [], collapsible: r = !0, open: i, defaultOpen: a = !0, onOpenChange: o, onValueChange: s, className: c, children: u }) {
	let d = l(), f = e || `cad-property-section-${d}`, [p, m] = q(i, a, (e, t) => o?.(e, t)), _ = r ? /* @__PURE__ */ g("button", {
		type: "button",
		className: "cad-property-section__heading",
		"aria-expanded": p,
		"aria-controls": `${f}-body`,
		onClick: (e) => m(!p, e),
		children: [/* @__PURE__ */ h("span", { children: t }), /* @__PURE__ */ h("i", {
			"aria-hidden": "true",
			children: p ? "▾" : "▸"
		})]
	}) : /* @__PURE__ */ h("h3", {
		className: "cad-property-section__heading",
		children: t
	});
	return /* @__PURE__ */ g("section", {
		className: W("cad-property-section", !p && "cad-property-section--closed", c),
		children: [_, /* @__PURE__ */ h("div", {
			id: `${f}-body`,
			className: "cad-property-section__body",
			hidden: !p,
			children: u || G(n).map((e, t) => /* @__PURE__ */ h(un, {
				property: e,
				onValueChange: s
			}, e?.id || t))
		})]
	});
}
function fn({ sections: e, properties: t, onValueChange: n, label: r = "Properties", className: i, ...a }) {
	let o = G(e).length ? G(e) : [{
		id: "properties",
		title: r,
		properties: G(t)
	}];
	return /* @__PURE__ */ h("section", {
		...a,
		className: W("cad-property-grid", i),
		"aria-label": r,
		children: o.map((e, t) => /* @__PURE__ */ h(dn, {
			...e,
			onValueChange: n
		}, e?.id || t))
	});
}
function pn({ layers: e = [], value: t, defaultValue: n, onChange: r, label: i = "Current layer", className: a, disabled: o = !1 }) {
	let [s, c] = q(t, n ?? G(e)[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("label", {
		className: W("cad-layer-picker", a),
		children: [/* @__PURE__ */ h("span", { children: i }), /* @__PURE__ */ h("select", {
			value: s,
			disabled: o,
			onChange: (t) => {
				let n = G(e).find((e) => e?.id === t.target.value);
				c(t.target.value, n, t);
			},
			children: G(e).map((e, t) => /* @__PURE__ */ h("option", {
				value: e?.id,
				children: K(e)
			}, e?.id || t))
		})]
	});
}
function mn({ layer: e, active: t = !1, onActivate: n, onLayerChange: r, onColorClick: i, className: a }) {
	let o = e || {}, s = (e, t) => r?.(o.id, e, o, t), c = K(o), l = (e, t, n, i) => r ? /* @__PURE__ */ h("button", {
		type: "button",
		"aria-label": e,
		"aria-pressed": t,
		"data-active": t ? "true" : "false",
		onClick: (e) => s(i, e),
		children: n
	}) : /* @__PURE__ */ h("span", {
		"aria-hidden": "true",
		"data-active": t ? "true" : "false",
		children: n
	}), u = /* @__PURE__ */ h(Be, {
		color: o.color || "#ffffff",
		"aria-label": `${c} color`,
		onClick: i ? (e) => i(o, e) : void 0
	}), d = /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: c }), o.description && /* @__PURE__ */ h("small", { children: o.description })] });
	return /* @__PURE__ */ g("div", {
		className: W("cad-layer-row", t && "cad-layer-row--active", a),
		"data-active": t ? "true" : "false",
		role: "listitem",
		children: [
			/* @__PURE__ */ g("div", {
				className: "cad-layer-row__states",
				children: [
					l(`${c}: ${o.visible === !1 ? "show" : "hide"}`, o.visible !== !1, "◉", { visible: o.visible === !1 }),
					l(`${c}: ${o.frozen ? "thaw" : "freeze"}`, !!o.frozen, "❄", { frozen: !o.frozen }),
					l(`${c}: ${o.locked ? "unlock" : "lock"}`, !!o.locked, "⌑", { locked: !o.locked })
				]
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-layer-row__identity",
				children: [u, n ? /* @__PURE__ */ h("button", {
					type: "button",
					className: "cad-layer-row__name",
					onClick: (e) => n(o, e),
					children: d
				}) : /* @__PURE__ */ h("span", {
					className: "cad-layer-row__name",
					children: d
				})]
			}),
			/* @__PURE__ */ h(Ve, {
				type: o.linetype || "continuous",
				color: o.color || "currentColor",
				label: o.linetype
			}),
			/* @__PURE__ */ h(He, {
				weight: o.lineweight ?? .25,
				color: o.color || "currentColor",
				label: o.lineweight ? `${o.lineweight} mm` : void 0
			})
		]
	});
}
function hn({ layers: e = [], activeLayerId: t, onActiveLayerChange: n, onLayerChange: r, onAddLayer: i, onDeleteLayer: a, onColorClick: o, title: s = "Layers", filter: c, defaultFilter: l = "", onFilterChange: d, filterable: f = !0, className: p, emptyLabel: m = "No layers match this filter" }) {
	let [_, v] = q(c, l, (e, t) => d?.(e, t)), y = u(() => G(e).filter((e) => K(e).toLocaleLowerCase().includes(String(_ || "").toLocaleLowerCase())), [e, _]);
	return /* @__PURE__ */ g("section", {
		className: W("cad-layer-panel", p),
		"aria-label": s,
		children: [
			/* @__PURE__ */ g("header", {
				className: "cad-layer-panel__header",
				children: [/* @__PURE__ */ h("h2", { children: s }), /* @__PURE__ */ g("span", { children: [i && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": "Add layer",
					onClick: i,
					children: "+"
				}), a && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": "Delete active layer",
					disabled: !t,
					onClick: a,
					children: "×"
				})] })]
			}),
			f && /* @__PURE__ */ h(cn, {
				value: _,
				onChange: v,
				label: "Filter layers",
				placeholder: "Filter layers"
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-layer-panel__columns",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ h("span", { children: "State" }),
					/* @__PURE__ */ h("span", { children: "Layer" }),
					/* @__PURE__ */ h("span", { children: "Type" }),
					/* @__PURE__ */ h("span", { children: "Weight" })
				]
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-layer-panel__rows",
				role: "list",
				children: [y.map((e, i) => /* @__PURE__ */ h(mn, {
					layer: e,
					active: e?.id === t || e?.active,
					onActivate: n ? (e, t) => n(e.id, e, t) : void 0,
					onLayerChange: r,
					onColorClick: o
				}, e?.id || i)), !y.length && /* @__PURE__ */ h("p", {
					className: "cad-layer-panel__empty",
					children: m
				})]
			})
		]
	});
}
function gn({ node: e, level: t, selectedId: n, expandedIds: r, onSelect: i, onExpandedChange: a }) {
	let o = e || {}, s = G(o.children), c = s.length > 0, l = r.has(o.id), u = o.id === n, d = o.icon, f = (e) => {
		if (!c) return;
		let t = new Set(r);
		l ? t.delete(o.id) : t.add(o.id), a(t, o, e);
	};
	return /* @__PURE__ */ g("li", {
		className: "cad-object-tree__branch",
		children: [/* @__PURE__ */ g("div", {
			className: W("cad-object-tree__entry", u && "cad-object-tree__entry--selected"),
			children: [c ? /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-object-tree__expander",
				"aria-label": `${l ? "Collapse" : "Expand"} ${K(o)}`,
				onClick: f,
				children: l ? "▾" : "▸"
			}) : /* @__PURE__ */ h("span", { className: "cad-object-tree__spacer" }), /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-object-tree__label",
				disabled: o.disabled,
				onClick: (e) => i?.(o, e),
				onKeyDown: (e) => {
					e.key === "ArrowRight" && c && !l && (e.preventDefault(), f(e)), e.key === "ArrowLeft" && c && l && (e.preventDefault(), f(e));
				},
				children: [
					d && /* @__PURE__ */ h(d, {
						size: 13,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ h("span", { children: K(o) }),
					o.meta && /* @__PURE__ */ h("small", { children: o.meta })
				]
			})]
		}), c && l && /* @__PURE__ */ h("ul", { children: s.map((e, o) => /* @__PURE__ */ h(gn, {
			node: e,
			level: t + 1,
			selectedId: n,
			expandedIds: r,
			onSelect: i,
			onExpandedChange: a
		}, e?.id || o)) })]
	});
}
function _n({ nodes: e = [], selectedId: t, defaultSelectedId: n = "", onSelect: r, expandedIds: i, defaultExpandedIds: a, onExpandedChange: o, label: s = "CAD object tree", className: c, ...l }) {
	let u = a ?? G(e).filter((e) => e?.expanded).map((e) => e.id), [d, f] = q(t, n, (e, t, n) => r?.(e, t, n)), [p, m] = q(i, u, (e, t, n) => o?.(e, t, n)), g = new Set(G(p));
	return /* @__PURE__ */ h("ul", {
		...l,
		className: W("cad-object-tree", c),
		"aria-label": s,
		children: G(e).map((e, t) => /* @__PURE__ */ h(gn, {
			node: e,
			level: 1,
			selectedId: d,
			expandedIds: g,
			onSelect: (e, t) => f(e.id, e, t),
			onExpandedChange: (e, t, n) => m([...e], t, n)
		}, e?.id || t))
	});
}
function vn({ label: e, value: t = 0, status: n, onCancel: r, className: i }) {
	let a = Math.max(0, Math.min(100, Number(t) || 0));
	return /* @__PURE__ */ g("section", {
		className: W("cad-task-progress", i),
		"aria-label": e || "Task progress",
		children: [/* @__PURE__ */ g("div", { children: [
			/* @__PURE__ */ h("strong", { children: e || "Working" }),
			/* @__PURE__ */ h("output", { children: n || `${a}%` }),
			r && /* @__PURE__ */ h("button", {
				type: "button",
				onClick: r,
				children: "Cancel"
			})
		] }), /* @__PURE__ */ g("progress", {
			value: a,
			max: "100",
			"aria-label": e || "Task progress",
			children: [a, "%"]
		})]
	});
}
function yn({ references: e = [], onReload: t, onUnload: n, className: r, title: i = "External references" }) {
	return /* @__PURE__ */ g("section", {
		className: W("cad-reference-list", r),
		"aria-label": i,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("h2", { children: i }), /* @__PURE__ */ h("span", { children: G(e).length })] }), /* @__PURE__ */ h("ul", { children: G(e).map((e, r) => /* @__PURE__ */ g("li", { children: [
			/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: K(e) }), /* @__PURE__ */ h("small", { children: e?.path || e?.detail })] }),
			/* @__PURE__ */ h("em", {
				"data-status": e?.status || "loaded",
				children: e?.status || "loaded"
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-reference-list__actions",
				children: [t && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `Reload ${K(e)}`,
					onClick: (n) => t(e, n),
					children: "Reload"
				}), n && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `Unload ${K(e)}`,
					onClick: (t) => n(e, t),
					children: "Unload"
				})]
			})
		] }, e?.id || r)) })]
	});
}
//#endregion
//#region src/CadDataUi.jsx
var bn = (e, t) => typeof t?.render == "function" ? t.render(e, t) : typeof t?.accessor == "function" ? t.accessor(e, t) : e?.[t?.accessor || t?.id], xn = (e, t) => {
	let n = typeof t?.sortValue == "function" ? t.sortValue(e, t) : bn(e, t);
	return typeof n == "string" ? n.toLocaleLowerCase() : n;
};
function Sn({ columns: e = [], rows: t = [], rowId: n = (e) => e?.id, selectedIds: r, defaultSelectedIds: i = [], onSelectionChange: a, selectionMode: o = "multiple", onRowActivate: s, sort: c, defaultSort: l, onSortChange: d, caption: f = "CAD data", emptyLabel: p = "No rows to display", className: m, ..._ }) {
	let v = u(() => G(e).filter((e) => e?.id), [e]), [y, b] = q(r, i, (e, t, n) => a?.(e, t, n)), [x, S] = q(c, l, (e, t, n) => d?.(e, t, n)), C = new Set(G(y)), w = u(() => {
		let e = [...G(t)], n = v.find((e) => e.id === x?.columnId);
		if (!n || !x?.direction) return e;
		let r = x.direction === "desc" ? -1 : 1;
		return e.sort((e, t) => String(xn(e, n) ?? "").localeCompare(String(xn(t, n) ?? ""), void 0, { numeric: !0 }) * r);
	}, [
		x,
		v,
		t
	]), T = (e, t) => {
		if (o === "none") return;
		let r = typeof n == "function" ? n(e) : e?.[n], i = o === "single" ? C.has(r) ? [] : [r] : C.has(r) ? [...C].filter((e) => e !== r) : [...C, r];
		b(i, e, t);
	}, E = (e, t) => {
		if (!e.sortable) return;
		let n = x?.columnId === e.id && x.direction === "asc" ? "desc" : "asc";
		S({
			columnId: e.id,
			direction: n
		}, e, t);
	}, D = w.length > 0 && w.every((e) => C.has(typeof n == "function" ? n(e) : e?.[n]));
	return /* @__PURE__ */ h("div", {
		..._,
		className: W("cad-data-grid", m),
		children: /* @__PURE__ */ g("table", { children: [
			/* @__PURE__ */ h("caption", { children: f }),
			/* @__PURE__ */ h("thead", { children: /* @__PURE__ */ g("tr", { children: [o !== "none" && /* @__PURE__ */ h("th", {
				scope: "col",
				className: "cad-data-grid__selection",
				children: o === "multiple" && /* @__PURE__ */ h("input", {
					type: "checkbox",
					"aria-label": "Select all rows",
					checked: D,
					onChange: (e) => {
						let t = e.target.checked ? w.map((e) => typeof n == "function" ? n(e) : e?.[n]) : [];
						b(t, null, e);
					}
				})
			}), v.map((e) => /* @__PURE__ */ h("th", {
				scope: "col",
				style: e.width ? { width: e.width } : void 0,
				"aria-sort": x?.columnId === e.id ? x.direction === "desc" ? "descending" : "ascending" : void 0,
				children: e.sortable ? /* @__PURE__ */ g("button", {
					type: "button",
					onClick: (t) => E(e, t),
					children: [e.label || e.id, /* @__PURE__ */ h("span", {
						"aria-hidden": "true",
						children: x?.columnId === e.id ? x.direction === "desc" ? "↓" : "↑" : "↕"
					})]
				}) : e.label || e.id
			}, e.id))] }) }),
			/* @__PURE__ */ g("tbody", { children: [w.map((e, t) => {
				let r = typeof n == "function" ? n(e) : e?.[n], i = C.has(r);
				return /* @__PURE__ */ g("tr", {
					"data-selected": i ? "true" : "false",
					onDoubleClick: (t) => s?.(e, t),
					children: [o !== "none" && /* @__PURE__ */ h("td", {
						className: "cad-data-grid__selection",
						children: /* @__PURE__ */ h("input", {
							type: o === "single" ? "radio" : "checkbox",
							"aria-label": `Select ${K(e) || r || t + 1}`,
							checked: i,
							onChange: (t) => T(e, t)
						})
					}), v.map((t) => /* @__PURE__ */ h("td", {
						"data-align": t.align || "start",
						children: bn(e, t) ?? "—"
					}, t.id))]
				}, r || t);
			}), !w.length && /* @__PURE__ */ h("tr", { children: /* @__PURE__ */ h("td", {
				colSpan: v.length + (o === "none" ? 0 : 1),
				className: "cad-data-grid__empty",
				children: p
			}) })] })
		] })
	});
}
function Cn({ filters: e = [], activeIds: t, defaultActiveIds: n = [], onChange: r, label: i = "Selection filter", className: a, ...o }) {
	let [s, c] = q(t, n, (e, t, n) => r?.(e, t, n)), l = new Set(G(s));
	return /* @__PURE__ */ g("section", {
		...o,
		className: W("cad-selection-filter", a),
		"aria-label": i,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: i }), /* @__PURE__ */ g("output", { children: [
			l.size,
			"/",
			G(e).length
		] })] }), /* @__PURE__ */ h("div", {
			role: "group",
			"aria-label": i,
			children: G(e).map((e, t) => {
				let n = e?.id || `${K(e)}-${t}`, r = l.has(n), i = e?.icon;
				return /* @__PURE__ */ g("button", {
					type: "button",
					"aria-pressed": r,
					"data-active": r ? "true" : "false",
					disabled: e?.disabled,
					onClick: (t) => {
						let i = r ? [...l].filter((e) => e !== n) : [...l, n];
						c(i, {
							...e,
							id: n
						}, t);
					},
					children: [
						i && /* @__PURE__ */ h(i, {
							size: 12,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ h("span", { children: K(e) }),
						e?.count !== void 0 && /* @__PURE__ */ h("em", { children: e.count })
					]
				}, n);
			})
		})]
	});
}
function wn({ candidates: e = [], activeId: t, defaultActiveId: n, onChange: r, onAccept: i, onCancel: a, label: o = "Selection cycle", className: s, ...c }) {
	let l = u(() => G(e).map((e, t) => ({
		...e,
		id: e?.id || `${K(e)}-${t}`
	})), [e]), [d, f] = q(t, n ?? l[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), p = Math.max(0, l.findIndex((e) => e.id === d)), m = l[p], _ = (e, t) => {
		if (!l.length) return;
		let n = l[(p + e + l.length) % l.length];
		f(n.id, n, t);
	};
	return l.length ? /* @__PURE__ */ g("aside", {
		...c,
		className: W("cad-selection-cycler", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ h("button", {
				type: "button",
				"aria-label": "Previous candidate",
				onClick: (e) => _(-1, e),
				children: "‹"
			}),
			/* @__PURE__ */ g("output", { children: [
				/* @__PURE__ */ g("small", { children: [
					p + 1,
					" / ",
					l.length
				] }),
				/* @__PURE__ */ h("strong", { children: K(m) }),
				m?.detail && /* @__PURE__ */ h("span", { children: m.detail })
			] }),
			/* @__PURE__ */ h("button", {
				type: "button",
				"aria-label": "Next candidate",
				onClick: (e) => _(1, e),
				children: "›"
			}),
			i && /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-selection-cycler__accept",
				onClick: (e) => i(m, e),
				children: "Select"
			}),
			a && /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-selection-cycler__cancel",
				"aria-label": "Cancel selection cycle",
				onClick: a,
				children: "×"
			})
		]
	}) : null;
}
function Tn({ title: e = "Quick properties", properties: t, sections: n, onValueChange: r, onPinChange: i, pinned: a = !1, onClose: o, className: s, ...c }) {
	return /* @__PURE__ */ g("aside", {
		...c,
		className: W("cad-quick-properties", s),
		"aria-label": e,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("h2", { children: e }), /* @__PURE__ */ g("span", { children: [i && /* @__PURE__ */ h("button", {
			type: "button",
			"aria-label": `${a ? "Unpin" : "Pin"} ${e}`,
			"aria-pressed": a,
			onClick: (e) => i(!a, e),
			children: "⌖"
		}), o && /* @__PURE__ */ h("button", {
			type: "button",
			"aria-label": `Close ${e}`,
			onClick: o,
			children: "×"
		})] })] }), /* @__PURE__ */ h(fn, {
			properties: t,
			sections: n,
			onValueChange: r,
			label: e
		})]
	});
}
//#endregion
//#region src/CadWorkspaceProfiles.js
var En = (e) => String(e ?? "").trim(), Q = "model", Dn = (e) => {
	let t = En(e).toLowerCase();
	return /^[a-z0-9][a-z0-9-]{0,63}$/.test(t) ? t : "";
}, On = (e, t) => En(e).replace(/\s+/g, " ").slice(0, 48) || t;
function $(e, { modelId: t = Q, modelName: n = "Model" } = {}) {
	let r = Dn(t) || "model", i = Array.isArray(e) ? e : Array.isArray(e?.profiles) ? e.profiles : [], a = /* @__PURE__ */ new Set(), o = i.reduce((e, t, i) => {
		let o = Dn(t?.id) || (i === 0 ? r : "");
		return !o || a.has(o) ? e : (a.add(o), e.push({
			...t,
			id: o,
			name: On(t?.name ?? t?.label, o === r ? n : `Layout ${e.length}`),
			system: o === r || !!t?.system
		}), e);
	}, []), s = o.findIndex((e) => e.id === r);
	return [s >= 0 ? {
		...o[s],
		id: r,
		name: On(o[s].name, n),
		system: !0
	} : {
		id: r,
		name: n,
		system: !0
	}, ...o.filter((e) => e.id !== r)];
}
function kn(e, { prefix: t = "Layout", modelId: n = Q } = {}) {
	let r = $(e, { modelId: n }), i = new Set(r.map((e) => e.name.toLocaleLowerCase())), a = Math.max(1, r.filter((e) => e.id !== n).length + 1), o = `${En(t) || "Layout"} ${a}`;
	for (; i.has(o.toLocaleLowerCase());) a += 1, o = `${En(t) || "Layout"} ${a}`;
	return o;
}
function An(e, { id: t, name: n, modelId: r = Q, modelName: i = "Model", prefix: a = "Layout", ...o } = {}) {
	let s = $(e, {
		modelId: r,
		modelName: i
	}), c = new Set(s.map((e) => e.id)), l = Dn(t) || "layout", u = l, d = 1;
	for (; c.has(u);) d += 1, u = `${l}-${d}`;
	return [...s, {
		...o,
		id: u,
		name: On(n, kn(s, {
			prefix: a,
			modelId: r
		})),
		system: !1
	}];
}
function jn(e, t, n, { modelId: r = Q, modelName: i = "Model" } = {}) {
	let a = Dn(t);
	return !a || !En(n) ? $(e, {
		modelId: r,
		modelName: i
	}) : $(e, {
		modelId: r,
		modelName: i
	}).map((e) => e.id === a ? {
		...e,
		name: On(n, e.name)
	} : e);
}
function Mn(e, t, n, { modelId: r = Q, modelName: i = "Model" } = {}) {
	let a = $(e, {
		modelId: r,
		modelName: i
	}), o = Dn(t), s = o && o !== r ? a.filter((e) => e.id !== o) : a;
	return {
		profiles: s,
		activeId: s.some((e) => e.id === n) ? n : r
	};
}
//#endregion
//#region src/CadWorkspaceUi.jsx
var Nn = (e) => G(e).find((e) => !e?.disabled)?.id || "", Pn = (e, t) => typeof e == "string" ? {
	id: `${e}-${t}`,
	label: e
} : {
	id: e?.id || `${K(e)}-${t}`,
	label: K(e),
	detail: e?.detail,
	tone: e?.tone
};
function Fn({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, onCreate: a, onContextMenu: o, onRename: s, onOverflow: c, addLabel: d = "New layout", addButtonProps: f = {}, overflowLabel: p = "More drawing spaces", overflowButtonProps: m = {}, ariaLabel: _ = "Drawing spaces", className: v, ...y }) {
	let b = l(), x = u(() => G(e).map((e, t) => ({
		...e,
		id: e?.id || `space-${t}`
	})), [e]), [S, C] = q(t, n || Nn(x), (e, t, n) => r?.(e, t, n)), w = x.some((e) => e.id === S) ? S : Nn(x), T = (e, t) => {
		!e || e.disabled || C(e.id, e, t);
	}, E = (e) => document.getElementById(`cad-space-tab-${b}-${e.id}`)?.focus(), D = (e, t) => {
		let n = x.filter((e) => !e.disabled);
		if (!n.length) return;
		let r = n[(Math.max(0, n.findIndex((e) => e.id === w)) + t + n.length) % n.length];
		e.preventDefault(), T(r, e), E(r);
	};
	return /* @__PURE__ */ h("nav", {
		...y,
		className: W("cad-drawing-space-tabs", v),
		"aria-label": _,
		children: /* @__PURE__ */ g("div", {
			className: "cad-drawing-space-tabs__strip",
			children: [
				/* @__PURE__ */ h("div", {
					className: "cad-drawing-space-tabs__scroll",
					role: "tablist",
					"aria-label": _,
					onKeyDown: (e) => {
						if (e.target.closest("[role=\"tab\"]")) {
							if (e.key === "ArrowRight" && D(e, 1), e.key === "ArrowLeft" && D(e, -1), e.key === "Home") {
								let t = x.find((e) => !e.disabled);
								t && (e.preventDefault(), T(t, e), E(t));
							}
							if (e.key === "End") {
								let t = [...x].reverse().find((e) => !e.disabled);
								t && (e.preventDefault(), T(t, e), E(t));
							}
							if ((e.key === "Delete" || e.key === "Backspace") && i) {
								let t = x.find((e) => e.id === w);
								t?.closable && !t?.pinned && (e.preventDefault(), i(t, e));
							}
						}
					},
					children: x.map((e, t) => {
						let n = e.id, r = n === w, a = `cad-space-tab-${b}-${n}`, c = !!(i && e?.closable && !e?.pinned), l = e?.icon;
						return /* @__PURE__ */ g("div", {
							className: W("cad-drawing-space-tabs__item", r && "cad-drawing-space-tabs__item--active"),
							"data-kind": e?.kind || "layout",
							"data-dirty": e?.dirty ? "true" : "false",
							onContextMenu: (t) => {
								o && (t.preventDefault(), o(e, t));
							},
							children: [/* @__PURE__ */ g("button", {
								id: a,
								type: "button",
								role: "tab",
								"aria-selected": r,
								"aria-controls": e?.panelId,
								"aria-label": e?.ariaLabel || K(e),
								disabled: e?.disabled,
								tabIndex: r ? 0 : -1,
								title: e?.title || K(e),
								onClick: (t) => T({
									...e,
									id: n
								}, t),
								onDoubleClick: (t) => s?.({
									...e,
									id: n
								}, t),
								children: [
									l && /* @__PURE__ */ h(l, {
										size: 12,
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ h("span", { children: K(e) }),
									e?.dirty && /* @__PURE__ */ h("i", {
										"aria-label": "Unsaved changes",
										title: "Unsaved changes"
									})
								]
							}), c && /* @__PURE__ */ h("button", {
								type: "button",
								className: "cad-drawing-space-tabs__close",
								"aria-label": `Close ${K(e)}`,
								title: `Close ${K(e)}`,
								onClick: (t) => i({
									...e,
									id: n
								}, t),
								children: "×"
							})]
						}, n);
					})
				}),
				a && /* @__PURE__ */ h("button", {
					...f,
					type: "button",
					className: W("cad-drawing-space-tabs__add", f.className),
					"aria-label": f["aria-label"] || d,
					title: f.title || d,
					onClick: (e) => {
						f.onClick?.(e), e.defaultPrevented || a(e);
					},
					children: "+"
				}),
				c && /* @__PURE__ */ h("button", {
					...m,
					type: "button",
					className: W("cad-drawing-space-tabs__overflow", m.className),
					"aria-label": m["aria-label"] || p,
					title: m.title || p,
					onClick: (e) => {
						m.onClick?.(e), e.defaultPrevented || c(e);
					},
					children: "⋯"
				})
			]
		})
	});
}
var In = Fn, Ln = Fn;
function Rn({ profiles: e = [], activeId: t, onChange: n, onCreate: r, onClose: i, onRename: a, modelId: o = Q, modelName: s = "Model", className: c, ...l }) {
	let d = u(() => $(e, {
		modelId: o,
		modelName: s
	}), [
		o,
		s,
		e
	]), f = u(() => new Map(d.map((e) => [e.id, e])), [d]), p = u(() => d.map((e) => ({
		...e,
		label: e.name,
		kind: e.id === o ? "model" : "layout",
		pinned: e.id === o || e.system,
		closable: !!(i && e.id !== o && !e.system)
	})), [
		o,
		d,
		i
	]), m = (e) => f.get(e?.id) || e;
	return /* @__PURE__ */ h(Fn, {
		...l,
		className: W("cad-workspace-profile-tabs", c),
		ariaLabel: l.ariaLabel || "Workspace profiles",
		items: p,
		activeId: t,
		defaultActiveId: o,
		onChange: (e, t, r) => n?.(e, m(t), r),
		onCreate: (e) => r?.(e),
		onClose: (e, t) => i?.(e.id, m(e), t),
		onRename: (e, t) => a?.(e.id, m(e), t)
	});
}
function zn({ title: e, icon: t, actions: n, collapsible: r = !1, collapsed: i, defaultCollapsed: a = !1, onCollapsedChange: o, className: s, children: c, ...u }) {
	let d = `cad-dock-panel-body-${l()}`, [f, p] = q(i, a, (e, t) => o?.(e, t));
	return /* @__PURE__ */ g("section", {
		...u,
		className: W("cad-dock-panel", f && "cad-dock-panel--collapsed", s),
		"data-collapsed": f ? "true" : "false",
		children: [(e || t || n || r) && /* @__PURE__ */ g("header", {
			className: "cad-dock-panel__header",
			children: [/* @__PURE__ */ g("div", {
				className: "cad-dock-panel__title",
				children: [t && /* @__PURE__ */ h(t, {
					size: 13,
					"aria-hidden": "true"
				}), e && /* @__PURE__ */ h("h2", { children: e })]
			}), /* @__PURE__ */ g("div", {
				className: "cad-dock-panel__actions",
				children: [n, r && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `${f ? "Expand" : "Collapse"} ${e || "panel"}`,
					"aria-expanded": !f,
					"aria-controls": d,
					onClick: (e) => p(!f, e),
					children: f ? "▸" : "▾"
				})]
			})]
		}), /* @__PURE__ */ h("div", {
			id: d,
			className: "cad-dock-panel__body",
			hidden: f,
			children: c
		})]
	});
}
function Bn({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, label: a = "Docked panels", className: o, children: s, renderPanel: c, ...u }) {
	let d = l(), [f, p] = q(t, n || Nn(e), (e, t, n) => r?.(e, t, n)), m = G(e).find((e) => e?.id === f) || G(e).find((e) => !e?.disabled), _ = (e, t) => {
		!e || e.disabled || p(e.id, e, t);
	}, v = (t) => {
		if (!t.target.closest("[role=\"tab\"]")) return;
		let n = G(e).filter((e) => !e?.disabled);
		if (!n.length) return;
		let r = Math.max(0, n.findIndex((e) => e.id === m?.id)), i;
		t.key === "ArrowRight" && (i = n[(r + 1) % n.length]), t.key === "ArrowLeft" && (i = n[(r - 1 + n.length) % n.length]), t.key === "Home" && (i = n[0]), t.key === "End" && (i = n[n.length - 1]), i && (t.preventDefault(), _(i, t), document.getElementById(`cad-dock-tab-${d}-${i.id}`)?.focus());
	}, y = m?.panelId || `cad-dock-panel-${d}-${m?.id || "empty"}`;
	return /* @__PURE__ */ g("section", {
		...u,
		className: W("cad-dock-tabs", o),
		children: [/* @__PURE__ */ h("div", {
			className: "cad-dock-tabs__list",
			role: "tablist",
			"aria-label": a,
			onKeyDown: v,
			children: G(e).map((e, t) => {
				let n = e?.id === m?.id, r = e?.icon;
				return /* @__PURE__ */ g("div", {
					className: W("cad-dock-tabs__tab-wrap", n && "cad-dock-tabs__tab-wrap--active"),
					children: [/* @__PURE__ */ g("button", {
						id: `cad-dock-tab-${d}-${e?.id}`,
						type: "button",
						role: "tab",
						"aria-selected": n,
						"aria-controls": n ? y : e?.panelId,
						disabled: e?.disabled,
						tabIndex: n ? 0 : -1,
						onClick: (t) => _(e, t),
						children: [
							r && /* @__PURE__ */ h(r, {
								size: 12,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ h("span", { children: K(e) }),
							e?.badge && /* @__PURE__ */ h("em", { children: e.badge })
						]
					}), i && e?.closable && /* @__PURE__ */ h("button", {
						type: "button",
						className: "cad-dock-tabs__close",
						"aria-label": `Close ${K(e)}`,
						onClick: (t) => i(e, t),
						children: "×"
					})]
				}, e?.id || t);
			})
		}), /* @__PURE__ */ h("div", {
			id: y,
			className: "cad-dock-tabs__panel",
			role: "tabpanel",
			"aria-labelledby": m ? `cad-dock-tab-${d}-${m.id}` : void 0,
			children: m ? c?.(m) ?? m.content ?? m.children : s
		})]
	});
}
function Vn({ mode: e, label: t, active: n, disabled: r = !1, shortcut: i, tone: a = "inherit", onChange: o, className: s }) {
	let c = t || K(e), l = n ?? e?.active ?? !1, u = r || e?.disabled;
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: W("cad-status-toggle", s),
		"data-tone": a || e?.tone || "inherit",
		"data-active": l ? "true" : "false",
		"aria-label": c,
		"aria-pressed": l,
		disabled: u,
		title: [c, i || e?.shortcut].filter(Boolean).join(" · "),
		onClick: (t) => o?.(!l, e, t),
		children: [/* @__PURE__ */ h("span", { children: c }), (i || e?.shortcut) && /* @__PURE__ */ h("small", { children: i || e?.shortcut })]
	});
}
var Hn = (e) => e == null || e === "" ? "" : typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map((e, t) => `${"XYZ"[t] || t}: ${e}`).join("  ") : [
	"x",
	"y",
	"z"
].filter((t) => e[t] !== void 0).map((t) => `${t.toUpperCase()}: ${e[t]}`).join("  ");
function Un({ coordinates: e, coordinateLabel: t = "Coordinates", modes: n = [], onModeChange: r, units: i, scale: a, message: o, className: s, children: c, ...l }) {
	let u = Hn(e);
	return /* @__PURE__ */ g("footer", {
		...l,
		className: W("cad-status-bar", s),
		"aria-label": "CAD status bar",
		children: [
			u && /* @__PURE__ */ h("output", {
				className: "cad-status-bar__coordinates",
				"aria-label": t,
				children: u
			}),
			/* @__PURE__ */ h("div", {
				className: "cad-status-bar__modes",
				role: "group",
				"aria-label": "Drafting modes",
				children: G(n).map((e, t) => /* @__PURE__ */ h(Vn, {
					mode: e,
					onChange: (t, n, i) => {
						e?.onChange?.(t, n, i), r?.(e?.id, t, n, i);
					}
				}, e?.id || K(e) || t))
			}),
			(i || a) && /* @__PURE__ */ g("div", {
				className: "cad-status-bar__readouts",
				children: [i && /* @__PURE__ */ h("output", {
					title: "Drawing units",
					children: i
				}), a && /* @__PURE__ */ h("output", {
					title: "Annotation scale",
					children: a
				})]
			}),
			o && /* @__PURE__ */ h("output", {
				className: "cad-status-bar__message",
				children: o
			}),
			c
		]
	});
}
function Wn({ items: e = [], label: t = "Command history", onSelect: n, className: r }) {
	let i = u(() => G(e).map(Pn), [e]);
	return /* @__PURE__ */ h("ol", {
		className: W("cad-command-history", r),
		"aria-label": t,
		children: i.map((e) => /* @__PURE__ */ h("li", {
			"data-tone": e.tone || "inherit",
			children: n ? /* @__PURE__ */ g("button", {
				type: "button",
				onClick: (t) => n(e, t),
				children: [/* @__PURE__ */ h("strong", { children: e.label }), e.detail && /* @__PURE__ */ h("small", { children: e.detail })]
			}) : /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: e.label }), e.detail && /* @__PURE__ */ h("small", { children: e.detail })] })
		}, e.id))
	});
}
function Gn({ options: e = [], label: t = "Command options", onSelect: n, className: r }) {
	return /* @__PURE__ */ h("div", {
		className: W("cad-command-options", r),
		role: "group",
		"aria-label": t,
		children: G(e).map((e, t) => {
			let r = typeof e == "string" ? {
				id: e,
				label: e
			} : e;
			return /* @__PURE__ */ g("button", {
				type: "button",
				disabled: r?.disabled,
				"data-active": r?.active ? "true" : "false",
				onClick: (e) => {
					r?.onClick?.(r, e), n?.(r, e);
				},
				children: [K(r), r?.shortcut && /* @__PURE__ */ h("kbd", { children: r.shortcut })]
			}, r?.id || t);
		})
	});
}
function Kn({ value: e, defaultValue: t = "", onChange: n, onSubmit: r, prompt: i = "Command:", history: a = [], suggestions: o = [], options: s = [], onSuggestionSelect: c, onOptionSelect: d, clearOnSubmit: f = !0, submitSuggestionOnEnter: m = !1, disabled: _ = !1, placeholder: v = "Type a command or search", showHistory: y = !0, className: b, inputProps: x = {}, ...S }) {
	let C = l(), [w, T] = q(e, t, (e, t) => n?.(e, t)), [E, D] = p(!1), [O, k] = p(-1), A = u(() => G(o).map(Pn), [o]), j = `cad-command-suggestions-${C}`, M = (e, t, n = !1) => {
		e && (T(e.label, t), c?.(e, t), n && (r?.(e.label, t), f && T("", t)), k(-1));
	}, N = (e) => {
		if (e.preventDefault(), O >= 0 && A[O]) {
			M(A[O], e, m);
			return;
		}
		let t = String(w ?? "").trim();
		t && (r?.(t, e), f && T("", e));
	}, P = E && A.length > 0;
	return /* @__PURE__ */ g("section", {
		...S,
		className: W("cad-command-line", b),
		"aria-label": "CAD command line",
		children: [
			/* @__PURE__ */ g("form", {
				className: "cad-command-line__form",
				onSubmit: N,
				children: [
					/* @__PURE__ */ h("label", {
						htmlFor: `cad-command-input-${C}`,
						className: "cad-command-line__prompt",
						children: i
					}),
					/* @__PURE__ */ h("input", {
						...x,
						id: `cad-command-input-${C}`,
						className: "cad-command-line__input",
						value: w ?? "",
						disabled: _,
						placeholder: v,
						autoComplete: "off",
						role: "combobox",
						"aria-autocomplete": A.length ? "list" : void 0,
						"aria-expanded": P,
						"aria-controls": j,
						"aria-activedescendant": P && O >= 0 ? `${j}-${O}` : void 0,
						onFocus: (e) => {
							D(!0), x.onFocus?.(e);
						},
						onBlur: (e) => {
							D(!1), k(-1), x.onBlur?.(e);
						},
						onChange: (e) => {
							T(e.target.value, e), k(-1), x.onChange?.(e);
						},
						onKeyDown: (e) => {
							e.key === "ArrowDown" && A.length && (e.preventDefault(), k((e) => (e + 1) % A.length)), e.key === "ArrowUp" && A.length && (e.preventDefault(), k((e) => (e - 1 + A.length) % A.length)), e.key === "Escape" && (k(-1), D(!1), e.currentTarget.blur()), x.onKeyDown?.(e);
						}
					}),
					/* @__PURE__ */ h("button", {
						type: "submit",
						className: "cad-command-line__submit",
						disabled: _,
						"aria-label": "Run command",
						children: "↵"
					})
				]
			}),
			P && /* @__PURE__ */ h("div", {
				id: j,
				className: "cad-command-line__suggestions",
				role: "listbox",
				"aria-label": "Command suggestions",
				children: A.map((e, t) => /* @__PURE__ */ g("button", {
					id: `${j}-${t}`,
					type: "button",
					role: "option",
					"aria-selected": O === t,
					"data-active": O === t ? "true" : "false",
					onMouseDown: (e) => e.preventDefault(),
					onClick: (t) => M(e, t),
					children: [/* @__PURE__ */ h("strong", { children: e.label }), e.detail && /* @__PURE__ */ h("small", { children: e.detail })]
				}, e.id))
			}),
			s.length > 0 && /* @__PURE__ */ h(Gn, {
				options: s,
				onSelect: d
			}),
			y && a.length > 0 && /* @__PURE__ */ h(Wn, {
				items: a,
				onSelect: (e, t) => T(e.label, t)
			})
		]
	});
}
function qn({ activeView: e = "top", onViewChange: t, className: n, label: r = "View cube" }) {
	return /* @__PURE__ */ g("div", {
		className: W("cad-view-cube", n),
		role: "group",
		"aria-label": r,
		"data-view": e,
		children: [[
			"top",
			"front",
			"right"
		].map((n) => /* @__PURE__ */ h("button", {
			type: "button",
			"data-active": e === n ? "true" : "false",
			"aria-pressed": e === n,
			"aria-label": `${n} view`,
			onClick: (e) => t?.(n, e),
			children: n.slice(0, 1).toUpperCase()
		}, n)), /* @__PURE__ */ h("span", {
			className: "cad-view-cube__axis",
			"aria-hidden": "true"
		})]
	});
}
function Jn({ xLabel: e = "X", yLabel: t = "Y", zLabel: n = "Z", className: r, label: i = "UCS orientation" }) {
	return /* @__PURE__ */ g("svg", {
		className: W("cad-ucs-indicator", r),
		viewBox: "0 0 56 56",
		role: "img",
		"aria-label": i,
		children: [
			/* @__PURE__ */ h("circle", {
				cx: "15",
				cy: "41",
				r: "2.8"
			}),
			/* @__PURE__ */ h("path", { d: "M15 41H45M15 41V11M15 41l17-17" }),
			/* @__PURE__ */ h("text", {
				x: "47",
				y: "44",
				children: e
			}),
			/* @__PURE__ */ h("text", {
				x: "11",
				y: "9",
				children: t
			}),
			/* @__PURE__ */ h("text", {
				x: "34",
				y: "23",
				children: n
			})
		]
	});
}
function Yn({ activeView: e, onViewChange: t, onZoomIn: n, onZoomOut: r, onZoomExtents: i, showCube: a = !0, showUcs: o = !0, className: s }) {
	return /* @__PURE__ */ g("aside", {
		className: W("cad-viewport-controls", s),
		"aria-label": "Viewport controls",
		children: [
			a && /* @__PURE__ */ h(qn, {
				activeView: e,
				onViewChange: t
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-viewport-controls__zoom",
				role: "group",
				"aria-label": "Zoom controls",
				children: [
					/* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": "Zoom in",
						onClick: n,
						children: "+"
					}),
					/* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": "Zoom out",
						onClick: r,
						children: "−"
					}),
					/* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": "Zoom extents",
						onClick: i,
						children: "⌗"
					})
				]
			}),
			o && /* @__PURE__ */ h(Jn, {})
		]
	});
}
function Xn({ count: e = 0, entityLabel: t = "objects", fields: n = [], emptyLabel: r = "Nothing selected", className: i }) {
	return /* @__PURE__ */ g("output", {
		className: W("cad-selection-summary", i),
		"aria-live": "polite",
		children: [/* @__PURE__ */ h("strong", { children: e ? `${e} ${t}` : r }), G(n).length > 0 && /* @__PURE__ */ h("span", { children: G(n).map((e, t) => /* @__PURE__ */ g("small", { children: [
			e?.label,
			": ",
			/* @__PURE__ */ h("b", { children: e?.value })
		] }, e?.id || t)) })]
	});
}
function Zn({ distance: e, angle: t, area: n, volume: r, className: i, label: a = "Measurement" }) {
	let o = [
		{
			id: "distance",
			label: "D",
			value: e
		},
		{
			id: "angle",
			label: "A",
			value: t
		},
		{
			id: "area",
			label: "Area",
			value: n
		},
		{
			id: "volume",
			label: "Vol",
			value: r
		}
	].filter((e) => e.value !== void 0 && e.value !== null && e.value !== "");
	return o.length ? /* @__PURE__ */ h("output", {
		className: W("cad-measure-readout", i),
		"aria-label": a,
		children: o.map((e) => /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("small", { children: e.label }), /* @__PURE__ */ h("b", { children: e.value })] }, e.id))
	}) : null;
}
//#endregion
export { F as CAD_CUI_RUNTIME_VERSION, Q as CAD_WORKSPACE_MODEL_ID, E as CadActionButton, Re as CadAngleInput, Et as CadAnnotationScalePicker, sn as CadBlockInsertOptions, on as CadBlockPalette, an as CadBlockTile, en as CadColorPicker, tn as CadColorPickerButton, Be as CadColorSwatch, Wn as CadCommandHistory, Kn as CadCommandLine, Gn as CadCommandOptions, Wt as CadCommandPrompt, Rt as CadConfirmDialog, Tt as CadConstraintBar, ze as CadCoordinateInput, De as CadCuiCommandPalette, Ee as CadCuiContextMenu, Oe as CadCuiCustomizer, be as CadCuiProvider, Te as CadCuiQuickAccess, we as CadCuiRibbon, Sn as CadDataGrid, O as CadDataRow, Lt as CadDialog, zn as CadDockPanel, Bn as CadDockTabs, Ln as CadDocumentTabs, Fn as CadDrawingSpaceTabs, St as CadDynamicInput, j as CadEmptyState, cn as CadFilterBar, wt as CadGripToolbar, D as CadIconButton, hn as CadLayerPanel, pn as CadLayerPicker, mn as CadLayerRow, In as CadLayoutTabs, nn as CadLinetypePicker, Ve as CadLinetypePreview, rn as CadLineweightPicker, He as CadLineweightPreview, Zn as CadMeasureReadout, Ge as CadMenu, $t as CadMenuBar, We as CadMenuItem, Ue as CadMenuSeparator, ft as CadNavigationBar, Ie as CadNumericInput, kt as CadObjectSnapMarker, Ct as CadObjectSnapMenu, _n as CadObjectTree, Ke as CadOverflowMenu, A as CadPanelFooter, C as CadPanelHeader, w as CadPanelSection, S as CadPanelShell, Ot as CadPolarTracker, Vt as CadPopover, ln as CadPropertyField, fn as CadPropertyGrid, un as CadPropertyRow, dn as CadPropertySection, Tn as CadQuickProperties, yn as CadReferenceList, T as CadSegmentTabs, wn as CadSelectionCycler, Cn as CadSelectionFilter, At as CadSelectionGrip, ht as CadSelectionSetPanel, Xn as CadSelectionSummary, Y as CadShortcutHint, Ut as CadShortcutReference, Me as CadSplitButton, Xt as CadSplitPane, k as CadStatGrid, Un as CadStatusBar, Vn as CadStatusToggle, Qt as CadSubmenu, vn as CadTaskProgress, zt as CadToast, Bt as CadToastStack, je as CadToggleButton, Ae as CadToolButton, Fe as CadToolPalette, Pe as CadToolbar, Ne as CadToolbarGroup, Ht as CadTooltip, Jn as CadUcsIndicator, Le as CadUnitInput, qn as CadViewCube, Dt as CadViewPresetPicker, Yn as CadViewportControls, mt as CadViewportScalePicker, pt as CadVisualStylePicker, Rn as CadWorkspaceProfileTabs, at as CadWorkspaceRibbon, ce as DEFAULT_CAD_CUI_SYSTEM, An as createCadWorkspaceProfile, se as defineCadCuiSystem, tt as groupCadWorkspaceRibbonCommands, he as loadCadCuiState, kn as nextCadWorkspaceLayoutName, $ as normalizeCadWorkspaceProfiles, Mn as removeCadWorkspaceProfile, jn as renameCadWorkspaceProfile, fe as resolveCadCuiCommand, pe as resolveCadCuiCommandState, H as sanitizeCadCuiState, ge as saveCadCuiState, ve as selectCadCuiCommandGroups, _e as selectCadCuiCommands, U as useCadCui, xe as useCadCuiCommand };
