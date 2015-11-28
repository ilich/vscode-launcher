"use strict";

import path = require("path");
import cp = require("child_process");
import vscode = require("vscode");

interface ICommand {
    description: string;
    run(startIn: string): void;
}

class LauncherState {
    private _workspacePath: string = null;
    private _activeItemPath: string = null;
    private _activeItem: string = null;

    constructor(textEditor: vscode.TextEditor = null) {
        this._workspacePath = vscode.workspace.rootPath;
        if (textEditor !== null) {
            this._activeItem = textEditor.document.fileName;
            this._activeItemPath = path.dirname(this._activeItem);
            if (this._activeItemPath === ".") {
                this._activeItemPath = null;
            }
        }
    }

    get workspacePath(): string {
        return this._workspacePath;
    }

    get activeItem(): string {
        return this._activeItem;
    }

    get activeItemPath(): string {
        return this._activeItemPath;
    }
}

export class Launcher {
    private _state: LauncherState = null;
    private _commands: Array<ICommand> = [];
    private _startTerminal: ICommand = null;

    constructor(textEditor: vscode.TextEditor = null) {
        this._state = new LauncherState(textEditor);
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
        this._startTerminal = new TerminalCommand(this._state);
    }
}

class Command implements ICommand {
    private _executable: string;
    private _parameters: string;
    private _description: string;
    private _state: LauncherState;

    constructor(description: string,
                executable: string,
                parameters: string,
                state: LauncherState) {
        this._description = description;
        this._executable = executable;
        this._parameters = parameters;
        this._state = state;
    }

    get description(): string {
        return this._description;
    }

    run(startIn: string): void {
        let parameters = this.applyTemplate(this._parameters);
        startIn = this.applyTemplate(startIn);
        let command = this._executable + " " + parameters;

        let options: any = {};
        if (startIn) {
            options.cwd = startIn;
        }

        cp.exec(command, options);
    }

    protected applyTemplate(str: string) {
        if (!str) {
            return str;
        }

        str = str.replace(/%item%/ig, this._state.activeItem);
        str = str.replace(/%item_path%/ig, this._state.activeItemPath);
        str = str.replace(/%workspace%/ig, this._state.workspacePath);
        return str;
    }
}

class TerminalCommand extends Command {
    constructor(state: LauncherState) {
        let config = vscode.workspace.getConfiguration("launcher.terminal");
        let executable = config.get<string>("executable", "");
        let parameters = config.get<string>("parameters", "");
        if (executable === "") {
            if (process.platform === "win32") {
                executable = "cmd.exe";
                parameters = "/c start /wait";
            } else if (process.platform === "darwin") {
                executable = "iTerm.sh";
                parameters = "";
            } else if (process.platform === "linux") {
                executable = "xterm";
                parameters = "";
            } else {
                // Use Windows command by default
                executable = "cmd.exe";
                parameters = "/c start /wait";
            }
        }

        super("Terminal", executable, parameters, state);
    }
}