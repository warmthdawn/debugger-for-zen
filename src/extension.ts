'use strict';

import * as vscode from 'vscode';
import { setupDebug } from './setupDebug';

/*
 * The compile time flag 'runMode' controls how the debug adapter is run.
 * Please note: the test suite only supports 'external' mode.
 */

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('zenscript.debug');
	setupDebug(context, config);
}

export function deactivate() {
	// nothing to do
}


