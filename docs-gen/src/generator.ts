import { DocEntry } from './types';

function formatDescription(text: string): string {
  return text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const languageClass = lang ? `lang-${lang.toLowerCase()}` : '';
    return `<pre class="code-block ${languageClass}"><code>${code.trim()}</code></pre>`;
  });
}

export function generateHTML(entries: DocEntry[], title: string = 'API Documentation'): string {
  // Group by Module -> Container
  const groups: Record<string, Record<string, DocEntry[]>> = {};

  entries.forEach(entry => {
    if (!groups[entry.module]) groups[entry.module] = {};
    const container = entry.container || 'Global';
    if (!groups[entry.module][container]) groups[entry.module][container] = [];
    groups[entry.module][container].push(entry);
  });

  let htmlContent = '';
  for (const [module, containers] of Object.entries(groups)) {
    htmlContent += `<section class="module-group">
      <h2 class="module-name">${module}</h2>`;
    
    for (const [container, members] of Object.entries(containers)) {
      htmlContent += `
        <div class="container-group">
          <h3 class="container-name">${container}</h3>
          ${members.map(entry => `
            <div class="entry" id="${entry.name}" data-name="${entry.name.toLowerCase()}">
              <div class="entry-header">
                <span class="type">${entry.type}</span>
                <span class="name">${entry.name}</span>
                ${entry.isPublic ? '<span class="badge pub">public</span>' : ''}
              </div>
              ${entry.signature ? `<div class="signature"><code>${entry.signature}</code></div>` : ''}
              <div class="description">${formatDescription(entry.description)}</div>
              ${entry.params ? `
                <div class="section">
                  <strong>Parameters:</strong>
                  <ul>
                    ${entry.params.map(p => `<li><code>${p.name}</code> <span class="type-small">${p.type}</span> - ${p.description}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${entry.returns ? `
                <div class="section">
                  <strong>Returns:</strong> <code>${entry.returns.type}</code> ${entry.returns.description}
                </div>
              ` : ''}
              <div class="file-path">File: ${entry.filePath} (Line ${entry.lineNumber})</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    htmlContent += `</section>`;
  }

  const index = entries.map(entry => `<li data-name="${entry.name.toLowerCase()}"><a href="#${entry.name}">${entry.name}</a></li>`).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        :root {
            --primary: #60a5fa;
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text: #f1f5f9;
            --text-muted: #94a3b8;
            --border: #334155;
            --accent: #334155;
            --code-bg: #0f172a;
            --badge-bg: #064e3b;
            --badge-text: #6ee7b7;
        }
        body {
            font-family: 'Inter', -apple-system, system-ui, sans-serif;
            line-height: 1.6;
            color: var(--text);
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: var(--bg);
        }
        h1 { 
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 2rem;
            text-align: center;
            color: var(--text);
        }
        .container { display: flex; gap: 3rem; }
        nav {
            width: 300px;
            position: sticky;
            top: 2rem;
            height: fit-content;
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
            border: 1px solid var(--border);
        }
        .search-box {
            width: 100%;
            padding: 0.6rem;
            margin-bottom: 1rem;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 6px;
            color: white;
            font-family: inherit;
        }
        nav strong { display: block; margin-bottom: 1rem; font-size: 1.1rem; }
        nav ul { list-style: none; padding: 0; }
        nav li { margin-bottom: 0.4rem; }
        nav a { 
            text-decoration: none; 
            color: var(--text-muted); 
            font-size: 0.9rem; 
            display: block;
            padding: 0.3rem 0.5rem;
            border-radius: 6px;
            transition: all 0.2s;
        }
        nav a:hover { background: var(--accent); color: var(--primary); }
        main { flex: 1; }
        .module-group { margin-bottom: 4rem; }
        .module-name { 
            font-size: 1.8rem; 
            color: var(--primary); 
            border-bottom: 2px solid var(--border); 
            padding-bottom: 0.5rem; 
            margin-bottom: 2rem;
        }
        .container-group { margin-bottom: 3rem; }
        .container-name { 
            font-size: 1.4rem; 
            color: #cbd5e1; 
            margin-bottom: 1.5rem; 
            display: flex; 
            align-items: center; 
            gap: 0.5rem;
        }
        .container-name::before { content: '📦'; }
        .entry {
            background: var(--card-bg);
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border);
            transition: transform 0.2s;
        }
        .entry:hover { transform: translateY(-2px); }
        .entry-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .signature {
            background: var(--code-bg);
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            border: 1px solid var(--border);
            border-left: 4px solid var(--primary);
        }
        .signature code {
            background: transparent;
            color: inherit;
            padding: 0;
        }
        .type {
            background: var(--accent);
            color: var(--primary);
            padding: 0.2rem 0.6rem;
            border-radius: 6px;
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 700;
        }
        .name { font-size: 1.75rem; font-weight: 700; color: #ffffff; }
        .badge { font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 600; }
        .badge.pub { background: var(--badge-bg); color: var(--badge-text); }
        .description { font-size: 1.1rem; margin-bottom: 1.5rem; color: #cbd5e1; }
        .code-block {
            background: var(--code-bg);
            border: 1px solid var(--border);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            color: #f8fafc;
        }
        .code-block code {
            background: transparent;
            padding: 0;
            color: inherit;
        }
        .section { margin-bottom: 1.5rem; padding: 1rem; background: #1e293b; border: 1px solid var(--border); border-radius: 8px; }
        .section strong { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted); }
        .type-small { color: var(--text-muted); font-style: italic; font-size: 0.9rem; }
        .file-path { font-size: 0.8rem; color: var(--text-muted); margin-top: 1.5rem; text-align: right; border-top: 1px solid var(--border); padding-top: 1rem; }
        code { background: #334155; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: #e2e8f0; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="container">
        <nav>
            <input type="text" class="search-box" id="search" placeholder="Search API..." oninput="filterDocs()">
            <strong>API Index</strong>
            <ul>${index}</ul>
        </nav>
        <main>
            ${htmlContent}
        </main>
    </div>
    <script>
        function filterDocs() {
            const query = document.getElementById('search').value.toLowerCase();
            
            // Filter Sidebar
            document.querySelectorAll('nav li').forEach(li => {
                const name = li.getAttribute('data-name');
                li.style.display = name.includes(query) ? 'block' : 'none';
            });

            // Filter Main Content
            document.querySelectorAll('.entry').forEach(entry => {
                const name = entry.getAttribute('data-name');
                entry.style.display = name.includes(query) ? 'block' : 'none';
            });
            
            // Hide empty containers
            document.querySelectorAll('.container-group').forEach(group => {
                const hasVisible = Array.from(group.querySelectorAll('.entry')).some(e => e.style.display !== 'none');
                group.style.display = hasVisible ? 'block' : 'none';
            });
            // Hide empty modules
            document.querySelectorAll('.module-group').forEach(group => {
                const hasVisible = Array.from(group.querySelectorAll('.entry')).some(e => e.style.display !== 'none');
                group.style.display = hasVisible ? 'block' : 'none';
            });
        }
    </script>
</body>
</html>
  `;
}
