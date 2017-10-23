'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate (context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-quotes-toggle" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.toggleQuotes', () => {
        // The code you place here will be executed every time your command is executed

        toggleQuotes()

        // Display a message box to the user
        vscode.window.showInformationMessage('Toggling quotes');
    });

    context.subscriptions.push(disposable);
}

enum Quotes {
    Single = "'",
    Double = '"'
}

// this method is called when your extension is deactivated
// export function deactivate() {
// }

function toggleQuotes (): void {
    let editor = vscode.window.activeTextEditor
    if (!editor) { return; }

    let selections = editor.selections

    // TODO: implement smart selections that gets start and end of quotes

    editor.edit((builder: vscode.TextEditorEdit): void => {
        for (const selection of selections) {
            let selected_text = editor.document.getText(selection)
            builder.replace(selection, newQuotes(selected_text))
        }
    })
}

export function newQuotes (string: string): string {
    if (!string.length || !startsAndEndsWithSameQuote(string)) {
        return string
    }

    // TODO: Improve naive removal of quotes
    let no_quotes = string.substring(1, string.length - 1)

    let quote = ''
    switch (string[0]) {
        case Quotes.Single:
            quote = Quotes.Double
            break
        case Quotes.Double:
            quote = Quotes.Single
            break
    }

    return `${quote}${no_quotes}${quote}`
}

function startsAndEndsWithSameQuote (string: string): boolean {
    let startChar = string[0]
    let endChar = string.substr(-1)

    return (startChar == endChar) &&
           !!(Quotes[startChar] && Quotes[endChar])
}
