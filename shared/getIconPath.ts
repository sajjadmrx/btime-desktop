import path from "path";

export function getIconPath(): string {
    let icon;
    if (process.env.PUBLIC)
        switch (process.platform) {
            case "win32":
                icon = path.join(process.env.PUBLIC, "icons/icon.ico");
                break;
            case "darwin":
                icon = path.join(process.env.PUBLIC, "icons/icon.ico");
                break;
            case "linux":
                icon = path.join(process.env.PUBLIC, "icons/icon.png");
                break;
            default:
                icon = path.join(process.env.PUBLIC, "icons/icon.ico");
                break;
        }
    return icon || ""
}


export function getPublicFilePath(filePath: string): string {
    return path.join(process.env.PUBLIC as string, filePath);
}