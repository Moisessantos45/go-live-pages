// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ChildProcess, spawn, exec } from "child_process";

// Al inicio de tu extensión (extension.ts)
process.removeAllListeners("warning");

// O solo para warnings específicos de SQLite
process.on("warning", (warning) => {
  if (
    warning.name === "ExperimentalWarning" &&
    warning.message.includes("SQLite")
  ) {
    // Silenciar solo warnings de SQLite experimental
    return;
  }
  console.warn(warning.name + ": " + warning.message);
});

// Variable global para almacenar el proceso del servidor
let serverProcess: ChildProcess | null = null;
let serverOutputChannel: vscode.OutputChannel;
// Variable para almacenar el puerto actual
let currentServerPort: number | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "go-live-pages" is now active!');

  // Crear canal de output para mostrar logs del servidor
  serverOutputChannel = vscode.window.createOutputChannel("Go Live Pages");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // Comando para iniciar el servidor
  let startDisposable = vscode.commands.registerCommand(
    "go-live-pages.init",
    async () => {
      // Si ya hay un servidor ejecutándose, preguntar si detenerlo
      if (serverProcess) {
        const answer = await vscode.window.showWarningMessage(
          "Go Live Pages is already running. Do you want to restart it?",
          "Yes",
          "No"
        );

        if (answer === "Yes") {
          stopServer();
        } else {
          return;
        }
      }

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder open");
        return;
      }

      const projectPath = workspaceFolders[0].uri.fsPath;

      try {
        // Crear estructura de carpetas
        createProjectStructure(projectPath);

        // Iniciar el servidor Go
        startGoServer(projectPath, context);

        vscode.window.showInformationMessage("Starting Go Live Server...");
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error starting Go Live Pages: ${error}`
        );
      }
    }
  );

  // Comando para detener el servidor
  let stopDisposable = vscode.commands.registerCommand(
    "go-live-pages.stop",
    () => {
      if (!serverProcess) {
        vscode.window.showInformationMessage("Go Live Server is not running");
        return;
      }

      stopServer();
      vscode.window.showInformationMessage("Go Live Server stopped");
    }
  );

  context.subscriptions.push(
    startDisposable,
    stopDisposable,
    serverOutputChannel
  );
}

function createProjectStructure(projectPath: string) {
  const folders = ["views", "style", "images", "js"];

  // Crear carpetas
  folders.forEach((folder) => {
    const fullPath = path.join(projectPath, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Crear archivos básicos
  createBasicFiles(projectPath);
}

function createBasicFiles(projectPath: string) {
  // Crear styles.css básico
  const cssContent = `/* Estilos básicos - Go Live Server */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    border-bottom: 2px solid #007acc;
    padding-bottom: 10px;
}`;

  const cssPath = path.join(projectPath, "style", "styles.css");
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, cssContent);
  }

  // Crear index.html básico
  const htmlContent = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Go Live Server - Proyecto</title>
        <link rel="stylesheet" href="/style/styles.css">
    </head>
    <body>
        <h1>¡Bienvenido a Go Live Server!</h1>
        <p>Tu servidor de desarrollo está funcionando correctamente.</p>
        <p>Edita este archivo en <code>views/index.html</code> para comenzar.</p>
        
        <script src="/websocket.js"></script>
    </body>
    </html>
      `;

  const htmlPath = path.join(projectPath, "views", "index.html");
  if (!fs.existsSync(htmlPath)) {
    fs.writeFileSync(htmlPath, htmlContent);
  }
}

