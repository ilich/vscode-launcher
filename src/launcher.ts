"use strict";

import path = require("path");
import vscode = require("vscode");
import cmd = require("./command");
import cfg = require("./configuration");

export class Launcher {
    private _state: cfg.LauncherState = null;
    private _commands: { [id: string]: IMenuItem } = null;
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
        var menu: Array<string> = [];
        for (let command in this._commands) {
            menu.push(command);
        }

        vscode.window.showQuickPick(menu).then((value: string) => {
            let item = this._commands[value];
            if (!item) {
                return;
            }

            item.command.run(item.startIn);
        });
    }

    protected initCommands() {
        this._commands = {};

        // Load commands from the configuration
        let config = vscode.workspace.getConfiguration("launcher");
        let commands = config.get<Array<cfg.ICommandConfiguration>>("commands", []);
        commands.forEach((cfg: cfg.ICommandConfiguration) => {
            this._commands[cfg.description] = {
                command: new cmd.Command(cfg.description, cfg.executable, cfg.parameters, this._state),
                startIn: cfg.startIn
            };
        });

        // Load terminal command
        this._startTerminal = new cmd.TerminalCommand(this._state);
    }
}

interface IMenuItem {
    command: cmd.ICommand;
    startIn: string;
}