import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function resolveBasePath() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true'

  if (!isGitHubPagesBuild || !repo) {
    return '/'
  }

  return repo.endsWith('.github.io') ? '/' : `/${repo}/`
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [react()],
})
