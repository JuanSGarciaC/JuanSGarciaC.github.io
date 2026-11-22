"""Genera index.html (español) y en/index.html (inglés) desde un solo contenido.

Uso: python build.py
Sin dependencias. El sitio resultante es HTML/CSS/JS estático para GitHub Pages.
"""
from html import escape
from pathlib import Path

HERE = Path(__file__).parent
GH = "https://github.com/JuanSGarciaC"

PROJECTS = [
    dict(k="storylens", img="storylens", stack=["Python", "FastAPI", "React", "Gemini", "Playwright"],
         links=[("code", f"{GH}/storylens-qa"), ("demo", "https://storylens-qa.onrender.com"), ("page", "https://juansgarciac.github.io/storylens-qa/")]),
    dict(k="lab", img="laboratorio", stack=["Python", "FastAPI", "React", "OWASP", "Playwright"],
         links=[("code", f"{GH}/laboratorio-defensa")]),
    dict(k="nexusflow", img="nexusflow", stack=["FastAPI", "PostgreSQL", "Celery", "Redis", "React", "Docker"],
         links=[("code", f"{GH}/nexusflow"), ("page", "https://juansgarciac.github.io/nexusflow/")]),
    dict(k="datapulse", img="datapulse", stack=["Polars", "Prefect", "dbt", "PostgreSQL", "FastAPI", "Streamlit"],
         links=[("code", f"{GH}/datapulse"), ("page", "https://juansgarciac.github.io/datapulse/")]),
    dict(k="sello", img="sello", stack=["Python", "FastAPI", "LLM", "React", "SQLite"],
         links=[("code", f"{GH}/triaje-solicitudes"), ("demo", "https://triaje-solicitudes-demo.onrender.com")]),
    dict(k="integrador", img="integrador", stack=["Python", "FastAPI", "HMAC", "React", "Newman"],
         links=[("code", f"{GH}/integrador-webhooks"), ("demo", "https://integrador-webhooks-demo.onrender.com")]),
    dict(k="cortex", img="cortex", stack=["Python", "MCP", "RAG", "Gemini", "React"],
         links=[("code", f"{GH}/cortex-agent")]),
    dict(k="datos", img="datos", stack=["Python", "FastAPI", "SQLite", "React", "datos.gov.co"],
         links=[("code", f"{GH}/datos-abiertos-colombia-educacion")]),
]

