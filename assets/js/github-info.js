const username = 'sagoresarker';
const repo = 'sagoresarker.github.io';

async function fetchLatestCommitHash() {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits/main`);
        const data = await response.json();
        const latestCommitHash = data.sha.substring(0, 7);
        document.getElementById('latest-commit-hash').textContent = latestCommitHash;
    } catch (error) {
        console.error('Error fetching latest commit hash:', error);
    }
}

async function fetchLastBuildTime() {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/actions/runs?per_page=1`);
        const data = await response.json();
        const lastBuildTime = new Date(data.workflow_runs[0].created_at).toLocaleString();
        document.getElementById('last-build-time').textContent = lastBuildTime;
    } catch (error) {
        console.error('Error fetching last build time:', error);
    }
}

async function fetchLatestCommitTime() {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits/main`);
        const data = await response.json();
        const latestCommitTime = new Date(data.commit.committer.date).toLocaleString();
        document.getElementById('latest-commit-time').textContent = latestCommitTime;
    } catch (error) {
        console.error('Error fetching latest commit time:', error);
    }
}

fetchLatestCommitHash();
fetchLastBuildTime();
fetchLatestCommitTime();
