/* 
    docker run --rm \
    -v "$PWD":/app \
    -w /app \
    gcc:13 \
    make
*/
import { spawn } from "child_process";

type CompileResult =
    | {
        compiled: true;
        tests: any;
    }
    | {
        compiled: false;
        error: string;
    };

export function compile_code(language: string, dir: string) {
    let image: string;
    let command: string;

    console.log(dir);

    if (language === "cpp") {
        image = "gcc:13";
        command = "make";
    } else {
        throw new Error("Unsupported language");
    }

    return new Promise<CompileResult>((resolve, reject) => {
        const args = [
            "run", "--rm",
            "--network", "none",
            "--memory", "512m",
            "--cpus", "1",
            "--pids-limit", "64",
            "-v", `${dir}:/app`,
            "-w", "/app",
            image,
            "bash", "-c", command,
        ];

        const proc = spawn("docker", args);

        let stdout = "";
        let stderr = "";

        proc.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        proc.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        const timeout = setTimeout(() => {
            proc.kill("SIGKILL");
            reject(new Error("Compile timeout"));
        }, 5000);

        proc.on("close", (code) => {
            clearTimeout(timeout);

            if (code !== 0) {
                resolve({
                    compiled: false,
                    error: stderr || "Compilation failed",
                });
                return;
            }

            const marker = "===TEST_OUTPUT===";
            const idx = stdout.indexOf(marker);

            if (idx === -1) {
                resolve({
                    compiled: false,
                    error: "Test output marker not found",
                });
                return;
            }

            const afterMarker = stdout.slice(idx + marker.length);
            const lastBrace = afterMarker.lastIndexOf("}");

            if (lastBrace === -1) {
                resolve({
                    compiled: false,
                    error: "Invalid test output JSON",
                });
                return;
            }

            const jsonStr = afterMarker.slice(0, lastBrace + 1).trim();

            try {
                const parsed = JSON.parse(jsonStr);
                resolve({
                    compiled: true,
                    tests: parsed.tests,
                });
            } catch (e) {
                resolve({
                    compiled: false,
                    error: "Failed to parse test output JSON",
                });
            }
        });
    });
}