C = {
    "es": dict(
        title="Juan Sebastián García Carrillo · Analista de sistemas y datos, QA y automatización con IA",
        description="CV y portafolio de Juan Sebastián García Carrillo: QA, análisis de datos y automatización con IA. Ocho proyectos con código y demos.",
        nav=[("proyectos", "Proyectos"), ("experiencia", "Experiencia"), ("formacion", "Formación"), ("contacto", "Contacto")],
        other_lang=("EN", "en/"),
        kicker="Bogotá, Colombia · Ingeniero de Sistemas",
        role="Analista de sistemas y datos · QA · Automatización con IA",
        summary=("Ingeniero de Sistemas con base en requisitos, datos y automatización con IA. Como QA Engineer (2022–2024) analicé y "
                 "documenté historias de usuario e integraciones, con criterios de aceptación en equipos Agile/Scrum. En mi práctica "
                 "profesional hice análisis estadístico y de tendencias para apoyar decisiones, automaticé hojas de Excel con macros y "
                 "desarrollé el prototipo de un agente de IA conversacional."),
        b_projects="Ver proyectos", b_mail="Correo", where="Disponible para trabajo remoto, híbrido o presencial en Bogotá.",
        projects_h="Proyectos", projects_lead=("Ocho proyectos con una idea común: sistemas que fallan de forma segura, se pueden revisar "
                                               "y miden lo que prometen. Cada uno tiene su código, pruebas automáticas y una sección de límites."),
        learned="Aprendí:", link_names={"code": "Código", "demo": "Demo en vivo", "page": "Página del proyecto"},
        note=("Proyectos personales desarrollados con asistentes de IA; yo los revisé, ejecuté y verifiqué. "
              "Las cifras salen de sus pruebas y evaluaciones, y cada repositorio explica lo que no está medido."),
        p={
            "storylens": ("StoryLens QA", "Revisar requisitos antes de que sean errores",
                          "Lee historias de usuario y señala lo que está mal escrito citando la norma (ISO 29148, INVEST, ISTQB); genera casos de prueba trazables y mide la calidad. La IA es opcional: si falla, las reglas siguen.",
                          "a evaluar IA con honestidad: en historias nuevas las reglas (F1 0,71) superan a la IA (0,37–0,46)."),
            "lab": ("Laboratorio de defensa", "Ver un ataque web por dentro y cómo se detiene",
                    "La misma app escrita vulnerable y protegida; siete ataques del OWASP Top 10 se lanzan contra las dos a la vez y una consola enseña cada petición, el resultado y la línea de código que marca la diferencia.",
                    "cómo funcionan y se corrigen inyección SQL, XSS, fuerza bruta, IDOR y otros."),
            "nexusflow": ("NexusFlow", "Automatizar procesos sin hacer nada dos veces",
                          "Flujos con pasos, condiciones y llamadas a APIs que corren en segundo plano con reintentos e idempotencia; usuarios con roles, credenciales cifradas, webhooks firmados y auditoría.",
                          "idempotencia y diseño para fallos: ningún reintento cobra dos veces."),
            "datapulse": ("DataPulse", "Datos confiables y trazables de la fuente al informe",
                          "Ingesta de archivos y una API con validación y cuarentena, orquestación con Prefect, modelo estrella con dbt, API de indicadores y panel; cualquier cifra se puede seguir hasta su archivo.",
                          "calidad de datos y trazabilidad: 37 errores sembrados que el pipeline detecta exactamente."),
            "sello": ("Sello · Triaje con IA", "La IA clasifica; una persona pone el sello",
                      "Clasifica solicitudes de soporte de TI con un LLM y una regla decide: se aprueba sola o pasa a una persona. Después va al equipo correcto con un plazo. Categoría correcta en 9 de 10 casos de la prueba final.",
                      "que la confianza de un modelo no basta: lo urgente y lo dudoso pasan por una persona."),
            "integrador": ("Integrador de webhooks", "Entregar avisos entre sistemas sin perder ninguno",
                           "Recibe webhooks de GitHub, valida la firma HMAC, responde 202 y los entrega desde un worker con espera exponencial y jitter; los fallidos se reprocesan desde un panel.",
                           "a medir con fallos provocados: con 30 % de fallos se entregaron 200 de 200."),
            "cortex": ("Cortex Agent", "Un agente de IA al que se le puede ver pensar",
                       "Agente con bucle propio, herramientas por MCP, búsqueda híbrida en documentos y memoria; cada paso queda registrado y se evalúa automáticamente.",
                       "cómo funciona un agente por dentro y cómo evaluarlo con pruebas repetibles."),
            "datos": ("Datos abiertos de Colombia", "Datos públicos reales, limpios y comprobados",
                      "Descarga la matrícula de educación superior de datos.gov.co, la valida, calcula estadísticas y escribe un resumen cuyas cifras se verifican; los totales cuadran con la fuente oficial.",
                      "a desconfiar de la fuente: los datos venían duplicados y fingían una caída del 48 %."),
        },
        exp_h="Experiencia",
        jobs=[
            dict(org="Fundación Universitaria del Área Andina", pos="Práctica profesional", when="Dic 2025 – Mar 2026", items=[
                "Análisis estadístico y de tendencias sobre bases de datos para detectar problemas y apoyar decisiones, con gráficas y muestras.",
                "Macros y optimización de hojas de Excel y bases de datos para facilitar su uso y el manejo de la información.",
                "Prototipo de un agente de IA conversacional para ayudar a redactar documentos institucionales según las reglas de la institución (fase inicial, sin despliegue).",
            ]),
            dict(org="Software Quality Assurance S.A.", pos="QA Engineer", when="2022 – 2024", items=[
                "Inicié como practicante SENA y continué como QA Engineer.",
                "Analicé y documenté historias de usuario e integraciones en staging y preproducción, identificando riesgos antes de cada release.",
                "Aporté análisis de requisitos y criterios de aceptación en ceremonias Agile/Scrum.",
                "Mantuve documentación y trazabilidad en Jira y Confluence entre Desarrollo, QA y Producto.",
                "Automaticé con Python tareas repetitivas de análisis y organización de información.",
                "Validé servicios REST: códigos HTTP, payloads JSON y casos límite.",
            ]),
        ],
        edu_h="Formación", edu=[
            ("Ingeniería de Sistemas", "Fundación Universitaria del Área Andina", "2023 – 2026"),
            ("Tecnólogo en Análisis y Desarrollo de Sistemas de Información", "SENA", "2021 – 2023"),
            ("Máster en Inteligencia Artificial e Innovación", "Founderz · Prompt engineering (few-shot, RAG), Copilot Studio, Power Automate, Make y Power BI", "2024 – 2025"),
            ("Diplomado en Programación en Python y DevNet (140 h)", "Área Andina", "2025"),
        ],
        cert_h="Certificaciones", certs=[
            "DevNet Associate · Fundamentos de Python 1 y 2 · Introduction to Modern AI — Cisco Networking Academy",
            "Introducción a ISTQB · Pruebas de requisitos, performance y APIs REST — Área Andina",
        ],
        skills_h="Habilidades", skills=[
            ("Datos y BI", ["SQL", "Excel avanzado (macros)", "Análisis estadístico", "Power BI", "ETL"]),
            ("QA y metodologías", ["Criterios de aceptación", "Pruebas de APIs REST", "pytest", "Playwright", "Postman/Newman", "Agile/Scrum", "Jira", "Confluence"]),
            ("Programación", ["Python", "FastAPI", "React", "PostgreSQL", "SQLite", "Git/GitHub", "GitHub Actions", "Docker"]),
            ("IA y automatización", ["Prompt engineering", "GPT-4", "Claude", "Gemini", "Azure OpenAI", "Copilot Studio", "Power Automate", "Make"]),
        ],
        lang_h="Idiomas", langs="Español (nativo) · Inglés B2 (lectura técnica y documentación)",
        contact_h="Hablemos", contact_lead="¿Buscas a alguien para QA, análisis de datos o automatización con IA? Escríbeme.",
        mail_fallback="juansgarciac2003 [arroba] gmail.com",
        footer="Hecho con HTML, CSS y JavaScript, sin dependencias. Los cursores de colores construyen la página la primera vez que entras.",
        replay="Ver otra vez la construcción",
    ),
    "en": dict(
        title="Juan Sebastián García Carrillo · Systems & Data Analyst, QA and AI-powered automation",
        description="CV and portfolio of Juan Sebastián García Carrillo: QA, data analysis and AI-powered automation. Eight projects with code and demos.",
        nav=[("proyectos", "Projects"), ("experiencia", "Experience"), ("formacion", "Education"), ("contacto", "Contact")],
        other_lang=("ES", "../"),
        kicker="Bogotá, Colombia · Systems Engineer",
        role="Systems & Data Analyst · QA · AI-powered automation",
        summary=("Systems Engineer with a background in requirements, data and AI-powered automation. As a QA Engineer (2022–2024) I "
                 "analyzed and documented user stories and integrations, with acceptance criteria, in Agile/Scrum teams. In my professional "
                 "internship I performed statistical and trend analysis to support decisions, automated Excel workbooks with macros and "
                 "built the prototype of a conversational AI agent."),
        b_projects="See projects", b_mail="Email", where="Open to remote, hybrid or on-site work in Bogotá.",
        projects_h="Projects", projects_lead=("Eight projects with one idea in common: systems that fail safely, can be audited and measure "
                                              "what they promise. Each one has its code, automated tests and a section on its limits."),
        learned="I learned:", link_names={"code": "Code", "demo": "Live demo", "page": "Project page"},
        note=("Personal projects built with AI assistants; I reviewed, ran and verified them. "
              "Figures come from their tests and evaluations, and each repository explains what is not measured."),
        p={
            "storylens": ("StoryLens QA", "Catch requirement issues before they become bugs",
                          "Reads user stories and flags what is poorly written, citing the standard (ISO 29148, INVEST, ISTQB); generates traceable test cases and measures quality. AI is optional: if it fails, the rules keep working.",
                          "to evaluate AI honestly: on unseen stories the rules (F1 0.71) beat the AI (0.37–0.46)."),
            "lab": ("Defense lab", "See a web attack from the inside, and how it is stopped",
                    "The same app written vulnerable and hardened; seven OWASP Top 10 attacks run against both at once, and a console shows every request, the result and the line of code that makes the difference.",
                    "how SQL injection, XSS, brute force, IDOR and others work, and how to fix them."),
            "nexusflow": ("NexusFlow", "Automate business processes without doing anything twice",
                          "Workflows with steps, conditions and API calls that run in the background with retries and idempotency; role-based users, encrypted credentials, signed webhooks and an audit log.",
                          "idempotency and designing for failure: no retry ever charges twice."),
            "datapulse": ("DataPulse", "Trustworthy, traceable data from source to report",
                          "Ingests files and an API with validation and quarantine, Prefect orchestration, a dbt star schema, a KPI API and a dashboard; any figure can be traced back to its file.",
                          "data quality and traceability: 37 seeded defects the pipeline must catch exactly."),
            "sello": ("Sello · AI triage", "AI classifies; a person adds the stamp",
                      "Classifies IT support requests with an LLM and a rule decides: auto-approve or send to a person. Then it goes to the right team with a deadline. Correct category in 9 of 10 final-test cases.",
                      "that a model's confidence is not enough: urgent and doubtful requests go to a person."),
            "integrador": ("Webhook integrator", "Deliver events between systems without losing one",
                           "Receives GitHub webhooks, verifies the HMAC signature, answers 202 and delivers them from a worker with exponential backoff and jitter; failed events are reprocessed from a panel.",
                           "to measure with injected failures: with 30% failures, 200 of 200 were delivered."),
            "cortex": ("Cortex Agent", "An AI agent you can watch think",
                       "An agent with its own loop, tools over MCP, hybrid document search and memory; every step is logged and evaluated automatically.",
                       "how an agent works inside and how to evaluate it with repeatable tests."),
            "datos": ("Colombia open data", "Real public data, cleaned and checked",
                      "Downloads higher-education enrollment from datos.gov.co, validates it, computes statistics and writes a summary whose figures are verified; totals match the official source.",
                      "to distrust the source: the data came duplicated and faked a 48% drop."),
        },
        exp_h="Experience",
        jobs=[
            dict(org="Fundación Universitaria del Área Andina", pos="Professional internship", when="Dec 2025 – Mar 2026", items=[
                "Statistical and trend analysis on databases to detect problems and support decisions, with charts and samples.",
                "Built macros and optimized Excel workbooks and basic databases to improve information handling.",
                "Prototype of a conversational AI agent to help draft institutional documents following the institution's rules (initial phase, not deployed).",
            ]),
            dict(org="Software Quality Assurance S.A.", pos="QA Engineer", when="2022 – 2024", items=[
                "Started as a SENA intern and continued as QA Engineer.",
                "Analyzed and documented user stories and integrations in staging and pre-production, identifying risks before each release.",
                "Contributed requirements analysis and acceptance criteria in Agile/Scrum ceremonies.",
                "Maintained documentation and traceability in Jira and Confluence across Development, QA and Product.",
                "Automated repetitive analysis and information-organization tasks with Python.",
                "Validated REST services: HTTP status codes, JSON payloads and edge cases.",
            ]),
        ],
        edu_h="Education", edu=[
            ("B.S. Systems Engineering", "Fundación Universitaria del Área Andina", "2023 – 2026"),
            ("Technologist in Information Systems Analysis and Development", "SENA", "2021 – 2023"),
            ("Master in Artificial Intelligence and Innovation", "Founderz · Prompt engineering (few-shot, RAG), Copilot Studio, Power Automate, Make and Power BI", "2024 – 2025"),
            ("Diploma in Python Programming and DevNet (140 h)", "Área Andina", "2025"),
        ],
        cert_h="Certifications", certs=[
            "DevNet Associate · Python Essentials 1 & 2 · Introduction to Modern AI — Cisco Networking Academy",
            "Introduction to ISTQB · Requirements, Performance and REST API Testing — Área Andina",
        ],
        skills_h="Skills", skills=[
            ("Data & BI", ["SQL", "Advanced Excel (macros)", "Statistical analysis", "Power BI", "ETL"]),
            ("QA & methodologies", ["Acceptance criteria", "REST API testing", "pytest", "Playwright", "Postman/Newman", "Agile/Scrum", "Jira", "Confluence"]),
            ("Programming", ["Python", "FastAPI", "React", "PostgreSQL", "SQLite", "Git/GitHub", "GitHub Actions", "Docker"]),
            ("AI & automation", ["Prompt engineering", "GPT-4", "Claude", "Gemini", "Azure OpenAI", "Copilot Studio", "Power Automate", "Make"]),
        ],
        lang_h="Languages", langs="Spanish (native) · English B2 (technical reading and documentation)",
        contact_h="Let's talk", contact_lead="Looking for someone for QA, data analysis or AI-powered automation? Write to me.",
        mail_fallback="juansgarciac2003 [at] gmail.com",
        footer="Built with HTML, CSS and JavaScript, no dependencies. The colored cursors build the page the first time you visit.",
        replay="Watch the build again",
    ),
}

