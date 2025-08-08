// const path = require('path');
// const { task, src, dest } = require('gulp');

// task('build:icons', copyIcons);

// function copyIcons() {
// 	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
// 	const nodeDestination = path.resolve('dist', 'nodes');

// 	src(nodeSource).pipe(dest(nodeDestination));

// 	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
// 	const credDestination = path.resolve('dist', 'credentials');

// 	return src(credSource).pipe(dest(credDestination));
// }
const path = require('path');
const { task, src, dest } = require('gulp');
const packageJson = require('./package.json');

task('build:icons', copyIcons);

function copyIcons() {
  // 使用 package.json 中的名称
  const packageName = packageJson.name;

  // 创建 n8n 期望的目录结构
  const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
  const nodeDestination = path.resolve('dist', packageName, 'nodes');

  // 复制节点图标
  return src(nodeSource)
    .pipe(dest(nodeDestination));
}
