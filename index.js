import * as core from '@actions/core';
import fetch from 'node-fetch';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function run() {
    try {
        const url = core.getInput('url');
        const maxAttempts = parseInt(core.getInput('max_attempts')) || 10;
        const delaySeconds = parseInt(core.getInput('delay')) || 1;

        core.info(`Waiting for ${url} (up to ${maxAttempts} attempts)...`);

        for (let i = 1; i <= maxAttempts; i++) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    core.info(`✅ Success: Received status ${response.status}`);
                    return;
                } else {
                    core.warning(`⚠️ Attempt ${i}: Received status ${response.status}`);
                }
            } catch (error) {
                core.warning(`⏳ Attempt ${i}: ${error.message}`);
            }

            if (i < maxAttempts) {
                await delay(delaySeconds * 1000);
            }
        }

        core.setFailed(`❌ Timed out waiting for ${url}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

