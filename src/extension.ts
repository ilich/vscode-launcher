"use strict";

import vscode = require("vscode");
import launcher = require("./launcher");

export function activate(context: vscode.ExtensionContext) {

    var runTerminalInItemFolder = vscode.commands.registerCommand("launcher.terminal", () => {
        var tools = new launcher.Launcher(vscode.window.activeTextEditor);
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

    context.subscriptions.push(runTerminalInItemFolder);
    context.subscriptions.push(runTerminalInWorkspaceFolder);
    context.subscriptions.push(runScriptsManager);
}