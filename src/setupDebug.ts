
'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
import { WorkspaceFolder, WorkspaceConfiguration, DebugConfiguration, ProviderResult, CancellationToken, ExtensionContext } from 'vscode';
import { DebugAdapterDescriptor, DebugAdapterDescriptorFactory, DebugAdapterExecutable, DebugAdapterServer, DebugSession } from 'vscode';


export function setupDebug(context: ExtensionContext, config: WorkspaceConfiguration) {
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('zenscript', new ZenScriptConfigurationProvider()));
	const external = config.get('useExternalDebugAdapter');
	if (external === true) {
		configExternalDAP(context, config);
	} else {
		configInternalDAP(context);
	}

}
function configExternalDAP(context: ExtensionContext, config: WorkspaceConfiguration) {
	const hostName = config.get('external.hostName') as string;
	const port = config.get('external.port') as number;
	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('zenscript', new ZenScriptDebugAdapterDescriptorFactoryExternal(hostName, port)));

}

function configInternalDAP(context: ExtensionContext) {
	let scriptName = 'zenscript-debug-adapter';
	let platform = process.platform;
	if (platform === 'win32') {
		scriptName = `${scriptName}.bat`;
	}

	const startScript = path.resolve(context.extensionPath, 'server', 'zenscript-debug-adapter', 'bin', scriptName);

	if (platform === 'linux'
		|| platform === 'darwin'
		|| platform === 'freebsd'
		|| platform === 'openbsd') {
		child_process.exec(`chmod +x ${scriptName}`);
	}

	const env = { ...process.env };
	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('zenscript', new ZenScriptDebugAdapterDescriptorFactoryInternal(startScript, env)));

}

export class ZenScriptDebugAdapterDescriptorFactoryInternal implements DebugAdapterDescriptorFactory {
	constructor(
		private path: string,
		private env: any,
	) { }

	public async createDebugAdapterDescriptor(_session: DebugSession, _executable: DebugAdapterExecutable): Promise<DebugAdapterDescriptor> {
		const args = ['--standard-io'];
		return new DebugAdapterExecutable(this.path, args, {
			env: this.env
		});

	}
}


export class ZenScriptDebugAdapterDescriptorFactoryExternal implements DebugAdapterDescriptorFactory {
	constructor(
		private hostName: string,
		private port: number,
	) { }
	public async createDebugAdapterDescriptor(_session: DebugSession,
		_executable: DebugAdapterExecutable): Promise<DebugAdapterDescriptor> {
		return new DebugAdapterServer(this.port, this.hostName);
	}
}



export class ZenScriptConfigurationProvider implements vscode.DebugConfigurationProvider {

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
	resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {

		// if launch.json is missing or empty
		if (!config.type && !config.request && !config.name) {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === 'zenscript') {
				config.type = 'zenscript';
				config.name = 'Attach';
				config.request = 'attach';
				config.hostName = 'localhost';
				config.port = 8000;
				config.timeout = 1000;
			}
		}
		return config;
	}
}