function startGoServer(projectPath: string, context: vscode.ExtensionContext) {
  const platform = process.platform;
  let binaryName: string;

  if (platform === "win32") {
    binaryName = "live-server.exe";
  } else if (platform === "linux") {
    binaryName = "live-server-linux";
  } else if (platform === "darwin") {
    binaryName = "live-server-macos";
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const extensionPath = context.extensionPath;
  const binaryPath = path.join(extensionPath, "src", "go-server", binaryName);

  if (!fs.existsSync(binaryPath)) {
    throw new Error(`Go binary not found: ${binaryPath}`);
  }

  if (platform !== "win32") {
    fs.chmodSync(binaryPath, 0o755);
  }

  // Mostrar canal de output
  serverOutputChannel.show(true);
  serverOutputChannel.appendLine("🚀 Starting Go Live Server...");
  serverOutputChannel.appendLine(`📁 Project path: ${projectPath}`);
  serverOutputChannel.appendLine(`⚙️  Binary: ${binaryPath}`);
  serverOutputChannel.appendLine("─".repeat(50));

  currentServerPort = null;

  // Ejecutar el servidor Go
  serverProcess = spawn(binaryPath, [], {
    cwd: projectPath,
    stdio: "pipe",
  });

  if (!serverProcess.stdout || !serverProcess.stderr) {
    serverOutputChannel.appendLine("❌ Failed to start Go Live Server.");
    return;
  }

  // Manejar salida del servidor - DETECTAR PUERTO REAL
  serverProcess.stdout.on("data", (data) => {
    const message = data.toString().trim();
    serverOutputChannel.appendLine(`[SERVER] ${message}`);

    // Detectar mensajes de puerto del servidor Go
    detectServerPort(message);
  });

  serverProcess.stderr.on("data", (data) => {
    const error = data.toString().trim();
    serverOutputChannel.appendLine(`[ERROR] ${error}`);
  });

  serverProcess.on("close", (code) => {
    serverOutputChannel.appendLine(
      `⏹️  Server process exited with code ${code}`
    );
    serverOutputChannel.appendLine("─".repeat(50));
    serverProcess = null;
  });

  serverProcess.on("error", (error) => {
    serverOutputChannel.appendLine(`❌ Server error: ${error.message}`);
    vscode.window.showErrorMessage(`Go Live Server error: ${error.message}`);
    serverProcess = null;
  });
}

// Función para detectar el puerto del servidor desde los logs
function detectServerPort(message: string) {
  if (currentServerPort) {
    return;
  }

  const match = message.match(/http:\/\/localhost:(\d+)/);
  if (match) {
    currentServerPort = parseInt(match[1], 10);

    // 🚀 Notificación rápida al usuario
    vscode.window
      .showInformationMessage(
        `🚀 Go Live Server running at http://localhost:${currentServerPort}`,
        "Abrir navegador"
      )
      .then((selection) => {
        if (selection === "Abrir navegador") {
          vscode.env.openExternal(
            vscode.Uri.parse(`http://localhost:${currentServerPort}`)
          );
        }
      });
  }
}

// Función para abrir el navegador automáticamente
async function openBrowser(port: number) {
  try {
    const config = vscode.workspace.getConfiguration("go-live-pages");
    const shouldOpenBrowser = config.get("autoOpenBrowser", true);

    if (!shouldOpenBrowser) {
      return;
    }

    const url = `http://localhost:${port}`;

    // Usar la API de VS Code para abrir enlaces externos
    vscode.env.openExternal(vscode.Uri.parse(url));
  } catch (error) {
    serverOutputChannel.appendLine(`❌ Could not open browser: ${error}`);
  }
}

function stopServer() {
  if (!serverProcess) {
    return;
  }

  serverOutputChannel.appendLine("🛑 Stopping Go Live Server...");

  // Matar el proceso de manera segura
  if (process.platform === "win32") {
    // Windows
    exec(`taskkill /pid ${serverProcess.pid} /T /F`);
  } else {
    // Linux/macOS
    serverProcess.kill("SIGTERM");

    // Forzar kill después de 3 segundos si no responde
    setTimeout(() => {
      if (serverProcess) {
        serverProcess.kill("SIGKILL");
      }
    }, 3000);
  }

  serverProcess = null;
}

// Función para verificar si el servidor está ejecutándose
export function isServerRunning(): boolean {
  return serverProcess !== null;
}

// Función para obtener información del servidor
export function getServerInfo(): { running: boolean; pid?: number } {
  return {
    running: serverProcess !== null,
    pid: serverProcess?.pid,
  };
}

export function deactivate() {
  // Detener el servidor cuando la extensión se desactiva
  if (serverProcess) {
    stopServer();
  }
}
