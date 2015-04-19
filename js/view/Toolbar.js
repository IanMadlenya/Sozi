/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

import h from "virtual-dom/h";
import {VirtualDOMView} from "./VirtualDOMView";

export var Toolbar = Object.create(VirtualDOMView);

Toolbar.init = function (container, storage, presentation, viewport, controller, locale) {
    VirtualDOMView.init.call(this, container, controller);

    this.storage = storage;
    this.presentation = presentation;
    this.viewport = viewport;
    this.gettext = locale.gettext.bind(locale);

    return this;
};

Toolbar.render = function () {
    var _ = this.gettext;
    var c = this.controller;
    var v = this.viewport;
    return h("div", [
        h("span.group", [
            _("Aspect ratio: "),
            h("input.aspect", {
                type: "number",
                pattern: "\\d+",
                min: "1",
                step: "1",
                size: "3",
                value: this.presentation.aspectWidth,
                onchange() {
                    var width = parseInt(this.value);
                    if (!width.isNaN) {
                        c.setAspectWidth(width);
                    }
                }
            }),
            ":",
            h("input.aspect", {
                type: "number",
                pattern: "\\d+",
                min: "1",
                step: "1",
                size: "3",
                value: this.presentation.aspectHeight,
                onchange() {
                    var height = parseInt(this.value);
                    if (!height.isNaN) {
                        c.setAspectHeight(height);
                    }
                }
            })
        ]),
        h("span.group.btn-group", [
            h("label.btn" + (v.dragMode === "translate" ? ".active" : ""), [
                h("input", {
                    name: "sozi-editor-preview-mode",
                    type: "radio",
                    title: _("Move the selected layers (hold Alt to zoom, Shift to rotate)"),
                    checked: v.dragMode === "translate",
                    onclick() { c.setDragMode("translate"); }
                }),
                h("i.fa.fa-arrows")
            ]),
            h("label.btn" + (v.dragMode === "scale" ? ".active" : ""), [
                h("input", {
                    name: "sozi-editor-preview-mode",
                    type: "radio",
                    title: _("Zoom in/out on the selected layers (you can also hold the Alt key in Move mode)"),
                    checked: v.dragMode === "scale",
                    onclick() { c.setDragMode("scale"); }
                }),
                h("i.fa.fa-expand")
            ]),
            h("label.btn" + (v.dragMode === "rotate" ? ".active" : ""), [
                h("input", {
                    name: "sozi-editor-preview-mode",
                    type: "radio",
                    title: _("Rotate the selected layers (you can also hold the Shift key in Move mode)"),
                    checked: v.dragMode === "rotate",
                    onclick() { c.setDragMode("rotate"); }
                }),
                h("i.fa.fa-rotate-left"),
            ]),
            h("label.btn" + (v.dragMode === "clip" ? ".active" : ""), [
                h("input", {
                    name: "sozi-editor-preview-mode",
                    type: "radio",
                    title: _("Clip"),
                    checked: v.dragMode === "clip",
                    onclick() { c.setDragMode("clip"); }
                }),
                h("i.fa.fa-square-o")
            ])
        ]),
        h("span.group.btn-group", [
            h("button", {
                title: _("Undo"),
                disabled: c.undoStack.length ? undefined : "disabled",
                onclick: c.undo.bind(c)
            }, h("i.fa.fa-reply")), // "reply" icon preferred to the official "undo" icon
            h("button", {
                title: _("Redo"),
                disabled: c.redoStack.length ? undefined : "disabled",
                onclick: c.redo.bind(c)
            }, h("i.fa.fa-share")) // "share" icon preferred to the official "redo" icon
        ]),
        h("span.group.btn-group", [
            h("button", {
                title: _("Save the presentation"),
                disabled: this.storage.htmlNeedsSaving ? undefined : "disabled",
                onclick: c.save.bind(c)
            }, h("i.fa.fa-download")), // "download" icon preferred to the official "save" icon
            h("button", {
                title: _("Reload the SVG document"),
                onclick: c.reload.bind(c)
            }, h("i.fa.fa-refresh"))
        ])
    ]);
};

