# Parquet Viewer

A Visual Studio Code extension for viewing Apache Parquet files in a tabular format directly within the editor.

## Features

- **Direct file viewing**: Open `.parquet` files directly from the VS Code Explorer
- **Tabular display**: View data in an organized table format with up to 5,000 rows
- **Interactive filtering**: Filter columns using built-in search inputs
- **Pagination**: Navigate through large datasets with pagination controls
- **Offline operation**: Works completely offline using `parquetjs-lite`
- **Context menu integration**: Right-click on `.parquet` files to open with the viewer

## Installation

### From VSIX Package
1. Download the `.vsix` file
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X`)
4. Click "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

### From Source
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the extension:
   ```bash
   npm run compile
   ```
4. Package the extension:
   ```bash
   npm run package
   ```

## Usage

1. **Right-click method**: Right-click on any `.parquet` file in the Explorer and select "Open Parquet File"
2. **Command palette**: Open Command Palette (`Ctrl+Shift+P`) and run "Open Parquet File"

The viewer will open in a new tab showing:
- Column headers with individual filter inputs
- Paginated data display (100 rows per page)
- Navigation controls for browsing through pages
- Row count and page information

## Development

### Prerequisites
- Node.js (v16 or higher)
- VS Code (v1.85.0 or higher)

### Build Commands
- `npm run compile` - Compile TypeScript files
- `npm run watch` - Watch mode for development
- `npm run package` - Create VSIX package
- `npm run vscode:prepublish` - Prepare for publishing

### Project Structure
```
├── src/
│   ├── extension.ts          # Main extension logic
│   └── parquetjs-lite.d.ts   # Type definitions
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Technical Details

- **Engine**: VS Code API v1.85.0+
- **Language**: TypeScript
- **Parquet Parser**: parquetjs-lite v0.8.7
- **Display**: HTML webview with inline JavaScript
- **Memory Safety**: Limited to 5,000 rows maximum
- **File Support**: Standard Apache Parquet format

## License

This project is open source. Please check the repository for license details.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