E = escape


def page(lang):
    c = C[lang]
    pre = "" if lang == "es" else "../"
    nav = "".join(f'<a href="#{i}">{E(t)}</a>' for i, t in c["nav"])
    cards = []
    for pr in PROJECTS:
        name, tag, desc, learned = c["p"][pr["k"]]
        chips = "".join(f'<li class="chip">{E(s)}</li>' for s in pr["stack"])
        links = "".join(f'<li><a href="{E(u)}" rel="noopener">{E(c["link_names"][kind])}</a></li>' for kind, u in pr["links"])
        cards.append(
            f'<article class="card"><figure><img src="{pre}img/{pr["img"]}.webp" alt="{E(name)}: {E(tag)}" '
            f'loading="lazy" decoding="async" width="960" height="600"></figure>'
            f'<div class="body"><h3>{E(name)}</h3><p class="tagline">{E(tag)}</p><p class="desc">{E(desc)}</p>'
            f'<p class="learned"><b>{E(c["learned"])}</b> {E(learned)}</p><ul class="chips">{chips}</ul>'
            f'<ul class="links">{links}</ul></div></article>')
    jobs = "".join(
        f'<article class="panel job"><header><h3>{E(j["org"])}</h3><span class="meta">{E(j["when"])}</span></header>'
        f'<p class="pos">{E(j["pos"])}</p><ul>{"".join(f"<li>{E(i)}</li>" for i in j["items"])}</ul></article>'
        for j in c["jobs"])
    edu = "".join(f'<li><span><b>{E(t)}</b><small>{E(w)}</small></span><span class="y">{E(y)}</span></li>' for t, w, y in c["edu"])
    certs = "".join(f"<li>{E(x)}</li>" for x in c["certs"])
    skills = "".join(f'<div class="panel"><h3>{E(h)}</h3><ul class="chips">{"".join(f"<li class=chip>{E(s)}</li>" for s in items)}</ul></div>'
                     for h, items in c["skills"])
    other_label, other_href = c["other_lang"]
    alt = (f'<link rel="alternate" hreflang="en" href="https://juansgarciac.github.io/en/">'
           f'<link rel="alternate" hreflang="es" href="https://juansgarciac.github.io/">')
    mail = (f'<a class="btn primary" data-mail data-u="juansgarciac2003" data-d="gmail.com" href="#contacto">'
            f'{E(c["b_mail"])}</a>')
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(c["title"])}</title>
<meta name="description" content="{E(c["description"])}">
<meta property="og:title" content="{E(c["title"])}">
<meta property="og:description" content="{E(c["description"])}">
<meta property="og:image" content="https://juansgarciac.github.io/img/storylens.webp">
{alt}
<link rel="icon" href="{pre}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{pre}styles.css">
</head>
<body>
<script src="{pre}swarm-rebuild.js" data-agents="14"></script>
<div data-sr-root>
<header class="top"><div class="wrap">
  <a class="brand" href="#inicio">Juan Sebastián <span>García</span></a>
  <nav aria-label="Secciones">{nav}</nav>
  <a class="lang" href="{other_href}" hreflang="{other_label.lower()}">{other_label}</a>
