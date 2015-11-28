"use strict";

import path = require("path");
import vscode = require("vscode");
import cmd = require("./command");
import cfg = require("./configuration");

export class Launcher {
    private _state: cfg.LauncherState = null;
    private _commands: Array<cmd.ICommand> = [];
    private _startTerminal: cmd.ICommand = null;

    constructor(textEditor: vscode.TextEditor = null) {
        this._state = new cfg.LauncherState(textEditor);
        this.initCommands();
    }

    public runTerminalInItemFolder() {
        if (this._startTerminal !== null) {
            this._startTerminal.run(this._state.activeItemPath);
        }
    }

    public runTerminalInWorkspaceFolder() {
        if (this._startTerminal !== null) {
            this._startTerminal.run(this._state.workspacePath);
        }
    }

    public runScriptsManager() {
        // TODO

        var items = [
            "Command 1",
            "Command 2",
            "Command 3"
        ];

        vscode.window.showQuickPick(items).then((value: string) => {
            vscode.window.showInformationMessage(value);
        });
    }

    protected initCommands() {
        this._commands = [];

        // TODO Load commands from the configuration

        // Load terminal command
        this._startTerminal = new cmd.TerminalCommand(this._state);
    }
}