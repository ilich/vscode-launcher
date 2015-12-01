import path = require("path");
import vscode = require("vscode");

export interface ICommandConfiguration {
    description: string;
    executable: string;
    parameters?: string;
    startIn?: string;
    shouldOutput?: boolean;
}

export class LauncherState {
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