</div></header>

<main id="inicio">
<section class="hero"><div class="wrap">
  <p class="kicker">{E(c["kicker"])}</p>
  <h1>Juan Sebastián García Carrillo</h1>
  <p class="role">{E(c["role"])}</p>
  <p class="summary">{E(c["summary"])}</p>
  <ul class="actions">
    <li><a class="btn" href="#proyectos">{E(c["b_projects"])}</a></li>
    <li>{mail}</li>
    <li><a class="btn" href="https://www.linkedin.com/in/juansgc" rel="noopener">LinkedIn</a></li>
    <li><a class="btn" href="{GH}" rel="noopener">GitHub</a></li>
  </ul>
  <p class="where">{E(c["where"])}</p>
</div></section>

<section id="proyectos"><div class="wrap">
  <h2>{E(c["projects_h"])}</h2>
  <p class="lead">{E(c["projects_lead"])}</p>
  <div class="grid">{"".join(cards)}</div>
  <p class="note">{E(c["note"])}</p>
</div></section>

<section id="experiencia"><div class="wrap">
  <h2>{E(c["exp_h"])}</h2>
  <div class="timeline">{jobs}</div>
</div></section>

<section id="formacion"><div class="wrap">
  <div class="two">
    <div class="panel"><h2>{E(c["edu_h"])}</h2><ul class="edu">{edu}</ul></div>
    <div class="panel"><h2>{E(c["cert_h"])}</h2><ul>{certs}</ul><h2>{E(c["lang_h"])}</h2><p>{E(c["langs"])}</p></div>
  </div>
