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
var M = Object.freeze([]), N = Object.freeze({}), P = n(null), ee = 1, F = (e) => String(e ?? "").trim(), I = (e) => [...new Set((Array.isArray(e) ? e : M).map(F).filter(Boolean))], te = (e) => ({
	id: F(e?.id),
	label: F(e?.label) || F(e?.id),
	detail: F(e?.detail),
	color: F(e?.color)
}), ne = (e) => Object.freeze({ ...e && typeof e == "object" ? e : N }), re = (e) => Object.freeze({
	surface: F(e?.surface),
	tab: F(e?.tab),
	menu: F(e?.menu),
	group: F(e?.group),
	label: F(e?.label),
	detail: F(e?.detail),
	icon: F(e?.icon),
	tone: F(e?.tone),
	order: Number.isFinite(Number(e?.order)) ? Number(e.order) : 0
}), ie = (e) => !e || typeof e != "object" || Object.isFrozen(e) ? e : (Object.freeze(e), Object.values(e).forEach(ie), e), ae = (e, t) => Array.isArray(e) ? e.includes(t) : !!e?.[t], oe = (e) => e instanceof HTMLElement && !!e.closest("input, textarea, select, [contenteditable=\"true\"]"), se = (e) => {
	let t = F(e.key).toUpperCase();
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
}, ce = (e) => F(e).toUpperCase().replace(/CMD|COMMAND/g, "CTRL").replace(/\s+/g, "");
function le(e = N) {
	let t = (Array.isArray(e.commands) ? e.commands : M).map((e) => ({
		id: F(e?.id),
		label: F(e?.label),
		detail: F(e?.detail || e?.description),
		icon: F(e?.icon),
		tone: F(e?.tone) || "cyan",
		toolId: F(e?.toolId),
		shortcut: F(e?.shortcut),
		requires: I(e?.requires),
		customizable: e?.customizable !== !1,
		alwaysVisible: !!e?.alwaysVisible,
		intent: ne(e?.intent),
		placements: (Array.isArray(e?.placements) ? e.placements : M).map(re)
	})).filter((e) => e.id && e.label), n = new Set(t.map((e) => e.id)), r = (Array.isArray(e.tabs) ? e.tabs : M).map((e) => ({
		id: F(e?.id),
		label: F(e?.label) || F(e?.id),
		color: F(e?.color) || "#00fbfb",
		tone: F(e?.tone) || "cyan"
	})).filter((e) => e.id), i = e.calibration && typeof e.calibration == "object" ? e.calibration : N, a = (Array.isArray(i.accentModes) ? i.accentModes : M).map(te).filter((e) => e.id), o = (Array.isArray(i.densities) ? i.densities : M).map(te).filter((e) => e.id), s = (Array.isArray(i.details) ? i.details : M).map(te).filter((e) => e.id), c = (Array.isArray(e.panels) ? e.panels : M).map((e) => ({
		...e,
		id: F(e?.id),
		title: F(e?.title) || F(e?.id)
	})).filter((e) => e.id), l = e.defaults && typeof e.defaults == "object" ? e.defaults : N, u = {
		version: Number(e.version) || 1,
		activeTab: r.some((e) => e.id === l.activeTab) ? l.activeTab : r[0]?.id || "",
		hiddenCommandIds: I(l.hiddenCommandIds).filter((e) => n.has(e)),
		accentMode: a.some((e) => e.id === l.accentMode) ? l.accentMode : a[0]?.id || "",
		density: o.some((e) => e.id === l.density) ? l.density : o[0]?.id || "",
		detail: s.some((e) => e.id === l.detail) ? l.detail : s[0]?.id || "",
		quickAccessIds: I(l.quickAccessIds).filter((e) => n.has(e)),
		recentCommandIds: M,
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
	return ie({
		id: F(e.id) || "cad-cui",
		version: Number(e.version) || 1,
		storageKey: F(e.storageKey) || "cad-cui-preferences:v1",
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
var ue = le({ id: "cad-cui-default" }), de = (e) => new Map(e.commands.map((e) => [e.id, e])), fe = (e, t) => e.some((e) => e.id === t);
function L(e, t) {
	let n = t && typeof t == "object" ? t : N, r = de(e), i = Array.isArray(n.hiddenToolIds) ? e.commands.filter((e) => n.hiddenToolIds.includes(e.toolId)).map((e) => e.id) : M, a = I(n.hiddenCommandIds || i).filter((e) => r.has(e) && !r.get(e).alwaysVisible);
	return {
		version: e.version,
		activeTab: e.tabs.some((e) => e.id === n.activeTab) ? n.activeTab : e.defaultState.activeTab,
		hiddenCommandIds: a,
		accentMode: fe(e.calibration.accentModes, n.accentMode) ? n.accentMode : e.defaultState.accentMode,
		density: fe(e.calibration.densities, n.density) ? n.density : e.defaultState.density,
		detail: fe(e.calibration.details, n.detail) ? n.detail : e.defaultState.detail,
		quickAccessIds: I(n.quickAccessIds || e.defaultState.quickAccessIds).filter((e) => r.has(e)),
		recentCommandIds: I(n.recentCommandIds).filter((e) => r.has(e)).slice(0, 8),
		commandStatus: {
			phase: "idle",
			id: "",
			error: ""
		}
	};
}
function pe(e, t = typeof window > "u" ? null : window.localStorage) {
	if (!t) return L(e, e.defaultState);
	try {
		let n = t.getItem(e.storageKey);
		if (!n) return L(e, e.defaultState);
		let r = JSON.parse(n);
		return L(e, r?.preferences || r);
	} catch {
		return L(e, e.defaultState);
	}
}
function me(e, t, n = typeof window > "u" ? null : window.localStorage) {
	if (!n) return !1;
	try {
		let r = L(e, t);
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
function he(e, t, { surface: n = "palette", tabId: r = "", menuId: i = "", capabilities: a = N } = N) {
	let o = new Set(t?.hiddenCommandIds || M);
	return e.commands.flatMap((e) => {
		if (o.has(e.id) && !e.alwaysVisible || e.requires.some((e) => !ae(a, e))) return M;
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
		}] : M;
	}).sort((e, t) => e.placement.order - t.placement.order || e.label.localeCompare(t.label, "hu"));
}
var ge = (e) => (t, n) => {
	switch (n.type) {
		case "tab.select": return L(e, {
			...t,
			activeTab: n.tabId
		});
		case "command.visibility": {
			let r = e.commands.find((e) => e.id === n.commandId);
			if (!r || r.alwaysVisible) return t;
			let i = t.hiddenCommandIds.includes(n.commandId) ? t.hiddenCommandIds.filter((e) => e !== n.commandId) : [...t.hiddenCommandIds, n.commandId];
			return L(e, {
				...t,
				hiddenCommandIds: i
			});
		}
		case "preference.set": return L(e, {
			...t,
			[n.key]: n.value
		});
		case "preferences.reset": return L(e, e.defaultState);
		case "command.completed": return {
			...t,
			recentCommandIds: I([n.commandId, ...t.recentCommandIds]).slice(0, 8),
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
				error: F(n.error) || "COMMAND_FAILED"
			}
		};
		default: return t;
	}
};
function _e({ registry: e = ue, capabilities: t = N, handlers: n = N, onCommand: r, children: i }) {
	let o = v(), s = _(), [l, f] = d(ge(e), e, (e) => pe(e)), p = u(() => de(e), [e]);
	c(() => {
		me(e, l);
	}, [e, l]);
	let m = a((e) => !!e && !(!e.alwaysVisible && l.hiddenCommandIds.includes(e.id)) && e.requires.every((e) => ae(t, e)), [t, l.hiddenCommandIds]), g = a((n = N) => he(e, l, {
		...n,
		capabilities: t
	}), [
		t,
		e,
		l
	]), y = a(async (e, { source: t = "api", payload: i = N } = N) => {
		let a = p.get(e);
		if (!a) return {
			ok: !1,
			reason: "COMMAND_NOT_FOUND"
		};
		if (!m(a)) return {
			ok: !1,
			reason: "COMMAND_NOT_AVAILABLE"
		};
		let c = {
			...a.intent,
			...i && typeof i == "object" ? i : N
		}, u = {
			commandId: e,
			command: a,
			intent: c,
			payload: i,
			source: t,
			state: l,
			location: s
		};
		try {
			if (c.type === "route.navigate") o(c.to, c.options);
			else {
				let e = n[c.type];
				if (typeof e != "function") return {
					ok: !1,
					reason: "COMMAND_HANDLER_NOT_FOUND"
				};
				await e({
					...u,
					navigate: o
				});
			}
			return r?.(u), f({
				type: "command.completed",
				commandId: e
			}), {
				ok: !0,
				event: u
			};
		} catch (t) {
			return f({
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
		p,
		n,
		s,
		o,
		r,
		l
	]);
	c(() => {
		if (typeof window > "u") return;
		let t = (t) => {
			if (t.defaultPrevented || oe(t.target)) return;
			let n = se(t), r = e.commands.find((e) => ce(e.shortcut) === n && m(e));
			r && (t.preventDefault(), y(r.id, { source: "shortcut" }));
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [
		m,
		y,
		e.commands
	]);
	let b = u(() => ({
		registry: e,
		state: l,
		capabilities: t,
		selectCommands: g,
		executeCommand: y,
		setActiveTab: (e) => f({
			type: "tab.select",
			tabId: e
		}),
		setPreference: (e, t) => f({
			type: "preference.set",
			key: e,
			value: t
		}),
		toggleCommandVisibility: (e) => f({
			type: "command.visibility",
			commandId: e
		}),
		resetPreferences: () => f({ type: "preferences.reset" }),
		canExecute: m
	}), [
		m,
		t,
		y,
		e,
		g,
		l
	]);
	return /* @__PURE__ */ h(P.Provider, {
		value: b,
		children: i
	});
}
function R() {
	let e = o(P);
	if (!e) throw Error("useCadCui must be used below CadCuiProvider.");
	return e;
}
function ve(e, t = "api") {
	let { executeCommand: n } = R();
	return a((r) => n(e, {
		source: t,
		payload: r
	}), [
		e,
		n,
		t
	]);
}
var ye = (e, t) => e?.[t] || null;
function z({ command: e, iconMap: t, source: n, role: r, badge: i, className: a }) {
	let { executeCommand: o } = R(), s = ye(t, e.icon);
	return /* @__PURE__ */ h(E, {
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
function be({ iconMap: e = N, className: t, title: n = "PARANCS SZALAG", description: r = "Deklaratív CUI-regiszterből épített munkatéri parancsok", renderBadge: i, ...a }) {
	let { registry: o, state: s, selectCommands: c, setActiveTab: l } = R(), u = o.tabs.find((e) => e.id === s.activeTab) || o.tabs[0], d = c({
		surface: "ribbon",
		tabId: u?.id
	});
	return /* @__PURE__ */ g(S, {
		...a,
		tone: u?.tone || "cyan",
		scroll: !1,
		className: t,
		"data-testid": a["data-testid"] || "cad-cui-ribbon",
		children: [/* @__PURE__ */ h(C, {
			eyebrow: "CUI REGISZTER",
			title: n,
			description: r,
			status: u?.label || "NÉZET"
		}), /* @__PURE__ */ g(w, {
			eyebrow: "MUNKATÉR",
			title: "PARANCSCSOPORT",
			compact: !0,
			children: [/* @__PURE__ */ h(T, {
				label: "CAD szalag fülek",
				activeId: u?.id,
				onChange: l,
				items: o.tabs.map((e) => ({
					id: e.id,
					label: e.label
				}))
			}), /* @__PURE__ */ h("div", {
				className: "cad-cui-command-grid cad-cui-command-grid--ribbon",
				role: "toolbar",
				"aria-label": `${u?.label || "CAD"} parancsok`,
				children: d.map((t) => /* @__PURE__ */ h(z, {
					command: t,
					iconMap: e,
					source: "ribbon",
					badge: i?.(t) ?? t.label
				}, t.id))
			})]
		})]
	});
}
function xe({ iconMap: e = N, commandIds: t, className: n, ...r }) {
	let { registry: i, state: a, canExecute: o } = R(), s = (Array.isArray(t) ? t : a.quickAccessIds).map((e) => i.commands.find((t) => t.id === e)).filter((e) => o(e));
	return /* @__PURE__ */ h("div", {
		...r,
		className: ["cad-cui-quick-access", n].filter(Boolean).join(" "),
		"data-testid": r["data-testid"] || "cad-cui-quick-access",
		role: "toolbar",
		"aria-label": "Gyors elérés",
		children: s.map((t) => /* @__PURE__ */ h(z, {
			command: t,
			iconMap: e,
			source: "quick-access"
		}, t.id))
	});
}
function Se({ menuId: e = "canvas", iconMap: t = N, className: n, onClose: r, ...i }) {
	let { selectCommands: a } = R(), o = a({
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
				children: [o.map((e) => /* @__PURE__ */ h(z, {
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
function Ce({ iconMap: e = N, className: t, ...n }) {
	let { selectCommands: r, state: i } = R(), [a, o] = p(""), c = s(a), l = u(() => {
		let e = F(c).toLocaleLowerCase("hu");
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
						children: [l.map((t) => /* @__PURE__ */ h(z, {
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
function we({ className: e, ...t }) {
	let { registry: n, state: r, setPreference: i, toggleCommandVisibility: a, resetPreferences: o } = R(), s = new Set(r.hiddenCommandIds);
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
var B = (...e) => e.filter(Boolean).join(" "), V = (e) => Array.isArray(e) ? e : [], H = (e) => String(typeof e == "string" || typeof e == "number" ? e : e?.label ?? e?.name ?? e?.id ?? "");
function U(e, t, n) {
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
var W = (e, t, n) => Number.isFinite(e) ? Number.isFinite(t) && e < t ? t : Number.isFinite(n) && e > n ? n : e : e, Te = (e, t, n) => {
	e?.disabled || (e?.onClick?.(e, t), n?.(e, t));
};
function G({ shortcut: e, className: t }) {
	return e ? /* @__PURE__ */ h("kbd", {
		className: B("cad-shortcut-hint", t),
		children: e
	}) : null;
}
function Ee({ icon: e, label: t, shortcut: n, active: r = !1, toggle: i = !1, tone: a = "inherit", badge: o, compact: s = !1, className: c, children: l, title: u, type: d = "button", ...f }) {
	let p = t || (typeof l == "string" ? l : "CAD tool");
	return /* @__PURE__ */ g("button", {
		...f,
		type: d,
		"data-tone": a,
		"data-active": r ? "true" : "false",
		"aria-pressed": i ? r : void 0,
		"aria-label": f["aria-label"] || p,
		title: u || [p, n].filter(Boolean).join(" · "),
		className: B("cad-tool-button", s && "cad-tool-button--compact", c),
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
			n && /* @__PURE__ */ h(G, { shortcut: n })
		]
	});
}
function De({ active: e = !1, onChange: t, onClick: n, ...r }) {
	return /* @__PURE__ */ h(Ee, {
		...r,
		active: e,
		toggle: !0,
		onClick: (r) => {
			t?.(!e, r), n?.(r);
		}
	});
}
function Oe({ icon: e, label: t, shortcut: n, tone: r = "inherit", disabled: i = !1, menu: a, menuId: o, menuOpen: s, defaultMenuOpen: u = !1, onMenuOpenChange: d, onClick: p, className: m, children: _, ...v }) {
	let y = l(), b = o || `cad-split-menu-${y}`, x = f(null), S = f(null), [C, w] = U(s, u, (e, t) => d?.(e, t));
	c(() => {
		if (!C) return;
		let e = window.setTimeout(() => S.current?.querySelector("[role=\"menuitem\"]:not(:disabled), button:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [C]);
	let T = (e) => {
		w(!1, e), window.setTimeout(() => x.current?.focus(), 0);
	};
	return /* @__PURE__ */ g("span", {
		className: B("cad-split-button", m),
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
					n && /* @__PURE__ */ h(G, { shortcut: n })
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
function ke({ label: e, items: t = [], onAction: n, className: r, children: i }) {
	return /* @__PURE__ */ g("section", {
		className: B("cad-toolbar-group", r),
		"aria-label": e,
		children: [/* @__PURE__ */ g("div", {
			className: "cad-toolbar-group__tools",
			children: [V(t).map((e, t) => {
				if (e?.type === "separator") return /* @__PURE__ */ h("span", {
					className: "cad-toolbar-group__separator",
					role: "separator",
					"aria-orientation": "vertical"
				}, e.id || `separator-${t}`);
				let r = {
					key: e.id || `${H(e)}-${t}`,
					icon: e.icon,
					label: H(e),
					shortcut: e.shortcut,
					tone: e.tone,
					disabled: e.disabled,
					active: e.active,
					badge: e.badge,
					title: e.title || e.detail,
					className: e.className
				}, i = (t) => Te(e, t, n);
				return e?.type === "split" ? /* @__PURE__ */ h(Oe, {
					...r,
					menu: e.menu,
					menuOpen: e.menuOpen,
					onMenuOpenChange: (t, n) => e.onMenuOpenChange?.(t, e, n),
					onClick: i
				}) : e?.toggle ? /* @__PURE__ */ h(De, {
					...r,
					onChange: (t, r) => {
						e.onChange?.(t, e, r), n?.({
							...e,
							active: t
						}, r);
					}
				}) : /* @__PURE__ */ h(Ee, {
					...r,
					onClick: i
				});
			}), i]
		}), e && /* @__PURE__ */ h("span", {
			className: "cad-toolbar-group__label",
			children: e
		})]
	});
}
function Ae({ groups: e, items: t, label: n = "CAD tools", orientation: r = "horizontal", onAction: i, className: a, children: o, ...s }) {
	let c = V(e).length ? V(e) : [{
		id: "default",
		items: V(t)
	}];
	return /* @__PURE__ */ g("div", {
		...s,
		className: B("cad-toolbar", `cad-toolbar--${r}`, a),
		role: "toolbar",
		"aria-label": n,
		"aria-orientation": r,
		children: [c.map((e, t) => /* @__PURE__ */ h(ke, {
			label: e.label,
			items: e.items,
			onAction: i
		}, e.id || e.label || t)), o]
	});
}
function je({ groups: e, items: t, label: n = "CAD tool palette", className: r, ...i }) {
	return /* @__PURE__ */ h(Ae, {
		...i,
		groups: e,
		items: t,
		label: n,
		orientation: "vertical",
		className: B("cad-tool-palette", r)
	});
}
function K({ id: e, label: t, value: n, defaultValue: r = "", onValueChange: i, onChange: a, min: o, max: s, step: c = 1, unit: u, prefix: d, suffix: f, asNumber: p = !0, disabled: m = !1, readOnly: _ = !1, showSteppers: v = !0, className: y, inputClassName: b, ...x }) {
	let S = l(), C = e || `cad-number-${S}`, [w, T] = U(n, r, (e, t) => {
		i?.(e, t), a?.(e, t);
	}), E = (e, t) => {
		let n = p && e !== "" ? Number(e) : e;
		T(n, t);
	}, D = (e, t) => {
		let n = Number(w), r = Number(c) || 1, i = W((Number.isFinite(n) ? n : 0) + e * r, Number(o), Number(s));
		E(i, t);
	};
	return /* @__PURE__ */ g("div", {
		className: B("cad-numeric-input", m && "cad-numeric-input--disabled", y),
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
					className: B("cad-numeric-input__field", b),
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
function Me({ unit: e = "mm", ...t }) {
	return /* @__PURE__ */ h(K, {
		...t,
		unit: e
	});
}
function Ne({ unit: e = "°", ...t }) {
	return /* @__PURE__ */ h(K, {
		...t,
		unit: e
	});
}
function Pe({ value: e, defaultValue: t = {
	x: "",
	y: "",
	z: ""
}, onValueChange: n, onChange: i, axes: a = [
	"X",
	"Y",
	"Z"
], unit: o = "mm", label: s = "Coordinates", className: c, ...l }) {
	let [u, d] = U(e, t, (e, t, r) => {
		n?.(e, t, r), i?.(e, t, r);
	});
	return /* @__PURE__ */ g("fieldset", {
		className: B("cad-coordinate-input", c),
		children: [s && /* @__PURE__ */ h("legend", { children: s }), /* @__PURE__ */ h("div", {
			className: "cad-coordinate-input__axes",
			children: V(a).map((e) => {
				let t = String(e).toLowerCase();
				return /* @__PURE__ */ r(Me, {
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
function q({ color: e = "#ffffff", label: t, size: n = "regular", onClick: r, className: i, style: a, ...o }) {
	let s = /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("span", {
		className: "cad-color-swatch__chip",
		style: { "--cad-swatch-color": e },
		"aria-hidden": "true"
	}), t && /* @__PURE__ */ h("span", {
		className: "cad-color-swatch__label",
		children: t
	})] }), c = {
		...o,
		className: B("cad-color-swatch", `cad-color-swatch--${n}`, i),
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
function Fe({ type: e = "continuous", color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ g("span", {
		className: B("cad-linetype-preview", r),
		"data-type": e,
		style: { "--cad-line-color": t },
		title: n || e,
		"aria-label": n || e,
		children: [/* @__PURE__ */ h("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ h("small", { children: n })]
	});
}
function Ie({ weight: e = .25, color: t = "currentColor", label: n, className: r }) {
	return /* @__PURE__ */ g("span", {
		className: B("cad-lineweight-preview", r),
		style: {
			"--cad-line-color": t,
			"--cad-line-weight": `${Math.max(1, Number(e) * 4)}px`
		},
		title: n || `${e} mm`,
		"aria-label": n || `${e} mm`,
		children: [/* @__PURE__ */ h("span", { "aria-hidden": "true" }), n && /* @__PURE__ */ h("small", { children: n })]
	});
}
function Le({ className: e }) {
	return /* @__PURE__ */ h("div", {
		className: B("cad-menu__separator", e),
		role: "separator"
	});
}
function Re({ item: e, label: t, detail: n, shortcut: r, icon: i, checked: a, disabled: o = !1, type: s = "action", tone: c = "inherit", onClick: l, className: u }) {
	let d = t || H(e), f = a ?? e?.checked, p = o || e?.disabled, m = s === "checkbox" ? "menuitemcheckbox" : s === "radio" ? "menuitemradio" : "menuitem";
	return /* @__PURE__ */ g("button", {
		type: "button",
		role: m,
		disabled: p,
		"data-tone": c || e?.tone || "inherit",
		"aria-checked": m === "menuitem" ? void 0 : !!f,
		className: B("cad-menu__item", f && "cad-menu__item--checked", u),
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
			r && /* @__PURE__ */ h(G, { shortcut: r })
		]
	});
}
function ze({ items: e = [], label: t = "CAD menu", onAction: n, onClose: r, className: i, children: a, menuRef: o, ...s }) {
	let c = f(null), l = o || c, u = (e) => {
		let t = [...l.current?.querySelectorAll("[role^=\"menuitem\"]") || []].filter((e) => !e.disabled);
		t.length && t[(t.indexOf(document.activeElement) + e + t.length) % t.length].focus();
	};
	return /* @__PURE__ */ g("div", {
		...s,
		ref: l,
		className: B("cad-menu", i),
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
		children: [V(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ h(Le, {}, e.id || `separator-${t}`) : /* @__PURE__ */ h(Re, {
			item: e,
			label: H(e),
			detail: e.detail,
			shortcut: e.shortcut,
			icon: e.icon,
			checked: e.checked,
			disabled: e.disabled,
			type: e.type,
			tone: e.tone,
			onClick: (e, t) => Te(e, t, n)
		}, e.id || `${H(e)}-${t}`)), a]
	});
}
function Be({ items: e = [], label: t = "More options", open: n, defaultOpen: r = !1, onOpenChange: i, onAction: a, className: o, triggerLabel: s = "More", ...u }) {
	let [d, p] = U(n, r, (e, t) => i?.(e, t)), m = `cad-overflow-menu-${l()}`, _ = f(null), v = f(null);
	c(() => {
		if (!d) return;
		let e = window.setTimeout(() => v.current?.querySelector("[role^=\"menuitem\"]:not(:disabled)")?.focus(), 0);
		return () => window.clearTimeout(e);
	}, [d]);
	let y = (e) => {
		p(!1, e), window.setTimeout(() => _.current?.focus(), 0);
	};
	return /* @__PURE__ */ g("span", {
		className: B("cad-overflow-menu", o),
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
		}), d && /* @__PURE__ */ h(ze, {
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
//#region src/CadDraftingUi.jsx
var Ve = Object.freeze({
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
}), He = Object.freeze([
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
]), Ue = Object.freeze([
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
]), We = Object.freeze([
	"1:1",
	"1:2",
	"1:5",
	"1:10",
	"1:20",
	"1:50",
	"1:100"
]), Ge = Object.freeze([
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
]), Ke = (e) => V(e).map((e, t) => typeof e == "string" ? {
	id: e,
	label: e
} : {
	...e,
	id: e?.id || `${H(e)}-${t}`,
	label: H(e)
});
function qe({ mode: e = "point", fields: t, value: n, defaultValue: r = {}, onChange: i, onSubmit: a, prompt: o = "Specify point", unit: s = "mm", visible: c = !0, submitLabel: d = "Accept", className: f, children: p, ...m }) {
	let _ = l(), v = V(t).length ? V(t) : Ve[e] || Ve.point, y = u(() => v.reduce((e, t) => t?.id && t.value !== void 0 ? {
		...e,
		[t.id]: t.value
	} : e, {}), [v]), [b, x] = U(n, u(() => ({
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
		className: B("cad-dynamic-input", f),
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
					let n = {
						key: e.id || t,
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
					return e.type === "angle" ? /* @__PURE__ */ h(Ne, {
						...n,
						unit: e.unit || "°"
					}) : e.type === "unit" ? /* @__PURE__ */ h(Me, { ...n }) : /* @__PURE__ */ h(K, { ...n });
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
function Je({ modes: e = He, activeIds: t, defaultActiveIds: n = [], multiple: r = !0, onChange: i, onClose: a, label: o = "Object snaps", className: s, ...c }) {
	let l = u(() => Ke(e), [e]), [d, f] = U(t, n, (e, t, n) => i?.(e, t, n)), p = new Set(V(d)), m = (e, t) => {
		if (e.disabled) return;
		let n = r ? p.has(e.id) ? [...p].filter((t) => t !== e.id) : [...p, e.id] : p.has(e.id) ? [] : [e.id];
		f(n, e, t);
	};
	return /* @__PURE__ */ g("aside", {
		...c,
		className: B("cad-object-snap-menu", s),
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
					e.shortcut && /* @__PURE__ */ h(G, { shortcut: e.shortcut })
				]
			}, e.id))
		})]
	});
}
function Ye({ tools: e = [], selectionCount: t, label: n = "Selection tools", onAction: r, onDismiss: i, className: a, ...o }) {
	return /* @__PURE__ */ g("aside", {
		...o,
		className: B("cad-grip-toolbar", a),
		"aria-label": n,
		children: [
			t !== void 0 && /* @__PURE__ */ g("output", {
				className: "cad-grip-toolbar__selection",
				children: [t, " selected"]
			}),
			/* @__PURE__ */ h("div", {
				role: "group",
				"aria-label": n,
				children: V(e).map((e, t) => e?.type === "separator" ? /* @__PURE__ */ h("span", {
					className: "cad-grip-toolbar__separator",
					role: "separator"
				}, e.id || t) : /* @__PURE__ */ h(Ee, {
					icon: e?.icon,
					label: H(e),
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
function Xe({ constraints: e = Ue, activeIds: t, defaultActiveIds: n = [], onChange: r, onAction: i, label: a = "Geometric constraints", className: o, ...s }) {
	let c = u(() => Ke(e), [e]), [l, d] = U(t, n, (e, t, n) => r?.(e, t, n)), f = new Set(V(l)), p = (e, t) => {
		if (e.disabled) return;
		let n = f.has(e.id) ? [...f].filter((t) => t !== e.id) : [...f, e.id];
		d(n, e, t), i?.(e, t);
	};
	return /* @__PURE__ */ h("div", {
		...s,
		className: B("cad-constraint-bar", o),
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
function Ze({ scales: e = We, value: t, defaultValue: n, onChange: r, label: i = "Annotation scale", onManage: a, id: o, selectProps: s = {}, disabled: c = !1, className: d, ...f }) {
	let p = l(), m = o || `cad-annotation-scale-${p}`, _ = u(() => Ke(e), [e]), [v, y] = U(t, n ?? _[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("div", {
		...f,
		className: B("cad-annotation-scale-picker", d),
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
function Qe({ presets: e = Ge, value: t, defaultValue: n, onChange: r, label: i = "View preset", id: a, selectProps: o = {}, disabled: s = !1, className: c, ...d }) {
	let f = l(), p = a || `cad-view-preset-${f}`, m = u(() => Ke(e), [e]), [_, v] = U(t, n ?? m[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("div", {
		...d,
		className: B("cad-view-preset-picker", c),
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
function $e({ angle: e, distance: t, increment: n, active: r, defaultActive: i = !1, onActiveChange: a, className: o, label: s = "Polar tracking", ...c }) {
	let [l, u] = U(r, i, (e, t) => a?.(e, t));
	return /* @__PURE__ */ g("div", {
		...c,
		className: B("cad-polar-tracker", l && "cad-polar-tracker--active", o),
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
function et({ type: e = "endpoint", label: t, active: n = !0, className: r, style: i, ...a }) {
	let o = He.find((t) => t.id === e)?.glyph || "•";
	return /* @__PURE__ */ g("span", {
		...a,
		className: B("cad-object-snap-marker", n && "cad-object-snap-marker--active", r),
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
function tt({ label: e = "Selection grip", variant: t = "square", active: n = !1, disabled: r = !1, onPointerDown: i, onClick: a, className: o, ...s }) {
	return /* @__PURE__ */ h("button", {
		...s,
		type: "button",
		className: B("cad-selection-grip", n && "cad-selection-grip--active", o),
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
var J = (e, t) => (n) => {
	e?.(n), n.defaultPrevented || t?.(n);
}, nt = "[data-autofocus], button:not(:disabled):not([tabindex=\"-1\"]), input:not(:disabled):not([tabindex=\"-1\"]), select:not(:disabled):not([tabindex=\"-1\"]), textarea:not(:disabled):not([tabindex=\"-1\"]), [href]:not([tabindex=\"-1\"]), [tabindex]:not([tabindex=\"-1\"])", rt = (e) => [...e?.querySelectorAll(nt) || []].filter((e) => !e.hidden && e.getAttribute("aria-hidden") !== "true");
function it({ open: e = !1, onClose: t, title: n, description: r, actions: i, tone: a = "neutral", closeOnBackdrop: o = !0, closeOnEscape: s = !0, className: u, children: d, ...p }) {
	let m = l(), _ = `cad-dialog-title-${m}`, v = `cad-dialog-description-${m}`, y = f(null), b = f(null);
	return c(() => {
		if (!e || typeof document > "u") return;
		b.current = document.activeElement;
		let n = () => {
			let e = y.current;
			(rt(e)[0] || e)?.focus?.();
		}, r = (e) => {
			if (e.key === "Escape" && s) {
				e.preventDefault(), t?.(e);
				return;
			}
			if (e.key !== "Tab") return;
			let n = rt(y.current);
			if (!n.length) {
				e.preventDefault(), y.current?.focus();
				return;
			}
			let r = n[0], i = n[n.length - 1];
			e.shiftKey && document.activeElement === r ? (e.preventDefault(), i.focus()) : !e.shiftKey && document.activeElement === i && (e.preventDefault(), r.focus());
		}, i = window.setTimeout(n, 0);
		return window.addEventListener("keydown", r), () => {
			window.clearTimeout(i), window.removeEventListener("keydown", r), b.current?.focus?.();
		};
	}, [
		s,
		t,
		e
	]), e ? /* @__PURE__ */ h("div", {
		className: "cad-dialog-backdrop",
		"data-tone": a,
		role: "presentation",
		onMouseDown: (e) => {
			o && e.target === e.currentTarget && t?.(e);
		},
		children: /* @__PURE__ */ g("section", {
			...p,
			ref: y,
			tabIndex: -1,
			className: B("cad-dialog", u),
			"data-tone": a,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": n ? void 0 : p["aria-label"] || "CAD dialog",
			"aria-labelledby": n ? _ : void 0,
			"aria-describedby": r ? v : void 0,
			onKeyDown: (e) => p.onKeyDown?.(e),
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
						"aria-label": `Close ${n || "dialog"}`,
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
	}) : null;
}
function at({ open: e, title: t = "Confirm action", description: n, confirmLabel: r = "Confirm", cancelLabel: i = "Cancel", destructive: a = !1, onConfirm: o, onCancel: s, children: c, className: l, ...u }) {
	return /* @__PURE__ */ h(it, {
		...u,
		open: e,
		title: t,
		description: n,
		onClose: s,
		className: B("cad-confirm-dialog", l),
		actions: /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("button", {
			type: "button",
			...a ? { "data-autofocus": !0 } : {},
			className: "cad-dialog__button cad-dialog__button--quiet",
			onClick: s,
			children: i
		}), /* @__PURE__ */ h("button", {
			type: "button",
			...a ? {} : { "data-autofocus": !0 },
			className: B("cad-dialog__button", a && "cad-dialog__button--danger"),
			onClick: o,
			children: r
		})] }),
		children: c
	});
}
function ot({ toast: e, onDismiss: t, className: n }) {
	let r = e || {}, i = r.tone || "neutral";
	return /* @__PURE__ */ g("article", {
		className: B("cad-toast", n),
		"data-tone": i,
		role: i === "danger" || i === "error" ? "alert" : "status",
		children: [
			/* @__PURE__ */ h("span", {
				className: "cad-toast__signal",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ g("div", {
				className: "cad-toast__copy",
				children: [/* @__PURE__ */ h("strong", { children: r.title || H(r) || "CAD notification" }), r.message && /* @__PURE__ */ h("p", { children: r.message })]
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
				"aria-label": `Dismiss ${r.title || H(r) || "notification"}`,
				onClick: (e) => t(r, e),
				children: "×"
			})
		]
	});
}
function st({ toasts: e = [], onDismiss: t, placement: n = "bottom-right", label: r = "Notifications", className: i, ...a }) {
	return /* @__PURE__ */ h("section", {
		...a,
		className: B("cad-toast-stack", `cad-toast-stack--${n}`, i),
		"aria-label": r,
		"aria-live": "polite",
		children: V(e).map((e, n) => /* @__PURE__ */ h(ot, {
			toast: e,
			onDismiss: t
		}, e?.id || n))
	});
}
function ct({ trigger: e, content: n, open: r, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", label: u = "More options", contentRole: d = "dialog", closeOnOutside: p = !0, restoreFocus: m = !0, className: _, contentClassName: v, ...y }) {
	let b = `cad-popover-${l()}`, x = f(null), [S, C] = U(r, a, (e, t) => o?.(e, t)), w = () => {
		m && window.requestAnimationFrame(() => x.current?.querySelector("button:not(:disabled), [tabindex]:not([tabindex=\"-1\"])")?.focus?.());
	}, T = (e) => {
		C(!1, e), w();
	}, E = (e) => C(!S, e);
	c(() => {
		if (!S || !p || typeof document > "u") return;
		let e = (e) => {
			x.current?.contains(e.target) || T(e);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [p, S]);
	let D = i(e) ? t(e, {
		"aria-haspopup": e.props["aria-haspopup"] || "dialog",
		"aria-expanded": S,
		"aria-controls": S ? b : void 0,
		onClick: J(e.props.onClick, E)
	}) : /* @__PURE__ */ h("button", {
		type: "button",
		className: "cad-popover__fallback-trigger",
		"aria-haspopup": "dialog",
		"aria-expanded": S,
		"aria-controls": S ? b : void 0,
		onClick: E,
		children: e || "Options"
	});
	return /* @__PURE__ */ g("div", {
		...y,
		ref: x,
		className: B("cad-popover", `cad-popover--${s}`, _),
		onKeyDown: (e) => {
			y.onKeyDown?.(e), !e.defaultPrevented && e.key === "Escape" && S && (e.preventDefault(), T(e));
		},
		children: [D, S && /* @__PURE__ */ h("section", {
			id: b,
			className: B("cad-popover__content", v),
			role: d,
			"aria-label": u,
			children: typeof n == "function" ? n({ close: T }) : n
		})]
	});
}
function lt({ content: e, placement: n = "top", className: r, children: a }) {
	let o = l(), [s, c] = p(!1);
	if (!e || !i(a)) return a || null;
	let u = t(a, {
		"aria-describedby": [a.props["aria-describedby"], `cad-tooltip-${o}`].filter(Boolean).join(" "),
		onMouseEnter: J(a.props.onMouseEnter, () => c(!0)),
		onMouseLeave: J(a.props.onMouseLeave, () => c(!1)),
		onFocus: J(a.props.onFocus, () => c(!0)),
		onBlur: J(a.props.onBlur, () => c(!1))
	});
	return /* @__PURE__ */ g("span", {
		className: B("cad-tooltip", `cad-tooltip--${n}`, s && "cad-tooltip--visible", r),
		children: [u, /* @__PURE__ */ h("span", {
			id: `cad-tooltip-${o}`,
			className: "cad-tooltip__bubble",
			role: "tooltip",
			children: e
		})]
	});
}
function ut({ shortcuts: e = [], title: t = "Keyboard shortcuts", onClose: n, className: r, ...i }) {
	let a = V(e).reduce((e, t, n) => {
		let r = t?.group || "General";
		return e[r] || (e[r] = []), e[r].push({
			...t,
			id: t?.id || `${r}-${n}`
		}), e;
	}, {});
	return /* @__PURE__ */ g("section", {
		...i,
		className: B("cad-shortcut-reference", r),
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
				/* @__PURE__ */ h("dd", { children: /* @__PURE__ */ h(G, { shortcut: e.shortcut || e.keys }) }),
				e.detail && /* @__PURE__ */ h("small", { children: e.detail })
			] }, e.id)) })] }, e))
		})]
	});
}
function dt({ open: e = !0, label: t = "Command input", prompt: n, value: r, defaultValue: i = "", onChange: a, onSubmit: o, onCancel: s, placeholder: c, submitLabel: u = "Accept", className: d, ...f }) {
	let p = l(), [m, _] = U(r, i, (e, t) => a?.(e, t));
	return e ? /* @__PURE__ */ g("form", {
		...f,
		className: B("cad-command-prompt", d),
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
var ft = Object.freeze([
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
]), pt = Object.freeze([
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
]), mt = Object.freeze([
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
]), Y = (e) => V(e).map((e, t) => typeof e == "string" || typeof e == "number" ? {
	id: String(e),
	label: String(e),
	value: e
} : {
	...e,
	id: e?.id || `${H(e)}-${t}`,
	label: H(e)
}), ht = (e) => typeof e == "string" ? {
	mode: "rgb",
	value: e
} : !e || typeof e != "object" ? { mode: "by-layer" } : {
	...e,
	mode: e.mode || "rgb",
	value: e.value || e.hex
}, gt = (e) => {
	let t = ht(e);
	return t.mode === "by-layer" ? "ByLayer" : t.mode === "by-block" ? "ByBlock" : t.value || t.hex || "Color";
};
function _t({ orientation: e = "horizontal", size: t, defaultSize: n = 30, minSize: r = 12, maxSize: i = 88, keyboardStep: a = 5, primary: o, secondary: s, onSizeChange: l, onResizeStart: u, onResizeEnd: d, className: p, ...m }) {
	let _ = f(null), v = f(null), y = f(n), b = f(null), x = f(null), [S, C] = U(t, n, (e, t, n) => l?.(e, t, n)), w = W(Number(S) || n, Number(r), Number(i)), T = e === "vertical" ? "y" : "x", E = e === "vertical" ? "horizontal" : "vertical";
	v.current || (y.current = w), b.current ||= (e) => {
		let t = v.current, n = _.current;
		if (!t || !n || e.pointerId !== void 0 && t.pointerId !== void 0 && e.pointerId !== t.pointerId) return;
		let r = n.getBoundingClientRect(), i = t.orientation === "vertical" ? r.height : r.width, a = t.orientation === "vertical" ? e.clientY - r.top : e.clientX - r.left, o = W(Math.round(a / Math.max(i, 1) * 100 * 10) / 10, t.minSize, t.maxSize);
		y.current = o, t.setSize(o, {
			source: "pointer",
			axis: t.axis
		}, e);
	}, x.current ||= (e) => {
		let t = v.current;
		if (!(!t || e.pointerId !== void 0 && t.pointerId !== void 0 && e.pointerId !== t.pointerId)) {
			v.current = null, window.removeEventListener("pointermove", b.current), window.removeEventListener("pointerup", x.current), window.removeEventListener("pointercancel", x.current);
			try {
				t.divider?.releasePointerCapture?.(t.pointerId);
			} catch {}
			t.onResizeEnd?.(y.current, e);
		}
	}, c(() => () => {
		window.removeEventListener("pointermove", b.current), window.removeEventListener("pointerup", x.current), window.removeEventListener("pointercancel", x.current), v.current = null;
	}, []);
	let D = (t) => {
		(t.button === void 0 || t.button === 0) && (t.preventDefault(), v.current && x.current(t), y.current = w, v.current = {
			pointerId: t.pointerId,
			divider: t.currentTarget,
			orientation: e,
			minSize: Number(r),
			maxSize: Number(i),
			axis: T,
			setSize: C,
			onResizeEnd: d
		}, t.currentTarget.setPointerCapture?.(t.pointerId), u?.(w, t), window.addEventListener("pointermove", b.current), window.addEventListener("pointerup", x.current), window.addEventListener("pointercancel", x.current));
	}, O = (e, t) => {
		let n = W(w + e, Number(r), Number(i));
		C(n, {
			source: "keyboard",
			axis: T
		}, t);
	};
	return /* @__PURE__ */ g("section", {
		...m,
		ref: _,
		className: B("cad-split-pane", `cad-split-pane--${e}`, p),
		style: {
			"--cad-split-size": `${w}%`,
			...m.style
		},
		children: [
			/* @__PURE__ */ h("div", {
				className: "cad-split-pane__primary",
				children: o
			}),
			/* @__PURE__ */ h("div", {
				className: "cad-split-pane__divider",
				role: "separator",
				"aria-orientation": E,
				"aria-valuemin": r,
				"aria-valuemax": i,
				"aria-valuenow": Math.round(w),
				tabIndex: 0,
				onPointerDown: D,
				onKeyDown: (t) => {
					let n = e === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"], o = e === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
					n.includes(t.key) && (t.preventDefault(), O(Number(a), t)), o.includes(t.key) && (t.preventDefault(), O(-Number(a), t)), t.key === "Home" && (t.preventDefault(), C(Number(r), {
						source: "keyboard",
						axis: T
					}, t)), t.key === "End" && (t.preventDefault(), C(Number(i), {
						source: "keyboard",
						axis: T
					}, t));
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
function vt({ item: e, open: t, onToggle: n, onAction: r, onClose: i }) {
	let a = Y(e?.items);
	return /* @__PURE__ */ g("span", {
		className: B("cad-menu-bar__menu", t && "cad-menu-bar__menu--open"),
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			role: "menuitem",
			"data-menu-id": e.id,
			"aria-haspopup": "menu",
			"aria-expanded": t,
			onClick: (t) => n(e, t),
			children: [H(e), e?.shortcut && /* @__PURE__ */ h(G, { shortcut: e.shortcut })]
		}), t && /* @__PURE__ */ h("div", {
			className: "cad-menu-bar__popup",
			role: "menu",
			"aria-label": H(e),
			children: a.map((e) => e.type === "separator" ? /* @__PURE__ */ h("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ h(yt, {
				item: e,
				onAction: r,
				onClose: i
			}, e.id))
		})]
	});
}
function yt({ item: e, onAction: t, onClose: n, className: r }) {
	let i = Y(e?.items), a = i.length > 0, [o, s] = U(void 0, !1);
	return /* @__PURE__ */ g("span", {
		className: B("cad-submenu", o && "cad-submenu--open", r),
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
					children: H(e)
				}),
				e?.shortcut && /* @__PURE__ */ h(G, { shortcut: e.shortcut }),
				a && /* @__PURE__ */ h("span", {
					className: "cad-submenu__caret",
					"aria-hidden": "true",
					children: "›"
				})
			]
		}), a && o && /* @__PURE__ */ h("div", {
			className: "cad-submenu__popup",
			role: "menu",
			"aria-label": H(e),
			children: i.map((e) => e.type === "separator" ? /* @__PURE__ */ h("div", {
				className: "cad-menu-bar__separator",
				role: "separator"
			}, e.id) : /* @__PURE__ */ h(yt, {
				item: e,
				onAction: t,
				onClose: n
			}, e.id))
		})]
	});
}
function bt({ items: e = [], openId: t, defaultOpenId: n = "", onOpenChange: r, onAction: i, label: a = "CAD application menu", className: o, ...s }) {
	let c = u(() => Y(e), [e]), [l, d] = U(t, n, (e, t, n) => r?.(e, t, n)), f = c.find((e) => e.id === l), p = (e, t) => d(e.id === l ? "" : e.id, e, t), m = (e, t) => {
		let n = [...e.currentTarget.querySelectorAll(":scope > .cad-menu-bar__menu > button:not(:disabled)")], r = n[(Math.max(0, n.indexOf(document.activeElement)) + t + n.length) % n.length];
		r?.focus();
		let i = r?.dataset.menuId;
		i && l && d(i, c.find((e) => e.id === i), e);
	};
	return /* @__PURE__ */ h("nav", {
		...s,
		className: B("cad-menu-bar", o),
		role: "menubar",
		"aria-label": a,
		onKeyDown: (e) => {
			if (e.key === "ArrowRight" && (e.preventDefault(), m(e, 1)), e.key === "ArrowLeft" && (e.preventDefault(), m(e, -1)), e.key === "Escape" && (e.preventDefault(), d("", f, e)), e.key === "ArrowDown" && document.activeElement?.getAttribute("role") === "menuitem") {
				e.preventDefault();
				let t = c.find((e) => e.id === document.activeElement.dataset.menuId);
				t && d(t.id, t, e);
			}
		},
		children: c.map((e) => /* @__PURE__ */ h(vt, {
			item: e,
			open: l === e.id,
			onToggle: p,
			onAction: i,
			onClose: (t) => d("", e, t)
		}, e.id))
	});
}
function xt({ value: e, defaultValue: t = { mode: "by-layer" }, onChange: n, colors: r = ft, allowByLayer: i = !0, allowByBlock: a = !0, label: o = "Color", className: s, ...c }) {
	let [l, u] = U(e, t, (e, t) => n?.(e, t)), d = ht(l), f = (e, t) => u(e, t);
	return /* @__PURE__ */ g("section", {
		...c,
		className: B("cad-color-picker", s),
		"aria-label": o,
		children: [
			/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: o }), /* @__PURE__ */ h(q, {
				color: d.value || (d.mode === "by-layer" ? "#b4bdc7" : "#ffffff"),
				label: gt(d)
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
				children: V(r).map((e, t) => {
					let n = typeof e == "string" ? e : e?.value || e?.hex, r = typeof e == "string" ? `Color ${t + 1}` : H(e), i = d.mode === "rgb" && String(d.value || "").toLowerCase() === String(n || "").toLowerCase();
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
function St({ value: e, onChange: t, label: n = "Color", className: r, ...i }) {
	let a = ht(e);
	return /* @__PURE__ */ h(ct, {
		label: n,
		className: B("cad-color-picker-button", r),
		trigger: /* @__PURE__ */ h("button", {
			type: "button",
			className: "cad-color-picker-button__trigger",
			children: /* @__PURE__ */ h(q, {
				color: a.value || "#b4bdc7",
				label: gt(a)
			})
		}),
		content: ({ close: r }) => /* @__PURE__ */ h(xt, {
			...i,
			value: e,
			onChange: (e, n) => {
				t?.(e, n), r(n);
			},
			label: n
		})
	});
}
function Ct({ linetypes: e = pt, value: t, defaultValue: n, onChange: r, label: i = "Linetype", className: a, ...o }) {
	let s = u(() => Y(e), [e]), [c, l] = U(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), d = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ h(ct, {
		label: i,
		className: B("cad-linetype-picker", a),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ h(Fe, {
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
				children: /* @__PURE__ */ h(Fe, {
					type: t.id,
					label: t.label
				})
			}, t.id))
		})
	});
}
function wt({ lineweights: e = mt, value: t, defaultValue: n, onChange: r, label: i = "Lineweight", className: a, ...o }) {
	let s = u(() => Y(e), [e]), [c, l] = U(t, n ?? s[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), d = s.find((e) => e.id === c) || s[0];
	return /* @__PURE__ */ h(ct, {
		label: i,
		className: B("cad-lineweight-picker", a),
		trigger: /* @__PURE__ */ g("button", {
			type: "button",
			className: "cad-style-picker__trigger",
			children: [/* @__PURE__ */ h(Ie, {
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
					children: /* @__PURE__ */ h(Ie, {
						weight: r,
						label: t.label
					})
				}, t.id);
			})
		})
	});
}
function Tt({ block: e, selected: t = !1, onSelect: n, onInsert: r, onEdit: i, onDelete: a, renderThumbnail: o, className: s }) {
	let c = e || {}, l = H(c);
	return /* @__PURE__ */ g("article", {
		className: B("cad-block-tile", t && "cad-block-tile--selected", s),
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
function Et({ blocks: e = [], value: t, defaultValue: n = "", onChange: r, onInsert: i, onCreate: a, onEdit: o, onDelete: s, filter: c, defaultFilter: d = "", onFilterChange: f, view: p = "grid", renderThumbnail: m, title: _ = "Blocks", className: v, emptyLabel: y = "No blocks match the current filter" }) {
	let b = `cad-block-filter-${l()}`, [x, S] = U(t, n, (e, t, n) => r?.(e, t, n)), [C, w] = U(c, d, (e, t) => f?.(e, t)), T = u(() => V(e).filter((e) => `${H(e)} ${e?.category || ""}`.toLocaleLowerCase().includes(String(C || "").toLocaleLowerCase())), [e, C]);
	return /* @__PURE__ */ g("section", {
		className: B("cad-block-palette", `cad-block-palette--${p}`, v),
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
				children: [T.map((e, t) => /* @__PURE__ */ h(Tt, {
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
function Dt({ value: e, defaultValue: t = {
	scale: 1,
	rotation: 0,
	uniform: !0,
	specifyOnScreen: !1,
	explode: !1
}, onChange: n, label: r = "Insert options", className: i }) {
	let [a, o] = U(e, t, (e, t, r) => n?.(e, t, r)), s = (e, t, n) => o({
		...a || {},
		[e]: t
	}, e, n);
	return /* @__PURE__ */ g("fieldset", {
		className: B("cad-block-insert-options", i),
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
function Ot({ value: e, defaultValue: t = "", onChange: n, placeholder: r = "Filter", label: i = "Filter list", className: a, ...o }) {
	let s = l(), [c, u] = U(e, t, (e, t) => n?.(e, t));
	return /* @__PURE__ */ g("div", {
		className: B("cad-filter-bar", a),
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
function kt({ property: e, value: t, onValueChange: n, inputId: r, className: i }) {
	let a = e || {}, o = a.type || "text", s = t ?? a.value ?? "", c = (e, t) => {
		a.onChange?.(e, a, t), n?.(a.id, e, a, t);
	};
	return typeof a.render == "function" ? /* @__PURE__ */ h("div", {
		className: B("cad-property-field", i),
		children: a.render({
			id: r,
			property: a,
			value: s,
			onChange: c
		})
	}) : a.readOnly || o === "readonly" ? /* @__PURE__ */ h("output", {
		className: B("cad-property-field", "cad-property-field--readonly", i),
		title: String(s),
		children: s || "—"
	}) : o === "toggle" || o === "boolean" ? /* @__PURE__ */ g("label", {
		className: B("cad-property-field", "cad-property-field--toggle", i),
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
		className: B("cad-property-field", i),
		value: s,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e),
		children: V(a.options).map((e, t) => {
			let n = typeof e == "string" || typeof e == "number" ? {
				value: e,
				label: e
			} : e;
			return /* @__PURE__ */ h("option", {
				value: n.value ?? n.id,
				children: H(n)
			}, n.id || n.value || t);
		})
	}) : o === "color" ? /* @__PURE__ */ g("span", {
		className: B("cad-property-field", "cad-property-field--color", i),
		children: [/* @__PURE__ */ h(q, {
			color: s || "#ffffff",
			label: s || "#ffffff"
		}), /* @__PURE__ */ h("input", {
			id: r,
			type: "color",
			value: s || "#ffffff",
			disabled: a.disabled,
			onChange: (e) => c(e.target.value, e)
		})]
	}) : o === "cad-color" ? /* @__PURE__ */ h(St, {
		value: s,
		onChange: c,
		label: a.label || a.id,
		className: B("cad-property-field", "cad-property-field--cad-color", i),
		colors: a.colors,
		allowByLayer: a.allowByLayer,
		allowByBlock: a.allowByBlock
	}) : o === "linetype" ? /* @__PURE__ */ h(Ct, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: B("cad-property-field", "cad-property-field--style", i),
		linetypes: a.options
	}) : o === "lineweight" ? /* @__PURE__ */ h(wt, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: B("cad-property-field", "cad-property-field--style", i),
		lineweights: a.options
	}) : o === "scale" ? /* @__PURE__ */ h(Ze, {
		value: s,
		onChange: (e, t, n) => c(e, n),
		label: a.label || a.id,
		className: B("cad-property-field", "cad-property-field--style", i),
		scales: a.options
	}) : o === "number" ? /* @__PURE__ */ h(K, {
		id: r,
		className: B("cad-property-field", i),
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
	}) : o === "unit" ? /* @__PURE__ */ h(Me, {
		id: r,
		className: B("cad-property-field", i),
		value: s,
		unit: a.unit,
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "angle" ? /* @__PURE__ */ h(Ne, {
		id: r,
		className: B("cad-property-field", i),
		value: s,
		unit: a.unit || "°",
		min: a.min,
		max: a.max,
		step: a.step,
		disabled: a.disabled,
		onValueChange: c,
		"aria-label": a.label || a.id
	}) : o === "coordinate" ? /* @__PURE__ */ h(Pe, {
		className: B("cad-property-field", i),
		value: s,
		axes: a.axes,
		unit: a.unit,
		disabled: a.disabled,
		onValueChange: (e) => c(e),
		label: a.label || a.id
	}) : o === "multiline" ? /* @__PURE__ */ h("textarea", {
		id: r,
		className: B("cad-property-field", "cad-property-field--multiline", i),
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	}) : /* @__PURE__ */ h("input", {
		id: r,
		className: B("cad-property-field", i),
		type: o,
		value: s,
		placeholder: a.placeholder,
		disabled: a.disabled,
		onChange: (e) => c(e.target.value, e)
	});
}
function At({ property: e, value: t, onValueChange: n, className: r }) {
	let i = l(), a = e || {};
	if (a.hidden) return null;
	let o = `cad-property-${i}-${a.id || "field"}`, s = !a.readOnly && typeof a.render != "function" && ![
		"toggle",
		"boolean",
		"coordinate",
		"readonly"
	].includes(a.type || "text");
	return /* @__PURE__ */ g("div", {
		className: B("cad-property-row", a.readOnly && "cad-property-row--readonly", r),
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
		}), /* @__PURE__ */ h(kt, {
			property: a,
			value: t,
			inputId: o,
			onValueChange: n
		})]
	});
}
function jt({ id: e, title: t, properties: n = [], collapsible: r = !0, open: i, defaultOpen: a = !0, onOpenChange: o, onValueChange: s, className: c, children: u }) {
	let d = l(), f = e || `cad-property-section-${d}`, [p, m] = U(i, a, (e, t) => o?.(e, t)), _ = r ? /* @__PURE__ */ g("button", {
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
		className: B("cad-property-section", !p && "cad-property-section--closed", c),
		children: [_, /* @__PURE__ */ h("div", {
			id: `${f}-body`,
			className: "cad-property-section__body",
			hidden: !p,
			children: u || V(n).map((e, t) => /* @__PURE__ */ h(At, {
				property: e,
				onValueChange: s
			}, e?.id || t))
		})]
	});
}
function Mt({ sections: e, properties: t, onValueChange: n, label: r = "Properties", className: i, ...a }) {
	let o = V(e).length ? V(e) : [{
		id: "properties",
		title: r,
		properties: V(t)
	}];
	return /* @__PURE__ */ h("section", {
		...a,
		className: B("cad-property-grid", i),
		"aria-label": r,
		children: o.map((e, t) => /* @__PURE__ */ h(jt, {
			...e,
			onValueChange: n
		}, e?.id || t))
	});
}
function Nt({ layers: e = [], value: t, defaultValue: n, onChange: r, label: i = "Current layer", className: a, disabled: o = !1 }) {
	let [s, c] = U(t, n ?? V(e)[0]?.id ?? "", (e, t, n) => r?.(e, t, n));
	return /* @__PURE__ */ g("label", {
		className: B("cad-layer-picker", a),
		children: [/* @__PURE__ */ h("span", { children: i }), /* @__PURE__ */ h("select", {
			value: s,
			disabled: o,
			onChange: (t) => {
				let n = V(e).find((e) => e?.id === t.target.value);
				c(t.target.value, n, t);
			},
			children: V(e).map((e, t) => /* @__PURE__ */ h("option", {
				value: e?.id,
				children: H(e)
			}, e?.id || t))
		})]
	});
}
function Pt({ layer: e, active: t = !1, onActivate: n, onLayerChange: r, onColorClick: i, className: a }) {
	let o = e || {}, s = (e, t) => r?.(o.id, e, o, t), c = H(o), l = (e, t, n, i) => r ? /* @__PURE__ */ h("button", {
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
	}), u = /* @__PURE__ */ h(q, {
		color: o.color || "#ffffff",
		"aria-label": `${c} color`,
		onClick: i ? (e) => i(o, e) : void 0
	}), d = /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: c }), o.description && /* @__PURE__ */ h("small", { children: o.description })] });
	return /* @__PURE__ */ g("div", {
		className: B("cad-layer-row", t && "cad-layer-row--active", a),
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
			/* @__PURE__ */ h(Fe, {
				type: o.linetype || "continuous",
				color: o.color || "currentColor",
				label: o.linetype
			}),
			/* @__PURE__ */ h(Ie, {
				weight: o.lineweight ?? .25,
				color: o.color || "currentColor",
				label: o.lineweight ? `${o.lineweight} mm` : void 0
			})
		]
	});
}
function Ft({ layers: e = [], activeLayerId: t, onActiveLayerChange: n, onLayerChange: r, onAddLayer: i, onDeleteLayer: a, onColorClick: o, title: s = "Layers", filter: c, defaultFilter: l = "", onFilterChange: d, filterable: f = !0, className: p, emptyLabel: m = "No layers match this filter" }) {
	let [_, v] = U(c, l, (e, t) => d?.(e, t)), y = u(() => V(e).filter((e) => H(e).toLocaleLowerCase().includes(String(_ || "").toLocaleLowerCase())), [e, _]);
	return /* @__PURE__ */ g("section", {
		className: B("cad-layer-panel", p),
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
			f && /* @__PURE__ */ h(Ot, {
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
				children: [y.map((e, i) => /* @__PURE__ */ h(Pt, {
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
function It({ node: e, level: t, selectedId: n, expandedIds: r, onSelect: i, onExpandedChange: a }) {
	let o = e || {}, s = V(o.children), c = s.length > 0, l = r.has(o.id), u = o.id === n, d = o.icon, f = (e) => {
		if (!c) return;
		let t = new Set(r);
		l ? t.delete(o.id) : t.add(o.id), a(t, o, e);
	};
	return /* @__PURE__ */ g("li", {
		className: "cad-object-tree__branch",
		children: [/* @__PURE__ */ g("div", {
			className: B("cad-object-tree__entry", u && "cad-object-tree__entry--selected"),
			children: [c ? /* @__PURE__ */ h("button", {
				type: "button",
				className: "cad-object-tree__expander",
				"aria-label": `${l ? "Collapse" : "Expand"} ${H(o)}`,
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
					/* @__PURE__ */ h("span", { children: H(o) }),
					o.meta && /* @__PURE__ */ h("small", { children: o.meta })
				]
			})]
		}), c && l && /* @__PURE__ */ h("ul", { children: s.map((e, o) => /* @__PURE__ */ h(It, {
			node: e,
			level: t + 1,
			selectedId: n,
			expandedIds: r,
			onSelect: i,
			onExpandedChange: a
		}, e?.id || o)) })]
	});
}
function Lt({ nodes: e = [], selectedId: t, defaultSelectedId: n = "", onSelect: r, expandedIds: i, defaultExpandedIds: a, onExpandedChange: o, label: s = "CAD object tree", className: c, ...l }) {
	let u = a ?? V(e).filter((e) => e?.expanded).map((e) => e.id), [d, f] = U(t, n, (e, t, n) => r?.(e, t, n)), [p, m] = U(i, u, (e, t, n) => o?.(e, t, n)), g = new Set(V(p));
	return /* @__PURE__ */ h("ul", {
		...l,
		className: B("cad-object-tree", c),
		"aria-label": s,
		children: V(e).map((e, t) => /* @__PURE__ */ h(It, {
			node: e,
			level: 1,
			selectedId: d,
			expandedIds: g,
			onSelect: (e, t) => f(e.id, e, t),
			onExpandedChange: (e, t, n) => m([...e], t, n)
		}, e?.id || t))
	});
}
function Rt({ label: e, value: t = 0, status: n, onCancel: r, className: i }) {
	let a = Math.max(0, Math.min(100, Number(t) || 0));
	return /* @__PURE__ */ g("section", {
		className: B("cad-task-progress", i),
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
function zt({ references: e = [], onReload: t, onUnload: n, className: r, title: i = "External references" }) {
	return /* @__PURE__ */ g("section", {
		className: B("cad-reference-list", r),
		"aria-label": i,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("h2", { children: i }), /* @__PURE__ */ h("span", { children: V(e).length })] }), /* @__PURE__ */ h("ul", { children: V(e).map((e, r) => /* @__PURE__ */ g("li", { children: [
			/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("strong", { children: H(e) }), /* @__PURE__ */ h("small", { children: e?.path || e?.detail })] }),
			/* @__PURE__ */ h("em", {
				"data-status": e?.status || "loaded",
				children: e?.status || "loaded"
			}),
			/* @__PURE__ */ g("span", {
				className: "cad-reference-list__actions",
				children: [t && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `Reload ${H(e)}`,
					onClick: (n) => t(e, n),
					children: "Reload"
				}), n && /* @__PURE__ */ h("button", {
					type: "button",
					"aria-label": `Unload ${H(e)}`,
					onClick: (t) => n(e, t),
					children: "Unload"
				})]
			})
		] }, e?.id || r)) })]
	});
}
//#endregion
//#region src/CadDataUi.jsx
var Bt = (e, t) => typeof t?.render == "function" ? t.render(e, t) : typeof t?.accessor == "function" ? t.accessor(e, t) : e?.[t?.accessor || t?.id], Vt = (e, t) => {
	let n = typeof t?.sortValue == "function" ? t.sortValue(e, t) : Bt(e, t);
	return typeof n == "string" ? n.toLocaleLowerCase() : n;
};
function Ht({ columns: e = [], rows: t = [], rowId: n = (e) => e?.id, selectedIds: r, defaultSelectedIds: i = [], onSelectionChange: a, selectionMode: o = "multiple", onRowActivate: s, sort: c, defaultSort: l, onSortChange: d, caption: f = "CAD data", emptyLabel: p = "No rows to display", className: m, ..._ }) {
	let v = u(() => V(e).filter((e) => e?.id), [e]), [y, b] = U(r, i, (e, t, n) => a?.(e, t, n)), [x, S] = U(c, l, (e, t, n) => d?.(e, t, n)), C = new Set(V(y)), w = u(() => {
		let e = [...V(t)], n = v.find((e) => e.id === x?.columnId);
		if (!n || !x?.direction) return e;
		let r = x.direction === "desc" ? -1 : 1;
		return e.sort((e, t) => String(Vt(e, n) ?? "").localeCompare(String(Vt(t, n) ?? ""), void 0, { numeric: !0 }) * r);
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
		className: B("cad-data-grid", m),
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
							"aria-label": `Select ${H(e) || r || t + 1}`,
							checked: i,
							onChange: (t) => T(e, t)
						})
					}), v.map((t) => /* @__PURE__ */ h("td", {
						"data-align": t.align || "start",
						children: Bt(e, t) ?? "—"
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
function Ut({ filters: e = [], activeIds: t, defaultActiveIds: n = [], onChange: r, label: i = "Selection filter", className: a, ...o }) {
	let [s, c] = U(t, n, (e, t, n) => r?.(e, t, n)), l = new Set(V(s));
	return /* @__PURE__ */ g("section", {
		...o,
		className: B("cad-selection-filter", a),
		"aria-label": i,
		children: [/* @__PURE__ */ g("header", { children: [/* @__PURE__ */ h("strong", { children: i }), /* @__PURE__ */ g("output", { children: [
			l.size,
			"/",
			V(e).length
		] })] }), /* @__PURE__ */ h("div", {
			role: "group",
			"aria-label": i,
			children: V(e).map((e, t) => {
				let n = e?.id || `${H(e)}-${t}`, r = l.has(n), i = e?.icon;
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
						/* @__PURE__ */ h("span", { children: H(e) }),
						e?.count !== void 0 && /* @__PURE__ */ h("em", { children: e.count })
					]
				}, n);
			})
		})]
	});
}
function Wt({ candidates: e = [], activeId: t, defaultActiveId: n, onChange: r, onAccept: i, onCancel: a, label: o = "Selection cycle", className: s, ...c }) {
	let l = u(() => V(e).map((e, t) => ({
		...e,
		id: e?.id || `${H(e)}-${t}`
	})), [e]), [d, f] = U(t, n ?? l[0]?.id ?? "", (e, t, n) => r?.(e, t, n)), p = Math.max(0, l.findIndex((e) => e.id === d)), m = l[p], _ = (e, t) => {
		if (!l.length) return;
		let n = l[(p + e + l.length) % l.length];
		f(n.id, n, t);
	};
	return l.length ? /* @__PURE__ */ g("aside", {
		...c,
		className: B("cad-selection-cycler", s),
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
				/* @__PURE__ */ h("strong", { children: H(m) }),
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
function Gt({ title: e = "Quick properties", properties: t, sections: n, onValueChange: r, onPinChange: i, pinned: a = !1, onClose: o, className: s, ...c }) {
	return /* @__PURE__ */ g("aside", {
		...c,
		className: B("cad-quick-properties", s),
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
		})] })] }), /* @__PURE__ */ h(Mt, {
			properties: t,
			sections: n,
			onValueChange: r,
			label: e
		})]
	});
}
//#endregion
//#region src/CadWorkspaceProfiles.js
var X = (e) => String(e ?? "").trim(), Z = "model", Q = (e) => {
	let t = X(e).toLowerCase();
	return /^[a-z0-9][a-z0-9-]{0,63}$/.test(t) ? t : "";
}, Kt = (e, t) => X(e).replace(/\s+/g, " ").slice(0, 48) || t;
function $(e, { modelId: t = Z, modelName: n = "Model" } = {}) {
	let r = Q(t) || "model", i = Array.isArray(e) ? e : Array.isArray(e?.profiles) ? e.profiles : [], a = /* @__PURE__ */ new Set(), o = i.reduce((e, t, i) => {
		let o = Q(t?.id) || (i === 0 ? r : "");
		return !o || a.has(o) ? e : (a.add(o), e.push({
			...t,
			id: o,
			name: Kt(t?.name ?? t?.label, o === r ? n : `Layout ${e.length}`),
			system: o === r || !!t?.system
		}), e);
	}, []), s = o.findIndex((e) => e.id === r);
	return [s >= 0 ? {
		...o[s],
		id: r,
		name: Kt(o[s].name, n),
		system: !0
	} : {
		id: r,
		name: n,
		system: !0
	}, ...o.filter((e) => e.id !== r)];
}
function qt(e, { prefix: t = "Layout", modelId: n = Z } = {}) {
	let r = $(e, { modelId: n }), i = new Set(r.map((e) => e.name.toLocaleLowerCase())), a = Math.max(1, r.filter((e) => e.id !== n).length + 1), o = `${X(t) || "Layout"} ${a}`;
	for (; i.has(o.toLocaleLowerCase());) a += 1, o = `${X(t) || "Layout"} ${a}`;
	return o;
}
function Jt(e, { id: t, name: n, modelId: r = Z, modelName: i = "Model", prefix: a = "Layout", ...o } = {}) {
	let s = $(e, {
		modelId: r,
		modelName: i
	}), c = new Set(s.map((e) => e.id)), l = Q(t) || "layout", u = l, d = 1;
	for (; c.has(u);) d += 1, u = `${l}-${d}`;
	return [...s, {
		...o,
		id: u,
		name: Kt(n, qt(s, {
			prefix: a,
			modelId: r
		})),
		system: !1
	}];
}
function Yt(e, t, n, { modelId: r = Z, modelName: i = "Model" } = {}) {
	let a = Q(t);
	return !a || !X(n) ? $(e, {
		modelId: r,
		modelName: i
	}) : $(e, {
		modelId: r,
		modelName: i
	}).map((e) => e.id === a ? {
		...e,
		name: Kt(n, e.name)
	} : e);
}
function Xt(e, t, n, { modelId: r = Z, modelName: i = "Model" } = {}) {
	let a = $(e, {
		modelId: r,
		modelName: i
	}), o = Q(t), s = o && o !== r ? a.filter((e) => e.id !== o) : a;
	return {
		profiles: s,
		activeId: s.some((e) => e.id === n) ? n : r
	};
}
//#endregion
//#region src/CadWorkspaceUi.jsx
var Zt = (e) => V(e).find((e) => !e?.disabled)?.id || "", Qt = (e, t) => typeof e == "string" ? {
	id: `${e}-${t}`,
	label: e
} : {
	id: e?.id || `${H(e)}-${t}`,
	label: H(e),
	detail: e?.detail,
	tone: e?.tone
};
function $t({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, onCreate: a, onContextMenu: o, onRename: s, onOverflow: c, addLabel: d = "New layout", addButtonProps: f = {}, overflowLabel: p = "More drawing spaces", overflowButtonProps: m = {}, ariaLabel: _ = "Drawing spaces", className: v, ...y }) {
	let b = l(), x = u(() => V(e).map((e, t) => ({
		...e,
		id: e?.id || `space-${t}`
	})), [e]), [S, C] = U(t, n || Zt(x), (e, t, n) => r?.(e, t, n)), w = x.some((e) => e.id === S) ? S : Zt(x), T = (e, t) => {
		!e || e.disabled || C(e.id, e, t);
	}, E = (e) => document.getElementById(`cad-space-tab-${b}-${e.id}`)?.focus(), D = (e, t) => {
		let n = x.filter((e) => !e.disabled);
		if (!n.length) return;
		let r = n[(Math.max(0, n.findIndex((e) => e.id === w)) + t + n.length) % n.length];
		e.preventDefault(), T(r, e), E(r);
	};
	return /* @__PURE__ */ h("nav", {
		...y,
		className: B("cad-drawing-space-tabs", v),
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
							className: B("cad-drawing-space-tabs__item", r && "cad-drawing-space-tabs__item--active"),
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
								"aria-label": e?.ariaLabel || H(e),
								disabled: e?.disabled,
								tabIndex: r ? 0 : -1,
								title: e?.title || H(e),
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
									/* @__PURE__ */ h("span", { children: H(e) }),
									e?.dirty && /* @__PURE__ */ h("i", {
										"aria-label": "Unsaved changes",
										title: "Unsaved changes"
									})
								]
							}), c && /* @__PURE__ */ h("button", {
								type: "button",
								className: "cad-drawing-space-tabs__close",
								"aria-label": `Close ${H(e)}`,
								title: `Close ${H(e)}`,
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
					className: B("cad-drawing-space-tabs__add", f.className),
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
					className: B("cad-drawing-space-tabs__overflow", m.className),
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
var en = $t, tn = $t;
function nn({ profiles: e = [], activeId: t, onChange: n, onCreate: r, onClose: i, onRename: a, modelId: o = Z, modelName: s = "Model", className: c, ...l }) {
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
	return /* @__PURE__ */ h($t, {
		...l,
		className: B("cad-workspace-profile-tabs", c),
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
function rn({ title: e, icon: t, actions: n, collapsible: r = !1, collapsed: i, defaultCollapsed: a = !1, onCollapsedChange: o, className: s, children: c, ...u }) {
	let d = `cad-dock-panel-body-${l()}`, [f, p] = U(i, a, (e, t) => o?.(e, t));
	return /* @__PURE__ */ g("section", {
		...u,
		className: B("cad-dock-panel", f && "cad-dock-panel--collapsed", s),
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
function an({ items: e = [], activeId: t, defaultActiveId: n, onChange: r, onClose: i, label: a = "Docked panels", className: o, children: s, renderPanel: c, ...u }) {
	let d = l(), [f, p] = U(t, n || Zt(e), (e, t, n) => r?.(e, t, n)), m = V(e).find((e) => e?.id === f) || V(e).find((e) => !e?.disabled), _ = (e, t) => {
		!e || e.disabled || p(e.id, e, t);
	}, v = (t) => {
		if (!t.target.closest("[role=\"tab\"]")) return;
		let n = V(e).filter((e) => !e?.disabled);
		if (!n.length) return;
		let r = Math.max(0, n.findIndex((e) => e.id === m?.id)), i;
		t.key === "ArrowRight" && (i = n[(r + 1) % n.length]), t.key === "ArrowLeft" && (i = n[(r - 1 + n.length) % n.length]), t.key === "Home" && (i = n[0]), t.key === "End" && (i = n[n.length - 1]), i && (t.preventDefault(), _(i, t), document.getElementById(`cad-dock-tab-${d}-${i.id}`)?.focus());
	}, y = m?.panelId || `cad-dock-panel-${d}-${m?.id || "empty"}`;
	return /* @__PURE__ */ g("section", {
		...u,
		className: B("cad-dock-tabs", o),
		children: [/* @__PURE__ */ h("div", {
			className: "cad-dock-tabs__list",
			role: "tablist",
			"aria-label": a,
			onKeyDown: v,
			children: V(e).map((e, t) => {
				let n = e?.id === m?.id, r = e?.icon;
				return /* @__PURE__ */ g("div", {
					className: B("cad-dock-tabs__tab-wrap", n && "cad-dock-tabs__tab-wrap--active"),
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
							/* @__PURE__ */ h("span", { children: H(e) }),
							e?.badge && /* @__PURE__ */ h("em", { children: e.badge })
						]
					}), i && e?.closable && /* @__PURE__ */ h("button", {
						type: "button",
						className: "cad-dock-tabs__close",
						"aria-label": `Close ${H(e)}`,
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
function on({ mode: e, label: t, active: n, disabled: r = !1, shortcut: i, tone: a = "inherit", onChange: o, className: s }) {
	let c = t || H(e), l = n ?? e?.active ?? !1, u = r || e?.disabled;
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: B("cad-status-toggle", s),
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
var sn = (e) => e == null || e === "" ? "" : typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map((e, t) => `${"XYZ"[t] || t}: ${e}`).join("  ") : [
	"x",
	"y",
	"z"
].filter((t) => e[t] !== void 0).map((t) => `${t.toUpperCase()}: ${e[t]}`).join("  ");
function cn({ coordinates: e, coordinateLabel: t = "Coordinates", modes: n = [], onModeChange: r, units: i, scale: a, message: o, className: s, children: c, ...l }) {
	let u = sn(e);
	return /* @__PURE__ */ g("footer", {
		...l,
		className: B("cad-status-bar", s),
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
				children: V(n).map((e, t) => /* @__PURE__ */ h(on, {
					mode: e,
					onChange: (t, n, i) => {
						e?.onChange?.(t, n, i), r?.(e?.id, t, n, i);
					}
				}, e?.id || H(e) || t))
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
function ln({ items: e = [], label: t = "Command history", onSelect: n, className: r }) {
	let i = u(() => V(e).map(Qt), [e]);
	return /* @__PURE__ */ h("ol", {
		className: B("cad-command-history", r),
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
function un({ options: e = [], label: t = "Command options", onSelect: n, className: r }) {
	return /* @__PURE__ */ h("div", {
		className: B("cad-command-options", r),
		role: "group",
		"aria-label": t,
		children: V(e).map((e, t) => {
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
				children: [H(r), r?.shortcut && /* @__PURE__ */ h("kbd", { children: r.shortcut })]
			}, r?.id || t);
		})
	});
}
function dn({ value: e, defaultValue: t = "", onChange: n, onSubmit: r, prompt: i = "Command:", history: a = [], suggestions: o = [], options: s = [], onSuggestionSelect: c, onOptionSelect: d, clearOnSubmit: f = !0, submitSuggestionOnEnter: m = !1, disabled: _ = !1, placeholder: v = "Type a command or search", showHistory: y = !0, className: b, inputProps: x = {}, ...S }) {
	let C = l(), [w, T] = U(e, t, (e, t) => n?.(e, t)), [E, D] = p(!1), [O, k] = p(-1), A = u(() => V(o).map(Qt), [o]), j = `cad-command-suggestions-${C}`, M = (e, t, n = !1) => {
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
		className: B("cad-command-line", b),
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
			s.length > 0 && /* @__PURE__ */ h(un, {
				options: s,
				onSelect: d
			}),
			y && a.length > 0 && /* @__PURE__ */ h(ln, {
				items: a,
				onSelect: (e, t) => T(e.label, t)
			})
		]
	});
}
function fn({ activeView: e = "top", onViewChange: t, className: n, label: r = "View cube" }) {
	return /* @__PURE__ */ g("div", {
		className: B("cad-view-cube", n),
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
function pn({ xLabel: e = "X", yLabel: t = "Y", zLabel: n = "Z", className: r, label: i = "UCS orientation" }) {
	return /* @__PURE__ */ g("svg", {
		className: B("cad-ucs-indicator", r),
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
function mn({ activeView: e, onViewChange: t, onZoomIn: n, onZoomOut: r, onZoomExtents: i, showCube: a = !0, showUcs: o = !0, className: s }) {
	return /* @__PURE__ */ g("aside", {
		className: B("cad-viewport-controls", s),
		"aria-label": "Viewport controls",
		children: [
			a && /* @__PURE__ */ h(fn, {
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
			o && /* @__PURE__ */ h(pn, {})
		]
	});
}
function hn({ count: e = 0, entityLabel: t = "objects", fields: n = [], emptyLabel: r = "Nothing selected", className: i }) {
	return /* @__PURE__ */ g("output", {
		className: B("cad-selection-summary", i),
		"aria-live": "polite",
		children: [/* @__PURE__ */ h("strong", { children: e ? `${e} ${t}` : r }), V(n).length > 0 && /* @__PURE__ */ h("span", { children: V(n).map((e, t) => /* @__PURE__ */ g("small", { children: [
			e?.label,
			": ",
			/* @__PURE__ */ h("b", { children: e?.value })
		] }, e?.id || t)) })]
	});
}
function gn({ distance: e, angle: t, area: n, volume: r, className: i, label: a = "Measurement" }) {
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
		className: B("cad-measure-readout", i),
		"aria-label": a,
		children: o.map((e) => /* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("small", { children: e.label }), /* @__PURE__ */ h("b", { children: e.value })] }, e.id))
	}) : null;
}
//#endregion
export { ee as CAD_CUI_RUNTIME_VERSION, Z as CAD_WORKSPACE_MODEL_ID, E as CadActionButton, Ne as CadAngleInput, Ze as CadAnnotationScalePicker, Dt as CadBlockInsertOptions, Et as CadBlockPalette, Tt as CadBlockTile, xt as CadColorPicker, St as CadColorPickerButton, q as CadColorSwatch, ln as CadCommandHistory, dn as CadCommandLine, un as CadCommandOptions, dt as CadCommandPrompt, at as CadConfirmDialog, Xe as CadConstraintBar, Pe as CadCoordinateInput, Ce as CadCuiCommandPalette, Se as CadCuiContextMenu, we as CadCuiCustomizer, _e as CadCuiProvider, xe as CadCuiQuickAccess, be as CadCuiRibbon, Ht as CadDataGrid, O as CadDataRow, it as CadDialog, rn as CadDockPanel, an as CadDockTabs, tn as CadDocumentTabs, $t as CadDrawingSpaceTabs, qe as CadDynamicInput, j as CadEmptyState, Ot as CadFilterBar, Ye as CadGripToolbar, D as CadIconButton, Ft as CadLayerPanel, Nt as CadLayerPicker, Pt as CadLayerRow, en as CadLayoutTabs, Ct as CadLinetypePicker, Fe as CadLinetypePreview, wt as CadLineweightPicker, Ie as CadLineweightPreview, gn as CadMeasureReadout, ze as CadMenu, bt as CadMenuBar, Re as CadMenuItem, Le as CadMenuSeparator, K as CadNumericInput, et as CadObjectSnapMarker, Je as CadObjectSnapMenu, Lt as CadObjectTree, Be as CadOverflowMenu, A as CadPanelFooter, C as CadPanelHeader, w as CadPanelSection, S as CadPanelShell, $e as CadPolarTracker, ct as CadPopover, kt as CadPropertyField, Mt as CadPropertyGrid, At as CadPropertyRow, jt as CadPropertySection, Gt as CadQuickProperties, zt as CadReferenceList, T as CadSegmentTabs, Wt as CadSelectionCycler, Ut as CadSelectionFilter, tt as CadSelectionGrip, hn as CadSelectionSummary, G as CadShortcutHint, ut as CadShortcutReference, Oe as CadSplitButton, _t as CadSplitPane, k as CadStatGrid, cn as CadStatusBar, on as CadStatusToggle, yt as CadSubmenu, Rt as CadTaskProgress, ot as CadToast, st as CadToastStack, De as CadToggleButton, Ee as CadToolButton, je as CadToolPalette, Ae as CadToolbar, ke as CadToolbarGroup, lt as CadTooltip, pn as CadUcsIndicator, Me as CadUnitInput, fn as CadViewCube, Qe as CadViewPresetPicker, mn as CadViewportControls, nn as CadWorkspaceProfileTabs, ue as DEFAULT_CAD_CUI_SYSTEM, Jt as createCadWorkspaceProfile, le as defineCadCuiSystem, pe as loadCadCuiState, qt as nextCadWorkspaceLayoutName, $ as normalizeCadWorkspaceProfiles, Xt as removeCadWorkspaceProfile, Yt as renameCadWorkspaceProfile, L as sanitizeCadCuiState, me as saveCadCuiState, he as selectCadCuiCommands, R as useCadCui, ve as useCadCuiCommand };
