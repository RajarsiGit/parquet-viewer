import * as vscode from "vscode";
import * as parquet from "parquetjs-lite";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("parquetViewer.open", async (uri: vscode.Uri) => {
    const panel = vscode.window.createWebviewPanel(
      "parquetViewer",
      `Parquet Viewer - ${uri.path.split("/").pop()}`,
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    try {
      const reader = await parquet.ParquetReader.openFile(uri.fsPath);
      const cursor = reader.getCursor();
      let row;
      const rows: any[] = [];
      let maxRows = 5000; // safety cap

      while ((row = await cursor.next())) {
        rows.push(row);
        if (rows.length >= maxRows) break;
      }
      await reader.close();

      panel.webview.html = getWebviewContent(rows);
    } catch (err) {
      panel.webview.html = `<h3 style="color:red">Error loading Parquet file</h3><pre>${err}</pre>`;
    }
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(rows: any[]): string {
  if (rows.length === 0) return "<p>No data found.</p>";

  const headers = Object.keys(rows[0]);
  const headersJson = JSON.stringify(headers);
  const rowsJson = JSON.stringify(rows);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 10px; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #888; padding: 6px; font-size: 12px; }
        th { background: #eee; }
        input { width: 95%; padding: 2px; font-size: 11px; }
        .controls { margin: 10px 0; }
        button { margin: 0 5px; padding: 4px 8px; }
      </style>
    </head>
    <body>
      <h2>Parquet Preview</h2>
      <div class="controls">
        <button onclick="prevPage()">⬅ Prev</button>
        <span id="page-info"></span>
        <button onclick="nextPage()">Next ➡</button>
      </div>
      <table id="data-table"></table>

      <script>
        const headers = ${headersJson};
        const rows = ${rowsJson};
        const pageSize = 100;
        let currentPage = 0;
        let filters = {};

        function renderTable() {
          const table = document.getElementById("data-table");

          // filter rows
          const filtered = rows.filter(r => {
            return headers.every(h => {
              if (!filters[h]) return true;
              const val = (r[h] ?? "").toString().toLowerCase();
              return val.includes(filters[h]);
            });
          });

          const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
          if (currentPage >= totalPages) currentPage = totalPages - 1;

          // header row with filters
          let html = "<thead><tr>" + headers.map(h => "<th>" + h + "</th>").join("") + "</tr>";
          html += "<tr>" + headers.map(h => 
            "<th><input type='text' placeholder='Filter' value='" + (filters[h] || "") + 
            "' oninput='updateFilter(\"" + h + "\", this.value)'></th>"
          ).join("") + "</tr></thead>";

          // body rows
          const start = currentPage * pageSize;
          const end = Math.min(start + pageSize, filtered.length);
          const pageRows = filtered.slice(start, end);

          html += "<tbody>";
          for (const r of pageRows) {
            html += "<tr>" + headers.map(h => "<td>" + (r[h] ?? "") + "</td>").join("") + "</tr>";
          }
          html += "</tbody>";

          table.innerHTML = html;

          document.getElementById("page-info").textContent = 
            "Page " + (currentPage+1) + " of " + totalPages + " | Rows: " + filtered.length;
        }

        function updateFilter(col, val) {
          filters[col] = val.toLowerCase();
          currentPage = 0; // reset to first page
          renderTable();
        }

        function nextPage() {
          const filtered = rows.filter(r => {
            return headers.every(h => {
              if (!filters[h]) return true;
              const val = (r[h] ?? "").toString().toLowerCase();
              return val.includes(filters[h]);
            });
          });
          if ((currentPage+1) * pageSize < filtered.length) {
            currentPage++;
            renderTable();
          }
        }

        function prevPage() {
          if (currentPage > 0) {
            currentPage--;
            renderTable();
          }
        }

        renderTable();
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}
