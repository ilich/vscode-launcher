import cp = require("child_process");
import vscode = require("vscode");
import cfg = require("./configuration");

export interface ICommand {
    description: string;
    run(startIn: string): void;
}

export class Command implements ICommand {
    private _executable: string;
    private _parameters: string;
    private _description: string;
    private _state: cfg.LauncherState;

    constructor(description: string,
                executable: string,
                parameters: string,
                state: cfg.LauncherState) {
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

export class TerminalCommand extends Command {
    constructor(state: cfg.LauncherState) {
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