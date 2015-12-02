# Launcher

An easy way to launch your terminal, tools, scripts and batches from Visual Studio Code.

## Usage

### Open Terminal in workspace's directory

* Press `Ctrl+Alt+Shift+T`

**OR**

* Press `F1` and look for the `Open a Terminal (Workspace Folder)` command.
* Hit `Enter`.

### Open Terminal in current open item's directory

* Press `Ctrl+Shift+T`

**OR**

* Press `F1` and look for the `Open a Terminal` command.
* Hit `Enter`.

### Configure Launcher to use custom Terminal application

* Open User Preferences choosing File -> Preferences -> User Settings option in the Main Menu.
* Add **launcher.terminal** configuration section.

```
"launcher.terminal": {
    "executable": "cmd.exe",
    "parameters": "/c start /wait"
}
```

**launcher.terminal.executable** (string, required) - Terminal executable file.

**launcher.terminal.parameters** (string) - Command line parameters.

### Configre scripts and tools bookmarks

* Open User Preferences choosing File -> Preferences -> User Settings option in the Main Menu.
* Add **launcher.commands** configuration section.

```
"launcher.commands": [
    {
        "description": "Bash (Workspace)",
        "executable": "C:\\Users\\User1\\AppData\\Local\\Programs\\Git\\git-bash.exe",
        "startIn": "%workspace%"
    },
    {
        "description": "Bash (Current File)",
        "executable": "C:\\Users\\User1\\AppData\\Local\\Programs\\Git\\git-bash.exe",
        "startIn": "%item_path%"
    },
    {
        "description": "Edit Current File",
        "executable": "notepad.exe",
        "parameters": "%item%",
        "startIn": "%workspace%"
    },
    {
        "description": "Calculator",
        "executable": "calc.exe"
    },
    {
        "description": "List files in Workspace folder",
        "executable": "cmd.exe",
        "parameters": "/c dir",
        "startIn": "%workspace%",
        "output": true
    }
]
```

**launcher.commands.description** (string, required) - Text which will appear in Launcher menu.

**launcher.commands.executable** (string, required) - Program executable file.

**launcher.commands.parameters** (string) - Command line parameters.

**launcher.commands.startIn** (string) - Program starts in the directory set in the setting.

**launcher.commands.output** (boolean) - Send comman's stdout and stderr to Visual Studio Code's output channel if the value is true.

### Run a script or a tool from the bookmarks

* Press `Shift+F2` or press `F1`, look for the `Launcher` command and hit `Enter`.
* Chosse a program or a script you want to launch and hit `Enter`. 

### Template language

Launcher support special template keywords in the commands and terminal settings.

**%workspace%** - Workspace root's path

**%item_path%** - Current open file path

**%item%** - Current open file path with the file name.