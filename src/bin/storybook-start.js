#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import shelljs from 'shelljs';
import Server from '../server';

program
  .option('-h, --host <host>', 'host to listen on')
  .option('-p, --port <port>', 'port to listen on')
  .option('-c, --config-dir [dir-name]', 'storybook config directory')
  .parse(process.argv);

const projectDir = path.resolve();
const configDir = path.resolve(program.configDir || './storybook');
const listenAddr = [program.port];
if (program.host) {
  listenAddr.push(program.host);
}

const server = new Server({projectDir, configDir});
server.listen(...listenAddr, function (err) {
  if (err) {
    throw err;
  }
  const address = `http://${program.host || 'localhost'}:${program.port}/`;
  console.info(`\nReact Native Storybook started on => ${address}\n`);
});

// RN packager
shelljs.exec([
  'node node_modules/react-native/local-cli/cli.js start',
  `--projectRoots ${configDir},${projectDir}`,
  `--root ${projectDir}`,
].join(' '), {async: true});
