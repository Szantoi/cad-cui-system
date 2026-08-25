import e, { cloneElement as t, createContext as n, createElement as r, forwardRef as i, isValidElement as a, useCallback as o, useContext as s, useDeferredValue as c, useEffect as l, useId as u, useMemo as d, useReducer as f, useRef as p, useState as m } from "react";
import { Fragment as h, jsx as g, jsxs as _ } from "react/jsx-runtime";
import { useLocation as v, useNavigate as y } from "react-router-dom";
//#region src/GraphCadUi.tsx
var b = Object.freeze({
	cyan: "#00fbfb",
	blue: "#4bc8ff",
	magenta: "#ff00ff",
	violet: "#b86dff",
	green: "#80ff00",
	amber: "#ff8a00",
	neutral: "#94a3b8"
}), x = (...e) => e.filter(Boolean).join(" "), S = (e) => b[e] || e || b.cyan;
function C({ as: t = "section", tone: n = "cyan", density: r = "regular", visualStrength: i = "standard", scroll: a = !0, className: o, style: s, children: c, ...l }) {
	return e.createElement(t, {
		...l,
		"data-tone": n,
		"data-density": r,
		"data-visual-strength": i,
		className: x("cad-ui-panel", a && "cad-ui-panel--scroll", o),
		style: {
			"--cad-ui-accent": S(n),
			...s
		}
	}, c);
}
function w({ icon: e, eyebrow: t, title: n, description: r, status: i, actions: a, compact: o = !1, className: s, children: c }) {
	return /* @__PURE__ */ _("header", {
		className: x("cad-ui-panel__header", o && "cad-ui-panel__header--compact", s),
		children: [/* @__PURE__ */ _("div", {
			className: "cad-ui-panel__heading",
			children: [e && /* @__PURE__ */ g("span", {
				className: "cad-ui-panel__icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ g(e, { size: o ? 12 : 14 })
			}), /* @__PURE__ */ _("div", {
				className: "cad-ui-panel__copy",
				children: [
					t && /* @__PURE__ */ g("p", {
						className: "cad-ui-panel__eyebrow",
						children: t
					}),
					n && /* @__PURE__ */ g("h2", {
						className: "cad-ui-panel__title",
						children: n
					}),
					r && /* @__PURE__ */ g("p", {
						className: "cad-ui-panel__description",
						children: r
					}),
					c
				]
			})]
		}), (i || a) && /* @__PURE__ */ _("div", {
			className: "cad-ui-panel__header-actions",
			children: [i && /* @__PURE__ */ g("span", {
				className: "cad-ui-status",
				children: i
			}), a]
		})]
	});
}
function T({ as: t = "section", icon: n, eyebrow: r, title: i, description: a, actions: o, compact: s = !1, className: c, children: l, ...u }) {
	let d = /* @__PURE__ */ _(h, { children: [!!(n || r || i || a || o) && /* @__PURE__ */ _("header", {
		className: "cad-ui-section__header",
		children: [/* @__PURE__ */ _("div", {
			className: "cad-ui-section__copy",
			children: [
				(n || r) && /* @__PURE__ */ _("p", {
					className: "cad-ui-section__eyebrow",
					children: [n && /* @__PURE__ */ g(n, {
						size: 11,
						"aria-hidden": "true"
					}), r]
				}),
				i && /* @__PURE__ */ g("h3", {
					className: "cad-ui-section__title",
					children: i
				}),
				a && /* @__PURE__ */ g("p", {
					className: "cad-ui-section__description",
					children: a
				})
			]
		}), o && /* @__PURE__ */ g("div", {
			className: "cad-ui-section__actions",
			children: o
		})]
	}), /* @__PURE__ */ g("div", {
		className: "cad-ui-section__body",
		children: l
	})] });
	return e.createElement(t, {
		...u,
		className: x("cad-ui-section", s && "cad-ui-section--compact", c)
	}, d);
}
function E({ items: e, activeId: t, onChange: n, label: r, className: i }) {
	return /* @__PURE__ */ g("div", {
		className: x("cad-ui-segment-tabs", i),
		role: "tablist",
		"aria-label": r,
		children: e.map(({ id: e, label: r, icon: i, disabled: a = !1 }) => /* @__PURE__ */ _("button", {
			type: "button",
			role: "tab",
			"aria-selected": t === e,
			disabled: a,
			onClick: () => n(e),
			children: [i && /* @__PURE__ */ g(i, {
				size: 11,
				"aria-hidden": "true"
			}), /* @__PURE__ */ g("span", { children: r })]
		}, e))
	});
}
function D({ icon: e, tone: t = "inherit", compact: n = !1, className: r, children: i, type: a = "button", ...o }) {
	return /* @__PURE__ */ _("button", {
		...o,
		type: a,
		"data-tone": t,
		className: x("cad-ui-action", n && "cad-ui-action--compact", r),
		children: [e && /* @__PURE__ */ g(e, {
			size: n ? 11 : 13,
			"aria-hidden": "true"
		}), /* @__PURE__ */ g("span", { children: i })]
	});
}
function O({ icon: e, label: t, tone: n = "inherit", className: r, type: i = "button", ...a }) {
	return /* @__PURE__ */ g("button", {
		...a,
		type: i,
		"data-tone": n,
		className: x("cad-ui-icon-action", r),
		"aria-label": t,
		title: t,
		children: e && /* @__PURE__ */ g(e, {
			size: 13,
			"aria-hidden": "true"
		})
	});
}
function k({ as: t = "div", icon: n, title: r, detail: i, meta: a, status: o, actions: s, active: c = !1, tone: l = "inherit", className: u, children: d, ...f }) {
	let p = /* @__PURE__ */ _(h, { children: [
		n && /* @__PURE__ */ g("span", {
			className: "cad-ui-data-row__icon",
			"aria-hidden": "true",
			children: /* @__PURE__ */ g(n, { size: 13 })
		}),
		/* @__PURE__ */ _("span", {
			className: "cad-ui-data-row__copy",
			children: [
				r && /* @__PURE__ */ g("strong", { children: r }),
				i && /* @__PURE__ */ g("small", { children: i }),
				d
			]
		}),
		(a || o || s) && /* @__PURE__ */ _("span", {
			className: "cad-ui-data-row__trailing",
			children: [
				a && /* @__PURE__ */ g("em", { children: a }),
				o && /* @__PURE__ */ g("span", {
					className: "cad-ui-status",
					children: o
				}),
				s
			]
		})
	] }), m = t === "button" && !f.type ? {
		...f,
		type: "button"
	} : f;
	return e.createElement(t, {
		...m,
		"data-active": c ? "true" : "false",
		"data-tone": l,
		className: x("cad-ui-data-row", u)
	}, p);
}
function A({ items: e, className: t, label: n = "Summary data" }) {
	return /* @__PURE__ */ g("dl", {
		className: x("cad-ui-stat-grid", t),
		"aria-label": n,
		children: e.map((e) => /* @__PURE__ */ _("div", {
			"data-tone": e.tone || "inherit",
			children: [
				/* @__PURE__ */ g("dt", { children: e.label }),
				/* @__PURE__ */ g("dd", { children: e.value }),
				e.detail && /* @__PURE__ */ g("small", { children: e.detail })
			]
		}, e.id || e.label))
	});
}
function j({ className: e, children: t }) {
	return /* @__PURE__ */ g("footer", {
		className: x("cad-ui-panel__footer", e),
		children: t
	});
}
function M({ icon: e, title: t = "NO DATA TO DISPLAY", children: n, className: r }) {
	return /* @__PURE__ */ _("div", {
		className: x("cad-ui-empty-state", r),
		children: [e && /* @__PURE__ */ g(e, {
			size: 16,
			"aria-hidden": "true"
		}), /* @__PURE__ */ _("div", { children: [/* @__PURE__ */ g("strong", { children: t }), n && /* @__PURE__ */ g("p", { children: n })] })]
	});
}
//#endregion
//#region src/cadValueUtils.ts
var N = (e) => String(e ?? "").trim(), P = (e) => !!e && typeof e == "object" && !Array.isArray(e), F = (e) => [...new Set((Array.isArray(e) ? e : []).map((e) => N(e).toLocaleLowerCase("en")).filter(Boolean))], I = (e) => [...new Set((Array.isArray(e) ? e : []).map((e) => N(e)).filter(Boolean))], L = (e) => Object.freeze(F(e)), R = (e, t) => t ? t === "none" ? e === 0 : t === "one" ? e === 1 : t === "many" ? e > 1 : e > 0 : !0;
function z(e = {}) {
	let t = e && typeof e == "object" ? e : {}, n = {
		ids: Object.freeze(I(t.ids)),
		entityTypes: L(t.entityTypes),
		traits: L(t.traits),
		source: N(t.source) || void 0,
		meta: t.meta
	};
	return Object.freeze(n);
}
function B(e) {
	if (!e || typeof e != "object") return;
	let t = e, n = t.count === "none" || t.count === "one" || t.count === "many" || t.count === "any" ? t.count : void 0, r = t.typeMatch === "any" ? "any" : t.typeMatch === "all" ? "all" : void 0, i = t.traitMatch === "any" ? "any" : t.traitMatch === "all" ? "all" : void 0, a = L(t.entityTypes), o = L(t.traits);
	if (!(!n && !r && !i && !a.length && !o.length)) return Object.freeze({
		...n ? { count: n } : {},
		...a.length ? { entityTypes: a } : {},
		...r ? { typeMatch: r } : {},
		...o.length ? { traits: o } : {},
		...i ? { traitMatch: i } : {}
	});
}
function ee(e, t = {}) {
	let n = z(t), r = B(e);
	if (!r) return {
		matches: !0,
		reason: "",
		selection: n
	};
	if (!R(n.ids.length, r.count)) return {
		matches: !1,
		reason: n.ids.length === 0 ? "SELECTION_REQUIRED" : "SELECTION_COUNT_MISMATCH",
		selection: n
	};
	let i = new Set(n.entityTypes || []), a = new Set(r.entityTypes || []);
	if (a.size && !(r.typeMatch === "any" ? [...i].some((e) => a.has(e)) : i.size > 0 && [...i].every((e) => a.has(e)))) return {
		matches: !1,
		reason: "ENTITY_TYPE_MISMATCH",
		selection: n
	};
	let o = new Set(n.traits || []), s = r.traits || [];
	return s.length && !(r.traitMatch === "any" ? s.some((e) => o.has(e)) : s.every((e) => o.has(e))) ? {
		matches: !1,
		reason: "SELECTION_TRAIT_MISMATCH",
		selection: n
	} : {
		matches: !0,
		reason: "",
		selection: n
	};
}
//#endregion
//#region src/CadCuiRuntime.tsx
var V = Object.freeze([]), H = Object.freeze({}), U = z(), te = n(null), W = 1, G = (e) => [...new Set((Array.isArray(e) ? e : V).map(N).filter(Boolean))], ne = (e) => ({
	id: N(e?.id),
	label: N(e?.label) || N(e?.id),
	detail: N(e?.detail),
	color: N(e?.color)
}), re = (e) => Object.freeze({ ...e && typeof e == "object" ? e : H }), K = (e, t) => !!(e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, t)), q = (e) => e ?? "", J = (e) => B(e), ie = (e) => Object.freeze({
	surface: N(e?.surface),
	tab: N(e?.tab),
	menu: N(e?.menu),
	group: N(e?.group),
	groupId: N(e?.groupId),
	control: N(e?.control),
	label: N(e?.label),
	detail: N(e?.detail),
	icon: N(e?.icon),
	tone: N(e?.tone),
	badge: q(e?.badge),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), Y = (e) => ({
	id: N(e?.id),
	label: N(e?.label) || N(e?.id),
	detail: N(e?.detail || e?.description),
	icon: N(e?.icon),
	tone: N(e?.tone) || "cyan",
	surface: N(e?.surface),
	tab: N(e?.tab),
	menu: N(e?.menu),
	control: N(e?.control),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), ae = (e) => !e || typeof e != "object" || Object.isFrozen(e) ? e : (Object.freeze(e), Object.values(e).forEach(ae), e), oe = (e, t) => Array.isArray(e) ? e.includes(t) : !!e?.[t], se = (e) => typeof Element < "u" && e instanceof Element, ce = [
	"input",
	"textarea",
	"select",
	"[contenteditable]:not([contenteditable=\"false\"])",
	"[role~=\"textbox\"]",
	"[role~=\"searchbox\"]",
	"[role~=\"combobox\"]",
	"[role~=\"listbox\"]",
	"[role~=\"spinbutton\"]"
].join(", "), le = (e) => se(e) && !!e.closest(ce), ue = (e) => {
	let t = e && typeof e == "object" && "current" in e ? e.current : e;
	return se(t) ? t : null;
}, de = (e) => se(e?.target) ? e.target.ownerDocument : e?.view?.document ? e.view.document : typeof document > "u" ? null : document, fe = (e) => Array.from(e?.querySelectorAll?.("dialog[open], [role~=\"dialog\"], [role~=\"alertdialog\"]") || V).some((e) => !e.closest("[hidden], [aria-hidden=\"true\"]"));
function pe(e, { scopeRoot: t } = H) {
	if (!e || e.defaultPrevented || e.repeat || e.isComposing || e.keyCode === 229) return !1;
	let n = t != null, r = ue(t), i = e.target;
	return !(n && (!r || !se(i) || !r.contains(i)) || le(i) || fe(de(e)));
}
var me = (e) => {
	let t = N(e.key).toUpperCase(), n = t === "DEL" ? "DELETE" : t;
	return !n || [
		"CONTROL",
		"ALT",
		"SHIFT",
		"META"
	].includes(n) ? "" : [...[
		e.ctrlKey || e.metaKey ? "CTRL" : "",
		e.altKey ? "ALT" : "",
		e.shiftKey ? "SHIFT" : ""
	].filter(Boolean), n].join("+");
}, he = (e) => N(e).toUpperCase().replace(/COMMAND|CMD/g, "CTRL").replace(/\bDEL\b/g, "DELETE").replace(/\s+/g, "");
function ge(e = H) {
	let t = (Array.isArray(e.commands) ? e.commands : V).map((e) => ({
		id: N(e?.id),
		label: N(e?.label),
		detail: N(e?.detail || e?.description),
		icon: N(e?.icon),
		tone: N(e?.tone) || "cyan",
		toolId: N(e?.toolId),
		shortcut: N(e?.shortcut),
		requires: G(e?.requires),
		customizable: e?.customizable !== !1,
		alwaysVisible: !!e?.alwaysVisible,
		disabled: !!e?.disabled,
		active: !!e?.active,
		badge: q(e?.badge),
		selection: J(e?.selection),
		intent: re(e?.intent),
		placements: (Array.isArray(e?.placements) ? e.placements : V).map(ie)
	})).filter((e) => e.id && e.label), n = new Set(t.map((e) => e.id)), r = (Array.isArray(e.tabs) ? e.tabs : V).map((e) => ({
		id: N(e?.id),
		label: N(e?.label) || N(e?.id),
		color: N(e?.color) || "#00fbfb",
		tone: N(e?.tone) || "cyan"
	})).filter((e) => e.id), i = /* @__PURE__ */ new Set(), a = (Array.isArray(e.groups) ? e.groups : V).map(Y).filter((e) => !e.id || i.has(e.id) ? !1 : (i.add(e.id), !0)), o = e.calibration && typeof e.calibration == "object" ? e.calibration : H, s = (Array.isArray(o.accentModes) ? o.accentModes : V).map(ne).filter((e) => e.id), c = (Array.isArray(o.densities) ? o.densities : V).map(ne).filter((e) => e.id), l = (Array.isArray(o.details) ? o.details : V).map(ne).filter((e) => e.id), u = (Array.isArray(e.panels) ? e.panels : V).map((e) => ({
		...e,
		id: N(e?.id),
		title: N(e?.title) || N(e?.id)
	})).filter((e) => e.id), d = e.defaults && typeof e.defaults == "object" ? e.defaults : H, f = {
		version: Number(e.version) || 1,
		activeTab: r.some((e) => e.id === d.activeTab) ? d.activeTab : r[0]?.id || "",
		hiddenCommandIds: G(d.hiddenCommandIds).filter((e) => n.has(e)),
		accentMode: s.some((e) => e.id === d.accentMode) ? d.accentMode : s[0]?.id || "",
		density: c.some((e) => e.id === d.density) ? d.density : c[0]?.id || "",
		detail: l.some((e) => e.id === d.detail) ? d.detail : l[0]?.id || "",
		quickAccessIds: G(d.quickAccessIds).filter((e) => n.has(e)),
		recentCommandIds: V,
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
	return ae({
		id: N(e.id) || "cad-cui",
		version: Number(e.version) || 1,
		storageKey: N(e.storageKey) || "cad-cui-preferences:v1",
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
var _e = ge({ id: "cad-cui-default" }), ve = (e) => new Map(e.commands.map((e) => [e.id, e])), ye = (e, t) => e.some((e) => e.id === t), be = (e, t, n = H) => {
	let r = typeof e == "function" ? e(t, n) : e instanceof Map ? e.get(t?.id) : e?.[t?.id];
	return r && typeof r == "object" ? r : H;
};
function xe(e, { state: t = H, capabilities: n = H, commandStates: r = H, selection: i = U, placement: a = e?.placement, surface: o = a?.surface || "", unavailablePresentation: s = "hide" } = H) {
	if (!e) return null;
	let c = z(i), l = ee(e.selection, c), u = be(r, e, {
		command: e,
		selection: c,
		state: t,
		capabilities: n,
		placement: a,
		surface: o
	}), d = new Set(t?.hiddenCommandIds || V), f = Array.isArray(e.requires) ? e.requires : V, p = (e.alwaysVisible || !d.has(e.id)) && f.every((e) => oe(n, e)) && u.visible !== !1, m = !!(e.disabled || u.disabled || u.enabled === !1);
	l.matches || (s === "disable" ? m = !0 : p = !1);
	let h = K(u, "active") ? !!u.active : !!e.active, g = K(u, "badge") ? q(u.badge) : K(a, "badge") && a.badge !== "" ? a.badge : e.badge;
	return {
		...e,
		placement: a,
		visible: p,
		disabled: m,
		active: h,
		badge: g,
		selection: c,
		selectionMatched: l.matches,
		unavailableReason: l.reason
	};
}
var Se = xe, Ce = (e, t) => ({
	...e,
	label: t.label || e.label,
	detail: t.detail || e.detail,
	icon: t.icon || e.icon,
	tone: t.tone || e.tone,
	placement: t
});
function we(e, t) {
	let n = t && typeof t == "object" ? t : H, r = ve(e), i = Array.isArray(n.hiddenToolIds) ? e.commands.filter((e) => n.hiddenToolIds.includes(e.toolId)).map((e) => e.id) : V, a = G(n.hiddenCommandIds || i).filter((e) => r.has(e) && !r.get(e).alwaysVisible);
	return {
		version: e.version,
		activeTab: e.tabs.some((e) => e.id === n.activeTab) ? n.activeTab : e.defaultState.activeTab,
		hiddenCommandIds: a,
		accentMode: ye(e.calibration.accentModes, n.accentMode) ? n.accentMode : e.defaultState.accentMode,
		density: ye(e.calibration.densities, n.density) ? n.density : e.defaultState.density,
		detail: ye(e.calibration.details, n.detail) ? n.detail : e.defaultState.detail,
		quickAccessIds: G(n.quickAccessIds || e.defaultState.quickAccessIds).filter((e) => r.has(e)),
		recentCommandIds: G(n.recentCommandIds).filter((e) => r.has(e)).slice(0, 8),
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
}
function Te(e, t = typeof window > "u" ? null : window.localStorage) {
	if (!t) return we(e, e.defaultState);
	try {
		let n = t.getItem(e.storageKey);
		if (!n) return we(e, e.defaultState);
		let r = JSON.parse(n);
		return we(e, r?.preferences || r);
	} catch {
		return we(e, e.defaultState);
	}
}
function Ee(e, t, n = typeof window > "u" ? null : window.localStorage) {
	if (!n) return !1;
	try {
		let r = we(e, t);
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
function De(e, t, { surface: n = "palette", tabId: r = "", menuId: i = "", groupId: a = "", capabilities: o = H, commandStates: s = H, selection: c = U, unavailablePresentation: l = "hide" } = H) {
	let u = new Set(t?.hiddenCommandIds || V), d = z(c);
	return e.commands.flatMap((e) => {
		if (u.has(e.id) && !e.alwaysVisible || e.requires.some((e) => !oe(o, e))) return V;
		let c = n === "palette" ? {
			surface: "palette",
			order: 0
		} : e.placements.find((e) => e.surface === n && (!r || e.tab === r) && (!i || e.menu === i) && (!a || e.groupId === a));
		if (!c) return V;
		let f = xe(Ce(e, c), {
			state: t,
			capabilities: o,
			commandStates: s,
			selection: d,
			placement: c,
			surface: n,
			unavailablePresentation: l
		});
		return f?.visible ? [f] : V;
	}).sort((e, t) => e.placement.order - t.placement.order || e.label.localeCompare(t.label, "hu"));
}
function Oe(e, t, { surface: n = "ribbon", tabId: r = "", menuId: i = "", capabilities: a = H, commandStates: o = H, selection: s = U, unavailablePresentation: c = "hide" } = H) {
	let l = (Array.isArray(e?.groups) ? e.groups : V).filter((e) => (!e.surface || e.surface === n) && (!r || !e.tab || e.tab === r) && (!i || !e.menu || e.menu === i)).sort((e, t) => e.order - t.order || e.label.localeCompare(t.label, "hu"));
	if (!l.length) return V;
	let u = De(e, t, {
		surface: n,
		tabId: r,
		menuId: i,
		capabilities: a,
		commandStates: o,
		selection: s,
		unavailablePresentation: c
	}), d = /* @__PURE__ */ new Set(), f = l.map((e) => {
		let t = u.filter((t) => t.placement.groupId === e.id).map((t) => t.placement.control || !e.control ? t : {
			...t,
			placement: {
				...t.placement,
				control: e.control
			}
		});
		return t.forEach((e) => d.add(e.id)), {
			...e,
			commands: t
		};
	}).filter((e) => e.commands.length), p = u.filter((e) => !d.has(e.id));
	return p.length && f.push({
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
		commands: p
	}), f;
}
var ke = (e) => (t, n) => {
	switch (n.type) {
		case "tab.select": return we(e, {
			...t,
			activeTab: n.tabId
		});
		case "command.visibility": {
			let r = e.commands.find((e) => e.id === n.commandId);
			if (!r || r.alwaysVisible) return t;
			let i = t.hiddenCommandIds.includes(n.commandId) ? t.hiddenCommandIds.filter((e) => e !== n.commandId) : [...t.hiddenCommandIds, n.commandId];
			return we(e, {
				...t,
				hiddenCommandIds: i
			});
		}
		case "preference.set": return we(e, {
			...t,
			[n.key]: n.value
		});
		case "preferences.reset": return we(e, e.defaultState);
		case "command.completed": return {
			...t,
			recentCommandIds: G([n.commandId, ...t.recentCommandIds]).slice(0, 8),
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
				error: N(n.error) || "COMMAND_FAILED"
			}
		};
		default: return t;
	}
};
function Ae({ registry: e = _e, capabilities: t = H, selection: n = U, commandStates: r = H, handlers: i = H, onCommand: a, shortcutScope: s, children: c }) {
	let u = y(), p = v(), [m, h] = f(ke(e), e, (e) => Te(e)), _ = d(() => ve(e), [e]), b = d(() => z(n), [n]);
	l(() => {
		Ee(e, m);
	}, [e, m]);
	let x = o((e, n) => xe(e, {
		state: m,
		capabilities: t,
		commandStates: r,
		selection: b,
		placement: n
	}), [
		t,
		r,
		b,
		m
	]), S = o((e) => {
		let t = x(e);
		return !!(t?.visible && !t.disabled);
	}, [x]), C = o((n = H) => De(e, m, {
		...n,
		capabilities: t,
		commandStates: r,
		selection: n.selection ?? b
	}), [
		t,
		r,
		b,
		e,
		m
	]), w = o((n = H) => Oe(e, m, {
		...n,
		capabilities: t,
		commandStates: r,
		selection: n.selection ?? b
	}), [
		t,
		r,
		b,
		e,
		m
	]), T = o(async (e, { source: t = "api", payload: n = H } = H) => {
		let r = _.get(e);
		if (!r) return {
			ok: !1,
			reason: "COMMAND_NOT_FOUND"
		};
		let o = x(r);
		if (!o?.visible || o.disabled) return {
			ok: !1,
			reason: "COMMAND_NOT_AVAILABLE"
		};
		let s = {
			...r.intent,
			...n && typeof n == "object" ? n : H
		}, c = {
			commandId: e,
			command: r,
			resolvedCommand: o,
			intent: s,
			payload: n,
			source: t,
			state: m,
			selection: b,
			location: p
		};
		try {
			if (s.type === "route.navigate") u(s.to, s.options);
			else {
				let e = i[s.type];
				if (typeof e != "function") return {
					ok: !1,
					reason: "COMMAND_HANDLER_NOT_FOUND"
				};
				await e({
					...c,
					navigate: u
				});
			}
			return a?.(c), h({
				type: "command.completed",
				commandId: e
			}), {
				ok: !0,
				event: c
			};
		} catch (t) {
			return h({
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
		_,
		i,
		p,
		u,
		b,
		a,
		x,
		m
	]);
	l(() => {
		if (typeof window > "u") return;
		let t = (t) => {
			if (!pe(t, { scopeRoot: s })) return;
			let n = me(t);
			if (!n) return;
			let r = e.commands.filter((e) => he(e.shortcut) === n && S(e));
			r.length === 1 && (t.preventDefault(), T(r[0].id, { source: "shortcut" }));
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [
		S,
		T,
		e.commands,
		s
	]);
	let E = d(() => ({
		registry: e,
		state: m,
		capabilities: t,
		selection: b,
		commandStates: r,
		resolveCommand: x,
		selectCommands: C,
		selectCommandGroups: w,
		executeCommand: T,
		setActiveTab: (e) => h({
			type: "tab.select",
			tabId: e
		}),
		setPreference: (e, t) => h({
			type: "preference.set",
			key: e,
			value: t
		}),
		toggleCommandVisibility: (e) => h({
			type: "command.visibility",
			commandId: e
		}),
		resetPreferences: () => h({ type: "preferences.reset" }),
		canExecute: S
	}), [
		S,
		t,
		r,
		T,
		b,
		e,
		x,
		C,
		w,
		m
	]);
	return /* @__PURE__ */ g(te.Provider, {
		value: E,
		children: c
	});
}
function je() {
	let e = s(te);
	if (!e) throw Error("useCadCui must be used below CadCuiProvider.");
	return e;
}
function Me(e, t = "api") {
	let { executeCommand: n } = je();
	return o((r) => n(e, {
		source: t,
		payload: r
	}), [
		e,
		n,
		t
	]);
}
function Ne({ surface: e = "selection-toolbar", tabId: t = "", menuId: n = "", groupId: r = "" } = H) {
	let { selection: i, selectCommands: a, executeCommand: s } = je();
	return {
		selection: i,
		actions: d(() => a({
			surface: e,
			tabId: t,
			menuId: n,
			groupId: r,
			unavailablePresentation: "hide"
		}), [
			r,
			n,
			a,
			e,
			t
		]),
		execute: o((t, n) => {
			let r = typeof t == "string" ? t : t?.id;
			return s(r, {
				source: e,
				payload: n
			});
		}, [s, e])
	};
}
var Pe = (e, t) => e?.[t] || null;
function Fe({ command: e, iconMap: t, source: n, role: r, badge: i, className: a }) {
	let { executeCommand: o } = je(), s = Pe(t, e.icon), c = e.placement?.control || "button", l = [
		"toggle",
		"switch",
		"checkbox",
		"radio"
	].includes(c.toLocaleLowerCase("en")), u = e.badge !== "" && e.badge !== void 0 && e.badge !== null;
	return /* @__PURE__ */ _(D, {
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
		children: [i ?? e.label, u && /* @__PURE__ */ g("em", {
			"data-cui-command-badge": "true",
			"aria-hidden": "true",
			children: e.badge
		})]
	});
}
function Ie({ iconMap: e = H, className: t, title: n = "PARANCS SZALAG", description: r = "Deklaratív CUI-regiszterből épített munkatéri parancsok", renderBadge: i, ...a }) {
	let { registry: o, state: s, selectCommands: c, selectCommandGroups: l, setActiveTab: u } = je(), d = o.tabs.find((e) => e.id === s.activeTab) || o.tabs[0], f = c({
		surface: "ribbon",
		tabId: d?.id
	}), p = o.groups?.length ? l({
		surface: "ribbon",
		tabId: d?.id
	}) : V, m = p.length > 0;
	return /* @__PURE__ */ _(C, {
		...a,
		tone: d?.tone || "cyan",
		scroll: !1,
		className: t,
		"data-testid": a["data-testid"] || "cad-cui-ribbon",
		children: [/* @__PURE__ */ g(w, {
			eyebrow: "CUI REGISZTER",
			title: n,
			description: r,
			status: d?.label || "NÉZET"
		}), /* @__PURE__ */ _(T, {
			eyebrow: "MUNKATÉR",
			title: "PARANCSCSOPORT",
			compact: !0,
			children: [/* @__PURE__ */ g(E, {
				label: "CAD szalag fülek",
				activeId: d?.id,
				onChange: u,
				items: o.tabs.map((e) => ({
					id: e.id,
					label: e.label
				}))
			}), m ? /* @__PURE__ */ g("div", {
				className: "cad-cui-command-groups cad-cui-command-grid--ribbon",
				"data-cui-grouped-ribbon": "true",
				children: p.map((t) => /* @__PURE__ */ _("section", {
					className: "cad-cui-command-group",
					"data-command-group-id": t.id,
					"data-command-control": t.control || void 0,
					role: "group",
					"aria-label": t.label,
					children: [/* @__PURE__ */ _("header", { children: [t.label, t.detail && /* @__PURE__ */ g("small", { children: t.detail })] }), /* @__PURE__ */ g("div", {
						className: "cad-cui-command-grid",
						role: "toolbar",
						"aria-label": `${t.label} parancsok`,
						children: t.commands.map((t) => /* @__PURE__ */ g(Fe, {
							command: t,
							iconMap: e,
							source: "ribbon",
							badge: i?.(t) ?? t.label
						}, t.id))
					})]
				}, t.id))
			}) : /* @__PURE__ */ g("div", {
				className: "cad-cui-command-grid cad-cui-command-grid--ribbon",
				role: "toolbar",
				"aria-label": `${d?.label || "CAD"} parancsok`,
				children: f.map((t) => /* @__PURE__ */ g(Fe, {
					command: t,
					iconMap: e,
					source: "ribbon",
					badge: i?.(t) ?? t.label
				}, t.id))
			})]
		})]
	});
}
function Le({ iconMap: e = H, commandIds: t, className: n, ...r }) {
	let { registry: i, state: a, resolveCommand: o } = je(), s = (Array.isArray(t) ? t : a.quickAccessIds).map((e) => i.commands.find((t) => t.id === e)).filter(Boolean).map((e) => {
		let t = e.placements.find((e) => e.surface === "quick-access");
		return o(t ? Ce(e, t) : e, t);
	}).filter((e) => e?.visible);
	return /* @__PURE__ */ g("div", {
		...r,
		className: ["cad-cui-quick-access", n].filter(Boolean).join(" "),
		"data-testid": r["data-testid"] || "cad-cui-quick-access",
		role: "toolbar",
		"aria-label": "Gyors elérés",
		children: s.map((t) => /* @__PURE__ */ g(Fe, {
			command: t,
			iconMap: e,
			source: "quick-access"
		}, t.id))
	});
}
function Re({ menuId: e = "canvas", iconMap: t = H, className: n, onClose: r, ...i }) {
	let { selectCommands: a } = je(), o = a({
		surface: "context",
		menuId: e
	});
	return /* @__PURE__ */ _(C, {
		...i,
		as: "aside",
		role: "menu",
		"aria-label": "CUI helyi menü",
		tone: "magenta",
		density: "compact",
		scroll: !1,
		className: n,
		"data-testid": i["data-testid"] || "cad-cui-context-menu",
		children: [/* @__PURE__ */ g(w, {
			eyebrow: "KONTEXTUS",
			title: "GYORSPARANCSOK",
			actions: r && /* @__PURE__ */ g(D, {
				compact: !0,
				onClick: r,
				"aria-label": "Helyi menü bezárása",
				children: "BEZÁR"
			})
		}), /* @__PURE__ */ g(T, {
			compact: !0,
			children: /* @__PURE__ */ _("div", {
				className: "cad-cui-command-grid",
				children: [o.map((e) => /* @__PURE__ */ g(Fe, {
					command: e,
					iconMap: t,
					source: "context",
					role: "menuitem"
				}, e.id)), !o.length && /* @__PURE__ */ g(M, {
					title: "NINCS ELÉRHETŐ PARANCS",
					children: "A jogosultság vagy a profil jelenleg elrejti ezt a menüt."
				})]
			})
		})]
	});
}
function ze({ iconMap: e = H, className: t, ...n }) {
	let { selectCommands: r, state: i } = je(), [a, o] = m(""), s = c(a), l = d(() => {
		let e = N(s).toLocaleLowerCase("hu");
		return r({ surface: "palette" }).filter((t) => !e || `${t.label} ${t.detail} ${t.shortcut}`.toLocaleLowerCase("hu").includes(e));
	}, [s, r]);
	return /* @__PURE__ */ _(C, {
		...n,
		tone: "violet",
		className: t,
		"data-testid": n["data-testid"] || "cad-cui-command-palette",
		children: [
			/* @__PURE__ */ g(w, {
				eyebrow: "CUI PARANCSOK",
				title: "PARANCS PALETTA",
				description: "A szalag, a gyorselérés és a helyi menük közös kereshető parancsregisztere.",
				status: `${l.length} TALÁLAT`
			}),
			/* @__PURE__ */ _(T, {
				compact: !0,
				children: [
					/* @__PURE__ */ g("label", {
						className: "cad-cui-sr-only",
						htmlFor: "cad-cui-command-query",
						children: "Parancs keresése"
					}),
					/* @__PURE__ */ g("input", {
						id: "cad-cui-command-query",
						value: a,
						onChange: (e) => o(e.target.value),
						placeholder: "PARANCS KERESÉSE…",
						className: "cad-cui-command-palette__input"
					}),
					/* @__PURE__ */ _("div", {
						className: "cad-cui-command-grid",
						children: [l.map((t) => /* @__PURE__ */ g(Fe, {
							command: t,
							iconMap: e,
							source: "palette"
						}, t.id)), !l.length && /* @__PURE__ */ g(M, {
							title: "NINCS TALÁLAT",
							children: "Próbálj meg másik parancsnevet vagy engedélyezd a rejtett elemet."
						})]
					})
				]
			}),
			/* @__PURE__ */ _(j, { children: ["UTOLSÓ PARANCS: ", i.recentCommandIds[0] || "NINCS"] })
		]
	});
}
function Be({ className: e, ...t }) {
	let { registry: n, state: r, setPreference: i, toggleCommandVisibility: a, resetPreferences: o } = je(), s = new Set(r.hiddenCommandIds);
	return /* @__PURE__ */ _(C, {
		...t,
		tone: "magenta",
		className: e,
		"data-testid": t["data-testid"] || "cad-cui-customizer",
		children: [
			/* @__PURE__ */ g(w, {
				eyebrow: "MUNKATÉR KALIBRÁLÁSA",
				title: "CUI PROFIL",
				description: "A beállítások csak a személyes munkatéri nézetet módosítják; a parancsok és a jogosultságok központilag definiáltak.",
				actions: /* @__PURE__ */ g(D, {
					compact: !0,
					onClick: o,
					children: "ALAPÉRTELMEZETT"
				})
			}),
			/* @__PURE__ */ g(T, {
				eyebrow: "VIZUÁLIS PROFIL",
				title: "AKCENTUS",
				compact: !0,
				children: /* @__PURE__ */ g(E, {
					label: "Akcentusszín",
					activeId: r.accentMode,
					onChange: (e) => i("accentMode", e),
					items: n.calibration.accentModes.map((e) => ({
						id: e.id,
						label: e.label
					}))
				})
			}),
			/* @__PURE__ */ g(T, {
				eyebrow: "TARTALMI NÉZET",
				title: "INFORMÁCIÓS SŰRŰSÉG",
				compact: !0,
				children: /* @__PURE__ */ _("div", {
					className: "cad-cui-stack cad-cui-stack--regular",
					children: [/* @__PURE__ */ g(E, {
						label: "Tartalmi sűrűség",
						activeId: r.density,
						onChange: (e) => i("density", e),
						items: n.calibration.densities.map((e) => ({
							id: e.id,
							label: e.label
						}))
					}), /* @__PURE__ */ g(E, {
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
			/* @__PURE__ */ g(T, {
				eyebrow: "PARANCSKIOSZTÁS",
				title: "LÁTHATÓ PARANCSOK",
				compact: !0,
				children: /* @__PURE__ */ g("div", {
					className: "cad-cui-command-grid",
					children: n.commands.filter((e) => e.customizable).map((e) => /* @__PURE__ */ g(k, {
						as: "label",
						title: e.label,
						detail: e.detail,
						active: !s.has(e.id),
						tone: e.tone,
						actions: /* @__PURE__ */ g("input", {
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
//#region src/cadUiUtils.ts
var X = (...e) => e.filter(Boolean).join(" "), Z = (e) => Array.isArray(e) ? [...e] : [], Q = (e) => {
	let t = e;
	return String(typeof e == "string" || typeof e == "number" ? e : t?.label ?? t?.name ?? t?.id ?? "");
};
function $(e, t, n) {
	let [r, i] = m(t), a = e !== void 0, s = a ? e : r;
	return [s, o((e, ...t) => {
		let r = typeof e == "function" ? e(s) : e;
		a || i(r), n?.(r, ...t);
	}, [
		a,
		n,
		s
	])];
}
var Ve = (e, t, n) => Number.isFinite(e) ? Number.isFinite(t) && e < t ? t : Number.isFinite(n) && e > n ? n : e : e, He = (e, t, n) => {
	e?.disabled || (e?.onClick?.(e, t), n?.(e, t));
};
function Ue({ shortcut: e, className: t }) {
	return e ? /* @__PURE__ */ g("kbd", {
		className: X("cad-shortcut-hint", t),
		children: e
	}) : null;
}
function We({ icon: t, label: n, shortcut: r, active: i = !1, toggle: a = !1, tone: o = "inherit", badge: s, compact: c = !1, className: l, children: u, title: d, type: f = "button", ...p }) {
	let m = n || (typeof u == "string" ? u : "CAD tool"), h = e.isValidElement(t) ? t : typeof t == "function" ? /* @__PURE__ */ g(t, { size: c ? 13 : 16 }) : null;
	return /* @__PURE__ */ _("button", {
		...p,
		type: f,
		"data-tone": o,
		"data-active": i ? "true" : "false",
		"aria-pressed": a ? i : void 0,
		"aria-label": p["aria-label"] || m,
		title: d || [m, r].filter(Boolean).join(" · "),
		className: X("cad-tool-button", c && "cad-tool-button--compact", l),
		children: [
			h && /* @__PURE__ */ g("span", {
				className: "cad-tool-button__icon",
				"aria-hidden": "true",
				children: h
			}),
			(n || u) && /* @__PURE__ */ g("span", {
				className: "cad-tool-button__label",
				children: u || n
			}),
			s && /* @__PURE__ */ g("span", {
				className: "cad-tool-button__badge",
				children: s
			}),
			r && /* @__PURE__ */ g(Ue, { shortcut: r })
		]
	});
}
function Ge({ active: e = !1, onChange: t, onClick: n, ...r }) {
	return /* @__PURE__ */ g(We, {
		...r,
		active: e,
		toggle: !0,
		onClick: (r) => {
			t?.(!e, r), n?.(r);
		}
	});
}
function Ke({ icon: e, label: t, shortcut: n, tone: r = "inherit", disabled: i = !1, menu: a, menuId: o, menuOpen: s, defaultMenuOpen: c = !1, onMenuOpenChange: d, onClick: f, className: m, children: h, ...v }) {
	let y = u(), b = o || `cad-split-menu-${y}`, x = p(null), S = p(null), [C, w] = $(s, c, (e, t) => d?.(e, t));
	l(() => {
		if (!C) return;
		let e = window.setTimeout(() => S.current?.querySelector("[role=\"menuitem\"]:not(:disabled), button:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [C]);
	let T = (e) => {
		w(!1, e), window.setTimeout(() => x.current?.focus(), 0);
	};
	return /* @__PURE__ */ _("span", {
		className: X("cad-split-button", m),
		"data-tone": r,
		children: [
			/* @__PURE__ */ _("button", {
				...v,
				type: "button",
				disabled: i,
				className: "cad-split-button__primary",
				onClick: f,
				title: [t, n].filter(Boolean).join(" · "),
				children: [
					e && /* @__PURE__ */ g(e, {
						size: 14,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ g("span", { children: h || t }),
					n && /* @__PURE__ */ g(Ue, { shortcut: n })
				]
			}),
			/* @__PURE__ */ g("button", {
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
			C && a && /* @__PURE__ */ g("div", {
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
function qe({ label: e, items: t = [], onAction: n, className: r, children: i }) {
	return /* @__PURE__ */ _("section", {
		className: X("cad-toolbar-group", r),
		"aria-label": e,
		children: [/* @__PURE__ */ _("div", {
			className: "cad-toolbar-group__tools",
			children: [Z(t).map((e, t) => {
				if (e?.type === "separator") return /* @__PURE__ */ g("span", {
					className: "cad-toolbar-group__separator",
					role: "separator",
					"aria-orientation": "vertical"
				}, e.id || `separator-${t}`);
				let r = e.id || `${Q(e)}-${t}`, i = {
					icon: e.icon,
					label: Q(e),
					shortcut: e.shortcut,
					tone: e.tone,
					disabled: e.disabled,
					active: e.active,
					badge: e.badge,
					title: e.title || e.detail,
					className: e.className
				}, a = (t) => He(e, t, n);
				return e?.type === "split" ? /* @__PURE__ */ g(Ke, {
					...i,
					menu: e.menu,
					menuOpen: e.menuOpen,
					onMenuOpenChange: (t, n) => e.onMenuOpenChange?.(t, e, n),
					onClick: a
				}, r) : e?.toggle ? /* @__PURE__ */ g(Ge, {
					...i,
					onChange: (t, r) => {
						e.onChange?.(t, e, r), n?.({
							...e,
							active: t
						}, r);
					}
				}, r) : /* @__PURE__ */ g(We, {
					...i,
					onClick: a
				}, r);
			}), i]
		}), e && /* @__PURE__ */ g("span", {
			className: "cad-toolbar-group__label",
			children: e
		})]
	});
}
function Je({ groups: e, items: t, label: n = "CAD tools", orientation: r = "horizontal", onAction: i, className: a, children: o, ...s }) {
	let c = Z(e).length ? Z(e) : [{
		id: "default",
		items: Z(t)
	}];
	return /* @__PURE__ */ _("div", {
		...s,
		className: X("cad-toolbar", `cad-toolbar--${r}`, a),
		role: "toolbar",
		"aria-label": n,
		"aria-orientation": r,
		children: [c.map((e, t) => /* @__PURE__ */ g(qe, {
			label: e.label,
			items: e.items,
			onAction: i
		}, e.id || e.label || t)), o]
	});
}
function Ye({ groups: e, items: t, label: n = "CAD tool palette", layout: r = "strip", className: i, ...a }) {
	let o = r === "auto" || r === "tiles" ? r : "strip";
	return /* @__PURE__ */ g(Je, {
		...a,
		groups: e,
		items: t,
		label: n,
		orientation: "vertical",
		"data-layout": o,
		className: X("cad-tool-palette", i)
	});
}
function Xe({ id: e, label: t, value: n, defaultValue: r = "", onValueChange: i, onChange: a, min: o, max: s, step: c = 1, unit: l, prefix: d, suffix: f, asNumber: p = !0, disabled: m = !1, readOnly: h = !1, showSteppers: v = !0, className: y, inputClassName: b, ...x }) {
	let S = u(), C = e || `cad-number-${S}`, [w, T] = $(n, r, (e, t) => {
		i?.(e, t), a?.(e, t);
	}), E = (e, t) => {
		let n = p && e !== "" ? Number(e) : e;
		T(n, t);
	}, D = (e, t) => {
		let n = Number(w), r = Number(c) || 1, i = Ve((Number.isFinite(n) ? n : 0) + e * r, Number(o), Number(s));
		E(i, t);
	};
	return /* @__PURE__ */ _("div", {
		className: X("cad-numeric-input", m && "cad-numeric-input--disabled", y),
		children: [t && /* @__PURE__ */ g("label", {
			className: "cad-numeric-input__label",
			htmlFor: C,
			children: t
		}), /* @__PURE__ */ _("span", {
			className: "cad-numeric-input__control",
			children: [
				d && /* @__PURE__ */ g("span", {
					className: "cad-numeric-input__adornment",
					children: d
				}),
				/* @__PURE__ */ g("input", {
					...x,
					id: C,
					className: X("cad-numeric-input__field", b),
					type: "number",
					value: w ?? "",
					min: o,
					max: s,
					step: c,
					disabled: m,
					readOnly: h,
					onChange: (e) => E(e.target.value, e)
				}),
				(l || f) && /* @__PURE__ */ g("span", {
					className: "cad-numeric-input__adornment",
					children: f || l
				}),
				v && !h && /* @__PURE__ */ _("span", {
					className: "cad-numeric-input__steppers",
					children: [/* @__PURE__ */ g("button", {
						type: "button",
						tabIndex: -1,
						disabled: m,
						"aria-label": `Increase ${t || "value"}`,
						onClick: (e) => D(1, e),
						children: "+"
					}), /* @__PURE__ */ g("button", {
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
function Ze({ unit: e = "mm", ...t }) {
	return /* @__PURE__ */ g(Xe, {
		...t,
		unit: e
	});
}
function Qe({ unit: e = "°", ...t }) {
	return /* @__PURE__ */ g(Xe, {
		...t,
		unit: e
	});
}
function $e({ value: e, defaultValue: t = {
	x: "",
	y: "",
	z: ""
}, onValueChange: n, onChange: i, axes: a = [
	"X",
	"Y",
	"Z"
], unit: o = "mm", label: s = "Coordinates", className: c, ...l }) {
	let [u, d] = $(e, t, (e, t, r) => {
		n?.(e, t, r), i?.(e, t, r);
	});
	return /* @__PURE__ */ _("fieldset", {
		className: X("cad-coordinate-input", c),
		children: [s && /* @__PURE__ */ g("legend", { children: s }), /* @__PURE__ */ g("div", {
			className: "cad-coordinate-input__axes",
			children: Z(a).map((e) => {
				let t = String(e).toLowerCase();
				return /* @__PURE__ */ r(Ze, {
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
function et({ color: e = "#ffffff", label: t, size: n = "regular", onClick: r, className: i, style: a, ...o }) {
	let s = /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("span", {
		className: "cad-color-swatch__chip",
		style: { "--cad-swatch-color": e },
		"aria-hidden": "true"
	}), t && /* @__PURE__ */ g("span", {
		className: "cad-color-swatch__label",
		children: t
	})] }), c = {
		...o,
		className: X("cad-color-swatch", `cad-color-swatch--${n}`, i),
		style: a,
		title: o.title || t || e
	};
	return r ? /* @__PURE__ */ g("button", {
		...c,
		type: "button",
		"aria-label": o["aria-label"] || t || e,
		onClick: r,
		children: s
	}) : /* @__PURE__ */ g("span", {
		...c,
		"aria-label": o["aria-label"] || t || e,
		children: s
	});
}
function tt({ type: e = "continuous", color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ _("span", {
		className: X("cad-linetype-preview", r),
		"data-type": e,
		style: { "--cad-line-color": t },
		title: n || e,
		"aria-label": n || e,
		children: [/* @__PURE__ */ g("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ g("small", { children: n })]
	});
}
function nt({ weight: e = .25, color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ _("span", {
		className: X("cad-lineweight-preview", r),
		style: {
			"--cad-line-color": t,
			"--cad-line-weight": `${Math.max(1, Number(e) * 4)}px`
		},
		title: n || `${e} mm`,
		"aria-label": n || `${e} mm`,
		children: [/* @__PURE__ */ g("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ g("small", { children: n })]
	});
}
function rt({ className: e }) {
	return /* @__PURE__ */ g("div", {
		className: X("cad-menu__separator", e),
		role: "separator"
	});
}
function it({ item: t, label: n, detail: r, shortcut: i, icon: a, checked: o, disabled: s = !1, type: c = "action", tone: l = "inherit", onClick: u, className: d }) {
	let f = n || Q(t), p = o ?? t?.checked, m = s || t?.disabled, h = c === "checkbox" ? "menuitemcheckbox" : c === "radio" ? "menuitemradio" : "menuitem", v = e.isValidElement(a) ? a : typeof a == "function" ? /* @__PURE__ */ g(a, { size: 13 }) : null;
	return /* @__PURE__ */ _("button", {
		type: "button",
		role: h,
		disabled: m,
		"data-tone": l || t?.tone || "inherit",
		"aria-checked": h === "menuitem" ? void 0 : !!p,
		className: X("cad-menu__item", p && "cad-menu__item--checked", d),
		onClick: (e) => u?.(t, e),
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-menu__check",
				"aria-hidden": "true",
				children: p ? "✓" : ""
			}),
			v && /* @__PURE__ */ g("span", {
				className: "cad-menu__icon",
				"aria-hidden": "true",
				children: v
			}),
			/* @__PURE__ */ _("span", {
				className: "cad-menu__copy",
				children: [/* @__PURE__ */ g("strong", { children: f }), r && /* @__PURE__ */ g("small", { children: r })]
			}),
			i && /* @__PURE__ */ g(Ue, { shortcut: i })
		]
	});
}
function at({ items: e = [], label: t = "CAD menu", onAction: n, onClose: r, className: i, children: a, menuRef: o, ...s }) {
	let c = p(null), l = o || c, u = (e) => {
		let t = [...l.current?.querySelectorAll("[role^=\"menuitem\"]") || []].filter((e) => !e.disabled);
		t.length && t[(t.indexOf(document.activeElement) + e + t.length) % t.length].focus();
	};
	return /* @__PURE__ */ _("div", {
		...s,
		ref: l,
		className: X("cad-menu", i),
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
		children: [Z(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ g(rt, {}, e.id || `separator-${t}`) : /* @__PURE__ */ g(it, {
			item: e,
			label: Q(e),
			detail: e.detail,
			shortcut: e.shortcut,
			icon: e.icon,
			checked: e.checked,
			disabled: e.disabled,
			type: e.type,
			tone: e.tone,
			onClick: (e, t) => He(e, t, n)
		}, e.id || `${Q(e)}-${t}`)), a]
	});
}
function ot({ open: t = !1, position: n = {
	x: 0,
	y: 0
}, items: r = [], label: i = "Context menu", onAction: a, onClose: o, restoreFocusRef: s, returnFocusRef: c, className: u, style: d, children: f, menuRef: m, onContextMenu: h, ..._ }) {
	let v = p(null), y = m || v, b = p(!1), x = s || c, S = e.useCallback((e, t, n = void 0) => {
		b.current = t === "escape" || t === "outside", o?.(e, {
			reason: t,
			item: n
		});
	}, [o]);
	if (l(() => {
		if (!t) return;
		let e = x?.current, n = window.setTimeout(() => y.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)")?.focus(), 0);
		return () => {
			window.clearTimeout(n), b.current && (b.current = !1, window.setTimeout(() => e?.focus?.(), 0));
		};
	}, [
		x,
		y,
		t
	]), l(() => {
		if (!t) return;
		let e = (e) => {
			let t = e.target;
			!(t instanceof Node) || y.current?.contains(t) || S(e, "outside");
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [
		y,
		t,
		S
	]), !t) return null;
	let C = n || {
		x: 0,
		y: 0
	}, w = {
		...d,
		position: "absolute",
		left: C.x ?? 0,
		top: C.y ?? 0,
		zIndex: d?.zIndex ?? 40
	};
	return /* @__PURE__ */ g(at, {
		..._,
		menuRef: y,
		items: r,
		label: i,
		className: X("cad-context-menu-popup", u),
		style: w,
		onContextMenu: (e) => {
			e.preventDefault(), h?.(e);
		},
		onClose: (e) => {
			e.stopPropagation?.(), S(e, "escape");
		},
		onAction: (e, t) => {
			b.current = !1, a?.(e, t), S(t, "action", e);
		},
		children: f
	});
}
function st({ open: t = !1, position: n = {
	x: 0,
	y: 0
}, items: r = [], label: i = "CAD radial menu", centerLabel: a = "Actions", onAction: o, onClose: s, restoreFocusRef: c, returnFocusRef: u, className: d, style: f, children: m, menuRef: h, onKeyDown: v, ...y }) {
	let b = p(null), x = h || b, S = p(!1), C = c || u, w = Z(r).filter((e) => e && e.type !== "separator" && !e.hidden), T = e.useCallback(() => [...x.current?.querySelectorAll("[role^=\"menuitem\"]") || []].filter((e) => !e.disabled), [x]), E = e.useCallback((e, t, n = void 0) => {
		S.current = t === "escape" || t === "outside", s?.(e, {
			reason: t,
			item: n
		});
	}, [s]), D = (e) => {
		let t = T();
		t.length && t[(t.indexOf(document.activeElement) + e + t.length) % t.length].focus();
	};
	if (l(() => {
		if (!t) return;
		let e = C?.current, n = window.setTimeout(() => T()[0]?.focus(), 0);
		return () => {
			window.clearTimeout(n), S.current && (S.current = !1, window.setTimeout(() => e?.focus?.(), 0));
		};
	}, [
		C,
		T,
		t
	]), l(() => {
		if (!t) return;
		let e = (e) => {
			let t = e.target;
			!(t instanceof Node) || x.current?.contains(t) || E(e, "outside");
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [
		x,
		t,
		E
	]), !t) return null;
	let O = n || {
		x: 0,
		y: 0
	}, k = {
		...f,
		position: "absolute",
		left: O.x ?? 0,
		top: O.y ?? 0,
		zIndex: f?.zIndex ?? 40
	};
	return /* @__PURE__ */ _("div", {
		...y,
		ref: x,
		className: X("cad-radial-menu", d),
		style: k,
		role: "menu",
		"aria-label": i,
		"data-count": w.length,
		onKeyDown: (e) => {
			if (v?.(e), !e.defaultPrevented) {
				if ((e.key === "ArrowRight" || e.key === "ArrowDown") && (e.preventDefault(), D(1)), (e.key === "ArrowLeft" || e.key === "ArrowUp") && (e.preventDefault(), D(-1)), e.key === "Home" && (e.preventDefault(), T()[0]?.focus()), e.key === "End") {
					e.preventDefault();
					let t = T();
					t[t.length - 1]?.focus();
				}
				e.key === "Escape" && (e.preventDefault(), e.stopPropagation?.(), E(e, "escape"));
			}
		},
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-radial-menu__ring",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-radial-menu__center",
				"aria-hidden": "true",
				children: a
			}),
			w.map((t, n) => {
				let r = Q(t) || "CAD action", i = t.checked, a = !!t.disabled, s = t.type || (t.toggle ? "checkbox" : "action"), c = s === "checkbox" ? "menuitemcheckbox" : s === "radio" ? "menuitemradio" : "menuitem", l = t.icon, u = e.isValidElement(l) ? l : typeof l == "function" ? /* @__PURE__ */ g(l, { size: 20 }) : null, d = -90 + 360 * n / Math.max(w.length, 1), f = {
					"--cad-radial-menu-angle": `${d}deg`,
					"--cad-radial-menu-counter-angle": `${-d}deg`
				};
				return /* @__PURE__ */ _("button", {
					type: "button",
					role: c,
					disabled: a,
					"data-tone": t.tone || "inherit",
					"data-active": t.active ? "true" : "false",
					"data-checked": i ? "true" : "false",
					"aria-checked": c === "menuitem" ? void 0 : !!i,
					"aria-label": t["aria-label"] || r,
					"aria-keyshortcuts": t.shortcut || void 0,
					title: [
						r,
						t.detail,
						t.shortcut
					].filter(Boolean).join(" · "),
					className: X("cad-radial-menu__item", t.className),
					style: f,
					onClick: (e) => {
						S.current = !1, He(t, e, o), E(e, "action", t);
					},
					children: [
						u && /* @__PURE__ */ g("span", {
							className: "cad-radial-menu__icon",
							"aria-hidden": "true",
							children: u
						}),
						/* @__PURE__ */ g("span", {
							className: "cad-radial-menu__label",
							children: r
						}),
						t.shortcut && /* @__PURE__ */ g(Ue, { shortcut: t.shortcut })
					]
				}, t.id || `${r}-${n}`);
			}),
			m
		]
	});
}
function ct({ items: e = [], label: t = "More options", open: n, defaultOpen: r = !1, onOpenChange: i, onAction: a, className: o, triggerLabel: s = "More", ...c }) {
	let [d, f] = $(n, r, (e, t) => i?.(e, t)), m = `cad-overflow-menu-${u()}`, h = p(null), v = p(null);
	l(() => {
		if (!d) return;
		let e = window.setTimeout(() => v.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [d]);
	let y = (e) => {
		f(!1, e), window.setTimeout(() => h.current?.focus(), 0);
	};
	return /* @__PURE__ */ _("span", {
		className: X("cad-overflow-menu", o),
		children: [/* @__PURE__ */ g("button", {
			...c,
			ref: h,
			type: "button",
			className: "cad-overflow-menu__trigger",
			"aria-label": t,
			"aria-haspopup": "menu",
			"aria-expanded": d,
			"aria-controls": d ? m : void 0,
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), f(!0, e));
			},
			onClick: (e) => f(!d, e),
			children: s === "More" ? "⋯" : s
		}), d && /* @__PURE__ */ g(at, {
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
//#region src/CadWorkspaceRibbon.tsx
var lt = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, ut = (e) => N(e?.tabId || e?.tab || e?.placement?.tab), dt = (e, t) => N(e?.groupId || e?.group || e?.placement?.groupId || e?.placement?.group) || t, ft = (e, t) => N(e?.groupLabel || e?.placement?.groupLabel || e?.placement?.group) || t, pt = (e, t) => lt(e?.order ?? e?.placement?.order, t), mt = (e) => N(e?.tabId || e?.tab || e?.placement?.tab), ht = (e) => Z(e?.commands).length ? Z(e.commands) : Z(e?.items), gt = (e) => N(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace", _t = (e, t) => {
	if (!e || !t) return !1;
	try {
		return e === t || !!e.contains?.(t);
	} catch {
		return !1;
	}
}, vt = (e) => {
	typeof window > "u" || (window.requestAnimationFrame || ((e) => window.setTimeout(e, 0)))(e);
}, yt = [
	"button:not(:disabled)",
	"a[href]",
	"input:not(:disabled)",
	"select:not(:disabled)",
	"textarea:not(:disabled)",
	"[role=\"button\"]:not([aria-disabled=\"true\"])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(", ");
function bt(e = [], { tabId: t = "", defaultGroupId: n = "commands", defaultGroupLabel: r = "COMMANDS" } = {}) {
	let i = /* @__PURE__ */ new Map();
	return Z(e).forEach((e, a) => {
		if (!e || typeof e != "object") return;
		let o = ut(e);
		if (t && o && o !== t) return;
		let s = dt(e, n), c = ft(e, r), l = pt(e, a), u = i.get(s);
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
var xt = ({ groups: e, commands: t, activeTabId: n, defaultGroupId: r, defaultGroupLabel: i }) => {
	let a = Z(e).filter((e) => e && typeof e == "object" && (!n || !mt(e) || mt(e) === n)).map((e, t) => ({
		id: N(e.id) || `group-${t + 1}`,
		label: N(e.label) || i,
		order: lt(e.order, t),
		commands: ht(e).filter((e) => !n || !ut(e) || ut(e) === n)
	})).filter((e) => e.commands.length);
	return a.length ? a.sort((e, t) => e.order - t.order) : bt(t, {
		tabId: n,
		defaultGroupId: r,
		defaultGroupLabel: i
	});
}, St = (t, n) => e.isValidElement(t?.icon) ? t.icon : typeof t?.icon == "function" ? e.createElement(t.icon, {
	size: n ? 13 : 16,
	"aria-hidden": !0
}) : null;
function Ct({ command: e, group: t, activeTab: n, compact: r, renderIcon: i, renderCommand: a, onCommand: o }) {
	let s = Q(e) || "COMMAND", c = !!(e?.toggle || e?.pressed !== void 0 || e?.active !== void 0), l = {
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
	}, u = typeof i == "function" ? i(e, l) : St(e, r), d = {
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
	}, f = typeof a == "function" ? a(e, {
		...l,
		icon: u,
		buttonProps: d
	}) : void 0;
	if (f != null) return f;
	let p = e?.badge !== void 0 && e?.badge !== null && e.badge !== "";
	return /* @__PURE__ */ _("button", {
		...d,
		children: [
			u && /* @__PURE__ */ _("span", {
				className: "cad-workspace-ribbon__tool-icon",
				"aria-hidden": "true",
				children: [u, p && /* @__PURE__ */ g("em", { children: e.badge })]
			}),
			!u && p && /* @__PURE__ */ g("span", {
				className: "cad-workspace-ribbon__tool-badge-only",
				"aria-hidden": "true",
				children: /* @__PURE__ */ g("em", { children: e.badge })
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-workspace-ribbon__tool-label",
				children: s
			}),
			e?.shortcut && /* @__PURE__ */ g(Ue, { shortcut: e.shortcut })
		]
	});
}
function wt({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: i, groups: a, commands: o = [], defaultGroupId: s = "commands", defaultGroupLabel: c = "COMMANDS", label: f = "CAD workspace ribbon", tabListLabel: h = "Workspace commands", minimized: v, defaultMinimized: y = !1, onMinimizedChange: b, collapsible: x = !0, compact: S = !1, identity: C, renderIdentity: w, status: T, statusLabel: E = "Workspace status", renderStatus: D, endSlot: O, renderIcon: k, renderCommand: A, renderMinimizeControl: j, onCommand: M, className: P, style: F, children: I, ...L }) {
	let R = `cad-workspace-ribbon-${gt(u())}`, z = p(/* @__PURE__ */ new Map()), B = p(null), ee = p(!1), V = p(""), H = p({
		pointer: !1,
		focus: !1
	}), [U, te] = m(!1), W = d(() => Z(t).filter((e) => e && N(e.id)).map((e) => ({
		...e,
		id: N(e.id),
		label: Q(e) || N(e.id)
	})), [t]), G = W.find((e) => !e.disabled)?.id || W[0]?.id || "", [ne, re] = $(n, r || G, (e, t) => i?.(e, W.find((t) => t.id === e), t)), K = W.find((e) => e.id === ne) || W.find((e) => !e.disabled) || W[0] || null, q = K?.id || "", [J, ie] = $(v, y, (e, t) => b?.(!!e, t));
	l(() => {
		J || (te(!1), H.current = {
			pointer: !1,
			focus: !1
		});
	}, [J]), l(() => {
		V.current === q && (V.current = "");
	}, [q]);
	let Y = d(() => xt({
		groups: a,
		commands: o,
		activeTabId: q,
		defaultGroupId: s,
		defaultGroupLabel: c
	}), [
		o,
		s,
		c,
		a,
		q
	]), ae = {
		activeTab: K,
		groups: Y,
		compact: S,
		minimized: !!J,
		flyoutOpen: !!(J && U)
	}, oe = typeof w == "function" ? w(ae) : C, se = typeof D == "function" ? D(ae) : T, ce = `${R}-panel-${gt(q || "commands")}`, le = (e, t) => {
		e.disabled || e.id === q || V.current === e.id || (V.current = e.id, re(e.id, t), vt(() => {
			V.current === e.id && (V.current = "");
		}));
	}, ue = (e, t) => {
		if (!(!J || e.disabled)) {
			if (t?.type === "focus" && ee.current) {
				ee.current = !1;
				return;
			}
			e.id !== q && le(e, t), te(!0);
		}
	}, de = () => {
		vt(() => B.current?.querySelector(yt)?.focus());
	}, fe = ({ restoreTabFocus: e = !1 } = {}) => {
		te(!1), !(!e || typeof window > "u") && (ee.current = !0, vt(() => {
			let e = z.current.get(q);
			e ? e.focus() : ee.current = !1;
		}));
	}, pe = (e, t, n) => {
		let r = W.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), le(i, n), z.current.get(i.id)?.focus();
	}, me = (e, t) => {
		if (J && t.key === "ArrowDown") {
			t.preventDefault(), ue(e, t), de();
			return;
		}
		if (J && t.key === "Escape") {
			t.preventDefault(), fe();
			return;
		}
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && pe(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && pe(e.id, -1, t), t.key === "Home" && pe(W.find((e) => !e.disabled)?.id || e.id, 0, t), t.key === "End") {
			let e = W.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), le(e, t), z.current.get(e.id)?.focus();
		}
	}, he = (e) => {
		te(!1), ie((e) => !e, e);
	}, ge = typeof j == "function" ? j({
		minimized: !!J,
		toggle: he
	}) : x && /* @__PURE__ */ _("button", {
		type: "button",
		className: "cad-workspace-ribbon__minimize",
		"aria-label": J ? "Expand ribbon" : "Minimize ribbon",
		"aria-expanded": !J,
		title: J ? "Expand ribbon" : "Minimize ribbon",
		onClick: he,
		children: [/* @__PURE__ */ g("span", {
			"aria-hidden": "true",
			children: J ? "⌄" : "⌃"
		}), /* @__PURE__ */ g("b", { children: J ? "EXPAND" : "COMPACT" })]
	}), _e = (e) => /* @__PURE__ */ _("div", {
		id: ce,
		ref: e ? B : void 0,
		role: "tabpanel",
		"aria-labelledby": q ? `${R}-tab-${gt(q)}` : void 0,
		tabIndex: e ? -1 : 0,
		className: X("cad-workspace-ribbon__commands", e && "cad-workspace-ribbon__commands--flyout"),
		onKeyDown: (t) => {
			!e || t.defaultPrevented || t.key !== "Escape" || (t.preventDefault(), fe({ restoreTabFocus: !0 }));
		},
		children: [
			/* @__PURE__ */ g("div", {
				className: "cad-workspace-ribbon__groups",
				role: "group",
				"aria-label": `${K?.label || "CAD"} commands`,
				children: Y.map((e, t) => /* @__PURE__ */ _("section", {
					className: "cad-workspace-ribbon__group",
					"data-cad-group": e.label,
					"data-primary": t === 0 ? "true" : "false",
					"aria-label": `${e.label} command group`,
					children: [/* @__PURE__ */ g("div", {
						className: "cad-workspace-ribbon__group-tools",
						children: e.commands.map((t, n) => /* @__PURE__ */ g(Ct, {
							command: t,
							group: e,
							activeTab: K,
							compact: S,
							renderIcon: k,
							renderCommand: A,
							onCommand: M
						}, t?.id || `${e.id}-${n}`))
					}), e.label && /* @__PURE__ */ g("span", {
						className: "cad-workspace-ribbon__group-label",
						children: e.label
					})]
				}, e.id))
			}),
			se && /* @__PURE__ */ g("div", {
				className: "cad-workspace-ribbon__status",
				"aria-label": E,
				children: se
			}),
			I && /* @__PURE__ */ g("div", {
				className: "cad-workspace-ribbon__content",
				children: I
			})
		]
	}), ve = !!(J && U), ye = () => {
		let e = H.current;
		!J || e.pointer || e.focus || fe();
	}, be = (e) => {
		L.onPointerEnter?.(e), !(e.defaultPrevented || !J) && (H.current.pointer = !0);
	}, xe = (e) => {
		L.onFocus?.(e), !(e.defaultPrevented || !J) && (H.current.focus = !0);
	}, Se = (e) => {
		L.onBlur?.(e), !(e.defaultPrevented || !J || _t(e.currentTarget, e.relatedTarget)) && (H.current.focus = !1, ye());
	}, Ce = (e) => {
		L.onPointerLeave?.(e), !(e.defaultPrevented || !J || _t(e.currentTarget, e.relatedTarget)) && (H.current.pointer = !1, ye());
	};
	return /* @__PURE__ */ _("header", {
		...L,
		className: X("cad-workspace-ribbon", S && "cad-workspace-ribbon--compact", J && "cad-workspace-ribbon--minimized", P),
		"data-active-tab": q || void 0,
		"data-minimized": J ? "true" : "false",
		"data-flyout-open": ve ? "true" : "false",
		"aria-label": f,
		style: {
			"--cad-ribbon-accent": K?.color || void 0,
			...F
		},
		onPointerEnter: be,
		onFocus: xe,
		onBlur: Se,
		onPointerLeave: Ce,
		children: [/* @__PURE__ */ _("div", {
			className: "cad-workspace-ribbon__tabbar",
			children: [
				oe && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__identity",
					children: oe
				}),
				W.length > 0 && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__tabs",
					role: "tablist",
					"aria-label": h,
					children: W.map((t) => {
						let n = t.id === q, r = `${R}-tab-${gt(t.id)}`;
						return /* @__PURE__ */ _("button", {
							id: r,
							ref: (e) => {
								e ? z.current.set(t.id, e) : z.current.delete(t.id);
							},
							type: "button",
							role: "tab",
							disabled: !!t.disabled,
							"aria-selected": n,
							"aria-controls": n ? ce : void 0,
							tabIndex: n ? 0 : -1,
							"data-tone": t.tone || "inherit",
							"data-active": n ? "true" : "false",
							className: "cad-workspace-ribbon__tab",
							style: t.color ? { "--cad-ribbon-tab-accent": t.color } : void 0,
							onClick: (e) => J ? ue(t, e) : le(t, e),
							onFocus: (e) => ue(t, e),
							onPointerEnter: (e) => ue(t, e),
							onKeyDown: (e) => me(t, e),
							children: [t.icon && /* @__PURE__ */ g("span", {
								className: "cad-workspace-ribbon__tab-icon",
								"aria-hidden": "true",
								children: e.isValidElement(t.icon) ? t.icon : typeof t.icon == "function" ? e.createElement(t.icon, { size: 12 }) : null
							}), /* @__PURE__ */ g("span", { children: t.label })]
						}, t.id);
					})
				}),
				O && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__end-slot",
					children: O
				}),
				ge
			]
		}), /* @__PURE__ */ g("div", {
			className: X("cad-workspace-ribbon__panel-host", J && "cad-workspace-ribbon__panel-host--flyout"),
			hidden: !!(J && !ve),
			children: _e(!!J)
		})]
	});
}
//#endregion
//#region src/CadOverlayUi.tsx
var Tt = (e, t) => (n) => {
	e?.(n), n.defaultPrevented || t?.(n);
}, Et = "button:not(:disabled):not([tabindex=\"-1\"]), input:not(:disabled):not([tabindex=\"-1\"]), select:not(:disabled):not([tabindex=\"-1\"]), textarea:not(:disabled):not([tabindex=\"-1\"]), [contenteditable=\"true\"]:not([tabindex=\"-1\"]), [href]:not([tabindex=\"-1\"]), [tabindex]:not([tabindex=\"-1\"])", Dt = (e) => !!(e && !e.hidden && !e.closest?.("[hidden], [aria-hidden=\"true\"], [inert]") && e.getAttribute("aria-hidden") !== "true" && e.getAttribute("aria-disabled") !== "true" && !e.hasAttribute("disabled")), Ot = (e) => [...e?.querySelectorAll(Et) || []].filter(Dt), kt = (e) => {
	if (e?.isConnected) try {
		e.focus({ preventScroll: !0 });
	} catch {
		e.focus?.();
	}
}, At = (e, t) => {
	if (!e || !t) return !1;
	try {
		return e === t || !!e.contains?.(t);
	} catch {
		return !1;
	}
}, jt = (e) => {
	if (typeof document > "u" || !e) return !1;
	let t = document.querySelectorAll("[data-cad-dialog=\"true\"]");
	return t[t.length - 1] === e;
}, Mt = (e, t = 0) => {
	let n = Number(e);
	return Number.isFinite(n) ? Math.round(n) : t;
}, Nt = (e, t = {
	x: 0,
	y: 0
}) => ({
	x: Mt(e?.x, Mt(t?.x, 0)),
	y: Mt(e?.y, Mt(t?.y, 0))
}), Pt = (e, t) => e?.x === t?.x && e?.y === t?.y, Ft = (e, t) => !e || !t ? !1 : e.pointerId === void 0 || t.pointerId === void 0 || e.pointerId === t.pointerId, It = (e) => [
	"top",
	"right",
	"bottom",
	"left"
].includes(String(e || "").toLocaleLowerCase()) ? String(e).toLocaleLowerCase() : "right", Lt = (e, t, n) => !Number.isFinite(e) || !Number.isFinite(t) ? {
	min: -Infinity,
	max: Infinity
} : e <= t ? {
	min: e,
	max: t
} : {
	min: n,
	max: n
};
function Rt({ position: e, defaultPosition: t = {
	x: 0,
	y: 0
}, onPositionChange: n, collapsed: r, defaultCollapsed: i = !1, onCollapsedChange: a, onDragStart: s, onDragEnd: c, edge: d = "right", moveStep: f = 16, label: h = "Movable overlay", handleLabel: v, handleIcon: y, className: b, children: x, style: S, "aria-label": C, ...w }) {
	let T = u(), E = `cad-movable-overlay-content-${T}`, D = `cad-movable-overlay-instructions-${T}`, O = p(null), k = p(null), A = p(null), j = p(null), M = p(null), N = p(null), P = p(!1), F = p(!1), [I, L] = m(!1), [R, z] = $(e, Nt(t), (e, t, r) => n?.(e, t, r)), [B, ee] = $(r, !!i, (e, t, n) => a?.(e, t, n)), V = Nt(R), H = !!B, U = It(d), te = Math.max(1, Math.round(Number(f) || 16));
	M.current = V, N.current = V, P.current = H;
	let W = o(() => {
		let e = O.current, t = e?.parentElement, n = e?.getBoundingClientRect?.(), r = t?.getBoundingClientRect?.(), i = N.current || {
			x: 0,
			y: 0
		};
		if (![
			n?.left,
			n?.right,
			n?.top,
			n?.bottom,
			n?.width,
			n?.height,
			r?.left,
			r?.right,
			r?.top,
			r?.bottom,
			r?.width,
			r?.height
		].every(Number.isFinite) || n.width <= 0 || n.height <= 0 || r.width <= 0 || r.height <= 0) return {
			minX: -Infinity,
			maxX: Infinity,
			minY: -Infinity,
			maxY: Infinity
		};
		let a = n.left - i.x, o = n.top - i.y, s = Lt(r.left - a, r.right - a - n.width, i.x), c = Lt(r.top - o, r.bottom - o - n.height, i.y);
		return {
			minX: s.min,
			maxX: s.max,
			minY: c.min,
			maxY: c.max
		};
	}, []), G = o((e, t, n = "programmatic", r = {}) => {
		let i = M.current || V, a = Nt(typeof e == "function" ? e(i) : e, i), o = W(), s = {
			x: Math.round(Ve(a.x, o.minX, o.maxX)),
			y: Math.round(Ve(a.y, o.minY, o.maxY))
		}, c = !Pt(i, s), l = {
			changed: c,
			previousPosition: i,
			position: s,
			source: n,
			edge: U,
			bounds: o,
			...r
		};
		return c && (M.current = s, z(s, l, t)), l;
	}, [
		U,
		V,
		W,
		z
	]), ne = o((e, t, n = "programmatic") => {
		let r = P.current, i = !!(typeof e == "function" ? e(r) : e), a = {
			changed: r !== i,
			previousCollapsed: r,
			collapsed: i,
			source: n,
			edge: U
		};
		return a.changed && (P.current = i, ee(i, a, t)), a;
	}, [U, ee]), re = o((e) => {
		try {
			e?.pointerId !== void 0 && e.handle?.hasPointerCapture?.(e.pointerId) && e.handle.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []), K = o(() => {
		let e = j.current;
		j.current = null, !(!e || typeof window > "u") && (window.removeEventListener("pointermove", e.move), window.removeEventListener("pointerup", e.end), window.removeEventListener("pointercancel", e.cancel));
	}, []), q = o((e) => {
		let t = A.current;
		if (!t || !Ft(t, e) || e.defaultPrevented) return;
		let n = Number(e.clientX), r = Number(e.clientY);
		if (!Number.isFinite(n) || !Number.isFinite(r)) return;
		let i = n - t.startClientX, a = r - t.startClientY;
		!t.moved && Math.hypot(i, a) >= 3 && (t.moved = !0, L(!0), s?.(t.startPosition, {
			edge: U,
			source: "pointer"
		}, e)), t.moved && (e.cancelable && e.preventDefault(), G({
			x: t.startPosition.x + i,
			y: t.startPosition.y + a
		}, e, "pointer", {
			axis: "both",
			dragging: !0
		}));
	}, [
		G,
		U,
		s
	]), J = o((e, t = !1) => {
		let n = A.current;
		if (!n || e && !Ft(n, e) || (A.current = null, K(), re(n), L(!1), F.current = !!n.moved, !n.moved)) return;
		let r = M.current || n.startPosition;
		c?.(r, {
			changed: !Pt(n.startPosition, r),
			cancelled: !!t,
			edge: U,
			source: "pointer"
		}, e);
	}, [
		U,
		c,
		re,
		K
	]), ie = (e) => {
		if (e.defaultPrevented || e.button !== void 0 && e.button !== 0) return;
		let t = e.pointerId, n = Number(e.clientX), r = Number(e.clientY);
		if (!Number.isFinite(n) || !Number.isFinite(r)) return;
		let i = e.currentTarget, a = M.current || V;
		A.current = {
			pointerId: t,
			handle: i,
			startClientX: n,
			startClientY: r,
			startPosition: a,
			moved: !1
		}, F.current = !1;
		try {
			i.setPointerCapture?.(t);
		} catch {}
		if (typeof window < "u") {
			let e = {
				move: q,
				end: (e) => J(e, !1),
				cancel: (e) => J(e, !0)
			};
			j.current = e, window.addEventListener("pointermove", e.move), window.addEventListener("pointerup", e.end), window.addEventListener("pointercancel", e.cancel);
		}
	}, Y = (e) => {
		if (e.defaultPrevented) return;
		let t = e.shiftKey ? 4 : 1, n = te * t, r = W(), i = M.current || V, a;
		e.key === "ArrowLeft" && (a = {
			...i,
			x: i.x - n
		}), e.key === "ArrowRight" && (a = {
			...i,
			x: i.x + n
		}), e.key === "ArrowUp" && (a = {
			...i,
			y: i.y - n
		}), e.key === "ArrowDown" && (a = {
			...i,
			y: i.y + n
		}), e.key === "Home" && Number.isFinite(r.minX) && Number.isFinite(r.minY) && (a = {
			x: r.minX,
			y: r.minY
		}), e.key === "End" && Number.isFinite(r.maxX) && Number.isFinite(r.maxY) && (a = {
			x: r.maxX,
			y: r.maxY
		}), a && (e.preventDefault(), G(a, e, "keyboard", {
			key: e.key,
			multiplier: t
		}));
	}, ae = (e) => {
		if (F.current) {
			F.current = !1, e.preventDefault();
			return;
		}
		ne((e) => !e, e, "toggle");
	};
	l(() => () => {
		let e = A.current;
		A.current = null, K(), re(e);
	}, [re, K]), l(() => {
		!H || typeof document > "u" || document.getElementById(E)?.contains(document.activeElement) && kt(k.current);
	}, [E, H]), l(() => {
		let e = O.current, t = e?.parentElement;
		if (!e || !t) return;
		let n = () => G(M.current || V, void 0, "boundary");
		if (n(), typeof ResizeObserver < "u") {
			let r = new ResizeObserver(n);
			return r.observe(e), r.observe(t), () => r.disconnect();
		}
		if (!(typeof window > "u")) return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
	}, [
		G,
		V,
		H
	]);
	let oe = H ? `Expand ${h}` : `Collapse ${h}`, se = v ? `${v}. ${oe}` : oe, ce = y != null && y !== !1, le = typeof y == "function" ? y : null, ue = U === "top" ? H ? "⌄" : "⌃" : U === "bottom" ? H ? "⌃" : "⌄" : H ? U === "left" ? "›" : "‹" : U === "left" ? "‹" : "›", de = {
		...S,
		"--cad-movable-overlay-x": `${V.x}px`,
		"--cad-movable-overlay-y": `${V.y}px`
	};
	return /* @__PURE__ */ _("aside", {
		...w,
		ref: O,
		className: X("cad-movable-overlay", b),
		style: de,
		"data-edge": U,
		"data-has-handle-icon": ce ? "true" : "false",
		"data-collapsed": H ? "true" : "false",
		"data-dragging": I ? "true" : "false",
		"data-position-x": V.x,
		"data-position-y": V.y,
		"aria-label": C || h,
		children: [
			/* @__PURE__ */ g("div", {
				id: E,
				className: "cad-movable-overlay__content",
				hidden: H,
				children: x
			}),
			/* @__PURE__ */ _("button", {
				type: "button",
				ref: k,
				className: "cad-movable-overlay__handle",
				"aria-label": se,
				"aria-controls": E,
				"aria-expanded": !H,
				"aria-describedby": D,
				title: `${oe}. Drag to move; Arrow keys nudge.`,
				onPointerDown: ie,
				onPointerMove: q,
				onPointerUp: (e) => J(e, !1),
				onPointerCancel: (e) => J(e, !0),
				onLostPointerCapture: (e) => J(e, !0),
				onKeyDown: Y,
				onClick: ae,
				children: [/* @__PURE__ */ _("span", {
					className: "cad-movable-overlay__identity",
					"aria-hidden": "true",
					children: [ce && /* @__PURE__ */ g("span", {
						className: "cad-movable-overlay__icon",
						children: le ? /* @__PURE__ */ g(le, {
							size: 12,
							"aria-hidden": "true"
						}) : y
					}), /* @__PURE__ */ g("span", { className: "cad-movable-overlay__ridges" })]
				}), /* @__PURE__ */ g("span", {
					className: "cad-movable-overlay__chevron",
					"aria-hidden": "true",
					children: ue
				})]
			}),
			/* @__PURE__ */ _("span", {
				id: D,
				className: "cad-cui-sr-only",
				children: [
					"Drag to move this overlay. Arrow keys nudge it, Shift plus an arrow key moves it farther, and Home or End moves it to a viewport corner. Click to ",
					H ? "expand" : "collapse",
					" it."
				]
			})
		]
	});
}
function zt({ open: e = !1, onClose: t, title: n, description: r, actions: i, tone: a = "neutral", closeOnBackdrop: o = !0, closeOnEscape: s = !0, className: c, children: d, ...f }) {
	let m = u(), h = `cad-dialog-title-${m}`, v = `cad-dialog-description-${m}`, y = p(null), b = p(t), x = p(s), { "aria-label": S, "aria-labelledby": C, "aria-describedby": w, onKeyDown: T, ...E } = f;
	if (b.current = t, x.current = s, l(() => {
		if (!e || typeof document > "u") return;
		let t = document.activeElement, n = () => {
			let e = y.current;
			if (!jt(e)) return;
			let t = Ot(e);
			kt(t.find((e) => e.hasAttribute("data-autofocus")) || t[0] || e);
		}, r = (e) => {
			let t = y.current;
			if (e.defaultPrevented || !jt(t)) return;
			if (e.key === "Escape" && x.current) {
				e.preventDefault(), b.current?.(e);
				return;
			}
			if (e.key !== "Tab") return;
			let n = Ot(t);
			if (!n.length) {
				e.preventDefault(), kt(t);
				return;
			}
			let r = n[0], i = n[n.length - 1], a = document.activeElement;
			t?.contains(a) ? e.shiftKey && a === r ? (e.preventDefault(), kt(i)) : !e.shiftKey && a === i && (e.preventDefault(), kt(r)) : (e.preventDefault(), kt(e.shiftKey ? i : r));
		}, i = window.setTimeout(n, 0);
		return window.addEventListener("keydown", r), () => {
			window.clearTimeout(i), window.removeEventListener("keydown", r), kt(t);
		};
	}, [e]), !e) return null;
	let D = n ? h : C, O = [r ? v : void 0, w].filter(Boolean).join(" ") || void 0, k = D ? void 0 : S || "CAD dialog", A = typeof n == "string" && n.trim() ? `Close ${n}` : "Close dialog";
	return /* @__PURE__ */ g("div", {
		className: "cad-dialog-backdrop",
		"data-tone": a,
		role: "presentation",
		onMouseDown: (e) => {
			o && e.target === e.currentTarget && b.current?.(e);
		},
		children: /* @__PURE__ */ _("section", {
			...E,
			ref: y,
			tabIndex: -1,
			className: X("cad-dialog", c),
			"data-cad-dialog": "true",
			"data-tone": a,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": k,
			"aria-labelledby": D,
			"aria-describedby": O,
			onKeyDown: (e) => T?.(e),
			children: [
				/* @__PURE__ */ _("header", {
					className: "cad-dialog__header",
					children: [/* @__PURE__ */ _("div", { children: [n && /* @__PURE__ */ g("h2", {
						id: h,
						children: n
					}), r && /* @__PURE__ */ g("p", {
						id: v,
						children: r
					})] }), t && /* @__PURE__ */ g("button", {
						type: "button",
						className: "cad-dialog__close",
						"aria-label": A,
						onClick: t,
						children: "×"
					})]
				}),
				/* @__PURE__ */ g("div", {
					className: "cad-dialog__body",
					children: d
				}),
				i && /* @__PURE__ */ g("footer", {
					className: "cad-dialog__footer",
					children: i
				})
			]
		})
	});
}
function Bt({ open: e, title: t = "Confirm action", description: n, confirmLabel: r = "Confirm", cancelLabel: i = "Cancel", destructive: a = !1, onConfirm: o, onCancel: s, children: c, className: l, ...u }) {
	return /* @__PURE__ */ g(zt, {
		...u,
		open: e,
		title: t,
		description: n,
		onClose: s,
		className: X("cad-confirm-dialog", l),
		actions: /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("button", {
			type: "button",
			...a ? { "data-autofocus": !0 } : {},
			className: "cad-dialog__button cad-dialog__button--quiet",
			onClick: s,
			children: i
		}), /* @__PURE__ */ g("button", {
			type: "button",
			...a ? {} : { "data-autofocus": !0 },
			className: X("cad-dialog__button", a && "cad-dialog__button--danger"),
			onClick: o,
			children: r
		})] }),
		children: c
	});
}
function Vt({ toast: e, onDismiss: t, className: n }) {
	let r = e || {}, i = r.tone || "neutral";
	return /* @__PURE__ */ _("article", {
		className: X("cad-toast", n),
		"data-tone": i,
		role: i === "danger" || i === "error" ? "alert" : "status",
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-toast__signal",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-toast__copy",
				children: [/* @__PURE__ */ g("strong", { children: r.title || Q(r) || "CAD notification" }), r.message && /* @__PURE__ */ g("p", { children: r.message })]
			}),
			r.action && /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-toast__action",
				onClick: (e) => r.action.onClick?.(r, e),
				children: r.action.label || "Open"
			}),
			t && /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-toast__close",
				"aria-label": `Dismiss ${r.title || Q(r) || "notification"}`,
				onClick: (e) => t(r, e),
				children: "×"
			})
		]
	});
}
function Ht({ toasts: e = [], onDismiss: t, placement: n = "bottom-right", label: r = "Notifications", className: i, ...a }) {
	return /* @__PURE__ */ g("section", {
		...a,
		className: X("cad-toast-stack", `cad-toast-stack--${n}`, i),
		"aria-label": r,
		"aria-live": "polite",
		children: Z(e).map((e, n) => /* @__PURE__ */ g(Vt, {
			toast: e,
			onDismiss: t
		}, e?.id || n))
	});
}
function Ut({ trigger: e, content: n, open: r, defaultOpen: i = !1, onOpenChange: o, placement: s = "bottom-start", label: c = "More options", contentRole: d = "region", closeOnOutside: f = !0, closeOnEscape: m = !0, closeOnFocusOutside: h = !1, closeOnPointerLeave: v = !1, restoreFocus: y = !0, focusOnOpen: b, className: x, contentClassName: S, onKeyDown: C, onBlur: w, onPointerLeave: T, ...E }) {
	let D = `cad-popover-${u()}`, O = p(null), k = p(null), A = p(r === void 0 ? i : r), [j, M] = $(r, i, (e, t) => o?.(e, t)), N = d === !1 ? void 0 : d, P = [
		"dialog",
		"grid",
		"listbox",
		"menu",
		"tree"
	].includes(N) ? N : void 0, F = b ?? N === "dialog", I = (e) => M(!1, e), L = (e) => M(!j, e);
	l(() => {
		let e = A.current;
		if (A.current = j, !e || j || !y || typeof window > "u") return;
		let t = window.requestAnimationFrame(() => {
			let e = O.current?.querySelector("[data-cad-popover-trigger=\"true\"]");
			e && document.contains(e) && e.focus?.();
		});
		return () => window.cancelAnimationFrame(t);
	}, [j, y]), l(() => {
		if (!j || !F || typeof window > "u") return;
		let e = window.setTimeout(() => {
			let e = k.current, t = Ot(e);
			kt(t.find((e) => e.hasAttribute("data-autofocus")) || t[0] || e);
		}, 0);
		return () => window.clearTimeout(e);
	}, [j, F]), l(() => {
		if (!j || typeof document > "u") return;
		let e = (e) => {
			f && !O.current?.contains(e.target) && M(!1, e);
		}, t = (e) => {
			!m || e.defaultPrevented || e.key !== "Escape" || (e.preventDefault(), M(!1, e));
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t);
		};
	}, [
		m,
		f,
		j,
		M
	]);
	let R = a(e) ? t(e, {
		"data-cad-popover-trigger": "true",
		"aria-haspopup": e.props["aria-haspopup"] ?? P,
		"aria-expanded": j,
		"aria-controls": j ? D : void 0,
		onClick: Tt(e.props.onClick, L)
	}) : /* @__PURE__ */ g("button", {
		type: "button",
		"data-cad-popover-trigger": "true",
		className: "cad-popover__fallback-trigger",
		"aria-haspopup": P,
		"aria-expanded": j,
		"aria-controls": j ? D : void 0,
		onClick: L,
		children: e || "Options"
	}), z = (e) => {
		C?.(e), !e.defaultPrevented && m && e.key === "Escape" && j && (e.preventDefault(), I(e));
	}, B = (e) => {
		w?.(e), !e.defaultPrevented && h && j && !At(e.currentTarget, e.relatedTarget) && I(e);
	}, ee = (e) => {
		T?.(e), !e.defaultPrevented && v && j && !At(e.currentTarget, e.relatedTarget) && I(e);
	};
	return /* @__PURE__ */ _("div", {
		...E,
		ref: O,
		className: X("cad-popover", `cad-popover--${s}`, x),
		onKeyDown: z,
		onBlur: B,
		onPointerLeave: ee,
		children: [R, j && /* @__PURE__ */ g("div", {
			id: D,
			ref: k,
			tabIndex: F ? -1 : void 0,
			className: X("cad-popover__content", S),
			role: N,
			"aria-label": c,
			children: typeof n == "function" ? n({ close: I }) : n
		})]
	});
}
function Wt({ content: e, placement: n = "top", className: r, children: i }) {
	let o = u(), [s, c] = m(!1);
	if (!e || !a(i)) return i || null;
	let l = t(i, {
		"aria-describedby": [i.props["aria-describedby"], `cad-tooltip-${o}`].filter(Boolean).join(" "),
		onMouseEnter: Tt(i.props.onMouseEnter, () => c(!0)),
		onMouseLeave: Tt(i.props.onMouseLeave, () => c(!1)),
		onFocus: Tt(i.props.onFocus, () => c(!0)),
		onBlur: Tt(i.props.onBlur, () => c(!1))
	});
	return /* @__PURE__ */ _("span", {
		className: X("cad-tooltip", `cad-tooltip--${n}`, s && "cad-tooltip--visible", r),
		children: [l, /* @__PURE__ */ g("span", {
			id: `cad-tooltip-${o}`,
			className: "cad-tooltip__bubble",
			role: "tooltip",
			children: e
		})]
	});
}
function Gt({ shortcuts: e = [], title: t = "Keyboard shortcuts", onClose: n, className: r, ...i }) {
	let a = Z(e).reduce((e, t, n) => {
		let r = t?.group || "General";
		return e[r] || (e[r] = []), e[r].push({
			...t,
			id: t?.id || `${r}-${n}`
		}), e;
	}, {});
	return /* @__PURE__ */ _("section", {
		...i,
		className: X("cad-shortcut-reference", r),
		"aria-label": t,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("h2", { children: t }), n && /* @__PURE__ */ g("button", {
			type: "button",
			"aria-label": `Close ${t}`,
			onClick: n,
			children: "×"
		})] }), /* @__PURE__ */ g("div", {
			className: "cad-shortcut-reference__groups",
			children: Object.entries(a).map(([e, t]) => /* @__PURE__ */ _("section", { children: [/* @__PURE__ */ g("h3", { children: e }), /* @__PURE__ */ g("dl", { children: t.map((e) => /* @__PURE__ */ _("div", { children: [
				/* @__PURE__ */ g("dt", { children: e.label || e.command || e.id }),
				/* @__PURE__ */ g("dd", { children: /* @__PURE__ */ g(Ue, { shortcut: e.shortcut || e.keys }) }),
				e.detail && /* @__PURE__ */ g("small", { children: e.detail })
			] }, e.id)) })] }, e))
		})]
	});
}
function Kt({ open: e = !0, label: t = "Command input", prompt: n, value: r, defaultValue: i = "", onChange: a, onSubmit: o, onCancel: s, placeholder: c, submitLabel: l = "Accept", className: d, ...f }) {
	let p = u(), [m, h] = $(r, i, (e, t) => a?.(e, t));
	return e ? /* @__PURE__ */ _("form", {
		...f,
		className: X("cad-command-prompt", d),
		"aria-label": t,
		onKeyDown: (e) => {
			f.onKeyDown?.(e), !e.defaultPrevented && e.key === "Escape" && (e.preventDefault(), s?.(e));
		},
		onSubmit: (e) => {
			e.preventDefault(), o?.(m, e);
		},
		children: [
			n && /* @__PURE__ */ g("label", {
				htmlFor: `cad-command-prompt-${p}`,
				children: n
			}),
			/* @__PURE__ */ g("input", {
				id: `cad-command-prompt-${p}`,
				"aria-label": n || t,
				value: m ?? "",
				placeholder: c,
				autoFocus: !0,
				onChange: (e) => h(e.target.value, e)
			}),
			(s || o) && /* @__PURE__ */ _("div", { children: [s && /* @__PURE__ */ g("button", {
				type: "button",
				onClick: s,
				children: "Cancel"
			}), o && /* @__PURE__ */ g("button", {
				type: "submit",
				children: l
			})] })
		]
	}) : null;
}
//#endregion
//#region src/CadCompactWorkspaceRibbon.tsx
var qt = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, Jt = (e) => N(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace", Yt = (e) => N(e?.tabId || e?.tab || e?.placement?.tab), Xt = (e) => N(e?.tabId || e?.tab || e?.placement?.tab), Zt = (e) => Z(e?.commands).length ? Z(e.commands) : Z(e?.items), Qt = {
	cyan: "#53c9ff",
	green: "#9add4b",
	amber: "#ffb554",
	magenta: "#f08cff",
	violet: "#b9a1ff",
	neutral: "#b4bdc7"
}, $t = (e) => e?.color || Qt[e?.tone] || "var(--cad-workspace-accent, #53c9ff)", en = (e) => Z(e).filter((e) => e && N(e.id)).map((e) => ({
	...e,
	id: N(e.id),
	label: Q(e) || N(e.id)
})), tn = ({ groups: e, activeTabId: t, defaultGroupLabel: n }) => Z(e).filter((e) => e && typeof e == "object" && (!t || !Xt(e) || Xt(e) === t)).map((e, r) => ({
	id: N(e.id) || `group-${r + 1}`,
	label: N(e.label) || n,
	order: qt(e.order, r),
	commands: Zt(e).filter((e) => !t || !Yt(e) || Yt(e) === t)
})).filter((e) => e.commands.length).sort((e, t) => e.order - t.order);
function nn({ groups: e, commands: t = [], tabId: n = "", defaultGroupId: r = "commands", defaultGroupLabel: i = "COMMANDS" } = {}) {
	let a = tn({
		groups: e,
		activeTabId: n,
		defaultGroupLabel: i
	});
	return a.length ? a : bt(t, {
		tabId: n,
		defaultGroupId: r,
		defaultGroupLabel: i
	});
}
function rn({ command: e, group: t, activeTab: n, renderIcon: r, renderCommand: i, onCommand: o, close: s, closeOnCommand: c }) {
	let l = Q(e) || "COMMAND", u = !!(e?.pressed ?? e?.active), d = !!(e?.toggle || e?.pressed !== void 0 || e?.active !== void 0), f = {
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
	}, p = typeof r == "function" ? r(e, f) : e?.icon, m = typeof p == "function" ? p : null, v = a(p) ? p : null, y = {
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
	if (typeof i == "function") return i(e, {
		...f,
		icon: p,
		buttonProps: y
	});
	let b = v && /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("span", {
		className: "cad-compact-workspace-ribbon__command-icon",
		"aria-hidden": "true",
		children: v
	}), /* @__PURE__ */ g("span", { children: l })] });
	return /* @__PURE__ */ g(We, {
		...y,
		icon: m || void 0,
		label: b ? void 0 : l,
		badge: e?.badge,
		active: u,
		toggle: d,
		children: b || void 0
	});
}
function an({ tab: e, groups: t, openGroupId: n, onOpenGroupChange: r, renderIcon: i, renderCommand: a, onCommand: o, close: s, closeOnCommand: c, label: l }) {
	let d = t.find((e) => e.id === n) || null, f = u();
	return /* @__PURE__ */ _("section", {
		className: "cad-compact-workspace-ribbon__disclosure-body",
		"data-tab-id": e.id,
		children: [
			/* @__PURE__ */ _("header", {
				className: "cad-compact-workspace-ribbon__disclosure-header",
				children: [/* @__PURE__ */ g("span", { children: "COMMAND GROUPS" }), /* @__PURE__ */ g("strong", { children: e.label })]
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-compact-workspace-ribbon__groups",
				role: "list",
				"aria-label": `${e.label} command groups`,
				children: t.map((e) => {
					let n = e.id === d?.id, i = `${f}-${Jt(e.id)}`;
					return /* @__PURE__ */ g("div", {
						role: "listitem",
						children: /* @__PURE__ */ _("button", {
							type: "button",
							className: "cad-compact-workspace-ribbon__group",
							"data-active": n ? "true" : "false",
							"aria-expanded": n,
							"aria-controls": n ? i : void 0,
							onClick: (t) => r(n ? null : e.id, e, t),
							children: [
								/* @__PURE__ */ g("span", {
									className: "cad-compact-workspace-ribbon__group-index",
									"aria-hidden": "true",
									children: String(t.indexOf(e) + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ g("span", { children: e.label }),
								/* @__PURE__ */ g("small", { children: e.commands.length }),
								/* @__PURE__ */ g("b", {
									"aria-hidden": "true",
									children: n ? "−" : "+"
								})
							]
						})
					}, e.id);
				})
			}),
			d && /* @__PURE__ */ _("div", {
				id: `${f}-${Jt(d.id)}`,
				className: "cad-compact-workspace-ribbon__commands",
				role: "region",
				"aria-label": `${d.label} commands`,
				children: [/* @__PURE__ */ _("div", {
					className: "cad-compact-workspace-ribbon__commands-heading",
					children: [/* @__PURE__ */ g("span", { children: d.label }), /* @__PURE__ */ _("small", { children: [d.commands.length, " COMMANDS"] })]
				}), /* @__PURE__ */ g("div", {
					className: "cad-compact-workspace-ribbon__command-grid",
					role: "toolbar",
					"aria-label": `${d.label} tools`,
					children: d.commands.map((t, n) => /* @__PURE__ */ g(rn, {
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
			!t.length && /* @__PURE__ */ g("p", {
				className: "cad-compact-workspace-ribbon__empty",
				children: "No commands are available on this tab."
			}),
			/* @__PURE__ */ _("footer", {
				className: "cad-compact-workspace-ribbon__disclosure-footer",
				children: [/* @__PURE__ */ g("span", { children: l }), /* @__PURE__ */ g("button", {
					type: "button",
					onClick: s,
					children: "CLOSE"
				})]
			})
		]
	});
}
function on({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: i, openTabId: o, defaultOpenTabId: s = null, onOpenTabChange: c, openGroupId: l, defaultOpenGroupId: f = null, onOpenGroupChange: m, groups: h, commands: v = [], defaultGroupId: y = "commands", defaultGroupLabel: b = "COMMANDS", label: x = "Compact CAD workspace ribbon", tabListLabel: S = "Compact workspace commands", identity: C, endSlot: w, placement: T = "bottom-start", closeOnOutside: E = !0, closeOnEscape: D = !0, closeOnFocusOutside: O = !0, closeOnPointerLeave: k = !0, closeOnCommand: A = !0, renderIcon: j, renderCommand: M, onCommand: N, className: P, style: F, ...I }) {
	let L = `cad-compact-workspace-ribbon-${Jt(u())}`, R = p(/* @__PURE__ */ new Map()), z = d(() => en(t), [t]), B = z.find((e) => !e.disabled)?.id || z[0]?.id || "", [ee, V] = $(n, r || B, (e, t) => i?.(e, z.find((t) => t.id === e) || null, t)), H = z.find((e) => e.id === ee) || z.find((e) => !e.disabled) || z[0] || null, [U, te] = $(o, s, (e, t) => c?.(e || null, z.find((t) => t.id === e) || null, t)), W = z.find((e) => e.id === U && !e.disabled) || null, G = W?.id || "", [ne, re] = $(l, f, (e, t, n) => m?.(e || null, t || null, W || null, n)), K = d(() => new Map(z.map((e) => [e.id, nn({
		groups: h,
		commands: v,
		tabId: e.id,
		defaultGroupId: y,
		defaultGroupLabel: b
	})])), [
		v,
		y,
		b,
		h,
		z
	]), q = (e) => {
		re(null, null, e), te(null, e);
	}, J = (e, t) => {
		V(e.id, t), G !== e.id && re(null, null, t), te(e.id, t);
	}, ie = (e, t) => {
		e.disabled || (V(e.id, t), q(t));
	}, Y = (e, t, n) => {
		let r = z.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), ie(i, n), R.current.get(i.id)?.focus();
	}, ae = (e, t) => {
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && Y(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && Y(e.id, -1, t), t.key === "Home") {
			let e = z.find((e) => !e.disabled);
			if (!e) return;
			t.preventDefault(), ie(e, t), R.current.get(e.id)?.focus();
		}
		if (t.key === "End") {
			let e = z.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), ie(e, t), R.current.get(e.id)?.focus();
		}
	}, oe = (e, t, n) => re(e, t, n);
	return /* @__PURE__ */ g("header", {
		...I,
		className: X("cad-workspace-ribbon", "cad-compact-workspace-ribbon", P),
		"data-active-tab": H?.id || void 0,
		"data-open-tab": G || void 0,
		"aria-label": x,
		style: {
			"--cad-ribbon-accent": $t(H),
			...F
		},
		children: /* @__PURE__ */ _("div", {
			className: "cad-workspace-ribbon__tabbar cad-compact-workspace-ribbon__tabbar",
			children: [
				C && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__identity",
					children: C
				}),
				z.length > 0 && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__tabs",
					role: "tablist",
					"aria-label": S,
					children: z.map((t) => {
						let n = t.id === H?.id, r = t.id === G, i = `${L}-tab-${Jt(t.id)}`, o = K.get(t.id) || [];
						return /* @__PURE__ */ g(Ut, {
							open: r,
							onOpenChange: (e, n) => {
								e ? J(t, n) : r && q(n);
							},
							placement: T,
							label: `${t.label} compact command menu`,
							closeOnOutside: E,
							closeOnEscape: D,
							closeOnFocusOutside: O,
							closeOnPointerLeave: k,
							className: "cad-compact-workspace-ribbon__popover",
							contentClassName: "cad-compact-workspace-ribbon__disclosure",
							style: { "--cad-compact-ribbon-accent": $t(t) },
							trigger: /* @__PURE__ */ _("button", {
								id: i,
								ref: (e) => {
									e ? R.current.set(t.id, e) : R.current.delete(t.id);
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
								onKeyDown: (e) => ae(t, e),
								children: [t.icon && /* @__PURE__ */ g("span", {
									className: "cad-workspace-ribbon__tab-icon",
									"aria-hidden": "true",
									children: a(t.icon) ? t.icon : typeof t.icon == "function" ? e.createElement(t.icon, { size: 12 }) : null
								}), /* @__PURE__ */ g("span", { children: t.label })]
							}),
							content: ({ close: e }) => /* @__PURE__ */ g(an, {
								tab: t,
								groups: o,
								openGroupId: r ? ne : null,
								onOpenGroupChange: oe,
								renderIcon: j,
								renderCommand: M,
								onCommand: N,
								close: e,
								closeOnCommand: A,
								label: x
							})
						}, t.id);
					})
				}),
				w && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__end-slot",
					children: w
				})
			]
		})
	});
}
//#endregion
//#region src/CadContextUi.tsx
var sn = Object.freeze([
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
]), cn = Object.freeze([
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
]), ln = Object.freeze([
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
]), un = (e, t) => Z(e).map((e, n) => {
	if (typeof e == "string" || typeof e == "number") return {
		id: String(e),
		label: String(e)
	};
	let r = Q(e) || `${t} ${n + 1}`;
	return {
		...e,
		id: e?.id ?? `${t}-${n + 1}`,
		label: r
	};
}), dn = (e) => Z(e).find((e) => !e?.disabled)?.id ?? "", fn = (e, t, n, r) => {
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
function pn({ actions: e = sn, activeId: t, defaultActiveId: n = "", onActiveChange: r, onChange: i, onAction: a, onPan: o, onZoom: s, onZoomIn: c, onZoomOut: l, onZoomWindow: u, onZoomExtents: f, onOrbit: p, onHome: m, label: h = "Viewport navigation", orientation: v = "vertical", className: y, ...b }) {
	let x = d(() => un(e, "navigation-action"), [e]), [S, C] = $(t, n, (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), w = (e, t) => {
		e.disabled || ((e.toggle ?? e.mode ?? !1) && C(S === e.id ? "" : e.id, e, t), e.onClick?.(e, t), a?.(e, t), fn(e.id, {
			onPan: o,
			onZoom: s,
			onZoomIn: c,
			onZoomOut: l,
			onZoomWindow: u,
			onZoomExtents: f,
			onOrbit: p,
			onHome: m
		}, e, t));
	};
	return /* @__PURE__ */ g("nav", {
		...b,
		className: X("cad-navigation-bar", `cad-navigation-bar--${v}`, y),
		"aria-label": h,
		children: /* @__PURE__ */ g("div", {
			className: "cad-navigation-bar__tools",
			role: "toolbar",
			"aria-label": h,
			"aria-orientation": v,
			children: x.map((e, t) => {
				if (e.type === "separator") return /* @__PURE__ */ g("span", {
					className: "cad-navigation-bar__separator",
					role: "separator",
					"aria-orientation": v === "vertical" ? "horizontal" : "vertical"
				}, e.id || t);
				let n = e.icon, r = e.toggle ?? e.mode ?? !1, i = r && S === e.id, a = Q(e);
				return /* @__PURE__ */ _("button", {
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
					children: [typeof n == "function" ? /* @__PURE__ */ g(n, {
						size: 14,
						"aria-hidden": "true"
					}) : /* @__PURE__ */ g("span", {
						className: "cad-navigation-bar__glyph",
						"aria-hidden": "true",
						children: n || e.glyph || "•"
					}), /* @__PURE__ */ g("span", {
						className: "cad-navigation-bar__label",
						children: a
					})]
				}, e.id);
			})
		})
	});
}
function mn({ styles: e = cn, value: t, defaultValue: n, onChange: r, onStyleChange: i, label: a = "Visual style", id: o, selectProps: s = {}, disabled: c = !1, className: l, ...f }) {
	let p = u(), m = o || `cad-visual-style-${p}`, h = d(() => un(e, "visual-style"), [e]), [v, y] = $(t, n ?? h[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), b = h.find((e) => e.id === v) || h[0];
	return /* @__PURE__ */ _("div", {
		...f,
		className: X("cad-visual-style-picker", l),
		"data-visual-style": b?.id || "",
		children: [/* @__PURE__ */ g("label", {
			htmlFor: m,
			children: a
		}), /* @__PURE__ */ _("span", {
			className: "cad-visual-style-picker__control",
			children: [/* @__PURE__ */ g("span", {
				className: "cad-visual-style-picker__preview",
				"data-style": b?.id || "",
				"aria-hidden": "true"
			}), /* @__PURE__ */ g("select", {
				...s,
				id: m,
				value: v ?? "",
				disabled: c || s.disabled,
				onChange: (e) => {
					let t = h.find((t) => t.id === e.target.value);
					y(e.target.value, t, e), s.onChange?.(e);
				},
				children: h.map((e) => /* @__PURE__ */ g("option", {
					value: e.id,
					disabled: e.disabled,
					children: e.label
				}, e.id))
			})]
		})]
	});
}
function hn({ scales: e = ln, value: t, defaultValue: n, onChange: r, onScaleChange: i, onManage: a, manageLabel: o = "Manage", label: s = "Viewport scale", id: c, selectProps: l = {}, disabled: f = !1, className: p, ...m }) {
	let h = u(), v = c || `cad-viewport-scale-${h}`, y = d(() => un(e, "viewport-scale"), [e]), [b, x] = $(t, n ?? y[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), S = y.find((e) => e.id === b) || y[0];
	return /* @__PURE__ */ _("div", {
		...m,
		className: X("cad-viewport-scale-picker", p),
		"data-scale": S?.id || "",
		children: [/* @__PURE__ */ g("label", {
			htmlFor: v,
			children: s
		}), /* @__PURE__ */ _("span", {
			className: "cad-viewport-scale-picker__control",
			children: [/* @__PURE__ */ g("select", {
				...l,
				id: v,
				value: b ?? "",
				disabled: f || l.disabled,
				onChange: (e) => {
					let t = y.find((t) => t.id === e.target.value);
					x(e.target.value, t, e), l.onChange?.(e);
				},
				children: y.map((e) => /* @__PURE__ */ g("option", {
					value: e.id,
					disabled: e.disabled,
					children: e.label
				}, e.id))
			}), a && /* @__PURE__ */ g("button", {
				type: "button",
				disabled: f || l.disabled,
				onClick: (e) => a(S, e),
				children: o
			})]
		})]
	});
}
function gn({ sets: e = [], activeId: t, defaultActiveId: n, onChange: r, onApply: i, onCreate: a, onRename: o, onDelete: s, filter: c, defaultFilter: l = "", onFilterChange: f, showFilter: p = !0, title: m = "Selection sets", filterLabel: h = "Filter selection sets", emptyLabel: v = "No selection sets match the current filter", createLabel: y = "New", applyLabel: b = "Select", renameLabel: x = "Rename", deleteLabel: S = "Delete", className: C, children: w, ...T }) {
	let E = `cad-selection-set-filter-${u()}`, D = d(() => un(e, "selection-set"), [e]), [O, k] = $(t, n ?? dn(D), (e, t, n) => r?.(e, t, n)), [A, j] = $(c, l, (e, t) => f?.(e, t)), M = D.find((e) => e.id === O), N = d(() => {
		let e = String(A || "").trim().toLocaleLowerCase();
		return e ? D.filter((t) => [
			Q(t),
			t.description,
			t.group
		].filter(Boolean).join(" ").toLocaleLowerCase().includes(e)) : D;
	}, [D, A]), P = !!(M?.disabled || M?.locked || M?.protected || M?.system);
	return /* @__PURE__ */ _("section", {
		...T,
		className: X("cad-selection-set-panel", C),
		"aria-label": m,
		children: [
			/* @__PURE__ */ _("header", {
				className: "cad-selection-set-panel__header",
				children: [/* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("h2", { children: m }), /* @__PURE__ */ g("output", {
					"aria-label": `${D.length} selection sets`,
					children: D.length
				})] }), a && /* @__PURE__ */ g("button", {
					type: "button",
					className: "cad-selection-set-panel__create",
					onClick: (e) => a(e),
					children: y
				})]
			}),
			p && /* @__PURE__ */ _("div", {
				className: "cad-selection-set-panel__filter",
				children: [
					/* @__PURE__ */ g("label", {
						htmlFor: E,
						children: h
					}),
					/* @__PURE__ */ g("input", {
						id: E,
						type: "search",
						value: A ?? "",
						onChange: (e) => j(e.target.value, e)
					}),
					A && /* @__PURE__ */ g("button", {
						type: "button",
						"aria-label": "Clear selection set filter",
						onClick: (e) => j("", e),
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ g("ul", {
				className: "cad-selection-set-panel__list",
				children: N.map((e) => {
					let t = e.id === O, n = e.count ?? e.entityCount, r = e.countLabel || `${n} objects`;
					return /* @__PURE__ */ _("li", {
						"data-selected": t ? "true" : "false",
						children: [/* @__PURE__ */ _("button", {
							type: "button",
							className: "cad-selection-set-panel__set",
							"aria-label": e.ariaLabel || Q(e),
							"aria-pressed": t,
							"aria-current": t ? "true" : void 0,
							disabled: e.disabled,
							onClick: (t) => k(e.id, e, t),
							children: [
								/* @__PURE__ */ g("span", {
									className: "cad-selection-set-panel__set-name",
									children: Q(e)
								}),
								e.description && /* @__PURE__ */ g("small", { children: e.description }),
								e.group && /* @__PURE__ */ g("em", { children: e.group })
							]
						}), n !== void 0 && /* @__PURE__ */ g("output", {
							"aria-label": `${Q(e)}: ${r}`,
							children: n
						})]
					}, e.id);
				})
			}),
			!N.length && /* @__PURE__ */ g("p", {
				className: "cad-selection-set-panel__empty",
				role: "status",
				children: v
			}),
			(i || o || s || w) && /* @__PURE__ */ _("footer", {
				className: "cad-selection-set-panel__actions",
				role: "group",
				"aria-label": `${m} actions`,
				children: [
					i && /* @__PURE__ */ g("button", {
						type: "button",
						disabled: !M || M.disabled,
						onClick: (e) => i(M, e),
						children: b
					}),
					o && /* @__PURE__ */ g("button", {
						type: "button",
						disabled: !M || P,
						onClick: (e) => o(M, e),
						children: x
					}),
					s && /* @__PURE__ */ g("button", {
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
//#region src/CadWorkspaceCustomizationUi.tsx
var _n = (e, t) => !!e && !!t && e.open === t.open && e.placement === t.placement && e.dockZone === t.dockZone, vn = (e) => e instanceof Map ? Object.fromEntries(e.entries()) : P(e) ? e : {}, yn = /* @__PURE__ */ new Set([
	"open",
	"visible",
	"isOpen",
	"placement",
	"mode"
]), bn = (e) => P(e) ? Object.fromEntries(Object.entries(e).filter(([e]) => !yn.has(e))) : {}, xn = (...e) => {
	let t = e.find((e) => typeof e == "boolean");
	return t === void 0 ? void 0 : t;
}, Sn = (e, t) => N(e).toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || t, Cn = Object.freeze({
	DOCK: "dock",
	FLOAT: "float"
}), wn = Object.freeze({
	LEFT: "left",
	RIGHT: "right",
	BOTTOM: "bottom"
}), Tn = Object.freeze({
	OPEN: "open",
	CLOSE: "close",
	TOGGLE: "toggle",
	DOCK: "dock",
	FLOAT: "float",
	SET_DOCK_ZONE: "dock-zone",
	RESET: "reset",
	RESET_ALL: "reset-all",
	PATCH: "patch"
});
function En(e, t = Cn.DOCK) {
	let n = N(e).toLocaleLowerCase();
	return [
		"float",
		"floating",
		"overlay",
		"window"
	].includes(n) ? Cn.FLOAT : [
		"dock",
		"docked",
		"left",
		"right",
		"top",
		"bottom",
		"side"
	].includes(n) ? Cn.DOCK : t;
}
function Dn(e, t = "") {
	let n = N(e).toLocaleLowerCase();
	return [
		"left",
		"start",
		"west",
		"leading"
	].includes(n) ? wn.LEFT : [
		"right",
		"end",
		"east",
		"trailing"
	].includes(n) ? wn.RIGHT : [
		"bottom",
		"lower",
		"footer",
		"command",
		"command-line"
	].includes(n) ? wn.BOTTOM : t;
}
var On = (e) => {
	let t = Z(e?.placements ?? e?.allowedPlacements ?? e?.placementOptions).map((e) => En(e, "")).filter(Boolean), n = !!(e?.preferenceLocked ?? e?.locked), r = !n && e?.dockable !== !1, i = !n && e?.floatable !== !1, a = (t.length ? t : [...r ? [Cn.DOCK] : [], ...i ? [Cn.FLOAT] : []]).filter((e) => e === Cn.DOCK ? r : i);
	return [...new Set(a)];
}, kn = (e) => Array.isArray(e) ? e : e == null ? [] : [e], An = (e) => {
	if (e?.dockable === !1) return [];
	let t = kn(e?.dockZones ?? e?.allowedDockZones ?? e?.dockZoneOptions), n = e?.defaultDockZone ?? e?.dockZone ?? e?.zone, r = t.length ? t : n === void 0 ? [] : [n];
	return [...new Set(r.map((e) => Dn(e, "")).filter(Boolean))];
};
function jn(e = []) {
	let t = /* @__PURE__ */ new Set();
	return Z(e).reduce((e, n, r) => {
		if (n == null) return e;
		let i = typeof n == "string" || typeof n == "number" ? {
			id: String(n),
			label: String(n)
		} : n;
		if (!P(i)) return e;
		let a = N(i.id ?? i.key) || `panel-${r + 1}`;
		if (t.has(a)) return e;
		t.add(a);
		let o = !!(i.preferenceLocked ?? i.locked), s = On(i), c = En(i.defaultPlacement ?? i.placement ?? i.mode, Cn.DOCK), l = s.includes(c) ? c : s[0] || c, u = s.includes(Cn.DOCK) ? An(i) : [], d = Dn(i.defaultDockZone ?? i.dockZone ?? i.zone, ""), f = u.includes(d) ? d : u[0] || "", p = xn(i.defaultOpen, i.defaultVisible, i.open, i.visible) ?? !0;
		return e.push({
			...i,
			id: a,
			label: Q(i) || `Panel ${r + 1}`,
			description: N(i.description ?? i.detail),
			disabled: !!i.disabled,
			required: !!i.required,
			preferenceLocked: o,
			closable: !o && !i.required && i.closable !== !1,
			placements: s,
			defaultPlacement: l,
			dockZones: u,
			defaultDockZone: f,
			defaultOpen: p
		}), e;
	}, []);
}
var Mn = (e, t) => {
	let n = typeof t == "boolean" ? { open: t } : vn(t), r = xn(n.open, n.visible, n.isOpen, e.defaultOpen), i = En(n.placement ?? n.mode, e.defaultPlacement), a = e.placements.includes(i) ? i : e.placements[0] || e.defaultPlacement, o = e.dockZones || [], s = Dn(n.dockZone ?? n.zone, e.defaultDockZone), c = o.includes(s) ? s : o[0] || "", l = bn(n);
	return o.length && (delete l.dockZone, delete l.zone), {
		...l,
		open: e.required ? !0 : !!r,
		placement: a,
		...o.length ? { dockZone: c } : {}
	};
};
function Nn(e = [], t = {}) {
	let n = vn(t);
	return jn(e).reduce((e, t) => (e[t.id] = Mn(t, n[t.id]), e), {});
}
function Pn(e = [], t = {}, n) {
	let r = N(n);
	return r ? Nn(e, t)[r] : void 0;
}
function Fn(e = [], t = {}) {
	let n = jn(e), r = Nn(n, t), i = {
		[wn.LEFT]: [],
		[wn.RIGHT]: [],
		[wn.BOTTOM]: []
	};
	return n.forEach((e) => {
		let t = r[e.id], n = Dn(t?.dockZone, "");
		!t?.open || t.placement !== Cn.DOCK || !n || i[n].push({
			...e,
			preference: t
		});
	}), i;
}
var In = (e) => typeof e == "string" ? { type: e } : P(e) ? e : { type: "" }, Ln = (e, t, n) => {
	let { type: r, value: i } = In(n), a = { ...t }, o = (t) => e.placements.includes(t), s = (t) => e.dockZones?.includes(t);
	if (e.disabled || e.preferenceLocked) return t;
	switch (r) {
		case Tn.OPEN:
			a.open = !0;
			break;
		case Tn.CLOSE:
			if (!e.closable) return t;
			a.open = !1;
			break;
		case Tn.TOGGLE:
			if (t.open && !e.closable) return t;
			a.open = !t.open;
			break;
		case Tn.DOCK:
			if (!o(Cn.DOCK)) return t;
			a.placement = Cn.DOCK;
			break;
		case Tn.FLOAT:
			if (!o(Cn.FLOAT)) return t;
			a.placement = Cn.FLOAT;
			break;
		case Tn.SET_DOCK_ZONE: {
			let e = Dn(i, "");
			if (!o(Cn.DOCK) || !s(e)) return t;
			a.placement = Cn.DOCK, a.dockZone = e;
			break;
		}
		case Tn.RESET: return Mn(e, {});
		case Tn.PATCH: {
			let t = vn(i);
			typeof t.open == "boolean" && (t.open || e.closable) && (a.open = t.open);
			let n = En(t.placement ?? t.mode, "");
			n && o(n) && (a.placement = n);
			let r = Dn(t.dockZone ?? t.zone, "");
			r && s(r) && (a.dockZone = r, a.placement = Cn.DOCK);
			break;
		}
		default: return t;
	}
	return a;
};
function Rn(e = [], t = {}, n, r) {
	let i = N(n), a = jn(e).find((e) => e.id === i), o = vn(t);
	if (!a) return o;
	let s = Mn(a, o[i]), c = Ln(a, s, r);
	return _n(s, c) ? o : {
		...o,
		[i]: c
	};
}
function zn(e = [], t = {}) {
	let n = vn(t);
	return jn(e).reduce((e, t) => {
		let r = bn(n[t.id]);
		return t.dockZones?.length && (delete r.dockZone, delete r.zone), {
			...e,
			[t.id]: Mn(t, r)
		};
	}, { ...n });
}
function Bn(e = "cad-workspace", t = "default") {
	let n = P(e) ? e : {
		namespace: e,
		scope: t
	};
	return `${Sn(n.namespace, "cad-workspace")}:${Sn(n.scope, "default")}:${Sn(n.section, "panels")}`;
}
function Vn({ panels: e = [], value: t, defaultValue: n, onChange: r } = {}) {
	let i = d(() => jn(e), [e]), [a, s] = $(t, d(() => ({
		...vn(n),
		...Nn(i, n)
	}), [n, i]), (e, t, n) => {
		r?.(e, t, n);
	}), c = d(() => Nn(i, a), [i, a]);
	return {
		panels: i,
		value: c,
		preferences: c,
		dispatch: o((e, t, n) => {
			let r = N(e), o = i.find((e) => e.id === r), l = c[r];
			if (!o || !l) return {
				changed: !1,
				panel: o,
				action: In(t).type
			};
			let u = Rn(i, a, r, t), d = Nn(i, u)[r], f = !_n(l, d), p = {
				changed: f,
				id: r,
				panel: o,
				action: In(t).type,
				previousPreference: l,
				preference: d,
				value: u,
				source: "workspace-panel-preferences"
			};
			return f && s(u, p, n), p;
		}, [
			i,
			c,
			a,
			s
		]),
		reset: o((e) => {
			let t = zn(i, a), n = Nn(i, t), r = i.some((e) => !_n(c[e.id], n[e.id])), o = {
				changed: r,
				action: Tn.RESET_ALL,
				panels: i,
				previousPreferences: c,
				preferences: n,
				value: t,
				source: "workspace-panel-preferences"
			};
			return r && s(t, o, e), o;
		}, [
			i,
			c,
			a,
			s
		])
	};
}
var Hn = /* @__PURE__ */ g("span", {
	"aria-hidden": "true",
	children: "▣"
}), Un = (t, n) => typeof n == "function" ? n(t) : e.isValidElement(t.icon) ? t.icon : typeof t.icon == "function" || t.icon?.$$typeof ? e.createElement(t.icon, {
	size: 13,
	"aria-hidden": !0
}) : t.icon !== void 0 && t.icon !== null ? t.icon : Hn, Wn = (e) => ({
	[wn.LEFT]: "LEFT",
	[wn.RIGHT]: "RIGHT",
	[wn.BOTTOM]: "BOTTOM"
})[e] || "", Gn = (e, t) => e === Cn.FLOAT ? "FLOATING" : [Wn(t), "DOCKED"].filter(Boolean).join(" ");
function Kn({ panels: t = [], value: n, defaultValue: r, onChange: i, onPanelChange: a, onPanelAction: s, onPanelOpen: c, onPanelClose: l, onPanelDock: f, onPanelDockZone: p, onPanelFloat: m, onPanelReset: v, onResetAll: y, menuOpen: b, defaultMenuOpen: x = !1, onMenuOpenChange: S, title: C = "Workspace panels", description: w = "Show, dock or float the panels used in this workspace.", trigger: T, renderTrigger: E, triggerLabel: D = "Workspace panels", triggerIcon: O = "▦", scope: k, placement: A = "bottom-end", emptyLabel: j = "No configurable panels are available.", filter: M, defaultFilter: P = "", onFilterChange: F, filterable: I = !0, filterLabel: L = "Find panel", filterPlaceholder: R = "Search panels", clearFilterLabel: z = "Clear panel filter", filteredEmptyLabel: B = "No panels match the current filter.", resetAllLabel: ee = "Reset workspace", showResetAll: V = !0, closeLabel: H, renderPanel: U, renderPanelIcon: te, className: W, contentClassName: G, ...ne }) {
	let re = u(), { panels: K, preferences: q, dispatch: J, reset: ie } = Vn({
		panels: t,
		value: n,
		defaultValue: r,
		onChange: i
	}), Y = K.filter((e) => !e.hidden), ae = Y.filter((e) => q[e.id]?.open).length, oe = Y.filter((e) => q[e.id]?.open && q[e.id]?.placement === Cn.FLOAT).length, [se, ce] = $(M, P, (e, t) => {
		F?.(e, t);
	}), le = N(se).toLocaleLowerCase(), ue = d(() => Y.filter((e) => {
		if (!le) return !0;
		let t = q[e.id] || {};
		return [
			e.label,
			e.description,
			t.open ? "visible open" : "hidden closed",
			Gn(t.placement, t.dockZone),
			Wn(t.dockZone)
		].filter(Boolean).join(" ").toLocaleLowerCase().includes(le);
	}), [
		Y,
		le,
		q
	]), de = I && Y.length > 6, fe = o((e, t, n) => {
		let r = J(e.id, t, n);
		r.changed && (a?.(e.id, r.preference, r, n), s?.(r, n), r.action === Tn.OPEN && c?.(e, r.preference, r, n), r.action === Tn.CLOSE && l?.(e, r.preference, r, n), r.action === Tn.DOCK && f?.(e, r.preference, r, n), r.action === Tn.SET_DOCK_ZONE && p?.(e, r.preference, r, n), r.action === Tn.FLOAT && m?.(e, r.preference, r, n), r.action === Tn.RESET && v?.(e, r.preference, r, n));
	}, [
		J,
		s,
		a,
		l,
		f,
		p,
		m,
		c,
		v
	]), pe = o((e) => {
		let t = ie(e);
		t.changed && (s?.(t, e), y?.(t.value, t, e));
	}, [
		s,
		y,
		ie
	]), me = /* @__PURE__ */ _("button", {
		type: "button",
		className: "cad-workspace-panel-manager__trigger",
		title: D,
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-workspace-panel-manager__trigger-icon",
				"aria-hidden": "true",
				children: O
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-workspace-panel-manager__trigger-label",
				children: D
			}),
			/* @__PURE__ */ g("output", {
				"aria-label": `${ae} visible panels`,
				children: ae
			})
		]
	}), he = typeof E == "function" ? E({
		visibleCount: ae,
		floatingCount: oe,
		panels: Y,
		preferences: q
	}) : T || me, ge = H || `Close ${C}`, _e = `cad-workspace-panel-manager-${re}`, ve = (e, t) => {
		let n = !!t.open, r = n ? Tn.CLOSE : Tn.OPEN, i = !e.disabled && (!n || e.closable), a = e.placements.length > 1, o = e.placements.includes(Cn.DOCK) && e.dockZones.length > 1, s = {
			open: (t) => fe(e, Tn.OPEN, t),
			close: (t) => fe(e, Tn.CLOSE, t),
			toggle: (t) => fe(e, Tn.TOGGLE, t),
			dock: (t) => fe(e, Tn.DOCK, t),
			dockTo: (t, n) => fe(e, {
				type: Tn.SET_DOCK_ZONE,
				value: t
			}, n),
			float: (t) => fe(e, Tn.FLOAT, t),
			reset: (t) => fe(e, Tn.RESET, t)
		};
		return typeof U == "function" ? U(e, t, s) : /* @__PURE__ */ _("article", {
			className: "cad-workspace-panel-manager__panel",
			"data-panel-id": e.id,
			"data-open": n ? "true" : "false",
			"data-placement": t.placement,
			"data-dock-zone": t.dockZone || void 0,
			"data-locked": e.preferenceLocked ? "true" : "false",
			role: "listitem",
			children: [
				/* @__PURE__ */ _("div", {
					className: "cad-workspace-panel-manager__panel-summary",
					children: [/* @__PURE__ */ _("button", {
						type: "button",
						className: "cad-workspace-panel-manager__visibility",
						"aria-label": `${n ? "Hide" : "Show"} ${e.label}`,
						"aria-pressed": n,
						disabled: !i,
						title: e.preferenceLocked ? `${e.label} preferences are locked` : `${n ? "Hide" : "Show"} ${e.label}`,
						onClick: (t) => fe(e, r, t),
						children: [
							/* @__PURE__ */ g("span", {
								className: "cad-workspace-panel-manager__panel-icon",
								"aria-hidden": "true",
								children: Un(e, te)
							}),
							/* @__PURE__ */ _("span", {
								className: "cad-workspace-panel-manager__panel-copy",
								children: [/* @__PURE__ */ g("strong", { children: e.label }), e.description && /* @__PURE__ */ g("small", { children: e.description })]
							}),
							/* @__PURE__ */ g("span", {
								className: "cad-workspace-panel-manager__visibility-state",
								"aria-hidden": "true",
								children: n ? "●" : "○"
							})
						]
					}), /* @__PURE__ */ g("output", {
						className: "cad-workspace-panel-manager__state",
						"aria-label": `${e.label} is ${n ? "visible" : "hidden"}`,
						children: n ? "VISIBLE" : "HIDDEN"
					})]
				}),
				(a || !e.preferenceLocked) && /* @__PURE__ */ _("div", {
					className: "cad-workspace-panel-manager__placement",
					role: "group",
					"aria-label": `${e.label} placement`,
					children: [
						a && e.placements.includes(Cn.DOCK) && /* @__PURE__ */ _("button", {
							type: "button",
							"aria-label": `Dock ${e.label}`,
							"aria-pressed": t.placement === Cn.DOCK,
							disabled: e.disabled || e.preferenceLocked,
							onClick: s.dock,
							children: [/* @__PURE__ */ g("span", {
								"aria-hidden": "true",
								children: "▣"
							}), "DOCK"]
						}),
						a && e.placements.includes(Cn.FLOAT) && /* @__PURE__ */ _("button", {
							type: "button",
							"aria-label": `Float ${e.label}`,
							"aria-pressed": t.placement === Cn.FLOAT,
							disabled: e.disabled || e.preferenceLocked,
							onClick: s.float,
							children: [/* @__PURE__ */ g("span", {
								"aria-hidden": "true",
								children: "◇"
							}), "FLOAT"]
						}),
						a && /* @__PURE__ */ g("output", {
							"aria-label": `${e.label} placement: ${Gn(t.placement, t.dockZone).toLocaleLowerCase()}`,
							children: Gn(t.placement, t.dockZone)
						}),
						!e.preferenceLocked && /* @__PURE__ */ g("button", {
							type: "button",
							className: "cad-workspace-panel-manager__reset",
							"aria-label": `Reset ${e.label}`,
							title: `Reset ${e.label}`,
							onClick: s.reset,
							children: "↺"
						})
					]
				}),
				o && /* @__PURE__ */ g("div", {
					className: "cad-workspace-panel-manager__dock-zones",
					role: "group",
					"aria-label": `${e.label} dock zone`,
					children: e.dockZones.map((n) => /* @__PURE__ */ g("button", {
						type: "button",
						"aria-label": `Dock ${e.label} to ${Wn(n).toLocaleLowerCase()}`,
						"aria-pressed": t.placement === Cn.DOCK && t.dockZone === n,
						disabled: e.disabled || e.preferenceLocked,
						onClick: (e) => s.dockTo(n, e),
						children: Wn(n)
					}, n))
				})
			]
		});
	};
	return /* @__PURE__ */ g(Ut, {
		...ne,
		id: _e,
		className: X("cad-workspace-panel-manager", W),
		contentClassName: X("cad-workspace-panel-manager__surface", G),
		trigger: he,
		open: b,
		defaultOpen: x,
		onOpenChange: S,
		placement: A,
		label: C,
		contentRole: "dialog",
		content: ({ close: t }) => /* @__PURE__ */ _("section", {
			className: "cad-workspace-panel-manager__content",
			"aria-describedby": w ? `${_e}-description` : void 0,
			children: [
				/* @__PURE__ */ _("header", {
					className: "cad-workspace-panel-manager__header",
					children: [/* @__PURE__ */ _("div", { children: [
						/* @__PURE__ */ g("span", {
							className: "cad-workspace-panel-manager__eyebrow",
							children: "WORKSPACE"
						}),
						/* @__PURE__ */ g("h2", { children: C }),
						w && /* @__PURE__ */ g("p", {
							id: `${_e}-description`,
							children: w
						})
					] }), /* @__PURE__ */ _("div", {
						className: "cad-workspace-panel-manager__header-actions",
						children: [k && /* @__PURE__ */ g("output", {
							className: "cad-workspace-panel-manager__scope",
							children: k
						}), /* @__PURE__ */ g("button", {
							type: "button",
							className: "cad-workspace-panel-manager__close",
							"data-autofocus": !0,
							"aria-label": ge,
							title: ge,
							onClick: t,
							children: "×"
						})]
					})]
				}),
				Y.length > 0 ? /* @__PURE__ */ _(h, { children: [
					de && /* @__PURE__ */ _("div", {
						className: "cad-workspace-panel-manager__filter",
						children: [
							/* @__PURE__ */ g("label", {
								htmlFor: `${_e}-filter`,
								children: L
							}),
							/* @__PURE__ */ g("input", {
								id: `${_e}-filter`,
								type: "search",
								value: se ?? "",
								placeholder: R,
								onChange: (e) => ce(e.target.value, e)
							}),
							le && /* @__PURE__ */ g("button", {
								type: "button",
								"aria-label": z,
								title: z,
								onClick: (e) => ce("", e),
								children: "×"
							})
						]
					}),
					/* @__PURE__ */ _("div", {
						className: "cad-workspace-panel-manager__summary",
						"aria-label": "Workspace panel summary",
						children: [
							/* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("b", { children: ae }), " VISIBLE"] }),
							/* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("b", { children: oe }), " FLOATING"] }),
							de && /* @__PURE__ */ _("span", {
								className: "cad-workspace-panel-manager__filter-count",
								role: "status",
								children: [/* @__PURE__ */ g("b", { children: ue.length }), " SHOWN"]
							})
						]
					}),
					ue.length > 0 ? /* @__PURE__ */ g("div", {
						className: "cad-workspace-panel-manager__list",
						role: "list",
						children: ue.map((t) => /* @__PURE__ */ g(e.Fragment, { children: ve(t, q[t.id]) }, t.id))
					}) : /* @__PURE__ */ g("p", {
						className: "cad-workspace-panel-manager__empty cad-workspace-panel-manager__empty--filtered",
						role: "status",
						children: B
					})
				] }) : /* @__PURE__ */ g("p", {
					className: "cad-workspace-panel-manager__empty",
					role: "status",
					children: j
				}),
				V && Y.length > 0 && /* @__PURE__ */ _("footer", {
					className: "cad-workspace-panel-manager__footer",
					children: [/* @__PURE__ */ _("button", {
						type: "button",
						"aria-label": ee,
						onClick: pe,
						children: [
							/* @__PURE__ */ g("span", {
								"aria-hidden": "true",
								children: "↺"
							}),
							" ",
							ee
						]
					}), /* @__PURE__ */ g("span", { children: "Host-owned layout state" })]
				})
			]
		})
	});
}
var qn = Kn, Jn = (e) => !!e;
function Yn({ active: e, defaultActive: t = !1, onActiveChange: n } = {}) {
	let [r, i] = $(e, Jn(t), (e, t, r) => n?.(Jn(e), t, r)), a = Jn(r), s = o((e, t, n = "programmatic") => {
		let r = Jn(typeof e == "function" ? e(a) : e);
		if (r === a) return {
			changed: !1,
			active: a,
			previousActive: a,
			source: n
		};
		let o = {
			changed: !0,
			active: r,
			previousActive: a,
			source: n
		};
		return i(r, o, t), o;
	}, [a, i]);
	return {
		active: a,
		setActive: s,
		toggle: o((e, t = "toggle") => s(!a, e, t), [a, s])
	};
}
var Xn = i(function({ active: e, defaultActive: t = !1, onActiveChange: n, label: r = "Enter focus mode", activeLabel: i = "Exit focus mode", shortcut: a, disabled: o = !1, onClick: s, className: c, title: l, ...u }, d) {
	let f = Yn({
		active: e,
		defaultActive: t,
		onActiveChange: n
	}), p = f.active ? i : r, m = l || [p, a].filter(Boolean).join(" · ");
	return /* @__PURE__ */ _("button", {
		...u,
		ref: d,
		type: "button",
		className: X("cad-workspace-focus-toggle", c),
		"data-active": f.active ? "true" : "false",
		"aria-pressed": f.active,
		"aria-label": u["aria-label"] || p,
		title: m,
		disabled: o,
		onClick: (e) => {
			s?.(e), e.defaultPrevented || f.toggle(e, "trigger");
		},
		children: [
			/* @__PURE__ */ _("span", {
				className: "cad-workspace-focus-toggle__reticle",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ g("i", {}), /* @__PURE__ */ g("i", {})]
			}),
			/* @__PURE__ */ _("span", {
				className: "cad-workspace-focus-toggle__copy",
				children: [/* @__PURE__ */ g("span", {
					className: "cad-workspace-focus-toggle__label",
					children: p
				}), /* @__PURE__ */ g("span", {
					className: "cad-workspace-focus-toggle__state",
					"aria-hidden": "true",
					children: f.active ? "FOCUS" : "READY"
				})]
			}),
			a && /* @__PURE__ */ g(Ue, {
				shortcut: a,
				className: "cad-workspace-focus-toggle__shortcut"
			})
		]
	});
});
Xn.displayName = "CadWorkspaceFocusToggle";
//#endregion
//#region src/CadWorkspaceProfiles.ts
var Zn = "model", Qn = (e) => {
	let t = N(e).toLowerCase();
	return /^[a-z0-9][a-z0-9-]{0,63}$/.test(t) ? t : "";
}, $n = (e, t) => N(e).replace(/\s+/g, " ").slice(0, 48) || t;
function er(e, { modelId: t = Zn, modelName: n = "Model" } = {}) {
	let r = Qn(t) || "model", i = Array.isArray(e) ? e : Array.isArray(e?.profiles) ? e.profiles : [], a = /* @__PURE__ */ new Set(), o = i.reduce((e, t, i) => {
		let o = Qn(t?.id) || (i === 0 ? r : "");
		return !o || a.has(o) ? e : (a.add(o), e.push({
			...t,
			id: o,
			name: $n(t?.name ?? t?.label, o === r ? n : `Layout ${e.length}`),
			system: o === r || !!t?.system
		}), e);
	}, []), s = o.findIndex((e) => e.id === r);
	return [s >= 0 ? {
		...o[s],
		id: r,
		name: $n(o[s].name, n),
		system: !0
	} : {
		id: r,
		name: n,
		system: !0
	}, ...o.filter((e) => e.id !== r)];
}
function tr(e, { prefix: t = "Layout", modelId: n = Zn } = {}) {
	let r = er(e, { modelId: n }), i = new Set(r.map((e) => e.name.toLocaleLowerCase())), a = Math.max(1, r.filter((e) => e.id !== n).length + 1), o = `${N(t) || "Layout"} ${a}`;
	for (; i.has(o.toLocaleLowerCase());) a += 1, o = `${N(t) || "Layout"} ${a}`;
	return o;
}
function nr(e, { id: t, name: n, modelId: r = Zn, modelName: i = "Model", prefix: a = "Layout", ...o } = {}) {
	let s = er(e, {
		modelId: r,
		modelName: i
	}), c = new Set(s.map((e) => e.id)), l = Qn(t) || "layout", u = l, d = 1;
	for (; c.has(u);) d += 1, u = `${l}-${d}`;
	return [...s, {
		...o,
		id: u,
		name: $n(n, tr(s, {
			prefix: a,
			modelId: r
		})),
		system: !1
	}];
}
function rr(e, t, n, { modelId: r = Zn, modelName: i = "Model" } = {}) {
	let a = Qn(t);
	return !a || !N(n) ? er(e, {
		modelId: r,
		modelName: i
	}) : er(e, {
		modelId: r,
		modelName: i
	}).map((e) => e.id === a ? {
		...e,
		name: $n(n, e.name)
	} : e);
}
function ir(e, t, n, { modelId: r = Zn, modelName: i = "Model" } = {}) {
	let a = er(e, {
		modelId: r,
		modelName: i
	}), o = Qn(t), s = o && o !== r ? a.filter((e) => e.id !== o) : a;
	return {
		profiles: s,
		activeId: s.some((e) => e.id === n) ? n : r
	};
}
//#endregion
//#region src/CadWorkspaceUi.tsx
var ar = (e) => Z(e).find((e) => !e?.disabled)?.id || "", or = (e, t) => typeof e == "string" ? {
	id: `${e}-${t}`,
	label: e
} : {
	id: e?.id || `${Q(e)}-${t}`,
	label: Q(e),
	detail: e?.detail,
	tone: e?.tone
}, sr = (e) => {
	let t = e?.attention ?? e?.alert, n = t && typeof t == "object" ? t : { tone: t }, r = String(n?.tone ?? "").trim().toLowerCase();
	return r !== "warning" && r !== "danger" ? null : {
		tone: r,
		label: String(n?.label ?? (r === "danger" ? "Danger" : "Warning")).trim() || (r === "danger" ? "Danger" : "Warning"),
		symbol: n?.symbol || "!"
	};
};
function cr({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, onCreate: a, onContextMenu: o, onRename: s, onOverflow: c, addLabel: l = "New layout", addButtonProps: f = {}, overflowLabel: p = "More drawing spaces", overflowButtonProps: m = {}, ariaLabel: h = "Drawing spaces", className: v, ...y }) {
	let b = u(), x = d(() => Z(e).map((e, t) => ({
		...e,
		id: e?.id || `space-${t}`
	})), [e]), [S, C] = $(t, n || ar(x), (e, t, n) => r?.(e, t, n)), w = x.some((e) => e.id === S) ? S : ar(x), T = (e, t) => {
		!e || e.disabled || C(e.id, e, t);
	}, E = (e) => document.getElementById(`cad-space-tab-${b}-${e.id}`)?.focus(), D = (e, t) => {
		let n = x.filter((e) => !e.disabled);
		if (!n.length) return;
		let r = n[(Math.max(0, n.findIndex((e) => e.id === w)) + t + n.length) % n.length];
		e.preventDefault(), T(r, e), E(r);
	};
	return /* @__PURE__ */ g("nav", {
		...y,
		className: X("cad-drawing-space-tabs", v),
		"aria-label": h,
		children: /* @__PURE__ */ _("div", {
			className: "cad-drawing-space-tabs__strip",
			children: [
				/* @__PURE__ */ g("div", {
					className: "cad-drawing-space-tabs__scroll",
					role: "tablist",
					"aria-label": h,
					onKeyDown: (e) => {
						if (!(!(e.target instanceof Element) || !e.target.closest("[role=\"tab\"]"))) {
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
					children: x.map((e) => {
						let t = e.id, n = t === w, r = `cad-space-tab-${b}-${t}`, a = !!(i && e?.closable && !e?.pinned), c = e?.icon;
						return /* @__PURE__ */ _("div", {
							className: X("cad-drawing-space-tabs__item", n && "cad-drawing-space-tabs__item--active"),
							"data-kind": e?.kind || "layout",
							"data-dirty": e?.dirty ? "true" : "false",
							onContextMenu: (t) => {
								o && (t.preventDefault(), o(e, t));
							},
							children: [/* @__PURE__ */ _("button", {
								id: r,
								type: "button",
								role: "tab",
								"aria-selected": n,
								"aria-controls": e?.panelId,
								"aria-label": e?.ariaLabel || Q(e),
								disabled: e?.disabled,
								tabIndex: n ? 0 : -1,
								title: e?.title || Q(e),
								onClick: (n) => T({
									...e,
									id: t
								}, n),
								onDoubleClick: (n) => s?.({
									...e,
									id: t
								}, n),
								children: [
									c && /* @__PURE__ */ g(c, {
										size: 12,
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ g("span", { children: Q(e) }),
									e?.dirty && /* @__PURE__ */ g("i", {
										"aria-label": "Unsaved changes",
										title: "Unsaved changes"
									})
								]
							}), a && /* @__PURE__ */ g("button", {
								type: "button",
								className: "cad-drawing-space-tabs__close",
								"aria-label": `Close ${Q(e)}`,
								title: `Close ${Q(e)}`,
								onClick: (n) => i({
									...e,
									id: t
								}, n),
								children: "×"
							})]
						}, t);
					})
				}),
				a && /* @__PURE__ */ g("button", {
					...f,
					type: "button",
					className: X("cad-drawing-space-tabs__add", f.className),
					"aria-label": f["aria-label"] || l,
					title: f.title || l,
					onClick: (e) => {
						f.onClick?.(e), e.defaultPrevented || a(e);
					},
					children: "+"
				}),
				c && /* @__PURE__ */ g("button", {
					...m,
					type: "button",
					className: X("cad-drawing-space-tabs__overflow", m.className),
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
var lr = cr, ur = cr;
function dr({ profiles: e = [], activeId: t, onChange: n, onCreate: r, onClose: i, onRename: a, modelId: o = Zn, modelName: s = "Model", className: c, ...l }) {
	let u = d(() => er(e, {
		modelId: o,
		modelName: s
	}), [
		o,
		s,
		e
	]), f = d(() => new Map(u.map((e) => [e.id, e])), [u]), p = d(() => u.map((e) => ({
		...e,
		label: e.name,
		kind: e.id === o ? "model" : "layout",
		pinned: e.id === o || e.system,
		closable: !!(i && e.id !== o && !e.system)
	})), [
		o,
		u,
		i
	]), m = (e) => f.get(e?.id) || e;
	return /* @__PURE__ */ g(cr, {
		...l,
		className: X("cad-workspace-profile-tabs", c),
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
function fr({ title: e, icon: t, actions: n, collapsible: r = !1, collapsed: i, defaultCollapsed: a = !1, onCollapsedChange: o, className: s, children: c, ...l }) {
	let d = `cad-dock-panel-body-${u()}`, [f, p] = $(i, a, (e, t) => o?.(e, t));
	return /* @__PURE__ */ _("section", {
		...l,
		className: X("cad-dock-panel", f && "cad-dock-panel--collapsed", s),
		"data-collapsed": f ? "true" : "false",
		children: [(e || t || n || r) && /* @__PURE__ */ _("header", {
			className: "cad-dock-panel__header",
			children: [/* @__PURE__ */ _("div", {
				className: "cad-dock-panel__title",
				children: [t && /* @__PURE__ */ g(t, {
					size: 13,
					"aria-hidden": "true"
				}), e && /* @__PURE__ */ g("h2", { children: e })]
			}), /* @__PURE__ */ _("div", {
				className: "cad-dock-panel__actions",
				children: [n, r && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-label": `${f ? "Expand" : "Collapse"} ${e || "panel"}`,
					"aria-expanded": !f,
					"aria-controls": d,
					onClick: (e) => p(!f, e),
					children: f ? "▸" : "▾"
				})]
			})]
		}), /* @__PURE__ */ g("div", {
			id: d,
			className: "cad-dock-panel__body",
			hidden: f,
			children: c
		})]
	});
}
function pr({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, label: a = "Docked panels", compact: o = !1, className: s, children: c, renderPanel: l, ...d }) {
	let f = u(), [p, m] = $(t, n || ar(e), (e, t, n) => r?.(e, t, n)), h = Z(e).find((e) => e?.id === p) || Z(e).find((e) => !e?.disabled), v = (e, t) => {
		!e || e.disabled || m(e.id, e, t);
	}, y = (t) => {
		if (!t.target.closest("[role=\"tab\"]")) return;
		let n = Z(e).filter((e) => !e?.disabled);
		if (!n.length) return;
		let r = Math.max(0, n.findIndex((e) => e.id === h?.id)), i;
		t.key === "ArrowRight" && (i = n[(r + 1) % n.length]), t.key === "ArrowLeft" && (i = n[(r - 1 + n.length) % n.length]), t.key === "Home" && (i = n[0]), t.key === "End" && (i = n[n.length - 1]), i && (t.preventDefault(), v(i, t), document.getElementById(`cad-dock-tab-${f}-${i.id}`)?.focus());
	}, b = h?.panelId || `cad-dock-panel-${f}-${h?.id || "empty"}`;
	return /* @__PURE__ */ _("section", {
		...d,
		className: X("cad-dock-tabs", o && "cad-dock-tabs--compact", s),
		"data-compact": o ? "true" : "false",
		children: [/* @__PURE__ */ g("div", {
			className: "cad-dock-tabs__list",
			role: "tablist",
			"aria-label": a,
			onKeyDown: y,
			children: Z(e).map((e, t) => {
				let n = e?.id === h?.id, r = e?.icon, a = Q(e), s = o && e?.tabLabel !== void 0 ? e.tabLabel : o && e?.shortLabel !== void 0 ? e.shortLabel : a, c = e?.ariaLabel || e?.accessibleLabel || a, l = e?.title || a, u = sr(e), d = u ? `${c}, ${u.label}` : c;
				return /* @__PURE__ */ _("div", {
					className: X("cad-dock-tabs__tab-wrap", n && "cad-dock-tabs__tab-wrap--active"),
					children: [/* @__PURE__ */ _("button", {
						id: `cad-dock-tab-${f}-${e?.id}`,
						type: "button",
						role: "tab",
						"aria-label": d,
						title: u ? `${l} · ${u.label}` : l,
						"aria-selected": n,
						"aria-controls": n ? b : e?.panelId,
						disabled: e?.disabled,
						tabIndex: n ? 0 : -1,
						onClick: (t) => v(e, t),
						children: [
							r && /* @__PURE__ */ g("span", {
								className: "cad-dock-tabs__tab-icon",
								"aria-hidden": "true",
								children: /* @__PURE__ */ g(r, { size: o ? 16 : 14 })
							}),
							/* @__PURE__ */ g("span", {
								className: "cad-dock-tabs__tab-label",
								children: s
							}),
							u && /* @__PURE__ */ g("span", {
								className: "cad-dock-tabs__attention",
								"data-tone": u.tone,
								"aria-hidden": "true",
								children: u.symbol
							})
						]
					}), i && e?.closable && /* @__PURE__ */ g("button", {
						type: "button",
						className: "cad-dock-tabs__close",
						"aria-label": `Close ${a}`,
						onClick: (t) => i(e, t),
						children: "×"
					})]
				}, e?.id || t);
			})
		}), /* @__PURE__ */ g("div", {
			id: b,
			className: "cad-dock-tabs__panel",
			role: "tabpanel",
			"aria-labelledby": h ? `cad-dock-tab-${f}-${h.id}` : void 0,
			children: h ? l?.(h) ?? h.content ?? h.children : c
		})]
	});
}
function mr({ mode: e, label: t, active: n, disabled: r = !1, shortcut: i, tone: a = "inherit", onChange: o, className: s }) {
	let c = t || Q(e), l = n ?? e?.active ?? !1, u = r || e?.disabled;
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: X("cad-status-toggle", s),
		"data-tone": a || e?.tone || "inherit",
		"data-active": l ? "true" : "false",
		"aria-label": c,
		"aria-pressed": l,
		disabled: u,
		title: [c, i || e?.shortcut].filter(Boolean).join(" · "),
		onClick: (t) => o?.(!l, e, t),
		children: [/* @__PURE__ */ g("span", { children: c }), (i || e?.shortcut) && /* @__PURE__ */ g("small", { children: i || e?.shortcut })]
	});
}
var hr = (e) => e == null || e === "" ? "" : typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map((e, t) => `${"XYZ"[t] || t}: ${e}`).join("  ") : [
	"x",
	"y",
	"z"
].filter((t) => e[t] !== void 0).map((t) => `${t.toUpperCase()}: ${e[t]}`).join("  ");
function gr({ coordinates: e, coordinateLabel: t = "Coordinates", modes: n = [], onModeChange: r, units: i, scale: a, message: o, layout: s = "strip", className: c, children: l, ...u }) {
	let d = hr(e), f = s === "tiles" || s === "auto" ? s : "strip";
	return /* @__PURE__ */ _("footer", {
		...u,
		className: X("cad-status-bar", c),
		"data-layout": f,
		"aria-label": "CAD status bar",
		children: [
			d && /* @__PURE__ */ g("output", {
				className: "cad-status-bar__coordinates",
				"aria-label": t,
				children: d
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-status-bar__modes",
				role: "group",
				"aria-label": "Drafting modes",
				children: Z(n).map((e, t) => /* @__PURE__ */ g(mr, {
					mode: e,
					onChange: (t, n, i) => {
						e?.onChange?.(t, n, i), r?.(e?.id, t, n, i);
					}
				}, e?.id || Q(e) || t))
			}),
			(i || a) && /* @__PURE__ */ _("div", {
				className: "cad-status-bar__readouts",
				children: [i && /* @__PURE__ */ g("output", {
					title: "Drawing units",
					children: i
				}), a && /* @__PURE__ */ g("output", {
					title: "Annotation scale",
					children: a
				})]
			}),
			o && /* @__PURE__ */ g("output", {
				className: "cad-status-bar__message",
				children: o
			}),
			l
		]
	});
}
function _r({ items: e = [], label: t = "Command history", onSelect: n, className: r }) {
	let i = d(() => Z(e).map(or), [e]);
	return /* @__PURE__ */ g("ol", {
		className: X("cad-command-history", r),
		"aria-label": t,
		children: i.map((e) => /* @__PURE__ */ g("li", {
			"data-tone": e.tone || "inherit",
			children: n ? /* @__PURE__ */ _("button", {
				type: "button",
				onClick: (t) => n(e, t),
				children: [/* @__PURE__ */ g("strong", { children: e.label }), e.detail && /* @__PURE__ */ g("small", { children: e.detail })]
			}) : /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("strong", { children: e.label }), e.detail && /* @__PURE__ */ g("small", { children: e.detail })] })
		}, e.id))
	});
}
function vr({ options: e = [], label: t = "Command options", onSelect: n, className: r }) {
	return /* @__PURE__ */ g("div", {
		className: X("cad-command-options", r),
		role: "group",
		"aria-label": t,
		children: Z(e).map((e, t) => {
			let r = typeof e == "string" ? {
				id: e,
				label: e
			} : e;
			return /* @__PURE__ */ _("button", {
				type: "button",
				disabled: r?.disabled,
				"data-active": r?.active ? "true" : "false",
				onClick: (e) => {
					r?.onClick?.(r, e), n?.(r, e);
				},
				children: [Q(r), r?.shortcut && /* @__PURE__ */ g("kbd", { children: r.shortcut })]
			}, r?.id || t);
		})
	});
}
var yr = (e, t, n, r) => {
	let i = Number(e), a = Number(t);
	return Math.min(r, Math.max(n, Math.round(Number.isFinite(i) ? i : Number.isFinite(a) ? a : 152)));
};
function br({ value: e, defaultValue: t = "", onChange: n, onSubmit: r, prompt: i = "Command:", history: a = [], suggestions: o = [], options: s = [], onSuggestionSelect: c, onOptionSelect: l, clearOnSubmit: f = !0, submitSuggestionOnEnter: h = !1, disabled: v = !1, placeholder: y = "Type a command or search", showHistory: b = !0, height: x, defaultHeight: S = 152, minHeight: C = 72, maxHeight: w = 360, resizeStep: T = 8, resizable: E = !0, onHeightChange: D, label: O = "CAD command line", className: k, inputProps: A = {}, style: j, id: M, ...N }) {
	let P = u(), [F, I] = $(e, t, (e, t) => n?.(e, t)), L = Number(C), R = Math.max(48, Number.isFinite(L) ? Math.round(L) : 72), z = Number(w), B = Math.max(R, Number.isFinite(z) ? Math.round(z) : 360), ee = yr(S, 152, R, B), [V, H] = $(x, ee, (e, t) => D?.(e, t)), U = yr(V, ee, R, B), te = Math.max(1, Number.isFinite(Number(T)) ? Math.round(Number(T)) : 8), W = p(null), [G, ne] = m(!1), [re, K] = m(-1), q = d(() => Z(o).map(or), [o]), J = `cad-command-suggestions-${P}`, ie = M || `cad-command-line-${P}`, Y = (e, t) => {
		let n = yr(typeof e == "function" ? e(U) : e, U, R, B);
		n !== U && H(n, t);
	}, ae = (e) => {
		if (!W.current) return;
		let t = W.current.pointerId;
		W.current = null, e?.currentTarget?.hasPointerCapture?.(t) && e.currentTarget.releasePointerCapture?.(t);
	}, oe = (e) => {
		!E || e.button !== 0 || (e.preventDefault(), W.current = {
			pointerId: e.pointerId,
			startY: e.clientY,
			startHeight: U
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, se = (e) => {
		let t = W.current;
		!t || t.pointerId !== e.pointerId || Y(t.startHeight + t.startY - e.clientY, e);
	}, ce = (e, t, n = !1) => {
		e && (I(e.label, t), c?.(e, t), n && (r?.(e.label, t), f && I("", t)), K(-1));
	}, le = (e) => {
		if (e.preventDefault(), re >= 0 && q[re]) {
			ce(q[re], e, h);
			return;
		}
		let t = String(F ?? "").trim();
		t && (r?.(t, e), f && I("", e));
	}, ue = G && q.length > 0, de = s.length > 0 || b && a.length > 0;
	return /* @__PURE__ */ _("section", {
		...N,
		id: ie,
		className: X("cad-command-line", k),
		style: {
			...j,
			"--cad-command-line-height": `${U}px`
		},
		"aria-label": O,
		children: [
			E && /* @__PURE__ */ g("div", {
				className: "cad-command-line__resize-handle",
				role: "separator",
				tabIndex: 0,
				"aria-label": "Resize command line",
				"aria-controls": ie,
				"aria-orientation": "horizontal",
				"aria-valuemin": R,
				"aria-valuemax": B,
				"aria-valuenow": U,
				"aria-valuetext": `${U} pixels`,
				onPointerDown: oe,
				onPointerMove: se,
				onPointerUp: ae,
				onPointerCancel: ae,
				onKeyDown: (e) => {
					let t = e.shiftKey ? te * 3 : te;
					e.key === "ArrowUp" && (e.preventDefault(), Y(U + t, e)), e.key === "ArrowDown" && (e.preventDefault(), Y(U - t, e)), e.key === "PageUp" && (e.preventDefault(), Y(U + t * 3, e)), e.key === "PageDown" && (e.preventDefault(), Y(U - t * 3, e)), e.key === "Home" && (e.preventDefault(), Y(R, e)), e.key === "End" && (e.preventDefault(), Y(B, e));
				}
			}),
			/* @__PURE__ */ _("form", {
				className: "cad-command-line__form",
				onSubmit: le,
				children: [
					/* @__PURE__ */ g("label", {
						htmlFor: `cad-command-input-${P}`,
						className: "cad-command-line__prompt",
						children: i
					}),
					/* @__PURE__ */ g("input", {
						...A,
						id: `cad-command-input-${P}`,
						className: "cad-command-line__input",
						value: F ?? "",
						disabled: v,
						placeholder: y,
						autoComplete: "off",
						role: "combobox",
						"aria-autocomplete": q.length ? "list" : void 0,
						"aria-expanded": ue,
						"aria-controls": J,
						"aria-activedescendant": ue && re >= 0 ? `${J}-${re}` : void 0,
						onFocus: (e) => {
							ne(!0), A.onFocus?.(e);
						},
						onBlur: (e) => {
							ne(!1), K(-1), A.onBlur?.(e);
						},
						onChange: (e) => {
							I(e.target.value, e), K(-1), A.onChange?.(e);
						},
						onKeyDown: (e) => {
							e.key === "ArrowDown" && q.length && (e.preventDefault(), K((e) => (e + 1) % q.length)), e.key === "ArrowUp" && q.length && (e.preventDefault(), K((e) => (e - 1 + q.length) % q.length)), e.key === "Escape" && (K(-1), ne(!1), e.currentTarget.blur()), A.onKeyDown?.(e);
						}
					}),
					/* @__PURE__ */ g("button", {
						type: "submit",
						className: "cad-command-line__submit",
						disabled: v,
						"aria-label": "Run command",
						children: "↵"
					})
				]
			}),
			ue && /* @__PURE__ */ g("div", {
				id: J,
				className: "cad-command-line__suggestions",
				role: "listbox",
				"aria-label": "Command suggestions",
				children: q.map((e, t) => /* @__PURE__ */ _("button", {
					id: `${J}-${t}`,
					type: "button",
					role: "option",
					"aria-selected": re === t,
					"data-active": re === t ? "true" : "false",
					onMouseDown: (e) => e.preventDefault(),
					onClick: (t) => ce(e, t),
					children: [/* @__PURE__ */ g("strong", { children: e.label }), e.detail && /* @__PURE__ */ g("small", { children: e.detail })]
				}, e.id))
			}),
			de && /* @__PURE__ */ _("div", {
				className: "cad-command-line__transcript",
				children: [s.length > 0 && /* @__PURE__ */ g(vr, {
					options: s,
					onSelect: l
				}), b && a.length > 0 && /* @__PURE__ */ g(_r, {
					items: a,
					onSelect: (e, t) => I(e.label, t)
				})]
			})
		]
	});
}
function xr({ activeView: e = "top", onViewChange: t, className: n, label: r = "View cube" }) {
	return /* @__PURE__ */ _("div", {
		className: X("cad-view-cube", n),
		role: "group",
		"aria-label": r,
		"data-view": e,
		children: [[
			"top",
			"front",
			"right"
		].map((n) => /* @__PURE__ */ g("button", {
			type: "button",
			"data-active": e === n ? "true" : "false",
			"aria-pressed": e === n,
			"aria-label": `${n} view`,
			onClick: (e) => t?.(n, e),
			children: n.slice(0, 1).toUpperCase()
		}, n)), /* @__PURE__ */ g("span", {
			className: "cad-view-cube__axis",
			"aria-hidden": "true"
		})]
	});
}
function Sr({ xLabel: e = "X", yLabel: t = "Y", zLabel: n = "Z", className: r, label: i = "UCS orientation" }) {
	return /* @__PURE__ */ _("svg", {
		className: X("cad-ucs-indicator", r),
		viewBox: "0 0 56 56",
		role: "img",
		"aria-label": i,
		children: [
			/* @__PURE__ */ g("circle", {
				cx: "15",
				cy: "41",
				r: "2.8"
			}),
			/* @__PURE__ */ g("path", { d: "M15 41H45M15 41V11M15 41l17-17" }),
			/* @__PURE__ */ g("text", {
				x: "47",
				y: "44",
				children: e
			}),
			/* @__PURE__ */ g("text", {
				x: "11",
				y: "9",
				children: t
			}),
			/* @__PURE__ */ g("text", {
				x: "34",
				y: "23",
				children: n
			})
		]
	});
}
var Cr = (e, t) => {
	if (!e || !t) return !1;
	try {
		return e === t || !!e.contains?.(t);
	} catch {
		return !1;
	}
};
function wr({ activeView: e, onViewChange: t, onZoomIn: n, onZoomOut: r, onZoomExtents: i, showCube: a = !0, showUcs: o = !0, collapsible: s = !1, collapsed: c, defaultCollapsed: d = !1, onCollapsedChange: f, peekOpen: m, defaultPeekOpen: h = !1, onPeekOpenChange: v, peekOnHover: y = !0, peekOnFocus: b = !0, className: x, label: S = "Viewport controls", panelLabel: C, onPointerEnter: w, onPointerLeave: T, onFocusCapture: E, onBlurCapture: D, onKeyDown: O, ...k }) {
	let A = u(), j = `cad-viewport-controls-content-${A}`, M = `cad-viewport-controls-instructions-${A}`, N = p(null), P = p({
		pointer: !1,
		focus: !1,
		dismissed: !1
	}), [F, I] = $(c, !!d, (e, t, n) => f?.(!!e, t, n)), [L, R] = $(m, !!h, (e, t, n) => v?.(!!e, t, n)), z = !!s, B = z && !!F, ee = B && !!L, V = !z || !B || ee, H = String(S || "Viewport controls"), U = C || `${H} panel`, te = (e, t, n = "programmatic") => {
		let r = !!F, i = !!(typeof e == "function" ? e(r) : e), a = {
			changed: r !== i,
			previousCollapsed: r,
			collapsed: i,
			source: n
		};
		return a.changed && I(i, a, t), a;
	}, W = (e, t, n = "programmatic") => {
		let r = !!L, i = !!(typeof e == "function" ? e(r) : e), a = {
			changed: r !== i,
			previousOpen: r,
			open: i,
			collapsed: B,
			source: n
		};
		return a.changed && R(i, a, t), a;
	}, G = (e, t) => {
		!z || !B || P.current.dismissed || W(!0, e, t);
	}, ne = (e, t) => {
		let n = P.current;
		!z || !B || n.pointer || n.focus || (n.dismissed = !1, W(!1, e, t));
	}, re = (e) => {
		w?.(e), !(e.defaultPrevented || !z) && (P.current.pointer = !0, P.current.dismissed = !1, y && G(e, "pointer-enter"));
	}, K = (e) => {
		T?.(e), !(e.defaultPrevented || !z || Cr(e.currentTarget, e.relatedTarget)) && (P.current.pointer = !1, ne(e, "pointer-leave"));
	}, q = (e) => {
		E?.(e), !(e.defaultPrevented || !z) && (P.current.focus = !0, P.current.dismissed = !1, b && G(e, "focus-enter"));
	}, J = (e) => {
		D?.(e), !(e.defaultPrevented || !z || Cr(e.currentTarget, e.relatedTarget)) && (P.current.focus = !1, ne(e, "focus-leave"));
	}, ie = (e) => {
		let t = !B;
		t ? (P.current.dismissed = !0, W(!1, e, "collapse")) : W(!1, e, "pin-open"), te(t, e, "toggle");
	}, Y = (e) => {
		O?.(e), !(e.defaultPrevented || e.key !== "Escape" || !B || !ee) && (e.preventDefault(), P.current.dismissed = !0, P.current.focus = !1, W(!1, e, "escape"), N.current?.focus());
	};
	l(() => {
		if (!(V || typeof document > "u") && document.getElementById(j)?.contains(document.activeElement)) try {
			N.current?.focus?.({ preventScroll: !0 });
		} catch {
			N.current?.focus?.();
		}
	}, [j, V]);
	let ae = B ? `Open ${H}` : `Collapse ${H}`, oe = B ? V ? `Keep ${H} open` : `Open ${H}` : `Collapse ${H}`;
	return /* @__PURE__ */ _("aside", {
		...k,
		className: X("cad-viewport-controls", x),
		"aria-label": H,
		"data-collapsible": z ? "true" : "false",
		"data-collapsed": B ? "true" : "false",
		"data-peek-open": ee ? "true" : "false",
		"data-expanded": V ? "true" : "false",
		onPointerEnter: re,
		onPointerLeave: K,
		onFocusCapture: q,
		onBlurCapture: J,
		onKeyDown: Y,
		children: [
			z && /* @__PURE__ */ _("button", {
				ref: N,
				type: "button",
				className: "cad-viewport-controls__handle",
				"aria-label": ae,
				"aria-pressed": !B,
				"aria-controls": j,
				"aria-expanded": V,
				"aria-describedby": M,
				title: oe,
				onClick: ie,
				children: [
					/* @__PURE__ */ g("span", {
						className: "cad-viewport-controls__handle-icon",
						"aria-hidden": "true",
						children: "◇"
					}),
					/* @__PURE__ */ g("span", {
						className: "cad-viewport-controls__handle-label",
						children: "VIEW CUBE"
					}),
					/* @__PURE__ */ g("span", {
						className: "cad-viewport-controls__handle-chevron",
						"aria-hidden": "true",
						children: B ? "‹" : "›"
					})
				]
			}),
			/* @__PURE__ */ _("div", {
				id: j,
				className: "cad-viewport-controls__content",
				role: z ? "region" : void 0,
				"aria-label": z ? U : void 0,
				hidden: !V,
				children: [
					a && /* @__PURE__ */ g(xr, {
						activeView: e,
						onViewChange: t
					}),
					/* @__PURE__ */ _("div", {
						className: "cad-viewport-controls__zoom",
						role: "group",
						"aria-label": "Zoom controls",
						children: [
							/* @__PURE__ */ g("button", {
								type: "button",
								"aria-label": "Zoom in",
								onClick: n,
								children: "+"
							}),
							/* @__PURE__ */ g("button", {
								type: "button",
								"aria-label": "Zoom out",
								onClick: r,
								children: "−"
							}),
							/* @__PURE__ */ g("button", {
								type: "button",
								"aria-label": "Zoom extents",
								onClick: i,
								children: "⌗"
							})
						]
					}),
					o && /* @__PURE__ */ g(Sr, {})
				]
			}),
			z && /* @__PURE__ */ g("span", {
				id: M,
				className: "cad-cui-sr-only",
				children: "When collapsed, hover or focus the ViewCube to temporarily reveal its navigation controls. Use this button to keep it open."
			})
		]
	});
}
function Tr({ count: e = 0, entityLabel: t = "objects", fields: n = [], emptyLabel: r = "Nothing selected", className: i }) {
	return /* @__PURE__ */ _("output", {
		className: X("cad-selection-summary", i),
		"aria-live": "polite",
		children: [/* @__PURE__ */ g("strong", { children: e ? `${e} ${t}` : r }), Z(n).length > 0 && /* @__PURE__ */ g("span", { children: Z(n).map((e, t) => /* @__PURE__ */ _("small", { children: [
			e?.label,
			": ",
			/* @__PURE__ */ g("b", { children: e?.value })
		] }, e?.id || t)) })]
	});
}
function Er({ distance: e, angle: t, area: n, volume: r, className: i, label: a = "Measurement" }) {
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
	return o.length ? /* @__PURE__ */ g("output", {
		className: X("cad-measure-readout", i),
		"aria-label": a,
		children: o.map((e) => /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("small", { children: e.label }), /* @__PURE__ */ g("b", { children: e.value })] }, e.id))
	}) : null;
}
//#endregion
//#region src/CadWorkspaceDockUi.tsx
var Dr = Object.freeze({
	OPEN: "open",
	RAIL: "rail",
	CLOSED: "closed"
}), Or = new Set(Object.values(Dr)), kr = /* @__PURE__ */ new Set([
	"left",
	"right",
	"top",
	"bottom"
]), Ar = /* @__PURE__ */ new Set([
	"left",
	"right",
	"bottom"
]), jr = (e, t) => {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, Mr = (e, t, n, r) => Ve(Math.round(jr(e, t)), n, r), Nr = (e, t) => {
	let n = Math.max(0, Math.round(jr(e, 72)));
	return {
		minimum: n,
		maximum: Math.max(n, Math.round(jr(t, 720)))
	};
}, Pr = (e) => Math.max(1, Math.round(jr(e, 16))), Fr = (e, t = Dr.OPEN) => {
	let n = String(e ?? "").trim().toLocaleLowerCase();
	return Or.has(n) ? n : t;
}, Ir = (e, t = "always") => {
	let n = String(e ?? "").trim().toLocaleLowerCase();
	return n === "when-open" || n === "always" ? n : t;
}, Lr = (e) => kr.has(e) ? e : "left", Rr = (e) => {
	let t = Lr(e), n = t === "left" || t === "right", r = t === "left" || t === "top";
	return {
		edge: t,
		axis: n ? "x" : "y",
		orientation: n ? "vertical" : "horizontal",
		growsWithPositiveMovement: r,
		growKey: n ? r ? "ArrowRight" : "ArrowLeft" : r ? "ArrowDown" : "ArrowUp",
		shrinkKey: n ? r ? "ArrowLeft" : "ArrowRight" : r ? "ArrowUp" : "ArrowDown"
	};
}, zr = (e, t) => e ? e.pointerId === null || t?.pointerId === null || t?.pointerId === void 0 || t.pointerId === e.pointerId : !1;
function Br({ mode: e, defaultMode: t = Dr.OPEN, onModeChange: n, size: r, defaultSize: i = 280, minSize: a = 72, maxSize: s = 720, onSizeChange: c } = {}) {
	let { minimum: l, maximum: u } = Nr(a, s), d = Fr(t), f = Mr(i, 280, l, u), [p, m] = $(e, d, (e, t, r) => n?.(Fr(e, d), t, r)), [h, g] = $(r, f, (e, t, n) => c?.(Mr(e, f, l, u), t, n)), _ = Fr(p, d), v = Mr(h, f, l, u), y = o((e, t, n = "programmatic") => {
		let r = Fr(typeof e == "function" ? e(_) : e, _), i = {
			changed: r !== _,
			mode: r,
			previousMode: _,
			source: n
		};
		return i.changed && m(r, i, t), i;
	}, [_, m]);
	return {
		mode: _,
		size: v,
		minSize: l,
		maxSize: u,
		setMode: y,
		setSize: o((e, t, n = "programmatic", r = {}) => {
			let i = Mr(typeof e == "function" ? e(v) : e, v, l, u), a = {
				changed: i !== v,
				size: i,
				previousSize: v,
				minSize: l,
				maxSize: u,
				...r,
				source: n
			};
			return a.changed && g(i, a, t), a;
		}, [
			v,
			u,
			l,
			g
		]),
		open: o((e, t = "open") => y(Dr.OPEN, e, t), [y]),
		rail: o((e, t = "rail") => y(Dr.RAIL, e, t), [y]),
		close: o((e, t = "close") => y(Dr.CLOSED, e, t), [y]),
		isOpen: _ === Dr.OPEN,
		isRail: _ === Dr.RAIL,
		isClosed: _ === Dr.CLOSED
	};
}
function Vr({ mode: e, defaultMode: t = Dr.OPEN, onModeChange: n, label: r = "Workspace dock", controls: i, disabled: a = !1, openDisabled: o = !1, railDisabled: s = !1, hideDisabled: c = !1, openLabel: l, railLabel: u, hideLabel: d, onOpenClick: f, onRailClick: p, onHideClick: m, className: h, "aria-label": v, "aria-controls": y, ...b }) {
	let x = Br({
		mode: e,
		defaultMode: t,
		onModeChange: n
	}), S = y || i, C = String(r || "Workspace dock"), w = [
		{
			mode: Dr.OPEN,
			label: l || `Open ${C}`,
			caption: "OPEN",
			symbol: "▤",
			disabled: a || o,
			onClick: f
		},
		{
			mode: Dr.RAIL,
			label: u || `Rail ${C}`,
			caption: "RAIL",
			symbol: "▥",
			disabled: a || s,
			onClick: p
		},
		{
			mode: Dr.CLOSED,
			label: d || `Hide ${C}`,
			caption: "HIDE",
			symbol: "×",
			disabled: a || c,
			onClick: m
		}
	], T = (e, t, n) => {
		n?.(t, x), t.defaultPrevented || x.setMode(e, t, "mode-control");
	};
	return /* @__PURE__ */ g("div", {
		...b,
		className: X("cad-workspace-dock-mode-control", h),
		"data-mode": x.mode,
		role: "group",
		"aria-label": v || `${C} visibility`,
		children: w.map((e) => /* @__PURE__ */ _("button", {
			type: "button",
			className: "cad-workspace-dock-mode-control__action",
			"data-mode": e.mode,
			"data-active": x.mode === e.mode ? "true" : "false",
			"aria-label": e.label,
			"aria-controls": S,
			"aria-pressed": x.mode === e.mode,
			disabled: e.disabled,
			title: e.label,
			onClick: (t) => T(e.mode, t, e.onClick),
			children: [/* @__PURE__ */ g("span", {
				"aria-hidden": "true",
				children: e.symbol
			}), /* @__PURE__ */ g("span", { children: e.caption })]
		}, e.mode))
	});
}
var Hr = i(function({ size: e, defaultSize: t = 280, minSize: n = 72, maxSize: r = 720, resizeStep: i = 16, edge: a = "left", onSizeChange: s, onResizeStart: c, onResizeEnd: u, disabled: f = !1, label: h = "dock", separatorLabel: _, controls: v, className: y, children: b, onPointerDown: x, onPointerMove: S, onPointerUp: C, onPointerCancel: w, onLostPointerCapture: T, onKeyDown: E, "aria-label": D, "aria-controls": O, ...k }, A) {
	let j = Br({
		size: e,
		defaultSize: t,
		minSize: n,
		maxSize: r,
		onSizeChange: s
	}), M = d(() => Rr(a), [a]), N = Pr(i), P = p(null), F = p(null), I = p(j.size), L = p(j.setSize), R = p(c), z = p(u), [B, ee] = m(!1);
	L.current = j.setSize, R.current = c, z.current = u, l(() => {
		P.current || (I.current = j.size);
	}, [j.size]);
	let V = o((e) => {
		try {
			e?.pointerId !== null && e?.pointerId !== void 0 && e?.handle?.hasPointerCapture?.(e.pointerId) && e.handle.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []), H = o((e) => {
		let t = P.current;
		if (!t || !zr(t, e) || e.defaultPrevented) return;
		let n = t.axis === "x" ? Number(e.clientX) : Number(e.clientY);
		if (!Number.isFinite(n)) return;
		let r = (n - t.startCoordinate) * (t.growsWithPositiveMovement ? 1 : -1), i = Mr(t.startSize + r, t.startSize, t.minSize, t.maxSize);
		I.current = i, L.current?.(i, e, "pointer", {
			edge: t.edge,
			orientation: t.orientation,
			axis: t.axis
		});
	}, []), U = o(() => {
		let e = F.current;
		F.current = null, !(!e || typeof window > "u") && (window.removeEventListener("pointermove", e.pointerMove), window.removeEventListener("pointerup", e.pointerEnd), window.removeEventListener("pointercancel", e.pointerCancel));
	}, []), te = o((e, t = !1) => {
		let n = P.current;
		if (!n || !zr(n, e)) return;
		P.current = null, U(), V(n), ee(!1);
		let r = Mr(I.current, n.startSize, n.minSize, n.maxSize);
		I.current = r, z.current?.(r, {
			changed: r !== n.startSize,
			source: "pointer",
			edge: n.edge,
			orientation: n.orientation,
			axis: n.axis,
			cancelled: !!t
		}, e);
	}, [V, U]), W = o((e) => te(e, !1), [te]), G = o((e) => te(e, !0), [te]);
	l(() => () => {
		let e = P.current;
		if (!e) return;
		P.current = null, U(), V(e);
		let t = Mr(I.current, e.startSize, e.minSize, e.maxSize);
		z.current?.(t, {
			changed: t !== e.startSize,
			source: "pointer",
			edge: e.edge,
			orientation: e.orientation,
			axis: e.axis,
			cancelled: !0,
			reason: "unmount"
		});
	}, [V, U]), l(() => {
		f && te(void 0, !0);
	}, [f, te]);
	let ne = (e) => {
		if (f || P.current || e.button !== void 0 && e.button !== 0 || (x?.(e), e.defaultPrevented)) return;
		let t = M.axis === "x" ? Number(e.clientX) : Number(e.clientY);
		if (!Number.isFinite(t)) return;
		e.preventDefault();
		let n = e.pointerId === void 0 || e.pointerId === null ? null : e.pointerId, r = {
			pointerId: n,
			handle: e.currentTarget,
			startCoordinate: t,
			startSize: j.size,
			minSize: j.minSize,
			maxSize: j.maxSize,
			...M
		};
		I.current = j.size, P.current = r;
		try {
			n !== null && e.currentTarget.setPointerCapture?.(n);
		} catch {}
		if (ee(!0), R.current?.(j.size, {
			source: "pointer",
			edge: M.edge,
			orientation: M.orientation,
			axis: M.axis
		}, e), typeof window < "u") {
			let e = {
				pointerMove: H,
				pointerEnd: W,
				pointerCancel: G
			};
			F.current = e, window.addEventListener("pointermove", e.pointerMove), window.addEventListener("pointerup", e.pointerEnd), window.addEventListener("pointercancel", e.pointerCancel);
		}
	}, re = (e, t) => {
		let n = Mr(I.current, j.size, j.minSize, j.maxSize), r = Mr(n + e, n, j.minSize, j.maxSize);
		I.current = r, j.setSize(r, t, "keyboard", {
			edge: M.edge,
			orientation: M.orientation,
			axis: M.axis
		});
	}, K = (e, t) => {
		let n = e === "min" ? j.minSize : j.maxSize;
		I.current = n, j.setSize(n, t, "keyboard", {
			edge: M.edge,
			orientation: M.orientation,
			axis: M.axis
		});
	}, q = (e) => {
		if (E?.(e), f || e.defaultPrevented) return;
		let t = N * (e.shiftKey ? 3 : 1);
		if (e.key === M.growKey) {
			e.preventDefault(), re(t, e);
			return;
		}
		if (e.key === M.shrinkKey) {
			e.preventDefault(), re(-t, e);
			return;
		}
		if (e.key === "PageUp") {
			e.preventDefault(), re(t * 3, e);
			return;
		}
		if (e.key === "PageDown") {
			e.preventDefault(), re(-t * 3, e);
			return;
		}
		if (e.key === "Home") {
			e.preventDefault(), K("min", e);
			return;
		}
		e.key === "End" && (e.preventDefault(), K("max", e));
	}, J = O || v, ie = D || _ || `Resize ${h}`;
	return /* @__PURE__ */ g("div", {
		...k,
		ref: A,
		className: X("cad-workspace-dock-resize-handle", y),
		"data-edge": M.edge,
		"data-orientation": M.orientation,
		"data-resizing": B ? "true" : "false",
		"data-disabled": f ? "true" : "false",
		role: "separator",
		tabIndex: f ? -1 : 0,
		"aria-label": ie,
		"aria-controls": J,
		"aria-disabled": f || void 0,
		"aria-orientation": M.orientation,
		"aria-valuemin": j.minSize,
		"aria-valuemax": j.maxSize,
		"aria-valuenow": j.size,
		"aria-valuetext": `${j.size} pixels`,
		onPointerDown: ne,
		onPointerMove: S,
		onPointerUp: (e) => {
			C?.(e), te(e, !1);
		},
		onPointerCancel: (e) => {
			w?.(e), te(e, !0);
		},
		onLostPointerCapture: (e) => {
			T?.(e), te(e, !0);
		},
		onKeyDown: q,
		children: b || /* @__PURE__ */ g("span", {
			className: "cad-workspace-dock-resize-handle__grip",
			"aria-hidden": "true"
		})
	});
});
Hr.displayName = "CadWorkspaceDockResizeHandle";
var Ur = (e) => Ar.has(e) ? e : "left";
function Wr({ peekOpen: e, defaultPeekOpen: t = !1, onPeekOpenChange: n, edge: r = "left" } = {}) {
	let i = Ur(r), [a, s] = $(e, !!t, (e, t, r) => n?.(!!e, t, r)), c = !!a, l = o((e, t, n = "programmatic") => {
		let r = !!(typeof e == "function" ? e(c) : e), a = {
			changed: r !== c,
			open: r,
			previousOpen: c,
			edge: i,
			source: n
		};
		return a.changed && s(r, a, t), a;
	}, [
		c,
		i,
		s
	]);
	return {
		edge: i,
		peekOpen: c,
		setPeekOpen: l,
		openPeek: o((e, t = "programmatic") => l(!0, e, t), [l]),
		closePeek: o((e, t = "programmatic") => l(!1, e, t), [l])
	};
}
var Gr = (e, t) => {
	if (!e || !t) return !1;
	try {
		return e === t || !!e.contains?.(t);
	} catch {
		return !1;
	}
};
function Kr({ edge: e = "left", label: t = "Workspace dock", previewLabel: n, expandLabel: r, children: i, renderPreview: a, previewMount: o, peekOpen: s, defaultPeekOpen: c = !1, onPeekOpenChange: l, onExpand: f, disabled: m = !1, id: h, controls: v, className: y, railClassName: b, previewClassName: x, onPointerEnter: S, onPointerLeave: C, onFocusCapture: w, onBlurCapture: T, onKeyDown: E, "aria-label": D, ...O }) {
	let k = u(), A = p(null), j = p({
		pointer: !1,
		focus: !1,
		dismissed: !1
	}), M = Ur(e), N = h || `cad-workspace-dock-rail-${k}`, P = `${N}-label`, F = `${N}-preview`, I = Wr({
		edge: M,
		peekOpen: s,
		defaultPeekOpen: c,
		onPeekOpenChange: l
	}), L = !m && I.peekOpen, R = String(t || "Workspace dock"), z = n || `${R} preview`, B = r || `Expand ${R}`, ee = typeof a == "function" ? a : typeof i == "function" ? i : null, V = Ir(o, ee ? "when-open" : "always"), H = d(() => ({
		active: L,
		peekOpen: L,
		edge: M,
		label: R,
		previewId: F,
		controls: v || F,
		disabled: !!m
	}), [
		v,
		m,
		L,
		F,
		M,
		R
	]), U = L || V === "always", te = U ? ee ? ee(H) : i : null, W = (e, t) => {
		m || (j.current.dismissed = !1, I.openPeek(e, t));
	}, G = (e, t) => {
		let n = j.current;
		m || n.pointer || n.focus || (n.dismissed = !1, I.closePeek(e, t));
	}, ne = (e) => {
		S?.(e), !(e.defaultPrevented || m) && (j.current.pointer = !0, W(e, "pointer-enter"));
	}, re = (e) => {
		C?.(e), !(e.defaultPrevented || m || Gr(e.currentTarget, e.relatedTarget)) && (j.current.pointer = !1, G(e, "pointer-leave"));
	}, K = (e) => {
		w?.(e), !(e.defaultPrevented || m) && (j.current.focus = !0, j.current.dismissed || W(e, "focus-enter"));
	}, q = (e) => {
		T?.(e), !(e.defaultPrevented || m || Gr(e.currentTarget, e.relatedTarget)) && (j.current.focus = !1, G(e, "focus-leave"));
	}, J = (e) => {
		E?.(e), !(e.defaultPrevented || m || e.key !== "Escape" || !L) && (e.preventDefault(), j.current.dismissed = !0, I.closePeek(e, "escape"), A.current?.focus());
	}, ie = (e) => {
		m || (f?.(e, {
			edge: M,
			label: R,
			previewId: F,
			controls: v || F,
			source: "rail-expand"
		}), e.defaultPrevented || W(e, "expand"));
	};
	return /* @__PURE__ */ _("section", {
		...O,
		id: N,
		className: X("cad-workspace-dock-rail", y),
		"data-edge": M,
		"data-peek-open": L ? "true" : "false",
		"data-preview-mount": V,
		"data-preview-rendered": U ? "true" : "false",
		"data-disabled": m ? "true" : "false",
		onPointerEnter: ne,
		onPointerLeave: re,
		onFocusCapture: K,
		onBlurCapture: q,
		onKeyDown: J,
		children: [/* @__PURE__ */ _("button", {
			ref: A,
			id: P,
			type: "button",
			className: X("cad-workspace-dock-rail__label", b),
			"aria-label": D || `Preview ${R}`,
			"aria-controls": F,
			"aria-expanded": L,
			disabled: m,
			title: B,
			onClick: ie,
			children: [
				/* @__PURE__ */ _("span", {
					className: "cad-workspace-dock-rail__signal",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ g("i", {}),
						/* @__PURE__ */ g("i", {}),
						/* @__PURE__ */ g("i", {})
					]
				}),
				/* @__PURE__ */ g("span", { children: R }),
				/* @__PURE__ */ g("small", {
					"aria-hidden": "true",
					children: "PEEK"
				})
			]
		}), /* @__PURE__ */ g("aside", {
			id: F,
			className: X("cad-workspace-dock-rail__preview", x),
			"data-edge": M,
			role: "region",
			"aria-label": n ? z : void 0,
			"aria-labelledby": n ? void 0 : P,
			"aria-hidden": !L,
			hidden: !L,
			children: te
		})]
	});
}
function qr({ edge: e = "left", panels: t = [], activeId: n, defaultActiveId: r, onActiveChange: i, onPanelClose: a, label: s = "Docked panels", tabsLabel: c, compactTabs: l = !1, renderPanel: u, children: d, id: f, className: p, tabsClassName: m, panelClassName: h, emptyLabel: _ = "No panels are available in this dock.", ...v }) {
	let y = Ur(e), b = Z(t), x = o((e) => {
		let t = u?.(e), n = t === void 0 ? e?.content ?? e?.children : t;
		return h ? /* @__PURE__ */ g("div", {
			className: h,
			children: n
		}) : n;
	}, [h, u]);
	return /* @__PURE__ */ g("section", {
		...v,
		id: f,
		className: X("cad-workspace-dock-zone", p),
		"data-edge": y,
		"aria-label": s,
		role: "complementary",
		children: b.length > 0 ? /* @__PURE__ */ g(pr, {
			items: b,
			activeId: n,
			defaultActiveId: r,
			onChange: (e, t, n) => i?.(e, t, n),
			onClose: a ? (e, t) => a(e, t) : void 0,
			label: c || s,
			compact: l,
			className: X("cad-workspace-dock-zone__tabs", m),
			renderPanel: x
		}) : /* @__PURE__ */ g("div", {
			className: "cad-workspace-dock-zone__empty",
			role: "status",
			children: d || _
		})
	});
}
//#endregion
//#region src/CadDraftingUi.tsx
var Jr = Object.freeze({
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
}), Yr = Object.freeze([
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
]), Xr = Object.freeze([
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
]), Zr = Object.freeze([
	"1:1",
	"1:2",
	"1:5",
	"1:10",
	"1:20",
	"1:50",
	"1:100"
]), Qr = Object.freeze([
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
]), $r = (e) => Z(e).map((e, t) => typeof e == "string" ? {
	id: e,
	label: e
} : {
	...e,
	id: e?.id || `${Q(e)}-${t}`,
	label: Q(e)
});
function ei({ mode: e = "point", fields: t, value: n, defaultValue: r = {}, onChange: i, onSubmit: a, prompt: o = "Specify point", unit: s = "mm", visible: c = !0, submitLabel: l = "Accept", className: f, children: p, ...m }) {
	let h = u(), v = Z(t).length ? Z(t) : Jr[e] || Jr.point, y = d(() => v.reduce((e, t) => t?.id && t.value !== void 0 ? {
		...e,
		[t.id]: t.value
	} : e, {}), [v]), [b, x] = $(n, d(() => ({
		...y,
		...r && typeof r == "object" ? r : {}
	}), [r, y]), (e, t, n) => i?.(e, t, n)), S = {
		...y,
		...b && typeof b == "object" ? b : {}
	}, C = (e, t, n) => x({
		...S,
		[e.id]: t
	}, e, n);
	return c ? /* @__PURE__ */ _("form", {
		...m,
		className: X("cad-dynamic-input", f),
		"data-mode": e,
		"aria-label": o,
		onSubmit: (e) => {
			e.preventDefault(), a?.(S, e);
		},
		children: [
			/* @__PURE__ */ g("output", {
				className: "cad-dynamic-input__prompt",
				children: o
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-dynamic-input__fields",
				children: [v.map((e, t) => {
					let n = e.id || t, r = {
						id: `cad-dynamic-${h}-${e.id || t}`,
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
					return e.type === "angle" ? /* @__PURE__ */ g(Qe, {
						...r,
						unit: e.unit || "°"
					}, n) : e.type === "unit" ? /* @__PURE__ */ g(Ze, { ...r }, n) : /* @__PURE__ */ g(Xe, { ...r }, n);
				}), p]
			}),
			a && /* @__PURE__ */ _("button", {
				type: "submit",
				className: "cad-dynamic-input__submit",
				children: [l, /* @__PURE__ */ g("span", {
					"aria-hidden": "true",
					children: "↵"
				})]
			})
		]
	}) : null;
}
function ti({ modes: e = Yr, activeIds: t, defaultActiveIds: n = [], multiple: r = !0, onChange: i, onClose: a, label: o = "Object snaps", className: s, ...c }) {
	let l = d(() => $r(e), [e]), [u, f] = $(t, n, (e, t, n) => i?.(e, t, n)), p = new Set(Z(u)), m = (e, t) => {
		if (e.disabled) return;
		let n = r ? p.has(e.id) ? [...p].filter((t) => t !== e.id) : [...p, e.id] : p.has(e.id) ? [] : [e.id];
		f(n, e, t);
	};
	return /* @__PURE__ */ _("aside", {
		...c,
		className: X("cad-object-snap-menu", s),
		"aria-label": o,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("strong", { children: o }), a && /* @__PURE__ */ g("button", {
			type: "button",
			"aria-label": `Close ${o}`,
			onClick: a,
			children: "×"
		})] }), /* @__PURE__ */ g("div", {
			className: "cad-object-snap-menu__grid",
			role: "group",
			"aria-label": o,
			children: l.map((e) => /* @__PURE__ */ _("button", {
				type: "button",
				className: "cad-object-snap-menu__item",
				"data-active": p.has(e.id) ? "true" : "false",
				"aria-pressed": p.has(e.id),
				disabled: e.disabled,
				title: [e.label, e.shortcut].filter(Boolean).join(" · "),
				onClick: (t) => m(e, t),
				children: [
					/* @__PURE__ */ g("span", {
						className: "cad-object-snap-menu__glyph",
						"aria-hidden": "true",
						children: e.glyph || "•"
					}),
					/* @__PURE__ */ g("span", { children: e.label }),
					e.shortcut && /* @__PURE__ */ g(Ue, { shortcut: e.shortcut })
				]
			}, e.id))
		})]
	});
}
function ni({ tools: e = [], selectionCount: t, label: n = "Selection tools", onAction: r, onDismiss: i, className: a, ...o }) {
	let s = Z(e).filter((e) => e?.type === "separator" || !e?.hidden);
	return t !== void 0 && Number(t) <= 0 || !s.some((e) => e?.type !== "separator") ? null : /* @__PURE__ */ _("aside", {
		...o,
		className: X("cad-grip-toolbar", a),
		"aria-label": n,
		children: [
			t !== void 0 && /* @__PURE__ */ _("output", {
				className: "cad-grip-toolbar__selection",
				children: [t, " selected"]
			}),
			/* @__PURE__ */ g("div", {
				role: "toolbar",
				"aria-label": n,
				children: s.map((e, t) => e?.type === "separator" ? /* @__PURE__ */ g("span", {
					className: "cad-grip-toolbar__separator",
					role: "separator"
				}, e.id || t) : /* @__PURE__ */ g(We, {
					icon: e?.icon,
					label: Q(e),
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
			i && /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-grip-toolbar__dismiss",
				"aria-label": `Dismiss ${n}`,
				onClick: i,
				children: "×"
			})
		]
	});
}
function ri({ constraints: e = Xr, activeIds: t, defaultActiveIds: n = [], onChange: r, onAction: i, label: a = "Geometric constraints", layout: o = "strip", className: s, ...c }) {
	let l = d(() => $r(e), [e]), [u, f] = $(t, n, (e, t, n) => r?.(e, t, n)), p = new Set(Z(u)), m = o === "auto" || o === "tiles" ? o : "strip", h = (e, t) => {
		if (e.disabled) return;
		let n = p.has(e.id) ? [...p].filter((t) => t !== e.id) : [...p, e.id];
		f(n, e, t), i?.(e, t);
	};
	return /* @__PURE__ */ g("div", {
		...c,
		className: X("cad-constraint-bar", s),
		"data-layout": m,
		role: "group",
		"aria-label": a,
		children: l.map((e) => /* @__PURE__ */ _("button", {
			type: "button",
			"data-active": p.has(e.id) ? "true" : "false",
			"aria-label": e.label,
			"aria-pressed": p.has(e.id),
			disabled: e.disabled,
			title: e.label,
			onClick: (t) => h(e, t),
			children: [/* @__PURE__ */ g("span", {
				"aria-hidden": "true",
				children: e.glyph || "•"
			}), /* @__PURE__ */ g("small", { children: e.shortLabel || e.label })]
		}, e.id))
	});
}
function ii({ scales: e = Zr, value: t, defaultValue: n, onChange: r, label: i = "Annotation scale", onManage: a, id: o, selectProps: s = {}, disabled: c = !1, layout: l = "stacked", className: f, ...p }) {
	let m = u(), h = o || `cad-annotation-scale-${m}`, v = d(() => $r(e), [e]), [y, b] = $(t, n ?? v[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), x = l === "inline" ? "inline" : "stacked";
	return /* @__PURE__ */ _("div", {
		...p,
		className: X("cad-annotation-scale-picker", f),
		"data-layout": x,
		children: [
			/* @__PURE__ */ g("label", {
				htmlFor: h,
				children: i
			}),
			/* @__PURE__ */ g("select", {
				...s,
				id: h,
				value: y,
				disabled: c || s.disabled,
				onChange: (e) => {
					let t = v.find((t) => t.id === e.target.value);
					b(e.target.value, t, e), s.onChange?.(e);
				},
				children: v.map((e) => /* @__PURE__ */ g("option", {
					value: e.id,
					disabled: e.disabled,
					children: e.label
				}, e.id))
			}),
			a && /* @__PURE__ */ g("button", {
				type: "button",
				disabled: c,
				onClick: a,
				children: "Manage"
			})
		]
	});
}
function ai({ presets: e = Qr, value: t, defaultValue: n, onChange: r, label: i = "View preset", id: a, selectProps: o = {}, disabled: s = !1, className: c, ...l }) {
	let f = u(), p = a || `cad-view-preset-${f}`, m = d(() => $r(e), [e]), [h, v] = $(t, n ?? m[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ _("div", {
		...l,
		className: X("cad-view-preset-picker", c),
		children: [/* @__PURE__ */ g("label", {
			htmlFor: p,
			children: i
		}), /* @__PURE__ */ g("select", {
			...o,
			id: p,
			value: h,
			disabled: s || o.disabled,
			onChange: (e) => {
				let t = m.find((t) => t.id === e.target.value);
				v(e.target.value, t, e), o.onChange?.(e);
			},
			children: m.map((e) => /* @__PURE__ */ g("option", {
				value: e.id,
				disabled: e.disabled,
				children: e.label
			}, e.id))
		})]
	});
}
function oi({ angle: e, distance: t, increment: n, active: r, defaultActive: i = !1, onActiveChange: a, className: o, label: s = "Polar tracking", ...c }) {
	let [l, u] = $(r, i, (e, t) => a?.(e, t));
	return /* @__PURE__ */ _("div", {
		...c,
		className: X("cad-polar-tracker", l && "cad-polar-tracker--active", o),
		role: "group",
		"aria-label": s,
		children: [
			/* @__PURE__ */ _("button", {
				type: "button",
				"aria-pressed": l,
				onClick: (e) => u(!l, e),
				children: [/* @__PURE__ */ g("span", {
					className: "cad-polar-tracker__ray",
					"aria-hidden": "true"
				}), "POLAR"]
			}),
			e !== void 0 && /* @__PURE__ */ _("span", { children: [
				/* @__PURE__ */ g("small", { children: "∠" }),
				e,
				n && /* @__PURE__ */ _("em", { children: ["/", n] })
			] }),
			t !== void 0 && /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("small", { children: "D" }), t] })
		]
	});
}
function si({ type: e = "endpoint", label: t, active: n = !0, className: r, style: i, ...a }) {
	let o = Yr.find((t) => t.id === e)?.glyph || "•";
	return /* @__PURE__ */ _("span", {
		...a,
		className: X("cad-object-snap-marker", n && "cad-object-snap-marker--active", r),
		"data-type": e,
		style: i,
		role: t ? "img" : void 0,
		"aria-label": t || void 0,
		children: [/* @__PURE__ */ g("span", {
			"aria-hidden": "true",
			children: o
		}), t && /* @__PURE__ */ g("small", { children: t })]
	});
}
function ci({ label: e = "Selection grip", variant: t = "square", active: n = !1, disabled: r = !1, onPointerDown: i, onClick: a, className: o, ...s }) {
	return /* @__PURE__ */ g("button", {
		...s,
		type: "button",
		className: X("cad-selection-grip", n && "cad-selection-grip--active", o),
		"data-variant": t,
		"aria-label": e,
		disabled: r,
		onPointerDown: i,
		onClick: a,
		children: /* @__PURE__ */ g("span", { "aria-hidden": "true" })
	});
}
//#endregion
//#region src/CadLayoutUi.tsx
var li = Object.freeze([
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
]), ui = Object.freeze([
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
]), di = Object.freeze([
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
]), fi = (e) => Z(e).map((e, t) => typeof e == "string" || typeof e == "number" ? {
	id: String(e),
	label: String(e),
	value: e
} : {
	...e,
	id: e?.id || `${Q(e)}-${t}`,
	label: Q(e)
}), pi = (e) => typeof e == "string" ? {
	mode: "rgb",
	value: e
} : !e || typeof e != "object" ? { mode: "by-layer" } : {
	...e,
	mode: e.mode || "rgb",
	value: e.value || e.hex
}, mi = (e) => {
	let t = pi(e);
	return t.mode === "by-layer" ? "ByLayer" : t.mode === "by-block" ? "ByBlock" : t.value || t.hex || "Color";
};
function hi({ orientation: e = "horizontal", size: t, defaultSize: n = 30, minSize: r = 12, maxSize: i = 88, keyboardStep: a = 5, primary: o, secondary: s, onSizeChange: c, onResizeStart: u, onResizeEnd: d, separatorLabel: f = "Resize panels", className: m, ...h }) {
	let v = p(null), y = p(null), b = p(n), x = p(null), S = p(d), C = p(null), w = p(null), T = p(null), E = Number(r), D = Number(i), O = Number.isFinite(E) ? E : 0, k = Math.max(O, Number.isFinite(D) ? D : 100), A = Number(n), j = Ve(Number.isFinite(A) ? A : O, O, k), M = Number(a), N = Number.isFinite(M) && M > 0 ? M : 5, [P, F] = $(t, n, (e, t, n) => c?.(e, t, n)), I = Number(P), L = Ve(Number.isFinite(I) ? I : j, O, k), R = e === "vertical" ? "y" : "x", z = e === "vertical" ? "horizontal" : "vertical";
	b.current = L, x.current = F, S.current = d, T.current ||= () => {
		typeof window > "u" || (window.removeEventListener("pointermove", C.current), window.removeEventListener("pointerup", w.current), window.removeEventListener("pointercancel", w.current));
	}, C.current ||= (e) => {
		let t = y.current, n = v.current;
		if (!t || !n || t.pointerId !== null && e.pointerId !== t.pointerId) return;
		let r = n.getBoundingClientRect(), i = t.orientation === "vertical" ? r.height : r.width, a = t.orientation === "vertical" ? e.clientY - r.top : e.clientX - r.left;
		if (!Number.isFinite(i) || i <= 0 || !Number.isFinite(a)) return;
		let o = Ve(Math.round(a / Math.max(i, 1) * 100 * 10) / 10, t.minSize, t.maxSize);
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
		let n = Ve(Number(b.current), t.minSize, t.maxSize);
		b.current = n, S.current?.(n, e);
	}, l(() => () => {
		let e = y.current;
		y.current = null, T.current?.();
		try {
			e?.pointerId !== null && e?.pointerId !== void 0 && e.divider?.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []);
	let B = (t) => {
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
	}, ee = (e, t) => {
		let n = Ve(Ve(Number(b.current), O, k) + e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: R
		}, t);
	}, V = (e, t) => {
		let n = Ve(e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: R
		}, t);
	};
	return /* @__PURE__ */ _("section", {
		...h,
		ref: v,
		className: X("cad-split-pane", `cad-split-pane--${e}`, m),
		style: {
			"--cad-split-size": `${L}%`,
			...h.style
		},
		children: [
			/* @__PURE__ */ g("div", {
				className: "cad-split-pane__primary",
				children: o
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-split-pane__divider",
				role: "separator",
				"aria-label": f,
				"aria-orientation": z,
				"aria-valuemin": O,
				"aria-valuemax": k,
				"aria-valuenow": L,
				"aria-valuetext": `${L}%`,
				tabIndex: 0,
				onPointerDown: B,
				onPointerCancel: w.current,
				onLostPointerCapture: w.current,
				onKeyDown: (t) => {
					let n = e === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"], r = e === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
					if (n.includes(t.key)) {
						t.preventDefault(), ee(N, t);
						return;
					}
					if (r.includes(t.key)) {
						t.preventDefault(), ee(-N, t);
						return;
					}
					if (t.key === "Home") {
						t.preventDefault(), V(O, t);
						return;
					}
					t.key === "End" && (t.preventDefault(), V(k, t));
				},
				children: /* @__PURE__ */ g("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-split-pane__secondary",
				children: s
			})
		]
	});
}
function gi({ item: e, open: t, onToggle: n, onAction: r, onClose: i }) {
	let a = fi(e?.items), o = `cad-menu-bar-popup-${u()}`, s = a.length > 0;
	return /* @__PURE__ */ _("div", {
		className: X("cad-menu-bar__menu", t && "cad-menu-bar__menu--open"),
		"data-menu-id": e.id,
		role: "none",
		children: [/* @__PURE__ */ _("button", {
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
			children: [Q(e), e?.shortcut && /* @__PURE__ */ g(Ue, { shortcut: e.shortcut })]
		}), t && /* @__PURE__ */ g("div", {
			id: o,
			className: "cad-menu-bar__popup",
			role: "menu",
			"aria-label": Q(e),
			children: a.map((e) => e.type === "separator" ? /* @__PURE__ */ g("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ g(_i, {
				item: e,
				onAction: r,
				onClose: i
			}, e.id))
		})]
	});
}
function _i({ item: e, onAction: t, onClose: n, className: r }) {
	let i = fi(e?.items), a = i.length > 0, [o, s] = $(void 0, !1);
	return /* @__PURE__ */ _("div", {
		className: X("cad-submenu", o && "cad-submenu--open", r),
		role: "none",
		children: [/* @__PURE__ */ _("button", {
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
				/* @__PURE__ */ g("span", {
					className: "cad-submenu__check",
					"aria-hidden": "true",
					children: e?.checked ? "✓" : ""
				}),
				/* @__PURE__ */ g("span", {
					className: "cad-submenu__label",
					children: Q(e)
				}),
				e?.shortcut && /* @__PURE__ */ g(Ue, { shortcut: e.shortcut }),
				a && /* @__PURE__ */ g("span", {
					className: "cad-submenu__caret",
					"aria-hidden": "true",
					children: "›"
				})
			]
		}), a && o && /* @__PURE__ */ g("div", {
			className: "cad-submenu__popup",
			role: "menu",
			"aria-label": Q(e),
			children: i.map((e) => e.type === "separator" ? /* @__PURE__ */ g("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ g(_i, {
				item: e,
				onAction: t,
				onClose: n
			}, e.id))
		})]
	});
}
function vi({ items: e = [], openId: t, defaultOpenId: n = "", onOpenChange: r, onAction: i, label: a = "CAD application menu", endSlot: s, endSlotLabel: c = "Application controls", className: u, ...f }) {
	let m = d(() => fi(e), [e]), [h, v] = $(t, n, (e, t, n) => r?.(e, t, n)), y = p(null), b = p(""), x = m.find((e) => e.id === h && !e.disabled && fi(e.items).length > 0), S = x?.id || "", C = o((e) => {
		!e || typeof window > "u" || window.requestAnimationFrame(() => {
			[...y.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(":scope > button:not(:disabled)")?.focus?.();
		});
	}, []), w = o((e) => {
		[...y.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(".cad-menu-bar__popup [role^=\"menuitem\"]:not(:disabled)")?.focus?.();
	}, []), T = o((e, t, n = !1) => {
		S && (v("", e || x, t), n && C(e?.id || S));
	}, [
		S,
		C,
		x,
		v
	]), E = (e, t) => {
		if (!(e?.disabled || fi(e?.items).length === 0)) {
			if (e.id === S) {
				T(e, t);
				return;
			}
			v(e.id, e, t);
		}
	};
	l(() => {
		let e = b.current;
		if (!e || e !== S || typeof window > "u") return;
		b.current = "";
		let t = window.requestAnimationFrame(() => w(e));
		return () => window.cancelAnimationFrame(t);
	}, [S, w]), l(() => {
		if (!S || typeof document > "u") return;
		let e = (e) => {
			y.current?.contains(e.target) || T(x, e);
		}, t = (e) => {
			e.defaultPrevented || e.key !== "Escape" || (e.preventDefault(), T(x, e, !0));
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t);
		};
	}, [
		S,
		T,
		x,
		v
	]);
	let D = (e, t) => {
		let n = [...e.currentTarget.querySelectorAll(":scope > .cad-menu-bar__menu > button:not(:disabled)")];
		if (!n.length) return;
		let r = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null, i = r ? n.indexOf(r) : -1, a = n[((i >= 0 ? i : Math.max(0, n.findIndex((e) => e.dataset.menuId === S))) + t + n.length) % n.length];
		a?.focus();
		let o = a?.dataset.menuId;
		o && S && v(o, m.find((e) => e.id === o), e);
	}, O = /* @__PURE__ */ g("nav", {
		...f,
		ref: y,
		className: X("cad-menu-bar", u),
		role: "menubar",
		"aria-label": a,
		onKeyDown: (e) => {
			if (f.onKeyDown?.(e), e.defaultPrevented) return;
			e.key === "ArrowRight" && (e.preventDefault(), D(e, 1)), e.key === "ArrowLeft" && (e.preventDefault(), D(e, -1)), e.key === "Escape" && S && (e.preventDefault(), T(x, e, !0));
			let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			if (e.key === "ArrowDown" && t?.dataset.menuId) {
				let n = m.find((e) => e.id === t.dataset.menuId);
				n && !n.disabled && fi(n.items).length > 0 && (e.preventDefault(), n.id === S ? window.requestAnimationFrame(() => w(n.id)) : (b.current = n.id, v(n.id, n, e)));
			}
		},
		children: m.map((e) => /* @__PURE__ */ g(gi, {
			item: e,
			open: S === e.id,
			onToggle: E,
			onAction: i,
			onClose: (t) => T(e, t, !0)
		}, e.id))
	});
	return s == null ? O : /* @__PURE__ */ _("div", {
		className: "cad-menu-bar__layout",
		children: [O, /* @__PURE__ */ g("div", {
			className: "cad-menu-bar__end-slot",
			role: "group",
			"aria-label": c,
			children: s
		})]
	});
}
function yi({ value: e, defaultValue: t = { mode: "by-layer" }, onChange: n, colors: r = li, allowByLayer: i = !0, allowByBlock: a = !0, label: o = "Color", className: s, ...c }) {
	let [l, u] = $(e, t, (e, t) => n?.(e, t)), d = pi(l), f = (e, t) => u(e, t);
	return /* @__PURE__ */ _("section", {
		...c,
		className: X("cad-color-picker", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("strong", { children: o }), /* @__PURE__ */ g(et, {
				color: d.value || (d.mode === "by-layer" ? "#b4bdc7" : "#ffffff"),
				label: mi(d)
			})] }),
			(i || a) && /* @__PURE__ */ _("div", {
				className: "cad-color-picker__modes",
				role: "group",
				"aria-label": "Color source",
				children: [i && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-pressed": d.mode === "by-layer",
					"data-active": d.mode === "by-layer" ? "true" : "false",
					onClick: (e) => f({ mode: "by-layer" }, e),
					children: "ByLayer"
				}), a && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-pressed": d.mode === "by-block",
					"data-active": d.mode === "by-block" ? "true" : "false",
					onClick: (e) => f({ mode: "by-block" }, e),
					children: "ByBlock"
				})]
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-color-picker__swatches",
				role: "group",
				"aria-label": "Indexed colors",
				children: Z(r).map((e, t) => {
					let n = typeof e == "string" ? e : e?.value || e?.hex, r = typeof e == "string" ? `Color ${t + 1}` : Q(e), i = d.mode === "rgb" && String(d.value || "").toLowerCase() === String(n || "").toLowerCase();
					return /* @__PURE__ */ g("button", {
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
			/* @__PURE__ */ _("label", {
				className: "cad-color-picker__custom",
				children: [
					/* @__PURE__ */ g("span", { children: "Custom RGB" }),
					/* @__PURE__ */ g("input", {
						type: "color",
						value: d.mode === "rgb" && d.value ? d.value : "#ffffff",
						onChange: (e) => f({
							mode: "rgb",
							value: e.target.value
						}, e)
					}),
					/* @__PURE__ */ g("output", { children: d.mode === "rgb" ? d.value : "—" })
				]
			})
		]
	});
}
function bi({ value: e, onChange: t, label: n = "Color", className: r, ...i }) {
	let a = pi(e);
	return /* @__PURE__ */ g(Ut, {
		label: n,
		className: X("cad-color-picker-button", r),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-color-picker-button__trigger",
			children: /* @__PURE__ */ g(et, {
				color: a.value || "#b4bdc7",
				label: mi(a)
			})
		}),
		content: ({ close: r }) => /* @__PURE__ */ g(yi, {
			...i,
			value: e,
			onChange: (e, n) => {
				t?.(e, n), r(n);
			},
			label: n
		})
	});
}
function xi({ linetypes: e = ui, value: t, defaultValue: n, onChange: r, label: i = "Linetype", className: a, ...o }) {
	let s = d(() => fi(e), [e]), [c, l] = $(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), u = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ g(Ut, {
		label: i,
		className: X("cad-linetype-picker", a),
		trigger: /* @__PURE__ */ _("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ g(tt, {
				type: u?.id || "continuous",
				label: u?.label
			}), /* @__PURE__ */ g("span", { children: "⌄" })]
		}),
		content: ({ close: e }) => /* @__PURE__ */ g("div", {
			...o,
			className: "cad-style-picker",
			role: "listbox",
			"aria-label": i,
			children: s.map((t) => /* @__PURE__ */ g("button", {
				type: "button",
				role: "option",
				"aria-selected": t.id === c,
				onClick: (n) => {
					l(t.id, t, n), e(n);
				},
				children: /* @__PURE__ */ g(tt, {
					type: t.id,
					label: t.label
				})
			}, t.id))
		})
	});
}
function Si({ lineweights: e = di, value: t, defaultValue: n, onChange: r, label: i = "Lineweight", className: a, ...o }) {
	let s = d(() => fi(e), [e]), [c, l] = $(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), u = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ g(Ut, {
		label: i,
		className: X("cad-lineweight-picker", a),
		trigger: /* @__PURE__ */ _("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ g(nt, {
				weight: u?.value ?? .25,
				label: u?.label
			}), /* @__PURE__ */ g("span", { children: "⌄" })]
		}),
		content: ({ close: e }) => /* @__PURE__ */ g("div", {
			...o,
			className: "cad-style-picker",
			role: "listbox",
			"aria-label": i,
			children: s.map((t) => {
				let n = Number(t.value ?? t.id), r = Number.isFinite(n) ? n : .25;
				return /* @__PURE__ */ g("button", {
					type: "button",
					role: "option",
					"aria-selected": t.id === c,
					onClick: (n) => {
						l(t.id, t, n), e(n);
					},
					children: /* @__PURE__ */ g(nt, {
						weight: r,
						label: t.label
					})
				}, t.id);
			})
		})
	});
}
function Ci({ block: e, selected: t = !1, onSelect: n, onInsert: r, onEdit: i, onDelete: a, renderThumbnail: o, className: s }) {
	let c = e || {}, l = Q(c);
	return /* @__PURE__ */ _("article", {
		className: X("cad-block-tile", t && "cad-block-tile--selected", s),
		"data-selected": t ? "true" : "false",
		role: "listitem",
		children: [/* @__PURE__ */ _("button", {
			type: "button",
			className: "cad-block-tile__select",
			"aria-pressed": t,
			onClick: (e) => n?.(c, e),
			children: [/* @__PURE__ */ g("span", {
				className: "cad-block-tile__thumbnail",
				children: o ? o(c) : c.thumbnail ? /* @__PURE__ */ g("img", {
					src: c.thumbnail,
					alt: ""
				}) : /* @__PURE__ */ g("span", {
					"aria-hidden": "true",
					children: "▧"
				})
			}), /* @__PURE__ */ _("span", {
				className: "cad-block-tile__copy",
				children: [/* @__PURE__ */ g("strong", { children: l }), c.category && /* @__PURE__ */ g("small", { children: c.category })]
			})]
		}), (r || i || a) && /* @__PURE__ */ _("footer", { children: [
			r && /* @__PURE__ */ g("button", {
				type: "button",
				onClick: (e) => r(c, e),
				children: "Insert"
			}),
			i && /* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": `Edit ${l}`,
				onClick: (e) => i(c, e),
				children: "✎"
			}),
			a && /* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": `Delete ${l}`,
				onClick: (e) => a(c, e),
				children: "×"
			})
		] })]
	});
}
function wi({ blocks: e = [], value: t, defaultValue: n = "", onChange: r, onInsert: i, onCreate: a, onEdit: o, onDelete: s, filter: c, defaultFilter: l = "", onFilterChange: f, view: p = "grid", renderThumbnail: m, title: h = "Blocks", className: v, emptyLabel: y = "No blocks match the current filter" }) {
	let b = `cad-block-filter-${u()}`, [x, S] = $(t, n, (e, t, n) => r?.(e, t, n)), [C, w] = $(c, l, (e, t) => f?.(e, t)), T = d(() => Z(e).filter((e) => `${Q(e)} ${e?.category || ""}`.toLocaleLowerCase().includes(String(C || "").toLocaleLowerCase())), [e, C]);
	return /* @__PURE__ */ _("section", {
		className: X("cad-block-palette", `cad-block-palette--${p}`, v),
		"aria-label": h,
		children: [
			/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("h2", { children: h }), a && /* @__PURE__ */ g("button", {
				type: "button",
				onClick: a,
				children: "+ New"
			})] }),
			/* @__PURE__ */ _("div", {
				className: "cad-block-palette__filter",
				children: [
					/* @__PURE__ */ g("label", {
						htmlFor: b,
						children: "Filter blocks"
					}),
					/* @__PURE__ */ g("input", {
						id: b,
						value: C ?? "",
						placeholder: "Filter blocks",
						onChange: (e) => w(e.target.value, e)
					}),
					C && /* @__PURE__ */ g("button", {
						type: "button",
						"aria-label": "Clear block filter",
						onClick: (e) => w("", e),
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-block-palette__blocks",
				role: "list",
				children: [T.map((e, t) => /* @__PURE__ */ g(Ci, {
					block: e,
					selected: e?.id === x,
					onSelect: (e, t) => S(e.id, e, t),
					onInsert: i,
					onEdit: o,
					onDelete: s,
					renderThumbnail: m
				}, e?.id || t)), !T.length && /* @__PURE__ */ g("p", { children: y })]
			})
		]
	});
}
function Ti({ value: e, defaultValue: t = {
	scale: 1,
	rotation: 0,
	uniform: !0,
	specifyOnScreen: !1,
	explode: !1
}, onChange: n, label: r = "Insert options", className: i }) {
	let [a, o] = $(e, t, (e, t, r) => n?.(e, t, r)), s = (e, t, n) => o({
		...a || {},
		[e]: t
	}, e, n);
	return /* @__PURE__ */ _("fieldset", {
		className: X("cad-block-insert-options", i),
		children: [
			/* @__PURE__ */ g("legend", { children: r }),
			/* @__PURE__ */ _("label", { children: ["Scale", /* @__PURE__ */ g("input", {
				type: "number",
				step: "0.1",
				value: a?.scale ?? 1,
				onChange: (e) => s("scale", Number(e.target.value), e)
			})] }),
			/* @__PURE__ */ _("label", { children: [
				"Rotation",
				/* @__PURE__ */ g("input", {
					type: "number",
					step: "1",
					value: a?.rotation ?? 0,
					onChange: (e) => s("rotation", Number(e.target.value), e)
				}),
				/* @__PURE__ */ g("small", { children: "°" })
			] }),
			/* @__PURE__ */ _("label", { children: [/* @__PURE__ */ g("input", {
				type: "checkbox",
				checked: !!a?.uniform,
				onChange: (e) => s("uniform", e.target.checked, e)
			}), "Uniform scale"] }),
			/* @__PURE__ */ _("label", { children: [/* @__PURE__ */ g("input", {
				type: "checkbox",
				checked: !!a?.specifyOnScreen,
				onChange: (e) => s("specifyOnScreen", e.target.checked, e)
			}), "Specify on-screen"] }),
			/* @__PURE__ */ _("label", { children: [/* @__PURE__ */ g("input", {
				type: "checkbox",
				checked: !!a?.explode,
				onChange: (e) => s("explode", e.target.checked, e)
			}), "Explode"] })
		]
	});
}
//#endregion
//#region src/CadInspectorUi.tsx
function Ei({ value: e, defaultValue: t = "", onChange: n, placeholder: r = "Filter", label: i = "Filter list", className: a, ...o }) {
	let s = u(), [c, l] = $(e, t, (e, t) => n?.(e, t));
	return /* @__PURE__ */ _("div", {
		className: X("cad-filter-bar", a),
		children: [
			/* @__PURE__ */ g("label", {
				className: "cad-filter-bar__label",
				htmlFor: `cad-filter-${s}`,
				children: i
			}),
			/* @__PURE__ */ g("input", {
				...o,
				id: `cad-filter-${s}`,
				value: c ?? "",
				placeholder: r,
				onChange: (e) => l(e.target.value, e)
			}),
			c && /* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": `Clear ${i.toLowerCase()}`,
				onClick: (e) => l("", e),
				children: "×"
			})
		]
	});
}
function Di({ property: e, value: t, onValueChange: n, inputId: r, className: i }) {
	let a = e || {}, o = a.type || "text", s = t ?? a.value ?? "", c = (e, t) => {
		a.onChange?.(e, a, t), n?.(a.id, e, a, t);
	};
	return typeof a.render == "function" ? /* @__PURE__ */ g("div", {
		className: X("cad-property-field", i),
		children: a.render({
			id: r,
			property: a,
			value: s,
			onChange: c
		})
	}) : a.readOnly || o === "readonly" ? /* @__PURE__ */ g("output", {
		className: X("cad-property-field", "cad-property-field--readonly", i),
		title: String(s),
		children: s || "—"
	}) : o === "toggle" || o === "boolean" ? /* @__PURE__ */ _("label", {
		className: X("cad-property-field", "cad-property-field--toggle", i),
		children: [/* @__PURE__ */ g("input", {
			id: r,
			type: "checkbox",
			"aria-label": a.label || a.id,
			checked: !!s,
			disabled: a.disabled,
			onChange: (e) => c(e.target.checked, e)
		}), /* @__PURE__ */ g("span", { children: s ? a.onLabel || "On" : a.offLabel || "Off" })]
	}) : o === "select" || o === "enum" ? /* @__PURE__ */ g("select", {
		id: r,
		className: X("cad-property-field", i),
		value: s,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e),
		children: Z(a.options).map((e, t) => {
			let n = typeof e == "string" || typeof e == "number" ? {
				value: e,
				label: e
			} : e;
			return /* @__PURE__ */ g("option", {
				value: n.value ?? n.id,
				children: Q(n)
			}, n.id || n.value || t);
		})
	}) : o === "color" ? /* @__PURE__ */ _("span", {
		className: X("cad-property-field", "cad-property-field--color", i),
		children: [/* @__PURE__ */ g(et, {
			color: s || "#ffffff",
			label: s || "#ffffff"
		}), /* @__PURE__ */ g("input", {
			id: r,
			type: "color",
			value: s || "#ffffff",
			disabled: a.disabled,
			onChange: (e) => c(e.target.value, e)
		})]
	}) : o === "cad-color" ? /* @__PURE__ */ g(bi, {
		value: s,
		onChange: c,
		label: a.label || a.id,
		className: X("cad-property-field", "cad-property-field--cad-color", i),
		colors: a.colors,
		allowByLayer: a.allowByLayer,
		allowByBlock: a.allowByBlock
	}) : o === "linetype" ? /* @__PURE__ */ g(xi, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: X("cad-property-field", "cad-property-field--style", i),
		linetypes: a.options
	}) : o === "lineweight" ? /* @__PURE__ */ g(Si, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: X("cad-property-field", "cad-property-field--style", i),
		lineweights: a.options
	}) : o === "scale" ? /* @__PURE__ */ g(ii, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: X("cad-property-field", "cad-property-field--style", i),
		scales: a.options
	}) : o === "number" ? /* @__PURE__ */ g(Xe, {
		id: r,
		className: X("cad-property-field", i),
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
	}) : o === "unit" ? /* @__PURE__ */ g(Ze, {
		id: r,
		className: X("cad-property-field", i),
		value: s,
		unit: a.unit,
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "angle" ? /* @__PURE__ */ g(Qe, {
		id: r,
		className: X("cad-property-field", i),
		value: s,
		unit: a.unit || "°",
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "coordinate" ? /* @__PURE__ */ g($e, {
		className: X("cad-property-field", i),
		value: s,
		axes: a.axes,
		unit: a.unit,
		disabled: a.disabled,
		onValueChange: (e) => c(e),
		label: a.label || a.id
	}) : o === "multiline" ? /* @__PURE__ */ g("textarea", {
		id: r,
		className: X("cad-property-field", "cad-property-field--multiline", i),
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	}) : /* @__PURE__ */ g("input", {
		id: r,
		className: X("cad-property-field", i),
		type: o,
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	});
}
function Oi({ property: e, value: t, onValueChange: n, className: r }) {
	let i = u(), a = e || {};
	if (a.hidden) return null;
	let o = `cad-property-${i}-${a.id || "field"}`, s = !a.readOnly && typeof a.render != "function" && ![
		"toggle",
		"boolean",
		"coordinate",
		"readonly"
	].includes(a.type || "text");
	return /* @__PURE__ */ _("div", {
		className: X("cad-property-row", a.readOnly && "cad-property-row--readonly", r),
		"data-type": a.type || "text",
		children: [s ? /* @__PURE__ */ g("label", {
			className: "cad-property-row__label",
			htmlFor: o,
			title: a.description || a.label,
			children: a.label || a.id
		}) : /* @__PURE__ */ g("span", {
			className: "cad-property-row__label",
			title: a.description || a.label,
			children: a.label || a.id
		}), /* @__PURE__ */ g(Di, {
			property: a,
			value: t,
			inputId: o,
			onValueChange: n
		})]
	});
}
function ki({ id: e, title: t, properties: n = [], collapsible: r = !0, open: i, defaultOpen: a = !0, onOpenChange: o, onValueChange: s, className: c, children: l }) {
	let d = u(), f = e || `cad-property-section-${d}`, [p, m] = $(i, a, (e, t) => o?.(e, t)), h = r ? /* @__PURE__ */ _("button", {
		type: "button",
		className: "cad-property-section__heading",
		"aria-expanded": p,
		"aria-controls": `${f}-body`,
		onClick: (e) => m(!p, e),
		children: [/* @__PURE__ */ g("span", { children: t }), /* @__PURE__ */ g("i", {
			"aria-hidden": "true",
			children: p ? "▾" : "▸"
		})]
	}) : /* @__PURE__ */ g("h3", {
		className: "cad-property-section__heading",
		children: t
	});
	return /* @__PURE__ */ _("section", {
		className: X("cad-property-section", !p && "cad-property-section--closed", c),
		children: [h, /* @__PURE__ */ g("div", {
			id: `${f}-body`,
			className: "cad-property-section__body",
			hidden: !p,
			children: l || Z(n).map((e, t) => /* @__PURE__ */ g(Oi, {
				property: e,
				onValueChange: s
			}, e?.id || t))
		})]
	});
}
function Ai({ sections: e, properties: t, onValueChange: n, label: r = "Properties", className: i, ...a }) {
	let o = Z(e).length ? Z(e) : [{
		id: "properties",
		title: r,
		properties: Z(t)
	}];
	return /* @__PURE__ */ g("section", {
		...a,
		className: X("cad-property-grid", i),
		"aria-label": r,
		children: o.map((e, t) => /* @__PURE__ */ g(ki, {
			...e,
			onValueChange: n
		}, e?.id || t))
	});
}
function ji({ layers: e = [], value: t, defaultValue: n, onChange: r, label: i = "Current layer", className: a, disabled: o = !1 }) {
	let [s, c] = $(t, n ?? Z(e)[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ _("label", {
		className: X("cad-layer-picker", a),
		children: [/* @__PURE__ */ g("span", { children: i }), /* @__PURE__ */ g("select", {
			value: s,
			disabled: o,
			onChange: (t) => {
				let n = Z(e).find((e) => e?.id === t.target.value);
				c(t.target.value, n, t);
			},
			children: Z(e).map((e, t) => /* @__PURE__ */ g("option", {
				value: e?.id,
				children: Q(e)
			}, e?.id || t))
		})]
	});
}
function Mi({ layer: e, active: t = !1, onActivate: n, onLayerChange: r, onColorClick: i, className: a }) {
	let o = e || {}, s = (e, t) => r?.(o.id, e, o, t), c = Q(o), l = (e, t, n, i) => r ? /* @__PURE__ */ g("button", {
		type: "button",
		"aria-label": e,
		"aria-pressed": t,
		"data-active": t ? "true" : "false",
		onClick: (e) => s(i, e),
		children: n
	}) : /* @__PURE__ */ g("span", {
		"aria-hidden": "true",
		"data-active": t ? "true" : "false",
		children: n
	}), u = /* @__PURE__ */ g(et, {
		color: o.color || "#ffffff",
		"aria-label": `${c} color`,
		onClick: i ? (e) => i(o, e) : void 0
	}), d = /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("strong", { children: c }), o.description && /* @__PURE__ */ g("small", { children: o.description })] });
	return /* @__PURE__ */ _("div", {
		className: X("cad-layer-row", t && "cad-layer-row--active", a),
		"data-active": t ? "true" : "false",
		role: "listitem",
		children: [
			/* @__PURE__ */ _("div", {
				className: "cad-layer-row__states",
				children: [
					l(`${c}: ${o.visible === !1 ? "show" : "hide"}`, o.visible !== !1, "◉", { visible: o.visible === !1 }),
					l(`${c}: ${o.frozen ? "thaw" : "freeze"}`, !!o.frozen, "❄", { frozen: !o.frozen }),
					l(`${c}: ${o.locked ? "unlock" : "lock"}`, !!o.locked, "⌑", { locked: !o.locked })
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-layer-row__identity",
				children: [u, n ? /* @__PURE__ */ g("button", {
					type: "button",
					className: "cad-layer-row__name",
					onClick: (e) => n(o, e),
					children: d
				}) : /* @__PURE__ */ g("span", {
					className: "cad-layer-row__name",
					children: d
				})]
			}),
			/* @__PURE__ */ g(tt, {
				type: o.linetype || "continuous",
				color: o.color || "currentColor",
				label: o.linetype
			}),
			/* @__PURE__ */ g(nt, {
				weight: o.lineweight ?? .25,
				color: o.color || "currentColor",
				label: o.lineweight ? `${o.lineweight} mm` : void 0
			})
		]
	});
}
function Ni({ layers: e = [], activeLayerId: t, onActiveLayerChange: n, onLayerChange: r, onAddLayer: i, onDeleteLayer: a, onColorClick: o, title: s = "Layers", filter: c, defaultFilter: l = "", onFilterChange: u, filterable: f = !0, className: p, emptyLabel: m = "No layers match this filter" }) {
	let [h, v] = $(c, l, (e, t) => u?.(e, t)), y = d(() => Z(e).filter((e) => Q(e).toLocaleLowerCase().includes(String(h || "").toLocaleLowerCase())), [e, h]);
	return /* @__PURE__ */ _("section", {
		className: X("cad-layer-panel", p),
		"aria-label": s,
		children: [
			/* @__PURE__ */ _("header", {
				className: "cad-layer-panel__header",
				children: [/* @__PURE__ */ g("h2", { children: s }), /* @__PURE__ */ _("span", { children: [i && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-label": "Add layer",
					onClick: i,
					children: "+"
				}), a && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-label": "Delete active layer",
					disabled: !t,
					onClick: a,
					children: "×"
				})] })]
			}),
			f && /* @__PURE__ */ g(Ei, {
				value: h,
				onChange: v,
				label: "Filter layers",
				placeholder: "Filter layers"
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-layer-panel__columns",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ g("span", { children: "State" }),
					/* @__PURE__ */ g("span", { children: "Layer" }),
					/* @__PURE__ */ g("span", { children: "Type" }),
					/* @__PURE__ */ g("span", { children: "Weight" })
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-layer-panel__rows",
				role: "list",
				children: [y.map((e, i) => /* @__PURE__ */ g(Mi, {
					layer: e,
					active: e?.id === t || e?.active,
					onActivate: n ? (e, t) => n(e.id, e, t) : void 0,
					onLayerChange: r,
					onColorClick: o
				}, e?.id || i)), !y.length && /* @__PURE__ */ g("p", {
					className: "cad-layer-panel__empty",
					children: m
				})]
			})
		]
	});
}
function Pi({ node: e, level: t, selectedId: n, expandedIds: r, onSelect: i, onExpandedChange: a }) {
	let o = e || {}, s = Z(o.children), c = s.length > 0, l = r.has(o.id), u = o.id === n, d = o.icon, f = (e) => {
		if (!c) return;
		let t = new Set(r);
		l ? t.delete(o.id) : t.add(o.id), a(t, o, e);
	};
	return /* @__PURE__ */ _("li", {
		className: "cad-object-tree__branch",
		children: [/* @__PURE__ */ _("div", {
			className: X("cad-object-tree__entry", u && "cad-object-tree__entry--selected"),
			children: [c ? /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-object-tree__expander",
				"aria-label": `${l ? "Collapse" : "Expand"} ${Q(o)}`,
				onClick: f,
				children: l ? "▾" : "▸"
			}) : /* @__PURE__ */ g("span", { className: "cad-object-tree__spacer" }), /* @__PURE__ */ _("button", {
				type: "button",
				className: "cad-object-tree__label",
				disabled: o.disabled,
				onClick: (e) => i?.(o, e),
				onKeyDown: (e) => {
					e.key === "ArrowRight" && c && !l && (e.preventDefault(), f(e)), e.key === "ArrowLeft" && c && l && (e.preventDefault(), f(e));
				},
				children: [
					d && /* @__PURE__ */ g(d, {
						size: 13,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ g("span", { children: Q(o) }),
					o.meta && /* @__PURE__ */ g("small", { children: o.meta })
				]
			})]
		}), c && l && /* @__PURE__ */ g("ul", { children: s.map((e, o) => /* @__PURE__ */ g(Pi, {
			node: e,
			level: t + 1,
			selectedId: n,
			expandedIds: r,
			onSelect: i,
			onExpandedChange: a
		}, e?.id || o)) })]
	});
}
function Fi({ nodes: e = [], selectedId: t, defaultSelectedId: n = "", onSelect: r, expandedIds: i, defaultExpandedIds: a, onExpandedChange: o, label: s = "CAD object tree", className: c, ...l }) {
	let u = a ?? Z(e).filter((e) => e?.expanded).map((e) => e.id), [d, f] = $(t, n, (e, t, n) => r?.(e, t, n)), [p, m] = $(i, u, (e, t, n) => o?.(e, t, n)), h = new Set(Z(p));
	return /* @__PURE__ */ g("ul", {
		...l,
		className: X("cad-object-tree", c),
		"aria-label": s,
		children: Z(e).map((e, t) => /* @__PURE__ */ g(Pi, {
			node: e,
			level: 1,
			selectedId: d,
			expandedIds: h,
			onSelect: (e, t) => f(e.id, e, t),
			onExpandedChange: (e, t, n) => m([...e], t, n)
		}, e?.id || t))
	});
}
function Ii({ label: e, value: t = 0, status: n, onCancel: r, className: i }) {
	let a = Math.max(0, Math.min(100, Number(t) || 0));
	return /* @__PURE__ */ _("section", {
		className: X("cad-task-progress", i),
		"aria-label": e || "Task progress",
		children: [/* @__PURE__ */ _("div", { children: [
			/* @__PURE__ */ g("strong", { children: e || "Working" }),
			/* @__PURE__ */ g("output", { children: n || `${a}%` }),
			r && /* @__PURE__ */ g("button", {
				type: "button",
				onClick: r,
				children: "Cancel"
			})
		] }), /* @__PURE__ */ _("progress", {
			value: a,
			max: "100",
			"aria-label": e || "Task progress",
			children: [a, "%"]
		})]
	});
}
function Li({ references: e = [], onReload: t, onUnload: n, className: r, title: i = "External references" }) {
	return /* @__PURE__ */ _("section", {
		className: X("cad-reference-list", r),
		"aria-label": i,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("h2", { children: i }), /* @__PURE__ */ g("span", { children: Z(e).length })] }), /* @__PURE__ */ g("ul", { children: Z(e).map((e, r) => /* @__PURE__ */ _("li", { children: [
			/* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("strong", { children: Q(e) }), /* @__PURE__ */ g("small", { children: e?.path || e?.detail })] }),
			/* @__PURE__ */ g("em", {
				"data-status": e?.status || "loaded",
				children: e?.status || "loaded"
			}),
			/* @__PURE__ */ _("span", {
				className: "cad-reference-list__actions",
				children: [t && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-label": `Reload ${Q(e)}`,
					onClick: (n) => t(e, n),
					children: "Reload"
				}), n && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-label": `Unload ${Q(e)}`,
					onClick: (t) => n(e, t),
					children: "Unload"
				})]
			})
		] }, e?.id || r)) })]
	});
}
//#endregion
//#region src/CadDataUi.tsx
var Ri = (e, t) => typeof t?.render == "function" ? t.render(e, t) : typeof t?.accessor == "function" ? t.accessor(e, t) : e?.[t?.accessor || t?.id], zi = (e, t) => {
	let n = typeof t?.sortValue == "function" ? t.sortValue(e, t) : Ri(e, t);
	return typeof n == "string" ? n.toLocaleLowerCase() : n;
};
function Bi({ columns: e = [], rows: t = [], rowId: n = (e) => e?.id, selectedIds: r, defaultSelectedIds: i = [], onSelectionChange: a, selectionMode: o = "multiple", onRowActivate: s, sort: c, defaultSort: l, onSortChange: u, caption: f = "CAD data", emptyLabel: p = "No rows to display", layout: m = "table", className: h, ...v }) {
	let y = d(() => Z(e).filter((e) => e?.id), [e]), [b, x] = $(r, i, (e, t, n) => a?.(e, t, n)), [S, C] = $(c, l, (e, t, n) => u?.(e, t, n)), w = new Set(Z(b)), T = m === "auto" || m === "cards" ? m : "table", E = d(() => {
		let e = [...Z(t)], n = y.find((e) => e.id === S?.columnId);
		if (!n || !S?.direction) return e;
		let r = S.direction === "desc" ? -1 : 1;
		return e.sort((e, t) => String(zi(e, n) ?? "").localeCompare(String(zi(t, n) ?? ""), void 0, { numeric: !0 }) * r);
	}, [
		S,
		y,
		t
	]), D = (e, t) => {
		if (o === "none") return;
		let r = typeof n == "function" ? n(e) : e?.[n], i = o === "single" ? w.has(r) ? [] : [r] : w.has(r) ? [...w].filter((e) => e !== r) : [...w, r];
		x(i, e, t);
	}, O = (e, t) => {
		if (!e.sortable) return;
		let n = S?.columnId === e.id && S.direction === "asc" ? "desc" : "asc";
		C({
			columnId: e.id,
			direction: n
		}, e, t);
	}, k = E.length > 0 && E.every((e) => w.has(typeof n == "function" ? n(e) : e?.[n]));
	return /* @__PURE__ */ g("div", {
		...v,
		className: X("cad-data-grid", h),
		"data-layout": T,
		children: /* @__PURE__ */ _("table", { children: [
			/* @__PURE__ */ g("caption", { children: f }),
			/* @__PURE__ */ g("thead", { children: /* @__PURE__ */ _("tr", { children: [o !== "none" && /* @__PURE__ */ g("th", {
				scope: "col",
				className: "cad-data-grid__selection",
				children: o === "multiple" && /* @__PURE__ */ g("input", {
					type: "checkbox",
					"aria-label": "Select all rows",
					checked: k,
					onChange: (e) => {
						let t = e.target.checked ? E.map((e) => typeof n == "function" ? n(e) : e?.[n]) : [];
						x(t, null, e);
					}
				})
			}), y.map((e) => /* @__PURE__ */ g("th", {
				scope: "col",
				style: e.width ? { width: e.width } : void 0,
				"aria-sort": S?.columnId === e.id ? S.direction === "desc" ? "descending" : "ascending" : void 0,
				children: e.sortable ? /* @__PURE__ */ _("button", {
					type: "button",
					onClick: (t) => O(e, t),
					children: [e.label || e.id, /* @__PURE__ */ g("span", {
						"aria-hidden": "true",
						children: S?.columnId === e.id ? S.direction === "desc" ? "↓" : "↑" : "↕"
					})]
				}) : e.label || e.id
			}, e.id))] }) }),
			/* @__PURE__ */ _("tbody", { children: [E.map((e, t) => {
				let r = typeof n == "function" ? n(e) : e?.[n], i = w.has(r);
				return /* @__PURE__ */ _("tr", {
					"data-selected": i ? "true" : "false",
					onDoubleClick: (t) => s?.(e, t),
					children: [o !== "none" && /* @__PURE__ */ g("td", {
						className: "cad-data-grid__selection",
						"data-column": "Select",
						children: /* @__PURE__ */ g("input", {
							type: o === "single" ? "radio" : "checkbox",
							"aria-label": `Select ${Q(e) || r || t + 1}`,
							checked: i,
							onChange: (t) => D(e, t)
						})
					}), y.map((t) => /* @__PURE__ */ g("td", {
						"data-align": t.align || "start",
						"data-column": t.label || t.id,
						children: Ri(e, t) ?? "—"
					}, t.id))]
				}, r || t);
			}), !E.length && /* @__PURE__ */ g("tr", { children: /* @__PURE__ */ g("td", {
				colSpan: y.length + (o === "none" ? 0 : 1),
				className: "cad-data-grid__empty",
				children: p
			}) })] })
		] })
	});
}
function Vi({ filters: e = [], activeIds: t, defaultActiveIds: n = [], onChange: r, label: i = "Selection filter", className: a, ...o }) {
	let [s, c] = $(t, n, (e, t, n) => r?.(e, t, n)), l = new Set(Z(s));
	return /* @__PURE__ */ _("section", {
		...o,
		className: X("cad-selection-filter", a),
		"aria-label": i,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("strong", { children: i }), /* @__PURE__ */ _("output", { children: [
			l.size,
			"/",
			Z(e).length
		] })] }), /* @__PURE__ */ g("div", {
			role: "group",
			"aria-label": i,
			children: Z(e).map((e, t) => {
				let n = e?.id || `${Q(e)}-${t}`, r = l.has(n), i = e?.icon;
				return /* @__PURE__ */ _("button", {
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
						i && /* @__PURE__ */ g(i, {
							size: 12,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ g("span", { children: Q(e) }),
						e?.count !== void 0 && /* @__PURE__ */ g("em", { children: e.count })
					]
				}, n);
			})
		})]
	});
}
function Hi({ candidates: e = [], activeId: t, defaultActiveId: n, onChange: r, onAccept: i, onCancel: a, label: o = "Selection cycle", layout: s = "strip", className: c, ...l }) {
	let u = d(() => Z(e).map((e, t) => ({
		...e,
		id: e?.id || `${Q(e)}-${t}`
	})), [e]), [f, p] = $(t, n ?? u[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), m = Math.max(0, u.findIndex((e) => e.id === f)), h = u[m], v = (e, t) => {
		if (!u.length) return;
		let n = u[(m + e + u.length) % u.length];
		p(n.id, n, t);
	};
	return u.length ? /* @__PURE__ */ _("aside", {
		...l,
		className: X("cad-selection-cycler", c),
		"data-layout": s === "auto" || s === "tiles" ? s : "strip",
		"aria-label": o,
		children: [
			/* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": "Previous candidate",
				onClick: (e) => v(-1, e),
				children: "‹"
			}),
			/* @__PURE__ */ _("output", { children: [
				/* @__PURE__ */ _("small", { children: [
					m + 1,
					" / ",
					u.length
				] }),
				/* @__PURE__ */ g("strong", { children: Q(h) }),
				h?.detail && /* @__PURE__ */ g("span", { children: h.detail })
			] }),
			/* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": "Next candidate",
				onClick: (e) => v(1, e),
				children: "›"
			}),
			i && /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-selection-cycler__accept",
				onClick: (e) => i(h, e),
				children: "Select"
			}),
			a && /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-selection-cycler__cancel",
				"aria-label": "Cancel selection cycle",
				onClick: a,
				children: "×"
			})
		]
	}) : null;
}
function Ui({ title: e = "Quick properties", properties: t, sections: n, onValueChange: r, onPinChange: i, pinned: a = !1, onClose: o, className: s, ...c }) {
	return /* @__PURE__ */ _("aside", {
		...c,
		className: X("cad-quick-properties", s),
		"aria-label": e,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("h2", { children: e }), /* @__PURE__ */ _("span", { children: [i && /* @__PURE__ */ g("button", {
			type: "button",
			"aria-label": `${a ? "Unpin" : "Pin"} ${e}`,
			"aria-pressed": a,
			onClick: (e) => i(!a, e),
			children: "⌖"
		}), o && /* @__PURE__ */ g("button", {
			type: "button",
			"aria-label": `Close ${e}`,
			onClick: o,
			children: "×"
		})] })] }), /* @__PURE__ */ g(Ai, {
			properties: t,
			sections: n,
			onValueChange: r,
			label: e
		})]
	});
}
//#endregion
//#region src/CadWorkspacePreset.ts
var Wi = "cad-cui-workspace-preset", Gi = 1, Ki = Object.freeze({
	INVALID_INPUT: "invalid-input",
	INVALID_JSON: "invalid-json",
	INVALID_PRESET: "invalid-preset",
	UNSUPPORTED_SCHEMA: "unsupported-schema",
	UNSUPPORTED_VERSION: "unsupported-version",
	INVALID_FIELD: "invalid-field",
	UNSAFE_KEY: "unsafe-key",
	NORMALIZATION_FAILED: "normalization-failed"
}), qi = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]), Ji = Symbol("omit"), Yi = (e) => P(e) && (Object.getPrototypeOf(e) === Object.prototype || Object.getPrototypeOf(e) === null), Xi = (e) => !qi.has(e), Zi = (e) => e instanceof Map ? Object.fromEntries(e.entries()) : P(e) ? e : {}, Qi = (e, t) => N(e).replace(/\s+/g, " ").slice(0, 80) || t, $i = (e) => N(e).slice(0, 400), ea = (e) => N(e).toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80), ta = (e, t) => Number.isSafeInteger(e) && e > 0 ? e : t, na = (e) => {
	let t = Zi(e), n = $i(t.schema) || "cad-cui-workspace-preset", r = ta(t.version, 1), i = Qi(t.defaultName, "Workspace"), a = typeof t.normalizePanelPreferences == "function" ? t.normalizePanelPreferences : typeof t.panelPreferenceNormalizer == "function" ? t.panelPreferenceNormalizer : void 0;
	return {
		schema: n,
		version: r,
		defaultName: i,
		panels: t.panels ?? t.panelDefinitions ?? [],
		panelNormalizer: a
	};
}, ra = (e) => {
	let t = N(e);
	return !t || Number.isNaN(Date.parse(t)) ? "" : new Date(t).toISOString();
};
function ia(e, t = /* @__PURE__ */ new Set()) {
	if (e === null || typeof e == "string" || typeof e == "boolean") return e;
	if (typeof e == "number") return Number.isFinite(e) ? e : Ji;
	if (typeof e != "object" || t.has(e)) return Ji;
	if (Array.isArray(e)) {
		let n = new Set(t);
		return n.add(e), e.map((e) => {
			let t = ia(e, n);
			return t === Ji ? null : t;
		});
	}
	if (!Yi(e)) return Ji;
	let n = new Set(t);
	return n.add(e), Object.keys(e).sort().reduce((t, r) => {
		if (!Xi(r)) return t;
		let i = ia(e[r], n);
		return i !== Ji && (t[r] = i), t;
	}, {});
}
var aa = (e) => {
	let t = ia(Zi(e));
	return Yi(t) ? t : {};
}, oa = (e) => e.panels ?? e.panelPreferences ?? e.preferences ?? {}, sa = (e) => e.settings ?? e.ui ?? e.state ?? {}, ca = (e, t) => {
	if (!t.panelNormalizer) return aa(e);
	try {
		return aa(t.panelNormalizer(t.panels, e));
	} catch {
		return aa(e);
	}
}, la = (e, t) => {
	let n = Zi(e), r = ea(n.id ?? n.presetId), i = $i(n.description), a = ra(n.savedAt ?? n.updatedAt), o = {
		schema: t.schema,
		version: t.version,
		name: Qi(n.name ?? n.label, t.defaultName),
		panels: ca(oa(n), t),
		settings: aa(sa(n)),
		metadata: aa(n.metadata)
	};
	return r && (o.id = r), i && (o.description = i), a && (o.savedAt = a), o;
}, ua = (e, t, n) => ({
	code: e,
	message: t,
	...n ? { path: n } : {}
}), da = (e, t = "$", n = /* @__PURE__ */ new Set(), r = []) => {
	if (typeof e != "object" || !e || n.has(e)) return r;
	let i = new Set(n);
	return i.add(e), Array.isArray(e) ? (e.forEach((e, n) => da(e, `${t}[${n}]`, i, r)), r) : (Object.keys(e).forEach((n) => {
		let a = `${t}.${n}`;
		if (!Xi(n)) {
			r.push(ua(Ki.UNSAFE_KEY, `Preset key "${n}" is not allowed.`, a));
			return;
		}
		da(e[n], a, i, r);
	}), r);
}, fa = (e) => [
	"panels",
	"settings",
	"metadata"
].reduce((t, n) => (e[n] !== void 0 && !P(e[n]) && t.push(ua(Ki.INVALID_FIELD, `Preset field "${n}" must be an object.`, `$.${n}`)), t), []);
function pa(e = {}, t = {}) {
	return la(e, na(t));
}
var ma = pa;
function ha(e = {}, t = {}) {
	return pa(e, t);
}
function ga(e, t = {}) {
	let n = na(t);
	if (!P(e)) return {
		ok: !1,
		preset: void 0,
		errors: [ua(Ki.INVALID_PRESET, "A workspace preset must be a JSON object.", "$")]
	};
	let r = [];
	if (e.schema !== n.schema && r.push(ua(Ki.UNSUPPORTED_SCHEMA, `Expected preset schema "${n.schema}".`, "$.schema")), (!Number.isSafeInteger(e.version) || e.version !== n.version) && r.push(ua(Ki.UNSUPPORTED_VERSION, `Expected preset version ${n.version}.`, "$.version")), e.name !== void 0 && typeof e.name != "string" && r.push(ua(Ki.INVALID_FIELD, "Preset field \"name\" must be a string.", "$.name")), e.id !== void 0 && typeof e.id != "string" && r.push(ua(Ki.INVALID_FIELD, "Preset field \"id\" must be a string.", "$.id")), e.description !== void 0 && typeof e.description != "string" && r.push(ua(Ki.INVALID_FIELD, "Preset field \"description\" must be a string.", "$.description")), e.savedAt !== void 0 && (!ra(e.savedAt) || typeof e.savedAt != "string") && r.push(ua(Ki.INVALID_FIELD, "Preset field \"savedAt\" must be a valid ISO date string.", "$.savedAt")), r.push(...fa(e), ...da(e)), r.length) return {
		ok: !1,
		preset: void 0,
		errors: r
	};
	try {
		return {
			ok: !0,
			preset: la(e, n),
			errors: []
		};
	} catch {
		return {
			ok: !1,
			preset: void 0,
			errors: [ua(Ki.NORMALIZATION_FAILED, "The workspace preset could not be normalized.")]
		};
	}
}
function _a(e = {}, t = {}) {
	let n = ga(la(e, na(t)), t);
	if (!n.ok) return {
		...n,
		json: void 0
	};
	let r = Zi(t), i = r.pretty === !1 ? 0 : Math.max(0, Math.min(10, Number.isFinite(r.space) ? Math.floor(r.space) : 2));
	try {
		return {
			ok: !0,
			preset: n.preset,
			json: JSON.stringify(n.preset, null, i),
			errors: []
		};
	} catch {
		return {
			ok: !1,
			preset: void 0,
			json: void 0,
			errors: [ua(Ki.NORMALIZATION_FAILED, "The workspace preset could not be serialized.")]
		};
	}
}
function va(e, t = {}) {
	if (typeof e == "string") try {
		return ga(JSON.parse(e.replace(/^\uFEFF/, "")), t);
	} catch {
		return {
			ok: !1,
			preset: void 0,
			errors: [ua(Ki.INVALID_JSON, "The workspace preset is not valid JSON.")]
		};
	}
	return P(e) ? ga(e, t) : {
		ok: !1,
		preset: void 0,
		errors: [ua(Ki.INVALID_INPUT, "Provide a preset JSON string or parsed object.")]
	};
}
//#endregion
//#region src/CadWorkspacePresetUi.tsx
var ya = (e) => String(e ?? ""), ba = Object.freeze({
	SELECT: "select",
	DRAFT_NAME_CHANGE: "draft-name-change",
	SAVE_AS: "save-as",
	LOAD: "load",
	OVERWRITE: "overwrite",
	DELETE: "delete",
	EXPORT: "export",
	IMPORT: "import"
}), xa = (e) => Array.isArray(e) ? e : Array.isArray(e?.presets) ? e.presets : [];
function Sa(e = []) {
	let t = /* @__PURE__ */ new Set();
	return xa(e).reduce((e, n, r) => {
		let i = typeof n == "string" || typeof n == "number" ? {
			id: String(n),
			name: String(n)
		} : n;
		if (!P(i)) return e;
		let a = N(i.id ?? i.key) || `preset-${r + 1}`;
		if (t.has(a)) return e;
		t.add(a);
		let o = N(i.name ?? i.label ?? i.title) || `Preset ${e.length + 1}`, s = !!(i.readOnly ?? i.locked ?? i.protected ?? i.system), c = !!i.disabled;
		return e.push({
			...i,
			id: a,
			name: o,
			description: N(i.description ?? i.detail),
			disabled: c,
			readOnly: s,
			canOverwrite: !c && (i.canOverwrite === void 0 ? !s : !!i.canOverwrite),
			canDelete: !c && (i.canDelete === void 0 ? !s : !!i.canDelete)
		}), e;
	}, []);
}
function Ca(e = [], t) {
	let n = N(t);
	return n ? Sa(e).find((e) => e.id === n) : void 0;
}
function wa(e = [], t, { exceptId: n } = {}) {
	let r = N(t).toLocaleLowerCase(), i = N(n);
	return !!r && Sa(e).some((e) => e.id !== i && e.name.toLocaleLowerCase() === r);
}
var Ta = (e) => e === "error" || e === "warning" ? "alert" : "status";
function Ea({ presets: e = [], selectedPresetId: t = "", draftName: n = "", onSelectedPresetIdChange: r, onDraftNameChange: i, onSaveAs: a, onLoad: s, onOverwrite: c, onDelete: l, onExport: f, onImport: p, onAction: m, title: v = "Workspace presets", description: y = "Save, restore and exchange workspace arrangements.", presetListLabel: b = "Saved presets", draftNameLabel: x = "Preset name", draftNamePlaceholder: S = "e.g. Focused drafting", saveAsLabel: C = "Save as", loadLabel: w = "Load", overwriteLabel: T = "Overwrite", deleteLabel: E = "Delete", exportLabel: D = "Export", importLabel: O = "Import", selectedLabel: k = "Selected preset", noSelectionLabel: A = "Choose a saved preset", emptyLabel: j = "No saved presets yet.", emptyStateGuideLabel: M = "First preset checklist", emptyStateGuideSteps: P, duplicateNameLabel: F = "A preset with this name already exists.", readOnlyLabel: I = "Protected preset", importDescription: L = "The host chooses a file and validates its contents.", status: R, statusTone: z = "neutral", busy: B = !1, disabled: ee = !1, allowDuplicateNames: V = !1, maxNameLength: H = 64, className: U, children: te, ...W }) {
	let G = u(), ne = `cad-workspace-preset-manager-${G}-title`, re = `cad-workspace-preset-manager-${G}-description`, K = `cad-workspace-preset-manager-${G}-name`, q = `cad-workspace-preset-manager-${G}-list`, J = `cad-workspace-preset-manager-${G}-status`, ie = d(() => Sa(e), [e]), Y = ie.length > 0, ae = N(t), oe = d(() => ie.find((e) => e.id === ae), [ie, ae]), se = N(n), ce = d(() => [
		"Name the current workspace below.",
		`Choose ${C} to store it.`,
		`Later, choose it from ${b} and select ${w}.`
	], [
		w,
		b,
		C
	]), le = d(() => {
		let e = Array.isArray(P) ? P.map((e) => N(e)).filter(Boolean) : [];
		return e.length ? e : ce;
	}, [ce, P]), ue = N(M) || "First preset checklist", de = !V && wa(ie, se), fe = !!(ee || B), pe = !fe && Y && typeof r == "function", me = !fe && typeof i == "function", he = !fe && !!se && !de && typeof a == "function", ge = !fe && !!oe && !oe.disabled && typeof s == "function", _e = !fe && !!oe?.canOverwrite && typeof c == "function", ve = !fe && !!oe?.canDelete && typeof l == "function", ye = !fe && Y && typeof f == "function", be = !fe && typeof p == "function", xe = o((e, t, n = {}) => {
		let r = {
			type: e,
			source: "workspace-preset-manager",
			presets: ie,
			selectedPresetId: oe?.id || "",
			preset: oe,
			name: se,
			...n
		};
		return m?.(r, t), r;
	}, [
		se,
		ie,
		m,
		oe
	]), Se = o((e) => {
		let t = e.target.value, n = xe(ba.DRAFT_NAME_CHANGE, e, { name: N(t) });
		i?.(t, n, e);
	}, [i, xe]), Ce = o((e) => {
		let t = N(e.target.value), n = ie.find((e) => e.id === t), i = xe(ba.SELECT, e, {
			selectedPresetId: t,
			preset: n
		});
		r?.(t, n, i, e);
	}, [
		ie,
		r,
		xe
	]), we = o((e) => {
		if (e.preventDefault(), !he) return;
		let t = xe(ba.SAVE_AS, e);
		a?.(t, e);
	}, [
		he,
		a,
		xe
	]), Te = o((e) => {
		if (!ge) return;
		let t = xe(ba.LOAD, e);
		s?.(t, e);
	}, [
		ge,
		s,
		xe
	]), Ee = o((e) => {
		if (!_e) return;
		let t = xe(ba.OVERWRITE, e);
		c?.(t, e);
	}, [
		_e,
		c,
		xe
	]), De = o((e) => {
		if (!ve) return;
		let t = xe(ba.DELETE, e);
		l?.(t, e);
	}, [
		ve,
		l,
		xe
	]), Oe = o((e) => {
		if (!ye) return;
		let t = xe(ba.EXPORT, e);
		f?.(t, e);
	}, [
		ye,
		f,
		xe
	]), ke = o((e) => {
		if (!be) return;
		let t = xe(ba.IMPORT, e);
		p?.(t, e);
	}, [
		be,
		p,
		xe
	]), Ae = [y ? re : "", R ? J : ""].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ _("section", {
		...W,
		className: X("cad-workspace-preset-manager", U),
		"aria-labelledby": ne,
		"aria-describedby": Ae,
		"data-busy": B ? "true" : "false",
		"data-has-presets": Y ? "true" : "false",
		"data-selected-preset-id": oe?.id || void 0,
		children: [
			/* @__PURE__ */ _("header", {
				className: "cad-workspace-preset-manager__header",
				children: [
					/* @__PURE__ */ g("span", {
						className: "cad-workspace-preset-manager__eyebrow",
						"aria-hidden": "true",
						children: "WORKSPACE / PRESETS"
					}),
					/* @__PURE__ */ g("h2", {
						id: ne,
						children: v
					}),
					y && /* @__PURE__ */ g("p", {
						id: re,
						className: "cad-workspace-preset-manager__description",
						children: y
					})
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-workspace-preset-manager__saved",
				children: [
					/* @__PURE__ */ g("label", {
						htmlFor: q,
						children: b
					}),
					/* @__PURE__ */ _("select", {
						id: q,
						className: "cad-workspace-preset-manager__list",
						value: oe?.id || "",
						disabled: !pe,
						onChange: Ce,
						children: [/* @__PURE__ */ g("option", {
							value: "",
							children: A
						}), ie.map((e) => /* @__PURE__ */ _("option", {
							value: e.id,
							disabled: e.disabled,
							children: [e.name, e.readOnly ? " · protected" : ""]
						}, e.id))]
					}),
					!Y && /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("p", {
						className: "cad-workspace-preset-manager__empty",
						role: "status",
						children: j
					}), /* @__PURE__ */ g("ol", {
						className: "cad-workspace-preset-manager__empty cad-workspace-preset-manager__empty-guide",
						"aria-label": ue,
						children: le.map((e, t) => /* @__PURE__ */ g("li", { children: e }, `${t}-${e}`))
					})] })
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-workspace-preset-manager__selection",
				"aria-live": "polite",
				children: [/* @__PURE__ */ g("span", {
					className: "cad-workspace-preset-manager__selection-label",
					children: k
				}), oe ? /* @__PURE__ */ _("div", {
					className: "cad-workspace-preset-manager__selection-copy",
					children: [
						/* @__PURE__ */ g("strong", { children: oe.name }),
						oe.description && /* @__PURE__ */ g("small", { children: oe.description }),
						oe.readOnly && /* @__PURE__ */ g("small", {
							className: "cad-workspace-preset-manager__protected",
							children: I
						})
					]
				}) : /* @__PURE__ */ g("span", {
					className: "cad-workspace-preset-manager__selection-empty",
					children: A
				})]
			}),
			/* @__PURE__ */ _("form", {
				className: "cad-workspace-preset-manager__save",
				onSubmit: we,
				children: [
					/* @__PURE__ */ g("label", {
						htmlFor: K,
						children: x
					}),
					/* @__PURE__ */ _("div", {
						className: "cad-workspace-preset-manager__save-controls",
						children: [/* @__PURE__ */ g("input", {
							id: K,
							value: ya(n),
							maxLength: H,
							placeholder: S,
							disabled: !me,
							"aria-invalid": de || void 0,
							"aria-describedby": de ? `${K}-duplicate` : void 0,
							onChange: Se
						}), /* @__PURE__ */ g("button", {
							type: "submit",
							disabled: !he,
							"aria-label": `${C} ${se || x}`,
							children: C
						})]
					}),
					de && /* @__PURE__ */ g("p", {
						id: `${K}-duplicate`,
						className: "cad-workspace-preset-manager__validation",
						role: "alert",
						children: F
					})
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-workspace-preset-manager__actions",
				"aria-label": "Selected preset actions",
				children: [
					/* @__PURE__ */ g("button", {
						type: "button",
						disabled: !ge,
						onClick: Te,
						children: w
					}),
					/* @__PURE__ */ g("button", {
						type: "button",
						disabled: !_e,
						onClick: Ee,
						children: T
					}),
					/* @__PURE__ */ g("button", {
						type: "button",
						disabled: !ve,
						onClick: De,
						children: E
					})
				]
			}),
			/* @__PURE__ */ _("footer", {
				className: "cad-workspace-preset-manager__transfer",
				children: [
					/* @__PURE__ */ g("button", {
						type: "button",
						disabled: !ye,
						onClick: Oe,
						children: D
					}),
					/* @__PURE__ */ g("button", {
						type: "button",
						disabled: !be,
						onClick: ke,
						children: O
					}),
					L && /* @__PURE__ */ g("small", { children: L })
				]
			}),
			R && /* @__PURE__ */ g("p", {
				id: J,
				className: "cad-workspace-preset-manager__status",
				"data-tone": z,
				role: Ta(z),
				children: R
			}),
			te
		]
	});
}
var Da = Ea, Oa = (e, t) => N(e?.id ?? e?.key) || `control-${t + 1}`, ka = (e, t) => N(e?.ariaLabel ?? e?.accessibleLabel ?? Q(e)) || `Workspace control ${t + 1}`, Aa = (e) => e?.active !== void 0 || e?.pressed !== void 0, ja = (e) => !!(e?.active ?? e?.pressed), Ma = (t, n) => e.isValidElement(t?.icon) ? t.icon : typeof t?.icon == "function" ? e.createElement(t.icon, {
	size: 14,
	"aria-hidden": !0
}) : t?.icon !== void 0 && t?.icon !== null && t.icon !== "" ? t.icon : /* @__PURE__ */ g("span", {
	className: "cad-workspace-chrome-controls__fallback-icon",
	"aria-hidden": "true",
	children: n.slice(0, 1)
}), Na = i(function({ items: e = [], label: t = "Workspace controls", onItemClick: n, className: r, style: i, role: a = "group", ...o }, s) {
	let c = d(() => Z(e).filter((e) => e && typeof e == "object").map((e, t) => ({
		item: e,
		index: t,
		id: Oa(e, t),
		accessibleLabel: ka(e, t),
		activeState: ja(e),
		mode: N(e.mode),
		shortcut: N(e.shortcut),
		toggle: Aa(e)
	})), [e]);
	return /* @__PURE__ */ g("div", {
		...o,
		ref: s,
		role: a,
		"aria-label": o["aria-label"] || t,
		className: X("cad-workspace-chrome-controls", r),
		style: i,
		children: c.map((e) => {
			let { item: t, index: r, id: i, accessibleLabel: a, activeState: o, mode: s, shortcut: c, toggle: l } = e, u = N(t.title) || [a, c].filter(Boolean).join(" · "), d = {
				id: i,
				index: r,
				label: a,
				active: o,
				mode: s || void 0,
				shortcut: c || void 0,
				source: "workspace-chrome"
			};
			return /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-workspace-chrome-controls__item",
				"data-control-id": i,
				"data-active": o ? "true" : "false",
				"data-mode": s || void 0,
				"data-disabled": t.disabled ? "true" : "false",
				"data-shortcut": c || void 0,
				style: t.color ? { "--cad-workspace-chrome-item-accent": t.color } : void 0,
				"aria-label": a,
				"aria-pressed": l ? o : void 0,
				"aria-keyshortcuts": c || void 0,
				title: u || void 0,
				disabled: !!t.disabled,
				onClick: (e) => {
					t.disabled || (t.onClick?.(t, d, e), n?.(t, d, e));
				},
				children: /* @__PURE__ */ g("span", {
					className: "cad-workspace-chrome-controls__icon",
					"aria-hidden": "true",
					children: Ma(t, a)
				})
			}, i);
		})
	});
});
Na.displayName = "CadWorkspaceChromeControls";
//#endregion
export { W as CAD_CUI_RUNTIME_VERSION, Dr as CAD_WORKSPACE_DOCK_MODES, Zn as CAD_WORKSPACE_MODEL_ID, Tn as CAD_WORKSPACE_PANEL_ACTIONS, wn as CAD_WORKSPACE_PANEL_DOCK_ZONES, Cn as CAD_WORKSPACE_PANEL_PLACEMENTS, ba as CAD_WORKSPACE_PRESET_ACTIONS, Ki as CAD_WORKSPACE_PRESET_ERROR_CODES, Wi as CAD_WORKSPACE_PRESET_SCHEMA, Gi as CAD_WORKSPACE_PRESET_VERSION, D as CadActionButton, Qe as CadAngleInput, ii as CadAnnotationScalePicker, Ti as CadBlockInsertOptions, wi as CadBlockPalette, Ci as CadBlockTile, yi as CadColorPicker, bi as CadColorPickerButton, et as CadColorSwatch, _r as CadCommandHistory, br as CadCommandLine, vr as CadCommandOptions, Kt as CadCommandPrompt, on as CadCompactWorkspaceRibbon, Bt as CadConfirmDialog, ri as CadConstraintBar, ot as CadContextMenuPopup, $e as CadCoordinateInput, ze as CadCuiCommandPalette, Re as CadCuiContextMenu, Be as CadCuiCustomizer, Ae as CadCuiProvider, Le as CadCuiQuickAccess, Ie as CadCuiRibbon, Bi as CadDataGrid, k as CadDataRow, zt as CadDialog, fr as CadDockPanel, pr as CadDockTabs, ur as CadDocumentTabs, cr as CadDrawingSpaceTabs, ei as CadDynamicInput, M as CadEmptyState, Ei as CadFilterBar, ni as CadGripToolbar, O as CadIconButton, Ni as CadLayerPanel, ji as CadLayerPicker, Mi as CadLayerRow, lr as CadLayoutTabs, xi as CadLinetypePicker, tt as CadLinetypePreview, Si as CadLineweightPicker, nt as CadLineweightPreview, Er as CadMeasureReadout, at as CadMenu, vi as CadMenuBar, it as CadMenuItem, rt as CadMenuSeparator, Rt as CadMovableOverlay, pn as CadNavigationBar, Xe as CadNumericInput, si as CadObjectSnapMarker, ti as CadObjectSnapMenu, Fi as CadObjectTree, ct as CadOverflowMenu, j as CadPanelFooter, w as CadPanelHeader, T as CadPanelSection, C as CadPanelShell, oi as CadPolarTracker, Ut as CadPopover, Di as CadPropertyField, Ai as CadPropertyGrid, Oi as CadPropertyRow, ki as CadPropertySection, Ui as CadQuickProperties, st as CadRadialMenu, Li as CadReferenceList, E as CadSegmentTabs, Hi as CadSelectionCycler, Vi as CadSelectionFilter, ci as CadSelectionGrip, gn as CadSelectionSetPanel, Tr as CadSelectionSummary, Ue as CadShortcutHint, Gt as CadShortcutReference, Ke as CadSplitButton, hi as CadSplitPane, A as CadStatGrid, gr as CadStatusBar, mr as CadStatusToggle, _i as CadSubmenu, Ii as CadTaskProgress, Vt as CadToast, Ht as CadToastStack, Ge as CadToggleButton, We as CadToolButton, Ye as CadToolPalette, Je as CadToolbar, qe as CadToolbarGroup, Wt as CadTooltip, Sr as CadUcsIndicator, Ze as CadUnitInput, xr as CadViewCube, ai as CadViewPresetPicker, wr as CadViewportControls, hn as CadViewportScalePicker, mn as CadVisualStylePicker, Na as CadWorkspaceChromeControls, Vr as CadWorkspaceDockModeControl, Kr as CadWorkspaceDockRail, Hr as CadWorkspaceDockResizeHandle, qr as CadWorkspaceDockZone, Xn as CadWorkspaceFocusToggle, Kn as CadWorkspacePanelManager, qn as CadWorkspacePanelPreferences, Ea as CadWorkspacePresetManager, Da as CadWorkspacePresetPanel, dr as CadWorkspaceProfileTabs, wt as CadWorkspaceRibbon, _e as DEFAULT_CAD_CUI_SYSTEM, Bn as createCadWorkspacePanelPreferencesKey, ma as createCadWorkspacePreset, pa as createCadWorkspacePresetSnapshot, nr as createCadWorkspaceProfile, ge as defineCadCuiSystem, _a as exportCadWorkspacePreset, Pn as getCadWorkspacePanelPreference, Ca as getCadWorkspacePreset, Fn as groupCadWorkspacePanelsByDockZone, bt as groupCadWorkspaceRibbonCommands, va as importCadWorkspacePreset, wa as isCadWorkspacePresetNameTaken, Te as loadCadCuiState, ee as matchesCadSelection, tr as nextCadWorkspaceLayoutName, z as normalizeCadSelection, B as normalizeCadSelectionRule, Dn as normalizeCadWorkspacePanelDockZone, En as normalizeCadWorkspacePanelPlacement, Nn as normalizeCadWorkspacePanelPreferences, jn as normalizeCadWorkspacePanels, ha as normalizeCadWorkspacePreset, Sa as normalizeCadWorkspacePresets, er as normalizeCadWorkspaceProfiles, ir as removeCadWorkspaceProfile, rr as renameCadWorkspaceProfile, zn as resetCadWorkspacePanelPreferences, nn as resolveCadCompactWorkspaceRibbonGroups, xe as resolveCadCuiCommand, Se as resolveCadCuiCommandState, we as sanitizeCadCuiState, Ee as saveCadCuiState, Oe as selectCadCuiCommandGroups, De as selectCadCuiCommands, pe as shouldHandleCadShortcut, Rn as updateCadWorkspacePanelPreference, je as useCadCui, Me as useCadCuiCommand, Ne as useCadSelectionActions, Br as useCadWorkspaceDock, Wr as useCadWorkspaceDockRail, Yn as useCadWorkspaceFocus, Vn as useCadWorkspacePanelPreferences, ga as validateCadWorkspacePreset };