</div></section>

<section id="habilidades"><div class="wrap">
  <h2>{E(c["skills_h"])}</h2>
  <div class="skills">{skills}</div>
</div></section>

<section id="contacto" class="contact"><div class="wrap">
  <div class="panel">
    <h2>{E(c["contact_h"])}</h2>
    <p class="lead" style="margin-inline:auto">{E(c["contact_lead"])}</p>
    <ul class="actions" style="justify-content:center">
      <li>{mail}</li>
      <li><a class="btn" href="https://www.linkedin.com/in/juansgc" rel="noopener">LinkedIn</a></li>
      <li><a class="btn" href="{GH}" rel="noopener">GitHub</a></li>
    </ul>
    <noscript><p>{E(c["mail_fallback"])}</p></noscript>
  </div>
</div></section>
</main>

<footer><div class="wrap">
  <p>{E(c["footer"])} <button type="button" data-sr-replay>{E(c["replay"])}</button></p>
  <p>© 2026 Juan Sebastián García Carrillo</p>
</div></footer>
</div>
<script src="{pre}site.js" defer></script>
</body>
</html>
"""


if __name__ == "__main__":
    (HERE / "index.html").write_text(page("es"), encoding="utf-8")
    (HERE / "en").mkdir(exist_ok=True)
    (HERE / "en" / "index.html").write_text(page("en"), encoding="utf-8")
    print("ok: index.html y en/index.html")
