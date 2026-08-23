import e, { createContext as t, useCallback as n, useContext as r, useDeferredValue as i, useEffect as a, useMemo as o, useReducer as s, useState as c } from "react";
import { Fragment as l, jsx as u, jsxs as d } from "react/jsx-runtime";
import { useLocation as f, useNavigate as p } from "react-router-dom";
//#region src/GraphCadUi.jsx
var m = Object.freeze({
	cyan: "#00fbfb",
	blue: "#4bc8ff",
	magenta: "#ff00ff",
	violet: "#b86dff",
	green: "#80ff00",
	amber: "#ff8a00",
	neutral: "#94a3b8"
}), h = (...e) => e.filter(Boolean).join(" "), g = (e) => m[e] || e || m.cyan;
function _({ as: t = "section", tone: n = "cyan", density: r = "regular", visualStrength: i = "standard", scroll: a = !0, className: o, style: s, children: c, ...l }) {
	return e.createElement(t, {
		...l,
		"data-tone": n,
		"data-density": r,
		"data-visual-strength": i,
		className: h("cad-ui-panel", a && "cad-ui-panel--scroll", o),
		style: {
			"--cad-ui-accent": g(n),
			...s
		}
	}, c);
}
function v({ icon: e, eyebrow: t, title: n, description: r, status: i, actions: a, compact: o = !1, className: s, children: c }) {
	return /* @__PURE__ */ d("header", {
		className: h("cad-ui-panel__header", o && "cad-ui-panel__header--compact", s),
		children: [/* @__PURE__ */ d("div", {
			className: "cad-ui-panel__heading",
			children: [e && /* @__PURE__ */ u("span", {
				className: "cad-ui-panel__icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ u(e, { size: o ? 12 : 14 })
			}), /* @__PURE__ */ d("div", {
				className: "cad-ui-panel__copy",
				children: [
					t && /* @__PURE__ */ u("p", {
						className: "cad-ui-panel__eyebrow",
						children: t
					}),
					n && /* @__PURE__ */ u("h2", {
						className: "cad-ui-panel__title",
						children: n
					}),
					r && /* @__PURE__ */ u("p", {
						className: "cad-ui-panel__description",
						children: r
					}),
					c
				]
			})]
		}), (i || a) && /* @__PURE__ */ d("div", {
			className: "cad-ui-panel__header-actions",
			children: [i && /* @__PURE__ */ u("span", {
				className: "cad-ui-status",
				children: i
			}), a]
		})]
	});
}
function y({ as: t = "section", icon: n, eyebrow: r, title: i, description: a, actions: o, compact: s = !1, className: c, children: f, ...p }) {
	let m = /* @__PURE__ */ d(l, { children: [!!(n || r || i || a || o) && /* @__PURE__ */ d("header", {
		className: "cad-ui-section__header",
		children: [/* @__PURE__ */ d("div", {
			className: "cad-ui-section__copy",
			children: [
				(n || r) && /* @__PURE__ */ d("p", {
					className: "cad-ui-section__eyebrow",
					children: [n && /* @__PURE__ */ u(n, {
						size: 11,
						"aria-hidden": "true"
					}), r]
				}),
				i && /* @__PURE__ */ u("h3", {
					className: "cad-ui-section__title",
					children: i
				}),
				a && /* @__PURE__ */ u("p", {
					className: "cad-ui-section__description",
					children: a
				})
			]
		}), o && /* @__PURE__ */ u("div", {
			className: "cad-ui-section__actions",
			children: o
		})]
	}), /* @__PURE__ */ u("div", {
		className: "cad-ui-section__body",
		children: f
	})] });
	return e.createElement(t, {
		...p,
		className: h("cad-ui-section", s && "cad-ui-section--compact", c)
	}, m);
}
function b({ items: e, activeId: t, onChange: n, label: r, className: i }) {
	return /* @__PURE__ */ u("div", {
		className: h("cad-ui-segment-tabs", i),
		role: "tablist",
		"aria-label": r,
		children: e.map(({ id: e, label: r, icon: i, disabled: a = !1 }) => /* @__PURE__ */ d("button", {
			type: "button",
			role: "tab",
			"aria-selected": t === e,
			disabled: a,
			onClick: () => n(e),
			children: [i && /* @__PURE__ */ u(i, {
				size: 11,
				"aria-hidden": "true"
			}), /* @__PURE__ */ u("span", { children: r })]
		}, e))
	});
}
function x({ icon: e, tone: t = "inherit", compact: n = !1, className: r, children: i, type: a = "button", ...o }) {
	return /* @__PURE__ */ d("button", {
		...o,
		type: a,
		"data-tone": t,
		className: h("cad-ui-action", n && "cad-ui-action--compact", r),
		children: [e && /* @__PURE__ */ u(e, {
			size: n ? 11 : 13,
			"aria-hidden": "true"
		}), /* @__PURE__ */ u("span", { children: i })]
	});
}
function S({ icon: e, label: t, tone: n = "inherit", className: r, type: i = "button", ...a }) {
	return /* @__PURE__ */ u("button", {
		...a,
		type: i,
		"data-tone": n,
		className: h("cad-ui-icon-action", r),
		"aria-label": t,
		title: t,
		children: e && /* @__PURE__ */ u(e, {
			size: 13,
			"aria-hidden": "true"
		})
	});
}
function C({ as: t = "div", icon: n, title: r, detail: i, meta: a, status: o, actions: s, active: c = !1, tone: f = "inherit", className: p, children: m, ...g }) {
	let _ = /* @__PURE__ */ d(l, { children: [
		n && /* @__PURE__ */ u("span", {
			className: "cad-ui-data-row__icon",
			"aria-hidden": "true",
			children: /* @__PURE__ */ u(n, { size: 13 })
		}),
		/* @__PURE__ */ d("span", {
			className: "cad-ui-data-row__copy",
			children: [
				r && /* @__PURE__ */ u("strong", { children: r }),
				i && /* @__PURE__ */ u("small", { children: i }),
				m
			]
		}),
		(a || o || s) && /* @__PURE__ */ d("span", {
			className: "cad-ui-data-row__trailing",
			children: [
				a && /* @__PURE__ */ u("em", { children: a }),
				o && /* @__PURE__ */ u("span", {
					className: "cad-ui-status",
					children: o
				}),
				s
			]
		})
	] }), v = t === "button" && !g.type ? {
		...g,
		type: "button"
	} : g;
	return e.createElement(t, {
		...v,
		"data-active": c ? "true" : "false",
		"data-tone": f,
		className: h("cad-ui-data-row", p)
	}, _);
}
function w({ items: e, className: t, label: n = "Summary data" }) {
	return /* @__PURE__ */ u("dl", {
		className: h("cad-ui-stat-grid", t),
		"aria-label": n,
		children: e.map((e) => /* @__PURE__ */ d("div", {
			"data-tone": e.tone || "inherit",
			children: [
				/* @__PURE__ */ u("dt", { children: e.label }),
				/* @__PURE__ */ u("dd", { children: e.value }),
				e.detail && /* @__PURE__ */ u("small", { children: e.detail })
			]
		}, e.id || e.label))
	});
}
function T({ className: e, children: t }) {
	return /* @__PURE__ */ u("footer", {
		className: h("cad-ui-panel__footer", e),
		children: t
	});
}
function E({ icon: e, title: t = "NO DATA TO DISPLAY", children: n, className: r }) {
	return /* @__PURE__ */ d("div", {
		className: h("cad-ui-empty-state", r),
		children: [e && /* @__PURE__ */ u(e, {
			size: 16,
			"aria-hidden": "true"
		}), /* @__PURE__ */ d("div", { children: [/* @__PURE__ */ u("strong", { children: t }), n && /* @__PURE__ */ u("p", { children: n })] })]
	});
}
//#endregion
//#region src/CadCuiRuntime.jsx
var D = Object.freeze([]), O = Object.freeze({}), k = t(null), A = 1, j = (e) => String(e ?? "").trim(), M = (e) => [...new Set((Array.isArray(e) ? e : D).map(j).filter(Boolean))], N = (e) => ({
	id: j(e?.id),
	label: j(e?.label) || j(e?.id),
	detail: j(e?.detail),
	color: j(e?.color)
}), P = (e) => Object.freeze({ ...e && typeof e == "object" ? e : O }), F = (e) => Object.freeze({
	surface: j(e?.surface),
	tab: j(e?.tab),
	menu: j(e?.menu),
	group: j(e?.group),
	label: j(e?.label),
	detail: j(e?.detail),
	icon: j(e?.icon),
	tone: j(e?.tone),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), I = (e) => !e || typeof e != "object" || Object.isFrozen(e) ? e : (Object.freeze(e), Object.values(e).forEach(I), e), L = (e, t) => Array.isArray(e) ? e.includes(t) : !!e?.[t], R = (e) => e instanceof HTMLElement && !!e.closest("input, textarea, select, [contenteditable=\"true\"]"), z = (e) => {
	let t = j(e.key).toUpperCase();
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
}, B = (e) => j(e).toUpperCase().replace(/CMD|COMMAND/g, "CTRL").replace(/\s+/g, "");
function V(e = O) {
	let t = (Array.isArray(e.commands) ? e.commands : D).map((e) => ({
		id: j(e?.id),
		label: j(e?.label),
		detail: j(e?.detail || e?.description),
		icon: j(e?.icon),
		tone: j(e?.tone) || "cyan",
		toolId: j(e?.toolId),
		shortcut: j(e?.shortcut),
		requires: M(e?.requires),
		customizable: e?.customizable !== !1,
		alwaysVisible: !!e?.alwaysVisible,
		intent: P(e?.intent),
		placements: (Array.isArray(e?.placements) ? e.placements : D).map(F)
	})).filter((e) => e.id && e.label), n = new Set(t.map((e) => e.id)), r = (Array.isArray(e.tabs) ? e.tabs : D).map((e) => ({
		id: j(e?.id),
		label: j(e?.label) || j(e?.id),
		color: j(e?.color) || "#00fbfb",
		tone: j(e?.tone) || "cyan"
	})).filter((e) => e.id), i = e.calibration && typeof e.calibration == "object" ? e.calibration : O, a = (Array.isArray(i.accentModes) ? i.accentModes : D).map(N).filter((e) => e.id), o = (Array.isArray(i.densities) ? i.densities : D).map(N).filter((e) => e.id), s = (Array.isArray(i.details) ? i.details : D).map(N).filter((e) => e.id), c = (Array.isArray(e.panels) ? e.panels : D).map((e) => ({
		...e,
		id: j(e?.id),
		title: j(e?.title) || j(e?.id)
	})).filter((e) => e.id), l = e.defaults && typeof e.defaults == "object" ? e.defaults : O, u = {
		version: Number(e.version) || 1,
		activeTab: r.some((e) => e.id === l.activeTab) ? l.activeTab : r[0]?.id || "",
		hiddenCommandIds: M(l.hiddenCommandIds).filter((e) => n.has(e)),
		accentMode: a.some((e) => e.id === l.accentMode) ? l.accentMode : a[0]?.id || "",
		density: o.some((e) => e.id === l.density) ? l.density : o[0]?.id || "",
		detail: s.some((e) => e.id === l.detail) ? l.detail : s[0]?.id || "",
		quickAccessIds: M(l.quickAccessIds).filter((e) => n.has(e)),
		recentCommandIds: D,
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
	return I({
		id: j(e.id) || "cad-cui",
		version: Number(e.version) || 1,
		storageKey: j(e.storageKey) || "cad-cui-preferences:v1",
		tabs: r,
		panels: c,
		commands: t,
		calibration: {
			accentModes: a,
			densities: o,
			details: s
		},
		defaultState: u
	});
}
var H = V({ id: "cad-cui-default" }), U = (e) => new Map(e.commands.map((e) => [e.id, e])), W = (e, t) => e.some((e) => e.id === t);
function G(e, t) {
	let n = t && typeof t == "object" ? t : O, r = U(e), i = Array.isArray(n.hiddenToolIds) ? e.commands.filter((e) => n.hiddenToolIds.includes(e.toolId)).map((e) => e.id) : D, a = M(n.hiddenCommandIds || i).filter((e) => r.has(e) && !r.get(e).alwaysVisible);
	return {
		version: e.version,
		activeTab: e.tabs.some((e) => e.id === n.activeTab) ? n.activeTab : e.defaultState.activeTab,
		hiddenCommandIds: a,
		accentMode: W(e.calibration.accentModes, n.accentMode) ? n.accentMode : e.defaultState.accentMode,
		density: W(e.calibration.densities, n.density) ? n.density : e.defaultState.density,
		detail: W(e.calibration.details, n.detail) ? n.detail : e.defaultState.detail,
		quickAccessIds: M(n.quickAccessIds || e.defaultState.quickAccessIds).filter((e) => r.has(e)),
		recentCommandIds: M(n.recentCommandIds).filter((e) => r.has(e)).slice(0, 8),
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
}
function K(e, t = typeof window > "u" ? null : window.localStorage) {
	if (!t) return G(e, e.defaultState);
	try {
		let n = t.getItem(e.storageKey);
		if (!n) return G(e, e.defaultState);
		let r = JSON.parse(n);
		return G(e, r?.preferences || r);
	} catch {
		return G(e, e.defaultState);
	}
}
function q(e, t, n = typeof window > "u" ? null : window.localStorage) {
	if (!n) return !1;
	try {
		let r = G(e, t);
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
function J(e, t, { surface: n = "palette", tabId: r = "", menuId: i = "", capabilities: a = O } = O) {
	let o = new Set(t?.hiddenCommandIds || D);
	return e.commands.flatMap((e) => {
		if (o.has(e.id) && !e.alwaysVisible || e.requires.some((e) => !L(a, e))) return D;
		let t = n === "palette" ? {
			surface: "palette",
			order: 0
		} : e.placements.find((e) => e.surface === n && (!r || e.tab === r) && (!i || e.menu === i));
		return t ? [{
			...e,
			label: t.label || e.label,
			detail: t.detail || e.detail,
			icon: t.icon || e.icon,
			tone: t.tone || e.tone,
			placement: t
		}] : D;
	}).sort((e, t) => e.placement.order - t.placement.order || e.label.localeCompare(t.label, "hu"));
}
var Y = (e) => (t, n) => {
	switch (n.type) {
		case "tab.select": return G(e, {
			...t,
			activeTab: n.tabId
		});
		case "command.visibility": {
			let r = e.commands.find((e) => e.id === n.commandId);
			if (!r || r.alwaysVisible) return t;
			let i = t.hiddenCommandIds.includes(n.commandId) ? t.hiddenCommandIds.filter((e) => e !== n.commandId) : [...t.hiddenCommandIds, n.commandId];
			return G(e, {
				...t,
				hiddenCommandIds: i
			});
		}
		case "preference.set": return G(e, {
			...t,
			[n.key]: n.value
		});
		case "preferences.reset": return G(e, e.defaultState);
		case "command.completed": return {
			...t,
			recentCommandIds: M([n.commandId, ...t.recentCommandIds]).slice(0, 8),
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
				error: j(n.error) || "COMMAND_FAILED"
			}
		};
		default: return t;
	}
};
function X({ registry: e = H, capabilities: t = O, handlers: r = O, onCommand: i, children: c }) {
	let l = p(), d = f(), [m, h] = s(Y(e), e, (e) => K(e)), g = o(() => U(e), [e]);
	a(() => {
		q(e, m);
	}, [e, m]);
	let _ = n((e) => !!e && !(!e.alwaysVisible && m.hiddenCommandIds.includes(e.id)) && e.requires.every((e) => L(t, e)), [t, m.hiddenCommandIds]), v = n((n = O) => J(e, m, {
		...n,
		capabilities: t
	}), [
		t,
		e,
		m
	]), y = n(async (e, { source: t = "api", payload: n = O } = O) => {
		let a = g.get(e);
		if (!a) return {
			ok: !1,
			reason: "COMMAND_NOT_FOUND"
		};
		if (!_(a)) return {
			ok: !1,
			reason: "COMMAND_NOT_AVAILABLE"
		};
		let o = {
			...a.intent,
			...n && typeof n == "object" ? n : O
		}, s = {
			commandId: e,
			command: a,
			intent: o,
			payload: n,
			source: t,
			state: m,
			location: d
		};
		try {
			if (o.type === "route.navigate") l(o.to, o.options);
			else {
				let e = r[o.type];
				if (typeof e != "function") return {
					ok: !1,
					reason: "COMMAND_HANDLER_NOT_FOUND"
				};
				await e({
					...s,
					navigate: l
				});
			}
			return i?.(s), h({
				type: "command.completed",
				commandId: e
			}), {
				ok: !0,
				event: s
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
		g,
		r,
		d,
		l,
		i,
		m
	]);
	a(() => {
		if (typeof window > "u") return;
		let t = (t) => {
			if (t.defaultPrevented || R(t.target)) return;
			let n = z(t), r = e.commands.find((e) => B(e.shortcut) === n && _(e));
			r && (t.preventDefault(), y(r.id, { source: "shortcut" }));
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [
		_,
		y,
		e.commands
	]);
	let b = o(() => ({
		registry: e,
		state: m,
		capabilities: t,
		selectCommands: v,
		executeCommand: y,
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
		canExecute: _
	}), [
		_,
		t,
		y,
		e,
		v,
		m
	]);
	return /* @__PURE__ */ u(k.Provider, {
		value: b,
		children: c
	});
}
function Z() {
	let e = r(k);
	if (!e) throw Error("useCadCui must be used below CadCuiProvider.");
	return e;
}
function Q(e, t = "api") {
	let { executeCommand: r } = Z();
	return n((n) => r(e, {
		source: t,
		payload: n
	}), [
		e,
		r,
		t
	]);
}
var ee = (e, t) => e?.[t] || null;
function $({ command: e, iconMap: t, source: n, role: r, badge: i, className: a }) {
	let { executeCommand: o } = Z(), s = ee(t, e.icon);
	return /* @__PURE__ */ u(x, {
		type: "button",
		role: r,
		icon: s,
		tone: e.tone,
		className: a,
		"data-command-id": e.id,
		title: e.detail || e.label,
		"aria-label": e.label,
		onClick: () => {
			o(e.id, { source: n });
		},
		children: i ?? e.label
	});
}
function te({ iconMap: e = O, className: t, title: n = "PARANCS SZALAG", description: r = "Deklaratív CUI-regiszterből épített munkatéri parancsok", renderBadge: i, ...a }) {
	let { registry: o, state: s, selectCommands: c, setActiveTab: l } = Z(), f = o.tabs.find((e) => e.id === s.activeTab) || o.tabs[0], p = c({
		surface: "ribbon",
		tabId: f?.id
	});
	return /* @__PURE__ */ d(_, {
		...a,
		tone: f?.tone || "cyan",
		scroll: !1,
		className: t,
		"data-testid": a["data-testid"] || "cad-cui-ribbon",
		children: [/* @__PURE__ */ u(v, {
			eyebrow: "CUI REGISZTER",
			title: n,
			description: r,
			status: f?.label || "NÉZET"
		}), /* @__PURE__ */ d(y, {
			eyebrow: "MUNKATÉR",
			title: "PARANCSCSOPORT",
			compact: !0,
			children: [/* @__PURE__ */ u(b, {
				label: "CAD szalag fülek",
				activeId: f?.id,
				onChange: l,
				items: o.tabs.map((e) => ({
					id: e.id,
					label: e.label
				}))
			}), /* @__PURE__ */ u("div", {
				className: "cad-cui-command-grid cad-cui-command-grid--ribbon",
				role: "toolbar",
				"aria-label": `${f?.label || "CAD"} parancsok`,
				children: p.map((t) => /* @__PURE__ */ u($, {
					command: t,
					iconMap: e,
					source: "ribbon",
					badge: i?.(t) ?? t.label
				}, t.id))
			})]
		})]
	});
}
function ne({ iconMap: e = O, commandIds: t, className: n, ...r }) {
	let { registry: i, state: a, canExecute: o } = Z(), s = (Array.isArray(t) ? t : a.quickAccessIds).map((e) => i.commands.find((t) => t.id === e)).filter((e) => o(e));
	return /* @__PURE__ */ u("div", {
		...r,
		className: ["cad-cui-quick-access", n].filter(Boolean).join(" "),
		"data-testid": r["data-testid"] || "cad-cui-quick-access",
		role: "toolbar",
		"aria-label": "Gyors elérés",
		children: s.map((t) => /* @__PURE__ */ u($, {
			command: t,
			iconMap: e,
			source: "quick-access"
		}, t.id))
	});
}
function re({ menuId: e = "canvas", iconMap: t = O, className: n, onClose: r, ...i }) {
	let { selectCommands: a } = Z(), o = a({
		surface: "context",
		menuId: e
	});
	return /* @__PURE__ */ d(_, {
		...i,
		as: "aside",
		role: "menu",
		"aria-label": "CUI helyi menü",
		tone: "magenta",
		density: "compact",
		scroll: !1,
		className: n,
		"data-testid": i["data-testid"] || "cad-cui-context-menu",
		children: [/* @__PURE__ */ u(v, {
			eyebrow: "KONTEXTUS",
			title: "GYORSPARANCSOK",
			actions: r && /* @__PURE__ */ u(x, {
				compact: !0,
				onClick: r,
				"aria-label": "Helyi menü bezárása",
				children: "BEZÁR"
			})
		}), /* @__PURE__ */ u(y, {
			compact: !0,
			children: /* @__PURE__ */ d("div", {
				className: "cad-cui-command-grid",
				children: [o.map((e) => /* @__PURE__ */ u($, {
					command: e,
					iconMap: t,
					source: "context",
					role: "menuitem"
				}, e.id)), !o.length && /* @__PURE__ */ u(E, {
					title: "NINCS ELÉRHETŐ PARANCS",
					children: "A jogosultság vagy a profil jelenleg elrejti ezt a menüt."
				})]
			})
		})]
	});
}
function ie({ iconMap: e = O, className: t, ...n }) {
	let { selectCommands: r, state: a } = Z(), [s, l] = c(""), f = i(s), p = o(() => {
		let e = j(f).toLocaleLowerCase("hu");
		return r({ surface: "palette" }).filter((t) => !e || `${t.label} ${t.detail} ${t.shortcut}`.toLocaleLowerCase("hu").includes(e));
	}, [f, r]);
	return /* @__PURE__ */ d(_, {
		...n,
		tone: "violet",
		className: t,
		"data-testid": n["data-testid"] || "cad-cui-command-palette",
		children: [
			/* @__PURE__ */ u(v, {
				eyebrow: "CUI PARANCSOK",
				title: "PARANCS PALETTA",
				description: "A szalag, a gyorselérés és a helyi menük közös kereshető parancsregisztere.",
				status: `${p.length} TALÁLAT`
			}),
			/* @__PURE__ */ d(y, {
				compact: !0,
				children: [
					/* @__PURE__ */ u("label", {
						className: "cad-cui-sr-only",
						htmlFor: "cad-cui-command-query",
						children: "Parancs keresése"
					}),
					/* @__PURE__ */ u("input", {
						id: "cad-cui-command-query",
						value: s,
						onChange: (e) => l(e.target.value),
						placeholder: "PARANCS KERESÉSE…",
						className: "cad-cui-command-palette__input"
					}),
					/* @__PURE__ */ d("div", {
						className: "cad-cui-command-grid",
						children: [p.map((t) => /* @__PURE__ */ u($, {
							command: t,
							iconMap: e,
							source: "palette"
						}, t.id)), !p.length && /* @__PURE__ */ u(E, {
							title: "NINCS TALÁLAT",
							children: "Próbálj meg másik parancsnevet vagy engedélyezd a rejtett elemet."
						})]
					})
				]
			}),
			/* @__PURE__ */ d(T, { children: ["UTOLSÓ PARANCS: ", a.recentCommandIds[0] || "NINCS"] })
		]
	});
}
function ae({ className: e, ...t }) {
	let { registry: n, state: r, setPreference: i, toggleCommandVisibility: a, resetPreferences: o } = Z(), s = new Set(r.hiddenCommandIds);
	return /* @__PURE__ */ d(_, {
		...t,
		tone: "magenta",
		className: e,
		"data-testid": t["data-testid"] || "cad-cui-customizer",
		children: [
			/* @__PURE__ */ u(v, {
				eyebrow: "MUNKATÉR KALIBRÁLÁSA",
				title: "CUI PROFIL",
				description: "A beállítások csak a személyes munkatéri nézetet módosítják; a parancsok és a jogosultságok központilag definiáltak.",
				actions: /* @__PURE__ */ u(x, {
					compact: !0,
					onClick: o,
					children: "ALAPÉRTELMEZETT"
				})
			}),
			/* @__PURE__ */ u(y, {
				eyebrow: "VIZUÁLIS PROFIL",
				title: "AKCENTUS",
				compact: !0,
				children: /* @__PURE__ */ u(b, {
					label: "Akcentusszín",
					activeId: r.accentMode,
					onChange: (e) => i("accentMode", e),
					items: n.calibration.accentModes.map((e) => ({
						id: e.id,
						label: e.label
					}))
				})
			}),
			/* @__PURE__ */ u(y, {
				eyebrow: "TARTALMI NÉZET",
				title: "INFORMÁCIÓS SŰRŰSÉG",
				compact: !0,
				children: /* @__PURE__ */ d("div", {
					className: "cad-cui-stack cad-cui-stack--regular",
					children: [/* @__PURE__ */ u(b, {
						label: "Tartalmi sűrűség",
						activeId: r.density,
						onChange: (e) => i("density", e),
						items: n.calibration.densities.map((e) => ({
							id: e.id,
							label: e.label
						}))
					}), /* @__PURE__ */ u(b, {
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
			/* @__PURE__ */ u(y, {
				eyebrow: "PARANCSKIOSZTÁS",
				title: "LÁTHATÓ PARANCSOK",
				compact: !0,
				children: /* @__PURE__ */ u("div", {
					className: "cad-cui-command-grid",
					children: n.commands.filter((e) => e.customizable).map((e) => /* @__PURE__ */ u(C, {
						as: "label",
						title: e.label,
						detail: e.detail,
						active: !s.has(e.id),
						tone: e.tone,
						actions: /* @__PURE__ */ u("input", {
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
export { A as CAD_CUI_RUNTIME_VERSION, x as CadActionButton, ie as CadCuiCommandPalette, re as CadCuiContextMenu, ae as CadCuiCustomizer, X as CadCuiProvider, ne as CadCuiQuickAccess, te as CadCuiRibbon, C as CadDataRow, E as CadEmptyState, S as CadIconButton, T as CadPanelFooter, v as CadPanelHeader, y as CadPanelSection, _ as CadPanelShell, b as CadSegmentTabs, w as CadStatGrid, H as DEFAULT_CAD_CUI_SYSTEM, V as defineCadCuiSystem, K as loadCadCuiState, G as sanitizeCadCuiState, q as saveCadCuiState, J as selectCadCuiCommands, Z as useCadCui, Q as useCadCuiCommand };
