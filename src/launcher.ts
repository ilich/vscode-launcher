"use strict";

import path = require("path");
import vscode = require("vscode");

export class Launcher {
	private workspacePath: string = null;
	private activeItemPath: string = null;
    private commands: Array<ICommand> = [];
    private startTerminal: ICommand = null;

	constructor(textEditor: vscode.TextEditor = null) {
		this.workspacePath = vscode.workspace.rootPath;
		if (textEditor !== null) {
			this.activeItemPath = path.dirname(textEditor.document.fileName);
            if (this.activeItemPath === ".") {
                this.activeItemPath = null;
            }
		}

        this.initCommands();
	}

	public runTerminalInItemFolder() {
		if (this.activeItemPath === null) {
			return;
		}

		if (this.startTerminal !== null) {
            this.startTerminal.run(this.activeItemPath);
        }
	}

    public runTerminalInWorkspaceFolder () {
		if (this.workspacePath === null) {
			return;
		}

		if (this.startTerminal !== null) {
            this.startTerminal.run(this.workspacePath);
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
        this.commands = [];

        // TODO Load commands from VS Code configuration

        // TODO Load commands from workspace configuration
    }
}

interface ICommand {
    description: string;
    run(startIn: string): void;
}