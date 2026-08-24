import e, { cloneElement as t, createContext as n, createElement as r, forwardRef as i, isValidElement as a, useCallback as o, useContext as s, useDeferredValue as c, useEffect as l, useId as u, useMemo as d, useReducer as f, useRef as p, useState as m } from "react";
import { Fragment as h, jsx as g, jsxs as _ } from "react/jsx-runtime";
import { useLocation as v, useNavigate as y } from "react-router-dom";
//#region src/GraphCadUi.jsx
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
//#region src/CadCuiRuntime.jsx
var N = Object.freeze([]), P = Object.freeze({}), F = n(null), I = 1, L = (e) => String(e ?? "").trim(), R = (e) => [...new Set((Array.isArray(e) ? e : N).map(L).filter(Boolean))], z = (e) => ({
	id: L(e?.id),
	label: L(e?.label) || L(e?.id),
	detail: L(e?.detail),
	color: L(e?.color)
}), ee = (e) => Object.freeze({ ...e && typeof e == "object" ? e : P }), B = (e, t) => !!(e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, t)), V = (e) => e ?? "", H = (e) => Object.freeze({
	surface: L(e?.surface),
	tab: L(e?.tab),
	menu: L(e?.menu),
	group: L(e?.group),
	groupId: L(e?.groupId),
	control: L(e?.control),
	label: L(e?.label),
	detail: L(e?.detail),
	icon: L(e?.icon),
	tone: L(e?.tone),
	badge: V(e?.badge),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), te = (e) => ({
	id: L(e?.id),
	label: L(e?.label) || L(e?.id),
	detail: L(e?.detail || e?.description),
	icon: L(e?.icon),
	tone: L(e?.tone) || "cyan",
	surface: L(e?.surface),
	tab: L(e?.tab),
	menu: L(e?.menu),
	control: L(e?.control),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), U = (e) => !e || typeof e != "object" || Object.isFrozen(e) ? e : (Object.freeze(e), Object.values(e).forEach(U), e), W = (e, t) => Array.isArray(e) ? e.includes(t) : !!e?.[t], ne = (e) => e instanceof HTMLElement && !!e.closest("input, textarea, select, [contenteditable=\"true\"]"), re = (e) => {
	let t = L(e.key).toUpperCase();
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
}, G = (e) => L(e).toUpperCase().replace(/CMD|COMMAND/g, "CTRL").replace(/\s+/g, "");
function K(e = P) {
	let t = (Array.isArray(e.commands) ? e.commands : N).map((e) => ({
		id: L(e?.id),
		label: L(e?.label),
		detail: L(e?.detail || e?.description),
		icon: L(e?.icon),
		tone: L(e?.tone) || "cyan",
		toolId: L(e?.toolId),
		shortcut: L(e?.shortcut),
		requires: R(e?.requires),
		customizable: e?.customizable !== !1,
		alwaysVisible: !!e?.alwaysVisible,
		disabled: !!e?.disabled,
		active: !!e?.active,
		badge: V(e?.badge),
		intent: ee(e?.intent),
		placements: (Array.isArray(e?.placements) ? e.placements : N).map(H)
	})).filter((e) => e.id && e.label), n = new Set(t.map((e) => e.id)), r = (Array.isArray(e.tabs) ? e.tabs : N).map((e) => ({
		id: L(e?.id),
		label: L(e?.label) || L(e?.id),
		color: L(e?.color) || "#00fbfb",
		tone: L(e?.tone) || "cyan"
	})).filter((e) => e.id), i = /* @__PURE__ */ new Set(), a = (Array.isArray(e.groups) ? e.groups : N).map(te).filter((e) => !e.id || i.has(e.id) ? !1 : (i.add(e.id), !0)), o = e.calibration && typeof e.calibration == "object" ? e.calibration : P, s = (Array.isArray(o.accentModes) ? o.accentModes : N).map(z).filter((e) => e.id), c = (Array.isArray(o.densities) ? o.densities : N).map(z).filter((e) => e.id), l = (Array.isArray(o.details) ? o.details : N).map(z).filter((e) => e.id), u = (Array.isArray(e.panels) ? e.panels : N).map((e) => ({
		...e,
		id: L(e?.id),
		title: L(e?.title) || L(e?.id)
	})).filter((e) => e.id), d = e.defaults && typeof e.defaults == "object" ? e.defaults : P, f = {
		version: Number(e.version) || 1,
		activeTab: r.some((e) => e.id === d.activeTab) ? d.activeTab : r[0]?.id || "",
		hiddenCommandIds: R(d.hiddenCommandIds).filter((e) => n.has(e)),
		accentMode: s.some((e) => e.id === d.accentMode) ? d.accentMode : s[0]?.id || "",
		density: c.some((e) => e.id === d.density) ? d.density : c[0]?.id || "",
		detail: l.some((e) => e.id === d.detail) ? d.detail : l[0]?.id || "",
		quickAccessIds: R(d.quickAccessIds).filter((e) => n.has(e)),
		recentCommandIds: N,
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
	return U({
		id: L(e.id) || "cad-cui",
		version: Number(e.version) || 1,
		storageKey: L(e.storageKey) || "cad-cui-preferences:v1",
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
var ie = K({ id: "cad-cui-default" }), ae = (e) => new Map(e.commands.map((e) => [e.id, e])), q = (e, t) => e.some((e) => e.id === t), oe = (e, t) => {
	let n = typeof e == "function" ? e(t) : e instanceof Map ? e.get(t?.id) : e?.[t?.id];
	return n && typeof n == "object" ? n : P;
};
function se(e, { state: t = P, capabilities: n = P, commandStates: r = P, placement: i = e?.placement } = P) {
	if (!e) return null;
	let a = oe(r, e), o = new Set(t?.hiddenCommandIds || N), s = Array.isArray(e.requires) ? e.requires : N, c = (e.alwaysVisible || !o.has(e.id)) && s.every((e) => W(n, e)) && a.visible !== !1, l = !!(e.disabled || a.disabled || a.enabled === !1), u = B(a, "active") ? !!a.active : !!e.active, d = B(a, "badge") ? V(a.badge) : B(i, "badge") && i.badge !== "" ? i.badge : e.badge;
	return {
		...e,
		placement: i,
		visible: c,
		disabled: l,
		active: u,
		badge: d
	};
}
var ce = se, le = (e, t) => ({
	...e,
	label: t.label || e.label,
	detail: t.detail || e.detail,
	icon: t.icon || e.icon,
	tone: t.tone || e.tone,
	placement: t
});
function ue(e, t) {
	let n = t && typeof t == "object" ? t : P, r = ae(e), i = Array.isArray(n.hiddenToolIds) ? e.commands.filter((e) => n.hiddenToolIds.includes(e.toolId)).map((e) => e.id) : N, a = R(n.hiddenCommandIds || i).filter((e) => r.has(e) && !r.get(e).alwaysVisible);
	return {
		version: e.version,
		activeTab: e.tabs.some((e) => e.id === n.activeTab) ? n.activeTab : e.defaultState.activeTab,
		hiddenCommandIds: a,
		accentMode: q(e.calibration.accentModes, n.accentMode) ? n.accentMode : e.defaultState.accentMode,
		density: q(e.calibration.densities, n.density) ? n.density : e.defaultState.density,
		detail: q(e.calibration.details, n.detail) ? n.detail : e.defaultState.detail,
		quickAccessIds: R(n.quickAccessIds || e.defaultState.quickAccessIds).filter((e) => r.has(e)),
		recentCommandIds: R(n.recentCommandIds).filter((e) => r.has(e)).slice(0, 8),
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
}
function de(e, t = typeof window > "u" ? null : window.localStorage) {
	if (!t) return ue(e, e.defaultState);
	try {
		let n = t.getItem(e.storageKey);
		if (!n) return ue(e, e.defaultState);
		let r = JSON.parse(n);
		return ue(e, r?.preferences || r);
	} catch {
		return ue(e, e.defaultState);
	}
}
function fe(e, t, n = typeof window > "u" ? null : window.localStorage) {
	if (!n) return !1;
	try {
		let r = ue(e, t);
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
function pe(e, t, { surface: n = "palette", tabId: r = "", menuId: i = "", groupId: a = "", capabilities: o = P, commandStates: s = P } = P) {
	let c = new Set(t?.hiddenCommandIds || N);
	return e.commands.flatMap((e) => {
		if (c.has(e.id) && !e.alwaysVisible || e.requires.some((e) => !W(o, e))) return N;
		let l = n === "palette" ? {
			surface: "palette",
			order: 0
		} : e.placements.find((e) => e.surface === n && (!r || e.tab === r) && (!i || e.menu === i) && (!a || e.groupId === a));
		if (!l) return N;
		let u = se(le(e, l), {
			state: t,
			capabilities: o,
			commandStates: s,
			placement: l
		});
		return u?.visible ? [u] : N;
	}).sort((e, t) => e.placement.order - t.placement.order || e.label.localeCompare(t.label, "hu"));
}
function me(e, t, { surface: n = "ribbon", tabId: r = "", menuId: i = "", capabilities: a = P, commandStates: o = P } = P) {
	let s = (Array.isArray(e?.groups) ? e.groups : N).filter((e) => (!e.surface || e.surface === n) && (!r || !e.tab || e.tab === r) && (!i || !e.menu || e.menu === i)).sort((e, t) => e.order - t.order || e.label.localeCompare(t.label, "hu"));
	if (!s.length) return N;
	let c = pe(e, t, {
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
var he = (e) => (t, n) => {
	switch (n.type) {
		case "tab.select": return ue(e, {
			...t,
			activeTab: n.tabId
		});
		case "command.visibility": {
			let r = e.commands.find((e) => e.id === n.commandId);
			if (!r || r.alwaysVisible) return t;
			let i = t.hiddenCommandIds.includes(n.commandId) ? t.hiddenCommandIds.filter((e) => e !== n.commandId) : [...t.hiddenCommandIds, n.commandId];
			return ue(e, {
				...t,
				hiddenCommandIds: i
			});
		}
		case "preference.set": return ue(e, {
			...t,
			[n.key]: n.value
		});
		case "preferences.reset": return ue(e, e.defaultState);
		case "command.completed": return {
			...t,
			recentCommandIds: R([n.commandId, ...t.recentCommandIds]).slice(0, 8),
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
				error: L(n.error) || "COMMAND_FAILED"
			}
		};
		default: return t;
	}
};
function ge({ registry: e = ie, capabilities: t = P, commandStates: n = P, handlers: r = P, onCommand: i, children: a }) {
	let s = y(), c = v(), [u, p] = f(he(e), e, (e) => de(e)), m = d(() => ae(e), [e]);
	l(() => {
		fe(e, u);
	}, [e, u]);
	let h = o((e, r) => se(e, {
		state: u,
		capabilities: t,
		commandStates: n,
		placement: r
	}), [
		t,
		n,
		u
	]), _ = o((e) => {
		let t = h(e);
		return !!(t?.visible && !t.disabled);
	}, [h]), b = o((r = P) => pe(e, u, {
		...r,
		capabilities: t,
		commandStates: n
	}), [
		t,
		n,
		e,
		u
	]), x = o((r = P) => me(e, u, {
		...r,
		capabilities: t,
		commandStates: n
	}), [
		t,
		n,
		e,
		u
	]), S = o(async (e, { source: t = "api", payload: n = P } = P) => {
		let a = m.get(e);
		if (!a) return {
			ok: !1,
			reason: "COMMAND_NOT_FOUND"
		};
		let o = h(a);
		if (!o?.visible || o.disabled) return {
			ok: !1,
			reason: "COMMAND_NOT_AVAILABLE"
		};
		let l = {
			...a.intent,
			...n && typeof n == "object" ? n : P
		}, d = {
			commandId: e,
			command: a,
			resolvedCommand: o,
			intent: l,
			payload: n,
			source: t,
			state: u,
			location: c
		};
		try {
			if (l.type === "route.navigate") s(l.to, l.options);
			else {
				let e = r[l.type];
				if (typeof e != "function") return {
					ok: !1,
					reason: "COMMAND_HANDLER_NOT_FOUND"
				};
				await e({
					...d,
					navigate: s
				});
			}
			return i?.(d), p({
				type: "command.completed",
				commandId: e
			}), {
				ok: !0,
				event: d
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
		c,
		s,
		i,
		h,
		u
	]);
	l(() => {
		if (typeof window > "u") return;
		let t = (t) => {
			if (t.defaultPrevented || ne(t.target)) return;
			let n = re(t), r = e.commands.find((e) => G(e.shortcut) === n && _(e));
			r && (t.preventDefault(), S(r.id, { source: "shortcut" }));
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [
		_,
		S,
		e.commands
	]);
	let C = d(() => ({
		registry: e,
		state: u,
		capabilities: t,
		commandStates: n,
		resolveCommand: h,
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
		canExecute: _
	}), [
		_,
		t,
		n,
		S,
		e,
		h,
		b,
		x,
		u
	]);
	return /* @__PURE__ */ g(F.Provider, {
		value: C,
		children: a
	});
}
function _e() {
	let e = s(F);
	if (!e) throw Error("useCadCui must be used below CadCuiProvider.");
	return e;
}
function ve(e, t = "api") {
	let { executeCommand: n } = _e();
	return o((r) => n(e, {
		source: t,
		payload: r
	}), [
		e,
		n,
		t
	]);
}
var ye = (e, t) => e?.[t] || null;
function be({ command: e, iconMap: t, source: n, role: r, badge: i, className: a }) {
	let { executeCommand: o } = _e(), s = ye(t, e.icon), c = e.placement?.control || "button", l = [
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
function xe({ iconMap: e = P, className: t, title: n = "PARANCS SZALAG", description: r = "Deklaratív CUI-regiszterből épített munkatéri parancsok", renderBadge: i, ...a }) {
	let { registry: o, state: s, selectCommands: c, selectCommandGroups: l, setActiveTab: u } = _e(), d = o.tabs.find((e) => e.id === s.activeTab) || o.tabs[0], f = c({
		surface: "ribbon",
		tabId: d?.id
	}), p = o.groups?.length ? l({
		surface: "ribbon",
		tabId: d?.id
	}) : N, m = p.length > 0;
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
						children: t.commands.map((t) => /* @__PURE__ */ g(be, {
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
				children: f.map((t) => /* @__PURE__ */ g(be, {
					command: t,
					iconMap: e,
					source: "ribbon",
					badge: i?.(t) ?? t.label
				}, t.id))
			})]
		})]
	});
}
function Se({ iconMap: e = P, commandIds: t, className: n, ...r }) {
	let { registry: i, state: a, resolveCommand: o } = _e(), s = (Array.isArray(t) ? t : a.quickAccessIds).map((e) => i.commands.find((t) => t.id === e)).filter(Boolean).map((e) => {
		let t = e.placements.find((e) => e.surface === "quick-access");
		return o(t ? le(e, t) : e, t);
	}).filter((e) => e?.visible);
	return /* @__PURE__ */ g("div", {
		...r,
		className: ["cad-cui-quick-access", n].filter(Boolean).join(" "),
		"data-testid": r["data-testid"] || "cad-cui-quick-access",
		role: "toolbar",
		"aria-label": "Gyors elérés",
		children: s.map((t) => /* @__PURE__ */ g(be, {
			command: t,
			iconMap: e,
			source: "quick-access"
		}, t.id))
	});
}
function Ce({ menuId: e = "canvas", iconMap: t = P, className: n, onClose: r, ...i }) {
	let { selectCommands: a } = _e(), o = a({
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
				children: [o.map((e) => /* @__PURE__ */ g(be, {
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
function we({ iconMap: e = P, className: t, ...n }) {
	let { selectCommands: r, state: i } = _e(), [a, o] = m(""), s = c(a), l = d(() => {
		let e = L(s).toLocaleLowerCase("hu");
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
						children: [l.map((t) => /* @__PURE__ */ g(be, {
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
function Te({ className: e, ...t }) {
	let { registry: n, state: r, setPreference: i, toggleCommandVisibility: a, resetPreferences: o } = _e(), s = new Set(r.hiddenCommandIds);
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
//#region src/cadUiUtils.js
var J = (...e) => e.filter(Boolean).join(" "), Y = (e) => Array.isArray(e) ? e : [], X = (e) => String(typeof e == "string" || typeof e == "number" ? e : e?.label ?? e?.name ?? e?.id ?? "");
function Z(e, t, n) {
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
var Ee = (e, t, n) => Number.isFinite(e) ? Number.isFinite(t) && e < t ? t : Number.isFinite(n) && e > n ? n : e : e, De = (e, t, n) => {
	e?.disabled || (e?.onClick?.(e, t), n?.(e, t));
};
function Oe({ shortcut: e, className: t }) {
	return e ? /* @__PURE__ */ g("kbd", {
		className: J("cad-shortcut-hint", t),
		children: e
	}) : null;
}
function ke({ icon: e, label: t, shortcut: n, active: r = !1, toggle: i = !1, tone: a = "inherit", badge: o, compact: s = !1, className: c, children: l, title: u, type: d = "button", ...f }) {
	let p = t || (typeof l == "string" ? l : "CAD tool");
	return /* @__PURE__ */ _("button", {
		...f,
		type: d,
		"data-tone": a,
		"data-active": r ? "true" : "false",
		"aria-pressed": i ? r : void 0,
		"aria-label": f["aria-label"] || p,
		title: u || [p, n].filter(Boolean).join(" · "),
		className: J("cad-tool-button", s && "cad-tool-button--compact", c),
		children: [
			e && /* @__PURE__ */ g("span", {
				className: "cad-tool-button__icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ g(e, { size: s ? 13 : 16 })
			}),
			(t || l) && /* @__PURE__ */ g("span", {
				className: "cad-tool-button__label",
				children: l || t
			}),
			o && /* @__PURE__ */ g("span", {
				className: "cad-tool-button__badge",
				children: o
			}),
			n && /* @__PURE__ */ g(Oe, { shortcut: n })
		]
	});
}
function Ae({ active: e = !1, onChange: t, onClick: n, ...r }) {
	return /* @__PURE__ */ g(ke, {
		...r,
		active: e,
		toggle: !0,
		onClick: (r) => {
			t?.(!e, r), n?.(r);
		}
	});
}
function je({ icon: e, label: t, shortcut: n, tone: r = "inherit", disabled: i = !1, menu: a, menuId: o, menuOpen: s, defaultMenuOpen: c = !1, onMenuOpenChange: d, onClick: f, className: m, children: h, ...v }) {
	let y = u(), b = o || `cad-split-menu-${y}`, x = p(null), S = p(null), [C, w] = Z(s, c, (e, t) => d?.(e, t));
	l(() => {
		if (!C) return;
		let e = window.setTimeout(() => S.current?.querySelector("[role=\"menuitem\"]:not(:disabled), button:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [C]);
	let T = (e) => {
		w(!1, e), window.setTimeout(() => x.current?.focus(), 0);
	};
	return /* @__PURE__ */ _("span", {
		className: J("cad-split-button", m),
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
					n && /* @__PURE__ */ g(Oe, { shortcut: n })
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
function Me({ label: e, items: t = [], onAction: n, className: r, children: i }) {
	return /* @__PURE__ */ _("section", {
		className: J("cad-toolbar-group", r),
		"aria-label": e,
		children: [/* @__PURE__ */ _("div", {
			className: "cad-toolbar-group__tools",
			children: [Y(t).map((e, t) => {
				if (e?.type === "separator") return /* @__PURE__ */ g("span", {
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
				}, a = (t) => De(e, t, n);
				return e?.type === "split" ? /* @__PURE__ */ g(je, {
					...i,
					menu: e.menu,
					menuOpen: e.menuOpen,
					onMenuOpenChange: (t, n) => e.onMenuOpenChange?.(t, e, n),
					onClick: a
				}, r) : e?.toggle ? /* @__PURE__ */ g(Ae, {
					...i,
					onChange: (t, r) => {
						e.onChange?.(t, e, r), n?.({
							...e,
							active: t
						}, r);
					}
				}, r) : /* @__PURE__ */ g(ke, {
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
function Ne({ groups: e, items: t, label: n = "CAD tools", orientation: r = "horizontal", onAction: i, className: a, children: o, ...s }) {
	let c = Y(e).length ? Y(e) : [{
		id: "default",
		items: Y(t)
	}];
	return /* @__PURE__ */ _("div", {
		...s,
		className: J("cad-toolbar", `cad-toolbar--${r}`, a),
		role: "toolbar",
		"aria-label": n,
		"aria-orientation": r,
		children: [c.map((e, t) => /* @__PURE__ */ g(Me, {
			label: e.label,
			items: e.items,
			onAction: i
		}, e.id || e.label || t)), o]
	});
}
function Pe({ groups: e, items: t, label: n = "CAD tool palette", className: r, ...i }) {
	return /* @__PURE__ */ g(Ne, {
		...i,
		groups: e,
		items: t,
		label: n,
		orientation: "vertical",
		className: J("cad-tool-palette", r)
	});
}
function Fe({ id: e, label: t, value: n, defaultValue: r = "", onValueChange: i, onChange: a, min: o, max: s, step: c = 1, unit: l, prefix: d, suffix: f, asNumber: p = !0, disabled: m = !1, readOnly: h = !1, showSteppers: v = !0, className: y, inputClassName: b, ...x }) {
	let S = u(), C = e || `cad-number-${S}`, [w, T] = Z(n, r, (e, t) => {
		i?.(e, t), a?.(e, t);
	}), E = (e, t) => {
		let n = p && e !== "" ? Number(e) : e;
		T(n, t);
	}, D = (e, t) => {
		let n = Number(w), r = Number(c) || 1, i = Ee((Number.isFinite(n) ? n : 0) + e * r, Number(o), Number(s));
		E(i, t);
	};
	return /* @__PURE__ */ _("div", {
		className: J("cad-numeric-input", m && "cad-numeric-input--disabled", y),
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
					className: J("cad-numeric-input__field", b),
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
function Ie({ unit: e = "mm", ...t }) {
	return /* @__PURE__ */ g(Fe, {
		...t,
		unit: e
	});
}
function Le({ unit: e = "°", ...t }) {
	return /* @__PURE__ */ g(Fe, {
		...t,
		unit: e
	});
}
function Re({ value: e, defaultValue: t = {
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
	return /* @__PURE__ */ _("fieldset", {
		className: J("cad-coordinate-input", c),
		children: [s && /* @__PURE__ */ g("legend", { children: s }), /* @__PURE__ */ g("div", {
			className: "cad-coordinate-input__axes",
			children: Y(a).map((e) => {
				let t = String(e).toLowerCase();
				return /* @__PURE__ */ r(Ie, {
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
function ze({ color: e = "#ffffff", label: t, size: n = "regular", onClick: r, className: i, style: a, ...o }) {
	let s = /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("span", {
		className: "cad-color-swatch__chip",
		style: { "--cad-swatch-color": e },
		"aria-hidden": "true"
	}), t && /* @__PURE__ */ g("span", {
		className: "cad-color-swatch__label",
		children: t
	})] }), c = {
		...o,
		className: J("cad-color-swatch", `cad-color-swatch--${n}`, i),
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
function Be({ type: e = "continuous", color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ _("span", {
		className: J("cad-linetype-preview", r),
		"data-type": e,
		style: { "--cad-line-color": t },
		title: n || e,
		"aria-label": n || e,
		children: [/* @__PURE__ */ g("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ g("small", { children: n })]
	});
}
function Ve({ weight: e = .25, color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ _("span", {
		className: J("cad-lineweight-preview", r),
		style: {
			"--cad-line-color": t,
			"--cad-line-weight": `${Math.max(1, Number(e) * 4)}px`
		},
		title: n || `${e} mm`,
		"aria-label": n || `${e} mm`,
		children: [/* @__PURE__ */ g("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ g("small", { children: n })]
	});
}
function He({ className: e }) {
	return /* @__PURE__ */ g("div", {
		className: J("cad-menu__separator", e),
		role: "separator"
	});
}
function Ue({ item: e, label: t, detail: n, shortcut: r, icon: i, checked: a, disabled: o = !1, type: s = "action", tone: c = "inherit", onClick: l, className: u }) {
	let d = t || X(e), f = a ?? e?.checked, p = o || e?.disabled, m = s === "checkbox" ? "menuitemcheckbox" : s === "radio" ? "menuitemradio" : "menuitem";
	return /* @__PURE__ */ _("button", {
		type: "button",
		role: m,
		disabled: p,
		"data-tone": c || e?.tone || "inherit",
		"aria-checked": m === "menuitem" ? void 0 : !!f,
		className: J("cad-menu__item", f && "cad-menu__item--checked", u),
		onClick: (t) => l?.(e, t),
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-menu__check",
				"aria-hidden": "true",
				children: f ? "✓" : ""
			}),
			i && /* @__PURE__ */ g(i, {
				size: 13,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ _("span", {
				className: "cad-menu__copy",
				children: [/* @__PURE__ */ g("strong", { children: d }), n && /* @__PURE__ */ g("small", { children: n })]
			}),
			r && /* @__PURE__ */ g(Oe, { shortcut: r })
		]
	});
}
function We({ items: e = [], label: t = "CAD menu", onAction: n, onClose: r, className: i, children: a, menuRef: o, ...s }) {
	let c = p(null), l = o || c, u = (e) => {
		let t = [...l.current?.querySelectorAll("[role^=\"menuitem\"]") || []].filter((e) => !e.disabled);
		t.length && t[(t.indexOf(document.activeElement) + e + t.length) % t.length].focus();
	};
	return /* @__PURE__ */ _("div", {
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
		children: [Y(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ g(He, {}, e.id || `separator-${t}`) : /* @__PURE__ */ g(Ue, {
			item: e,
			label: X(e),
			detail: e.detail,
			shortcut: e.shortcut,
			icon: e.icon,
			checked: e.checked,
			disabled: e.disabled,
			type: e.type,
			tone: e.tone,
			onClick: (e, t) => De(e, t, n)
		}, e.id || `${X(e)}-${t}`)), a]
	});
}
function Ge({ items: e = [], label: t = "More options", open: n, defaultOpen: r = !1, onOpenChange: i, onAction: a, className: o, triggerLabel: s = "More", ...c }) {
	let [d, f] = Z(n, r, (e, t) => i?.(e, t)), m = `cad-overflow-menu-${u()}`, h = p(null), v = p(null);
	l(() => {
		if (!d) return;
		let e = window.setTimeout(() => v.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [d]);
	let y = (e) => {
		f(!1, e), window.setTimeout(() => h.current?.focus(), 0);
	};
	return /* @__PURE__ */ _("span", {
		className: J("cad-overflow-menu", o),
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
		}), d && /* @__PURE__ */ g(We, {
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
var Ke = (e) => String(e ?? "").trim(), qe = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, Je = (e) => Ke(e?.tabId || e?.tab || e?.placement?.tab), Ye = (e, t) => Ke(e?.groupId || e?.group || e?.placement?.groupId || e?.placement?.group) || t, Xe = (e, t) => Ke(e?.groupLabel || e?.placement?.groupLabel || e?.placement?.group) || t, Ze = (e, t) => qe(e?.order ?? e?.placement?.order, t), Qe = (e) => Ke(e?.tabId || e?.tab || e?.placement?.tab), $e = (e) => Y(e?.commands).length ? Y(e.commands) : Y(e?.items), et = (e) => Ke(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace";
function tt(e = [], { tabId: t = "", defaultGroupId: n = "commands", defaultGroupLabel: r = "COMMANDS" } = {}) {
	let i = /* @__PURE__ */ new Map();
	return Y(e).forEach((e, a) => {
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
	let a = Y(e).filter((e) => e && typeof e == "object" && (!n || !Qe(e) || Qe(e) === n)).map((e, t) => ({
		id: Ke(e.id) || `group-${t + 1}`,
		label: Ke(e.label) || i,
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
	return /* @__PURE__ */ _("button", {
		...d,
		children: [
			u && /* @__PURE__ */ _("span", {
				className: "cad-workspace-ribbon__tool-icon",
				"aria-hidden": "true",
				children: [u, f && /* @__PURE__ */ g("em", { children: e.badge })]
			}),
			!u && f && /* @__PURE__ */ g("span", {
				className: "cad-workspace-ribbon__tool-badge-only",
				"aria-hidden": "true",
				children: /* @__PURE__ */ g("em", { children: e.badge })
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-workspace-ribbon__tool-label",
				children: s
			}),
			e?.shortcut && /* @__PURE__ */ g(Oe, { shortcut: e.shortcut })
		]
	});
}
function at({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: i, groups: a, commands: o = [], defaultGroupId: s = "commands", defaultGroupLabel: c = "COMMANDS", label: l = "CAD workspace ribbon", tabListLabel: f = "Workspace commands", minimized: m, defaultMinimized: h = !1, onMinimizedChange: v, collapsible: y = !0, compact: b = !1, identity: x, renderIdentity: S, status: C, statusLabel: w = "Workspace status", renderStatus: T, endSlot: E, renderIcon: D, renderCommand: O, renderMinimizeControl: k, onCommand: A, className: j, style: M, children: N, ...P }) {
	let F = `cad-workspace-ribbon-${et(u())}`, I = p(/* @__PURE__ */ new Map()), L = d(() => Y(t).filter((e) => e && Ke(e.id)).map((e) => ({
		...e,
		id: Ke(e.id),
		label: X(e) || Ke(e.id)
	})), [t]), R = L.find((e) => !e.disabled)?.id || L[0]?.id || "", [z, ee] = Z(n, r || R, (e, t) => i?.(e, L.find((t) => t.id === e), t)), B = L.find((e) => e.id === z) || L.find((e) => !e.disabled) || L[0] || null, V = B?.id || "", [H, te] = Z(m, h, (e, t) => v?.(!!e, t)), U = d(() => nt({
		groups: a,
		commands: o,
		activeTabId: V,
		defaultGroupId: s,
		defaultGroupLabel: c
	}), [
		o,
		s,
		c,
		a,
		V
	]), W = {
		activeTab: B,
		groups: U,
		compact: b,
		minimized: !!H
	}, ne = typeof S == "function" ? S(W) : x, re = typeof T == "function" ? T(W) : C, G = `${F}-panel-${et(V || "commands")}`, K = (e, t) => {
		e.disabled || ee(e.id, t);
	}, ie = (e, t, n) => {
		let r = L.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), K(i, n), I.current.get(i.id)?.focus();
	}, ae = (e, t) => {
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && ie(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && ie(e.id, -1, t), t.key === "Home" && ie(L.find((e) => !e.disabled)?.id || e.id, 0, t), t.key === "End") {
			let e = L.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), K(e, t), I.current.get(e.id)?.focus();
		}
	}, q = (e) => te((e) => !e, e), oe = typeof k == "function" ? k({
		minimized: !!H,
		toggle: q
	}) : y && /* @__PURE__ */ _("button", {
		type: "button",
		className: "cad-workspace-ribbon__minimize",
		"aria-label": H ? "Expand ribbon" : "Minimize ribbon",
		"aria-expanded": !H,
		title: H ? "Expand ribbon" : "Minimize ribbon",
		onClick: q,
		children: [/* @__PURE__ */ g("span", {
			"aria-hidden": "true",
			children: H ? "⌄" : "⌃"
		}), /* @__PURE__ */ g("b", { children: H ? "EXPAND" : "COMPACT" })]
	});
	return /* @__PURE__ */ _("header", {
		...P,
		className: J("cad-workspace-ribbon", b && "cad-workspace-ribbon--compact", H && "cad-workspace-ribbon--minimized", j),
		"data-active-tab": V || void 0,
		"data-minimized": H ? "true" : "false",
		"aria-label": l,
		style: {
			"--cad-ribbon-accent": B?.color || void 0,
			...M
		},
		children: [/* @__PURE__ */ _("div", {
			className: "cad-workspace-ribbon__tabbar",
			children: [
				ne && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__identity",
					children: ne
				}),
				L.length > 0 && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__tabs",
					role: "tablist",
					"aria-label": f,
					children: L.map((t) => {
						let n = t.id === V, r = `${F}-tab-${et(t.id)}`;
						return /* @__PURE__ */ _("button", {
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
							onClick: (e) => K(t, e),
							onKeyDown: (e) => ae(t, e),
							children: [t.icon && /* @__PURE__ */ g("span", {
								className: "cad-workspace-ribbon__tab-icon",
								"aria-hidden": "true",
								children: e.isValidElement(t.icon) ? t.icon : typeof t.icon == "function" ? e.createElement(t.icon, { size: 12 }) : null
							}), /* @__PURE__ */ g("span", { children: t.label })]
						}, t.id);
					})
				}),
				E && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__end-slot",
					children: E
				}),
				oe
			]
		}), !H && /* @__PURE__ */ _("div", {
			id: G,
			role: "tabpanel",
			"aria-labelledby": V ? `${F}-tab-${et(V)}` : void 0,
			tabIndex: 0,
			className: "cad-workspace-ribbon__commands",
			children: [
				/* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__groups",
					role: "toolbar",
					"aria-label": `${B?.label || "CAD"} commands`,
					children: U.map((e, t) => /* @__PURE__ */ _("section", {
						className: "cad-workspace-ribbon__group",
						"data-cad-group": e.label,
						"data-primary": t === 0 ? "true" : "false",
						"aria-label": `${e.label} command group`,
						children: [/* @__PURE__ */ g("div", {
							className: "cad-workspace-ribbon__group-tools",
							children: e.commands.map((t, n) => /* @__PURE__ */ g(it, {
								command: t,
								group: e,
								activeTab: B,
								compact: b,
								renderIcon: D,
								renderCommand: O,
								onCommand: A
							}, t?.id || `${e.id}-${n}`))
						}), e.label && /* @__PURE__ */ g("span", {
							className: "cad-workspace-ribbon__group-label",
							children: e.label
						})]
					}, e.id))
				}),
				re && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__status",
					"aria-label": w,
					children: re
				}),
				N && /* @__PURE__ */ g("div", {
					className: "cad-workspace-ribbon__content",
					children: N
				})
			]
		})]
	});
}
//#endregion
//#region src/CadOverlayUi.jsx
var ot = (e, t) => (n) => {
	e?.(n), n.defaultPrevented || t?.(n);
}, st = "button:not(:disabled):not([tabindex=\"-1\"]), input:not(:disabled):not([tabindex=\"-1\"]), select:not(:disabled):not([tabindex=\"-1\"]), textarea:not(:disabled):not([tabindex=\"-1\"]), [contenteditable=\"true\"]:not([tabindex=\"-1\"]), [href]:not([tabindex=\"-1\"]), [tabindex]:not([tabindex=\"-1\"])", ct = (e) => !!(e && !e.hidden && !e.closest?.("[hidden], [aria-hidden=\"true\"], [inert]") && e.getAttribute("aria-hidden") !== "true" && e.getAttribute("aria-disabled") !== "true" && !e.hasAttribute("disabled")), lt = (e) => [...e?.querySelectorAll(st) || []].filter(ct), ut = (e) => {
	if (e?.isConnected) try {
		e.focus({ preventScroll: !0 });
	} catch {
		e.focus?.();
	}
}, dt = (e) => {
	if (typeof document > "u" || !e) return !1;
	let t = document.querySelectorAll("[data-cad-dialog=\"true\"]");
	return t[t.length - 1] === e;
};
function ft({ open: e = !1, onClose: t, title: n, description: r, actions: i, tone: a = "neutral", closeOnBackdrop: o = !0, closeOnEscape: s = !0, className: c, children: d, ...f }) {
	let m = u(), h = `cad-dialog-title-${m}`, v = `cad-dialog-description-${m}`, y = p(null), b = p(t), x = p(s), { "aria-label": S, "aria-labelledby": C, "aria-describedby": w, onKeyDown: T, ...E } = f;
	if (b.current = t, x.current = s, l(() => {
		if (!e || typeof document > "u") return;
		let t = document.activeElement, n = () => {
			let e = y.current;
			if (!dt(e)) return;
			let t = lt(e);
			ut(t.find((e) => e.hasAttribute("data-autofocus")) || t[0] || e);
		}, r = (e) => {
			let t = y.current;
			if (e.defaultPrevented || !dt(t)) return;
			if (e.key === "Escape" && x.current) {
				e.preventDefault(), b.current?.(e);
				return;
			}
			if (e.key !== "Tab") return;
			let n = lt(t);
			if (!n.length) {
				e.preventDefault(), ut(t);
				return;
			}
			let r = n[0], i = n[n.length - 1], a = document.activeElement;
			t?.contains(a) ? e.shiftKey && a === r ? (e.preventDefault(), ut(i)) : !e.shiftKey && a === i && (e.preventDefault(), ut(r)) : (e.preventDefault(), ut(e.shiftKey ? i : r));
		}, i = window.setTimeout(n, 0);
		return window.addEventListener("keydown", r), () => {
			window.clearTimeout(i), window.removeEventListener("keydown", r), ut(t);
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
			className: J("cad-dialog", c),
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
function pt({ open: e, title: t = "Confirm action", description: n, confirmLabel: r = "Confirm", cancelLabel: i = "Cancel", destructive: a = !1, onConfirm: o, onCancel: s, children: c, className: l, ...u }) {
	return /* @__PURE__ */ g(ft, {
		...u,
		open: e,
		title: t,
		description: n,
		onClose: s,
		className: J("cad-confirm-dialog", l),
		actions: /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ g("button", {
			type: "button",
			...a ? { "data-autofocus": !0 } : {},
			className: "cad-dialog__button cad-dialog__button--quiet",
			onClick: s,
			children: i
		}), /* @__PURE__ */ g("button", {
			type: "button",
			...a ? {} : { "data-autofocus": !0 },
			className: J("cad-dialog__button", a && "cad-dialog__button--danger"),
			onClick: o,
			children: r
		})] }),
		children: c
	});
}
function mt({ toast: e, onDismiss: t, className: n }) {
	let r = e || {}, i = r.tone || "neutral";
	return /* @__PURE__ */ _("article", {
		className: J("cad-toast", n),
		"data-tone": i,
		role: i === "danger" || i === "error" ? "alert" : "status",
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-toast__signal",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ _("div", {
				className: "cad-toast__copy",
				children: [/* @__PURE__ */ g("strong", { children: r.title || X(r) || "CAD notification" }), r.message && /* @__PURE__ */ g("p", { children: r.message })]
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
				"aria-label": `Dismiss ${r.title || X(r) || "notification"}`,
				onClick: (e) => t(r, e),
				children: "×"
			})
		]
	});
}
function ht({ toasts: e = [], onDismiss: t, placement: n = "bottom-right", label: r = "Notifications", className: i, ...a }) {
	return /* @__PURE__ */ g("section", {
		...a,
		className: J("cad-toast-stack", `cad-toast-stack--${n}`, i),
		"aria-label": r,
		"aria-live": "polite",
		children: Y(e).map((e, n) => /* @__PURE__ */ g(mt, {
			toast: e,
			onDismiss: t
		}, e?.id || n))
	});
}
function gt({ trigger: e, content: n, open: r, defaultOpen: i = !1, onOpenChange: o, placement: s = "bottom-start", label: c = "More options", contentRole: d = "region", closeOnOutside: f = !0, closeOnEscape: m = !0, closeOnFocusOutside: h = !1, closeOnPointerLeave: v = !1, restoreFocus: y = !0, className: b, contentClassName: x, ...S }) {
	let C = `cad-popover-${u()}`, w = p(null), T = p(r === void 0 ? i : r), [E, D] = Z(r, i, (e, t) => o?.(e, t)), O = d === !1 ? void 0 : d, k = [
		"dialog",
		"grid",
		"listbox",
		"menu",
		"tree"
	].includes(O) ? O : void 0, A = (e) => D(!1, e), j = (e) => D(!E, e);
	l(() => {
		let e = T.current;
		if (T.current = E, !e || E || !y || typeof window > "u") return;
		let t = window.requestAnimationFrame(() => {
			let e = w.current?.querySelector("[data-cad-popover-trigger=\"true\"]");
			e && document.contains(e) && e.focus?.();
		});
		return () => window.cancelAnimationFrame(t);
	}, [E, y]), l(() => {
		if (!E || typeof document > "u") return;
		let e = (e) => {
			f && !w.current?.contains(e.target) && D(!1, e);
		}, t = (e) => {
			!m || e.defaultPrevented || e.key !== "Escape" || (e.preventDefault(), D(!1, e));
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t);
		};
	}, [
		m,
		f,
		E,
		D
	]);
	let M = a(e) ? t(e, {
		"data-cad-popover-trigger": "true",
		"aria-haspopup": e.props["aria-haspopup"] ?? k,
		"aria-expanded": E,
		"aria-controls": E ? C : void 0,
		onClick: ot(e.props.onClick, j)
	}) : /* @__PURE__ */ g("button", {
		type: "button",
		"data-cad-popover-trigger": "true",
		className: "cad-popover__fallback-trigger",
		"aria-haspopup": k,
		"aria-expanded": E,
		"aria-controls": E ? C : void 0,
		onClick: j,
		children: e || "Options"
	}), N = (e) => {
		S.onBlur?.(e), !e.defaultPrevented && h && E && !w.current?.contains(e.relatedTarget) && A(e);
	}, P = (e) => {
		S.onPointerLeave?.(e), !e.defaultPrevented && v && E && A(e);
	};
	return /* @__PURE__ */ _("div", {
		...S,
		ref: w,
		className: J("cad-popover", `cad-popover--${s}`, b),
		onBlur: N,
		onPointerLeave: P,
		onKeyDown: (e) => {
			S.onKeyDown?.(e), !e.defaultPrevented && m && e.key === "Escape" && E && (e.preventDefault(), A(e));
		},
		children: [M, E && /* @__PURE__ */ g("div", {
			id: C,
			className: J("cad-popover__content", x),
			role: O,
			"aria-label": c,
			children: typeof n == "function" ? n({ close: A }) : n
		})]
	});
}
function _t({ content: e, placement: n = "top", className: r, children: i }) {
	let o = u(), [s, c] = m(!1);
	if (!e || !a(i)) return i || null;
	let l = t(i, {
		"aria-describedby": [i.props["aria-describedby"], `cad-tooltip-${o}`].filter(Boolean).join(" "),
		onMouseEnter: ot(i.props.onMouseEnter, () => c(!0)),
		onMouseLeave: ot(i.props.onMouseLeave, () => c(!1)),
		onFocus: ot(i.props.onFocus, () => c(!0)),
		onBlur: ot(i.props.onBlur, () => c(!1))
	});
	return /* @__PURE__ */ _("span", {
		className: J("cad-tooltip", `cad-tooltip--${n}`, s && "cad-tooltip--visible", r),
		children: [l, /* @__PURE__ */ g("span", {
			id: `cad-tooltip-${o}`,
			className: "cad-tooltip__bubble",
			role: "tooltip",
			children: e
		})]
	});
}
function vt({ shortcuts: e = [], title: t = "Keyboard shortcuts", onClose: n, className: r, ...i }) {
	let a = Y(e).reduce((e, t, n) => {
		let r = t?.group || "General";
		return e[r] || (e[r] = []), e[r].push({
			...t,
			id: t?.id || `${r}-${n}`
		}), e;
	}, {});
	return /* @__PURE__ */ _("section", {
		...i,
		className: J("cad-shortcut-reference", r),
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
				/* @__PURE__ */ g("dd", { children: /* @__PURE__ */ g(Oe, { shortcut: e.shortcut || e.keys }) }),
				e.detail && /* @__PURE__ */ g("small", { children: e.detail })
			] }, e.id)) })] }, e))
		})]
	});
}
function yt({ open: e = !0, label: t = "Command input", prompt: n, value: r, defaultValue: i = "", onChange: a, onSubmit: o, onCancel: s, placeholder: c, submitLabel: l = "Accept", className: d, ...f }) {
	let p = u(), [m, h] = Z(r, i, (e, t) => a?.(e, t));
	return e ? /* @__PURE__ */ _("form", {
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
//#region src/CadCompactWorkspaceRibbon.jsx
var bt = (e) => String(e ?? "").trim(), xt = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t, St = (e) => bt(e).replace(/[^a-zA-Z0-9_-]+/g, "-") || "workspace", Ct = (e) => bt(e?.tabId || e?.tab || e?.placement?.tab), wt = (e) => bt(e?.tabId || e?.tab || e?.placement?.tab), Tt = (e) => Y(e?.commands).length ? Y(e.commands) : Y(e?.items), Et = {
	cyan: "#53c9ff",
	green: "#9add4b",
	amber: "#ffb554",
	magenta: "#f08cff",
	violet: "#b9a1ff",
	neutral: "#b4bdc7"
}, Dt = (e) => e?.color || Et[e?.tone] || "var(--cad-workspace-accent, #53c9ff)", Ot = (e) => Y(e).filter((e) => e && bt(e.id)).map((e) => ({
	...e,
	id: bt(e.id),
	label: X(e) || bt(e.id)
})), kt = ({ groups: e, activeTabId: t, defaultGroupLabel: n }) => Y(e).filter((e) => e && typeof e == "object" && (!t || !wt(e) || wt(e) === t)).map((e, r) => ({
	id: bt(e.id) || `group-${r + 1}`,
	label: bt(e.label) || n,
	order: xt(e.order, r),
	index: r,
	commands: Tt(e).filter((e) => !t || !Ct(e) || Ct(e) === t)
})).filter((e) => e.commands.length).sort((e, t) => e.order - t.order || e.index - t.index).map(({ index: e, ...t }) => t);
function At({ groups: e, commands: t = [], tabId: n = "", defaultGroupId: r = "commands", defaultGroupLabel: i = "COMMANDS" } = {}) {
	let a = kt({
		groups: e,
		activeTabId: n,
		defaultGroupLabel: i
	});
	return a.length ? a : tt(t, {
		tabId: n,
		defaultGroupId: r,
		defaultGroupLabel: i
	});
}
function jt({ command: e, group: t, activeTab: n, renderIcon: r, renderCommand: i, onCommand: o, close: s, closeOnCommand: c }) {
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
	return /* @__PURE__ */ g(ke, {
		...y,
		icon: m || void 0,
		label: b ? void 0 : l,
		badge: e?.badge,
		active: u,
		toggle: d,
		children: b || void 0
	});
}
function Mt({ tab: e, groups: t, openGroupId: n, onOpenGroupChange: r, renderIcon: i, renderCommand: a, onCommand: o, close: s, closeOnCommand: c, label: l }) {
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
					let n = e.id === d?.id, i = `${f}-${St(e.id)}`;
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
				id: `${f}-${St(d.id)}`,
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
					children: d.commands.map((t, n) => /* @__PURE__ */ g(jt, {
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
function Nt({ tabs: t = [], activeTab: n, defaultActiveTab: r, onActiveTabChange: i, openTabId: o, defaultOpenTabId: s = null, onOpenTabChange: c, openGroupId: l, defaultOpenGroupId: f = null, onOpenGroupChange: m, groups: h, commands: v = [], defaultGroupId: y = "commands", defaultGroupLabel: b = "COMMANDS", label: x = "Compact CAD workspace ribbon", tabListLabel: S = "Compact workspace commands", identity: C, endSlot: w, placement: T = "bottom-start", closeOnOutside: E = !0, closeOnEscape: D = !0, closeOnFocusOutside: O = !0, closeOnPointerLeave: k = !0, closeOnCommand: A = !0, renderIcon: j, renderCommand: M, onCommand: N, className: P, style: F, ...I }) {
	let L = `cad-compact-workspace-ribbon-${St(u())}`, R = p(/* @__PURE__ */ new Map()), z = d(() => Ot(t), [t]), ee = z.find((e) => !e.disabled)?.id || z[0]?.id || "", [B, V] = Z(n, r || ee, (e, t) => i?.(e, z.find((t) => t.id === e) || null, t)), H = z.find((e) => e.id === B) || z.find((e) => !e.disabled) || z[0] || null, [te, U] = Z(o, s, (e, t) => c?.(e || null, z.find((t) => t.id === e) || null, t)), W = z.find((e) => e.id === te && !e.disabled) || null, ne = W?.id || "", [re, G] = Z(l, f, (e, t, n) => m?.(e || null, t || null, W || null, n)), K = d(() => new Map(z.map((e) => [e.id, At({
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
	]), ie = (e) => {
		G(null, null, e), U(null, e);
	}, ae = (e, t) => {
		V(e.id, t), ne !== e.id && G(null, null, t), U(e.id, t);
	}, q = (e, t) => {
		e.disabled || (V(e.id, t), ie(t));
	}, oe = (e, t, n) => {
		let r = z.filter((e) => !e.disabled);
		if (!r.length) return;
		let i = r[(Math.max(0, r.findIndex((t) => t.id === e)) + t + r.length) % r.length];
		n.preventDefault(), q(i, n), R.current.get(i.id)?.focus();
	}, se = (e, t) => {
		if ((t.key === "ArrowRight" || t.key === "ArrowDown") && oe(e.id, 1, t), (t.key === "ArrowLeft" || t.key === "ArrowUp") && oe(e.id, -1, t), t.key === "Home") {
			let e = z.find((e) => !e.disabled);
			if (!e) return;
			t.preventDefault(), q(e, t), R.current.get(e.id)?.focus();
		}
		if (t.key === "End") {
			let e = z.filter((e) => !e.disabled).at(-1);
			if (!e) return;
			t.preventDefault(), q(e, t), R.current.get(e.id)?.focus();
		}
	}, ce = (e, t, n) => G(e, t, n);
	return /* @__PURE__ */ g("header", {
		...I,
		className: J("cad-workspace-ribbon", "cad-compact-workspace-ribbon", P),
		"data-active-tab": H?.id || void 0,
		"data-open-tab": ne || void 0,
		"aria-label": x,
		style: {
			"--cad-ribbon-accent": Dt(H),
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
						let n = t.id === H?.id, r = t.id === ne, i = `${L}-tab-${St(t.id)}`, o = K.get(t.id) || [];
						return /* @__PURE__ */ g(gt, {
							open: r,
							onOpenChange: (e, n) => {
								e ? ae(t, n) : r && ie(n);
							},
							placement: T,
							label: `${t.label} compact command menu`,
							closeOnOutside: E,
							closeOnEscape: D,
							closeOnFocusOutside: O,
							closeOnPointerLeave: k,
							className: "cad-compact-workspace-ribbon__popover",
							contentClassName: "cad-compact-workspace-ribbon__disclosure",
							style: { "--cad-compact-ribbon-accent": Dt(t) },
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
								onKeyDown: (e) => se(t, e),
								children: [t.icon && /* @__PURE__ */ g("span", {
									className: "cad-workspace-ribbon__tab-icon",
									"aria-hidden": "true",
									children: a(t.icon) ? t.icon : typeof t.icon == "function" ? e.createElement(t.icon, { size: 12 }) : null
								}), /* @__PURE__ */ g("span", { children: t.label })]
							}),
							content: ({ close: e }) => /* @__PURE__ */ g(Mt, {
								tab: t,
								groups: o,
								openGroupId: r ? re : null,
								onOpenGroupChange: ce,
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
//#region src/CadContextUi.jsx
var Pt = Object.freeze([
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
]), Ft = Object.freeze([
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
]), It = Object.freeze([
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
]), Lt = (e, t) => Y(e).map((e, n) => {
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
}), Rt = (e) => Y(e).find((e) => !e?.disabled)?.id ?? "", zt = (e, t, n, r) => {
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
function Bt({ actions: e = Pt, activeId: t, defaultActiveId: n = "", onActiveChange: r, onChange: i, onAction: a, onPan: o, onZoom: s, onZoomIn: c, onZoomOut: l, onZoomWindow: u, onZoomExtents: f, onOrbit: p, onHome: m, label: h = "Viewport navigation", orientation: v = "vertical", className: y, ...b }) {
	let x = d(() => Lt(e, "navigation-action"), [e]), [S, C] = Z(t, n, (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), w = (e, t) => {
		e.disabled || ((e.toggle ?? e.mode ?? !1) && C(S === e.id ? "" : e.id, e, t), e.onClick?.(e, t), a?.(e, t), zt(e.id, {
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
		className: J("cad-navigation-bar", `cad-navigation-bar--${v}`, y),
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
				let n = e.icon, r = e.toggle ?? e.mode ?? !1, i = r && S === e.id, a = X(e);
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
function Vt({ styles: e = Ft, value: t, defaultValue: n, onChange: r, onStyleChange: i, label: a = "Visual style", id: o, selectProps: s = {}, disabled: c = !1, className: l, ...f }) {
	let p = u(), m = o || `cad-visual-style-${p}`, h = d(() => Lt(e, "visual-style"), [e]), [v, y] = Z(t, n ?? h[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), b = h.find((e) => e.id === v) || h[0];
	return /* @__PURE__ */ _("div", {
		...f,
		className: J("cad-visual-style-picker", l),
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
function Ht({ scales: e = It, value: t, defaultValue: n, onChange: r, onScaleChange: i, onManage: a, manageLabel: o = "Manage", label: s = "Viewport scale", id: c, selectProps: l = {}, disabled: f = !1, className: p, ...m }) {
	let h = u(), v = c || `cad-viewport-scale-${h}`, y = d(() => Lt(e, "viewport-scale"), [e]), [b, x] = Z(t, n ?? y[0]?.id ?? "", (e, t, n) => {
		r?.(e, t, n), i?.(e, t, n);
	}), S = y.find((e) => e.id === b) || y[0];
	return /* @__PURE__ */ _("div", {
		...m,
		className: J("cad-viewport-scale-picker", p),
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
function Ut({ sets: e = [], activeId: t, defaultActiveId: n, onChange: r, onApply: i, onCreate: a, onRename: o, onDelete: s, filter: c, defaultFilter: l = "", onFilterChange: f, showFilter: p = !0, title: m = "Selection sets", filterLabel: h = "Filter selection sets", emptyLabel: v = "No selection sets match the current filter", createLabel: y = "New", applyLabel: b = "Select", renameLabel: x = "Rename", deleteLabel: S = "Delete", className: C, children: w, ...T }) {
	let E = `cad-selection-set-filter-${u()}`, D = d(() => Lt(e, "selection-set"), [e]), [O, k] = Z(t, n ?? Rt(D), (e, t, n) => r?.(e, t, n)), [A, j] = Z(c, l, (e, t) => f?.(e, t)), M = D.find((e) => e.id === O), N = d(() => {
		let e = String(A || "").trim().toLocaleLowerCase();
		return e ? D.filter((t) => [
			X(t),
			t.description,
			t.group
		].filter(Boolean).join(" ").toLocaleLowerCase().includes(e)) : D;
	}, [D, A]), P = !!(M?.disabled || M?.locked || M?.protected || M?.system);
	return /* @__PURE__ */ _("section", {
		...T,
		className: J("cad-selection-set-panel", C),
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
							"aria-label": e.ariaLabel || X(e),
							"aria-pressed": t,
							"aria-current": t ? "true" : void 0,
							disabled: e.disabled,
							onClick: (t) => k(e.id, e, t),
							children: [
								/* @__PURE__ */ g("span", {
									className: "cad-selection-set-panel__set-name",
									children: X(e)
								}),
								e.description && /* @__PURE__ */ g("small", { children: e.description }),
								e.group && /* @__PURE__ */ g("em", { children: e.group })
							]
						}), n !== void 0 && /* @__PURE__ */ g("output", {
							"aria-label": `${X(e)}: ${r}`,
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
//#region src/CadWorkspaceCustomizationUi.jsx
var Wt = (e) => String(e ?? "").trim(), Gt = (e) => !!e && typeof e == "object" && !Array.isArray(e), Kt = (e, t) => !!e && !!t && e.open === t.open && e.placement === t.placement, qt = (e) => e instanceof Map ? Object.fromEntries(e.entries()) : Gt(e) ? e : {}, Jt = (e) => {
	if (!Gt(e)) return {};
	let { open: t, visible: n, isOpen: r, placement: i, mode: a, ...o } = e;
	return o;
}, Yt = (...e) => {
	let t = e.find((e) => typeof e == "boolean");
	return t === void 0 ? void 0 : t;
}, Xt = (e, t) => Wt(e).toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || t, Q = Object.freeze({
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
function Zt(e, t = Q.DOCK) {
	let n = Wt(e).toLocaleLowerCase();
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
var Qt = (e) => {
	let t = Y(e?.placements ?? e?.allowedPlacements ?? e?.placementOptions).map((e) => Zt(e, "")).filter(Boolean), n = !!(e?.preferenceLocked ?? e?.locked), r = !n && e?.dockable !== !1, i = !n && e?.floatable !== !1, a = (t.length ? t : [...r ? [Q.DOCK] : [], ...i ? [Q.FLOAT] : []]).filter((e) => e === Q.DOCK ? r : i);
	return [...new Set(a)];
};
function $t(e = []) {
	let t = /* @__PURE__ */ new Set();
	return Y(e).reduce((e, n, r) => {
		if (n == null) return e;
		let i = typeof n == "string" || typeof n == "number" ? {
			id: String(n),
			label: String(n)
		} : n;
		if (!Gt(i)) return e;
		let a = Wt(i.id ?? i.key) || `panel-${r + 1}`;
		if (t.has(a)) return e;
		t.add(a);
		let o = !!(i.preferenceLocked ?? i.locked), s = Qt(i), c = Zt(i.defaultPlacement ?? i.placement ?? i.mode, Q.DOCK), l = s.includes(c) ? c : s[0] || c, u = Yt(i.defaultOpen, i.defaultVisible, i.open, i.visible) ?? !0;
		return e.push({
			...i,
			id: a,
			label: X(i) || `Panel ${r + 1}`,
			description: Wt(i.description ?? i.detail),
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
var en = (e, t) => {
	let n = typeof t == "boolean" ? { open: t } : qt(t), r = Yt(n.open, n.visible, n.isOpen, e.defaultOpen), i = Zt(n.placement ?? n.mode, e.defaultPlacement), a = e.placements.includes(i) ? i : e.placements[0] || e.defaultPlacement;
	return {
		...Jt(n),
		open: e.required ? !0 : !!r,
		placement: a
	};
};
function tn(e = [], t = {}) {
	let n = qt(t);
	return $t(e).reduce((e, t) => (e[t.id] = en(t, n[t.id]), e), {});
}
function nn(e = [], t = {}, n) {
	let r = Wt(n);
	return r ? tn(e, t)[r] : void 0;
}
var rn = (e) => typeof e == "string" ? { type: e } : Gt(e) ? e : { type: "" }, an = (e, t, n) => {
	let { type: r, value: i } = rn(n), a = { ...t }, o = (t) => e.placements.includes(t);
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
		case $.RESET: return en(e, {});
		case $.PATCH: {
			let t = qt(i);
			typeof t.open == "boolean" && (t.open || e.closable) && (a.open = t.open);
			let n = Zt(t.placement ?? t.mode, "");
			n && o(n) && (a.placement = n);
			break;
		}
		default: return t;
	}
	return a;
};
function on(e = [], t = {}, n, r) {
	let i = Wt(n), a = $t(e).find((e) => e.id === i), o = qt(t);
	if (!a) return o;
	let s = en(a, o[i]), c = an(a, s, r);
	return Kt(s, c) ? o : {
		...o,
		[i]: c
	};
}
function sn(e = [], t = {}) {
	let n = qt(t);
	return $t(e).reduce((e, t) => ({
		...e,
		[t.id]: en(t, Jt(n[t.id]))
	}), { ...n });
}
function cn(e = "cad-workspace", t = "default") {
	let n = Gt(e) ? e : {
		namespace: e,
		scope: t
	};
	return `${Xt(n.namespace, "cad-workspace")}:${Xt(n.scope, "default")}:${Xt(n.section, "panels")}`;
}
function ln({ panels: e = [], value: t, defaultValue: n, onChange: r } = {}) {
	let i = d(() => $t(e), [e]), [a, s] = Z(t, d(() => ({
		...qt(n),
		...tn(i, n)
	}), [n, i]), (e, t, n) => {
		r?.(e, t, n);
	}), c = d(() => tn(i, a), [i, a]);
	return {
		panels: i,
		value: c,
		preferences: c,
		dispatch: o((e, t, n) => {
			let r = Wt(e), o = i.find((e) => e.id === r), l = c[r];
			if (!o || !l) return {
				changed: !1,
				panel: o,
				action: rn(t).type
			};
			let u = on(i, a, r, t), d = tn(i, u)[r], f = !Kt(l, d), p = {
				changed: f,
				id: r,
				panel: o,
				action: rn(t).type,
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
			let t = sn(i, a), n = tn(i, t), r = i.some((e) => !Kt(c[e.id], n[e.id])), o = {
				changed: r,
				action: $.RESET_ALL,
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
var un = /* @__PURE__ */ g("span", {
	"aria-hidden": "true",
	children: "▣"
}), dn = (t, n) => typeof n == "function" ? n(t) : e.isValidElement(t.icon) ? t.icon : typeof t.icon == "function" || t.icon?.$$typeof ? e.createElement(t.icon, {
	size: 13,
	"aria-hidden": !0
}) : t.icon !== void 0 && t.icon !== null ? t.icon : un, fn = (e) => e === Q.FLOAT ? "FLOATING" : "DOCKED";
function pn({ panels: t = [], value: n, defaultValue: r, onChange: i, onPanelChange: a, onPanelAction: s, onPanelOpen: c, onPanelClose: l, onPanelDock: d, onPanelFloat: f, onPanelReset: p, onResetAll: m, menuOpen: v, defaultMenuOpen: y = !1, onMenuOpenChange: b, title: x = "Workspace panels", description: S = "Show, dock or float the panels used in this workspace.", trigger: C, renderTrigger: w, triggerLabel: T = "Workspace panels", triggerIcon: E = "▦", scope: D, placement: O = "bottom-end", emptyLabel: k = "No configurable panels are available.", resetAllLabel: A = "Reset workspace", showResetAll: j = !0, closeLabel: M, renderPanel: N, renderPanelIcon: P, className: F, contentClassName: I, ...L }) {
	let R = u(), { panels: z, preferences: ee, dispatch: B, reset: V } = ln({
		panels: t,
		value: n,
		defaultValue: r,
		onChange: i
	}), H = z.filter((e) => !e.hidden), te = H.filter((e) => ee[e.id]?.open).length, U = H.filter((e) => ee[e.id]?.open && ee[e.id]?.placement === Q.FLOAT).length, W = o((e, t, n) => {
		let r = B(e.id, t, n);
		r.changed && (a?.(e.id, r.preference, r, n), s?.(r, n), r.action === $.OPEN && c?.(e, r.preference, r, n), r.action === $.CLOSE && l?.(e, r.preference, r, n), r.action === $.DOCK && d?.(e, r.preference, r, n), r.action === $.FLOAT && f?.(e, r.preference, r, n), r.action === $.RESET && p?.(e, r.preference, r, n));
	}, [
		B,
		s,
		a,
		l,
		d,
		f,
		c,
		p
	]), ne = o((e) => {
		let t = V(e);
		t.changed && (s?.(t, e), m?.(t.value, t, e));
	}, [
		s,
		m,
		V
	]), re = /* @__PURE__ */ _("button", {
		type: "button",
		className: "cad-workspace-panel-manager__trigger",
		title: T,
		children: [
			/* @__PURE__ */ g("span", {
				className: "cad-workspace-panel-manager__trigger-icon",
				"aria-hidden": "true",
				children: E
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-workspace-panel-manager__trigger-label",
				children: T
			}),
			/* @__PURE__ */ g("output", {
				"aria-label": `${te} visible panels`,
				children: te
			})
		]
	}), G = typeof w == "function" ? w({
		visibleCount: te,
		floatingCount: U,
		panels: H,
		preferences: ee
	}) : C || re, K = M || `Close ${x}`, ie = `cad-workspace-panel-manager-${R}`, ae = (e, t) => {
		let n = !!t.open, r = n ? $.CLOSE : $.OPEN, i = !e.disabled && (!n || e.closable), a = e.placements.length > 1, o = {
			open: (t) => W(e, $.OPEN, t),
			close: (t) => W(e, $.CLOSE, t),
			toggle: (t) => W(e, $.TOGGLE, t),
			dock: (t) => W(e, $.DOCK, t),
			float: (t) => W(e, $.FLOAT, t),
			reset: (t) => W(e, $.RESET, t)
		};
		return typeof N == "function" ? N(e, t, o) : /* @__PURE__ */ _("article", {
			className: "cad-workspace-panel-manager__panel",
			"data-panel-id": e.id,
			"data-open": n ? "true" : "false",
			"data-placement": t.placement,
			"data-locked": e.preferenceLocked ? "true" : "false",
			role: "listitem",
			children: [/* @__PURE__ */ _("div", {
				className: "cad-workspace-panel-manager__panel-summary",
				children: [/* @__PURE__ */ _("button", {
					type: "button",
					className: "cad-workspace-panel-manager__visibility",
					"aria-label": `${n ? "Hide" : "Show"} ${e.label}`,
					"aria-pressed": n,
					disabled: !i,
					title: e.preferenceLocked ? `${e.label} preferences are locked` : `${n ? "Hide" : "Show"} ${e.label}`,
					onClick: (t) => W(e, r, t),
					children: [
						/* @__PURE__ */ g("span", {
							className: "cad-workspace-panel-manager__panel-icon",
							"aria-hidden": "true",
							children: dn(e, P)
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
			}), /* @__PURE__ */ _("div", {
				className: "cad-workspace-panel-manager__placement",
				role: "group",
				"aria-label": `${e.label} placement`,
				children: [
					e.placements.includes(Q.DOCK) && /* @__PURE__ */ _("button", {
						type: "button",
						"aria-label": `Dock ${e.label}`,
						"aria-pressed": t.placement === Q.DOCK,
						disabled: e.disabled || e.preferenceLocked || !a,
						onClick: o.dock,
						children: [/* @__PURE__ */ g("span", {
							"aria-hidden": "true",
							children: "▣"
						}), "DOCK"]
					}),
					e.placements.includes(Q.FLOAT) && /* @__PURE__ */ _("button", {
						type: "button",
						"aria-label": `Float ${e.label}`,
						"aria-pressed": t.placement === Q.FLOAT,
						disabled: e.disabled || e.preferenceLocked || !a,
						onClick: o.float,
						children: [/* @__PURE__ */ g("span", {
							"aria-hidden": "true",
							children: "◇"
						}), "FLOAT"]
					}),
					/* @__PURE__ */ g("output", {
						"aria-label": `${e.label} placement: ${fn(t.placement).toLocaleLowerCase()}`,
						children: fn(t.placement)
					}),
					!e.preferenceLocked && /* @__PURE__ */ g("button", {
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
	return /* @__PURE__ */ g(gt, {
		...L,
		id: ie,
		className: J("cad-workspace-panel-manager", F),
		contentClassName: J("cad-workspace-panel-manager__surface", I),
		trigger: G,
		open: v,
		defaultOpen: y,
		onOpenChange: b,
		placement: O,
		label: x,
		contentRole: "dialog",
		content: ({ close: t }) => /* @__PURE__ */ _("section", {
			className: "cad-workspace-panel-manager__content",
			"aria-describedby": S ? `${ie}-description` : void 0,
			children: [
				/* @__PURE__ */ _("header", {
					className: "cad-workspace-panel-manager__header",
					children: [/* @__PURE__ */ _("div", { children: [
						/* @__PURE__ */ g("span", {
							className: "cad-workspace-panel-manager__eyebrow",
							children: "WORKSPACE"
						}),
						/* @__PURE__ */ g("h2", { children: x }),
						S && /* @__PURE__ */ g("p", {
							id: `${ie}-description`,
							children: S
						})
					] }), /* @__PURE__ */ _("div", {
						className: "cad-workspace-panel-manager__header-actions",
						children: [D && /* @__PURE__ */ g("output", {
							className: "cad-workspace-panel-manager__scope",
							children: D
						}), /* @__PURE__ */ g("button", {
							type: "button",
							className: "cad-workspace-panel-manager__close",
							"aria-label": K,
							title: K,
							onClick: t,
							children: "×"
						})]
					})]
				}),
				H.length > 0 ? /* @__PURE__ */ _(h, { children: [/* @__PURE__ */ _("div", {
					className: "cad-workspace-panel-manager__summary",
					"aria-label": "Workspace panel summary",
					children: [/* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("b", { children: te }), " VISIBLE"] }), /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("b", { children: U }), " FLOATING"] })]
				}), /* @__PURE__ */ g("div", {
					className: "cad-workspace-panel-manager__list",
					role: "list",
					children: H.map((t) => /* @__PURE__ */ g(e.Fragment, { children: ae(t, ee[t.id]) }, t.id))
				})] }) : /* @__PURE__ */ g("p", {
					className: "cad-workspace-panel-manager__empty",
					role: "status",
					children: k
				}),
				j && H.length > 0 && /* @__PURE__ */ _("footer", {
					className: "cad-workspace-panel-manager__footer",
					children: [/* @__PURE__ */ _("button", {
						type: "button",
						"aria-label": A,
						onClick: ne,
						children: [
							/* @__PURE__ */ g("span", {
								"aria-hidden": "true",
								children: "↺"
							}),
							" ",
							A
						]
					}), /* @__PURE__ */ g("span", { children: "Host-owned layout state" })]
				})
			]
		})
	});
}
var mn = pn, hn = (e) => String(e ?? "").trim(), gn = "model", _n = (e) => {
	let t = hn(e).toLowerCase();
	return /^[a-z0-9][a-z0-9-]{0,63}$/.test(t) ? t : "";
}, vn = (e, t) => hn(e).replace(/\s+/g, " ").slice(0, 48) || t;
function yn(e, { modelId: t = gn, modelName: n = "Model" } = {}) {
	let r = _n(t) || "model", i = Array.isArray(e) ? e : Array.isArray(e?.profiles) ? e.profiles : [], a = /* @__PURE__ */ new Set(), o = i.reduce((e, t, i) => {
		let o = _n(t?.id) || (i === 0 ? r : "");
		return !o || a.has(o) ? e : (a.add(o), e.push({
			...t,
			id: o,
			name: vn(t?.name ?? t?.label, o === r ? n : `Layout ${e.length}`),
			system: o === r || !!t?.system
		}), e);
	}, []), s = o.findIndex((e) => e.id === r);
	return [s >= 0 ? {
		...o[s],
		id: r,
		name: vn(o[s].name, n),
		system: !0
	} : {
		id: r,
		name: n,
		system: !0
	}, ...o.filter((e) => e.id !== r)];
}
function bn(e, { prefix: t = "Layout", modelId: n = gn } = {}) {
	let r = yn(e, { modelId: n }), i = new Set(r.map((e) => e.name.toLocaleLowerCase())), a = Math.max(1, r.filter((e) => e.id !== n).length + 1), o = `${hn(t) || "Layout"} ${a}`;
	for (; i.has(o.toLocaleLowerCase());) a += 1, o = `${hn(t) || "Layout"} ${a}`;
	return o;
}
function xn(e, { id: t, name: n, modelId: r = gn, modelName: i = "Model", prefix: a = "Layout", ...o } = {}) {
	let s = yn(e, {
		modelId: r,
		modelName: i
	}), c = new Set(s.map((e) => e.id)), l = _n(t) || "layout", u = l, d = 1;
	for (; c.has(u);) d += 1, u = `${l}-${d}`;
	return [...s, {
		...o,
		id: u,
		name: vn(n, bn(s, {
			prefix: a,
			modelId: r
		})),
		system: !1
	}];
}
function Sn(e, t, n, { modelId: r = gn, modelName: i = "Model" } = {}) {
	let a = _n(t);
	return !a || !hn(n) ? yn(e, {
		modelId: r,
		modelName: i
	}) : yn(e, {
		modelId: r,
		modelName: i
	}).map((e) => e.id === a ? {
		...e,
		name: vn(n, e.name)
	} : e);
}
function Cn(e, t, n, { modelId: r = gn, modelName: i = "Model" } = {}) {
	let a = yn(e, {
		modelId: r,
		modelName: i
	}), o = _n(t), s = o && o !== r ? a.filter((e) => e.id !== o) : a;
	return {
		profiles: s,
		activeId: s.some((e) => e.id === n) ? n : r
	};
}
//#endregion
//#region src/CadWorkspaceUi.jsx
var wn = (e) => Y(e).find((e) => !e?.disabled)?.id || "", Tn = (e, t) => typeof e == "string" ? {
	id: `${e}-${t}`,
	label: e
} : {
	id: e?.id || `${X(e)}-${t}`,
	label: X(e),
	detail: e?.detail,
	tone: e?.tone
};
function En({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, onCreate: a, onContextMenu: o, onRename: s, onOverflow: c, addLabel: l = "New layout", addButtonProps: f = {}, overflowLabel: p = "More drawing spaces", overflowButtonProps: m = {}, ariaLabel: h = "Drawing spaces", className: v, ...y }) {
	let b = u(), x = d(() => Y(e).map((e, t) => ({
		...e,
		id: e?.id || `space-${t}`
	})), [e]), [S, C] = Z(t, n || wn(x), (e, t, n) => r?.(e, t, n)), w = x.some((e) => e.id === S) ? S : wn(x), T = (e, t) => {
		!e || e.disabled || C(e.id, e, t);
	}, E = (e) => document.getElementById(`cad-space-tab-${b}-${e.id}`)?.focus(), D = (e, t) => {
		let n = x.filter((e) => !e.disabled);
		if (!n.length) return;
		let r = n[(Math.max(0, n.findIndex((e) => e.id === w)) + t + n.length) % n.length];
		e.preventDefault(), T(r, e), E(r);
	};
	return /* @__PURE__ */ g("nav", {
		...y,
		className: J("cad-drawing-space-tabs", v),
		"aria-label": h,
		children: /* @__PURE__ */ _("div", {
			className: "cad-drawing-space-tabs__strip",
			children: [
				/* @__PURE__ */ g("div", {
					className: "cad-drawing-space-tabs__scroll",
					role: "tablist",
					"aria-label": h,
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
						return /* @__PURE__ */ _("div", {
							className: J("cad-drawing-space-tabs__item", r && "cad-drawing-space-tabs__item--active"),
							"data-kind": e?.kind || "layout",
							"data-dirty": e?.dirty ? "true" : "false",
							onContextMenu: (t) => {
								o && (t.preventDefault(), o(e, t));
							},
							children: [/* @__PURE__ */ _("button", {
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
									l && /* @__PURE__ */ g(l, {
										size: 12,
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ g("span", { children: X(e) }),
									e?.dirty && /* @__PURE__ */ g("i", {
										"aria-label": "Unsaved changes",
										title: "Unsaved changes"
									})
								]
							}), c && /* @__PURE__ */ g("button", {
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
				a && /* @__PURE__ */ g("button", {
					...f,
					type: "button",
					className: J("cad-drawing-space-tabs__add", f.className),
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
var Dn = En, On = En;
function kn({ profiles: e = [], activeId: t, onChange: n, onCreate: r, onClose: i, onRename: a, modelId: o = gn, modelName: s = "Model", className: c, ...l }) {
	let u = d(() => yn(e, {
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
	return /* @__PURE__ */ g(En, {
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
function An({ title: e, icon: t, actions: n, collapsible: r = !1, collapsed: i, defaultCollapsed: a = !1, onCollapsedChange: o, className: s, children: c, ...l }) {
	let d = `cad-dock-panel-body-${u()}`, [f, p] = Z(i, a, (e, t) => o?.(e, t));
	return /* @__PURE__ */ _("section", {
		...l,
		className: J("cad-dock-panel", f && "cad-dock-panel--collapsed", s),
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
function jn({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, label: a = "Docked panels", className: o, children: s, renderPanel: c, ...l }) {
	let d = u(), [f, p] = Z(t, n || wn(e), (e, t, n) => r?.(e, t, n)), m = Y(e).find((e) => e?.id === f) || Y(e).find((e) => !e?.disabled), h = (e, t) => {
		!e || e.disabled || p(e.id, e, t);
	}, v = (t) => {
		if (!t.target.closest("[role=\"tab\"]")) return;
		let n = Y(e).filter((e) => !e?.disabled);
		if (!n.length) return;
		let r = Math.max(0, n.findIndex((e) => e.id === m?.id)), i;
		t.key === "ArrowRight" && (i = n[(r + 1) % n.length]), t.key === "ArrowLeft" && (i = n[(r - 1 + n.length) % n.length]), t.key === "Home" && (i = n[0]), t.key === "End" && (i = n[n.length - 1]), i && (t.preventDefault(), h(i, t), document.getElementById(`cad-dock-tab-${d}-${i.id}`)?.focus());
	}, y = m?.panelId || `cad-dock-panel-${d}-${m?.id || "empty"}`;
	return /* @__PURE__ */ _("section", {
		...l,
		className: J("cad-dock-tabs", o),
		children: [/* @__PURE__ */ g("div", {
			className: "cad-dock-tabs__list",
			role: "tablist",
			"aria-label": a,
			onKeyDown: v,
			children: Y(e).map((e, t) => {
				let n = e?.id === m?.id, r = e?.icon;
				return /* @__PURE__ */ _("div", {
					className: J("cad-dock-tabs__tab-wrap", n && "cad-dock-tabs__tab-wrap--active"),
					children: [/* @__PURE__ */ _("button", {
						id: `cad-dock-tab-${d}-${e?.id}`,
						type: "button",
						role: "tab",
						"aria-selected": n,
						"aria-controls": n ? y : e?.panelId,
						disabled: e?.disabled,
						tabIndex: n ? 0 : -1,
						onClick: (t) => h(e, t),
						children: [
							r && /* @__PURE__ */ g(r, {
								size: 12,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ g("span", { children: X(e) }),
							e?.badge && /* @__PURE__ */ g("em", { children: e.badge })
						]
					}), i && e?.closable && /* @__PURE__ */ g("button", {
						type: "button",
						className: "cad-dock-tabs__close",
						"aria-label": `Close ${X(e)}`,
						onClick: (t) => i(e, t),
						children: "×"
					})]
				}, e?.id || t);
			})
		}), /* @__PURE__ */ g("div", {
			id: y,
			className: "cad-dock-tabs__panel",
			role: "tabpanel",
			"aria-labelledby": m ? `cad-dock-tab-${d}-${m.id}` : void 0,
			children: m ? c?.(m) ?? m.content ?? m.children : s
		})]
	});
}
function Mn({ mode: e, label: t, active: n, disabled: r = !1, shortcut: i, tone: a = "inherit", onChange: o, className: s }) {
	let c = t || X(e), l = n ?? e?.active ?? !1, u = r || e?.disabled;
	return /* @__PURE__ */ _("button", {
		type: "button",
		className: J("cad-status-toggle", s),
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
var Nn = (e) => e == null || e === "" ? "" : typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map((e, t) => `${"XYZ"[t] || t}: ${e}`).join("  ") : [
	"x",
	"y",
	"z"
].filter((t) => e[t] !== void 0).map((t) => `${t.toUpperCase()}: ${e[t]}`).join("  ");
function Pn({ coordinates: e, coordinateLabel: t = "Coordinates", modes: n = [], onModeChange: r, units: i, scale: a, message: o, className: s, children: c, ...l }) {
	let u = Nn(e);
	return /* @__PURE__ */ _("footer", {
		...l,
		className: J("cad-status-bar", s),
		"aria-label": "CAD status bar",
		children: [
			u && /* @__PURE__ */ g("output", {
				className: "cad-status-bar__coordinates",
				"aria-label": t,
				children: u
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-status-bar__modes",
				role: "group",
				"aria-label": "Drafting modes",
				children: Y(n).map((e, t) => /* @__PURE__ */ g(Mn, {
					mode: e,
					onChange: (t, n, i) => {
						e?.onChange?.(t, n, i), r?.(e?.id, t, n, i);
					}
				}, e?.id || X(e) || t))
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
			c
		]
	});
}
function Fn({ items: e = [], label: t = "Command history", onSelect: n, className: r }) {
	let i = d(() => Y(e).map(Tn), [e]);
	return /* @__PURE__ */ g("ol", {
		className: J("cad-command-history", r),
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
function In({ options: e = [], label: t = "Command options", onSelect: n, className: r }) {
	return /* @__PURE__ */ g("div", {
		className: J("cad-command-options", r),
		role: "group",
		"aria-label": t,
		children: Y(e).map((e, t) => {
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
				children: [X(r), r?.shortcut && /* @__PURE__ */ g("kbd", { children: r.shortcut })]
			}, r?.id || t);
		})
	});
}
var Ln = (e, t, n, r) => {
	let i = Number(e), a = Number(t);
	return Math.min(r, Math.max(n, Math.round(Number.isFinite(i) ? i : Number.isFinite(a) ? a : 152)));
};
function Rn({ value: e, defaultValue: t = "", onChange: n, onSubmit: r, prompt: i = "Command:", history: a = [], suggestions: o = [], options: s = [], onSuggestionSelect: c, onOptionSelect: l, clearOnSubmit: f = !0, submitSuggestionOnEnter: h = !1, disabled: v = !1, placeholder: y = "Type a command or search", showHistory: b = !0, height: x, defaultHeight: S = 152, minHeight: C = 72, maxHeight: w = 360, resizeStep: T = 8, resizable: E = !0, onHeightChange: D, className: O, inputProps: k = {}, style: A, id: j, ...M }) {
	let N = u(), [P, F] = Z(e, t, (e, t) => n?.(e, t)), I = Number(C), L = Math.max(48, Number.isFinite(I) ? Math.round(I) : 72), R = Number(w), z = Math.max(L, Number.isFinite(R) ? Math.round(R) : 360), ee = Ln(S, 152, L, z), [B, V] = Z(x, ee, (e, t) => D?.(e, t)), H = Ln(B, ee, L, z), te = Math.max(1, Number.isFinite(Number(T)) ? Math.round(Number(T)) : 8), U = p(null), [W, ne] = m(!1), [re, G] = m(-1), K = d(() => Y(o).map(Tn), [o]), ie = `cad-command-suggestions-${N}`, ae = j || `cad-command-line-${N}`, q = (e, t) => {
		let n = Ln(typeof e == "function" ? e(H) : e, H, L, z);
		n !== H && V(n, t);
	}, oe = (e) => {
		if (!U.current) return;
		let t = U.current.pointerId;
		U.current = null, e?.currentTarget?.hasPointerCapture?.(t) && e.currentTarget.releasePointerCapture?.(t);
	}, se = (e) => {
		!E || e.button !== 0 || (e.preventDefault(), U.current = {
			pointerId: e.pointerId,
			startY: e.clientY,
			startHeight: H
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, ce = (e) => {
		let t = U.current;
		!t || t.pointerId !== e.pointerId || q(t.startHeight + t.startY - e.clientY, e);
	}, le = (e, t, n = !1) => {
		e && (F(e.label, t), c?.(e, t), n && (r?.(e.label, t), f && F("", t)), G(-1));
	}, ue = (e) => {
		if (e.preventDefault(), re >= 0 && K[re]) {
			le(K[re], e, h);
			return;
		}
		let t = String(P ?? "").trim();
		t && (r?.(t, e), f && F("", e));
	}, de = W && K.length > 0, fe = s.length > 0 || b && a.length > 0;
	return /* @__PURE__ */ _("section", {
		...M,
		id: ae,
		className: J("cad-command-line", O),
		style: {
			...A,
			"--cad-command-line-height": `${H}px`
		},
		"aria-label": "CAD command line",
		children: [
			E && /* @__PURE__ */ g("div", {
				className: "cad-command-line__resize-handle",
				role: "separator",
				tabIndex: 0,
				"aria-label": "Resize command line",
				"aria-controls": ae,
				"aria-orientation": "horizontal",
				"aria-valuemin": L,
				"aria-valuemax": z,
				"aria-valuenow": H,
				"aria-valuetext": `${H} pixels`,
				onPointerDown: se,
				onPointerMove: ce,
				onPointerUp: oe,
				onPointerCancel: oe,
				onKeyDown: (e) => {
					let t = e.shiftKey ? te * 3 : te;
					e.key === "ArrowUp" && (e.preventDefault(), q(H + t, e)), e.key === "ArrowDown" && (e.preventDefault(), q(H - t, e)), e.key === "PageUp" && (e.preventDefault(), q(H + t * 3, e)), e.key === "PageDown" && (e.preventDefault(), q(H - t * 3, e)), e.key === "Home" && (e.preventDefault(), q(L, e)), e.key === "End" && (e.preventDefault(), q(z, e));
				}
			}),
			/* @__PURE__ */ _("form", {
				className: "cad-command-line__form",
				onSubmit: ue,
				children: [
					/* @__PURE__ */ g("label", {
						htmlFor: `cad-command-input-${N}`,
						className: "cad-command-line__prompt",
						children: i
					}),
					/* @__PURE__ */ g("input", {
						...k,
						id: `cad-command-input-${N}`,
						className: "cad-command-line__input",
						value: P ?? "",
						disabled: v,
						placeholder: y,
						autoComplete: "off",
						role: "combobox",
						"aria-autocomplete": K.length ? "list" : void 0,
						"aria-expanded": de,
						"aria-controls": ie,
						"aria-activedescendant": de && re >= 0 ? `${ie}-${re}` : void 0,
						onFocus: (e) => {
							ne(!0), k.onFocus?.(e);
						},
						onBlur: (e) => {
							ne(!1), G(-1), k.onBlur?.(e);
						},
						onChange: (e) => {
							F(e.target.value, e), G(-1), k.onChange?.(e);
						},
						onKeyDown: (e) => {
							e.key === "ArrowDown" && K.length && (e.preventDefault(), G((e) => (e + 1) % K.length)), e.key === "ArrowUp" && K.length && (e.preventDefault(), G((e) => (e - 1 + K.length) % K.length)), e.key === "Escape" && (G(-1), ne(!1), e.currentTarget.blur()), k.onKeyDown?.(e);
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
			de && /* @__PURE__ */ g("div", {
				id: ie,
				className: "cad-command-line__suggestions",
				role: "listbox",
				"aria-label": "Command suggestions",
				children: K.map((e, t) => /* @__PURE__ */ _("button", {
					id: `${ie}-${t}`,
					type: "button",
					role: "option",
					"aria-selected": re === t,
					"data-active": re === t ? "true" : "false",
					onMouseDown: (e) => e.preventDefault(),
					onClick: (t) => le(e, t),
					children: [/* @__PURE__ */ g("strong", { children: e.label }), e.detail && /* @__PURE__ */ g("small", { children: e.detail })]
				}, e.id))
			}),
			fe && /* @__PURE__ */ _("div", {
				className: "cad-command-line__transcript",
				children: [s.length > 0 && /* @__PURE__ */ g(In, {
					options: s,
					onSelect: l
				}), b && a.length > 0 && /* @__PURE__ */ g(Fn, {
					items: a,
					onSelect: (e, t) => F(e.label, t)
				})]
			})
		]
	});
}
function zn({ activeView: e = "top", onViewChange: t, className: n, label: r = "View cube" }) {
	return /* @__PURE__ */ _("div", {
		className: J("cad-view-cube", n),
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
function Bn({ xLabel: e = "X", yLabel: t = "Y", zLabel: n = "Z", className: r, label: i = "UCS orientation" }) {
	return /* @__PURE__ */ _("svg", {
		className: J("cad-ucs-indicator", r),
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
function Vn({ activeView: e, onViewChange: t, onZoomIn: n, onZoomOut: r, onZoomExtents: i, showCube: a = !0, showUcs: o = !0, className: s }) {
	return /* @__PURE__ */ _("aside", {
		className: J("cad-viewport-controls", s),
		"aria-label": "Viewport controls",
		children: [
			a && /* @__PURE__ */ g(zn, {
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
			o && /* @__PURE__ */ g(Bn, {})
		]
	});
}
function Hn({ count: e = 0, entityLabel: t = "objects", fields: n = [], emptyLabel: r = "Nothing selected", className: i }) {
	return /* @__PURE__ */ _("output", {
		className: J("cad-selection-summary", i),
		"aria-live": "polite",
		children: [/* @__PURE__ */ g("strong", { children: e ? `${e} ${t}` : r }), Y(n).length > 0 && /* @__PURE__ */ g("span", { children: Y(n).map((e, t) => /* @__PURE__ */ _("small", { children: [
			e?.label,
			": ",
			/* @__PURE__ */ g("b", { children: e?.value })
		] }, e?.id || t)) })]
	});
}
function Un({ distance: e, angle: t, area: n, volume: r, className: i, label: a = "Measurement" }) {
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
		className: J("cad-measure-readout", i),
		"aria-label": a,
		children: o.map((e) => /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("small", { children: e.label }), /* @__PURE__ */ g("b", { children: e.value })] }, e.id))
	}) : null;
}
//#endregion
//#region src/CadWorkspaceDockUi.jsx
var Wn = Object.freeze({
	OPEN: "open",
	RAIL: "rail",
	CLOSED: "closed"
}), Gn = new Set(Object.values(Wn)), Kn = /* @__PURE__ */ new Set([
	"left",
	"right",
	"top",
	"bottom"
]), qn = /* @__PURE__ */ new Set([
	"left",
	"right",
	"bottom"
]), Jn = (e, t) => {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, Yn = (e, t, n, r) => Ee(Math.round(Jn(e, t)), n, r), Xn = (e, t) => {
	let n = Math.max(0, Math.round(Jn(e, 72)));
	return {
		minimum: n,
		maximum: Math.max(n, Math.round(Jn(t, 720)))
	};
}, Zn = (e) => Math.max(1, Math.round(Jn(e, 16))), Qn = (e, t = Wn.OPEN) => {
	let n = String(e ?? "").trim().toLocaleLowerCase();
	return Gn.has(n) ? n : t;
}, $n = (e) => Kn.has(e) ? e : "left", er = (e) => qn.has(e) ? e : "left", tr = (e) => {
	let t = $n(e), n = t === "left" || t === "right", r = t === "left" || t === "top";
	return {
		edge: t,
		axis: n ? "x" : "y",
		orientation: n ? "vertical" : "horizontal",
		growsWithPositiveMovement: r,
		growKey: n ? r ? "ArrowRight" : "ArrowLeft" : r ? "ArrowDown" : "ArrowUp",
		shrinkKey: n ? r ? "ArrowLeft" : "ArrowRight" : r ? "ArrowUp" : "ArrowDown"
	};
}, nr = (e, t) => e ? e.pointerId === null || t?.pointerId === null || t?.pointerId === void 0 || t.pointerId === e.pointerId : !1;
function rr({ mode: e, defaultMode: t = Wn.OPEN, onModeChange: n, size: r, defaultSize: i = 280, minSize: a = 72, maxSize: s = 720, onSizeChange: c } = {}) {
	let { minimum: l, maximum: u } = Xn(a, s), d = Qn(t), f = Yn(i, 280, l, u), [p, m] = Z(e, d, (e, t, r) => n?.(Qn(e, d), t, r)), [h, g] = Z(r, f, (e, t, n) => c?.(Yn(e, f, l, u), t, n)), _ = Qn(p, d), v = Yn(h, f, l, u), y = o((e, t, n = "programmatic") => {
		let r = Qn(typeof e == "function" ? e(_) : e, _), i = {
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
			let i = Yn(typeof e == "function" ? e(v) : e, v, l, u), a = {
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
		open: o((e, t = "open") => y(Wn.OPEN, e, t), [y]),
		rail: o((e, t = "rail") => y(Wn.RAIL, e, t), [y]),
		close: o((e, t = "close") => y(Wn.CLOSED, e, t), [y]),
		isOpen: _ === Wn.OPEN,
		isRail: _ === Wn.RAIL,
		isClosed: _ === Wn.CLOSED
	};
}
function ir({ mode: e, defaultMode: t = Wn.OPEN, onModeChange: n, label: r = "Workspace dock", controls: i, disabled: a = !1, openDisabled: o = !1, railDisabled: s = !1, hideDisabled: c = !1, openLabel: l, railLabel: u, hideLabel: d, onOpenClick: f, onRailClick: p, onHideClick: m, className: h, "aria-label": v, "aria-controls": y, ...b }) {
	let x = rr({
		mode: e,
		defaultMode: t,
		onModeChange: n
	}), S = y || i, C = String(r || "Workspace dock"), w = [
		{
			mode: Wn.OPEN,
			label: l || `Open ${C}`,
			caption: "OPEN",
			symbol: "▤",
			disabled: a || o,
			onClick: f
		},
		{
			mode: Wn.RAIL,
			label: u || `Rail ${C}`,
			caption: "RAIL",
			symbol: "▥",
			disabled: a || s,
			onClick: p
		},
		{
			mode: Wn.CLOSED,
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
		className: J("cad-workspace-dock-mode-control", h),
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
var ar = i(function({ size: e, defaultSize: t = 280, minSize: n = 72, maxSize: r = 720, resizeStep: i = 16, edge: a = "left", onSizeChange: s, onResizeStart: c, onResizeEnd: u, disabled: f = !1, label: h = "dock", separatorLabel: _, controls: v, className: y, children: b, onPointerDown: x, onPointerMove: S, onPointerUp: C, onPointerCancel: w, onLostPointerCapture: T, onKeyDown: E, "aria-label": D, "aria-controls": O, ...k }, A) {
	let j = rr({
		size: e,
		defaultSize: t,
		minSize: n,
		maxSize: r,
		onSizeChange: s
	}), M = d(() => tr(a), [a]), N = Zn(i), P = p(null), F = p(null), I = p(j.size), L = p(j.setSize), R = p(c), z = p(u), [ee, B] = m(!1);
	L.current = j.setSize, R.current = c, z.current = u, l(() => {
		P.current || (I.current = j.size);
	}, [j.size]);
	let V = o((e) => {
		try {
			e?.pointerId !== null && e?.pointerId !== void 0 && e?.handle?.hasPointerCapture?.(e.pointerId) && e.handle.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []), H = o(() => {
		let e = F.current;
		F.current = null, !(!e || typeof window > "u") && (window.removeEventListener("pointermove", e.pointerMove), window.removeEventListener("pointerup", e.pointerEnd), window.removeEventListener("pointercancel", e.pointerCancel));
	}, []), te = o((e) => {
		let t = P.current;
		if (!t || !nr(t, e) || e.defaultPrevented) return;
		let n = t.axis === "x" ? Number(e.clientX) : Number(e.clientY);
		if (!Number.isFinite(n)) return;
		let r = (n - t.startCoordinate) * (t.growsWithPositiveMovement ? 1 : -1), i = Yn(t.startSize + r, t.startSize, t.minSize, t.maxSize);
		I.current = i, L.current?.(i, e, "pointer", {
			edge: t.edge,
			orientation: t.orientation,
			axis: t.axis
		});
	}, []), U = o((e, t = !1) => {
		let n = P.current;
		if (!n || !nr(n, e)) return;
		P.current = null, H(), V(n), B(!1);
		let r = Yn(I.current, n.startSize, n.minSize, n.maxSize);
		I.current = r, z.current?.(r, {
			changed: r !== n.startSize,
			source: "pointer",
			edge: n.edge,
			orientation: n.orientation,
			axis: n.axis,
			cancelled: !!t
		}, e);
	}, [V, H]), W = o((e) => U(e, !1), [U]), ne = o((e) => U(e, !0), [U]);
	l(() => () => {
		let e = P.current;
		if (!e) return;
		P.current = null, H(), V(e);
		let t = Yn(I.current, e.startSize, e.minSize, e.maxSize);
		z.current?.(t, {
			changed: t !== e.startSize,
			source: "pointer",
			edge: e.edge,
			orientation: e.orientation,
			axis: e.axis,
			cancelled: !0,
			reason: "unmount"
		});
	}, [V, H]), l(() => {
		f && U(void 0, !0);
	}, [f, U]);
	let re = (e) => {
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
		if (B(!0), R.current?.(j.size, {
			source: "pointer",
			edge: M.edge,
			orientation: M.orientation,
			axis: M.axis
		}, e), typeof window < "u") {
			let e = {
				pointerMove: te,
				pointerEnd: W,
				pointerCancel: ne
			};
			F.current = e, window.addEventListener("pointermove", e.pointerMove), window.addEventListener("pointerup", e.pointerEnd), window.addEventListener("pointercancel", e.pointerCancel);
		}
	}, G = (e, t) => {
		let n = Yn(I.current, j.size, j.minSize, j.maxSize), r = Yn(n + e, n, j.minSize, j.maxSize);
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
	}, ie = (e) => {
		if (E?.(e), f || e.defaultPrevented) return;
		let t = N * (e.shiftKey ? 3 : 1);
		if (e.key === M.growKey) {
			e.preventDefault(), G(t, e);
			return;
		}
		if (e.key === M.shrinkKey) {
			e.preventDefault(), G(-t, e);
			return;
		}
		if (e.key === "PageUp") {
			e.preventDefault(), G(t * 3, e);
			return;
		}
		if (e.key === "PageDown") {
			e.preventDefault(), G(-t * 3, e);
			return;
		}
		if (e.key === "Home") {
			e.preventDefault(), K("min", e);
			return;
		}
		e.key === "End" && (e.preventDefault(), K("max", e));
	}, ae = O || v, q = D || _ || `Resize ${h}`;
	return /* @__PURE__ */ g("div", {
		...k,
		ref: A,
		className: J("cad-workspace-dock-resize-handle", y),
		"data-edge": M.edge,
		"data-orientation": M.orientation,
		"data-resizing": ee ? "true" : "false",
		"data-disabled": f ? "true" : "false",
		role: "separator",
		tabIndex: f ? -1 : 0,
		"aria-label": q,
		"aria-controls": ae,
		"aria-disabled": f || void 0,
		"aria-orientation": M.orientation,
		"aria-valuemin": j.minSize,
		"aria-valuemax": j.maxSize,
		"aria-valuenow": j.size,
		"aria-valuetext": `${j.size} pixels`,
		onPointerDown: re,
		onPointerMove: S,
		onPointerUp: (e) => {
			C?.(e), U(e, !1);
		},
		onPointerCancel: (e) => {
			w?.(e), U(e, !0);
		},
		onLostPointerCapture: (e) => {
			T?.(e), U(e, !0);
		},
		onKeyDown: ie,
		children: b || /* @__PURE__ */ g("span", {
			className: "cad-workspace-dock-resize-handle__grip",
			"aria-hidden": "true"
		})
	});
});
ar.displayName = "CadWorkspaceDockResizeHandle";
function or({ peekOpen: e, defaultPeekOpen: t = !1, onPeekOpenChange: n, edge: r = "left" } = {}) {
	let i = er(r), [a, s] = Z(e, !!t, (e, t, r) => n?.(!!e, t, r)), c = !!a, l = o((e, t, n = "programmatic") => {
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
var sr = (e, t) => {
	if (!e || !t) return !1;
	try {
		return e === t || !!e.contains?.(t);
	} catch {
		return !1;
	}
};
function cr({ edge: e = "left", label: t = "Workspace dock", previewLabel: n, expandLabel: r, children: i, peekOpen: a, defaultPeekOpen: o = !1, onPeekOpenChange: s, onExpand: c, disabled: l = !1, id: d, controls: f, className: m, railClassName: h, previewClassName: v, onPointerEnter: y, onPointerLeave: b, onFocusCapture: x, onBlurCapture: S, onKeyDown: C, "aria-label": w, ...T }) {
	let E = u(), D = p(null), O = p({
		pointer: !1,
		focus: !1,
		dismissed: !1
	}), k = er(e), A = d || `cad-workspace-dock-rail-${E}`, j = `${A}-label`, M = `${A}-preview`, N = or({
		edge: k,
		peekOpen: a,
		defaultPeekOpen: o,
		onPeekOpenChange: s
	}), P = !l && N.peekOpen, F = String(t || "Workspace dock"), I = n || `${F} preview`, L = r || `Expand ${F}`, R = (e, t) => {
		l || (O.current.dismissed = !1, N.openPeek(e, t));
	}, z = (e, t) => {
		let n = O.current;
		l || n.pointer || n.focus || (n.dismissed = !1, N.closePeek(e, t));
	}, ee = (e) => {
		y?.(e), !(e.defaultPrevented || l) && (O.current.pointer = !0, R(e, "pointer-enter"));
	}, B = (e) => {
		b?.(e), !(e.defaultPrevented || l || sr(e.currentTarget, e.relatedTarget)) && (O.current.pointer = !1, z(e, "pointer-leave"));
	}, V = (e) => {
		x?.(e), !(e.defaultPrevented || l) && (O.current.focus = !0, O.current.dismissed || R(e, "focus-enter"));
	}, H = (e) => {
		S?.(e), !(e.defaultPrevented || l || sr(e.currentTarget, e.relatedTarget)) && (O.current.focus = !1, z(e, "focus-leave"));
	}, te = (e) => {
		C?.(e), !(e.defaultPrevented || l || e.key !== "Escape" || !P) && (e.preventDefault(), O.current.dismissed = !0, N.closePeek(e, "escape"), D.current?.focus());
	}, U = (e) => {
		l || (c?.(e, {
			edge: k,
			label: F,
			previewId: M,
			controls: f || M,
			source: "rail-expand"
		}), e.defaultPrevented || R(e, "expand"));
	};
	return /* @__PURE__ */ _("section", {
		...T,
		id: A,
		className: J("cad-workspace-dock-rail", m),
		"data-edge": k,
		"data-peek-open": P ? "true" : "false",
		"data-disabled": l ? "true" : "false",
		onPointerEnter: ee,
		onPointerLeave: B,
		onFocusCapture: V,
		onBlurCapture: H,
		onKeyDown: te,
		children: [/* @__PURE__ */ _("button", {
			ref: D,
			id: j,
			type: "button",
			className: J("cad-workspace-dock-rail__label", h),
			"aria-label": w || `Preview ${F}`,
			"aria-controls": M,
			"aria-expanded": P,
			disabled: l,
			title: L,
			onClick: U,
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
				/* @__PURE__ */ g("span", { children: F }),
				/* @__PURE__ */ g("small", {
					"aria-hidden": "true",
					children: "PEEK"
				})
			]
		}), /* @__PURE__ */ g("aside", {
			id: M,
			className: J("cad-workspace-dock-rail__preview", v),
			"data-edge": k,
			role: "region",
			"aria-label": n ? I : void 0,
			"aria-labelledby": n ? void 0 : j,
			"aria-hidden": !P,
			hidden: !P,
			children: i
		})]
	});
}
function lr({ edge: e = "left", panels: t = [], activeId: n, defaultActiveId: r, onActiveChange: i, onPanelClose: a, label: s = "Docked panels", tabsLabel: c, compactTabs: l = !1, renderPanel: u, children: d, id: f, className: p, tabsClassName: m, panelClassName: h, emptyLabel: _ = "No panels are available in this dock.", ...v }) {
	let y = er(e), b = Y(t), x = o((e) => {
		let t = u?.(e), n = t === void 0 ? e?.content ?? e?.children : t;
		return h ? /* @__PURE__ */ g("div", {
			className: h,
			children: n
		}) : n;
	}, [h, u]);
	return /* @__PURE__ */ g("section", {
		...v,
		id: f,
		className: J("cad-workspace-dock-zone", p),
		"data-edge": y,
		"aria-label": s,
		role: "complementary",
		children: b.length > 0 ? /* @__PURE__ */ g(jn, {
			items: b,
			activeId: n,
			defaultActiveId: r,
			onChange: (e, t, n) => i?.(e, t, n),
			onClose: a ? (e, t) => a(e, t) : void 0,
			label: c || s,
			className: J("cad-workspace-dock-zone__tabs", l && "cad-workspace-dock-zone__tabs--compact", m),
			renderPanel: x
		}) : /* @__PURE__ */ g("div", {
			className: "cad-workspace-dock-zone__empty",
			role: "status",
			children: d || _
		})
	});
}
//#endregion
//#region src/CadDraftingUi.jsx
var ur = Object.freeze({
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
}), dr = Object.freeze([
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
]), fr = Object.freeze([
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
]), pr = Object.freeze([
	"1:1",
	"1:2",
	"1:5",
	"1:10",
	"1:20",
	"1:50",
	"1:100"
]), mr = Object.freeze([
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
]), hr = (e) => Y(e).map((e, t) => typeof e == "string" ? {
	id: e,
	label: e
} : {
	...e,
	id: e?.id || `${X(e)}-${t}`,
	label: X(e)
});
function gr({ mode: e = "point", fields: t, value: n, defaultValue: r = {}, onChange: i, onSubmit: a, prompt: o = "Specify point", unit: s = "mm", visible: c = !0, submitLabel: l = "Accept", className: f, children: p, ...m }) {
	let h = u(), v = Y(t).length ? Y(t) : ur[e] || ur.point, y = d(() => v.reduce((e, t) => t?.id && t.value !== void 0 ? {
		...e,
		[t.id]: t.value
	} : e, {}), [v]), [b, x] = Z(n, d(() => ({
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
		className: J("cad-dynamic-input", f),
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
					return e.type === "angle" ? /* @__PURE__ */ g(Le, {
						...r,
						unit: e.unit || "°"
					}, n) : e.type === "unit" ? /* @__PURE__ */ g(Ie, { ...r }, n) : /* @__PURE__ */ g(Fe, { ...r }, n);
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
function _r({ modes: e = dr, activeIds: t, defaultActiveIds: n = [], multiple: r = !0, onChange: i, onClose: a, label: o = "Object snaps", className: s, ...c }) {
	let l = d(() => hr(e), [e]), [u, f] = Z(t, n, (e, t, n) => i?.(e, t, n)), p = new Set(Y(u)), m = (e, t) => {
		if (e.disabled) return;
		let n = r ? p.has(e.id) ? [...p].filter((t) => t !== e.id) : [...p, e.id] : p.has(e.id) ? [] : [e.id];
		f(n, e, t);
	};
	return /* @__PURE__ */ _("aside", {
		...c,
		className: J("cad-object-snap-menu", s),
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
					e.shortcut && /* @__PURE__ */ g(Oe, { shortcut: e.shortcut })
				]
			}, e.id))
		})]
	});
}
function vr({ tools: e = [], selectionCount: t, label: n = "Selection tools", onAction: r, onDismiss: i, className: a, ...o }) {
	return /* @__PURE__ */ _("aside", {
		...o,
		className: J("cad-grip-toolbar", a),
		"aria-label": n,
		children: [
			t !== void 0 && /* @__PURE__ */ _("output", {
				className: "cad-grip-toolbar__selection",
				children: [t, " selected"]
			}),
			/* @__PURE__ */ g("div", {
				role: "group",
				"aria-label": n,
				children: Y(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ g("span", {
					className: "cad-grip-toolbar__separator",
					role: "separator"
				}, e.id || t) : /* @__PURE__ */ g(ke, {
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
function yr({ constraints: e = fr, activeIds: t, defaultActiveIds: n = [], onChange: r, onAction: i, label: a = "Geometric constraints", className: o, ...s }) {
	let c = d(() => hr(e), [e]), [l, u] = Z(t, n, (e, t, n) => r?.(e, t, n)), f = new Set(Y(l)), p = (e, t) => {
		if (e.disabled) return;
		let n = f.has(e.id) ? [...f].filter((t) => t !== e.id) : [...f, e.id];
		u(n, e, t), i?.(e, t);
	};
	return /* @__PURE__ */ g("div", {
		...s,
		className: J("cad-constraint-bar", o),
		role: "group",
		"aria-label": a,
		children: c.map((e) => /* @__PURE__ */ _("button", {
			type: "button",
			"data-active": f.has(e.id) ? "true" : "false",
			"aria-label": e.label,
			"aria-pressed": f.has(e.id),
			disabled: e.disabled,
			title: e.label,
			onClick: (t) => p(e, t),
			children: [/* @__PURE__ */ g("span", {
				"aria-hidden": "true",
				children: e.glyph || "•"
			}), /* @__PURE__ */ g("small", { children: e.shortLabel || e.label })]
		}, e.id))
	});
}
function br({ scales: e = pr, value: t, defaultValue: n, onChange: r, label: i = "Annotation scale", onManage: a, id: o, selectProps: s = {}, disabled: c = !1, className: l, ...f }) {
	let p = u(), m = o || `cad-annotation-scale-${p}`, h = d(() => hr(e), [e]), [v, y] = Z(t, n ?? h[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ _("div", {
		...f,
		className: J("cad-annotation-scale-picker", l),
		children: [
			/* @__PURE__ */ g("label", {
				htmlFor: m,
				children: i
			}),
			/* @__PURE__ */ g("select", {
				...s,
				id: m,
				value: v,
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
function xr({ presets: e = mr, value: t, defaultValue: n, onChange: r, label: i = "View preset", id: a, selectProps: o = {}, disabled: s = !1, className: c, ...l }) {
	let f = u(), p = a || `cad-view-preset-${f}`, m = d(() => hr(e), [e]), [h, v] = Z(t, n ?? m[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ _("div", {
		...l,
		className: J("cad-view-preset-picker", c),
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
function Sr({ angle: e, distance: t, increment: n, active: r, defaultActive: i = !1, onActiveChange: a, className: o, label: s = "Polar tracking", ...c }) {
	let [l, u] = Z(r, i, (e, t) => a?.(e, t));
	return /* @__PURE__ */ _("div", {
		...c,
		className: J("cad-polar-tracker", l && "cad-polar-tracker--active", o),
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
function Cr({ type: e = "endpoint", label: t, active: n = !0, className: r, style: i, ...a }) {
	let o = dr.find((t) => t.id === e)?.glyph || "•";
	return /* @__PURE__ */ _("span", {
		...a,
		className: J("cad-object-snap-marker", n && "cad-object-snap-marker--active", r),
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
function wr({ label: e = "Selection grip", variant: t = "square", active: n = !1, disabled: r = !1, onPointerDown: i, onClick: a, className: o, ...s }) {
	return /* @__PURE__ */ g("button", {
		...s,
		type: "button",
		className: J("cad-selection-grip", n && "cad-selection-grip--active", o),
		"data-variant": t,
		"aria-label": e,
		disabled: r,
		onPointerDown: i,
		onClick: a,
		children: /* @__PURE__ */ g("span", { "aria-hidden": "true" })
	});
}
//#endregion
//#region src/CadLayoutUi.jsx
var Tr = Object.freeze([
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
]), Er = Object.freeze([
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
]), Dr = Object.freeze([
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
]), Or = (e) => Y(e).map((e, t) => typeof e == "string" || typeof e == "number" ? {
	id: String(e),
	label: String(e),
	value: e
} : {
	...e,
	id: e?.id || `${X(e)}-${t}`,
	label: X(e)
}), kr = (e) => typeof e == "string" ? {
	mode: "rgb",
	value: e
} : !e || typeof e != "object" ? { mode: "by-layer" } : {
	...e,
	mode: e.mode || "rgb",
	value: e.value || e.hex
}, Ar = (e) => {
	let t = kr(e);
	return t.mode === "by-layer" ? "ByLayer" : t.mode === "by-block" ? "ByBlock" : t.value || t.hex || "Color";
};
function jr({ orientation: e = "horizontal", size: t, defaultSize: n = 30, minSize: r = 12, maxSize: i = 88, keyboardStep: a = 5, primary: o, secondary: s, onSizeChange: c, onResizeStart: u, onResizeEnd: d, separatorLabel: f = "Resize panels", className: m, ...h }) {
	let v = p(null), y = p(null), b = p(n), x = p(null), S = p(d), C = p(null), w = p(null), T = p(null), E = Number(r), D = Number(i), O = Number.isFinite(E) ? E : 0, k = Math.max(O, Number.isFinite(D) ? D : 100), A = Number(n), j = Ee(Number.isFinite(A) ? A : O, O, k), M = Number(a), N = Number.isFinite(M) && M > 0 ? M : 5, [P, F] = Z(t, n, (e, t, n) => c?.(e, t, n)), I = Number(P), L = Ee(Number.isFinite(I) ? I : j, O, k), R = e === "vertical" ? "y" : "x", z = e === "vertical" ? "horizontal" : "vertical";
	b.current = L, x.current = F, S.current = d, T.current ||= () => {
		typeof window > "u" || (window.removeEventListener("pointermove", C.current), window.removeEventListener("pointerup", w.current), window.removeEventListener("pointercancel", w.current));
	}, C.current ||= (e) => {
		let t = y.current, n = v.current;
		if (!t || !n || t.pointerId !== null && e.pointerId !== t.pointerId) return;
		let r = n.getBoundingClientRect(), i = t.orientation === "vertical" ? r.height : r.width, a = t.orientation === "vertical" ? e.clientY - r.top : e.clientX - r.left;
		if (!Number.isFinite(i) || i <= 0 || !Number.isFinite(a)) return;
		let o = Ee(Math.round(a / Math.max(i, 1) * 100 * 10) / 10, t.minSize, t.maxSize);
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
		let n = Ee(Number(b.current), t.minSize, t.maxSize);
		b.current = n, S.current?.(n, e);
	}, l(() => () => {
		let e = y.current;
		y.current = null, T.current?.();
		try {
			e?.pointerId !== null && e?.pointerId !== void 0 && e.divider?.releasePointerCapture?.(e.pointerId);
		} catch {}
	}, []);
	let ee = (t) => {
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
	}, B = (e, t) => {
		let n = Ee(Ee(Number(b.current), O, k) + e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: R
		}, t);
	}, V = (e, t) => {
		let n = Ee(e, O, k);
		b.current = n, x.current?.(n, {
			source: "keyboard",
			axis: R
		}, t);
	};
	return /* @__PURE__ */ _("section", {
		...h,
		ref: v,
		className: J("cad-split-pane", `cad-split-pane--${e}`, m),
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
				onPointerDown: ee,
				onPointerCancel: w.current,
				onLostPointerCapture: w.current,
				onKeyDown: (t) => {
					let n = e === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"], r = e === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
					if (n.includes(t.key)) {
						t.preventDefault(), B(N, t);
						return;
					}
					if (r.includes(t.key)) {
						t.preventDefault(), B(-N, t);
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
function Mr({ item: e, open: t, onToggle: n, onAction: r, onClose: i }) {
	let a = Or(e?.items), o = `cad-menu-bar-popup-${u()}`, s = a.length > 0;
	return /* @__PURE__ */ _("div", {
		className: J("cad-menu-bar__menu", t && "cad-menu-bar__menu--open"),
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
			children: [X(e), e?.shortcut && /* @__PURE__ */ g(Oe, { shortcut: e.shortcut })]
		}), t && /* @__PURE__ */ g("div", {
			id: o,
			className: "cad-menu-bar__popup",
			role: "menu",
			"aria-label": X(e),
			children: a.map((e) => e.type === "separator" ? /* @__PURE__ */ g("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ g(Nr, {
				item: e,
				onAction: r,
				onClose: i
			}, e.id))
		})]
	});
}
function Nr({ item: e, onAction: t, onClose: n, className: r }) {
	let i = Or(e?.items), a = i.length > 0, [o, s] = Z(void 0, !1);
	return /* @__PURE__ */ _("div", {
		className: J("cad-submenu", o && "cad-submenu--open", r),
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
					children: X(e)
				}),
				e?.shortcut && /* @__PURE__ */ g(Oe, { shortcut: e.shortcut }),
				a && /* @__PURE__ */ g("span", {
					className: "cad-submenu__caret",
					"aria-hidden": "true",
					children: "›"
				})
			]
		}), a && o && /* @__PURE__ */ g("div", {
			className: "cad-submenu__popup",
			role: "menu",
			"aria-label": X(e),
			children: i.map((e) => e.type === "separator" ? /* @__PURE__ */ g("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ g(Nr, {
				item: e,
				onAction: t,
				onClose: n
			}, e.id))
		})]
	});
}
function Pr({ items: e = [], openId: t, defaultOpenId: n = "", onOpenChange: r, onAction: i, label: a = "CAD application menu", className: o, ...s }) {
	let c = d(() => Or(e), [e]), [u, f] = Z(t, n, (e, t, n) => r?.(e, t, n)), m = p(null), h = p(""), _ = c.find((e) => e.id === u && !e.disabled && Or(e.items).length > 0), v = _?.id || "", y = (e) => {
		!e || typeof window > "u" || window.requestAnimationFrame(() => {
			[...m.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(":scope > button:not(:disabled)")?.focus?.();
		});
	}, b = (e) => {
		[...m.current?.querySelectorAll(".cad-menu-bar__menu") || []].find((t) => t.dataset.menuId === e)?.querySelector(".cad-menu-bar__popup [role^=\"menuitem\"]:not(:disabled)")?.focus?.();
	}, x = (e, t, n = !1) => {
		v && (f("", e || _, t), n && y(e?.id || v));
	}, S = (e, t) => {
		if (!(e?.disabled || Or(e?.items).length === 0)) {
			if (e.id === v) {
				x(e, t);
				return;
			}
			f(e.id, e, t);
		}
	};
	l(() => {
		let e = h.current;
		if (!e || e !== v || typeof window > "u") return;
		h.current = "";
		let t = window.requestAnimationFrame(() => b(e));
		return () => window.cancelAnimationFrame(t);
	}, [v]), l(() => {
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
		f
	]);
	let C = (e, t) => {
		let n = [...e.currentTarget.querySelectorAll(":scope > .cad-menu-bar__menu > button:not(:disabled)")];
		if (!n.length) return;
		let r = n.indexOf(document.activeElement), i = n[((r >= 0 ? r : Math.max(0, n.findIndex((e) => e.dataset.menuId === v))) + t + n.length) % n.length];
		i?.focus();
		let a = i?.dataset.menuId;
		a && v && f(a, c.find((e) => e.id === a), e);
	};
	return /* @__PURE__ */ g("nav", {
		...s,
		ref: m,
		className: J("cad-menu-bar", o),
		role: "menubar",
		"aria-label": a,
		onKeyDown: (e) => {
			if (s.onKeyDown?.(e), !e.defaultPrevented && (e.key === "ArrowRight" && (e.preventDefault(), C(e, 1)), e.key === "ArrowLeft" && (e.preventDefault(), C(e, -1)), e.key === "Escape" && v && (e.preventDefault(), x(_, e, !0)), e.key === "ArrowDown" && document.activeElement?.dataset.menuId)) {
				let t = c.find((e) => e.id === document.activeElement.dataset.menuId);
				t && !t.disabled && Or(t.items).length > 0 && (e.preventDefault(), t.id === v ? window.requestAnimationFrame(() => b(t.id)) : (h.current = t.id, f(t.id, t, e)));
			}
		},
		children: c.map((e) => /* @__PURE__ */ g(Mr, {
			item: e,
			open: v === e.id,
			onToggle: S,
			onAction: i,
			onClose: (t) => x(e, t, !0)
		}, e.id))
	});
}
function Fr({ value: e, defaultValue: t = { mode: "by-layer" }, onChange: n, colors: r = Tr, allowByLayer: i = !0, allowByBlock: a = !0, label: o = "Color", className: s, ...c }) {
	let [l, u] = Z(e, t, (e, t) => n?.(e, t)), d = kr(l), f = (e, t) => u(e, t);
	return /* @__PURE__ */ _("section", {
		...c,
		className: J("cad-color-picker", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("strong", { children: o }), /* @__PURE__ */ g(ze, {
				color: d.value || (d.mode === "by-layer" ? "#b4bdc7" : "#ffffff"),
				label: Ar(d)
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
				children: Y(r).map((e, t) => {
					let n = typeof e == "string" ? e : e?.value || e?.hex, r = typeof e == "string" ? `Color ${t + 1}` : X(e), i = d.mode === "rgb" && String(d.value || "").toLowerCase() === String(n || "").toLowerCase();
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
function Ir({ value: e, onChange: t, label: n = "Color", className: r, ...i }) {
	let a = kr(e);
	return /* @__PURE__ */ g(gt, {
		label: n,
		className: J("cad-color-picker-button", r),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-color-picker-button__trigger",
			children: /* @__PURE__ */ g(ze, {
				color: a.value || "#b4bdc7",
				label: Ar(a)
			})
		}),
		content: ({ close: r }) => /* @__PURE__ */ g(Fr, {
			...i,
			value: e,
			onChange: (e, n) => {
				t?.(e, n), r(n);
			},
			label: n
		})
	});
}
function Lr({ linetypes: e = Er, value: t, defaultValue: n, onChange: r, label: i = "Linetype", className: a, ...o }) {
	let s = d(() => Or(e), [e]), [c, l] = Z(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), u = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ g(gt, {
		label: i,
		className: J("cad-linetype-picker", a),
		trigger: /* @__PURE__ */ _("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ g(Be, {
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
				children: /* @__PURE__ */ g(Be, {
					type: t.id,
					label: t.label
				})
			}, t.id))
		})
	});
}
function Rr({ lineweights: e = Dr, value: t, defaultValue: n, onChange: r, label: i = "Lineweight", className: a, ...o }) {
	let s = d(() => Or(e), [e]), [c, l] = Z(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), u = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ g(gt, {
		label: i,
		className: J("cad-lineweight-picker", a),
		trigger: /* @__PURE__ */ _("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ g(Ve, {
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
					children: /* @__PURE__ */ g(Ve, {
						weight: r,
						label: t.label
					})
				}, t.id);
			})
		})
	});
}
function zr({ block: e, selected: t = !1, onSelect: n, onInsert: r, onEdit: i, onDelete: a, renderThumbnail: o, className: s }) {
	let c = e || {}, l = X(c);
	return /* @__PURE__ */ _("article", {
		className: J("cad-block-tile", t && "cad-block-tile--selected", s),
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
function Br({ blocks: e = [], value: t, defaultValue: n = "", onChange: r, onInsert: i, onCreate: a, onEdit: o, onDelete: s, filter: c, defaultFilter: l = "", onFilterChange: f, view: p = "grid", renderThumbnail: m, title: h = "Blocks", className: v, emptyLabel: y = "No blocks match the current filter" }) {
	let b = `cad-block-filter-${u()}`, [x, S] = Z(t, n, (e, t, n) => r?.(e, t, n)), [C, w] = Z(c, l, (e, t) => f?.(e, t)), T = d(() => Y(e).filter((e) => `${X(e)} ${e?.category || ""}`.toLocaleLowerCase().includes(String(C || "").toLocaleLowerCase())), [e, C]);
	return /* @__PURE__ */ _("section", {
		className: J("cad-block-palette", `cad-block-palette--${p}`, v),
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
				children: [T.map((e, t) => /* @__PURE__ */ g(zr, {
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
function Vr({ value: e, defaultValue: t = {
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
	return /* @__PURE__ */ _("fieldset", {
		className: J("cad-block-insert-options", i),
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
//#region src/CadInspectorUi.jsx
function Hr({ value: e, defaultValue: t = "", onChange: n, placeholder: r = "Filter", label: i = "Filter list", className: a, ...o }) {
	let s = u(), [c, l] = Z(e, t, (e, t) => n?.(e, t));
	return /* @__PURE__ */ _("div", {
		className: J("cad-filter-bar", a),
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
function Ur({ property: e, value: t, onValueChange: n, inputId: r, className: i }) {
	let a = e || {}, o = a.type || "text", s = t ?? a.value ?? "", c = (e, t) => {
		a.onChange?.(e, a, t), n?.(a.id, e, a, t);
	};
	return typeof a.render == "function" ? /* @__PURE__ */ g("div", {
		className: J("cad-property-field", i),
		children: a.render({
			id: r,
			property: a,
			value: s,
			onChange: c
		})
	}) : a.readOnly || o === "readonly" ? /* @__PURE__ */ g("output", {
		className: J("cad-property-field", "cad-property-field--readonly", i),
		title: String(s),
		children: s || "—"
	}) : o === "toggle" || o === "boolean" ? /* @__PURE__ */ _("label", {
		className: J("cad-property-field", "cad-property-field--toggle", i),
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
		className: J("cad-property-field", i),
		value: s,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e),
		children: Y(a.options).map((e, t) => {
			let n = typeof e == "string" || typeof e == "number" ? {
				value: e,
				label: e
			} : e;
			return /* @__PURE__ */ g("option", {
				value: n.value ?? n.id,
				children: X(n)
			}, n.id || n.value || t);
		})
	}) : o === "color" ? /* @__PURE__ */ _("span", {
		className: J("cad-property-field", "cad-property-field--color", i),
		children: [/* @__PURE__ */ g(ze, {
			color: s || "#ffffff",
			label: s || "#ffffff"
		}), /* @__PURE__ */ g("input", {
			id: r,
			type: "color",
			value: s || "#ffffff",
			disabled: a.disabled,
			onChange: (e) => c(e.target.value, e)
		})]
	}) : o === "cad-color" ? /* @__PURE__ */ g(Ir, {
		value: s,
		onChange: c,
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--cad-color", i),
		colors: a.colors,
		allowByLayer: a.allowByLayer,
		allowByBlock: a.allowByBlock
	}) : o === "linetype" ? /* @__PURE__ */ g(Lr, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--style", i),
		linetypes: a.options
	}) : o === "lineweight" ? /* @__PURE__ */ g(Rr, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--style", i),
		lineweights: a.options
	}) : o === "scale" ? /* @__PURE__ */ g(br, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: J("cad-property-field", "cad-property-field--style", i),
		scales: a.options
	}) : o === "number" ? /* @__PURE__ */ g(Fe, {
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
	}) : o === "unit" ? /* @__PURE__ */ g(Ie, {
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
	}) : o === "angle" ? /* @__PURE__ */ g(Le, {
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
	}) : o === "coordinate" ? /* @__PURE__ */ g(Re, {
		className: J("cad-property-field", i),
		value: s,
		axes: a.axes,
		unit: a.unit,
		disabled: a.disabled,
		onValueChange: (e) => c(e),
		label: a.label || a.id
	}) : o === "multiline" ? /* @__PURE__ */ g("textarea", {
		id: r,
		className: J("cad-property-field", "cad-property-field--multiline", i),
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	}) : /* @__PURE__ */ g("input", {
		id: r,
		className: J("cad-property-field", i),
		type: o,
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	});
}
function Wr({ property: e, value: t, onValueChange: n, className: r }) {
	let i = u(), a = e || {};
	if (a.hidden) return null;
	let o = `cad-property-${i}-${a.id || "field"}`, s = !a.readOnly && typeof a.render != "function" && ![
		"toggle",
		"boolean",
		"coordinate",
		"readonly"
	].includes(a.type || "text");
	return /* @__PURE__ */ _("div", {
		className: J("cad-property-row", a.readOnly && "cad-property-row--readonly", r),
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
		}), /* @__PURE__ */ g(Ur, {
			property: a,
			value: t,
			inputId: o,
			onValueChange: n
		})]
	});
}
function Gr({ id: e, title: t, properties: n = [], collapsible: r = !0, open: i, defaultOpen: a = !0, onOpenChange: o, onValueChange: s, className: c, children: l }) {
	let d = u(), f = e || `cad-property-section-${d}`, [p, m] = Z(i, a, (e, t) => o?.(e, t)), h = r ? /* @__PURE__ */ _("button", {
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
		className: J("cad-property-section", !p && "cad-property-section--closed", c),
		children: [h, /* @__PURE__ */ g("div", {
			id: `${f}-body`,
			className: "cad-property-section__body",
			hidden: !p,
			children: l || Y(n).map((e, t) => /* @__PURE__ */ g(Wr, {
				property: e,
				onValueChange: s
			}, e?.id || t))
		})]
	});
}
function Kr({ sections: e, properties: t, onValueChange: n, label: r = "Properties", className: i, ...a }) {
	let o = Y(e).length ? Y(e) : [{
		id: "properties",
		title: r,
		properties: Y(t)
	}];
	return /* @__PURE__ */ g("section", {
		...a,
		className: J("cad-property-grid", i),
		"aria-label": r,
		children: o.map((e, t) => /* @__PURE__ */ g(Gr, {
			...e,
			onValueChange: n
		}, e?.id || t))
	});
}
function qr({ layers: e = [], value: t, defaultValue: n, onChange: r, label: i = "Current layer", className: a, disabled: o = !1 }) {
	let [s, c] = Z(t, n ?? Y(e)[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ _("label", {
		className: J("cad-layer-picker", a),
		children: [/* @__PURE__ */ g("span", { children: i }), /* @__PURE__ */ g("select", {
			value: s,
			disabled: o,
			onChange: (t) => {
				let n = Y(e).find((e) => e?.id === t.target.value);
				c(t.target.value, n, t);
			},
			children: Y(e).map((e, t) => /* @__PURE__ */ g("option", {
				value: e?.id,
				children: X(e)
			}, e?.id || t))
		})]
	});
}
function Jr({ layer: e, active: t = !1, onActivate: n, onLayerChange: r, onColorClick: i, className: a }) {
	let o = e || {}, s = (e, t) => r?.(o.id, e, o, t), c = X(o), l = (e, t, n, i) => r ? /* @__PURE__ */ g("button", {
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
	}), u = /* @__PURE__ */ g(ze, {
		color: o.color || "#ffffff",
		"aria-label": `${c} color`,
		onClick: i ? (e) => i(o, e) : void 0
	}), d = /* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("strong", { children: c }), o.description && /* @__PURE__ */ g("small", { children: o.description })] });
	return /* @__PURE__ */ _("div", {
		className: J("cad-layer-row", t && "cad-layer-row--active", a),
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
			/* @__PURE__ */ g(Be, {
				type: o.linetype || "continuous",
				color: o.color || "currentColor",
				label: o.linetype
			}),
			/* @__PURE__ */ g(Ve, {
				weight: o.lineweight ?? .25,
				color: o.color || "currentColor",
				label: o.lineweight ? `${o.lineweight} mm` : void 0
			})
		]
	});
}
function Yr({ layers: e = [], activeLayerId: t, onActiveLayerChange: n, onLayerChange: r, onAddLayer: i, onDeleteLayer: a, onColorClick: o, title: s = "Layers", filter: c, defaultFilter: l = "", onFilterChange: u, filterable: f = !0, className: p, emptyLabel: m = "No layers match this filter" }) {
	let [h, v] = Z(c, l, (e, t) => u?.(e, t)), y = d(() => Y(e).filter((e) => X(e).toLocaleLowerCase().includes(String(h || "").toLocaleLowerCase())), [e, h]);
	return /* @__PURE__ */ _("section", {
		className: J("cad-layer-panel", p),
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
			f && /* @__PURE__ */ g(Hr, {
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
				children: [y.map((e, i) => /* @__PURE__ */ g(Jr, {
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
function Xr({ node: e, level: t, selectedId: n, expandedIds: r, onSelect: i, onExpandedChange: a }) {
	let o = e || {}, s = Y(o.children), c = s.length > 0, l = r.has(o.id), u = o.id === n, d = o.icon, f = (e) => {
		if (!c) return;
		let t = new Set(r);
		l ? t.delete(o.id) : t.add(o.id), a(t, o, e);
	};
	return /* @__PURE__ */ _("li", {
		className: "cad-object-tree__branch",
		children: [/* @__PURE__ */ _("div", {
			className: J("cad-object-tree__entry", u && "cad-object-tree__entry--selected"),
			children: [c ? /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-object-tree__expander",
				"aria-label": `${l ? "Collapse" : "Expand"} ${X(o)}`,
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
					/* @__PURE__ */ g("span", { children: X(o) }),
					o.meta && /* @__PURE__ */ g("small", { children: o.meta })
				]
			})]
		}), c && l && /* @__PURE__ */ g("ul", { children: s.map((e, o) => /* @__PURE__ */ g(Xr, {
			node: e,
			level: t + 1,
			selectedId: n,
			expandedIds: r,
			onSelect: i,
			onExpandedChange: a
		}, e?.id || o)) })]
	});
}
function Zr({ nodes: e = [], selectedId: t, defaultSelectedId: n = "", onSelect: r, expandedIds: i, defaultExpandedIds: a, onExpandedChange: o, label: s = "CAD object tree", className: c, ...l }) {
	let u = a ?? Y(e).filter((e) => e?.expanded).map((e) => e.id), [d, f] = Z(t, n, (e, t, n) => r?.(e, t, n)), [p, m] = Z(i, u, (e, t, n) => o?.(e, t, n)), h = new Set(Y(p));
	return /* @__PURE__ */ g("ul", {
		...l,
		className: J("cad-object-tree", c),
		"aria-label": s,
		children: Y(e).map((e, t) => /* @__PURE__ */ g(Xr, {
			node: e,
			level: 1,
			selectedId: d,
			expandedIds: h,
			onSelect: (e, t) => f(e.id, e, t),
			onExpandedChange: (e, t, n) => m([...e], t, n)
		}, e?.id || t))
	});
}
function Qr({ label: e, value: t = 0, status: n, onCancel: r, className: i }) {
	let a = Math.max(0, Math.min(100, Number(t) || 0));
	return /* @__PURE__ */ _("section", {
		className: J("cad-task-progress", i),
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
function $r({ references: e = [], onReload: t, onUnload: n, className: r, title: i = "External references" }) {
	return /* @__PURE__ */ _("section", {
		className: J("cad-reference-list", r),
		"aria-label": i,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("h2", { children: i }), /* @__PURE__ */ g("span", { children: Y(e).length })] }), /* @__PURE__ */ g("ul", { children: Y(e).map((e, r) => /* @__PURE__ */ _("li", { children: [
			/* @__PURE__ */ _("span", { children: [/* @__PURE__ */ g("strong", { children: X(e) }), /* @__PURE__ */ g("small", { children: e?.path || e?.detail })] }),
			/* @__PURE__ */ g("em", {
				"data-status": e?.status || "loaded",
				children: e?.status || "loaded"
			}),
			/* @__PURE__ */ _("span", {
				className: "cad-reference-list__actions",
				children: [t && /* @__PURE__ */ g("button", {
					type: "button",
					"aria-label": `Reload ${X(e)}`,
					onClick: (n) => t(e, n),
					children: "Reload"
				}), n && /* @__PURE__ */ g("button", {
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
var ei = (e, t) => typeof t?.render == "function" ? t.render(e, t) : typeof t?.accessor == "function" ? t.accessor(e, t) : e?.[t?.accessor || t?.id], ti = (e, t) => {
	let n = typeof t?.sortValue == "function" ? t.sortValue(e, t) : ei(e, t);
	return typeof n == "string" ? n.toLocaleLowerCase() : n;
};
function ni({ columns: e = [], rows: t = [], rowId: n = (e) => e?.id, selectedIds: r, defaultSelectedIds: i = [], onSelectionChange: a, selectionMode: o = "multiple", onRowActivate: s, sort: c, defaultSort: l, onSortChange: u, caption: f = "CAD data", emptyLabel: p = "No rows to display", className: m, ...h }) {
	let v = d(() => Y(e).filter((e) => e?.id), [e]), [y, b] = Z(r, i, (e, t, n) => a?.(e, t, n)), [x, S] = Z(c, l, (e, t, n) => u?.(e, t, n)), C = new Set(Y(y)), w = d(() => {
		let e = [...Y(t)], n = v.find((e) => e.id === x?.columnId);
		if (!n || !x?.direction) return e;
		let r = x.direction === "desc" ? -1 : 1;
		return e.sort((e, t) => String(ti(e, n) ?? "").localeCompare(String(ti(t, n) ?? ""), void 0, { numeric: !0 }) * r);
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
	return /* @__PURE__ */ g("div", {
		...h,
		className: J("cad-data-grid", m),
		children: /* @__PURE__ */ _("table", { children: [
			/* @__PURE__ */ g("caption", { children: f }),
			/* @__PURE__ */ g("thead", { children: /* @__PURE__ */ _("tr", { children: [o !== "none" && /* @__PURE__ */ g("th", {
				scope: "col",
				className: "cad-data-grid__selection",
				children: o === "multiple" && /* @__PURE__ */ g("input", {
					type: "checkbox",
					"aria-label": "Select all rows",
					checked: D,
					onChange: (e) => {
						let t = e.target.checked ? w.map((e) => typeof n == "function" ? n(e) : e?.[n]) : [];
						b(t, null, e);
					}
				})
			}), v.map((e) => /* @__PURE__ */ g("th", {
				scope: "col",
				style: e.width ? { width: e.width } : void 0,
				"aria-sort": x?.columnId === e.id ? x.direction === "desc" ? "descending" : "ascending" : void 0,
				children: e.sortable ? /* @__PURE__ */ _("button", {
					type: "button",
					onClick: (t) => E(e, t),
					children: [e.label || e.id, /* @__PURE__ */ g("span", {
						"aria-hidden": "true",
						children: x?.columnId === e.id ? x.direction === "desc" ? "↓" : "↑" : "↕"
					})]
				}) : e.label || e.id
			}, e.id))] }) }),
			/* @__PURE__ */ _("tbody", { children: [w.map((e, t) => {
				let r = typeof n == "function" ? n(e) : e?.[n], i = C.has(r);
				return /* @__PURE__ */ _("tr", {
					"data-selected": i ? "true" : "false",
					onDoubleClick: (t) => s?.(e, t),
					children: [o !== "none" && /* @__PURE__ */ g("td", {
						className: "cad-data-grid__selection",
						children: /* @__PURE__ */ g("input", {
							type: o === "single" ? "radio" : "checkbox",
							"aria-label": `Select ${X(e) || r || t + 1}`,
							checked: i,
							onChange: (t) => T(e, t)
						})
					}), v.map((t) => /* @__PURE__ */ g("td", {
						"data-align": t.align || "start",
						children: ei(e, t) ?? "—"
					}, t.id))]
				}, r || t);
			}), !w.length && /* @__PURE__ */ g("tr", { children: /* @__PURE__ */ g("td", {
				colSpan: v.length + (o === "none" ? 0 : 1),
				className: "cad-data-grid__empty",
				children: p
			}) })] })
		] })
	});
}
function ri({ filters: e = [], activeIds: t, defaultActiveIds: n = [], onChange: r, label: i = "Selection filter", className: a, ...o }) {
	let [s, c] = Z(t, n, (e, t, n) => r?.(e, t, n)), l = new Set(Y(s));
	return /* @__PURE__ */ _("section", {
		...o,
		className: J("cad-selection-filter", a),
		"aria-label": i,
		children: [/* @__PURE__ */ _("header", { children: [/* @__PURE__ */ g("strong", { children: i }), /* @__PURE__ */ _("output", { children: [
			l.size,
			"/",
			Y(e).length
		] })] }), /* @__PURE__ */ g("div", {
			role: "group",
			"aria-label": i,
			children: Y(e).map((e, t) => {
				let n = e?.id || `${X(e)}-${t}`, r = l.has(n), i = e?.icon;
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
						/* @__PURE__ */ g("span", { children: X(e) }),
						e?.count !== void 0 && /* @__PURE__ */ g("em", { children: e.count })
					]
				}, n);
			})
		})]
	});
}
function ii({ candidates: e = [], activeId: t, defaultActiveId: n, onChange: r, onAccept: i, onCancel: a, label: o = "Selection cycle", className: s, ...c }) {
	let l = d(() => Y(e).map((e, t) => ({
		...e,
		id: e?.id || `${X(e)}-${t}`
	})), [e]), [u, f] = Z(t, n ?? l[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), p = Math.max(0, l.findIndex((e) => e.id === u)), m = l[p], h = (e, t) => {
		if (!l.length) return;
		let n = l[(p + e + l.length) % l.length];
		f(n.id, n, t);
	};
	return l.length ? /* @__PURE__ */ _("aside", {
		...c,
		className: J("cad-selection-cycler", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": "Previous candidate",
				onClick: (e) => h(-1, e),
				children: "‹"
			}),
			/* @__PURE__ */ _("output", { children: [
				/* @__PURE__ */ _("small", { children: [
					p + 1,
					" / ",
					l.length
				] }),
				/* @__PURE__ */ g("strong", { children: X(m) }),
				m?.detail && /* @__PURE__ */ g("span", { children: m.detail })
			] }),
			/* @__PURE__ */ g("button", {
				type: "button",
				"aria-label": "Next candidate",
				onClick: (e) => h(1, e),
				children: "›"
			}),
			i && /* @__PURE__ */ g("button", {
				type: "button",
				className: "cad-selection-cycler__accept",
				onClick: (e) => i(m, e),
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
function ai({ title: e = "Quick properties", properties: t, sections: n, onValueChange: r, onPinChange: i, pinned: a = !1, onClose: o, className: s, ...c }) {
	return /* @__PURE__ */ _("aside", {
		...c,
		className: J("cad-quick-properties", s),
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
		})] })] }), /* @__PURE__ */ g(Kr, {
			properties: t,
			sections: n,
			onValueChange: r,
			label: e
		})]
	});
}
//#endregion
export { I as CAD_CUI_RUNTIME_VERSION, Wn as CAD_WORKSPACE_DOCK_MODES, gn as CAD_WORKSPACE_MODEL_ID, $ as CAD_WORKSPACE_PANEL_ACTIONS, Q as CAD_WORKSPACE_PANEL_PLACEMENTS, D as CadActionButton, Le as CadAngleInput, br as CadAnnotationScalePicker, Vr as CadBlockInsertOptions, Br as CadBlockPalette, zr as CadBlockTile, Fr as CadColorPicker, Ir as CadColorPickerButton, ze as CadColorSwatch, Fn as CadCommandHistory, Rn as CadCommandLine, In as CadCommandOptions, yt as CadCommandPrompt, Nt as CadCompactWorkspaceRibbon, pt as CadConfirmDialog, yr as CadConstraintBar, Re as CadCoordinateInput, we as CadCuiCommandPalette, Ce as CadCuiContextMenu, Te as CadCuiCustomizer, ge as CadCuiProvider, Se as CadCuiQuickAccess, xe as CadCuiRibbon, ni as CadDataGrid, k as CadDataRow, ft as CadDialog, An as CadDockPanel, jn as CadDockTabs, On as CadDocumentTabs, En as CadDrawingSpaceTabs, gr as CadDynamicInput, M as CadEmptyState, Hr as CadFilterBar, vr as CadGripToolbar, O as CadIconButton, Yr as CadLayerPanel, qr as CadLayerPicker, Jr as CadLayerRow, Dn as CadLayoutTabs, Lr as CadLinetypePicker, Be as CadLinetypePreview, Rr as CadLineweightPicker, Ve as CadLineweightPreview, Un as CadMeasureReadout, We as CadMenu, Pr as CadMenuBar, Ue as CadMenuItem, He as CadMenuSeparator, Bt as CadNavigationBar, Fe as CadNumericInput, Cr as CadObjectSnapMarker, _r as CadObjectSnapMenu, Zr as CadObjectTree, Ge as CadOverflowMenu, j as CadPanelFooter, w as CadPanelHeader, T as CadPanelSection, C as CadPanelShell, Sr as CadPolarTracker, gt as CadPopover, Ur as CadPropertyField, Kr as CadPropertyGrid, Wr as CadPropertyRow, Gr as CadPropertySection, ai as CadQuickProperties, $r as CadReferenceList, E as CadSegmentTabs, ii as CadSelectionCycler, ri as CadSelectionFilter, wr as CadSelectionGrip, Ut as CadSelectionSetPanel, Hn as CadSelectionSummary, Oe as CadShortcutHint, vt as CadShortcutReference, je as CadSplitButton, jr as CadSplitPane, A as CadStatGrid, Pn as CadStatusBar, Mn as CadStatusToggle, Nr as CadSubmenu, Qr as CadTaskProgress, mt as CadToast, ht as CadToastStack, Ae as CadToggleButton, ke as CadToolButton, Pe as CadToolPalette, Ne as CadToolbar, Me as CadToolbarGroup, _t as CadTooltip, Bn as CadUcsIndicator, Ie as CadUnitInput, zn as CadViewCube, xr as CadViewPresetPicker, Vn as CadViewportControls, Ht as CadViewportScalePicker, Vt as CadVisualStylePicker, ir as CadWorkspaceDockModeControl, cr as CadWorkspaceDockRail, ar as CadWorkspaceDockResizeHandle, lr as CadWorkspaceDockZone, pn as CadWorkspacePanelManager, mn as CadWorkspacePanelPreferences, kn as CadWorkspaceProfileTabs, at as CadWorkspaceRibbon, ie as DEFAULT_CAD_CUI_SYSTEM, cn as createCadWorkspacePanelPreferencesKey, xn as createCadWorkspaceProfile, K as defineCadCuiSystem, nn as getCadWorkspacePanelPreference, tt as groupCadWorkspaceRibbonCommands, de as loadCadCuiState, bn as nextCadWorkspaceLayoutName, Zt as normalizeCadWorkspacePanelPlacement, tn as normalizeCadWorkspacePanelPreferences, $t as normalizeCadWorkspacePanels, yn as normalizeCadWorkspaceProfiles, Cn as removeCadWorkspaceProfile, Sn as renameCadWorkspaceProfile, sn as resetCadWorkspacePanelPreferences, At as resolveCadCompactWorkspaceRibbonGroups, se as resolveCadCuiCommand, ce as resolveCadCuiCommandState, ue as sanitizeCadCuiState, fe as saveCadCuiState, me as selectCadCuiCommandGroups, pe as selectCadCuiCommands, on as updateCadWorkspacePanelPreference, _e as useCadCui, ve as useCadCuiCommand, rr as useCadWorkspaceDock, or as useCadWorkspaceDockRail, ln as useCadWorkspacePanelPreferences };
