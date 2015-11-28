"use strict";

import vscode = require("vscode");
import launcher = require("./launcher");

export function activate(context: vscode.ExtensionContext) {

    var runTerminalInItemFolder = vscode.commands.registerTextEditorCommand("launcher.terminal", (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        var tools = new launcher.Launcher(textEditor);
        tools.runTerminalInItemFolder();
    });

    var runTerminalInWorkspaceFolder = vscode.commands.registerCommand("launcher.terminalInWorkspace", () => {
        var tools = new launcher.Launcher(vscode.window.activeTextEditor);
        tools.runTerminalInWorkspaceFolder();
    });

    var runScriptsManager = vscode.commands.registerCommand("launcher", () => {
        var tools = new launcher.Launcher(vscode.window.activeTextEditor);
        tools.runScriptsManager();
    });

    var configure = vscode.commands.registerCommand("launcher.workspace", () => {
        var tools = new launcher.Launcher(vscode.window.activeTextEditor);
        tools.configure();
    });

    context.subscriptions.push(runTerminalInItemFolder);
    context.subscriptions.push(runTerminalInWorkspaceFolder);
    context.subscriptions.push(runScriptsManager);
    context.subscriptions.push(configure);
}