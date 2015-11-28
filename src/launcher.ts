"use strict";

import path = require("path");
import cp = require("child_process");
import vscode = require("vscode");

export class Launcher {
	private _workspacePath: string = null;
	private _activeItemPath: string = null;
    private _commands: Array<ICommand> = [];
    private _startTerminal: ICommand = null;

	constructor(textEditor: vscode.TextEditor = null) {
		this._workspacePath = vscode.workspace.rootPath;
		if (textEditor !== null) {
			this._activeItemPath = path.dirname(textEditor.document.fileName);
            if (this._activeItemPath === ".") {
                this._activeItemPath = null;
            }
		}

        this.initCommands();
	}

	public runTerminalInItemFolder() {
		if (this._startTerminal !== null) {
            this._startTerminal.run(this._activeItemPath);
        }
	}

    public runTerminalInWorkspaceFolder () {
		if (this._startTerminal !== null) {
            this._startTerminal.run(this._workspacePath);
        }
	}

    public configure() {
        vscode.window.showInformationMessage("Local Setup");
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
        this._startTerminal = new TerminalCommand(this._workspacePath, this._activeItemPath);
    }
}

interface ICommand {
    description: string;
    run(startIn: string): void;
}

class Command implements ICommand {
    private _executable: string;
    private _parameters: string;
    private _description: string;
    private _workspacePath: string;
	private _activeItemPath: string ;

    constructor(description: string,
                executable: string,
                parameters: string,
                workspacePath: string,
                activeItemPath: string) {
        this._description = description;
        this._executable = executable;
        this._parameters = parameters;
        this._workspacePath = workspacePath === null ? "" : workspacePath;
        this._activeItemPath = activeItemPath === null ? "" : activeItemPath;
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

        str = str.replace(/%item%/ig, this._activeItemPath);
        str = str.replace(/%workspace%/ig, this._workspacePath);
        return str;
    }
}

class TerminalCommand extends Command {
    constructor(workspacePath: string,
                activeItemPath: string) {
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

        super("Terminal", executable, parameters, workspacePath, activeItemPath);
    }
}