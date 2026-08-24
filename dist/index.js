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
function ee({ icon: e, title: t = "NO DATA TO DISPLAY", children: n, className: r }) {
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
var j = Object.freeze([]), M = Object.freeze({}), te = n(null), N = 1, P = (e) => String(e ?? "").trim(), F = (e) => [...new Set((Array.isArray(e) ? e : j).map(P).filter(Boolean))], I = (e) => ({
	id: P(e?.id),
	label: P(e?.label) || P(e?.id),
	detail: P(e?.detail),
	color: P(e?.color)
}), L = (e) => Object.freeze({ ...e && typeof e == "object" ? e : M }), R = (e, t) => !!(e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, t)), z = (e) => e ?? "", B = (e) => Object.freeze({
	surface: P(e?.surface),
	tab: P(e?.tab),
	menu: P(e?.menu),
	group: P(e?.group),
	groupId: P(e?.groupId),
	control: P(e?.control),
	label: P(e?.label),
	detail: P(e?.detail),
	icon: P(e?.icon),
	tone: P(e?.tone),
	badge: z(e?.badge),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), V = (e) => ({
	id: P(e?.id),
	label: P(e?.label) || P(e?.id),
	detail: P(e?.detail || e?.description),
	icon: P(e?.icon),
	tone: P(e?.tone) || "cyan",
	surface: P(e?.surface),
	tab: P(e?.tab),
	menu: P(e?.menu),
	control: P(e?.control),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), ne = (e) => !e || typeof e != "object" || Object.isFrozen(e) ? e : (Object.freeze(e), Object.values(e).forEach(ne), e), H = (e, t) => Array.isArray(e) ? e.includes(t) : !!e?.[t], U = (e) => e instanceof HTMLElement && !!e.closest("input, textarea, select, [contenteditable=\"true\"]"), re = (e) => {
	let t = P(e.key).toUpperCase();
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
}, ie = (e) => P(e).toUpperCase().replace(/CMD|COMMAND/g, "CTRL").replace(/\s+/g, "");
function W(e = M) {
	let t = (Array.isArray(e.commands) ? e.commands : j).map((e) => ({
		id: P(e?.id),
		label: P(e?.label),
		detail: P(e?.detail || e?.description),
		icon: P(e?.icon),
		tone: P(e?.tone) || "cyan",
		toolId: P(e?.toolId),
		shortcut: P(e?.shortcut),
		requires: F(e?.requires),
		customizable: e?.customizable !== !1,
		alwaysVisible: !!e?.alwaysVisible,
		disabled: !!e?.disabled,
		active: !!e?.active,
		badge: z(e?.badge),
		intent: L(e?.intent),
		placements: (Array.isArray(e?.placements) ? e.placements : j).map(B)
	})).filter((e) => e.id && e.label), n = new Set(t.map((e) => e.id)), r = (Array.isArray(e.tabs) ? e.tabs : j).map((e) => ({
		id: P(e?.id),
		label: P(e?.label) || P(e?.id),
		color: P(e?.color) || "#00fbfb",
		tone: P(e?.tone) || "cyan"
	})).filter((e) => e.id), i = /* @__PURE__ */ new Set(), a = (Array.isArray(e.groups) ? e.groups : j).map(V).filter((e) => !e.id || i.has(e.id) ? !1 : (i.add(e.id), !0)), o = e.calibration && typeof e.calibration == "object" ? e.calibration : M, s = (Array.isArray(o.accentModes) ? o.accentModes : j).map(I).filter((e) => e.id), c = (Array.isArray(o.densities) ? o.densities : j).map(I).filter((e) => e.id), l = (Array.isArray(o.details) ? o.details : j).map(I).filter((e) => e.id), u = (Array.isArray(e.panels) ? e.panels : j).map((e) => ({
		...e,
		id: P(e?.id),
		title: P(e?.title) || P(e?.id)
	})).filter((e) => e.id), d = e.defaults && typeof e.defaults == "object" ? e.defaults : M, f = {
		version: Number(e.version) || 1,
		activeTab: r.some((e) => e.id === d.activeTab) ? d.activeTab : r[0]?.id || "",
		hiddenCommandIds: F(d.hiddenCommandIds).filter((e) => n.has(e)),
		accentMode: s.some((e) => e.id === d.accentMode) ? d.accentMode : s[0]?.id || "",
		density: c.some((e) => e.id === d.density) ? d.density : c[0]?.id || "",
		detail: l.some((e) => e.id === d.detail) ? d.detail : l[0]?.id || "",
		quickAccessIds: F(d.quickAccessIds).filter((e) => n.has(e)),
		recentCommandIds: j,
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
	return ne({
		id: P(e.id) || "cad-cui",
		version: Number(e.version) || 1,
		storageKey: P(e.storageKey) || "cad-cui-preferences:v1",
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
var G = W({ id: "cad-cui-default" }), K = (e) => new Map(e.commands.map((e) => [e.id, e])), ae = (e, t) => e.some((e) => e.id === t), q = (e, t) => {
	let n = typeof e == "function" ? e(t) : e instanceof Map ? e.get(t?.id) : e?.[t?.id];
	return n && typeof n == "object" ? n : M;
};
function oe(e, { state: t = M, capabilities: n = M, commandStates: r = M, placement: i = e?.placement } = M) {
	if (!e) return null;
	let a = q(r, e), o = new Set(t?.hiddenCommandIds || j), s = Array.isArray(e.requires) ? e.requires : j, c = (e.alwaysVisible || !o.has(e.id)) && s.every((e) => H(n, e)) && a.visible !== !1, l = !!(e.disabled || a.disabled || a.enabled === !1), u = R(a, "active") ? !!a.active : !!e.active, d = R(a, "badge") ? z(a.badge) : R(i, "badge") && i.badge !== "" ? i.badge : e.badge;
	return {
		...e,
		placement: i,
		visible: c,
		disabled: l,
		active: u,
		badge: d
	};
}
var se = oe, ce = (e, t) => ({
	...e,
	label: t.label || e.label,
	detail: t.detail || e.detail,
	icon: t.icon || e.icon,
	tone: t.tone || e.tone,
	placement: t
});
function le(e, t) {
	let n = t && typeof t == "object" ? t : M, r = K(e), i = Array.isArray(n.hiddenToolIds) ? e.commands.filter((e) => n.hiddenToolIds.includes(e.toolId)).map((e) => e.id) : j, a = F(n.hiddenCommandIds || i).filter((e) => r.has(e) && !r.get(e).alwaysVisible);
	return {
		version: e.version,
		activeTab: e.tabs.some((e) => e.id === n.activeTab) ? n.activeTab : e.defaultState.activeTab,
		hiddenCommandIds: a,
		accentMode: ae(e.calibration.accentModes, n.accentMode) ? n.accentMode : e.defaultState.accentMode,
		density: ae(e.calibration.densities, n.density) ? n.density : e.defaultState.density,
		detail: ae(e.calibration.details, n.detail) ? n.detail : e.defaultState.detail,
		quickAccessIds: F(n.quickAccessIds || e.defaultState.quickAccessIds).filter((e) => r.has(e)),
		recentCommandIds: F(n.recentCommandIds).filter((e) => r.has(e)).slice(0, 8),
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
}
function ue(e, t = typeof window > "u" ? null : window.localStorage) {
	if (!t) return le(e, e.defaultState);
	try {
		let n = t.getItem(e.storageKey);
		if (!n) return le(e, e.defaultState);
		let r = JSON.parse(n);
		return le(e, r?.preferences || r);
	} catch {
		return le(e, e.defaultState);
	}
}
function de(e, t, n = typeof window > "u" ? null : window.localStorage) {
	if (!n) return !1;
	try {
		let r = le(e, t);
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
function fe(e, t, { surface: n = "palette", tabId: r = "", menuId: i = "", groupId: a = "", capabilities: o = M, commandStates: s = M } = M) {
	let c = new Set(t?.hiddenCommandIds || j);
	return e.commands.flatMap((e) => {
		if (c.has(e.id) && !e.alwaysVisible || e.requires.some((e) => !H(o, e))) return j;
		let l = n === "palette" ? {
			surface: "palette",
			order: 0
		} : e.placements.find((e) => e.surface === n && (!r || e.tab === r) && (!i || e.menu === i) && (!a || e.groupId === a));
		if (!l) return j;
		let u = oe(ce(e, l), {
			state: t,
			capabilities: o,
			commandStates: s,
			placement: l
		});
		return u?.visible ? [u] : j;
	}).sort((e, t) => e.placement.order - t.placement.order || e.label.localeCompare(t.label, "hu"));
}
function pe(e, t, { surface: n = "ribbon", tabId: r = "", menuId: i = "", capabilities: a = M, commandStates: o = M } = M) {
	let s = (Array.isArray(e?.groups) ? e.groups : j).filter((e) => (!e.surface || e.surface === n) && (!r || !e.tab || e.tab === r) && (!i || !e.menu || e.menu === i)).sort((e, t) => e.order - t.order || e.label.localeCompare(t.label, "hu"));
	if (!s.length) return j;
	let c = fe(e, t, {
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
var me = (e) => (t, n) => {
	switch (n.type) {
		case "tab.select": return le(e, {
			...t,
			activeTab: n.tabId
		});
		case "command.visibility": {
			let r = e.commands.find((e) => e.id === n.commandId);
			if (!r || r.alwaysVisible) return t;
			let i = t.hiddenCommandIds.includes(n.commandId) ? t.hiddenCommandIds.filter((e) => e !== n.commandId) : [...t.hiddenCommandIds, n.commandId];
			return le(e, {
				...t,
				hiddenCommandIds: i
			});
		}
		case "preference.set": return le(e, {
			...t,
			[n.key]: n.value
		});
		case "preferences.reset": return le(e, e.defaultState);
		case "command.completed": return {
			...t,
			recentCommandIds: F([n.commandId, ...t.recentCommandIds]).slice(0, 8),
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
				error: P(n.error) || "COMMAND_FAILED"
			}
		};
		default: return t;
	}
};
function he({ registry: e = G, capabilities: t = M, commandStates: n = M, handlers: r = M, onCommand: i, children: o }) {
	let s = v(), l = _(), [f, p] = d(me(e), e, (e) => ue(e)), m = u(() => K(e), [e]);
	c(() => {
		de(e, f);
	}, [e, f]);
	let g = a((e, r) => oe(e, {
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
	}, [g]), b = a((r = M) => fe(e, f, {
		...r,
		capabilities: t,
		commandStates: n
	}), [
		t,
		n,
		e,
		f
	]), x = a((r = M) => pe(e, f, {
		...r,
		capabilities: t,
		commandStates: n
	}), [
		t,
		n,
		e,
		f
	]), S = a(async (e, { source: t = "api", payload: n = M } = M) => {
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
			...n && typeof n == "object" ? n : M
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
			if (t.defaultPrevented || U(t.target)) return;
			let n = re(t), r = e.commands.find((e) => ie(e.shortcut) === n && y(e));
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
	return /* @__PURE__ */ h(te.Provider, {
		value: C,
		children: o
	});
}
function ge() {
	let e = o(te);
	if (!e) throw Error("useCadCui must be used below CadCuiProvider.");
	return e;
}
function _e(e, t = "api") {
	let { executeCommand: n } = ge();
	return a((r) => n(e, {
		source: t,
		payload: r
	}), [
		e,
		n,
		t
	]);
}
var ve = (e, t) => e?.[t] || null;
function ye({ command: e, iconMap: t, source: n, role: r, badge: i, className: a }) {
	let { executeCommand: o } = ge(), s = ve(t, e.icon), c = e.placement?.control || "button", l = [
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
function be({ iconMap: e = M, className: t, title: n = "PARANCS SZALAG", description: r = "Deklaratív CUI-regiszterből épített munkatéri parancsok", renderBadge: i, ...a }) {
	let { registry: o, state: s, selectCommands: c, selectCommandGroups: l, setActiveTab: u } = ge(), d = o.tabs.find((e) => e.id === s.activeTab) || o.tabs[0], f = c({
		surface: "ribbon",
		tabId: d?.id
	}), p = o.groups?.length ? l({
		surface: "ribbon",
		tabId: d?.id
	}) : j, m = p.length > 0;
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
						children: t.commands.map((t) => /* @__PURE__ */ h(ye, {
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
				children: f.map((t) => /* @__PURE__ */ h(ye, {
					command: t,
					iconMap: e,
					source: "ribbon",
					badge: i?.(t) ?? t.label
				}, t.id))
			})]
		})]
	});
}
function xe({ iconMap: e = M, commandIds: t, className: n, ...r }) {
	let { registry: i, state: a, resolveCommand: o } = ge(), s = (Array.isArray(t) ? t : a.quickAccessIds).map((e) => i.commands.find((t) => t.id === e)).filter(Boolean).map((e) => {
		let t = e.placements.find((e) => e.surface === "quick-access");
		return o(t ? ce(e, t) : e, t);
	}).filter((e) => e?.visible);
	return /* @__PURE__ */ h("div", {
		...r,
		className: ["cad-cui-quick-access", n].filter(Boolean).join(" "),
		"data-testid": r["data-testid"] || "cad-cui-quick-access",
		role: "toolbar",
		"aria-label": "Gyors elérés",
		children: s.map((t) => /* @__PURE__ */ h(ye, {
			command: t,
			iconMap: e,
			source: "quick-access"
		}, t.id))
	});
}
function Se({ menuId: e = "canvas", iconMap: t = M, className: n, onClose: r, ...i }) {
	let { selectCommands: a } = ge(), o = a({
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
				children: [o.map((e) => /* @__PURE__ */ h(ye, {
					command: e,
					iconMap: t,
					source: "context",
					role: "menuitem"
				}, e.id)), !o.length && /* @__PURE__ */ h(ee, {
					title: "NINCS ELÉRHETŐ PARANCS",
					children: "A jogosultság vagy a profil jelenleg elrejti ezt a menüt."
				})]
			})
		})]
	});
}
function Ce({ iconMap: e = M, className: t, ...n }) {
	let { selectCommands: r, state: i } = ge(), [a, o] = p(""), c = s(a), l = u(() => {
		let e = P(c).toLocaleLowerCase("hu");
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
						children: [l.map((t) => /* @__PURE__ */ h(ye, {
							command: t,
							iconMap: e,
							source: "palette"
						}, t.id)), !l.length && /* @__PURE__ */ h(ee, {
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
function we({ className: e, ...t }) {
	let { registry: n, state: r, setPreference: i, toggleCommandVisibility: a, resetPreferences: o } = ge(), s = new Set(r.hiddenCommandIds);
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
var J = (...e) => e.filter(Boolean).join(" "), Y = (e) => Array.isArray(e) ? e : [], X = (e) => String(typeof e == "string" || typeof e == "number" ? e : e?.label ?? e?.name ?? e?.id ?? "");
function Z(e, t, n) {
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
var Te = (e, t, n) => Number.isFinite(e) ? Number.isFinite(t) && e < t ? t : Number.isFinite(n) && e > n ? n : e : e, Ee = (e, t, n) => {
	e?.disabled || (e?.onClick?.(e, t), n?.(e, t));
};
function De({ shortcut: e, className: t }) {
	return e ? /* @__PURE__ */ h("kbd", {
		className: J("cad-shortcut-hint", t),
		children: e
	}) : null;
}
function Oe({ icon: e, label: t, shortcut: n, active: r = !1, toggle: i = !1, tone: a = "inherit", badge: o, compact: s = !1, className: c, children: l, title: u, type: d = "button", ...f }) {
	let p = t || (typeof l == "string" ? l : "CAD tool");
	return /* @__PURE__ */ g("button", {
		...f,
		type: d,
		"data-tone": a,
		"data-active": r ? "true" : "false",
		"aria-pressed": i ? r : void 0,
		"aria-label": f["aria-label"] || p,
		title: u || [p, n].filter(Boolean).join(" · "),
		className: J("cad-tool-button", s && "cad-tool-button--compact", c),
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
			n && /* @__PURE__ */ h(De, { shortcut: n })
		]
	});
}
function ke({ active: e = !1, onChange: t, onClick: n, ...r }) {
	return /* @__PURE__ */ h(Oe, {
		...r,
		active: e,
		toggle: !0,
		onClick: (r) => {
			t?.(!e, r), n?.(r);
		}
	});
}
function Ae({ icon: e, label: t, shortcut: n, tone: r = "inherit", disabled: i = !1, menu: a, menuId: o, menuOpen: s, defaultMenuOpen: u = !1, onMenuOpenChange: d, onClick: p, className: m, children: _, ...v }) {
	let y = l(), b = o || `cad-split-menu-${y}`, x = f(null), S = f(null), [C, w] = Z(s, u, (e, t) => d?.(e, t));
	c(() => {
		if (!C) return;
		let e = window.setTimeout(() => S.current?.querySelector("[role=\"menuitem\"]:not(:disabled), button:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [C]);
	let T = (e) => {
		w(!1, e), window.setTimeout(() => x.current?.focus(), 0);
	};
	return /* @__PURE__ */ g("span", {
		className: J("cad-split-button", m),
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
					n && /* @__PURE__ */ h(De, { shortcut: n })
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
function je({ label: e, items: t = [], onAction: n, className: r, children: i }) {
	return /* @__PURE__ */ g("section", {
		className: J("cad-toolbar-group", r),
		"aria-label": e,
		children: [/* @__PURE__ */ g("div", {
			className: "cad-toolbar-group__tools",
			children: [Y(t).map((e, t) => {
				if (e?.type === "separator") return /* @__PURE__ */ h("span", {
					className: "cad-toolbar-group__separator",
					role: "separator",
					"aria-orientation": "vertical"
				}, e.id || `separator-${t}`);
				let r = e.id || `${X(e)}-${t}`, i = {
					icon: e.icon,
					label: X(e),
					shortcut: e.shortcut,
					tone: e.tone,
					disabled: e.disabled,
					active: e.active,
					badge: e.badge,
					title: e.title || e.detail,
					className: e.className
				}, a = (t) => Ee(e, t, n);
				return e?.type === "split" ? /* @__PURE__ */ h(Ae, {
					...i,
					menu: e.menu,
					menuOpen: e.menuOpen,
					onMenuOpenChange: (t, n) => e.onMenuOpenChange?.(t, e, n),
					onClick: a
				}, r) : e?.toggle ? /* @__PURE__ */ h(ke, {
					...i,
					onChange: (t, r) => {
						e.onChange?.(t, e, r), n?.({
							...e,
							active: t
						}, r);
					}
				}, r) : /* @__PURE__ */ h(Oe, {
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
function Me({ groups: e, items: t, label: n = "CAD tools", orientation: r = "horizontal", onAction: i, className: a, children: o, ...s }) {
	let c = Y(e).length ? Y(e) : [{
		id: "default",
		items: Y(t)
	}];
	return /* @__PURE__ */ g("div", {
		...s,
		className: J("cad-toolbar", `cad-toolbar--${r}`, a),
		role: "toolbar",
		"aria-label": n,
		"aria-orientation": r,
		children: [c.map((e, t) => /* @__PURE__ */ h(je, {
			label: e.label,
			items: e.items,
			onAction: i
		}, e.id || e.label || t)), o]
	});
}
function Ne({ groups: e, items: t, label: n = "CAD tool palette", className: r, ...i }) {
	return /* @__PURE__ */ h(Me, {
		...i,
		groups: e,
		items: t,
		label: n,
		orientation: "vertical",
		className: J("cad-tool-palette", r)
	});
}
function Pe({ id: e, label: t, value: n, defaultValue: r = "", onValueChange: i, onChange: a, min: o, max: s, step: c = 1, unit: u, prefix: d, suffix: f, asNumber: p = !0, disabled: m = !1, readOnly: _ = !1, showSteppers: v = !0, className: y, inputClassName: b, ...x }) {
	let S = l(), C = e || `cad-number-${S}`, [w, T] = Z(n, r, (e, t) => {
		i?.(e, t), a?.(e, t);
	}), E = (e, t) => {
		let n = p && e !== "" ? Number(e) : e;
		T(n, t);
	}, D = (e, t) => {
		let n = Number(w), r = Number(c) || 1, i = Te((Number.isFinite(n) ? n : 0) + e * r, Number(o), Number(s));
		E(i, t);
	};
	return /* @__PURE__ */ g("div", {
		className: J("cad-numeric-input", m && "cad-numeric-input--disabled", y),
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
					className: J("cad-numeric-input__field", b),
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
function Fe({ unit: e = "mm", ...t }) {
	return /* @__PURE__ */ h(Pe, {
		...t,
		unit: e
	});
}
function Ie({ unit: e = "°", ...t }) {
	return /* @__PURE__ */ h(Pe, {
		...t,
		unit: e
	});
}
function Le({ value: e, defaultValue: t = {
	x: "",
	y: "",
	z: ""
}, onValueChange: n, onChange: i, axes: a = [
	"X",
	"Y",
	"Z"
], unit: o = "mm", label: s = "Coordinates", className: c, ...l }) {
	let [u, d] = Z(e, t, (e, t, r) => {
		n?.(e, t, r), i?.(e, t, r);
	});
	return /* @__PURE__ */ g("fieldset", {
		className: J("cad-coordinate-input", c),
		children: [s && /* @__PURE__ */ h("legend", { children: s }), /* @__PURE__ */ h("div", {
			className: "cad-coordinate-input__axes",
			children: Y(a).map((e) => {
				let t = String(e).toLowerCase();
				return /* @__PURE__ */ r(Fe, {
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
function Re({ color: e = "#ffffff", label: t, size: n = "regular", onClick: r, className: i, style: a, ...o }) {
	let s = /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("span", {
		className: "cad-color-swatch__chip",
		style: { "--cad-swatch-color": e },
		"aria-hidden": "true"
	}), t && /* @__PURE__ */ h("span", {
		className: "cad-color-swatch__label",
		children: t
	})] }), c = {
		...o,
		className: J("cad-color-swatch", `cad-color-swatch--${n}`, i),
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
function ze({ type: e = "continuous", color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ g("span", {
		className: J("cad-linetype-preview", r),
		"data-type": e,
		style: { "--cad-line-color": t },
		title: n || e,
		"aria-label": n || e,
		children: [/* @__PURE__ */ h("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ h("small", { children: n })]
	});
}
function Be({ weight: e = .25, color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ g("span", {
		className: J("cad-lineweight-preview", r),
		style: {
			"--cad-line-color": t,
			"--cad-line-weight": `${Math.max(1, Number(e) * 4)}px`
		},
		title: n || `${e} mm`,
		"aria-label": n || `${e} mm`,
		children: [/* @__PURE__ */ h("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ h("small", { children: n })]
	});
}
function Ve({ className: e }) {
	return /* @__PURE__ */ h("div", {
		className: J("cad-menu__separator", e),
		role: "separator"
	});
}
function He({ item: e, label: t, detail: n, shortcut: r, icon: i, checked: a, disabled: o = !1, type: s = "action", tone: c = "inherit", onClick: l, className: u }) {
	let d = t || X(e), f = a ?? e?.checked, p = o || e?.disabled, m = s === "checkbox" ? "menuitemcheckbox" : s === "radio" ? "menuitemradio" : "menuitem";
	return /* @__PURE__ */ g("button", {
		type: "button",
		role: m,
		disabled: p,
		"data-tone": c || e?.tone || "inherit",
		"aria-checked": m === "menuitem" ? void 0 : !!f,
		className: J("cad-menu__item", f && "cad-menu__item--checked", u),
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
			r && /* @__PURE__ */ h(De, { shortcut: r })
		]
	});
}
function Ue({ items: e = [], label: t = "CAD menu", onAction: n, onClose: r, className: i, children: a, menuRef: o, ...s }) {
	let c = f(null), l = o || c, u = (e) => {
		let t = [...l.current?.querySelectorAll("[role^=\"menuitem\"]") || []].filter((e) => !e.disabled);
		t.length && t[(t.indexOf(document.activeElement) + e + t.length) % t.length].focus();
	};
	return /* @__PURE__ */ g("div", {
		...s,
		ref: l,
		className: J("cad-menu", i),
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
		children: [Y(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ h(Ve, {}, e.id || `separator-${t}`) : /* @__PURE__ */ h(He, {
			item: e,
			label: X(e),
			detail: e.detail,
			shortcut: e.shortcut,
			icon: e.icon,
			checked: e.checked,
			disabled: e.disabled,
			type: e.type,
			tone: e.tone,
			onClick: (e, t) => Ee(e, t, n)
		}, e.id || `${X(e)}-${t}`)), a]
	});
}
function We({ items: e = [], label: t = "More options", open: n, defaultOpen: r = !1, onOpenChange: i, onAction: a, className: o, triggerLabel: s = "More", ...u }) {
	let [d, p] = Z(n, r, (e, t) => i?.(e, t)), m = `cad-overflow-menu-${l()}`, _ = f(null), v = f(null);
	c(() => {
		if (!d) return;
		let e = window.setTimeout(() => v.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [d]);
	let y = (e) => {
		p(!1, e), window.setTimeout(() => _.current?.focus(), 0);
	};
	return /* @__PURE__ */ g("span", {
		className: J("cad-overflow-menu", o),
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
		}), d && /* @__PURE__ */ h(Ue, {
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
var Ge = (e) => String(e ?? "").trim(), Ke = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, qe = (e) => Ge(e?.tabId || e?.tab || e?.placement?.tab), Je = (e, t) => Ge(e?.groupId || e?.group || e?.placement?.groupId || e?.placement?.group) || t, Ye = (e, t) => Ge(e?.groupLabel || e?.placement?.groupLabel || e?.placement?.group) || t, Xe = (e, t) => Ke(e?.order ?? e?.placement?.order, t), Ze = (e) => Ge(e?.tabId || e?.tab || e?.placement?.tab), Qe = (e) => Y(e?.commands).length ? Y(e.commands) : Y(e?.items), $e = (e) => Ge(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace";
function et(e = [], { tabId: t = "", defaultGroupId: n = "commands", defaultGroupLabel: r = "COMMANDS" } = {}) {
	let i = /* @__PURE__ */ new Map();
	return Y(e).forEach((e, a) => {
		if (!e || typeof e != "object") return;
		let o = qe(e);
		if (t && o && o !== t) return;
		let s = Je(e, n), c = Ye(e, r), l = Xe(e, a), u = i.get(s);
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
var tt = ({ groups: e, commands: t, activeTabId: n, defaultGroupId: r, defaultGroupLabel: i }) => {
	let a = Y(e).filter((e) => e && typeof e == "object" && (!n || !Ze(e) || Ze(e) === n)).map((e, t) => ({
		id: Ge(e.id) || `group-${t + 1}`,
		label: Ge(e.label) || i,
		order: Ke(e.order, t),
		commands: Qe(e).filter((e) => !n || !qe(e) || qe(e) === n)
	})).filter((e) => e.commands.length);
	return a.length ? a.sort((e, t) => e.order - t.order) : et(t, {
		tabId: n,
		defaultGroupId: r,
		defaultGroupLabel: i
	});
}, nt = (t, n) => e.isValidElement(t?.icon) ? t.icon : typeof t?.icon == "function" ? e.createElement(t.icon, {
	size: n ? 13 : 16,
	"aria-hidden": !0
}) : null;
function rt({ command: e, group: t, activeTab: n, compact: r, renderIcon: i, renderCommand: a, onCommand: o }) {
	let s = X(e) || "COMMAND", c = !!(e?.toggle || e?.pressed !== void 0 || e?.active !== void 0), l = {
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
	}, u = typeof i == "function" ? i(e, l) : nt(e, r), d = {
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
			e?.shortcut && /* @__PURE__ */ h(De, { shortcut: e.shortcut })
		]
	});
}
function it({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: i, groups: a, commands: o = [], defaultGroupId: s = "commands", defaultGroupLabel: c = "COMMANDS", label: d = "CAD workspace ribbon", tabListLabel: p = "Workspace commands", minimized: m, defaultMinimized: _ = !1, onMinimizedChange: v, collapsible: y = !0, compact: b = !1, identity: x, renderIdentity: S, status: C, statusLabel: w = "Workspace status", renderStatus: T, endSlot: E, renderIcon: D, renderCommand: O, renderMinimizeControl: k, onCommand: A, className: ee, style: j, children: M, ...te }) {
	let N = `cad-workspace-ribbon-${$e(l())}`, P = f(/* @__PURE__ */ new Map()), F = u(() => Y(t).filter((e) => e && Ge(e.id)).map((e) => ({
		...e,
		id: Ge(e.id),
		label: X(e) || Ge(e.id)
	})), [t]), I = F.find((e) => !e.disabled)?.id || F[0]?.id || "", [L, R] = Z(n, r || I, (e, t) => i?.(e, F.find((t) => t.id === e), t)), z = F.find((e) => e.id === L) || F.find((e) => !e.disabled) || F[0] || null, B = z?.id || "", [V, ne] = Z(m, _, (e, t) => v?.(!!e, t)), H = u(() => tt({
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
	]), U = {
		activeTab: z,
		groups: H,
		compact: b,
		minimized: !!V
	}, re = typeof S == "function" ? S(U) : x, ie = typeof T == "function" ? T(U) : C, W = `${N}-panel-${$e(B || "commands")}`, G = (e, t) => {
		e.disabled || R(e.id, t);
	}, K = (e, t, n) => {
		let r = F.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), G(i, n), P.current.get(i.id)?.focus();
	}, ae = (e, t) => {
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && K(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && K(e.id, -1, t), t.key === "Home" && K(F.find((e) => !e.disabled)?.id || e.id, 0, t), t.key === "End") {
			let e = F.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), G(e, t), P.current.get(e.id)?.focus();
		}
	}, q = (e) => ne((e) => !e, e), oe = typeof k == "function" ? k({
		minimized: !!V,
		toggle: q
	}) : y && /* @__PURE__ */ g("button", {
		type: "button",
		className: "cad-workspace-ribbon__minimize",
		"aria-label": V ? "Expand ribbon" : "Minimize ribbon",
		"aria-expanded": !V,
		title: V ? "Expand ribbon" : "Minimize ribbon",
		onClick: q,
		children: [/* @__PURE__ */ h("span", {
			"aria-hidden": "true",
			children: V ? "⌄" : "⌃"
		}), /* @__PURE__ */ h("b", { children: V ? "EXPAND" : "COMPACT" })]
	});
	return /* @__PURE__ */ g("header", {
		...te,
		className: J("cad-workspace-ribbon", b && "cad-workspace-ribbon--compact", V && "cad-workspace-ribbon--minimized", ee),
		"data-active-tab": B || void 0,
		"data-minimized": V ? "true" : "false",
		"aria-label": d,
		style: {
			"--cad-ribbon-accent": z?.color || void 0,
			...j
		},
		children: [/* @__PURE__ */ g("div", {
			className: "cad-workspace-ribbon__tabbar",
			children: [
				re && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__identity",
					children: re
				}),
				F.length > 0 && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__tabs",
					role: "tablist",
					"aria-label": p,
					children: F.map((t) => {
						let n = t.id === B, r = `${N}-tab-${$e(t.id)}`;
						return /* @__PURE__ */ g("button", {
							id: r,
							ref: (e) => {
								e ? P.current.set(t.id, e) : P.current.delete(t.id);
							},
							type: "button",
							role: "tab",
							disabled: !!t.disabled,
							"aria-selected": n,
							"aria-controls": `${N}-panel-${$e(t.id)}`,
							tabIndex: n ? 0 : -1,
							"data-tone": t.tone || "inherit",
							"data-active": n ? "true" : "false",
							className: "cad-workspace-ribbon__tab",
							style: t.color ? { "--cad-ribbon-tab-accent": t.color } : void 0,
							onClick: (e) => G(t, e),
							onKeyDown: (e) => ae(t, e),
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
				oe
			]
		}), !V && /* @__PURE__ */ g("div", {
			id: W,
			role: "tabpanel",
			"aria-labelledby": B ? `${N}-tab-${$e(B)}` : void 0,
			tabIndex: 0,
			className: "cad-workspace-ribbon__commands",
			children: [
				/* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__groups",
					role: "toolbar",
					"aria-label": `${z?.label || "CAD"} commands`,
					children: H.map((e, t) => /* @__PURE__ */ g("section", {
						className: "cad-workspace-ribbon__group",
						"data-cad-group": e.label,
						"data-primary": t === 0 ? "true" : "false",
						"aria-label": `${e.label} command group`,
						children: [/* @__PURE__ */ h("div", {
							className: "cad-workspace-ribbon__group-tools",
							children: e.commands.map((t, n) => /* @__PURE__ */ h(rt, {
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
				ie && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__status",
					"aria-label": w,
					children: ie
				}),
				M && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__content",
					children: M
				})
			]
		})]
	});
}
//#endregion
//#region src/CadOverlayUi.jsx
var at = (e, t) => (n) => {
	e?.(n), n.defaultPrevented || t?.(n);
}, ot = "button:not(:disabled):not([tabindex=\"-1\"]), input:not(:disabled):not([tabindex=\"-1\"]), select:not(:disabled):not([tabindex=\"-1\"]), textarea:not(:disabled):not([tabindex=\"-1\"]), [contenteditable=\"true\"]:not([tabindex=\"-1\"]), [href]:not([tabindex=\"-1\"]), [tabindex]:not([tabindex=\"-1\"])", st = (e) => !!(e && !e.hidden && !e.closest?.("[hidden], [aria-hidden=\"true\"], [inert]") && e.getAttribute("aria-hidden") !== "true" && e.getAttribute("aria-disabled") !== "true" && !e.hasAttribute("disabled")), ct = (e) => [...e?.querySelectorAll(ot) || []].filter(st), lt = (e) => {
	if (e?.isConnected) try {
		e.focus({ preventScroll: !0 });
	} catch {
		e.focus?.();
	}
}, ut = (e) => {
	if (typeof document > "u" || !e) return !1;
	let t = document.querySelectorAll("[data-cad-dialog=\"true\"]");
	return t[t.length - 1] === e;
};
function dt({ open: e = !1, onClose: t, title: n, description: r, actions: i, tone: a = "neutral", closeOnBackdrop: o = !0, closeOnEscape: s = !0, className: u, children: d, ...p }) {
	let m = l(), _ = `cad-dialog-title-${m}`, v = `cad-dialog-description-${m}`, y = f(null), b = f(t), x = f(s), { "aria-label": S, "aria-labelledby": C, "aria-describedby": w, onKeyDown: T, ...E } = p;
	if (b.current = t, x.current = s, c(() => {
		if (!e || typeof document > "u") return;
		let t = document.activeElement, n = () => {
			let e = y.current;
			if (!ut(e)) return;
			let t = ct(e);
			lt(t.find((e) => e.hasAttribute("data-autofocus")) || t[0] || e);
		}, r = (e) => {
			let t = y.current;
			if (e.defaultPrevented || !ut(t)) return;
			if (e.key === "Escape" && x.current) {
				e.preventDefault(), b.current?.(e);
				return;
			}
			if (e.key !== "Tab") return;
			let n = ct(t);
			if (!n.length) {
				e.preventDefault(), lt(t);
				return;
			}
			let r = n[0], i = n[n.length - 1], a = document.activeElement;
			t?.contains(a) ? e.shiftKey && a === r ? (e.preventDefault(), lt(i)) : !e.shiftKey && a === i && (e.preventDefault(), lt(r)) : (e.preventDefault(), lt(e.shiftKey ? i : r));
		}, i = window.setTimeout(n, 0);
		return window.addEventListener("keydown", r), () => {
			window.clearTimeout(i), window.removeEventListener("keydown", r), lt(t);
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
			className: J("cad-dialog", u),
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
function ft({ open: e, title: t = "Confirm action", description: n, confirmLabel: r = "Confirm", cancelLabel: i = "Cancel", destructive: a = !1, onConfirm: o, onCancel: s, children: c, className: l, ...u }) {
	return /* @__PURE__ */ h(dt, {
		...u,
		open: e,
		title: t,
		description: n,
		onClose: s,
		className: J("cad-confirm-dialog", l),
		actions: /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("button", {
			type: "button",
			...a ? { "data-autofocus": !0 } : {},
			className: "cad-dialog__button cad-dialog__button--quiet",
			onClick: s,
			children: i
		}), /* @__PURE__ */ h("button", {
			type: "button",
			...a ? {} : { "data-autofocus": !0 },
			className: J("cad-dialog__button", a && "cad-dialog__button--danger"),
			onClick: o,
			children: r
		})] }),
		children: c
	});
}
function pt({ toast: e, onDismiss: t, className: n }) {
	let r = e || {}, i = r.tone || "neutral";
	return /* @__PURE__ */ g("article", {
		className: J("cad-toast", n),
		"data-tone": i,
		role: i === "danger" || i === "error" ? "alert" : "status",
		children: [
			/* @__PURE__ */ h("span", {
				className: "cad-toast__signal",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-toast__copy",
				children: [/* @__PURE__ */ h("strong", { children: r.title || X(r) || "CAD notification" }), r.message && /* @__PURE__ */ h("p", { children: r.message })]
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
				"aria-label": `Dismiss ${r.title || X(r) || "notification"}`,
				onClick: (e) => t(r, e),
				children: "×"
			})
		]
	});
}
function mt({ toasts: e = [], onDismiss: t, placement: n = "bottom-right", label: r = "Notifications", className: i, ...a }) {
	return /* @__PURE__ */ h("section", {
		...a,
		className: J("cad-toast-stack", `cad-toast-stack--${n}`, i),
		"aria-label": r,
		"aria-live": "polite",
		children: Y(e).map((e, n) => /* @__PURE__ */ h(pt, {
			toast: e,
			onDismiss: t
		}, e?.id || n))
	});
}
function ht({ trigger: e, content: n, open: r, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", label: u = "More options", contentRole: d = "region", closeOnOutside: p = !0, closeOnEscape: m = !0, closeOnFocusOutside: _ = !1, closeOnPointerLeave: v = !1, restoreFocus: y = !0, className: b, contentClassName: x, ...S }) {
	let C = `cad-popover-${l()}`, w = f(null), T = f(r === void 0 ? a : r), [E, D] = Z(r, a, (e, t) => o?.(e, t)), O = d === !1 ? void 0 : d, k = [
		"dialog",
		"grid",
		"listbox",
		"menu",
		"tree"
	].includes(O) ? O : void 0, A = (e) => D(!1, e), ee = (e) => D(!E, e);
	c(() => {
		let e = T.current;
		if (T.current = E, !e || E || !y || typeof window > "u") return;
		let t = window.requestAnimationFrame(() => {
			let e = w.current?.querySelector("[data-cad-popover-trigger=\"true\"]");
			e && document.contains(e) && e.focus?.();
		});
		return () => window.cancelAnimationFrame(t);
	}, [E, y]), c(() => {
		if (!E || typeof document > "u") return;
		let e = (e) => {
			p && !w.current?.contains(e.target) && D(!1, e);
		}, t = (e) => {
			!m || e.defaultPrevented || e.key !== "Escape" || (e.preventDefault(), D(!1, e));
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t);
		};
	}, [
		m,
		p,
		E,
		D
	]);
	let j = i(e) ? t(e, {
		"data-cad-popover-trigger": "true",
		"aria-haspopup": e.props["aria-haspopup"] ?? k,
		"aria-expanded": E,
		"aria-controls": E ? C : void 0,
		onClick: at(e.props.onClick, ee)
	}) : /* @__PURE__ */ h("button", {
		type: "button",
		"data-cad-popover-trigger": "true",
		className: "cad-popover__fallback-trigger",
		"aria-haspopup": k,
		"aria-expanded": E,
		"aria-controls": E ? C : void 0,
		onClick: ee,
		children: e || "Options"
	}), M = (e) => {
		S.onBlur?.(e), !e.defaultPrevented && _ && E && !w.current?.contains(e.relatedTarget) && A(e);
	}, te = (e) => {
		S.onPointerLeave?.(e), !e.defaultPrevented && v && E && A(e);
	};
	return /* @__PURE__ */ g("div", {
		...S,
		ref: w,
		className: J("cad-popover", `cad-popover--${s}`, b),
		onBlur: M,
		onPointerLeave: te,
		onKeyDown: (e) => {
			S.onKeyDown?.(e), !e.defaultPrevented && m && e.key === "Escape" && E && (e.preventDefault(), A(e));
		},
		children: [j, E && /* @__PURE__ */ h("div", {
			id: C,
			className: J("cad-popover__content", x),
			role: O,
			"aria-label": u,
			children: typeof n == "function" ? n({ close: A }) : n
		})]
	});
}
function gt({ content: e, placement: n = "top", className: r, children: a }) {
	let o = l(), [s, c] = p(!1);
	if (!e || !i(a)) return a || null;
	let u = t(a, {
		"aria-describedby": [a.props["aria-describedby"], `cad-tooltip-${o}`].filter(Boolean).join(" "),
		onMouseEnter: at(a.props.onMouseEnter, () => c(!0)),
		onMouseLeave: at(a.props.onMouseLeave, () => c(!1)),
		onFocus: at(a.props.onFocus, () => c(!0)),
		onBlur: at(a.props.onBlur, () => c(!1))
	});
	return /* @__PURE__ */ g("span", {
		className: J("cad-tooltip", `cad-tooltip--${n}`, s && "cad-tooltip--visible", r),
		children: [u, /* @__PURE__ */ h("span", {
			id: `cad-tooltip-${o}`,
			className: "cad-tooltip__bubble",
			role: "tooltip",
			children: e
		})]
	});
}
function _t({ shortcuts: e = [], title: t = "Keyboard shortcuts", onClose: n, className: r, ...i }) {
	let a = Y(e).reduce((e, t, n) => {
		let r = t?.group || "General";
		return e[r] || (e[r] = []), e[r].push({
			...t,
			id: t?.id || `${r}-${n}`
		}), e;
	}, {});
	return /* @__PURE__ */ g("section", {
		...i,
		className: J("cad-shortcut-reference", r),
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
				/* @__PURE__ */ h("dd", { children: /* @__PURE__ */ h(De, { shortcut: e.shortcut || e.keys }) }),
				e.detail && /* @__PURE__ */ h("small", { children: e.detail })
			] }, e.id)) })] }, e))
		})]
	});
}
function vt({ open: e = !0, label: t = "Command input", prompt: n, value: r, defaultValue: i = "", onChange: a, onSubmit: o, onCancel: s, placeholder: c, submitLabel: u = "Accept", className: d, ...f }) {
	let p = l(), [m, _] = Z(r, i, (e, t) => a?.(e, t));
	return e ? /* @__PURE__ */ g("form", {
		...f,
		className: J("cad-command-prompt", d),
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
//#region src/CadCompactWorkspaceRibbon.jsx
var yt = (e) => String(e ?? "").trim(), bt = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, xt = (e) => yt(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace", St = (e) => yt(e?.tabId || e?.tab || e?.placement?.tab), Ct = (e) => yt(e?.tabId || e?.tab || e?.placement?.tab), wt = (e) => Y(e?.commands).length ? Y(e.commands) : Y(e?.items), Tt = {
	cyan: "#53c9ff",
	green: "#9add4b",
	amber: "#ffb554",
	magenta: "#f08cff",
	violet: "#b9a1ff",
	neutral: "#b4bdc7"
}, Et = (e) => e?.color || Tt[e?.tone] || "var(--cad-workspace-accent, #53c9ff)", Dt = (e) => Y(e).filter((e) => e && yt(e.id)).map((e) => ({
	...e,
	id: yt(e.id),
	label: X(e) || yt(e.id)
})), Ot = ({ groups: e, activeTabId: t, defaultGroupLabel: n }) => Y(e).filter((e) => e && typeof e == "object" && (!t || !Ct(e) || Ct(e) === t)).map((e, r) => ({
	id: yt(e.id) || `group-${r + 1}`,
	label: yt(e.label) || n,
	order: bt(e.order, r),
	index: r,
	commands: wt(e).filter((e) => !t || !St(e) || St(e) === t)
})).filter((e) => e.commands.length).sort((e, t) => e.order - t.order || e.index - t.index).map(({ index: e, ...t }) => t);
function kt({ groups: e, commands: t = [], tabId: n = "", defaultGroupId: r = "commands", defaultGroupLabel: i = "COMMANDS" } = {}) {
	let a = Ot({
		groups: e,
		activeTabId: n,
		defaultGroupLabel: i
	});
	return a.length ? a : et(t, {
		tabId: n,
		defaultGroupId: r,
		defaultGroupLabel: i
	});
}
function At({ command: e, group: t, activeTab: n, renderIcon: r, renderCommand: a, onCommand: o, close: s, closeOnCommand: c }) {
	let l = X(e) || "COMMAND", u = !!(e?.pressed ?? e?.active), d = !!(e?.toggle || e?.pressed !== void 0 || e?.active !== void 0), f = {
		command: e,
		group: t,
		activeTab: n,
		compact: !0,
		source: "compact-workspace-ribbon",
		close: s,
		execute: (r) => {
			e?.disabled || (e?.onClick?.(e, r), o?.(e, {
				command: e,
				group: t,
				activeTab: n,
				compact: !0,
				source: "compact-workspace-ribbon",
				close: s
			}, r), c && !r.defaultPrevented && s?.(r));
		}
	}, p = typeof r == "function" ? r(e, f) : e?.icon, _ = typeof p == "function" ? p : null, v = i(p) ? p : null, y = {
		type: "button",
		disabled: !!e?.disabled,
		"data-cad-ribbon-tool": e?.toolId || e?.id || l,
		"data-command-id": e?.id,
		"data-testid": e?.testId,
		"data-tone": e?.tone || "inherit",
		"data-active": u ? "true" : "false",
		"aria-label": e?.ariaLabel || e?.accessibleLabel || l,
		"aria-pressed": d ? u : void 0,
		title: e?.title || e?.detail || e?.description || l,
		className: "cad-compact-workspace-ribbon__command",
		style: e?.color ? { "--cad-tool-accent": e.color } : void 0,
		onClick: f.execute
	};
	if (typeof a == "function") return a(e, {
		...f,
		icon: p,
		buttonProps: y
	});
	let b = v && /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("span", {
		className: "cad-compact-workspace-ribbon__command-icon",
		"aria-hidden": "true",
		children: v
	}), /* @__PURE__ */ h("span", { children: l })] });
	return /* @__PURE__ */ h(Oe, {
		...y,
		icon: _ || void 0,
		label: b ? void 0 : l,
		badge: e?.badge,
		active: u,
		toggle: d,
		children: b || void 0
	});
}
function jt({ tab: e, groups: t, openGroupId: n, onOpenGroupChange: r, renderIcon: i, renderCommand: a, onCommand: o, close: s, closeOnCommand: c, label: u }) {
	let d = t.find((e) => e.id === n) || null, f = l();
	return /* @__PURE__ */ g("section", {
		className: "cad-compact-workspace-ribbon__disclosure-body",
		"data-tab-id": e.id,
		children: [
			/* @__PURE__ */ g("header", {
				className: "cad-compact-workspace-ribbon__disclosure-header",
				children: [/* @__PURE__ */ h("span", { children: "COMMAND GROUPS" }), /* @__PURE__ */ h("strong", { children: e.label })]
			}),
			/* @__PURE__ */ h("div", {
				className: "cad-compact-workspace-ribbon__groups",
				role: "list",
				"aria-label": `${e.label} command groups`,
				children: t.map((e) => {
					let n = e.id === d?.id, i = `${f}-${xt(e.id)}`;
					return /* @__PURE__ */ h("div", {
						role: "listitem",
						children: /* @__PURE__ */ g("button", {
							type: "button",
							className: "cad-compact-workspace-ribbon__group",
							"data-active": n ? "true" : "false",
							"aria-expanded": n,
							"aria-controls": n ? i : void 0,
							onClick: (t) => r(n ? null : e.id, e, t),
							children: [
								/* @__PURE__ */ h("span", {
									className: "cad-compact-workspace-ribbon__group-index",
									"aria-hidden": "true",
									children: String(t.indexOf(e) + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ h("span", { children: e.label }),
								/* @__PURE__ */ h("small", { children: e.commands.length }),
								/* @__PURE__ */ h("b", {
									"aria-hidden": "true",
									children: n ? "−" : "+"
								})
							]
						})
					}, e.id);
				})
			}),
			d && /* @__PURE__ */ g("div", {
				id: `${f}-${xt(d.id)}`,
				className: "cad-compact-workspace-ribbon__commands",
				role: "region",
				"aria-label": `${d.label} commands`,
				children: [/* @__PURE__ */ g("div", {
					className: "cad-compact-workspace-ribbon__commands-heading",
					children: [/* @__PURE__ */ h("span", { children: d.label }), /* @__PURE__ */ g("small", { children: [d.commands.length, " COMMANDS"] })]
				}), /* @__PURE__ */ h("div", {
					className: "cad-compact-workspace-ribbon__command-grid",
					role: "toolbar",
					"aria-label": `${d.label} tools`,
					children: d.commands.map((t, n) => /* @__PURE__ */ h(At, {
						command: t,
						group: d,
						activeTab: e,
						renderIcon: i,
						renderCommand: a,
						onCommand: o,
						close: s,
						closeOnCommand: c
					}, t?.id || `${d.id}-${n}`))
				})]
			}),
			!t.length && /* @__PURE__ */ h("p", {
				className: "cad-compact-workspace-ribbon__empty",
				children: "No commands are available on this tab."
			}),
			/* @__PURE__ */ g("footer", {
				className: "cad-compact-workspace-ribbon__disclosure-footer",
				children: [/* @__PURE__ */ h("span", { children: u }), /* @__PURE__ */ h("button", {
					type: "button",
					onClick: s,
					children: "CLOSE"
				})]
			})
		]
	});
}
function Mt({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: a, openTabId: o, defaultOpenTabId: s = null, onOpenTabChange: c, openGroupId: d, defaultOpenGroupId: p = null, onOpenGroupChange: m, groups: _, commands: v = [], defaultGroupId: y = "commands", defaultGroupLabel: b = "COMMANDS", label: x = "Compact CAD workspace ribbon", tabListLabel: S = "Compact workspace commands", identity: C, endSlot: w, placement: T = "bottom-start", closeOnOutside: E = !0, closeOnEscape: D = !0, closeOnFocusOutside: O = !0, closeOnPointerLeave: k = !0, closeOnCommand: A = !0, renderIcon: ee, renderCommand: j, onCommand: M, className: te, style: N, ...P }) {
	let F = `cad-compact-workspace-ribbon-${xt(l())}`, I = f(/* @__PURE__ */ new Map()), L = u(() => Dt(t), [t]), R = L.find((e) => !e.disabled)?.id || L[0]?.id || "", [z, B] = Z(n, r || R, (e, t) => a?.(e, L.find((t) => t.id === e) || null, t)), V = L.find((e) => e.id === z) || L.find((e) => !e.disabled) || L[0] || null, [ne, H] = Z(o, s, (e, t) => c?.(e || null, L.find((t) => t.id === e) || null, t)), U = L.find((e) => e.id === ne && !e.disabled) || null, re = U?.id || "", [ie, W] = Z(d, p, (e, t, n) => m?.(e || null, t || null, U || null, n)), G = u(() => new Map(L.map((e) => [e.id, kt({
		groups: _,
		commands: v,
		tabId: e.id,
		defaultGroupId: y,
		defaultGroupLabel: b
	})])), [
		v,
		y,
		b,
		_,
		L
	]), K = (e) => {
		W(null, null, e), H(null, e);
	}, ae = (e, t) => {
		B(e.id, t), re !== e.id && W(null, null, t), H(e.id, t);
	}, q = (e, t) => {
		e.disabled || (B(e.id, t), K(t));
	}, oe = (e, t, n) => {
		let r = L.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), q(i, n), I.current.get(i.id)?.focus();
	}, se = (e, t) => {
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && oe(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && oe(e.id, -1, t), t.key === "Home") {
			let e = L.find((e) => !e.disabled);
			if (!e) return;
			t.preventDefault(), q(e, t), I.current.get(e.id)?.focus();
		}
		if (t.key === "End") {
			let e = L.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), q(e, t), I.current.get(e.id)?.focus();
		}
	}, ce = (e, t, n) => W(e, t, n);
	return /* @__PURE__ */ h("header", {
		...P,
		className: J("cad-workspace-ribbon", "cad-compact-workspace-ribbon", te),
		"data-active-tab": V?.id || void 0,
		"data-open-tab": re || void 0,
		"aria-label": x,
		style: {
			"--cad-ribbon-accent": Et(V),
			...N
		},
		children: /* @__PURE__ */ g("div", {
			className: "cad-workspace-ribbon__tabbar cad-compact-workspace-ribbon__tabbar",
			children: [
				C && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__identity",
					children: C
				}),
				L.length > 0 && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__tabs",
					role: "tablist",
					"aria-label": S,
					children: L.map((t) => {
						let n = t.id === V?.id, r = t.id === re, a = `${F}-tab-${xt(t.id)}`, o = G.get(t.id) || [];
						return /* @__PURE__ */ h(ht, {
							open: r,
							onOpenChange: (e, n) => {
								e ? ae(t, n) : r && K(n);
							},
							placement: T,
							label: `${t.label} compact command menu`,
							closeOnOutside: E,
							closeOnEscape: D,
							closeOnFocusOutside: O,
							closeOnPointerLeave: k,
							className: "cad-compact-workspace-ribbon__popover",
							contentClassName: "cad-compact-workspace-ribbon__disclosure",
							style: { "--cad-compact-ribbon-accent": Et(t) },
							trigger: /* @__PURE__ */ g("button", {
								id: a,
								ref: (e) => {
									e ? I.current.set(t.id, e) : I.current.delete(t.id);
								},
								type: "button",
								role: "tab",
								disabled: !!t.disabled,
								"aria-selected": n,
								tabIndex: n ? 0 : -1,
								"data-tone": t.tone || "inherit",
								"data-active": n ? "true" : "false",
								className: "cad-workspace-ribbon__tab",
								style: t.color ? { "--cad-ribbon-tab-accent": t.color } : void 0,
								onKeyDown: (e) => se(t, e),
								children: [t.icon && /* @__PURE__ */ h("span", {
									className: "cad-workspace-ribbon__tab-icon",
									"aria-hidden": "true",
									children: i(t.icon) ? t.icon : typeof t.icon == "function" ? e.createElement(t.icon, { size: 12 }) : null
								}), /* @__PURE__ */ h("span", { children: t.label })]
							}),
							content: ({ close: e }) => /* @__PURE__ */ h(jt, {
								tab: t,
								groups: o,
								openGroupId: r ? ie : null,
								onOpenGroupChange: ce,
								renderIcon: ee,
								renderCommand: j,
								onCommand: M,
								close: e,
								closeOnCommand: A,
								label: x
							})
						}, t.id);
					})
				}),
				w && /* @__PURE__ */ h("div", {
					className: "cad-workspace-ribbon__end-slot",
					children: w
				})
			]
		})
	});
}
//#endregion
//#region src/CadContextUi.jsx
var Nt = Object.freeze([
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
]), Pt = Object.freeze([
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
]), Ft = Object.freeze([
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
]), It = (e, t) => Y(e).map((e, n) => {
	if (typeof e == "string" || typeof e == "number") return {
		id: String(e),
		label: String(e)
	};
	let r = X(e) || `${t} ${n + 1}`;
	return {
		...e,
		id: e?.id ?? `${t}-${n + 1}`,
		label: r
	};
}), Lt = (e) => Y(e).find((e) => !e?.disabled)?.id ?? "", Rt = (e, t, n, r) => {
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
function zt({ actions: e = Nt, activeId: t, defaultActiveId: n = "", onActiveChange: r, onChange: i, onAction: a, onPan: o, onZoom: s, onZoomIn: c, onZoomOut: l, onZoomWindow: d, onZoomExtents: f, onOrbit: p, onHome: m, label: _ = "Viewport navigation", orientation: v = "vertical", className: y, ...b }) {
	let x = u(() => It(e, "navigation-action"), [e]), [S, C] = Z(t, n, (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), w = (e, t) => {
		e.disabled || ((e.toggle ?? e.mode ?? !1) && C(S === e.id ? "" : e.id, e, t), e.onClick?.(e, t), a?.(e, t), Rt(e.id, {
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
		className: J("cad-navigation-bar", `cad-navigation-bar--${v}`, y),
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
				let n = e.icon, r = e.toggle ?? e.mode ?? !1, i = r && S === e.id, a = X(e);
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
function Bt({ styles: e = Pt, value: t, defaultValue: n, onChange: r, onStyleChange: i, label: a = "Visual style", id: o, selectProps: s = {}, disabled: c = !1, className: d, ...f }) {
	let p = l(), m = o || `cad-visual-style-${p}`, _ = u(() => It(e, "visual-style"), [e]), [v, y] = Z(t, n ?? _[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), b = _.find((e) => e.id === v) || _[0];
	return /* @__PURE__ */ g("div", {
		...f,
		className: J("cad-visual-style-picker", d),
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
function Vt({ scales: e = Ft, value: t, defaultValue: n, onChange: r, onScaleChange: i, onManage: a, manageLabel: o = "Manage", label: s = "Viewport scale", id: c, selectProps: d = {}, disabled: f = !1, className: p, ...m }) {
	let _ = l(), v = c || `cad-viewport-scale-${_}`, y = u(() => It(e, "viewport-scale"), [e]), [b, x] = Z(t, n ?? y[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), S = y.find((e) => e.id === b) || y[0];
	return /* @__PURE__ */ g("div", {
		...m,
		className: J("cad-viewport-scale-picker", p),
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
function Ht({ sets: e = [], activeId: t, defaultActiveId: n, onChange: r, onApply: i, onCreate: a, onRename: o, onDelete: s, filter: c, defaultFilter: d = "", onFilterChange: f, showFilter: p = !0, title: m = "Selection sets", filterLabel: _ = "Filter selection sets", emptyLabel: v = "No selection sets match the current filter", createLabel: y = "New", applyLabel: b = "Select", renameLabel: x = "Rename", deleteLabel: S = "Delete", className: C, children: w, ...T }) {
	let E = `cad-selection-set-filter-${l()}`, D = u(() => It(e, "selection-set"), [e]), [O, k] = Z(t, n ?? Lt(D), (e, t, n) => r?.(e, t, n)), [A, ee] = Z(c, d, (e, t) => f?.(e, t)), j = D.find((e) => e.id === O), M = u(() => {
		let e = String(A || "").trim().toLocaleLowerCase();
		return e ? D.filter((t) => [
			X(t),
			t.description,
			t.group
		].filter(Boolean).join(" ").toLocaleLowerCase().includes(e)) : D;
	}, [D, A]), te = !!(j?.disabled || j?.locked || j?.protected || j?.system);
	return /* @__PURE__ */ g("section", {
		...T,
		className: J("cad-selection-set-panel", C),
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
						onChange: (e) => ee(e.target.value, e)
					}),
					A && /* @__PURE__ */ h("button", {
						type: "button",
						"aria-label": "Clear selection set filter",
						onClick: (e) => ee("", e),
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ h("ul", {
				className: "cad-selection-set-panel__list",
				children: M.map((e) => {
					let t = e.id === O, n = e.count ?? e.entityCount, r = e.countLabel || `${n} objects`;
					return /* @__PURE__ */ g("li", {
						"data-selected": t ? "true" : "false",
						children: [/* @__PURE__ */ g("button", {
							type: "button",
							className: "cad-selection-set-panel__set",
							"aria-label": e.ariaLabel || X(e),
							"aria-pressed": t,
							"aria-current": t ? "true" : void 0,
							disabled: e.disabled,
							onClick: (t) => k(e.id, e, t),
							children: [
								/* @__PURE__ */ h("span", {
									className: "cad-selection-set-panel__set-name",
									children: X(e)
								}),
								e.description && /* @__PURE__ */ h("small", { children: e.description }),
								e.group && /* @__PURE__ */ h("em", { children: e.group })
							]
						}), n !== void 0 && /* @__PURE__ */ h("output", {
							"aria-label": `${X(e)}: ${r}`,
							children: n
						})]
					}, e.id);
				})
			}),
			!M.length && /* @__PURE__ */ h("p", {
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
						disabled: !j || j.disabled,
						onClick: (e) => i(j, e),
						children: b
					}),
					o && /* @__PURE__ */ h("button", {
						type: "button",
						disabled: !j || te,
						onClick: (e) => o(j, e),
						children: x
					}),
					s && /* @__PURE__ */ h("button", {
						type: "button",
						disabled: !j || te,
						onClick: (e) => s(j, e),
						children: S
					}),
					w
				]
			})
		]
	});
}
//#endregion
//#region src/CadWorkspaceCustomizationUi.jsx
var Ut = (e) => String(e ?? "").trim(), Wt = (e) => !!e && typeof e == "object" && !Array.isArray(e), Gt = (e, t) => !!e && !!t && e.open === t.open && e.placement === t.placement, Kt = (e) => e instanceof Map ? Object.fromEntries(e.entries()) : Wt(e) ? e : {}, qt = (e) => {
	if (!Wt(e)) return {};
	let { open: t, visible: n, isOpen: r, placement: i, mode: a, ...o } = e;
	return o;
}, Jt = (...e) => {
	let t = e.find((e) => typeof e == "boolean");
	return t === void 0 ? void 0 : t;
}, Yt = (e, t) => Ut(e).toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || t, Q = Object.freeze({
	DOCK: "dock",
	FLOAT: "float"
}), $ = Object.freeze({
	OPEN: "open",
	CLOSE: "close",
	TOGGLE: "toggle",
	DOCK: "dock",
	FLOAT: "float",
	RESET: "reset",
	RESET_ALL: "reset-all",
	PATCH: "patch"
});
function Xt(e, t = Q.DOCK) {
	let n = Ut(e).toLocaleLowerCase();
	return [
		"float",
		"floating",
		"overlay",
		"window"
	].includes(n) ? Q.FLOAT : [
		"dock",
		"docked",
		"left",
		"right",
		"top",
		"bottom",
		"side"
	].includes(n) ? Q.DOCK : t;
}
var Zt = (e) => {
	let t = Y(e?.placements ?? e?.allowedPlacements ?? e?.placementOptions).map((e) => Xt(e, "")).filter(Boolean), n = !!(e?.preferenceLocked ?? e?.locked), r = !n && e?.dockable !== !1, i = !n && e?.floatable !== !1, a = (t.length ? t : [...r ? [Q.DOCK] : [], ...i ? [Q.FLOAT] : []]).filter((e) => e === Q.DOCK ? r : i);
	return [...new Set(a)];
};
function Qt(e = []) {
	let t = /* @__PURE__ */ new Set();
	return Y(e).reduce((e, n, r) => {
		if (n == null) return e;
		let i = typeof n == "string" || typeof n == "number" ? {
			id: String(n),
			label: String(n)
		} : n;
		if (!Wt(i)) return e;
		let a = Ut(i.id ?? i.key) || `panel-${r + 1}`;
		if (t.has(a)) return e;
		t.add(a);
		let o = !!(i.preferenceLocked ?? i.locked), s = Zt(i), c = Xt(i.defaultPlacement ?? i.placement ?? i.mode, Q.DOCK), l = s.includes(c) ? c : s[0] || c, u = Jt(i.defaultOpen, i.defaultVisible, i.open, i.visible) ?? !0;
		return e.push({
			...i,
			id: a,
			label: X(i) || `Panel ${r + 1}`,
			description: Ut(i.description ?? i.detail),
			disabled: !!i.disabled,
			required: !!i.required,
			preferenceLocked: o,
			closable: !o && !i.required && i.closable !== !1,
			placements: s,
			defaultPlacement: l,
			defaultOpen: u
		}), e;
	}, []);
}
var $t = (e, t) => {
	let n = typeof t == "boolean" ? { open: t } : Kt(t), r = Jt(n.open, n.visible, n.isOpen, e.defaultOpen), i = Xt(n.placement ?? n.mode, e.defaultPlacement), a = e.placements.includes(i) ? i : e.placements[0] || e.defaultPlacement;
	return {
		...qt(n),
		open: e.required ? !0 : !!r,
		placement: a
	};
};
function en(e = [], t = {}) {
	let n = Kt(t);
	return Qt(e).reduce((e, t) => (e[t.id] = $t(t, n[t.id]), e), {});
}
function tn(e = [], t = {}, n) {
	let r = Ut(n);
	return r ? en(e, t)[r] : void 0;
}
var nn = (e) => typeof e == "string" ? { type: e } : Wt(e) ? e : { type: "" }, rn = (e, t, n) => {
	let { type: r, value: i } = nn(n), a = { ...t }, o = (t) => e.placements.includes(t);
	if (e.disabled || e.preferenceLocked) return t;
	switch (r) {
		case $.OPEN:
			a.open = !0;
			break;
		case $.CLOSE:
			if (!e.closable) return t;
			a.open = !1;
			break;
		case $.TOGGLE:
			if (t.open && !e.closable) return t;
			a.open = !t.open;
			break;
		case $.DOCK:
			if (!o(Q.DOCK)) return t;
			a.placement = Q.DOCK;
			break;
		case $.FLOAT:
			if (!o(Q.FLOAT)) return t;
			a.placement = Q.FLOAT;
			break;
		case $.RESET: return $t(e, {});
		case $.PATCH: {
			let t = Kt(i);
			typeof t.open == "boolean" && (t.open || e.closable) && (a.open = t.open);
			let n = Xt(t.placement ?? t.mode, "");
			n && o(n) && (a.placement = n);
			break;
		}
		default: return t;
	}
	return a;
};
function an(e = [], t = {}, n, r) {
	let i = Ut(n), a = Qt(e).find((e) => e.id === i), o = Kt(t);
	if (!a) return o;
	let s = $t(a, o[i]), c = rn(a, s, r);
	return Gt(s, c) ? o : {
		...o,
		[i]: c
	};
}
function on(e = [], t = {}) {
	let n = Kt(t);
	return Qt(e).reduce((e, t) => ({
		...e,
		[t.id]: $t(t, qt(n[t.id]))
	}), { ...n });
}
function sn(e = "cad-workspace", t = "default") {
	let n = Wt(e) ? e : {
		namespace: e,
		scope: t
	};
	return `${Yt(n.namespace, "cad-workspace")}:${Yt(n.scope, "default")}:${Yt(n.section, "panels")}`;
}
function cn({ panels: e = [], value: t, defaultValue: n, onChange: r } = {}) {
	let i = u(() => Qt(e), [e]), [o, s] = Z(t, u(() => ({
		...Kt(n),
		...en(i, n)
	}), [n, i]), (e, t, n) => {
		r?.(e, t, n);
	}), c = u(() => en(i, o), [i, o]);
	return {
		panels: i,
		value: c,
		preferences: c,
		dispatch: a((e, t, n) => {
			let r = Ut(e), a = i.find((e) => e.id === r), l = c[r];
			if (!a || !l) return {
				changed: !1,
				panel: a,
				action: nn(t).type
			};
			let u = an(i, o, r, t), d = en(i, u)[r], f = !Gt(l, d), p = {
				changed: f,
				id: r,
				panel: a,
				action: nn(t).type,
				previousPreference: l,
				preference: d,
				value: u,
				source: "workspace-panel-preferences"
			};
			return f && s(u, p, n), p;
		}, [
			i,
			c,
			o,
			s
		]),
		reset: a((e) => {
			let t = on(i, o), n = en(i, t), r = i.some((e) => !Gt(c[e.id], n[e.id])), a = {
				changed: r,
				action: $.RESET_ALL,
				panels: i,
				previousPreferences: c,
				preferences: n,
				value: t,
				source: "workspace-panel-preferences"
			};
			return r && s(t, a, e), a;
		}, [
			i,
			c,
			o,
			s
		])
	};
}
var ln = /* @__PURE__ */ h("span", {
	"aria-hidden": "true",
	children: "▣"
}), un = (t, n) => typeof n == "function" ? n(t) : e.isValidElement(t.icon) ? t.icon : typeof t.icon == "function" || t.icon?.$$typeof ? e.createElement(t.icon, {
	size: 13,
	"aria-hidden": !0
}) : t.icon !== void 0 && t.icon !== null ? t.icon : ln, dn = (e) => e === Q.FLOAT ? "FLOATING" : "DOCKED";
function fn({ panels: t = [], value: n, defaultValue: r, onChange: i, onPanelChange: o, onPanelAction: s, onPanelOpen: c, onPanelClose: u, onPanelDock: d, onPanelFloat: f, onPanelReset: p, onResetAll: _, menuOpen: v, defaultMenuOpen: y = !1, onMenuOpenChange: b, title: x = "Workspace panels", description: S = "Show, dock or float the panels used in this workspace.", trigger: C, renderTrigger: w, triggerLabel: T = "Workspace panels", triggerIcon: E = "▦", scope: D, placement: O = "bottom-end", emptyLabel: k = "No configurable panels are available.", resetAllLabel: A = "Reset workspace", showResetAll: ee = !0, closeLabel: j, renderPanel: M, renderPanelIcon: te, className: N, contentClassName: P, ...F }) {
	let I = l(), { panels: L, preferences: R, dispatch: z, reset: B } = cn({
		panels: t,
		value: n,
		defaultValue: r,
		onChange: i
	}), V = L.filter((e) => !e.hidden), ne = V.filter((e) => R[e.id]?.open).length, H = V.filter((e) => R[e.id]?.open && R[e.id]?.placement === Q.FLOAT).length, U = a((e, t, n) => {
		let r = z(e.id, t, n);
		r.changed && (o?.(e.id, r.preference, r, n), s?.(r, n), r.action === $.OPEN && c?.(e, r.preference, r, n), r.action === $.CLOSE && u?.(e, r.preference, r, n), r.action === $.DOCK && d?.(e, r.preference, r, n), r.action === $.FLOAT && f?.(e, r.preference, r, n), r.action === $.RESET && p?.(e, r.preference, r, n));
	}, [
		z,
		s,
		o,
		u,
		d,
		f,
		c,
		p
	]), re = a((e) => {
		let t = B(e);
		t.changed && (s?.(t, e), _?.(t.value, t, e));
	}, [
		s,
		_,
		B
	]), ie = /* @__PURE__ */ g("button", {
		type: "button",
		className: "cad-workspace-panel-manager__trigger",
		title: T,
		children: [
			/* @__PURE__ */ h("span", {
				className: "cad-workspace-panel-manager__trigger-icon",
				"aria-hidden": "true",
				children: E
			}),
			/* @__PURE__ */ h("span", {
				className: "cad-workspace-panel-manager__trigger-label",
				children: T
			}),
			/* @__PURE__ */ h("output", {
				"aria-label": `${ne} visible panels`,
				children: ne
			})
		]
	}), W = typeof w == "function" ? w({
		visibleCount: ne,
		floatingCount: H,
		panels: V,
		preferences: R
	}) : C || ie, G = j || `Close ${x}`, K = `cad-workspace-panel-manager-${I}`, ae = (e, t) => {
		let n = !!t.open, r = n ? $.CLOSE : $.OPEN, i = !e.disabled && (!n || e.closable), a = e.placements.length > 1, o = {
			open: (t) => U(e, $.OPEN, t),
			close: (t) => U(e, $.CLOSE, t),
			toggle: (t) => U(e, $.TOGGLE, t),
			dock: (t) => U(e, $.DOCK, t),
			float: (t) => U(e, $.FLOAT, t),
			reset: (t) => U(e, $.RESET, t)
		};
		return typeof M == "function" ? M(e, t, o) : /* @__PURE__ */ g("article", {
			className: "cad-workspace-panel-manager__panel",
			"data-panel-id": e.id,
			"data-open": n ? "true" : "false",
			"data-placement": t.placement,
			"data-locked": e.preferenceLocked ? "true" : "false",
			role: "listitem",
			children: [/* @__PURE__ */ g("div", {
				className: "cad-workspace-panel-manager__panel-summary",
				children: [/* @__PURE__ */ g("button", {
					type: "button",
					className: "cad-workspace-panel-manager__visibility",
					"aria-label": `${n ? "Hide" : "Show"} ${e.label}`,
					"aria-pressed": n,
					disabled: !i,
					title: e.preferenceLocked ? `${e.label} preferences are locked` : `${n ? "Hide" : "Show"} ${e.label}`,
					onClick: (t) => U(e, r, t),
					children: [
						/* @__PURE__ */ h("span", {
							className: "cad-workspace-panel-manager__panel-icon",
							"aria-hidden": "true",
							children: un(e, te)
						}),
						/* @__PURE__ */ g("span", {
							className: "cad-workspace-panel-manager__panel-copy",
							children: [/* @__PURE__ */ h("strong", { children: e.label }), e.description && /* @__PURE__ */ h("small", { children: e.description })]
						}),
						/* @__PURE__ */ h("span", {
							className: "cad-workspace-panel-manager__visibility-state",
							"aria-hidden": "true",
							children: n ? "●" : "○"
						})
					]
				}), /* @__PURE__ */ h("output", {
					className: "cad-workspace-panel-manager__state",
					"aria-label": `${e.label} is ${n ? "visible" : "hidden"}`,
					children: n ? "VISIBLE" : "HIDDEN"
				})]
			}), /* @__PURE__ */ g("div", {
				className: "cad-workspace-panel-manager__placement",
				role: "group",
				"aria-label": `${e.label} placement`,
				children: [
					e.placements.includes(Q.DOCK) && /* @__PURE__ */ g("button", {
						type: "button",
						"aria-label": `Dock ${e.label}`,
						"aria-pressed": t.placement === Q.DOCK,
						disabled: e.disabled || e.preferenceLocked || !a,
						onClick: o.dock,
						children: [/* @__PURE__ */ h("span", {
							"aria-hidden": "true",
							children: "▣"
						}), "DOCK"]
					}),
					e.placements.includes(Q.FLOAT) && /* @__PURE__ */ g("button", {
						type: "button",
						"aria-label": `Float ${e.label}`,
						"aria-pressed": t.placement === Q.FLOAT,
						disabled: e.disabled || e.preferenceLocked || !a,
						onClick: o.float,
						children: [/* @__PURE__ */ h("span", {
							"aria-hidden": "true",
							children: "◇"
						}), "FLOAT"]
					}),
					/* @__PURE__ */ h("output", {
						"aria-label": `${e.label} placement: ${dn(t.placement).toLocaleLowerCase()}`,
						children: dn(t.placement)
					}),
					!e.preferenceLocked && /* @__PURE__ */ h("button", {
						type: "button",
						className: "cad-workspace-panel-manager__reset",
						"aria-label": `Reset ${e.label}`,
						title: `Reset ${e.label}`,
						onClick: o.reset,
						children: "↺"
					})
				]
			})]
		});
	};
	return /* @__PURE__ */ h(ht, {
		...F,
		id: K,
		className: J("cad-workspace-panel-manager", N),
		contentClassName: J("cad-workspace-panel-manager__surface", P),
		trigger: W,
		open: v,
		defaultOpen: y,
		onOpenChange: b,
		placement: O,
		label: x,
		contentRole: "dialog",
		content: ({ close: t }) => /* @__PURE__ */ g("section", {
			className: "cad-workspace-panel-manager__content",
			"aria-describedby": S ? `${K}-description` : void 0,
			children: [
				/* @__PURE__ */ g("header", {
					className: "cad-workspace-panel-manager__header",
					children: [/* @__PURE__ */ g("div", { children: [
						/* @__PURE__ */ h("span", {
							className: "cad-workspace-panel-manager__eyebrow",
							children: "WORKSPACE"
						}),
						/* @__PURE__ */ h("h2", { children: x }),
						S && /* @__PURE__ */ h("p", {
							id: `${K}-description`,
							children: S
						})
					] }), /* @__PURE__ */ g("div", {
						className: "cad-workspace-panel-manager__header-actions",
						children: [D && /* @__PURE__ */ h("output", {
							className: "cad-workspace-panel-manager__scope",
							children: D
						}), /* @__PURE__ */ h("button", {
							type: "button",
							className: "cad-workspace-panel-manager__close",
							"aria-label": G,
							title: G,
							onClick: t,
							children: "×"
						})]
					})]
				}),
				V.length > 0 ? /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ g("div", {
					className: "cad-workspace-panel-manager__summary",
					"aria-label": "Workspace panel summary",
					children: [/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("b", { children: ne }), " VISIBLE"] }), /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("b", { children: H }), " FLOATING"] })]
				}), /* @__PURE__ */ h("div", {
					className: "cad-workspace-panel-manager__list",
					role: "list",
					children: V.map((t) => /* @__PURE__ */ h(e.Fragment, { children: ae(t, R[t.id]) }, t.id))
				})] }) : /* @__PURE__ */ h("p", {
					className: "cad-workspace-panel-manager__empty",
					role: "status",
					children: k
				}),
				ee && V.length > 0 && /* @__PURE__ */ g("footer", {
					className: "cad-workspace-panel-manager__footer",
					children: [/* @__PURE__ */ g("button", {
						type: "button",
						"aria-label": A,
						onClick: re,
						children: [
							/* @__PURE__ */ h("span", {
								"aria-hidden": "true",
								children: "↺"
							}),
							" ",
							A
						]
					}), /* @__PURE__ */ h("span", { children: "Host-owned layout state" })]
				})
			]
		})
	});
}
var pn = fn, mn = Object.freeze({
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
}), hn = Object.freeze([
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
]), gn = Object.freeze([
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
]), _n = Object.freeze([
	"1:1",
	"1:2",
	"1:5",
	"1:10",
	"1:20",
	"1:50",
	"1:100"
]), vn = Object.freeze([
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
]), yn = (e) => Y(e).map((e, t) => typeof e == "string" ? {
	id: e,
	label: e
} : {
	...e,
	id: e?.id || `${X(e)}-${t}`,
	label: X(e)
});
function bn({ mode: e = "point", fields: t, value: n, defaultValue: r = {}, onChange: i, onSubmit: a, prompt: o = "Specify point", unit: s = "mm", visible: c = !0, submitLabel: d = "Accept", className: f, children: p, ...m }) {
	let _ = l(), v = Y(t).length ? Y(t) : mn[e] || mn.point, y = u(() => v.reduce((e, t) => t?.id && t.value !== void 0 ? {
		...e,
		[t.id]: t.value
	} : e, {}), [v]), [b, x] = Z(n, u(() => ({
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
		className: J("cad-dynamic-input", f),
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
					return e.type === "angle" ? /* @__PURE__ */ h(Ie, {
						...r,
						unit: e.unit || "°"
					}, n) : e.type === "unit" ? /* @__PURE__ */ h(Fe, { ...r }, n) : /* @__PURE__ */ h(Pe, { ...r }, n);
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
function xn({ modes: e = hn, activeIds: t, defaultActiveIds: n = [], multiple: r = !0, onChange: i, onClose: a, label: o = "Object snaps", className: s, ...c }) {
	let l = u(() => yn(e), [e]), [d, f] = Z(t, n, (e, t, n) => i?.(e, t, n)), p = new Set(Y(d)), m = (e, t) => {
		if (e.disabled) return;
		let n = r ? p.has(e.id) ? [...p].filter((t) => t !== e.id) : [...p, e.id] : p.has(e.id) ? [] : [e.id];
		f(n, e, t);
	};
	return /* @__PURE__ */ g("aside", {
		...c,
		className: J("cad-object-snap-menu", s),
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
					e.shortcut && /* @__PURE__ */ h(De, { shortcut: e.shortcut })
				]
			}, e.id))
		})]
	});
}
function Sn({ tools: e = [], selectionCount: t, label: n = "Selection tools", onAction: r, onDismiss: i, className: a, ...o }) {
	return /* @__PURE__ */ g("aside", {
		...o,
		className: J("cad-grip-toolbar", a),
		"aria-label": n,
		children: [
			t !== void 0 && /* @__PURE__ */ g("output", {
				className: "cad-grip-toolbar__selection",
				children: [t, " selected"]
			}),
			/* @__PURE__ */ h("div", {
				role: "group",
				"aria-label": n,
				children: Y(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ h("span", {
					className: "cad-grip-toolbar__separator",
					role: "separator"
				}, e.id || t) : /* @__PURE__ */ h(Oe, {
					icon: e?.icon,
					label: X(e),
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
function Cn({ constraints: e = gn, activeIds: t, defaultActiveIds: n = [], onChange: r, onAction: i, label: a = "Geometric constraints", className: o, ...s }) {
	let c = u(() => yn(e), [e]), [l, d] = Z(t, n, (e, t, n) => r?.(e, t, n)), f = new Set(Y(l)), p = (e, t) => {
		if (e.disabled) return;
		let n = f.has(e.id) ? [...f].filter((t) => t !== e.id) : [...f, e.id];
		d(n, e, t), i?.(e, t);
	};
	return /* @__PURE__ */ h("div", {
		...s,
		className: J("cad-constraint-bar", o),
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
function wn({ scales: e = _n, value: t, defaultValue: n, onChange: r, label: i = "Annotation scale", onManage: a, id: o, selectProps: s = {}, disabled: c = !1, className: d, ...f }) {
	let p = l(), m = o || `cad-annotation-scale-${p}`, _ = u(() => yn(e), [e]), [v, y] = Z(t, n ?? _[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("div", {
		...f,
		className: J("cad-annotation-scale-picker", d),
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
function Tn({ presets: e = vn, value: t, defaultValue: n, onChange: r, label: i = "View preset", id: a, selectProps: o = {}, disabled: s = !1, className: c, ...d }) {
	let f = l(), p = a || `cad-view-preset-${f}`, m = u(() => yn(e), [e]), [_, v] = Z(t, n ?? m[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("div", {
		...d,
		className: J("cad-view-preset-picker", c),
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
function En({ angle: e, distance: t, increment: n, active: r, defaultActive: i = !1, onActiveChange: a, className: o, label: s = "Polar tracking", ...c }) {
	let [l, u] = Z(r, i, (e, t) => a?.(e, t));
	return /* @__PURE__ */ g("div", {
		...c,
		className: J("cad-polar-tracker", l && "cad-polar-tracker--active", o),
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
function Dn({ type: e = "endpoint", label: t, active: n = !0, className: r, style: i, ...a }) {
	let o = hn.find((t) => t.id === e)?.glyph || "•";
	return /* @__PURE__ */ g("span", {
		...a,
		className: J("cad-object-snap-marker", n && "cad-object-snap-marker--active", r),
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
function On({ label: e = "Selection grip", variant: t = "square", active: n = !1, disabled: r = !1, onPointerDown: i, onClick: a, className: o, ...s }) {
	return /* @__PURE__ */ h("button", {
		...s,
		type: "button",
		className: J("cad-selection-grip", n && "cad-selection-grip--active", o),
		"data-variant": t,
		"aria-label": e,
		disabled: r,
		onPointerDown: i,
		onClick: a,
		children: /* @__PURE__ */ h("span", { "aria-hidden": "true" })
	});
}
//#endregion
//#region src/CadLayoutUi.jsx
var kn = Object.freeze([
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
]), An = Object.freeze([
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
]), jn = Object.freeze([
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
]), Mn = (e) => Y(e).map((e, t) => typeof e == "string" || typeof e == "number" ? {
	id: String(e),
	label: String(e),
	value: e
} : {
	...e,
	id: e?.id || `${X(e)}-${t}`,
	label: X(e)
}), Nn = (e) => typeof e == "string" ? {
	mode: "rgb",
	value: e
} : !e || typeof e != "object" ? { mode: "by-layer" } : {
	...e,
	mode: e.mode || "rgb",
	value: e.value || e.hex
}, Pn = (e) => {
	let t = Nn(e);
	return t.mode === "by-layer" ? "ByLayer" : t.mode === "by-block" ? "ByBlock" : t.value || t.hex || "Color";
};
function Fn({ orientation: e = "horizontal", size: t, defaultSize: n = 30, minSize: r = 12, maxSize: i = 88, keyboardStep: a = 5, primary: o, secondary: s, onSizeChange: l, onResizeStart: u, onResizeEnd: d, separatorLabel: p = "Resize panels", className: m, ..._ }) {
	let v = f(null), y = f(null), b = f(n), x = f(null), S = f(d), C = f(null), w = f(null), T = f(null), E = Number(r), D = Number(i), O = Number.isFinite(E) ? E : 0, k = Math.max(O, Number.isFinite(D) ? D : 100), A = Number(n), ee = Te(Number.isFinite(A) ? A : O, O, k), j = Number(a), M = Number.isFinite(j) && j > 0 ? j : 5, [te, N] = Z(t, n, (e, t, n) => l?.(e, t, n)), P = Number(te), F = Te(Number.isFinite(P) ? P : ee, O, k), I = e === "vertical" ? "y" : "x", L = e === "vertical" ? "horizontal" : "vertical";
	b.current = F, x.current = N, S.current = d, T.current ||= () => {
		typeof window > "u" || (window.removeEventListener("pointermove", C.current), window.removeEventListener("pointerup", w.current), window.removeEventListener("pointercancel", w.current));
	}, C.current ||= (e) => {
		let t = y.current, n = v.current;
		if (!t || !n || t.pointerId !== null && e.pointerId !== t.pointerId) return;
		let r = n.getBoundingClientRect(), i = t.orientation === "vertical" ? r.height : r.width, a = t.orientation === "vertical" ? e.clientY - r.top : e.clientX - r.left;
		if (!Number.isFinite(i) || i <= 0 || !Number.isFinite(a)) return;
		let o = Te(Math.round(a / Math.max(i, 1) * 100 * 10) / 10, t.minSize, t.maxSize);
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
		let n = Te(Number(b.current), t.minSize, t.maxSize);
		b.current = n, S.current?.(n, e);
	}, c(() => () => {
		let e = y.current;
		y.current = null, T.current?.();
		try {
			e?.pointerId !== null && e?.pointerId !== void 0 && e.divider?.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []);
	let R = (t) => {
		if (!(t.button !== 0 || y.current)) {
			t.preventDefault(), b.current = F, y.current = {
				pointerId: t.pointerId ?? null,
				divider: t.currentTarget,
				orientation: e,
				minSize: O,
				maxSize: k,
				axis: I
			};
			try {
				t.pointerId !== void 0 && t.currentTarget.setPointerCapture?.(t.pointerId);
			} catch {}
			u?.(F, t), window.addEventListener("pointermove", C.current), window.addEventListener("pointerup", w.current), window.addEventListener("pointercancel", w.current);
		}
	}, z = (e, t) => {
		let n = Te(Te(Number(b.current), O, k) + e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: I
		}, t);
	}, B = (e, t) => {
		let n = Te(e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: I
		}, t);
	};
	return /* @__PURE__ */ g("section", {
		..._,
		ref: v,
		className: J("cad-split-pane", `cad-split-pane--${e}`, m),
		style: {
			"--cad-split-size": `${F}%`,
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
				"aria-orientation": L,
				"aria-valuemin": O,
				"aria-valuemax": k,
				"aria-valuenow": F,
				"aria-valuetext": `${F}%`,
				tabIndex: 0,
				onPointerDown: R,
				onPointerCancel: w.current,
				onLostPointerCapture: w.current,
				onKeyDown: (t) => {
					let n = e === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"], r = e === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
					if (n.includes(t.key)) {
						t.preventDefault(), z(M, t);
						return;
					}
					if (r.includes(t.key)) {
						t.preventDefault(), z(-M, t);
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
function In({ item: e, open: t, onToggle: n, onAction: r, onClose: i }) {
	let a = Mn(e?.items), o = `cad-menu-bar-popup-${l()}`, s = a.length > 0;
	return /* @__PURE__ */ g("div", {
		className: J("cad-menu-bar__menu", t && "cad-menu-bar__menu--open"),
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
			children: [X(e), e?.shortcut && /* @__PURE__ */ h(De, { shortcut: e.shortcut })]
		}), t && /* @__PURE__ */ h("div", {
			id: o,
			className: "cad-menu-bar__popup",
			role: "menu",
			"aria-label": X(e),
			children: a.map((e) => e.type === "separator" ? /* @__PURE__ */ h("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ h(Ln, {
				item: e,
				onAction: r,
				onClose: i
			}, e.id))
		})]
	});
}
function Ln({ item: e, onAction: t, onClose: n, className: r }) {
	let i = Mn(e?.items), a = i.length > 0, [o, s] = Z(void 0, !1);
	return /* @__PURE__ */ g("div", {
		className: J("cad-submenu", o && "cad-submenu--open", r),
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
					children: X(e)
				}),
				e?.shortcut && /* @__PURE__ */ h(De, { shortcut: e.shortcut }),
				a && /* @__PURE__ */ h("span", {
					className: "cad-submenu__caret",
					"aria-hidden": "true",
					children: "›"
				})
			]
		}), a && o && /* @__PURE__ */ h("div", {
			className: "cad-submenu__popup",
			role: "menu",
			"aria-label": X(e),
			children: i.map((e) => e.type === "separator" ? /* @__PURE__ */ h("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ h(Ln, {
				item: e,
				onAction: t,
				onClose: n
			}, e.id))
		})]
	});
}
function Rn({ items: e = [], openId: t, defaultOpenId: n = "", onOpenChange: r, onAction: i, label: a = "CAD application menu", className: o, ...s }) {
	let l = u(() => Mn(e), [e]), [d, p] = Z(t, n, (e, t, n) => r?.(e, t, n)), m = f(null), g = f(""), _ = l.find((e) => e.id === d && !e.disabled && Mn(e.items).length > 0), v = _?.id || "", y = (e) => {
		!e || typeof window > "u" || window.requestAnimationFrame(() => {
			[...m.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(":scope > button:not(:disabled)")?.focus?.();
		});
	}, b = (e) => {
		[...m.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(".cad-menu-bar__popup [role^=\"menuitem\"]:not(:disabled)")?.focus?.();
	}, x = (e, t, n = !1) => {
		v && (p("", e || _, t), n && y(e?.id || v));
	}, S = (e, t) => {
		if (!(e?.disabled || Mn(e?.items).length === 0)) {
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
		className: J("cad-menu-bar", o),
		role: "menubar",
		"aria-label": a,
		onKeyDown: (e) => {
			if (s.onKeyDown?.(e), !e.defaultPrevented && (e.key === "ArrowRight" && (e.preventDefault(), C(e, 1)), e.key === "ArrowLeft" && (e.preventDefault(), C(e, -1)), e.key === "Escape" && v && (e.preventDefault(), x(_, e, !0)), e.key === "ArrowDown" && document.activeElement?.dataset.menuId)) {
				let t = l.find((e) => e.id === document.activeElement.dataset.menuId);
				t && !t.disabled && Mn(t.items).length > 0 && (e.preventDefault(), t.id === v ? window.requestAnimationFrame(() => b(t.id)) : (g.current = t.id, p(t.id, t, e)));
			}
		},
		children: l.map((e) => /* @__PURE__ */ h(In, {
			item: e,
			open: v === e.id,
			onToggle: S,
			onAction: i,
			onClose: (t) => x(e, t, !0)
		}, e.id))
	});
}
function zn({ value: e, defaultValue: t = { mode: "by-layer" }, onChange: n, colors: r = kn, allowByLayer: i = !0, allowByBlock: a = !0, label: o = "Color", className: s, ...c }) {
	let [l, u] = Z(e, t, (e, t) => n?.(e, t)), d = Nn(l), f = (e, t) => u(e, t);
	return /* @__PURE__ */ g("section", {
		...c,
		className: J("cad-color-picker", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: o }), /* @__PURE__ */ h(Re, {
				color: d.value || (d.mode === "by-layer" ? "#b4bdc7" : "#ffffff"),
				label: Pn(d)
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
				children: Y(r).map((e, t) => {
					let n = typeof e == "string" ? e : e?.value || e?.hex, r = typeof e == "string" ? `Color ${t + 1}` : X(e), i = d.mode === "rgb" && String(d.value || "").toLowerCase() === String(n || "").toLowerCase();
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
function Bn({ value: e, onChange: t, label: n = "Color", className: r, ...i }) {
	let a = Nn(e);
	return /* @__PURE__ */ h(ht, {
		label: n,
		className: J("cad-color-picker-button", r),
		trigger: /* @__PURE__ */ h("button", {
			type: "button",
			className: "cad-color-picker-button__trigger",
			children: /* @__PURE__ */ h(Re, {
				color: a.value || "#b4bdc7",
				label: Pn(a)
			})
		}),
		content: ({ close: r }) => /* @__PURE__ */ h(zn, {
			...i,
			value: e,
			onChange: (e, n) => {
				t?.(e, n), r(n);
			},
			label: n
		})
	});
}
function Vn({ linetypes: e = An, value: t, defaultValue: n, onChange: r, label: i = "Linetype", className: a, ...o }) {
	let s = u(() => Mn(e), [e]), [c, l] = Z(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), d = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ h(ht, {
		label: i,
		className: J("cad-linetype-picker", a),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ h(ze, {
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
				children: /* @__PURE__ */ h(ze, {
					type: t.id,
					label: t.label
				})
			}, t.id))
		})
	});
}
function Hn({ lineweights: e = jn, value: t, defaultValue: n, onChange: r, label: i = "Lineweight", className: a, ...o }) {
	let s = u(() => Mn(e), [e]), [c, l] = Z(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), d = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ h(ht, {
		label: i,
		className: J("cad-lineweight-picker", a),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ h(Be, {
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
					children: /* @__PURE__ */ h(Be, {
						weight: r,
						label: t.label
					})
				}, t.id);
			})
		})
	});
}
function Un({ block: e, selected: t = !1, onSelect: n, onInsert: r, onEdit: i, onDelete: a, renderThumbnail: o, className: s }) {
	let c = e || {}, l = X(c);
	return /* @__PURE__ */ g("article", {
		className: J("cad-block-tile", t && "cad-block-tile--selected", s),
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
function Wn({ blocks: e = [], value: t, defaultValue: n = "", onChange: r, onInsert: i, onCreate: a, onEdit: o, onDelete: s, filter: c, defaultFilter: d = "", onFilterChange: f, view: p = "grid", renderThumbnail: m, title: _ = "Blocks", className: v, emptyLabel: y = "No blocks match the current filter" }) {
	let b = `cad-block-filter-${l()}`, [x, S] = Z(t, n, (e, t, n) => r?.(e, t, n)), [C, w] = Z(c, d, (e, t) => f?.(e, t)), T = u(() => Y(e).filter((e) => `${X(e)} ${e?.category || ""}`.toLocaleLowerCase().includes(String(C || "").toLocaleLowerCase())), [e, C]);
	return /* @__PURE__ */ g("section", {
		className: J("cad-block-palette", `cad-block-palette--${p}`, v),
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
				children: [T.map((e, t) => /* @__PURE__ */ h(Un, {
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
function Gn({ value: e, defaultValue: t = {
	scale: 1,
	rotation: 0,
	uniform: !0,
	specifyOnScreen: !1,
	explode: !1
}, onChange: n, label: r = "Insert options", className: i }) {
	let [a, o] = Z(e, t, (e, t, r) => n?.(e, t, r)), s = (e, t, n) => o({
		...a || {},
		[e]: t
	}, e, n);
	return /* @__PURE__ */ g("fieldset", {
		className: J("cad-block-insert-options", i),
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
function Kn({ value: e, defaultValue: t = "", onChange: n, placeholder: r = "Filter", label: i = "Filter list", className: a, ...o }) {
	let s = l(), [c, u] = Z(e, t, (e, t) => n?.(e, t));
	return /* @__PURE__ */ g("div", {
		className: J("cad-filter-bar", a),
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
function qn({ property: e, value: t, onValueChange: n, inputId: r, className: i }) {
	let a = e || {}, o = a.type || "text", s = t ?? a.value ?? "", c = (e, t) => {
		a.onChange?.(e, a, t), n?.(a.id, e, a, t);
	};
	return typeof a.render == "function" ? /* @__PURE__ */ h("div", {
		className: J("cad-property-field", i),
		children: a.render({
			id: r,
			property: a,
			value: s,
			onChange: c
		})
	}) : a.readOnly || o === "readonly" ? /* @__PURE__ */ h("output", {
		className: J("cad-property-field", "cad-property-field--readonly", i),
		title: String(s),
		children: s || "—"
	}) : o === "toggle" || o === "boolean" ? /* @__PURE__ */ g("label", {
		className: J("cad-property-field", "cad-property-field--toggle", i),
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
		className: J("cad-property-field", i),
		value: s,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e),
		children: Y(a.options).map((e, t) => {
			let n = typeof e == "string" || typeof e == "number" ? {
				value: e,
				label: e
			} : e;
			return /* @__PURE__ */ h("option", {
				value: n.value ?? n.id,
				children: X(n)
			}, n.id || n.value || t);
		})
	}) : o === "color" ? /* @__PURE__ */ g("span", {
		className: J("cad-property-field", "cad-property-field--color", i),
		children: [/* @__PURE__ */ h(Re, {
			color: s || "#ffffff",
			label: s || "#ffffff"
		}), /* @__PURE__ */ h("input", {
			id: r,
			type: "color",
			value: s || "#ffffff",
			disabled: a.disabled,
			onChange: (e) => c(e.target.value, e)
		})]
	}) : o === "cad-color" ? /* @__PURE__ */ h(Bn, {
		value: s,
		onChange: c,
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--cad-color", i),
		colors: a.colors,
		allowByLayer: a.allowByLayer,
		allowByBlock: a.allowByBlock
	}) : o === "linetype" ? /* @__PURE__ */ h(Vn, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--style", i),
		linetypes: a.options
	}) : o === "lineweight" ? /* @__PURE__ */ h(Hn, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--style", i),
		lineweights: a.options
	}) : o === "scale" ? /* @__PURE__ */ h(wn, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--style", i),
		scales: a.options
	}) : o === "number" ? /* @__PURE__ */ h(Pe, {
		id: r,
		className: J("cad-property-field", i),
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
	}) : o === "unit" ? /* @__PURE__ */ h(Fe, {
		id: r,
		className: J("cad-property-field", i),
		value: s,
		unit: a.unit,
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "angle" ? /* @__PURE__ */ h(Ie, {
		id: r,
		className: J("cad-property-field", i),
		value: s,
		unit: a.unit || "°",
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "coordinate" ? /* @__PURE__ */ h(Le, {
		className: J("cad-property-field", i),
		value: s,
		axes: a.axes,
		unit: a.unit,
		disabled: a.disabled,
		onValueChange: (e) => c(e),
		label: a.label || a.id
	}) : o === "multiline" ? /* @__PURE__ */ h("textarea", {
		id: r,
		className: J("cad-property-field", "cad-property-field--multiline", i),
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	}) : /* @__PURE__ */ h("input", {
		id: r,
		className: J("cad-property-field", i),
		type: o,
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	});
}
function Jn({ property: e, value: t, onValueChange: n, className: r }) {
	let i = l(), a = e || {};
	if (a.hidden) return null;
	let o = `cad-property-${i}-${a.id || "field"}`, s = !a.readOnly && typeof a.render != "function" && ![
		"toggle",
		"boolean",
		"coordinate",
		"readonly"
	].includes(a.type || "text");
	return /* @__PURE__ */ g("div", {
		className: J("cad-property-row", a.readOnly && "cad-property-row--readonly", r),
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
		}), /* @__PURE__ */ h(qn, {
			property: a,
			value: t,
			inputId: o,
			onValueChange: n
		})]
	});
}
function Yn({ id: e, title: t, properties: n = [], collapsible: r = !0, open: i, defaultOpen: a = !0, onOpenChange: o, onValueChange: s, className: c, children: u }) {
	let d = l(), f = e || `cad-property-section-${d}`, [p, m] = Z(i, a, (e, t) => o?.(e, t)), _ = r ? /* @__PURE__ */ g("button", {
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
		className: J("cad-property-section", !p && "cad-property-section--closed", c),
		children: [_, /* @__PURE__ */ h("div", {
			id: `${f}-body`,
			className: "cad-property-section__body",
			hidden: !p,
			children: u || Y(n).map((e, t) => /* @__PURE__ */ h(Jn, {
				property: e,
				onValueChange: s
			}, e?.id || t))
		})]
	});
}
function Xn({ sections: e, properties: t, onValueChange: n, label: r = "Properties", className: i, ...a }) {
	let o = Y(e).length ? Y(e) : [{
		id: "properties",
		title: r,
		properties: Y(t)
	}];
	return /* @__PURE__ */ h("section", {
		...a,
		className: J("cad-property-grid", i),
		"aria-label": r,
		children: o.map((e, t) => /* @__PURE__ */ h(Yn, {
			...e,
			onValueChange: n
		}, e?.id || t))
	});
}
function Zn({ layers: e = [], value: t, defaultValue: n, onChange: r, label: i = "Current layer", className: a, disabled: o = !1 }) {
	let [s, c] = Z(t, n ?? Y(e)[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("label", {
		className: J("cad-layer-picker", a),
		children: [/* @__PURE__ */ h("span", { children: i }), /* @__PURE__ */ h("select", {
			value: s,
			disabled: o,
			onChange: (t) => {
				let n = Y(e).find((e) => e?.id === t.target.value);
				c(t.target.value, n, t);
			},
			children: Y(e).map((e, t) => /* @__PURE__ */ h("option", {
				value: e?.id,
				children: X(e)
			}, e?.id || t))
		})]
	});
}
function Qn({ layer: e, active: t = !1, onActivate: n, onLayerChange: r, onColorClick: i, className: a }) {
	let o = e || {}, s = (e, t) => r?.(o.id, e, o, t), c = X(o), l = (e, t, n, i) => r ? /* @__PURE__ */ h("button", {
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
	}), u = /* @__PURE__ */ h(Re, {
		color: o.color || "#ffffff",
		"aria-label": `${c} color`,
		onClick: i ? (e) => i(o, e) : void 0
	}), d = /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: c }), o.description && /* @__PURE__ */ h("small", { children: o.description })] });
	return /* @__PURE__ */ g("div", {
		className: J("cad-layer-row", t && "cad-layer-row--active", a),
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
			/* @__PURE__ */ h(ze, {
				type: o.linetype || "continuous",
				color: o.color || "currentColor",
				label: o.linetype
			}),
			/* @__PURE__ */ h(Be, {
				weight: o.lineweight ?? .25,
				color: o.color || "currentColor",
				label: o.lineweight ? `${o.lineweight} mm` : void 0
			})
		]
	});
}
function $n({ layers: e = [], activeLayerId: t, onActiveLayerChange: n, onLayerChange: r, onAddLayer: i, onDeleteLayer: a, onColorClick: o, title: s = "Layers", filter: c, defaultFilter: l = "", onFilterChange: d, filterable: f = !0, className: p, emptyLabel: m = "No layers match this filter" }) {
	let [_, v] = Z(c, l, (e, t) => d?.(e, t)), y = u(() => Y(e).filter((e) => X(e).toLocaleLowerCase().includes(String(_ || "").toLocaleLowerCase())), [e, _]);
	return /* @__PURE__ */ g("section", {
		className: J("cad-layer-panel", p),
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
			f && /* @__PURE__ */ h(Kn, {
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
				children: [y.map((e, i) => /* @__PURE__ */ h(Qn, {
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
function er({ node: e, level: t, selectedId: n, expandedIds: r, onSelect: i, onExpandedChange: a }) {
	let o = e || {}, s = Y(o.children), c = s.length > 0, l = r.has(o.id), u = o.id === n, d = o.icon, f = (e) => {
		if (!c) return;
		let t = new Set(r);
		l ? t.delete(o.id) : t.add(o.id), a(t, o, e);
	};
	return /* @__PURE__ */ g("li", {
		className: "cad-object-tree__branch",
		children: [/* @__PURE__ */ g("div", {
			className: J("cad-object-tree__entry", u && "cad-object-tree__entry--selected"),
			children: [c ? /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-object-tree__expander",
				"aria-label": `${l ? "Collapse" : "Expand"} ${X(o)}`,
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
					/* @__PURE__ */ h("span", { children: X(o) }),
					o.meta && /* @__PURE__ */ h("small", { children: o.meta })
				]
			})]
		}), c && l && /* @__PURE__ */ h("ul", { children: s.map((e, o) => /* @__PURE__ */ h(er, {
			node: e,
			level: t + 1,
			selectedId: n,
			expandedIds: r,
			onSelect: i,
			onExpandedChange: a
		}, e?.id || o)) })]
	});
}
function tr({ nodes: e = [], selectedId: t, defaultSelectedId: n = "", onSelect: r, expandedIds: i, defaultExpandedIds: a, onExpandedChange: o, label: s = "CAD object tree", className: c, ...l }) {
	let u = a ?? Y(e).filter((e) => e?.expanded).map((e) => e.id), [d, f] = Z(t, n, (e, t, n) => r?.(e, t, n)), [p, m] = Z(i, u, (e, t, n) => o?.(e, t, n)), g = new Set(Y(p));
	return /* @__PURE__ */ h("ul", {
		...l,
		className: J("cad-object-tree", c),
		"aria-label": s,
		children: Y(e).map((e, t) => /* @__PURE__ */ h(er, {
			node: e,
			level: 1,
			selectedId: d,
			expandedIds: g,
			onSelect: (e, t) => f(e.id, e, t),
			onExpandedChange: (e, t, n) => m([...e], t, n)
		}, e?.id || t))
	});
}
function nr({ label: e, value: t = 0, status: n, onCancel: r, className: i }) {
	let a = Math.max(0, Math.min(100, Number(t) || 0));
	return /* @__PURE__ */ g("section", {
		className: J("cad-task-progress", i),
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
function rr({ references: e = [], onReload: t, onUnload: n, className: r, title: i = "External references" }) {
	return /* @__PURE__ */ g("section", {
		className: J("cad-reference-list", r),
		"aria-label": i,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("h2", { children: i }), /* @__PURE__ */ h("span", { children: Y(e).length })] }), /* @__PURE__ */ h("ul", { children: Y(e).map((e, r) => /* @__PURE__ */ g("li", { children: [
			/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: X(e) }), /* @__PURE__ */ h("small", { children: e?.path || e?.detail })] }),
			/* @__PURE__ */ h("em", {
				"data-status": e?.status || "loaded",
				children: e?.status || "loaded"
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-reference-list__actions",
				children: [t && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `Reload ${X(e)}`,
					onClick: (n) => t(e, n),
					children: "Reload"
				}), n && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `Unload ${X(e)}`,
					onClick: (t) => n(e, t),
					children: "Unload"
				})]
			})
		] }, e?.id || r)) })]
	});
}
//#endregion
//#region src/CadDataUi.jsx
var ir = (e, t) => typeof t?.render == "function" ? t.render(e, t) : typeof t?.accessor == "function" ? t.accessor(e, t) : e?.[t?.accessor || t?.id], ar = (e, t) => {
	let n = typeof t?.sortValue == "function" ? t.sortValue(e, t) : ir(e, t);
	return typeof n == "string" ? n.toLocaleLowerCase() : n;
};
function or({ columns: e = [], rows: t = [], rowId: n = (e) => e?.id, selectedIds: r, defaultSelectedIds: i = [], onSelectionChange: a, selectionMode: o = "multiple", onRowActivate: s, sort: c, defaultSort: l, onSortChange: d, caption: f = "CAD data", emptyLabel: p = "No rows to display", className: m, ..._ }) {
	let v = u(() => Y(e).filter((e) => e?.id), [e]), [y, b] = Z(r, i, (e, t, n) => a?.(e, t, n)), [x, S] = Z(c, l, (e, t, n) => d?.(e, t, n)), C = new Set(Y(y)), w = u(() => {
		let e = [...Y(t)], n = v.find((e) => e.id === x?.columnId);
		if (!n || !x?.direction) return e;
		let r = x.direction === "desc" ? -1 : 1;
		return e.sort((e, t) => String(ar(e, n) ?? "").localeCompare(String(ar(t, n) ?? ""), void 0, { numeric: !0 }) * r);
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
		className: J("cad-data-grid", m),
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
							"aria-label": `Select ${X(e) || r || t + 1}`,
							checked: i,
							onChange: (t) => T(e, t)
						})
					}), v.map((t) => /* @__PURE__ */ h("td", {
						"data-align": t.align || "start",
						children: ir(e, t) ?? "—"
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
function sr({ filters: e = [], activeIds: t, defaultActiveIds: n = [], onChange: r, label: i = "Selection filter", className: a, ...o }) {
	let [s, c] = Z(t, n, (e, t, n) => r?.(e, t, n)), l = new Set(Y(s));
	return /* @__PURE__ */ g("section", {
		...o,
		className: J("cad-selection-filter", a),
		"aria-label": i,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: i }), /* @__PURE__ */ g("output", { children: [
			l.size,
			"/",
			Y(e).length
		] })] }), /* @__PURE__ */ h("div", {
			role: "group",
			"aria-label": i,
			children: Y(e).map((e, t) => {
				let n = e?.id || `${X(e)}-${t}`, r = l.has(n), i = e?.icon;
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
						/* @__PURE__ */ h("span", { children: X(e) }),
						e?.count !== void 0 && /* @__PURE__ */ h("em", { children: e.count })
					]
				}, n);
			})
		})]
	});
}
function cr({ candidates: e = [], activeId: t, defaultActiveId: n, onChange: r, onAccept: i, onCancel: a, label: o = "Selection cycle", className: s, ...c }) {
	let l = u(() => Y(e).map((e, t) => ({
		...e,
		id: e?.id || `${X(e)}-${t}`
	})), [e]), [d, f] = Z(t, n ?? l[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), p = Math.max(0, l.findIndex((e) => e.id === d)), m = l[p], _ = (e, t) => {
		if (!l.length) return;
		let n = l[(p + e + l.length) % l.length];
		f(n.id, n, t);
	};
	return l.length ? /* @__PURE__ */ g("aside", {
		...c,
		className: J("cad-selection-cycler", s),
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
				/* @__PURE__ */ h("strong", { children: X(m) }),
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
function lr({ title: e = "Quick properties", properties: t, sections: n, onValueChange: r, onPinChange: i, pinned: a = !1, onClose: o, className: s, ...c }) {
	return /* @__PURE__ */ g("aside", {
		...c,
		className: J("cad-quick-properties", s),
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
		})] })] }), /* @__PURE__ */ h(Xn, {
			properties: t,
			sections: n,
			onValueChange: r,
			label: e
		})]
	});
}
//#endregion
//#region src/CadWorkspaceProfiles.js
var ur = (e) => String(e ?? "").trim(), dr = "model", fr = (e) => {
	let t = ur(e).toLowerCase();
	return /^[a-z0-9][a-z0-9-]{0,63}$/.test(t) ? t : "";
}, pr = (e, t) => ur(e).replace(/\s+/g, " ").slice(0, 48) || t;
function mr(e, { modelId: t = dr, modelName: n = "Model" } = {}) {
	let r = fr(t) || "model", i = Array.isArray(e) ? e : Array.isArray(e?.profiles) ? e.profiles : [], a = /* @__PURE__ */ new Set(), o = i.reduce((e, t, i) => {
		let o = fr(t?.id) || (i === 0 ? r : "");
		return !o || a.has(o) ? e : (a.add(o), e.push({
			...t,
			id: o,
			name: pr(t?.name ?? t?.label, o === r ? n : `Layout ${e.length}`),
			system: o === r || !!t?.system
		}), e);
	}, []), s = o.findIndex((e) => e.id === r);
	return [s >= 0 ? {
		...o[s],
		id: r,
		name: pr(o[s].name, n),
		system: !0
	} : {
		id: r,
		name: n,
		system: !0
	}, ...o.filter((e) => e.id !== r)];
}
function hr(e, { prefix: t = "Layout", modelId: n = dr } = {}) {
	let r = mr(e, { modelId: n }), i = new Set(r.map((e) => e.name.toLocaleLowerCase())), a = Math.max(1, r.filter((e) => e.id !== n).length + 1), o = `${ur(t) || "Layout"} ${a}`;
	for (; i.has(o.toLocaleLowerCase());) a += 1, o = `${ur(t) || "Layout"} ${a}`;
	return o;
}
function gr(e, { id: t, name: n, modelId: r = dr, modelName: i = "Model", prefix: a = "Layout", ...o } = {}) {
	let s = mr(e, {
		modelId: r,
		modelName: i
	}), c = new Set(s.map((e) => e.id)), l = fr(t) || "layout", u = l, d = 1;
	for (; c.has(u);) d += 1, u = `${l}-${d}`;
	return [...s, {
		...o,
		id: u,
		name: pr(n, hr(s, {
			prefix: a,
			modelId: r
		})),
		system: !1
	}];
}
function _r(e, t, n, { modelId: r = dr, modelName: i = "Model" } = {}) {
	let a = fr(t);
	return !a || !ur(n) ? mr(e, {
		modelId: r,
		modelName: i
	}) : mr(e, {
		modelId: r,
		modelName: i
	}).map((e) => e.id === a ? {
		...e,
		name: pr(n, e.name)
	} : e);
}
function vr(e, t, n, { modelId: r = dr, modelName: i = "Model" } = {}) {
	let a = mr(e, {
		modelId: r,
		modelName: i
	}), o = fr(t), s = o && o !== r ? a.filter((e) => e.id !== o) : a;
	return {
		profiles: s,
		activeId: s.some((e) => e.id === n) ? n : r
	};
}
//#endregion
//#region src/CadWorkspaceUi.jsx
var yr = (e) => Y(e).find((e) => !e?.disabled)?.id || "", br = (e, t) => typeof e == "string" ? {
	id: `${e}-${t}`,
	label: e
} : {
	id: e?.id || `${X(e)}-${t}`,
	label: X(e),
	detail: e?.detail,
	tone: e?.tone
};
function xr({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, onCreate: a, onContextMenu: o, onRename: s, onOverflow: c, addLabel: d = "New layout", addButtonProps: f = {}, overflowLabel: p = "More drawing spaces", overflowButtonProps: m = {}, ariaLabel: _ = "Drawing spaces", className: v, ...y }) {
	let b = l(), x = u(() => Y(e).map((e, t) => ({
		...e,
		id: e?.id || `space-${t}`
	})), [e]), [S, C] = Z(t, n || yr(x), (e, t, n) => r?.(e, t, n)), w = x.some((e) => e.id === S) ? S : yr(x), T = (e, t) => {
		!e || e.disabled || C(e.id, e, t);
	}, E = (e) => document.getElementById(`cad-space-tab-${b}-${e.id}`)?.focus(), D = (e, t) => {
		let n = x.filter((e) => !e.disabled);
		if (!n.length) return;
		let r = n[(Math.max(0, n.findIndex((e) => e.id === w)) + t + n.length) % n.length];
		e.preventDefault(), T(r, e), E(r);
	};
	return /* @__PURE__ */ h("nav", {
		...y,
		className: J("cad-drawing-space-tabs", v),
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
							className: J("cad-drawing-space-tabs__item", r && "cad-drawing-space-tabs__item--active"),
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
								"aria-label": e?.ariaLabel || X(e),
								disabled: e?.disabled,
								tabIndex: r ? 0 : -1,
								title: e?.title || X(e),
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
									/* @__PURE__ */ h("span", { children: X(e) }),
									e?.dirty && /* @__PURE__ */ h("i", {
										"aria-label": "Unsaved changes",
										title: "Unsaved changes"
									})
								]
							}), c && /* @__PURE__ */ h("button", {
								type: "button",
								className: "cad-drawing-space-tabs__close",
								"aria-label": `Close ${X(e)}`,
								title: `Close ${X(e)}`,
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
					className: J("cad-drawing-space-tabs__add", f.className),
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
					className: J("cad-drawing-space-tabs__overflow", m.className),
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
var Sr = xr, Cr = xr;
function wr({ profiles: e = [], activeId: t, onChange: n, onCreate: r, onClose: i, onRename: a, modelId: o = dr, modelName: s = "Model", className: c, ...l }) {
	let d = u(() => mr(e, {
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
	return /* @__PURE__ */ h(xr, {
		...l,
		className: J("cad-workspace-profile-tabs", c),
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
function Tr({ title: e, icon: t, actions: n, collapsible: r = !1, collapsed: i, defaultCollapsed: a = !1, onCollapsedChange: o, className: s, children: c, ...u }) {
	let d = `cad-dock-panel-body-${l()}`, [f, p] = Z(i, a, (e, t) => o?.(e, t));
	return /* @__PURE__ */ g("section", {
		...u,
		className: J("cad-dock-panel", f && "cad-dock-panel--collapsed", s),
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
function Er({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, label: a = "Docked panels", className: o, children: s, renderPanel: c, ...u }) {
	let d = l(), [f, p] = Z(t, n || yr(e), (e, t, n) => r?.(e, t, n)), m = Y(e).find((e) => e?.id === f) || Y(e).find((e) => !e?.disabled), _ = (e, t) => {
		!e || e.disabled || p(e.id, e, t);
	}, v = (t) => {
		if (!t.target.closest("[role=\"tab\"]")) return;
		let n = Y(e).filter((e) => !e?.disabled);
		if (!n.length) return;
		let r = Math.max(0, n.findIndex((e) => e.id === m?.id)), i;
		t.key === "ArrowRight" && (i = n[(r + 1) % n.length]), t.key === "ArrowLeft" && (i = n[(r - 1 + n.length) % n.length]), t.key === "Home" && (i = n[0]), t.key === "End" && (i = n[n.length - 1]), i && (t.preventDefault(), _(i, t), document.getElementById(`cad-dock-tab-${d}-${i.id}`)?.focus());
	}, y = m?.panelId || `cad-dock-panel-${d}-${m?.id || "empty"}`;
	return /* @__PURE__ */ g("section", {
		...u,
		className: J("cad-dock-tabs", o),
		children: [/* @__PURE__ */ h("div", {
			className: "cad-dock-tabs__list",
			role: "tablist",
			"aria-label": a,
			onKeyDown: v,
			children: Y(e).map((e, t) => {
				let n = e?.id === m?.id, r = e?.icon;
				return /* @__PURE__ */ g("div", {
					className: J("cad-dock-tabs__tab-wrap", n && "cad-dock-tabs__tab-wrap--active"),
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
							/* @__PURE__ */ h("span", { children: X(e) }),
							e?.badge && /* @__PURE__ */ h("em", { children: e.badge })
						]
					}), i && e?.closable && /* @__PURE__ */ h("button", {
						type: "button",
						className: "cad-dock-tabs__close",
						"aria-label": `Close ${X(e)}`,
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
function Dr({ mode: e, label: t, active: n, disabled: r = !1, shortcut: i, tone: a = "inherit", onChange: o, className: s }) {
	let c = t || X(e), l = n ?? e?.active ?? !1, u = r || e?.disabled;
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: J("cad-status-toggle", s),
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
var Or = (e) => e == null || e === "" ? "" : typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map((e, t) => `${"XYZ"[t] || t}: ${e}`).join("  ") : [
	"x",
	"y",
	"z"
].filter((t) => e[t] !== void 0).map((t) => `${t.toUpperCase()}: ${e[t]}`).join("  ");
function kr({ coordinates: e, coordinateLabel: t = "Coordinates", modes: n = [], onModeChange: r, units: i, scale: a, message: o, className: s, children: c, ...l }) {
	let u = Or(e);
	return /* @__PURE__ */ g("footer", {
		...l,
		className: J("cad-status-bar", s),
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
				children: Y(n).map((e, t) => /* @__PURE__ */ h(Dr, {
					mode: e,
					onChange: (t, n, i) => {
						e?.onChange?.(t, n, i), r?.(e?.id, t, n, i);
					}
				}, e?.id || X(e) || t))
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
function Ar({ items: e = [], label: t = "Command history", onSelect: n, className: r }) {
	let i = u(() => Y(e).map(br), [e]);
	return /* @__PURE__ */ h("ol", {
		className: J("cad-command-history", r),
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
function jr({ options: e = [], label: t = "Command options", onSelect: n, className: r }) {
	return /* @__PURE__ */ h("div", {
		className: J("cad-command-options", r),
		role: "group",
		"aria-label": t,
		children: Y(e).map((e, t) => {
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
				children: [X(r), r?.shortcut && /* @__PURE__ */ h("kbd", { children: r.shortcut })]
			}, r?.id || t);
		})
	});
}
var Mr = (e, t, n, r) => {
	let i = Number(e), a = Number(t);
	return Math.min(r, Math.max(n, Math.round(Number.isFinite(i) ? i : Number.isFinite(a) ? a : 152)));
};
function Nr({ value: e, defaultValue: t = "", onChange: n, onSubmit: r, prompt: i = "Command:", history: a = [], suggestions: o = [], options: s = [], onSuggestionSelect: c, onOptionSelect: d, clearOnSubmit: m = !0, submitSuggestionOnEnter: _ = !1, disabled: v = !1, placeholder: y = "Type a command or search", showHistory: b = !0, height: x, defaultHeight: S = 152, minHeight: C = 72, maxHeight: w = 360, resizeStep: T = 8, resizable: E = !0, onHeightChange: D, className: O, inputProps: k = {}, style: A, id: ee, ...j }) {
	let M = l(), [te, N] = Z(e, t, (e, t) => n?.(e, t)), P = Number(C), F = Math.max(48, Number.isFinite(P) ? Math.round(P) : 72), I = Number(w), L = Math.max(F, Number.isFinite(I) ? Math.round(I) : 360), R = Mr(S, 152, F, L), [z, B] = Z(x, R, (e, t) => D?.(e, t)), V = Mr(z, R, F, L), ne = Math.max(1, Number.isFinite(Number(T)) ? Math.round(Number(T)) : 8), H = f(null), [U, re] = p(!1), [ie, W] = p(-1), G = u(() => Y(o).map(br), [o]), K = `cad-command-suggestions-${M}`, ae = ee || `cad-command-line-${M}`, q = (e, t) => {
		let n = Mr(typeof e == "function" ? e(V) : e, V, F, L);
		n !== V && B(n, t);
	}, oe = (e) => {
		if (!H.current) return;
		let t = H.current.pointerId;
		H.current = null, e?.currentTarget?.hasPointerCapture?.(t) && e.currentTarget.releasePointerCapture?.(t);
	}, se = (e) => {
		!E || e.button !== 0 || (e.preventDefault(), H.current = {
			pointerId: e.pointerId,
			startY: e.clientY,
			startHeight: V
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, ce = (e) => {
		let t = H.current;
		!t || t.pointerId !== e.pointerId || q(t.startHeight + t.startY - e.clientY, e);
	}, le = (e, t, n = !1) => {
		e && (N(e.label, t), c?.(e, t), n && (r?.(e.label, t), m && N("", t)), W(-1));
	}, ue = (e) => {
		if (e.preventDefault(), ie >= 0 && G[ie]) {
			le(G[ie], e, _);
			return;
		}
		let t = String(te ?? "").trim();
		t && (r?.(t, e), m && N("", e));
	}, de = U && G.length > 0, fe = s.length > 0 || b && a.length > 0;
	return /* @__PURE__ */ g("section", {
		...j,
		id: ae,
		className: J("cad-command-line", O),
		style: {
			...A,
			"--cad-command-line-height": `${V}px`
		},
		"aria-label": "CAD command line",
		children: [
			E && /* @__PURE__ */ h("div", {
				className: "cad-command-line__resize-handle",
				role: "separator",
				tabIndex: 0,
				"aria-label": "Resize command line",
				"aria-controls": ae,
				"aria-orientation": "horizontal",
				"aria-valuemin": F,
				"aria-valuemax": L,
				"aria-valuenow": V,
				"aria-valuetext": `${V} pixels`,
				onPointerDown: se,
				onPointerMove: ce,
				onPointerUp: oe,
				onPointerCancel: oe,
				onKeyDown: (e) => {
					let t = e.shiftKey ? ne * 3 : ne;
					e.key === "ArrowUp" && (e.preventDefault(), q(V + t, e)), e.key === "ArrowDown" && (e.preventDefault(), q(V - t, e)), e.key === "PageUp" && (e.preventDefault(), q(V + t * 3, e)), e.key === "PageDown" && (e.preventDefault(), q(V - t * 3, e)), e.key === "Home" && (e.preventDefault(), q(F, e)), e.key === "End" && (e.preventDefault(), q(L, e));
				}
			}),
			/* @__PURE__ */ g("form", {
				className: "cad-command-line__form",
				onSubmit: ue,
				children: [
					/* @__PURE__ */ h("label", {
						htmlFor: `cad-command-input-${M}`,
						className: "cad-command-line__prompt",
						children: i
					}),
					/* @__PURE__ */ h("input", {
						...k,
						id: `cad-command-input-${M}`,
						className: "cad-command-line__input",
						value: te ?? "",
						disabled: v,
						placeholder: y,
						autoComplete: "off",
						role: "combobox",
						"aria-autocomplete": G.length ? "list" : void 0,
						"aria-expanded": de,
						"aria-controls": K,
						"aria-activedescendant": de && ie >= 0 ? `${K}-${ie}` : void 0,
						onFocus: (e) => {
							re(!0), k.onFocus?.(e);
						},
						onBlur: (e) => {
							re(!1), W(-1), k.onBlur?.(e);
						},
						onChange: (e) => {
							N(e.target.value, e), W(-1), k.onChange?.(e);
						},
						onKeyDown: (e) => {
							e.key === "ArrowDown" && G.length && (e.preventDefault(), W((e) => (e + 1) % G.length)), e.key === "ArrowUp" && G.length && (e.preventDefault(), W((e) => (e - 1 + G.length) % G.length)), e.key === "Escape" && (W(-1), re(!1), e.currentTarget.blur()), k.onKeyDown?.(e);
						}
					}),
					/* @__PURE__ */ h("button", {
						type: "submit",
						className: "cad-command-line__submit",
						disabled: v,
						"aria-label": "Run command",
						children: "↵"
					})
				]
			}),
			de && /* @__PURE__ */ h("div", {
				id: K,
				className: "cad-command-line__suggestions",
				role: "listbox",
				"aria-label": "Command suggestions",
				children: G.map((e, t) => /* @__PURE__ */ g("button", {
					id: `${K}-${t}`,
					type: "button",
					role: "option",
					"aria-selected": ie === t,
					"data-active": ie === t ? "true" : "false",
					onMouseDown: (e) => e.preventDefault(),
					onClick: (t) => le(e, t),
					children: [/* @__PURE__ */ h("strong", { children: e.label }), e.detail && /* @__PURE__ */ h("small", { children: e.detail })]
				}, e.id))
			}),
			fe && /* @__PURE__ */ g("div", {
				className: "cad-command-line__transcript",
				children: [s.length > 0 && /* @__PURE__ */ h(jr, {
					options: s,
					onSelect: d
				}), b && a.length > 0 && /* @__PURE__ */ h(Ar, {
					items: a,
					onSelect: (e, t) => N(e.label, t)
				})]
			})
		]
	});
}
function Pr({ activeView: e = "top", onViewChange: t, className: n, label: r = "View cube" }) {
	return /* @__PURE__ */ g("div", {
		className: J("cad-view-cube", n),
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
function Fr({ xLabel: e = "X", yLabel: t = "Y", zLabel: n = "Z", className: r, label: i = "UCS orientation" }) {
	return /* @__PURE__ */ g("svg", {
		className: J("cad-ucs-indicator", r),
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
function Ir({ activeView: e, onViewChange: t, onZoomIn: n, onZoomOut: r, onZoomExtents: i, showCube: a = !0, showUcs: o = !0, className: s }) {
	return /* @__PURE__ */ g("aside", {
		className: J("cad-viewport-controls", s),
		"aria-label": "Viewport controls",
		children: [
			a && /* @__PURE__ */ h(Pr, {
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
			o && /* @__PURE__ */ h(Fr, {})
		]
	});
}
function Lr({ count: e = 0, entityLabel: t = "objects", fields: n = [], emptyLabel: r = "Nothing selected", className: i }) {
	return /* @__PURE__ */ g("output", {
		className: J("cad-selection-summary", i),
		"aria-live": "polite",
		children: [/* @__PURE__ */ h("strong", { children: e ? `${e} ${t}` : r }), Y(n).length > 0 && /* @__PURE__ */ h("span", { children: Y(n).map((e, t) => /* @__PURE__ */ g("small", { children: [
			e?.label,
			": ",
			/* @__PURE__ */ h("b", { children: e?.value })
		] }, e?.id || t)) })]
	});
}
function Rr({ distance: e, angle: t, area: n, volume: r, className: i, label: a = "Measurement" }) {
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
		className: J("cad-measure-readout", i),
		"aria-label": a,
		children: o.map((e) => /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("small", { children: e.label }), /* @__PURE__ */ h("b", { children: e.value })] }, e.id))
	}) : null;
}
//#endregion
export { N as CAD_CUI_RUNTIME_VERSION, dr as CAD_WORKSPACE_MODEL_ID, $ as CAD_WORKSPACE_PANEL_ACTIONS, Q as CAD_WORKSPACE_PANEL_PLACEMENTS, E as CadActionButton, Ie as CadAngleInput, wn as CadAnnotationScalePicker, Gn as CadBlockInsertOptions, Wn as CadBlockPalette, Un as CadBlockTile, zn as CadColorPicker, Bn as CadColorPickerButton, Re as CadColorSwatch, Ar as CadCommandHistory, Nr as CadCommandLine, jr as CadCommandOptions, vt as CadCommandPrompt, Mt as CadCompactWorkspaceRibbon, ft as CadConfirmDialog, Cn as CadConstraintBar, Le as CadCoordinateInput, Ce as CadCuiCommandPalette, Se as CadCuiContextMenu, we as CadCuiCustomizer, he as CadCuiProvider, xe as CadCuiQuickAccess, be as CadCuiRibbon, or as CadDataGrid, O as CadDataRow, dt as CadDialog, Tr as CadDockPanel, Er as CadDockTabs, Cr as CadDocumentTabs, xr as CadDrawingSpaceTabs, bn as CadDynamicInput, ee as CadEmptyState, Kn as CadFilterBar, Sn as CadGripToolbar, D as CadIconButton, $n as CadLayerPanel, Zn as CadLayerPicker, Qn as CadLayerRow, Sr as CadLayoutTabs, Vn as CadLinetypePicker, ze as CadLinetypePreview, Hn as CadLineweightPicker, Be as CadLineweightPreview, Rr as CadMeasureReadout, Ue as CadMenu, Rn as CadMenuBar, He as CadMenuItem, Ve as CadMenuSeparator, zt as CadNavigationBar, Pe as CadNumericInput, Dn as CadObjectSnapMarker, xn as CadObjectSnapMenu, tr as CadObjectTree, We as CadOverflowMenu, A as CadPanelFooter, C as CadPanelHeader, w as CadPanelSection, S as CadPanelShell, En as CadPolarTracker, ht as CadPopover, qn as CadPropertyField, Xn as CadPropertyGrid, Jn as CadPropertyRow, Yn as CadPropertySection, lr as CadQuickProperties, rr as CadReferenceList, T as CadSegmentTabs, cr as CadSelectionCycler, sr as CadSelectionFilter, On as CadSelectionGrip, Ht as CadSelectionSetPanel, Lr as CadSelectionSummary, De as CadShortcutHint, _t as CadShortcutReference, Ae as CadSplitButton, Fn as CadSplitPane, k as CadStatGrid, kr as CadStatusBar, Dr as CadStatusToggle, Ln as CadSubmenu, nr as CadTaskProgress, pt as CadToast, mt as CadToastStack, ke as CadToggleButton, Oe as CadToolButton, Ne as CadToolPalette, Me as CadToolbar, je as CadToolbarGroup, gt as CadTooltip, Fr as CadUcsIndicator, Fe as CadUnitInput, Pr as CadViewCube, Tn as CadViewPresetPicker, Ir as CadViewportControls, Vt as CadViewportScalePicker, Bt as CadVisualStylePicker, fn as CadWorkspacePanelManager, pn as CadWorkspacePanelPreferences, wr as CadWorkspaceProfileTabs, it as CadWorkspaceRibbon, G as DEFAULT_CAD_CUI_SYSTEM, sn as createCadWorkspacePanelPreferencesKey, gr as createCadWorkspaceProfile, W as defineCadCuiSystem, tn as getCadWorkspacePanelPreference, et as groupCadWorkspaceRibbonCommands, ue as loadCadCuiState, hr as nextCadWorkspaceLayoutName, Xt as normalizeCadWorkspacePanelPlacement, en as normalizeCadWorkspacePanelPreferences, Qt as normalizeCadWorkspacePanels, mr as normalizeCadWorkspaceProfiles, vr as removeCadWorkspaceProfile, _r as renameCadWorkspaceProfile, on as resetCadWorkspacePanelPreferences, kt as resolveCadCompactWorkspaceRibbonGroups, oe as resolveCadCuiCommand, se as resolveCadCuiCommandState, le as sanitizeCadCuiState, de as saveCadCuiState, pe as selectCadCuiCommandGroups, fe as selectCadCuiCommands, an as updateCadWorkspacePanelPreference, ge as useCadCui, _e as useCadCuiCommand, cn as useCadWorkspacePanelPreferences };
