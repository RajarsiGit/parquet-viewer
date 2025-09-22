# Claude Development Workflow

This document contains helpful information for Claude when working on the Parquet Viewer VS Code extension.

## Project Overview

This is a Visual Studio Code extension that allows users to view Apache Parquet files in a tabular format within the editor. The extension uses `parquetjs-lite` for parsing parquet files and displays data in an HTML webview with pagination and filtering capabilities.

## Key Files

- `src/extension.ts` - Main extension logic and webview HTML generation
- `src/parquetjs-lite.d.ts` - Type definitions for parquetjs-lite library
- `package.json` - Extension manifest and dependencies
- `tsconfig.json` - TypeScript configuration

## Development Commands

### Building and Development
- `npm install` - Install dependencies
- `npm run compile` - Compile TypeScript to JavaScript (outputs to dist/)
- `npm run watch` - Watch mode for active development
- `npm run package` - Create .vsix package for distribution
- `npm run vscode:prepublish` - Prepare for VS Code marketplace publishing

### Testing
- Manual testing: Install the .vsix package in VS Code and test with actual .parquet files
- No automated tests are currently configured

## Architecture Notes

### Extension Activation
- Activates on command `parquetViewer.open`
- Registers command handler in `activate()` function
- Context menu integration for .parquet files

### Core Functionality
- `parquetViewer.open` command opens selected .parquet file
- Creates VS Code webview panel for display
- Reads parquet file using `parquetjs-lite.ParquetReader.openFile()`
- Limits display to 5,000 rows for memory safety
- Generates HTML with embedded JavaScript for table rendering

### Webview Features
- Pagination (100 rows per page)
- Column filtering with text inputs
- Responsive table layout
- Error handling for file read failures

## Dependencies

### Runtime Dependencies
- `parquetjs-lite@^0.8.7` - Parquet file parsing library

### Development Dependencies
- `@types/node@^20.0.0` - Node.js type definitions
- `@types/vscode@^1.85.0` - VS Code API type definitions
- `typescript@^5.0.0` - TypeScript compiler
- `vsce@^2.15.0` - VS Code extension packaging tool

## Common Development Tasks

### Adding New Features
1. Modify `src/extension.ts` for new commands or functionality
2. Update `package.json` to register new commands/contributions
3. Compile with `npm run compile`
4. Test by packaging and installing: `npm run package`

### Debugging
- Use VS Code's built-in debugging for extensions
- Console.log statements in webview JavaScript will appear in webview DevTools
- Extension host errors appear in VS Code Developer Console

### Webview Development
- HTML content is generated in `getWebviewContent()` function
- Inline CSS and JavaScript for self-contained display
- Data passed from extension to webview via JSON serialization

## Constraints and Limitations
- Maximum 5,000 rows displayed for memory safety
- No write/edit capabilities - read-only viewer
- Requires .parquet file to be accessible via file system
- Limited to standard Apache Parquet format support

## Publishing Notes
- Extension ID: `parquet-viewer`
- Publisher: `your-name` (should be updated for actual publishing)
- Requires VS Code 1.85.0 or higher
- Category: "Other"