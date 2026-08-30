(function () {
    "use strict";

    var params = new URLSearchParams(window.location.search);
    var API = (params.get("api") || window.API_BASE || "http://localhost:8080/api/gimnasio").replace(/\/$/, "");

    document.getElementById("api-url").textContent = API;

    var tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
            document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
            btn.classList.add("active");
            document.getElementById(btn.dataset.tab).classList.add("active");
        });
    });

    function getJSON(path) {
        return fetch(API + path).then(function (r) {
            if (!r.ok) { throw new Error("HTTP " + r.status); }
            return r.json();
        });
    }

    function postJSON(path, body) {
        return fetch(API + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }).then(function (r) {
            if (!r.ok) { throw new Error("HTTP " + r.status); }
            return r.json();
        });
    }

    function td(value) {
        var cell = document.createElement("td");
        cell.textContent = value === null || value === undefined ? "" : value;
        return cell;
    }

    function row(values) {
        var tr = document.createElement("tr");
        values.forEach(function (v) { tr.appendChild(td(v)); });
        return tr;
    }

    function showMsg(form, text, ok) {
        var span = form.querySelector(".form-msg");
        span.textContent = text;
        span.className = "form-msg " + (ok ? "ok" : "error");
    }

    function loadMiembros() {
        return getJSON("/miembros").then(function (data) {
            var body = document.getElementById("miembros-body");
            body.innerHTML = "";
            data.forEach(function (m) {
                body.appendChild(row([m.id, m.nombre, m.email, m.fechaInscripcion]));
            });
        });
    }

    function loadEntrenadores() {
        return getJSON("/entrenadores").then(function (data) {
            var body = document.getElementById("entrenadores-body");
            body.innerHTML = "";
            data.forEach(function (e) {
                body.appendChild(row([e.id, e.nombre, e.especialidad]));
            });
            var select = document.getElementById("clase-entrenador");
            select.innerHTML = "";
            data.forEach(function (e) {
                var opt = document.createElement("option");
                opt.value = e.id;
                opt.textContent = e.id + " - " + e.nombre + " (" + e.especialidad + ")";
                select.appendChild(opt);
            });
        });
    }

    function loadClases() {
        return getJSON("/clases").then(function (data) {
            var body = document.getElementById("clases-body");
            body.innerHTML = "";
            data.forEach(function (c) {
                body.appendChild(row([c.id, c.nombre, c.horario, c.capacidadMaxima, c.entrenadorId]));
            });
        });
    }

    function loadEquipos() {
        return getJSON("/equipos").then(function (data) {
            var body = document.getElementById("equipos-body");
            body.innerHTML = "";
            data.forEach(function (eq) {
                body.appendChild(row([eq.id, eq.nombre, eq.descripcion, eq.cantidad]));
            });
        });
    }

    var handlers = {
        miembros: {
            build: function (f) {
                return {
                    nombre: f.nombre.value,
                    email: f.email.value,
                    fechaInscripcion: f.fechaInscripcion.value
                };
            },
            reload: loadMiembros
        },
        entrenadores: {
            build: function (f) {
                return {
                    nombre: f.nombre.value,
                    especialidad: f.especialidad.value
                };
            },
            reload: loadEntrenadores
        },
        equipos: {
            build: function (f) {
                return {
                    nombre: f.nombre.value,
                    descripcion: f.descripcion.value,
                    cantidad: Number(f.cantidad.value)
                };
            },
            reload: loadEquipos
        },
        clases: {
            build: function (f) {
                return {
                    nombre: f.nombre.value,
                    horario: f.horario.value,
                    capacidadMaxima: Number(f.capacidadMaxima.value),
                    entrenadorId: Number(f.entrenadorId.value)
                };
            },
            reload: loadClases
        }
    };

    document.querySelectorAll("form[data-entity]").forEach(function (form) {
        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            var entity = form.dataset.entity;
            var handler = handlers[entity];
            showMsg(form, "Enviando...", true);
            postJSON("/" + entity, handler.build(form)).then(function () {
                form.reset();
                showMsg(form, "Guardado correctamente.", true);
                return handler.reload();
            }).catch(function (err) {
                showMsg(form, "Error: " + err.message, false);
            });
        });
    });

    function refreshAll() {
        loadEntrenadores().catch(reportError);
        loadMiembros().catch(reportError);
        loadClases().catch(reportError);
        loadEquipos().catch(reportError);
    }

    function reportError(err) {
        console.error("No se pudo cargar datos del gateway:", err);
    }

    refreshAll();
})();
