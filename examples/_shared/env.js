export function mustEnv(name) {
    const v = process.env[name];
    if (!v) {
        console.error(`missing ${name}`);
        process.exit(1);
    }
    return v;
}
